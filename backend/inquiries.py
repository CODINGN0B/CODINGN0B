"""Project inquiry workflow: validation, attachment storage, persistence, email notification."""
import os
import re
import time
import uuid
import asyncio
import hashlib
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, HTTPException, Request, Response, UploadFile
from pydantic import BaseModel, EmailStr, Field, field_validator

from db import db
from auth import User, get_current_user, require_admin
from storage import APP_NAME, put_object, get_object
from emailer import send_email, internal_inquiry_email, customer_inquiry_email

load_dotenv(Path(__file__).parent / '.env')
logger = logging.getLogger(__name__)

router = APIRouter(tags=["inquiries"])

COMPANY_EMAIL = os.environ["CONTACT_EMAIL"]
MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_MB", "25")) * 1024 * 1024
ALLOWED_EXT = {"pdf", "dwg", "dxf", "step", "stp", "stl", "zip", "igs", "iges", "png", "jpg", "jpeg"}
MIME_BY_EXT = {
    "pdf": "application/pdf", "zip": "application/zip",
    "dwg": "image/vnd.dwg", "dxf": "image/vnd.dxf",
    "step": "model/step", "stp": "model/step", "stl": "model/stl",
    "igs": "model/iges", "iges": "model/iges",
    "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
}
MAX_FILES_PER_INQUIRY = 8

SERVICES = {
    "cnc-machining": "CNC Machining",
    "precision-metal-stamping": "Precision Metal Stamping",
    "tooling": "Tooling / CNC Tooling",
    "plastic-injection-moulding": "Plastic Injection Moulding",
    "other": "Other / Not sure yet",
}

# --- lightweight abuse protection (per-process, no external dependency) ---
RATE_WINDOW_SECONDS = 3600
RATE_MAX_PER_WINDOW = 6
UPLOAD_MAX_PER_WINDOW = 40
DUPLICATE_WINDOW_SECONDS = 180
_hits: dict[str, list[float]] = {}
_recent: dict[str, float] = {}


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _rate_limit(key: str, limit: int) -> None:
    now = time.time()
    hits = [t for t in _hits.get(key, []) if now - t < RATE_WINDOW_SECONDS]
    if len(hits) >= limit:
        raise HTTPException(status_code=429, detail="Too many submissions. Please try again later.")
    hits.append(now)
    _hits[key] = hits


class InquiryFile(BaseModel):
    file_id: str
    filename: str
    size: int
    content_type: str = "application/octet-stream"


class InquiryCreate(BaseModel):
    contact_name: str = Field(min_length=2, max_length=120)
    company: str = Field(min_length=1, max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=60)
    service: str
    description: str = Field(min_length=10, max_length=5000)
    quantity: Optional[str] = Field(default="", max_length=120)
    timeline: Optional[str] = Field(default="", max_length=120)
    consent: bool
    file_ids: List[str] = []
    # honeypot: real visitors never see or fill this field
    website: Optional[str] = Field(default="", max_length=200)

    @field_validator("service")
    @classmethod
    def known_service(cls, v):
        if v not in SERVICES:
            raise ValueError("Select one of the listed services")
        return v

    @field_validator("consent")
    @classmethod
    def consent_given(cls, v):
        if v is not True:
            raise ValueError("Consent is required before the inquiry can be submitted")
        return v

    @field_validator("file_ids")
    @classmethod
    def limit_files(cls, v):
        if len(v) > MAX_FILES_PER_INQUIRY:
            raise ValueError(f"A maximum of {MAX_FILES_PER_INQUIRY} files can be attached")
        return v


class Inquiry(BaseModel):
    id: str
    contact_name: str
    company: str
    email: str
    phone: str = ""
    service: str
    service_label: str
    description: str
    quantity: str = ""
    timeline: str = ""
    consent: bool = True
    files: List[InquiryFile] = []
    status: str = "new"
    created_at: str
    email_status: str = "pending"
    email_error: str = ""


@router.post("/inquiries/uploads", response_model=InquiryFile)
async def upload_attachment(request: Request, file: UploadFile = File(...)):
    _rate_limit(f"upload:{_client_ip(request)}", UPLOAD_MAX_PER_WINDOW)
    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if "." in (file.filename or "") else ""
    if ext not in ALLOWED_EXT:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXT)).upper()}",
        )
    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="File is empty")
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds the {MAX_UPLOAD_BYTES // (1024 * 1024)} MB limit",
        )

    file_id = uuid.uuid4().hex
    content_type = MIME_BY_EXT.get(ext, file.content_type or "application/octet-stream")
    path = f"{APP_NAME}/inquiry-uploads/{file_id}.{ext}"
    try:
        result = await asyncio.to_thread(put_object, path, data, content_type)
    except Exception as e:
        logger.error(f"Attachment upload failed: {e}")
        raise HTTPException(status_code=502, detail="File storage is temporarily unavailable")

    record = InquiryFile(file_id=file_id, filename=file.filename,
                         size=result.get("size", len(data)), content_type=content_type)
    await db.inquiry_files.insert_one({
        **record.model_dump(),
        "storage_path": result["path"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return record


@router.post("/inquiries", response_model=Inquiry, status_code=201)
async def create_inquiry(payload: InquiryCreate, request: Request):
    if (payload.website or "").strip():
        # silent-ish rejection for bots that fill the honeypot
        raise HTTPException(status_code=400, detail="Submission rejected")

    ip = _client_ip(request)
    _rate_limit(f"inquiry:{ip}", RATE_MAX_PER_WINDOW)

    fingerprint = hashlib.sha256(
        f"{payload.email.lower()}|{payload.description.strip()}".encode()
    ).hexdigest()
    now_ts = time.time()
    last = _recent.get(fingerprint)
    if last and now_ts - last < DUPLICATE_WINDOW_SECONDS:
        raise HTTPException(status_code=409, detail="This inquiry has already been submitted.")
    _recent[fingerprint] = now_ts

    files: List[InquiryFile] = []
    for file_id in payload.file_ids:
        doc = await db.inquiry_files.find_one({"file_id": file_id, "is_deleted": False}, {"_id": 0})
        if doc:
            files.append(InquiryFile(**{k: doc[k] for k in ("file_id", "filename", "size", "content_type")}))

    created_at = datetime.now(timezone.utc)
    inquiry = Inquiry(
        id=f"YF-{created_at.strftime('%y%m')}-{uuid.uuid4().hex[:5].upper()}",
        **payload.model_dump(exclude={"file_ids", "website"}),
        service_label=SERVICES[payload.service],
        files=files,
        created_at=created_at.isoformat(timespec="seconds"),
    )
    doc = inquiry.model_dump()

    # Persist first — the acknowledgement is only sent once the record is safely stored.
    try:
        await db.inquiries.insert_one(dict(doc))
    except Exception as e:
        _recent.pop(fingerprint, None)
        logger.error(f"Inquiry save failed: {e}")
        raise HTTPException(status_code=503, detail="Could not save your inquiry. Please try again.")

    await db.inquiry_files.update_many({"file_id": {"$in": payload.file_ids}},
                                      {"$set": {"inquiry_id": inquiry.id}})

    # Recipients come from server-side config / the stored record; bodies from fixed templates.
    internal_subject, internal_html = internal_inquiry_email(doc)
    customer_subject, customer_html = customer_inquiry_email(doc)
    results = await asyncio.gather(
        send_email(to=COMPANY_EMAIL, subject=internal_subject, html=internal_html,
                   reply_to=inquiry.email),
        send_email(to=inquiry.email, subject=customer_subject, html=customer_html),
        return_exceptions=True,
    )
    inquiry.email_status, inquiry.email_error = _email_outcome(results, inquiry.id)
    await db.inquiries.update_one(
        {"id": inquiry.id},
        {"$set": {"email_status": inquiry.email_status, "email_error": inquiry.email_error}},
    )
    return inquiry


def _email_outcome(results, inquiry_id: str) -> tuple[str, str]:
    """Delivery never blocks the saved inquiry — the outcome is recorded instead."""
    labels = ("company notification", "customer acknowledgement")
    failures = [f"{labels[i]}: {r}" for i, r in enumerate(results) if isinstance(r, Exception)]
    if not failures:
        return "sent", ""
    logger.error(f"Inquiry {inquiry_id}: email notification failed: {failures}")
    status = "failed" if len(failures) == len(results) else "partial"
    return status, " | ".join(failures)[:300]


@router.post("/inquiries/{inquiry_id}/resend-notification", response_model=Inquiry)
async def resend_notification(inquiry_id: str, admin: User = Depends(require_admin)):
    """Re-send both emails for a stored inquiry (used after fixing the company inbox)."""
    doc = await db.inquiries.find_one({"id": inquiry_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    internal_subject, internal_html = internal_inquiry_email(doc)
    customer_subject, customer_html = customer_inquiry_email(doc)
    results = await asyncio.gather(
        send_email(to=COMPANY_EMAIL, subject=internal_subject, html=internal_html,
                   reply_to=doc["email"]),
        send_email(to=doc["email"], subject=customer_subject, html=customer_html),
        return_exceptions=True,
    )
    status, error = _email_outcome(results, inquiry_id)
    updated = await db.inquiries.find_one_and_update(
        {"id": inquiry_id}, {"$set": {"email_status": status, "email_error": error}},
        projection={"_id": 0}, return_document=True,
    )
    return Inquiry(**updated)


@router.get("/inquiries", response_model=List[Inquiry])
async def list_inquiries(admin: User = Depends(require_admin)):
    docs = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Inquiry(**d) for d in docs]


@router.get("/inquiries/mine", response_model=List[Inquiry])
async def my_inquiries(user: User = Depends(get_current_user)):
    docs = await db.inquiries.find(
        {"email": {"$regex": f"^{re.escape(user.email)}$", "$options": "i"}}, {"_id": 0}
    ).sort("created_at", -1).to_list(200)
    return [Inquiry(**d) for d in docs]


@router.get("/inquiries/files/{file_id}")
async def download_attachment(file_id: str, admin: User = Depends(require_admin)):
    record = await db.inquiry_files.find_one({"file_id": file_id, "is_deleted": False}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    try:
        data, content_type = await asyncio.to_thread(get_object, record["storage_path"])
    except Exception as e:
        logger.error(f"Attachment download failed: {e}")
        raise HTTPException(status_code=502, detail="File storage is temporarily unavailable")
    return Response(
        content=data,
        media_type=record.get("content_type", content_type),
        headers={"Content-Disposition": f'attachment; filename="{record["filename"]}"'},
    )


class StatusIn(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def allowed(cls, v):
        if v not in {"new", "reviewing", "quoted", "closed"}:
            raise ValueError("Invalid status")
        return v


@router.patch("/inquiries/{inquiry_id}", response_model=Inquiry)
async def update_status(inquiry_id: str, payload: StatusIn, admin: User = Depends(require_admin)):
    result = await db.inquiries.find_one_and_update(
        {"id": inquiry_id}, {"$set": {"status": payload.status}},
        projection={"_id": 0}, return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return Inquiry(**result)

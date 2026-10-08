"""Quote request workflow: validation, storage of attachments, persistence, email notification."""
import os
import re
import uuid
import asyncio
import logging
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile
from pydantic import BaseModel, EmailStr, Field, field_validator

from db import db
from auth import User, get_current_user, require_admin
from storage import APP_NAME, put_object, get_object
from emailer import send_email, internal_quote_email, customer_quote_email

load_dotenv(Path(__file__).parent / '.env')
logger = logging.getLogger(__name__)

router = APIRouter(tags=["quotes"])

COMPANY_EMAIL = os.environ["COMPANY_NOTIFICATION_EMAIL"]
MAX_UPLOAD_BYTES = int(os.environ.get("MAX_UPLOAD_MB", "25")) * 1024 * 1024
ALLOWED_EXT = {"pdf", "dwg", "dxf", "step", "stp", "stl", "zip", "igs", "iges"}
MIME_BY_EXT = {
    "pdf": "application/pdf", "zip": "application/zip",
    "dwg": "image/vnd.dwg", "dxf": "image/vnd.dxf",
    "step": "model/step", "stp": "model/step", "stl": "model/stl",
    "igs": "model/iges", "iges": "model/iges",
}
MAX_FILES_PER_QUOTE = 8


class QuoteFile(BaseModel):
    file_id: str
    filename: str
    size: int
    content_type: str = "application/octet-stream"


class QuoteCreate(BaseModel):
    company: str = Field(min_length=1, max_length=200)
    contact_name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default="", max_length=60)
    project: str = Field(min_length=1, max_length=300)
    quantity: str = Field(min_length=1, max_length=120)
    material: Optional[str] = Field(default="", max_length=200)
    requirements: Optional[str] = Field(default="", max_length=2000)
    message: Optional[str] = Field(default="", max_length=5000)
    file_ids: List[str] = []

    @field_validator("file_ids")
    @classmethod
    def limit_files(cls, v):
        if len(v) > MAX_FILES_PER_QUOTE:
            raise ValueError(f"A maximum of {MAX_FILES_PER_QUOTE} files can be attached")
        return v


class Quote(BaseModel):
    id: str
    company: str
    contact_name: str
    email: str
    phone: str = ""
    project: str
    quantity: str
    material: str = ""
    requirements: str = ""
    message: str = ""
    files: List[QuoteFile] = []
    status: str = "new"
    created_at: str
    email_status: str = "pending"


@router.post("/quote-requests/uploads", response_model=QuoteFile)
async def upload_attachment(file: UploadFile = File(...)):
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
    path = f"{APP_NAME}/quote-uploads/{file_id}.{ext}"
    try:
        result = await asyncio.to_thread(put_object, path, data, content_type)
    except Exception as e:
        logger.error(f"Attachment upload failed: {e}")
        raise HTTPException(status_code=502, detail="File storage is temporarily unavailable")

    record = QuoteFile(file_id=file_id, filename=file.filename, size=result.get("size", len(data)),
                       content_type=content_type)
    await db.quote_files.insert_one({
        **record.model_dump(),
        "storage_path": result["path"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return record


@router.post("/quote-requests", response_model=Quote, status_code=201)
async def create_quote(payload: QuoteCreate):
    files: List[QuoteFile] = []
    for file_id in payload.file_ids:
        doc = await db.quote_files.find_one({"file_id": file_id, "is_deleted": False}, {"_id": 0})
        if doc:
            files.append(QuoteFile(**{k: doc[k] for k in ("file_id", "filename", "size", "content_type")}))

    created_at = datetime.now(timezone.utc)
    quote = Quote(
        id=f"YF-{created_at.strftime('%y%m')}-{uuid.uuid4().hex[:5].upper()}",
        **payload.model_dump(exclude={"file_ids"}),
        files=files,
        created_at=created_at.isoformat(timespec="seconds"),
    )
    doc = quote.model_dump()
    await db.quote_requests.insert_one(dict(doc))
    await db.quote_files.update_many({"file_id": {"$in": payload.file_ids}},
                                     {"$set": {"quote_id": quote.id}})

    # Recipients come from server-side config / the stored record, bodies from fixed templates.
    internal_subject, internal_html = internal_quote_email(doc)
    customer_subject, customer_html = customer_quote_email(doc)
    results = await asyncio.gather(
        send_email(to=COMPANY_EMAIL, subject=internal_subject, html=internal_html,
                   reply_to=quote.email),
        send_email(to=quote.email, subject=customer_subject, html=customer_html),
        return_exceptions=True,
    )
    failures = [r for r in results if isinstance(r, Exception)]
    quote.email_status = "sent" if not failures else "failed"
    if failures:
        logger.error(f"Quote {quote.id}: email notification failed: {failures}")
    await db.quote_requests.update_one({"id": quote.id},
                                       {"$set": {"email_status": quote.email_status}})
    return quote


@router.get("/quote-requests", response_model=List[Quote])
async def list_quotes(admin: User = Depends(require_admin)):
    docs = await db.quote_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Quote(**d) for d in docs]


@router.get("/quote-requests/mine", response_model=List[Quote])
async def my_quotes(user: User = Depends(get_current_user)):
    """Signed-in visitors can track the requests they submitted with their own email."""
    docs = await db.quote_requests.find(
        {"email": {"$regex": f"^{re.escape(user.email)}$", "$options": "i"}}, {"_id": 0}
    ).sort("created_at", -1).to_list(200)
    return [Quote(**d) for d in docs]


@router.get("/quote-requests/files/{file_id}")
async def download_attachment(file_id: str, admin: User = Depends(require_admin)):
    record = await db.quote_files.find_one({"file_id": file_id, "is_deleted": False}, {"_id": 0})
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


@router.patch("/quote-requests/{quote_id}", response_model=Quote)
async def update_status(quote_id: str, payload: StatusIn, admin: User = Depends(require_admin)):
    result = await db.quote_requests.find_one_and_update(
        {"id": quote_id}, {"$set": {"status": payload.status}},
        projection={"_id": 0}, return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Quote request not found")
    return Quote(**result)

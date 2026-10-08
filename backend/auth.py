"""Emergent-managed Google authentication (session exchange, session cookie, admin gate)."""
import os
import uuid
import logging
import httpx
from pathlib import Path
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel

from db import db

load_dotenv(Path(__file__).parent / '.env')
logger = logging.getLogger(__name__)

SESSION_DATA_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"
SESSION_DAYS = 7
ADMIN_EMAILS = {e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "").split(",") if e.strip()}

router = APIRouter(prefix="/auth", tags=["auth"])


class User(BaseModel):
    user_id: str
    email: str
    name: str
    picture: str = ""
    is_admin: bool = False


def _is_admin(email: str) -> bool:
    return email.lower() in ADMIN_EMAILS


async def _token_from_request(request: Request) -> str | None:
    token = request.cookies.get("session_token")
    if token:
        return token
    header = request.headers.get("authorization") or ""
    if header.lower().startswith("bearer "):
        return header[7:].strip()
    return None


async def get_current_user(request: Request) -> User:
    token = await _token_from_request(request)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    user_doc = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=401, detail="User not found")
    return User(
        user_id=user_doc["user_id"],
        email=user_doc["email"],
        name=user_doc.get("name", ""),
        picture=user_doc.get("picture", ""),
        is_admin=_is_admin(user_doc["email"]),
    )


async def require_admin(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Administrator access required")
    return user


class SessionIn(BaseModel):
    session_id: str


@router.post("/session", response_model=User)
async def create_session(payload: SessionIn, response: Response):
    """Exchange the one-time session_id from the Emergent auth redirect for a session cookie."""
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(SESSION_DATA_URL, headers={"X-Session-ID": payload.session_id})
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"Auth session exchange failed: {e}")
        raise HTTPException(status_code=401, detail="Could not verify sign-in session")

    email = data["email"]
    now = datetime.now(timezone.utc)
    existing = await db.users.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        await db.users.update_one(
            {"user_id": user_id},
            {"$set": {"name": data.get("name", ""), "picture": data.get("picture", ""),
                      "last_login": now.isoformat()}},
        )
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": email,
            "name": data.get("name", ""),
            "picture": data.get("picture", ""),
            "created_at": now.isoformat(),
            "last_login": now.isoformat(),
        })

    session_token = data["session_token"]
    expires_at = now + timedelta(days=SESSION_DAYS)
    await db.user_sessions.update_one(
        {"session_token": session_token},
        {"$set": {"user_id": user_id, "session_token": session_token,
                  "expires_at": expires_at.isoformat(), "created_at": now.isoformat()}},
        upsert=True,
    )
    response.set_cookie(
        key="session_token", value=session_token, httponly=True, secure=True,
        samesite="none", path="/", max_age=SESSION_DAYS * 24 * 60 * 60,
    )
    return User(user_id=user_id, email=email, name=data.get("name", ""),
                picture=data.get("picture", ""), is_admin=_is_admin(email))


@router.get("/me", response_model=User)
async def me(user: User = Depends(get_current_user)):
    return user


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = await _token_from_request(request)
    if token:
        await db.user_sessions.delete_many({"session_token": token})
    response.delete_cookie("session_token", path="/", secure=True, samesite="none")
    return {"status": "signed_out"}

"""Regression tests for the Yue Fung project-inquiry API.

Run with:  cd /app && python -m pytest backend/tests -q
Requires the backend supervisor service to be running and the seeded test sessions
documented in /app/memory/test_credentials.md.
"""
import io
import pytest
import requests
from pathlib import Path
from dotenv import dotenv_values

FRONTEND_ENV = dotenv_values(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE = FRONTEND_ENV["REACT_APP_BACKEND_URL"].rstrip("/") + "/api"
ADMIN = {"Authorization": "Bearer test_session_admin_yuefung"}
VISITOR = {"Authorization": "Bearer test_session_visitor_yuefung"}

VALID = {
    "contact_name": "Regression Bot",
    "company": "Pytest Industrial Ltd.",
    "email": "delivered@resend.dev",
    "phone": "+852 0000 0000",
    "service": "precision-metal-stamping",
    "description": "Automated regression inquiry for a stamped bracket, zinc plated.",
    "quantity": "1,000 pcs",
    "timeline": "Samples in 6 weeks",
    "consent": True,
}


def test_root():
    assert requests.get(f"{BASE}/").status_code == 200


def test_upload_rejects_unsupported_extension():
    files = {"file": ("virus.exe", io.BytesIO(b"x"), "application/octet-stream")}
    assert requests.post(f"{BASE}/inquiries/uploads", files=files).status_code == 400


def test_required_field_validation():
    bad = {**VALID, "email": "not-an-email"}
    assert requests.post(f"{BASE}/inquiries", json=bad).status_code == 422
    short = {**VALID, "description": "too short"}
    assert requests.post(f"{BASE}/inquiries", json=short).status_code == 422
    unknown_service = {**VALID, "service": "laser-cutting"}
    assert requests.post(f"{BASE}/inquiries", json=unknown_service).status_code == 422


def test_consent_is_mandatory():
    assert requests.post(f"{BASE}/inquiries", json={**VALID, "consent": False}).status_code == 422


def test_honeypot_blocks_bots():
    payload = {**VALID, "email": "bot@resend.dev", "website": "http://spam.example"}
    assert requests.post(f"{BASE}/inquiries", json=payload).status_code == 400


@pytest.fixture(scope="module")
def submitted_inquiry():
    files = {"file": ("drawing.pdf", io.BytesIO(b"%PDF-1.4 regression"), "application/pdf")}
    up = requests.post(f"{BASE}/inquiries/uploads", files=files)
    assert up.status_code == 200, up.text
    file_id = up.json()["file_id"]

    res = requests.post(f"{BASE}/inquiries", json={**VALID, "file_ids": [file_id]})
    assert res.status_code == 201, res.text
    return res.json()


def test_inquiry_created_with_reference_and_attachment(submitted_inquiry):
    assert submitted_inquiry["id"].startswith("YF-")
    assert submitted_inquiry["service_label"] == "Precision Metal Stamping"
    assert len(submitted_inquiry["files"]) == 1
    assert submitted_inquiry["email_status"] == "sent"


def test_duplicate_submission_is_rejected(submitted_inquiry):
    again = requests.post(f"{BASE}/inquiries", json=VALID)
    assert again.status_code == 409


def test_admin_can_list_and_download(submitted_inquiry):
    res = requests.get(f"{BASE}/inquiries", headers=ADMIN)
    assert res.status_code == 200
    assert any(q["id"] == submitted_inquiry["id"] for q in res.json())

    file_id = submitted_inquiry["files"][0]["file_id"]
    dl = requests.get(f"{BASE}/inquiries/files/{file_id}", headers=ADMIN)
    assert dl.status_code == 200
    assert dl.content == b"%PDF-1.4 regression"


def test_admin_can_update_status(submitted_inquiry):
    res = requests.patch(f"{BASE}/inquiries/{submitted_inquiry['id']}",
                         json={"status": "quoted"}, headers=ADMIN)
    assert res.status_code == 200 and res.json()["status"] == "quoted"
    bad = requests.patch(f"{BASE}/inquiries/{submitted_inquiry['id']}",
                         json={"status": "nonsense"}, headers=ADMIN)
    assert bad.status_code == 422


def test_access_control():
    assert requests.get(f"{BASE}/inquiries").status_code == 401
    assert requests.get(f"{BASE}/inquiries", headers=VISITOR).status_code == 403
    mine = requests.get(f"{BASE}/inquiries/mine", headers=VISITOR)
    assert mine.status_code == 200 and isinstance(mine.json(), list)


def test_auth_me():
    me = requests.get(f"{BASE}/auth/me", headers=ADMIN)
    assert me.status_code == 200 and me.json()["is_admin"] is True

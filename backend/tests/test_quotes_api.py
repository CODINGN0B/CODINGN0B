"""Regression tests for the Yue Fung quote-request API.

Run with:  cd /app && python -m pytest backend/tests -q
Requires the backend supervisor service to be running and the seeded test sessions
documented in /app/memory/test_credentials.md.
"""
import io
import os
import pytest
import requests
from pathlib import Path
from dotenv import dotenv_values

FRONTEND_ENV = dotenv_values(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE = FRONTEND_ENV["REACT_APP_BACKEND_URL"].rstrip("/") + "/api"
ADMIN = {"Authorization": "Bearer test_session_admin_yuefung"}
VISITOR = {"Authorization": "Bearer test_session_visitor_yuefung"}


def test_root():
    assert requests.get(f"{BASE}/").status_code == 200


def test_upload_rejects_unsupported_extension():
    files = {"file": ("virus.exe", io.BytesIO(b"x"), "application/octet-stream")}
    assert requests.post(f"{BASE}/quote-requests/uploads", files=files).status_code == 400


def test_quote_validation():
    bad = {"company": "", "contact_name": "A", "email": "not-an-email",
           "project": "P", "quantity": "1"}
    assert requests.post(f"{BASE}/quote-requests", json=bad).status_code == 422


@pytest.fixture(scope="module")
def submitted_quote():
    files = {"file": ("drawing.pdf", io.BytesIO(b"%PDF-1.4 regression"), "application/pdf")}
    up = requests.post(f"{BASE}/quote-requests/uploads", files=files)
    assert up.status_code == 200, up.text
    file_id = up.json()["file_id"]

    payload = {
        "company": "Pytest Industrial Ltd.", "contact_name": "Regression Bot",
        "email": "delivered@resend.dev", "phone": "+852 0000 0000",
        "project": "Regression bracket", "quantity": "1,000 pcs",
        "material": "SPCC", "requirements": "Zinc plated",
        "message": "Automated regression run.", "file_ids": [file_id],
    }
    res = requests.post(f"{BASE}/quote-requests", json=payload)
    assert res.status_code == 201, res.text
    return res.json()


def test_quote_created_with_reference_and_attachment(submitted_quote):
    assert submitted_quote["id"].startswith("YF-")
    assert len(submitted_quote["files"]) == 1
    assert submitted_quote["email_status"] == "sent"


def test_admin_can_list_and_download(submitted_quote):
    res = requests.get(f"{BASE}/quote-requests", headers=ADMIN)
    assert res.status_code == 200
    assert any(q["id"] == submitted_quote["id"] for q in res.json())

    file_id = submitted_quote["files"][0]["file_id"]
    dl = requests.get(f"{BASE}/quote-requests/files/{file_id}", headers=ADMIN)
    assert dl.status_code == 200
    assert dl.content == b"%PDF-1.4 regression"


def test_admin_can_update_status(submitted_quote):
    res = requests.patch(f"{BASE}/quote-requests/{submitted_quote['id']}",
                         json={"status": "quoted"}, headers=ADMIN)
    assert res.status_code == 200 and res.json()["status"] == "quoted"
    bad = requests.patch(f"{BASE}/quote-requests/{submitted_quote['id']}",
                         json={"status": "nonsense"}, headers=ADMIN)
    assert bad.status_code == 422


def test_access_control():
    assert requests.get(f"{BASE}/quote-requests").status_code == 401
    assert requests.get(f"{BASE}/quote-requests", headers=VISITOR).status_code == 403
    mine = requests.get(f"{BASE}/quote-requests/mine", headers=VISITOR)
    assert mine.status_code == 200 and isinstance(mine.json(), list)


def test_auth_me():
    me = requests.get(f"{BASE}/auth/me", headers=ADMIN)
    assert me.status_code == 200 and me.json()["is_admin"] is True

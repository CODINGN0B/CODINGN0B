"""Transactional email via Emergent's managed email integration."""
import os
import re
import ipaddress
import logging
import httpx
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pathlib import Path
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv(Path(__file__).parent / '.env')
logger = logging.getLogger(__name__)

# Emergent managed email proxy. This is a CONSTANT — never read it from
# os.environ, so it survives deployment.
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
EMAIL_REPLY_TO = os.environ.get("EMAIL_REPLY_TO")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str, reply_to: str | None = None) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    if reply_to or EMAIL_REPLY_TO:
        payload["contact_email"] = reply_to or EMAIL_REPLY_TO
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
        return resp.json().get("id")
    except httpx.HTTPStatusError as e:
        try:
            code = e.response.json().get("code", "")
            message = e.response.json().get("message", "")
        except ValueError:
            code, message = "", ""
        if code in ("insufficient_credits", "integration_disabled", "daily_limit_reached"):
            logger.warning(f"Email paused: {code} ({e.response.status_code}): {message}")
            raise HTTPException(status_code=503, detail="Email is temporarily unavailable")
        logger.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        raise HTTPException(status_code=502, detail="Failed to send email")
    except Exception as e:
        logger.error(f"Email send error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email")


# ---------------------------------------------------------------- templates
_WRAP_OPEN = (
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
    'style="background:#f4f5f7;padding:24px 0"><tr><td align="center">'
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" '
    'style="width:600px;max-width:100%;background:#ffffff;border:1px solid #e3e5e8">'
    '<tr><td style="background:#121417;padding:22px 28px">'
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:17px;letter-spacing:3px;'
    'color:#ffffff;font-weight:bold">YUE FUNG</div>'
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2px;'
    'color:#8d99a6;margin-top:5px">PRECISION PRODUCT CO. LTD.</div>'
    '</td></tr><tr><td style="padding:28px;font-family:Arial,Helvetica,sans-serif;'
    'font-size:14px;line-height:1.65;color:#20242a">'
)
_WRAP_CLOSE = (
    '</td></tr><tr><td style="padding:18px 28px;background:#f8f9fa;border-top:1px solid #e3e5e8;'
    'font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#79828d">'
    'Sent by Yue Fung Precision Product Co. Ltd. &middot; Hong Kong office: Unit 308, 3/F Fook Hong '
    'Industrial Building, 19 Sheung Yuet Road, Kowloon Bay, Kowloon, Hong Kong &middot; Manufacturing: '
    'No. 178 Xin Cheng Industrial District, Tian Keng, Heng Lik Zhen, Dongguan, China &middot; '
    'Established in Hong Kong, 1984.<br>'
    'We never ask for passwords or payment details by email.'
    '</td></tr></table></td></tr></table>'
)


def _row(label: str, value: str) -> str:
    return (
        f'<tr><td style="padding:7px 0;border-bottom:1px solid #eceef1;font-size:11px;'
        f'letter-spacing:1px;color:#79828d;text-transform:uppercase;width:38%;'
        f'vertical-align:top">{escape(label)}</td>'
        f'<td style="padding:7px 0;border-bottom:1px solid #eceef1;color:#20242a">'
        f'{escape(value or "—")}</td></tr>'
    )


def internal_inquiry_email(inquiry: dict) -> tuple[str, str]:
    """Internal notification for the company inbox. Server-side template only."""
    files = inquiry.get("files") or []
    file_list = (
        "".join(
            f'<li style="margin-bottom:4px">{escape(f.get("filename", ""))} '
            f'({round((f.get("size") or 0) / 1024)} KB)</li>'
            for f in files
        )
        or '<li style="color:#79828d">No files attached</li>'
    )
    rows = "".join([
        _row("Reference ID", inquiry.get("id", "")),
        _row("Received", inquiry.get("created_at", "")),
        _row("Company", inquiry.get("company", "")),
        _row("Contact", inquiry.get("contact_name", "")),
        _row("Email", inquiry.get("email", "")),
        _row("Phone", inquiry.get("phone", "")),
        _row("Interested service", inquiry.get("service_label", "")),
        _row("Approximate quantity", inquiry.get("quantity", "")),
        _row("Target timeline", inquiry.get("timeline", "")),
        _row("Consent to processing", "Given" if inquiry.get("consent") else "Not given"),
    ])
    html = (
        _WRAP_OPEN
        + '<div style="font-size:12px;letter-spacing:2px;color:#a9854f;font-weight:bold">'
        'NEW PROJECT INQUIRY</div>'
        '<h1 style="font-size:20px;margin:8px 0 18px">Reference '
        f'{escape(inquiry.get("id", ""))}</h1>'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        f'style="font-size:14px">{rows}</table>'
        '<p style="font-size:11px;letter-spacing:1px;color:#79828d;text-transform:uppercase;'
        'margin:22px 0 6px">Project description and requirements</p>'
        f'<div style="white-space:pre-wrap">{escape(inquiry.get("description") or "—")}</div>'
        '<p style="font-size:11px;letter-spacing:1px;color:#79828d;text-transform:uppercase;'
        'margin:22px 0 6px">Attachments</p>'
        f'<ul style="margin:0;padding-left:18px">{file_list}</ul>'
        '<p style="color:#79828d;font-size:12px;margin-top:22px">Attachments are stored with this '
        'inquiry and can be downloaded from the internal inquiries dashboard.</p>'
        + _WRAP_CLOSE
    )
    subject = f"NEW PROJECT INQUIRY \u2014 YUE FUNG \u2014 {inquiry.get('id', '')}"
    return subject, html


def customer_inquiry_email(inquiry: dict) -> tuple[str, str]:
    """Acknowledgement for the person who submitted the inquiry."""
    html = (
        _WRAP_OPEN
        + '<h1 style="font-size:19px;margin:0 0 14px">Thank you for contacting Yue Fung Metal '
        'Plastic Products Co. Ltd.</h1>'
        '<p>Your project inquiry has been received successfully.</p>'
        '<p>Our team will review your requirements and contact you shortly.</p>'
        '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" '
        'style="font-size:14px;margin-top:18px">'
        + _row("Reference ID", inquiry.get("id", ""))
        + _row("Received", inquiry.get("created_at", ""))
        + _row("Interested service", inquiry.get("service_label", ""))
        + _row("Approximate quantity", inquiry.get("quantity", ""))
        + _row("Target timeline", inquiry.get("timeline", ""))
        + '</table>'
        '<p style="color:#79828d;font-size:12px;margin-top:20px">Please keep this reference ID for '
        'future correspondence.</p>'
        + _WRAP_CLOSE
    )
    subject = f"Project inquiry received \u2014 reference {inquiry.get('id', '')}"
    return subject, html

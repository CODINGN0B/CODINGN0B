# PRD — Yue Fung Metal Plastic Products Co. Ltd.

## Company
- **Name:** Yue Fung Metal Plastic Products Co. Ltd.
- **Slogan:** Precision Engineering Aligned with Excellent Standards
- **Established:** Hong Kong, 1984
- **Manufacturing:** Xincheng Industrial District, HengLi Town, Dongguan City, Guangdong, China
- **Business inbox:** yfhk@yuefung.com (quote notifications + admin allowlist)

## Original Problem Statement (current direction, 2026-10-08)
Refine the site into a complete, production-ready premium B2B precision-manufacturing website that
reads like a serious international manufacturer — not a template or a flashy startup page. Visual
direction: premium industrial + engineering/CAD aesthetics, dark charcoal/near-black, metallic
neutral surfaces, restrained steel-blue accent, glassmorphic nav bar, large manufacturing imagery,
thin technical grid/measurement details, generous whitespace, smooth but restrained animation.
No fabricated certifications, awards, client logos, production numbers, tolerances or claims —
unknown details stay as clean editable placeholders. Real quote workflow with file upload, backend
persistence and email notification. Full responsive, accessible, SEO/OG metadata,
prefers-reduced-motion support.

### User decisions (2026-10-08)
- Business notification email: **yfhk@yuefung.com** (env var, not hardcoded in frontend).
- **Removed** the previous 3D BMW car showcase entirely (and three.js / @react-three deps).
- Stock manufacturing photography used as editable placeholders.
- Google sign-in: **admin dashboard for quote requests + public sign-in for visitors**.
- English-only copy (previous bilingual Traditional Chinese text dropped).

## Architecture
**Frontend** — React 19, Tailwind, shadcn/ui, framer-motion, lenis, react-router-dom.
- `src/App.js` — AuthProvider + router; detects `session_id` in `useLocation().hash` → `AuthCallback`.
- `src/pages/` — `Home.jsx` (lenis + section composition), `Dashboard.jsx`, `AuthCallback.jsx`.
- `src/components/` — `Navbar`, `Hero`, `About`, `Capabilities`, `Process`, `Products`, `Quality`,
  `QuoteForm`, `Contact`, `Footer`, `QuoteDetail`, `Reveal` (motion + SectionLabel).
- `src/context/AuthContext.jsx`, `src/lib/site.js` (company copy, nav, images, API base, scroll helper).
- Design tokens in `src/index.css`: `--ink #08090a`, `--surface #101214`, `--steel #4f8fd9`,
  `--hairline`; utilities `glass`, `glass-solid`, `tech-grid`, `tech-grid-fine`, `rule-ticks`,
  `surface-card`, `label-tech`. Fonts: Barlow (display), Archivo (body), JetBrains Mono (metadata).

**Backend** — FastAPI, Motor/MongoDB, all routes under `/api`.
- `server.py` (app wiring), `db.py` (client), `auth.py` (Emergent Google auth + admin allowlist),
  `quotes.py` (quote workflow), `emailer.py` (Emergent-managed Resend + guardrail gate),
  `storage.py` (Emergent object storage).
- Tests: `backend/tests/test_quotes_api.py` (pytest, 8 tests).

### API
| Method | Route | Access |
|---|---|---|
| POST | `/api/quote-requests/uploads` | public (ext + 25 MB validation) |
| POST | `/api/quote-requests` | public (creates `YF-YYMM-XXXXX`, sends both emails) |
| GET | `/api/quote-requests` | admin |
| GET | `/api/quote-requests/mine` | signed-in user (own email) |
| GET | `/api/quote-requests/files/{file_id}` | admin |
| PATCH | `/api/quote-requests/{id}` | admin (new/reviewing/quoted/closed) |
| POST | `/api/auth/session` · GET `/api/auth/me` · POST `/api/auth/logout` | auth |

### Collections
- `quote_requests`: id, company, contact_name, email, phone, project, quantity, material,
  requirements, message, files[{file_id, filename, size, content_type}], status, created_at,
  email_status.
- `quote_files`: file_id, filename, size, content_type, storage_path, quote_id, is_deleted, created_at.
- `users`: user_id, email, name, picture, created_at, last_login. `user_sessions`: user_id,
  session_token, expires_at.

### Environment (backend/.env)
`MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`,
`COMPANY_NOTIFICATION_EMAIL`, `ADMIN_EMAILS`, `EMERGENT_LLM_KEY` (object storage), `MAX_UPLOAD_MB`.

## Third-party integrations
- **Emergent-managed Resend** — internal quote notification + customer confirmation (no links in
  email bodies; guardrail gate `_assert_safe_email` on every send).
- **Emergent-managed Google Auth** — public sign-in + admin allowlist.
- **Emergent object storage** — quote attachments under `yuefung/quote-uploads/`.

## Implemented (2026-10-08)
- Full rebuild of the site in the steel-blue industrial direction; old gold/cyan theme, bilingual
  copy, 3D car showcase, bento stats, marquee, manifesto sections and `POST /api/rfq` all removed.
- Sections: hero (image + CAD markings + parallax), About + 1984→Dongguan timeline, 4 capability
  cards, 5-stage process (horizontal desktop / vertical mobile), 4 large product cards, Quality with
  three principles + editable certifications placeholder, quote form, contact CTA, footer.
- Quote workflow end-to-end: client + server validation, drag-drop upload with per-file progress,
  object storage, MongoDB persistence, reference ID, both emails (verified `email_status: sent`),
  success confirmation state.
- Dashboard: admin table + detail side panel + status updates + attachment download; signed-in
  visitors see only their own requests; signed-out users see the Google sign-in prompt.
- SEO title/description/OG/Twitter metadata; accessibility (semantic sections, labelled fields,
  focus-visible rings, aria-invalid); `prefers-reduced-motion` honoured (CSS + framer-motion + lenis).

## Verification status (2026-10-08)
- pytest 8/8 pass (`python -m pytest backend/tests -q`).
- Testing agent iteration_1: **no backend or frontend issues**; desktop 1920 + mobile 390 flows,
  validation, upload rejection, happy-path submission (ref YF-2610-45F05), admin dashboard, visitor
  access control and signed-out state all verified. Test quotes cleaned from the DB afterwards.

## Backlog
- **P1:** replace stock photography with the company's own factory/product photos; publish real
  certifications and inspection standards in the reserved Quality block; add real contact phone /
  general enquiry email once supplied.
- **P2:** admin CSV export of quote requests; status-change notification email to the customer;
  simple CMS/editable content layer; bilingual (EN/繁體) toggle if required for the HK market;
  sitemap.xml + robots.txt.

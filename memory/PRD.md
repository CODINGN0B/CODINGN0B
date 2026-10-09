# PRD — Yue Fung Metal Plastic Products Co. Ltd.

## Verified company information (use exactly; do not extend)
- **Name:** Yue Fung Metal Plastic Products Co. Ltd.
- **Slogan:** Precision Engineering Aligned with Excellent Standards
- **Established:** Hong Kong, 1984
- **Manufacturing:** Xincheng Industrial District, HengLi Town, Dongguan City, GuangDong, China
- **Inquiry inbox:** yfhk@yuefung.com (env var `COMPANY_NOTIFICATION_EMAIL`; also the admin allowlist)
- Nothing else is confirmed. No certifications, awards, clients, production figures, factory size,
  export markets, employee counts, machinery specs, tolerances or materials may be published.

## Phase 1 objective (current, 2026-10-09)
An intuitive, modern, responsive corporate website that communicates precision engineering,
manufacturing expertise, professional reliability and premium industrial quality — custom-designed,
not a template. Phase 1 delivers the public portfolio plus a reliable customer inquiry system, with
the architecture left open for a future customer portal (login, order tracking, invoices, documents,
staff dashboard, AI-assisted inquiry handling). **Invoices / auto-invoicing are explicitly out of
scope for Phase 1** (user instruction, 2026-10-09).

### Design direction (Phase 1)
Premium industrial, inspired by white gold and precision instruments. Royal white / porcelain /
ivory backgrounds, graphite text, pale grey secondary surfaces, muted champagne gold used only on
CTAs, active nav states, hairlines and small details. Translucent white glass navbar with backdrop
blur. Fonts: Outfit (display), Manrope (body), JetBrains Mono (technical labels). Restrained motion
only; `prefers-reduced-motion` honoured.

### User decisions
- 2026-10-08: notification inbox yfhk@yuefung.com; 3D car showcase removed; stock photography as
  editable placeholders; Google sign-in for an internal inquiry dashboard; English-only copy.
- 2026-10-09: public nav **must not** show a Sign in button (funnel attention to the inquiry CTA) —
  `/dashboard` stays reachable by direct URL; unconfirmed content carries visible gold
  "[PLACEHOLDER — FOR OWNER REVIEW]" tags; `/privacy` stub page created; no invoicing in Phase 1.

## Architecture
**Frontend** — React 19, Tailwind, shadcn/ui, framer-motion, lenis, react-router-dom.
- `src/App.js` — AuthProvider + routes `/`, `/dashboard`, `/privacy`; `session_id` in
  `useLocation().hash` → `AuthCallback`.
- `src/pages/` — `Home.jsx` (lenis, section composition, `prefillService` state), `Dashboard.jsx`,
  `Privacy.jsx`, `AuthCallback.jsx`.
- `src/components/` — `Navbar` (5 tabs, IntersectionObserver active state, no sign-in),
  `Hero`, `Company`, `Capabilities`, `Service`, `Standards`, `Contact`, `InquiryForm`,
  `InquiryDetail`, `PlaceholderTag`, `Footer`, `Reveal` (+`SectionLabel`).
- `src/lib/site.js` — company facts, nav links, the four SERVICES, image URLs, `scrollToId` (-104px
  offset so headings clear the floating navbar).
- Tokens in `src/index.css`: `--porcelain #fdfdfc`, `--ivory #faf8f4`, `--pale #f3f2ee`,
  `--graphite #17191b`, `--slate #6b7075`, `--gold #c3a06a`, `--gold-deep #a9854f`,
  `--hairline #e7e3db`; utilities `glass-nav`, `glass-nav-solid`, `surface-card`, `rule-gold`,
  `tech-grid`, `tech-grid-fine`, `rule-ticks`, `label-tech`, `shadow-card(-hover)`.
- SEO: `public/index.html` (title, 156-char description, OG/Twitter, Organization JSON-LD, real
  `<noscript>` content, favicon + apple-touch-icon), `public/robots.txt`, `public/llms.txt`.

**Backend** — FastAPI, Motor/MongoDB, all routes under `/api`.
- `server.py` (wiring), `db.py`, `auth.py` (Emergent Google auth + `ADMIN_EMAILS` allowlist),
  `inquiries.py` (inquiry workflow, honeypot, IP rate limit 6/hour, duplicate fingerprint guard,
  save-before-email), `emailer.py` (Emergent-managed Resend + guardrail gate), `storage.py`
  (Emergent object storage).
- Tests: `backend/tests/test_inquiries_api.py` — 11 pytest tests.

### API
| Method | Route | Access |
|---|---|---|
| POST | `/api/inquiries/uploads` | public (extension + 25 MB validation, rate limited) |
| POST | `/api/inquiries` | public (honeypot, consent required, duplicate + rate guard) |
| GET | `/api/inquiries` | admin |
| GET | `/api/inquiries/mine` | signed-in user (own email) |
| GET | `/api/inquiries/files/{file_id}` | admin |
| PATCH | `/api/inquiries/{id}` | admin (new/reviewing/quoted/closed) |
| POST | `/api/auth/session` · GET `/api/auth/me` · POST `/api/auth/logout` | auth |

### Collections
- `inquiries`: id (`YF-YYMM-XXXXX`), contact_name, company, email, phone, service, service_label,
  description, quantity, timeline, consent, files[], status, created_at, email_status.
- `inquiry_files`: file_id, filename, size, content_type, storage_path, inquiry_id, is_deleted.
- `users`, `user_sessions` (Google auth).

### Environment
`backend/.env`: `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`,
`EMAIL_REPLY_TO`, `COMPANY_NOTIFICATION_EMAIL`, `ADMIN_EMAILS`, `EMERGENT_LLM_KEY`, `MAX_UPLOAD_MB`.
Placeholder template at `/app/.env.example`.

## Third-party integrations
- **Emergent-managed Resend** — internal inquiry notification + customer acknowledgement.
- **Emergent-managed Google Auth** — internal dashboard only (no public sign-in).
- **Emergent object storage** — attachments under `yuefung/inquiry-uploads/`.

## Implemented
**2026-10-08** — Rebuilt the site (dark steel-blue phase), quote workflow with attachments + emails,
admin dashboard, SEO metadata, accessibility, reduced-motion. Verified: pytest 8/8, testing agent
iteration_1 with zero issues.

**2026-10-09 (Phase 1 refinement)** — Re-themed to the light porcelain/champagne-gold system;
five-tab navigation with active-section highlighting and heading-safe scroll offsets; new sections
Company / Capabilities / Service / Standards / Contact; four service cards whose "Make an Inquiry"
prefills the inquiry form; certification + quality placeholders; visible placeholder tags across all
unconfirmed content; inquiry form extended to contact person, company, business email, phone,
interested service, project description, approximate quantity, target timeline, drawing upload and a
consent checkbox; backend renamed to `/api/inquiries` with honeypot, IP rate limiting, duplicate
rejection and DB-save-before-email; `/privacy` draft page + footer link + dynamic year;
`robots.txt`, `llms.txt`, Organization JSON-LD, `<noscript>` fallback, favicon/apple-touch-icon;
`.env.example`. Verified: pytest 11/11, testing agent iteration_2 with zero issues (desktop +
mobile, prefill flow, validation, consent, uploads, dashboard, access control, SEO assets).

## Outstanding configuration / owner actions
- Replace placeholder photography with authentic factory, team and production images.
- Confirm or replace the three core values and the three quality strengths.
- Supply certificates (IATF/ISO or other) for the reserved certification frames.
- Supply telephone / general email for the contact block and footer.
- Approve the `/privacy` policy wording.
- Attach a production domain, then add canonical / `og:url` / `og:image` / `sitemap.xml` (currently
  omitted on purpose) and enable the deployment crawling toggle.

## Backlog
- **P1:** admin CSV export of inquiries; status-change notification to the customer; content layer
  so the owner can edit copy/photos without a redeploy.
- **P2 (Phase 2 — do not build yet):** customer login and portal, inquiry/order tracking, document
  access, staff dashboard, AI-assisted inquiry handling. Invoices and auto-invoicing explicitly
  deferred to the portal phase.
- **P2:** bilingual (EN / 繁體) toggle if required for the HK market.

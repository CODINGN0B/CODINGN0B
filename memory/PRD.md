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

### Phase 1 follow-up (2026-10-09, second pass)
- **Brand**: supplied Yue Fung logo in the navbar beside the wordmark and in the footer, with a
  dark-theme variant (`public/brand/yuefung-logo{,-dark}.png`). Supplied injection-moulding photo
  used for the Company section and the Plastic Injection Moulding service card.
- **Settings menu** (`SettingsMenu.jsx` + `context/SettingsContext.jsx`): light/dark theme and five
  locales — English, 简体中文, 繁體中文, Čeština, Español — persisted in localStorage, applied to all
  site copy (`lib/i18n.js`) and to `<html lang>`. Dark palette lives in the `[data-theme="dark"]`
  token block in `index.css`.
- **Scroll-driven cinematic sequence** (`ScrollSequence.jsx`) between Company and Capabilities:
  36 WebP frames (desktop 1200×675 ≈1.7 MB, mobile 600×338 ≈0.4 MB every second frame) rendered on
  canvas from scroll position only — no scroll hijacking, first four frames eager then progressive,
  static poster under `prefers-reduced-motion` or decode failure. Replace
  `public/sequence/{desktop,mobile}/fNN.webp` + `poster.webp` with real production footage frames —
  no code change required.
- **Copy**: Company heading "40 Years Manufacturing Pedigree since 1984"; first core value
  "Heritage — Consistently provides you with long-term operational security."; Capabilities
  "Your Specifications. Our Expertise."; Standards "A Standard That Lasts".
- **Placeholder tags removed** site-wide (owner request); unconfirmed items remain as neutral
  reserved areas (certificate frames, quality wording, privacy draft).
- **Footer** restructured: the five category links now run across the top of the footer; address
  block carries a "Company address" label plus the logo.
- **Buttons**: shared `.btn-press` utility (active scale, no tap highlight, `touch-action`) and
  full-width primary CTAs on small screens.
- **Backend**: inquiries store `email_status` + `email_error`; `POST /api/inquiries/{id}/resend-notification`
  (admin) retries both emails; delivery failure never blocks the saved inquiry.
- Verified: pytest 12/12; testing agent iteration_3 — zero issues (theme, all five locales, sequence
  frame advance + no scroll lock + reduced-motion poster, footer, prefill, validation in two
  languages, happy path, mobile, dashboard resend, auth gating).

### Phase 1 follow-up (2026-10-12, owner visual edits + motion polish)
- **Brand**: display name is now **Yue Fung Precision Product Co. Ltd.** with the wordmark sub-line
  "PRECISION PRODUCT CO. LTD." (`COMPANY.display` / `COMPANY.sub`). The registered name
  "Yue Fung Metal Plastic Products Co. Ltd." is retained only in the footer copyright, the privacy
  draft and the email footer — confirm with the owner which name should appear on legal documents.
- **Addresses (owner-supplied, verified)**: HK office — Unit 308, 3/F Fook Hong Industrial Building,
  19 Sheung Yuet Road, Kowloon Bay, Kowloon, Hong Kong (`COMPANY.hkAddress`); China manufacturing —
  No. 178 Xin Cheng Industrial District, Tian Keng, Heng Lik Zhen, Dongguan, China
  (`COMPANY.address`). Both appear in the footer and the contact card, and in the JSON-LD, llms.txt,
  `<noscript>` block and email footer.
- **Copy**: Company core values are now Heritage / Identity / Brand (Identity carries the Tier-1
  "Stability and Evolution" statement, owner-supplied), values note "Yue Fung Precision —
  '40 years of Heritage'"; Standards right column is "Three Foundations of Trust" with
  "25+ Years of Consistency", "Empowering Global Producers" and "The 'Zero Error' Backbone"
  (owner-supplied claims incl. Tier 2 automotive partner and Ford/GM platforms); the reserved-areas
  note was removed; hero gold accent set bolder. All five locales updated.
- **Navbar**: single ultra-premium acrylic pane — translucent base, 5px dot-matrix silkscreen,
  inset edge sheen, soft ambient shadow, champagne hairline — with a fixed 60px height and 40px
  controls so the CTA always sits inside the pane. Settings button uses a classic gear icon and the
  menu now closes after a theme or locale choice.
- **Motion system**: Lenis tuned for silky scrolling (duration 1.15, lerp 0.085, exponential
  ease-out) and anchor jumps use the same easing with a -104px offset; `.btn-press` gives a
  1.03–1.04x hover scale and 0.975 press-down over 300ms `cubic-bezier(0.22,1,0.36,1)`, hover scale
  limited to fine pointers, suppressed on `:focus-visible` and disabled under
  `prefers-reduced-motion`. No layout shift, no scroll hijacking.
- **Fix**: Tailwind cannot apply an `/opacity` modifier to `var()` colours, which made several
  overlay captions transparent — replaced with `.surface-soft` / `.surface-glass` `color-mix()`
  utilities (Company photo caption, service badge, certificate frames, contact teaser, hero
  secondary button, sequence caption).
- Verified: pytest 12/12; testing agent iteration_4 — zero issues (copy, navbar geometry measured at
  1920/1280/768, dual addresses, caption legibility, motion, plus regression of theme, five locales,
  scroll sequence, prefill, validation and the dashboard).

### ⚠ Known issue — company inbox undeliverable (2026-10-09)
The email provider rejects `yfhk@yuefung.com` as an unverifiable recipient, so the internal
notification currently records `email_status: partial` with the error stored on the inquiry. The
inquiry itself is always saved and the customer acknowledgement sends normally. Owner action:
confirm a deliverable notification inbox (update `COMPANY_NOTIFICATION_EMAIL`), then use
"Resend notification" in the dashboard for any inquiries received in the meantime.

### Deployment readiness check (2026-10-09)
Deployment agent static scan: **PASS, no blockers.** Verified: no hardcoded secrets or URLs
(frontend uses `REACT_APP_BACKEND_URL` only, backend reads every value from the environment with no
baked-in defaults), auth redirect uses `window.location.origin`, CORS deployment-safe, supervisor
config and ports untouched (backend 0.0.0.0:8001, frontend 3000), all routes under `/api`, no
compilation blockers or references to removed modules, no destructive startup DB operations, uploads
go to Emergent object storage (nothing written to ephemeral disk).
Secrets that must exist in the production environment at deploy time: `MONGO_URL`, `DB_NAME`,
`CORS_ORIGINS`, `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, `EMAIL_REPLY_TO`,
`COMPANY_NOTIFICATION_EMAIL`, `ADMIN_EMAILS`, `EMERGENT_LLM_KEY`, `MAX_UPLOAD_MB`.
After a production domain exists, add canonical / `og:url` / `og:image` / `sitemap.xml` (currently
omitted on purpose) and enable the deployment crawling toggle.

## Outstanding configuration / owner actions
- Confirm a deliverable inquiry inbox (see the known issue above) — highest priority.
- Replace the remaining stock photography (capabilities grid, CNC/stamping/tooling service cards)
  and the scroll-sequence frames with authentic Yue Fung photography.
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
- **P2:** review the professional accuracy of the zh / zh-TW / cs / es translations with native
  speakers before launch; extend the frame-by-frame sequence technique elsewhere only after
  evaluating its real-device performance.

## Changelog — 2026-07 (motion & copy polish, fork)
- Capabilities: heading "Your Specifications. Our Expertise." now champagne-gold + font-medium; note copy "we will tell you plainly" → "we will arrange precisely" (en locale).
- Company: "Core values" title (valuesTitle h3) now font-semibold.
- Navbar: removed scroll-based glass style swap — now a single consistent `glass-nav-solid` that stays intact on scroll up/down (still fixed/floating).
- Hero: mockup entrance changed to a gentle ease-DOWN settle (y:-26→0, cubic-bezier(0.22,1,0.36,1)); "Explore Capabilities" button arrow now animates downward (y 0→14→0, opacity dip) on click, coordinated with the scroll.
- Capabilities & Service cards: GPU-friendly hover zoom (transform-gpu + will-change), refined easing (~450–650ms), no layout shift.
- Smooth scroll: scrollToId now distance-based duration (0.7–1.5s) via Lenis with -104 offset; falls back to instant jump under prefers-reduced-motion. Verified nav-link scroll works (0→4468px).

## Changelog — 2026-07 (real product imagery + CONTACT_EMAIL)
- Inquiry notification recipient now driven by `CONTACT_EMAIL` env var (=yfhk@yuefung.com); inquiries.py reads os.environ["CONTACT_EMAIL"].
- Replaced stock images with real product photos (downloaded to /frontend/public/photos for production reliability):
  - CNC Machining service card -> cnc-brackets.jpg (black anodised aluminium CNC brackets).
  - Capabilities "Manufacturing to Drawing" -> cnc-copper-shaft.jpg (copper precision turned shaft) — second CNC image.
  - Precision Metal Stamping service card -> stamping-die.jpg (progressive stamping die in operation).
  - Tooling / CNC Tooling service card -> stamping-die.jpg (die = tooling).
  - Plastic Injection Moulding service card -> injection-connector.jpg (moulded connector housing w/ gold-plated stamped brass terminals).
  - Standards section -> added responsive CMM inspection figure (cmm-inspection.jpg, TESASTAR-m) with "CMM · In-process inspection" badge.
- All images object-cover + responsive heights; descriptive alt text added.

## Changelog — 2026-07 (4 more real photos + dedupe)
- Verified prior 5 photos all present (incl. Capabilities "Manufacturing to Drawing" copper shaft — the earlier failed edit had in fact landed).
- Added 4 new photos to /frontend/public/photos:
  - stamped-bracket.jpg -> Precision Metal Stamping SERVICE card (replaces duplicate stamping-die) + Capabilities "Component Finishing".
  - terminal-contacts.jpg -> Capabilities "Metal & Plastic in One Place" (formed metal contacts on carrier strip; not described as moulded).
  - cnc-tapping-centre.jpg -> Capabilities "Tooling Support" (equipment photo, tool turret).
  - factory-floor.jpg -> Company photo slot (replaces injection-moulding.jpg); caption note updated across all 5 locales to "Stamping presses on the production floor." (no size/headcount/model claims).
- Service grid now has 4 unique images (prior stamping-die duplicate removed; tooling card keeps stamping-die).
- No machine model names/specs/capacities added to copy; all images object-cover + responsive, descriptive alt text.

## Changelog — 2026-07 (watermark cleanup, assets only)
- Removed the bottom-right "豆包 AI生成" watermark from 4 photos (no copy/layout changes):
  - cnc-brackets.jpg -> bottom-strip crop (2048x1599 -> 2048x1395); brackets intact.
  - injection-connector.jpg -> bottom-strip crop (1536x2048 -> 1536x1867); connector intact.
  - stamping-die.jpg -> bottom-strip crop (1536x2048 -> 1536x1935).
  - terminal-contacts.jpg -> clone-fill of corner over plain background (size unchanged).
- Audited all other site photos (cnc-copper-shaft, cmm-inspection, stamped-bracket, cnc-tapping-centre, factory-floor, hero) — no watermark present; left untouched.
- All cleaned via crop/mask only; verified seam-free at full res and in-context on preview. Originals backed up at /tmp/orig_photos.

# PRD — Yue Fung Metal & Plastic Products Co. Ltd. (裕豐金屬塑料製品有限公司)

## Original Problem Statement
Modern, cutting-edge industrial, responsive website for Yue Fung — advanced precision tooling, injection molding, and metal stamping manufacturer for automotive and electronics components. Dark grey + soft gold premium industrial luxury, frosted glassmorphism, neon cyan/amber accents, bilingual EN/Traditional Chinese, interactive 3D automotive hero (photorealistic coupé, no brand logos) with Default / Exploded / X-Ray / Wireframe toggles, floating glass nav, tabbed capabilities, animated metrics, detailed RFQ modal with spec selections and file upload preview, full mobile optimization. User additions: bento stats under hero; sections for Vision & Identity, History (40 years), Vertically Integrated Power, "Tolerance Nightmare"; Awwwards-level motion (framer-motion reveals, lenis smooth scroll, masked line-by-line hero reveal, editorial marquee, parallax).

## Architecture
- Frontend: React 19 + Tailwind + shadcn/ui, three.js + @react-three/fiber + @react-three/drei (GLB coupé at /public/models/coupe.glb), framer-motion, lenis. Components: Navbar, Hero, CarShowcase, StatsBento, Marquee, Vision, History, Capabilities, Integrated, Tolerance, Footer, RFQModal, Reveal (shared).
- Backend: FastAPI, /api/rfq POST + GET (MongoDB `rfqs` collection), reference IDs `YF-XXXXXX`.
- No auth (public portfolio).

## User Personas
- Tier-1 automotive / electronics sourcing engineer evaluating a manufacturing partner (needs capabilities, tolerances, certifications, RFQ path).
- Product designer / NPI lead checking DFM depth and vertical integration.

## Core Requirements (static)
1. Glassmorphism dark industrial luxury theme, bilingual touches.
2. 3D hero car with 4 view modes + sub-assembly callouts (gears, bracket, enclosure).
3. Bento stats, numbered manifesto chapters 01–05, marquee, parallax.
4. Detailed RFQ modal with spec selects + file preview; submissions persisted.
5. Responsive, mobile-optimized.

## Implemented (2026-09-22)
- Full site: all sections above, framer-motion reveals, lenis scrolling, marquee, parallax chapter numbers.
- 3D hero: GLB coupé de-branded (gunmetal paint, emblem mesh hidden, chrome darkened, wheel caps gold), Default/Exploded/X-Ray/Wireframe modes, rotating gear/bracket/enclosure sub-assemblies with bilingual labels in Exploded/X-Ray, auto-rotate orbit (touch devices: swipe-scroll preserved).
- RFQ backend + modal verified end-to-end (submission YF-CCC76B in DB).
- StatsBento copy edit: "manufacturing pedigree" per user visual edit.

## Verification Status
- curl-verified: POST/GET /api/rfq.
- Screenshot-verified: hero default/exploded/wireframe, stats bento, vision, history, capabilities + tab switch, integrated, tolerance, footer, RFQ modal fill+submit.
- NOT visually verified: X-Ray mode (headless software-GL screenshot timeouts; material swap shares the verified wireframe code path), mobile viewport (screenshot tool locked to 1920px; responsive classes + hamburger implemented).

## Backlog
- P0: None blocking.
- P1: Visual check of X-Ray mode on real GPU; mobile device pass; client-requested Google sign-in (client portal to track RFQ status) — integration deferred from earlier conversation.
- P2: Email notification on RFQ (Resend), real file upload to object storage, CMS-editable content, multi-language toggle, SEO metadata/OG tags.

## Next Tasks
1. Mobile + X-Ray on-device QA pass.
2. Google sign-in gated client portal (RFQ status tracking) if user confirms.
3. Resend email on RFQ submission.

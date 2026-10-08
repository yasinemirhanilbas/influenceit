# Changelog

Approved changes, newest first. Format: date, what, files, why.

## 2026-10-08 (richer home page)
- Added a sticky header with a support bar and a mobile menu, a scrolling strip of fictional brand names, a numbers section, a comparison table and an FAQ.
- Hero receipt now animates through the order steps (order placed, held in escrow, delivered, released) and has floating chips. Motion respects `prefers-reduced-motion`.
- Creator cards gained rating, tier label and delivery time; niche filter chips work client-side. Creator data grew from 6 to 9 entries.
- Added scalloped paper edges, a light paper grain and scroll-in animations (CSS only, no extra packages).
  - Files: `app/page.js`, `app/globals.css`, `components/` (SiteHeader, MobileNav, BrandMarquee, StatsSection, ComparisonSection, FaqSection, CreatorGrid, CreatorCard, FeaturedCreators, ReceiptCard, HeroSection, Button, icons), `data/` (brands, stats, creators), `lib/` (creators, format), `locales/en.js`
  - Why: user found the page too plain.
- Note: header links use in-page anchors; `/creators` and `/signup` still do not exist.

## 2026-10-08 (design twists)
- Applied small design details inspired by a reference site's general patterns (not its text, brand or layout): tinted ink, border and shadow; 20px card radius; pill buttons with gradient and glow; gradient headline phrase; hero light spots and dotted eyebrow pill; metric-first testimonials; gradient closing section.
  - Files: `app/globals.css`, `components/` (Button, HeroSection, HowItWorksSection, ReceiptCard, CreatorCard, TestimonialsSection, SignUpCta, icons), `data/testimonials.js`, `locales/en.js`, `CLAUDE.md`
  - Why: user request. Extras (header, stats, comparison table, filter chips) were offered and declined.

## 2026-10-08 (color change)
- Primary color changed from green to burgundy (#7A1F3D; soft #F8E1E8, dark #5A1229).
  - Files: `app/globals.css`, `components/icons.js`, `data/creators.js`, `CLAUDE.md`
  - Why: user preference.

## 2026-10-08 (dev port)
- Dev and start scripts now use port 3030 (3000 is used by another project).
  - Files: `package.json`

## 2026-10-08 (home page, Paper Trust)
- Created the Next.js 16 app (JavaScript, App Router, Tailwind v4) and built the home page with five sections.
  - Files: `package.json`, `package-lock.json`, `next.config.mjs`, `eslint.config.mjs`, `jsconfig.json`, `AGENTS.md`, `public/`
  - Files: `app/layout.js`, `app/page.js`, `app/globals.css`
  - Files: `components/` (HeroSection, ReceiptCard, HowItWorksSection, FeaturedCreators, CreatorCard, TestimonialsSection, SignUpCta, Button, Avatar, SectionHeading, icons)
  - Files: `locales/en.js`, `locales/index.js`, `lib/format.js`, `lib/routes.js`, `data/creators.js`, `data/testimonials.js`, `data/sampleOrder.js`
  - Why: first visible screen of the demo. All UI text is in `locales/`, prices are number + currency code formatted with Intl, data is fictional and static until Phase 1 (Prisma).
- Link targets in `lib/routes.js` (`/creators`, `/signup?role=...`) do not exist yet; they arrive in Phase 1 and 2.

## 2026-10-08 (foundation)
- Added project foundation files.
  - Files: `CLAUDE.md`, `CHANGELOG.md`, `.gitignore`
  - Why: record working rules and decisions on disk; keep secrets, dependencies and DB files out of git.

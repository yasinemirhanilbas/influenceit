# InfluenceIt

## Project
InfluenceIt: a creator–brand marketplace prototype (Next.js + Tailwind, plain JavaScript,
SQLite + Prisma). Lives in the `influenceit` folder. Demo/interview project, runs locally.

## Working rules
- At the start of each session and before answering history questions, read CLAUDE.md
  and base answers on it. Flag anything that contradicts it.
- Before creating, editing or deleting files, show a short plan (what, which files, why)
  and wait for approval. One approval can cover a batch described in the plan.
- No approval needed for read-only work: reading files, listing folders, running the dev server.
- Always ask first for: deleting files, installing packages, changing the database schema,
  git commit/push.
- Stay within the request. Put extra ideas in the "Backlog" section below instead of acting on them.

## Conventions
- Code, file/folder names, routes, DB fields, UI text, placeholders: English.
- No hardcoded UI strings; keep them in one place (`locales/`) so more languages can be added later.
- Plain JavaScript (no TypeScript) unless we decide otherwise.
- Seed data is fictional: no real people, brands or logos.
- Prices are stored as number + currency code; formatting uses the Intl API.
- Never commit .env, node_modules, or *.db files.
- Git: no direct pushes to main; use feature/* branches and pull requests.

## Done means
App starts without errors and the changed flow works end to end.

## Architecture decisions
(short list, newest last)
- Home page design direction: "Paper Trust" (warm cream paper, receipt/escrow motif, Fraunces + DM Sans). Primary color is burgundy #7A1F3D (green was dropped by choice on 2026-10-08).
- Home page uses static fictional data in `data/` first; swapped for Prisma queries in Phase 1.
- Visual twists (2026-10-08): tinted ink/border/shadow (burgundy-black), 20px card radius, pill buttons with gradient + glow, gradient text for the key phrase, metric-first testimonials, gradient closing section. Gradient helpers (`.text-gradient`, `.bg-brand-gradient`) live in `app/globals.css`.
- Tailwind v4: design tokens live in `app/globals.css` (`@theme`), there is no `tailwind.config.js`. Keep the Tailwind loader in `next.config.mjs` (`turbopack.rules`).
- UI text in `locales/en.js` (read through `locales/index.js`); money via `lib/format.js` (Intl, `currencyDisplay: "narrowSymbol"`).
- Link targets are centralized in `lib/routes.js`. Header nav uses in-page anchors (`#how-it-works`, `#creators`, `#stories`, `#faq`).
- Animations are CSS-only (marquee, scroll-in `.reveal`, stamp, floating chips) and disabled under `prefers-reduced-motion`. The only client components are `ReceiptCard`, `CreatorGrid` and `MobileNav`.
- This Next.js version differs from older ones: read `node_modules/next/dist/docs/` before using framework APIs (see AGENTS.md).

## Current status
Phase 1 started: app scaffold and a full home page (header, hero, brand strip, how it works, numbers, creators with filters, comparison, testimonials, FAQ, CTA; static data) done. Not yet: Prisma schema, seed, shared layout/header. Git is set up: private repo github.com/yasinemirhanilbas/influenceit, initial scaffold merged to main via PR #1 (2026-10-08); all further work goes through feature/* branches and pull requests. Run `npm install` on your own machine, then `npm run dev`.

## Backlog / ideas
(not approved yet)

Detailed history of approved changes goes in CHANGELOG.md (date, what, files, why).

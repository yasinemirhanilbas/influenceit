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
- Code, file/folder names, routes, DB fields, comments: English. UI text exists in English (default) and Turkish; both live in `locales/`.
- No hardcoded UI strings; keep them in `locales/` (en.js and tr.js must keep the same keys). To add a language: add `locales/<code>.js`, register it in `locales/index.js` and `locales/config.js`.
- Plain JavaScript (no TypeScript) unless we decide otherwise.
- Seed data is fictional: no real people, brands or logos.
- Prices are stored as number + currency code; formatting uses the Intl API.
- Never commit .env, node_modules, or *.db files.
- Git: no direct pushes to main; use feature/* branches and pull requests.

## Done means
App starts without errors and the changed flow works end to end.

## Architecture decisions
(short list, newest last)
- Routes: `/{lang}`, `/{lang}/creators`, `/{lang}/jobs`, `/{lang}/how-it-works`, `/{lang}/signup`. Shared header/footer in `app/[lang]/layout.js`; link targets in `lib/routes.js`. The product is two-sided: brands find creators, creators find brands (open jobs).
- Home page design direction (2026-10-08, second pass): dark burgundy theme inspired by the structure and feel of a reference UGC portfolio site (inspiration only, nothing copied). Page #14070E, alternating #1B0B13, cards #231019, text #F7E9EE / #C8AAB6, lines #3B1D2B, accent text #E9809F, buttons gradient #8E2748 to #C2476C, closing section burgundy gradient. Fonts: Fraunces (headings, italic accent), Manrope (body), Space Mono (small spaced labels and nav). Large radii (28px), roomier spacing, 420ms expo-out transitions. Gradient placeholder tiles instead of photos. Token names (paper, ink, brand...) are kept from the light theme but now hold dark-theme values. Tokens live in `app/globals.css`.
- Home page uses static fictional data in `data/` first; swapped for Prisma queries in Phase 1.
- Visual twists (2026-10-08): tinted ink/border/shadow (burgundy-black), 20px card radius, pill buttons with gradient + glow, gradient text for the key phrase, metric-first testimonials, gradient closing section. Gradient helpers (`.text-gradient`, `.bg-brand-gradient`) live in `app/globals.css`.
- Tailwind v4: design tokens live in `app/globals.css` (`@theme`), there is no `tailwind.config.js`. Keep the Tailwind loader in `next.config.mjs` (`turbopack.rules`).
- UI text in `locales/en.js` (read through `locales/index.js`); money via `lib/format.js` (Intl, `currencyDisplay: "narrowSymbol"`).
- Pages live under `app/[lang]/` (`/en`, `/tr`); `proxy.js` redirects `/` (cookie, then Accept-Language, then English). Components take a `lang` prop and call `getMessages(lang)`; money and numbers use `getIntlLocale(lang)`.
- Link targets are centralized in `lib/routes.js` (`getRoutes(lang)`). Header nav uses in-page anchors (`#how-it-works`, `#creators`, `#stories`, `#faq`).
- Animations are CSS-only (marquee, scroll-in `.reveal`, stamp, floating chips) and disabled under `prefers-reduced-motion`. The only client components are `ReceiptCard`, `CreatorGrid` and `MobileNav`.
- This Next.js version differs from older ones: read `node_modules/next/dist/docs/` before using framework APIs (see AGENTS.md).
- Database (2026-10-08): Prisma 7.10.0 + SQLite via `@prisma/adapter-better-sqlite3`. Schema in `prisma/schema.prisma` (generator `prisma-client-js`, client from `@prisma/client`). One shared client: `import { db } from "@/lib/db"` (check `jsconfig.json` for the alias, otherwise use a relative path). DB file `dev.db` is created in the project root and is git-ignored; everyone builds it with `npm run reset`. Order `status` and user `role` are strings, values in `lib/orderStatus.js`. Order copies the package price at order time. Seed is fixed and fictional (`prisma/seed.mjs`); creator `slug` equals the old static `id`.

## Current status
Phase 1 in progress: multi-page bilingual site (home, creators, jobs, how-it-works, login, signup) with static data. Prisma schema, seed and `npm run reset` are done (from feature/database). Not yet: pages reading from the database, real login/signup. Git: private repo github.com/yasinemirhanilbas/influenceit; work goes through feature/* branches and pull requests. After pulling: run `npm install`, then `npm run reset` (creates and fills `dev.db`), then `npm run dev`.

## Backlog / ideas
(not approved yet)

Detailed history of approved changes goes in CHANGELOG.md (date, what, files, why).

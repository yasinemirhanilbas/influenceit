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
- Git: we work directly on `main` (no feature branches or pull requests). Before starting work and before every push: Fetch origin, then Pull origin. Commit small and often. Check that `npm run dev` starts before pushing. Tell each other which files you are working on to avoid conflicts. Branches are optional, only for big risky changes (for example database schema changes).

## Done means
App starts without errors and the changed flow works end to end.

## Architecture decisions
(short list, newest last)
- Routes: `/{lang}`, `/{lang}/creators`, `/{lang}/jobs`, `/{lang}/how-it-works`, `/{lang}/signup`. Shared header/footer in `app/[lang]/layout.js`; link targets in `lib/routes.js`. The product is two-sided: brands find creators, creators find brands (open jobs).
- Colour theme (2026-10-10, replaces the dark burgundy direction): light "Porselen" theme. Tokens in `app/globals.css`: paper #f4f2f3, card #fcfbfb, soft #ebe7e9, ink #261b20, ink-soft #625459, line #ddd5d9, field #9a8b92, brand #8a2f4b (dark #6e2139, light #a03d5c, soft #efe1e6), action (buttons) #7a2742, brass #8c6d2f. No loud gradients: `.bg-brand-gradient`, `.bg-brand-gradient-deep`, `.text-gradient` are kept as names but are solid colours. Avatars use the muted palette (#D9C4CB, #D4CBB8, #C7CDD3, #CDB6BD, #E2D6DA, #BDA7AF, #C9D1C8, text #2A1F24). Do not add bright pinks or new gradients. Fonts: Fraunces (headings), Manrope (body), Space Mono (small labels).
- Creators and open jobs are read from the database through `lib/queries.js` (`"use cache"` + `cacheTag`, so pages still prerender). Static `data/` is still used for brands strip, stats, gallery, testimonials and the sample receipt.
- Visual style: 24px card radius, soft shadows, pill buttons, metric-first testimonials.
- Tailwind v4: design tokens live in `app/globals.css` (`@theme`), there is no `tailwind.config.js`. Keep the Tailwind loader in `next.config.mjs` (`turbopack.rules`).
- UI text in `locales/en.js` (read through `locales/index.js`); money via `lib/format.js` (Intl, `currencyDisplay: "narrowSymbol"`).
- Pages live under `app/[lang]/` (`/en`, `/tr`); `proxy.js` redirects `/` (cookie, then Accept-Language, then English). Components take a `lang` prop and call `getMessages(lang)`; money and numbers use `getIntlLocale(lang)`.
- Link targets are centralized in `lib/routes.js` (`getRoutes(lang)`). Header nav uses in-page anchors (`#how-it-works`, `#creators`, `#stories`, `#faq`).
- Animations are CSS-only (marquee, scroll-in `.reveal`, stamp, floating chips) and disabled under `prefers-reduced-motion`. The only client components are `ReceiptCard`, `CreatorGrid` and `MobileNav`.
- This Next.js version differs from older ones: read `node_modules/next/dist/docs/` before using framework APIs (see AGENTS.md).
- Database (2026-10-08): Prisma 7.10.0 + SQLite via `@prisma/adapter-better-sqlite3`. Schema in `prisma/schema.prisma` (generator `prisma-client-js`, client from `@prisma/client`). One shared client: `import { db } from "@/lib/db"` (check `jsconfig.json` for the alias, otherwise use a relative path). DB file `dev.db` is created in the project root and is git-ignored; everyone builds it with `npm run reset`. Order `status` and user `role` are strings, values in `lib/orderStatus.js`. Order copies the package price at order time. Seed is fixed and fictional (`prisma/seed.mjs`); creator `slug` equals the old static `id`.

- Auth (2026-10-08): no auth library. Passwords hashed with Node `scrypt` (`lib/password.mjs`); login is a signed HTTP-only cookie (`lib/session.js`, secret `SESSION_SECRET`, local fallback). Server actions in `app/[lang]/auth/actions.js`. Pages that read the cookie must sit inside `<Suspense>` (Cache Components). Seed accounts: `<slug>@example.com`, password `demo1234`.
- Jobs (2026-10-10): `Job`/`Application` are written by `app/[lang]/jobs/actions.js` (`createJobAction`, `applyAction`, both check the session role on the server). Each job has a page `/{lang}/jobs/[id]` (prebuilt for known ids, the apply section reads the cookie inside `<Suspense>`). Job text: optional second-language block in the form; Turkish-page text goes to `titleTr`/`summaryTr`, readers see their language and fall back to the other. Writes call `updateTag("jobs")`.
- Creator photos (2026-10-09): stored as files in `storage/images/` (git-ignored) under random names; the database keeps only the names (`CreatorProfile.profileImage`, `galleryImages`). Type is detected from file bytes (`lib/images.js`); public route `app/api/images/[name]`. Creator sign-up is a multi-step client form (`components/CreatorSignupWizard.js`, steps listed in its `STEPS`) that calls `creatorSignUpAction` itself instead of `<form action>`, so a server error does not wipe typed values.
- Orders and packages (2026-10-10): order flow code from `feature/order-flow` and package management from `feature/creator-packages` were integrated by hand into `main`; both branches are redundant. Videos live in `storage/uploads/` (gitignored). Suggestions are pure functions in `lib/matching.js` (niche required, score >= 40, top 3).
- Messaging (2026-10-11): `Conversation` (one per brand-creator pair) and `Message` models; helpers in `lib/messages.js` (limits in `lib/messages-config.js`, usable in client code), server actions in `app/[lang]/messages/actions.js` (`startConversationAction`, `sendMessageAction`). Pages `/{lang}/messages` and `/{lang}/messages/[id]` read the cookie inside `<Suspense>`; access is checked on the server by `getConversationForUser`. The open conversation re-reads every 10 s (`components/ThreadLive.js`); no websockets. Seed photos are generated illustrations in `prisma/seed-images/`, copied to `storage/images/` by the seed.
- Choosing a job applicant creates an `Order` straight from the job (`Order.jobId`, unique; `packageId` optional). Unpaid orders can be undone, paid ones are final. Package orders from the profile still exist.

## Current status
Phase 1 in progress: multi-page bilingual site (home, creators, jobs, how-it-works, login, signup) with static data. Prisma schema, seed and `npm run reset` are done (from feature/database). Home, creators and jobs pages read from the database (`Job` and `Application` models added). Creator profile page `/{lang}/creators/[slug]`, real login/sign-up and the 4-step creator sign-up wizard (basic info, photos, social accounts, services and prices) with photos shown on cards, profile and account pages (`/{lang}/account`) are done; brand sign-up asks for sector (11 options), company title and phone; creator profiles show photos and a photo gallery; brands and creators can message each other (inbox + conversation pages). Brand job-posting form (`/jobs/new`), job pages with applications and the account lists are done. Closing jobs and choosing applicants are done too (`Application.status`); choosing an applicant creates the order from the job (`Order.jobId`, price = job budget) and the brand pays before the creator can deliver. Package editing, creator suggestions (`lib/matching.js`), terms/privacy pages and the order flow with simulated escrow (Phase 3) are done too. Not yet: payments beyond the simulation, notifications, dark theme. Git: private repo github.com/yasinemirhanilbas/influenceit; work happens directly on `main` (pull before every push). After pulling: stop the dev server, run `npm install`, then `npm run reset` (schema changed: `Application.status`, `Order` columns) (creates and fills `dev.db`), then `npm run dev`.

## Backlog / ideas
(not approved yet)
- Dark theme option "Wine and brass" (parked): paper #171114, card #261d22, ink #ece4e6, ink-soft #b3a5ab, line #3d3138, brand #d9a0ae, button #98314f, brass #c9a96e, no gradients, faint glows.
- Package editor does not edit `platform` and `contents` (set at sign-up). A "UGC" tab (as on the reference site) is not built.
- Idea: after choosing an applicant, offer a button "Order from this creator" that opens the order form for one of their packages.
- Idea: a simpler "start from scratch" demo seed (no half-finished orders) and a one-page interview summary ("how I would grow it").
- Idea: record a short screen video of the demo script as a backup (to be done by the user).
- Security review findings (2026-10-12, not fixed yet): no rate limit or lockout on login and sign-up; `SESSION_SECRET` falls back to a built-in value (should refuse to start in production without it); no maximum password length while server actions accept 55 MB bodies (cap passwords at about 128 characters before hashing); a login for an unknown email skips the password hashing, so response time shows which emails exist; no security headers (CSP, X-Frame-Options, Referrer-Policy) in `next.config.mjs`; logout only deletes the cookie (no server-side revocation, 7-day token). Checked and fine: signed HttpOnly cookie with timing-safe compare, scrypt hashes, uploads checked by content and stored under random names, video route only for the two parties, no `dangerouslySetInnerHTML`, delivery links limited to http(s), message rate limit, permission checks in server actions.
- Follower counts are typed in by the creator and not verified; automatic lookup was discussed and dropped (no public API for most platforms).
- Messaging ideas (not approved): unread badge in the site header (header is the front-end side's file), real-time updates instead of the 10 s refresh, file or image attachments, blocking or reporting a user, linking a conversation to an order or job, email notifications.

Detailed history of approved changes goes in CHANGELOG.md (date, what, files, why).

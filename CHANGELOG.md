# Changelog

Approved changes, newest first. Format: date, what, files, why.

## 2026-10-11 (seed photos, creator profile gallery, messaging)
- Seed creators now have photos: all 24 get a profile photo and 16 get one or two extra photos. They are fictional abstract illustrations (no real people), generated once and kept in `prisma/seed-images/` (about 1 MB). `npm run reset` copies them into `storage/images/` under fixed 32-character names, so they are served by the same `/api/images/[name]` route as real uploads.
- Creator profile page: large profile photo (square, rounded, with a ring) instead of the small initials badge; the photo section is now a clickable grid (`components/PhotoGallery.js`): one photo is shown wide, two or three in columns, and a click opens the photo large in a native `<dialog>` (Esc closes, arrow keys and buttons switch photos, counter shown). Brands see a "Message this creator" button in the profile header; visitors who are not logged in see "Log in to message".
- Messaging (new): brands and creators can write to each other. Either side can start: a brand from a creator profile, from an order page or from an applicant on its account page; a creator from an open job page, from an order page or from "my applications" on its account page. `/{lang}/messages` is the inbox (newest first, last message, unread count); `/{lang}/messages/[id]` is the conversation (own messages right, the other side's left, Ctrl+Enter sends, the page re-reads every 10 seconds while the tab is visible). The account page has a "Messages" button with the number of new messages. Opening a conversation marks the other side's messages as read.
- Rules, checked on the server: only the brand and the creator of a conversation can read or write in it (everyone else gets the not-found page), a message has 1 to 1000 characters, at most 20 messages per user per minute, one conversation per brand-creator pair.
- Schema (approved): new `Conversation` (`brandId`, `creatorId`, `createdAt`, `updatedAt`, unique per pair) and `Message` (`conversationId`, `senderId`, `body`, `createdAt`, `readAt`). `npm run reset` is needed after pulling. The seed adds three conversations (one with an unread message).
- Files: `prisma/schema.prisma`, `prisma/seed.mjs`, `prisma/seed-images/*` (new), `lib/messages.js`, `lib/messages-config.js`, `lib/routes.js` (`messages`, `message(id)`), `app/[lang]/messages/page.js`, `app/[lang]/messages/[id]/page.js`, `app/[lang]/messages/actions.js` (all new), `components/MessageForm.js`, `components/ThreadLive.js`, `components/MessageButton.js`, `components/PhotoGallery.js` (new), `components/AccountJobs.js`, `app/[lang]/account/page.js`, `app/[lang]/jobs/[id]/page.js`, `app/[lang]/orders/[id]/page.js`, `app/[lang]/creators/[slug]/page.js`, `locales/en.js` and `locales/tr.js` (`messages` block, `profile.photo*`).
- Why: profiles looked empty without photos, the second photo had no place to be seen, and brands and creators had no way to talk before or during an order.
- Verified with a browser test (25 checks, run twice): photos on profile and cards, one and two photo galleries, lightbox (open, next, Esc), brand starts a chat from a profile, message appears and the box clears, inbox, creator sees the unread count and replies with Ctrl+Enter, brand sees the reply and it is marked read, an outsider cannot read the chat, creator starts a chat from a job page, logged-out visitors go to login, Turkish text, no horizontal scroll at 375 px, no page errors.

## 2026-10-11 (polish: mobile check, error page, demo script)
- Checked 14 pages at 390px width (home, creators, profile, jobs, job, new job, account for both roles, packages, orders, how it works, sign-up, 404): no sideways overflow.
- Fixed "1 revisions" to "1 revision" on the profile and in the package manager (`revisionsValueOne`).
- New error page `app/[lang]/error.js` (retry button and link home, English and Turkish, `errorPage` in `locales/`).
- README: demo script (3-5 minutes), one-sentence reasons for each technical choice, updated "What works" and "Next steps".
- `CLAUDE.md` backlog cleaned (finished items removed); `ROADMAP.md` phases 1-4 ticked.
- Files: `app/[lang]/error.js`, `components/PackagesManager.js`, `app/[lang]/creators/[slug]/page.js`, `locales/en.js`, `locales/tr.js`, `README.md`, `ROADMAP.md`, `CLAUDE.md`, `CHANGELOG.md`.

## 2026-10-10 (order flow, package editing, suggestions, legal pages, README)
- Order flow (Phase 3), integrated by hand from the friend's branch `feature/order-flow`: ordering a package (`/{lang}/orders/new`), order page and list (`/{lang}/orders`, `/{lang}/orders/[id]`) with simulated escrow statuses, delivery by video upload (stored in `storage/uploads/`, served through `app/api/orders/[id]/video/route.js`, access only for the two parties), revision requests and approval. Server actions in `app/[lang]/orders/actions.js`; helpers `lib/orders.js`, `lib/orderStatus.js`, `lib/storage.js`; `next.config.mjs` sets `serverActions.bodySizeLimit` to 55mb. Schema (approved): `Order.packageName`, `deliveryNote`, `revisionNote`, `deliveryVideo`. `npm run reset` is needed; reset does not clear uploaded videos.
- Package editing, integrated from `feature/creator-packages` and extended: creators add, edit and delete packages at `/{lang}/account/packages` (max 8, name 40, description 160, price up to 1,000,000, delivery up to 30 days, plus revisions 0-5 and stay-on-profile options). Packages with orders cannot be deleted. Brands cannot open or save. Files: `app/[lang]/account/packages/{page,actions}.js`, `components/PackagesManager.js`, `lib/options.js` (`PACKAGE_LIMITS`), `lib/routes.js`, profile page shows revisions and stay. Note: right after an edit the first profile visit can still show the old copy (Next.js revalidates in the background); the next visit is fresh.
- Creator suggestions (`lib/matching.js`): on the brand's account page each job lists up to 3 matching creators (niche must match; score from niche, budget fit, delivery time, rating; minimum 40), with the reasons shown from the locale files.
- Legal and small items: `/{lang}/terms` and `/{lang}/privacy` pages (fictional demo text) linked from the footer and the sign-up forms; signed-in visitors on login/sign-up are redirected to their account; social accounts are shown on creator profiles; unused locale keys removed.
- README rewritten (English) with setup, demo accounts and feature list.
- The friend's branches `feature/order-flow` and `feature/creator-packages` are now redundant; merging them would conflict.
- Verified with scripted checks: orders 35, packages 19, jobs 33, applicant decisions 17, accounts 14 (plus the known 404-text artifact), lint and production build.

## 2026-10-10 (close jobs and choose applicants)
- Brands can close and reopen their own jobs from the account page (a closed job leaves the public list and takes no applications) and decide on every application: "Choose creator" (the job closes at once), "Decline", and "Undo" (back to waiting). Creators see the state (Waiting, Chosen, Declined) on their account page and a matching sentence on the job page. The server checks that the job or application belongs to the logged-in brand; other brands, creators and guests change nothing.
- Schema (approved): `Application.status` ("PENDING" default, "ACCEPTED", "REJECTED"). `npm run reset` is needed after pulling.
- Files: `prisma/schema.prisma`, `app/[lang]/jobs/actions.js` (`setJobStatusAction`, `decideApplicationAction`), `components/AccountJobs.js`, `app/[lang]/jobs/[id]/page.js`, `lib/options.js` (`APPLICATION_DECISIONS`), `locales/en.js`, `locales/tr.js` (`account.closeJob` ..., `account.applicationStatus`, `jobDetail.alreadyApplied*`).
- Verified with 18 scripted checks (owner and non-owner, creator, bogus values, list refresh, badges, undo, both applicants' views), lint and build.

## 2026-10-10 (log-out button in the header)
- Logged-in visitors now see a "Log out" button next to "My account" in the header (also in the mobile menu, under "My account"). It is a small form that calls the existing `logOutAction`, then returns to the home page in the same language. Files: `components/LogOutButton.js` (new), `components/HeaderAccount.js`, `components/MobileNav.js`, `locales/en.js`, `locales/tr.js` (`header.logOut`). Verified: button only for signed-in visitors in both languages, log-out clears the cookie and redirects home; lint and build clean.

## 2026-10-10 (job postings and applications, cleanup)
- Brands can now post jobs at `/{lang}/jobs/new` (title up to 80 characters, description up to 300, niche, content format, whole-number budget in TRY between 100 and 1,000,000, delivery 1-60 days). Only brand accounts can open it; guests go to login, creators see a short note. The job is saved as `Job` (status OPEN) and the brand lands on its job page with a "your job is live" notice.
- Every job now has its own page `/{lang}/jobs/[id]` (the "Apply now" button on the cards leads there). Creators send a short message (10-500 characters) as an `Application`; a second application to the same job is refused (unique index, also on double clicks), brands and guests cannot apply, closed jobs take no applications. Guests see log-in / join buttons, brands a note, creators who applied see their status.
- Account page: brands see their own jobs (status, budget) with every application (creator name, message, link to the creator profile); creators see the applications they sent. The jobs page has a "Post a job" button.
- Cleanup: the "open jobs" number in the stats strip is the real count from the database (`getOpenJobCount`); `data/sampleOrder.js` carries its own sample creator, so the unused `data/creators.js` and `data/briefs.js` were deleted; the gitignored `.preview/` folder was removed.
- Files: `app/[lang]/jobs/new/page.js`, `app/[lang]/jobs/[id]/page.js`, `app/[lang]/jobs/actions.js` (`createJobAction`, `applyAction`), `components/JobForm.js`, `components/ApplyForm.js`, `components/AccountJobs.js`, `components/BriefCard.js`, `components/StatsSection.js`, `app/[lang]/jobs/page.js`, `app/[lang]/account/page.js`, `lib/queries.js` (`getJob`, `getJobIds`, `getOpenJobCount`), `lib/options.js` (`JOB_*`, `APPLY_*`), `lib/routes.js` (`newJob`, `job(id)`), `locales/en.js`, `locales/tr.js` (`jobForm`, `jobDetail`, new `account` and `jobs.postJob` keys), `data/sampleOrder.js`, `data/stats.js`.
- Why: roadmap step 4, the second side of the marketplace. No schema change. The job form has an optional second-language block (Turkish on the English page, English on the Turkish page; both fields or none). Text typed on the Turkish page is saved in `titleTr`/`summaryTr` (the English columns get the other version or the same text), so the Turkish list and account show Turkish and the English list shows English whenever both versions exist; with one version everyone sees that one.
- Unknown job or creator addresses: the very first visit to a new unknown address can return status 200 (with the 404 page and a `noindex` tag), later visits return 404. This comes from how Next.js caches pages (documented in its not-found docs) and is harmless, so it stays as is. Turning it off with `dynamicParams = false` would make jobs created after the build unreachable.
- Verified with 34 scripted checks (log in as the demo brand and creator, valid and invalid forms, permissions, duplicate application, cache refresh of the list, account pages, Turkish pages), lint and production build.

## 2026-10-10 (light "Porselen" colour theme)
- The bright pink gradients were replaced by a calm light theme: porcelain grey background, near-black plum text, deep wine for buttons and links, brass for stars and stamps. Gradients are gone (class names `.bg-brand-gradient`, `.bg-brand-gradient-deep`, `.text-gradient` stay but are solid colours). Cards use a softer shadow and 24px radius.
- Files: `app/globals.css` (tokens), `data/gallery.js` (muted tile colours), `data/creators.js` and `prisma/seed.mjs` and `app/[lang]/auth/actions.js` (muted avatar palette), `components/CreatorCard.js`, `components/SignupForm.js`, `components/CreatorSignupWizard.js`, `components/LoginPanels.js`, `components/PhoneField.js`, `components/CreatorServicesStep.js`, `components/CreatorDirectory.js`, `app/[lang]/creators/[slug]/page.js`.
- Why: the old colours and gradients were too loud and inconsistent. `npm run reset` is needed so seed avatars get the new colours. A dark variant ("wine and brass") was designed too and is kept in the Backlog.

## 2026-10-10 (git workflow: work on main)
- Decided together to drop the feature-branch and pull-request rule: everyone works directly on `main`, with Fetch + Pull before every push and small, frequent commits. The old rule caused too much confusion (stashes, wrong branch, pull/push buttons). Files: `CLAUDE.md` (Conventions, Current status), `ROADMAP.md`.

## 2026-10-10 (brand sign-up: sectors, company title, phone)
- Brand sign-up form now has an 11-item sector list (Cosmetics & Beauty, Fashion & Lifestyle, Technology, Restaurant & Food, Fitness & Health, Home & Decor, Travel & Hotel, Education, Finance, E-commerce, Other; "Select a sector..." as placeholder), a required "Company title" under the brand name (up to 100 characters) and a required phone number with country code (same rules as the creator form: digits only, limited to the country's length). The server checks all three again.
- Schema (approved): `BrandProfile` gets optional `companyTitle` and `phone` (optional so older brands keep working). `npm run reset` is needed after pulling.
- Files: `prisma/schema.prisma`, `prisma/seed.mjs` (fictional titles and phones; industries are now sector ids), `lib/options.js` (`BRAND_SECTORS`, `COMPANY_TITLE_MAX`), `components/PhoneField.js` (new, shared by both forms), `components/SignupForm.js`, `components/CreatorSignupWizard.js` (uses `PhoneField`), `app/[lang]/auth/actions.js`, `app/[lang]/account/page.js` (shows company title, phone and the sector label), `locales/en.js`, `locales/tr.js` (`signup.sectors`, `signup.sectorPlaceholder`, `signup.companyTitle`, `signup.errors.companyTitle`, `account.companyTitleLabel`, `account.phoneLabel`; `signup.nichePlaceholder` removed).
- Why: the brand sign-up asked for too little to identify a company or reach it. The first six sector ids equal the old `NICHES` ids, so existing brands show the right sector.
- Verified with a browser test: sector list order and text, phone limited while typing, short phone rejected with values kept, account page shows title/phone/sector, database row, creator wizard still passes all 44 checks.

## 2026-10-09 (creator sign-up wizard and creator photos)
- Creator sign-up is now a multi-step form (`components/CreatorSignupWizard.js`); brands keep the short one-page form. Step 1 "Basic info": first and last name, email, city, gender, phone, one or more categories (30, shown as pick buttons with a counter, labels in `locales/` under `featured.niches`), an optional "About me" text (up to 500 characters) and password with repeat and terms. Step 2 "Photos": one required profile photo and up to 3 optional photos (JPG, PNG or WebP, up to 5 MB each; the real type is checked from the file's first bytes, not its name). Step 3 "Social media": pick platforms (Instagram, TikTok, YouTube, X, Kick), then for each a username and a follower count typed in by hand (not checked; there is no public follower API for most platforms). `CreatorProfile.followers` is the sum over platforms and the card `handle` is the first platform's username. Step 4 "Services and prices": for every platform picked in step 3 the creator builds packages that brands can buy. Each platform tab offers ready packages (for example "1 Reels + 2 Story", "2 TikTok videos") and a custom package; a package has one or more content lines (type and amount, combos allowed), a price typed in by the creator, delivery days, revisions and how long the content stays online. For Kick there is an on-stream ad counted in hours ("10-hour on-stream ad": the brand name stays on screen while the creator streams) and a spoken mention. At least one package is required, at most 8. Packages are saved in the existing `Package` table (new columns `platform`, `contents` as JSON, `revisions`, `stay`), so creators with packages now show up in the creators list with their cheapest price, and `CreatorProfile.deliveryDays` is the fastest package. Package names and descriptions are generated in the sign-up language. Each step is checked before moving on, and again on the server.
- Schema (approved): `CreatorProfile` gets `gender`, `phone`, `categories` (ids separated by commas), `profileImage`, `galleryImages` (file names separated by commas); new `SocialAccount` table (`platform`, `username`, `followers`, unique per creator and platform); `Package` gets `platform`, `contents`, `revisions`, `stay`. Seed creators get one or two social accounts that add up to their follower total. The first picked category is also stored as `niche`, so lists, cards and filters keep working. `npm run reset` is needed after pulling. Seed creators get `categories` = their niche.
- Sign-up form details: "About me" starts empty and shows the instruction ("Introduce yourself and explain why followers and brands should choose you. Optional, up to 500 characters.") as its placeholder inside the box; nothing is pre-filled or saved unless the creator types it. City is a list of all 81 provinces of Turkey, sorted alphabetically in the page language (`CITIES` in `lib/options.js`, labels in `profile.cities`; old ids Istanbul, Ankara, Izmir, Bursa, Antalya are unchanged). Phone is a country code select (default TR +90, 16 codes in `lib/phone.js`) plus the number; it is saved as `+905321234567` and checked by `normalizePhone` in the browser and on the server (a leading 0 is dropped). Each country code has its own digit range (`min`/`max` in `PHONE_CODES`, for example TR 10, DE 10-11, CY 8); while typing, `limitPhoneInput` keeps only digits and cuts the number at the country's maximum, switching the country code re-cuts it, and the placeholder and hint show that country's example and length. The server uses the same table. Placeholder `phonePlaceholder` was replaced by `phoneDigits`.
- Photos are stored in `storage/images/` (git-ignored) under random names and served publicly by `app/api/images/[name]/route.js`. If the account cannot be created (for example duplicate email), the saved photos are removed again. `next.config.mjs`: server actions body limit raised to 25 MB for the 4 photos.
- Photos are now shown: the profile photo replaces the initials avatar on creator cards, the profile page and the account page (`components/Avatar.js` uses `avatar.image` when present); the profile page shows the gallery under "About"; the account page shows the photos and the creator's categories. `lib/queries.js` maps `avatar.image` and `gallery`.
- Fixes found while reviewing sign-up: the form texts (`industry`, `city`, `cityPlaceholder`, `submitting`, `errors`) were in the wrong place in `locales/` (blank labels, form crashed on any error) and are now under `signup`; typed values and photos are no longer wiped after a server error; two sign-ups with the same email at the same moment no longer cause a database error; password repeat added for creators.
- Verified in a real build with a browser test (40 checks): every step-1 and step-3 error, tabs keeping values, photos shown on profile and account, every step-1 error, missing/fake/oversize photo, values kept after a server error, 3 photos saved and served, duplicate email (no orphan photos), English and Turkish text, brand sign-up still works, no horizontal scroll at phone width.
  - Files: `prisma/schema.prisma`, `prisma/seed.mjs`, `lib/options.js`, `lib/images.js`, `lib/services.js`, `lib/queries.js`, `app/api/images/[name]/route.js`, `app/[lang]/auth/actions.js`, `app/[lang]/account/page.js`, `app/[lang]/creators/[slug]/page.js`, `components/CreatorSignupWizard.js`, `components/CreatorServicesStep.js`, `components/SignupForm.js`, `components/Avatar.js`, `locales/en.js`, `locales/tr.js`, `next.config.mjs`, `.gitignore`

## 2026-10-09 (default creator bio in locales)
- The starter bio of a new creator ("New on InfluenceIt.") is no longer hardcoded in `signUpAction`; it comes from `signup.defaultBio` in `locales/` and follows the language of the sign-up page (English or Turkish). It is stored in the database as written at sign-up.
  - Files: `app/[lang]/auth/actions.js`, `locales/en.js`, `locales/tr.js`
  - Why: project rule "no hardcoded UI strings".

## 2026-10-08 (real login and sign-up)
- Sign-up and log-in now work for real. Sign-up asks for the extra details each side needs: brands give a brand name and industry; creators give a handle, niche and city (a public profile is created, hidden from the creators list until packages exist). Passwords are hashed with Node's built-in `scrypt` (`lib/password.mjs`), so no new package was needed. Login is a signed, HTTP-only cookie valid for 7 days (`lib/session.js`, optional `SESSION_SECRET` in `.env`).
- The system knows the account type: after log-in or sign-up everyone lands on `/{lang}/account`, which shows brand or creator details, a log-out button and the next step. The header shows "My account" when logged in; the mobile menu too.
- Seed accounts: every seed user has `<slug>@example.com` (brands: for example `northloom-coffee@example.com`) and the shared demo password `demo1234`; the log-in page shows two examples. `npm run reset` is needed again.
- Verified end to end against a real build: wrong password, correct login for creator and brand (both languages), duplicate email, short password, new creator and brand sign-up, tampered cookie rejected, log-out clears the cookie.
  - Files: `app/[lang]/auth/actions.js`, `app/[lang]/account/page.js`, `components/SignupForm.js`, `components/LoginPanels.js`, `components/HeaderAccount.js`, `components/SiteHeader.js`, `components/MobileNav.js`, `lib/password.mjs`, `lib/session.js`, `lib/options.js`, `lib/routes.js`, `lib/queries.js`, `prisma/seed.mjs`, `.env.example`, `locales/en.js`, `locales/tr.js`

## 2026-10-08 (creator profile page)
- New page `/{lang}/creators/[slug]`: avatar, verified badge, niche and city, four stats, bio, three packages with fixed prices and delivery days. "Order this package" goes to the brand sign-up for now (ordering comes later). Pages are prebuilt for every creator with `generateStaticParams`.
- Creator cards are clickable (the name is a stretched link; copies in the sliding row stay out of the tab order). Added `getCreator`, `getCreatorSlugs` in `lib/queries.js`, `routes.creatorProfile(slug)`, and a `profile` section in both locale files (city names are translated there).
- Known limit: an unknown slug (for example `/en/creators/nobody`) shows the 404 page with `noindex`, but the HTTP status is 200, because the page is streamed under Cache Components.
  - Files: `app/[lang]/creators/[slug]/page.js`, `components/CreatorCard.js`, `components/CreatorGrid.js`, `lib/queries.js`, `lib/routes.js`, `locales/en.js`, `locales/tr.js`

## 2026-10-08 (pages read from the database)
- Home, creators and jobs pages now read from the database instead of `data/`. New `lib/queries.js` (`getCreators`, `getOpenJobs`) with `"use cache"` so pages still prerender; writes will refresh it with `updateTag("creators" | "jobs")`.
- Schema (approved): new `Job` and `Application` models; `User` gets optional `email` (unique) and `passwordHash` for the coming login. Seed adds 2 brands (Quillon Studio, Pebblewick), 8 open jobs with English and Turkish title/summary, 116 applications, and dark-theme avatar colors. `npm run reset` is needed after pulling.
- Job texts moved from `locales` (`jobs.items`) into the database (`title`/`summary` + optional `titleTr`/`summaryTr`).
  - Files: `prisma/schema.prisma`, `prisma/seed.mjs`, `lib/queries.js`, `components/FeaturedCreators.js`, `components/OpenBriefsSection.js`, `components/BriefCard.js`, `app/[lang]/creators/page.js`, `app/[lang]/jobs/page.js`, `locales/en.js`, `locales/tr.js`
  - `data/creators.js` and `data/briefs.js` are no longer used (deletion waits for approval).

## 2026-10-08 (404 buttons removed)
- Global 404 page no longer has the English / Turkish buttons; it only shows the 404 text in both languages. File: `app/global-not-found.js`.

## 2026-10-08 (active menu, 404 page)
- Top navigation highlights the page you are on (`aria-current="page"`, underline); same in the mobile menu. Header and footer client parts that read the address are wrapped in `Suspense` with plain fallbacks (`components/NavFallbacks.js`).
- New 404 pages: `app/[lang]/not-found.js` (inside the site layout, in the visitor's language) and `app/global-not-found.js` for addresses that match no route (shows English and Turkish). Needed `experimental.globalNotFound: true` in `next.config.mjs`, because the root layout is a dynamic `[lang]` segment.
  - Files: `components/NavLinks.js`, `components/NavFallbacks.js`, `components/NotFoundContent.js`, `components/SiteHeader.js`, `components/SiteFooter.js`, `components/MobileNav.js`, `app/[lang]/not-found.js`, `app/global-not-found.js`, `next.config.mjs`, `locales/` (`notFound`)

## 2026-10-08 (design cleanup)
- Hero headline smaller so the Turkish text no longer takes six lines; arrow icons in buttons no longer shrink; "1,2 B" verified creators shown as "1.200"; creator cards show followers under the handle so all cards have the same height. Files: `components/HeroSection.js`, `components/Button.js`, `components/CreatorCard.js`, `data/stats.js`.

## 2026-10-08 (database, Phase 1)
- Added the Prisma + SQLite database layer: schema with `User`, `CreatorProfile`, `BrandProfile`, `Package`, `Order`; a fixed seed (24 creators, 6 brands, 72 packages, 8 orders in all statuses); `npm run reset` wipes and refills the database.
- `status` and `role` are plain strings; allowed values are in `lib/orderStatus.js` (state machine comes in Phase 3).
- Order stores a copy of the package price (`priceAmount` + `priceCurrency`) so later price changes do not alter old orders.
  - Files: `prisma/schema.prisma`, `prisma/seed.mjs`, `prisma.config.mjs`, `lib/db.js`, `lib/orderStatus.js`, `.env.example`, `package.json`, `package-lock.json`
  - Packages: `@prisma/client`, `@prisma/adapter-better-sqlite3`, `prisma` (all pinned to 7.10.0, the stable line; `latest` was a release candidate).
  - Why: Phase 1 data layer. Home page still uses static `data/`; the first 9 seed creators match it (same ids, followers, starting prices).

## 2026-10-08 (log in)
- Sign-up page redesigned after the user's reference: two large account-type cards (Brand / Creator), first and last name, email, password (min 8), terms checkbox, info box that changes per account type, "Already have an account? Log in" link. Still a prototype. Header: "Brand stories" removed from the top navigation (still in the footer) so the Turkish menu fits on one line; the brand button hides between 1024 and 1279px where "Log in" is shown. Files: `components/SignupForm.js`, `components/SiteHeader.js`, `lib/routes.js`, `locales/`.
- Header button text changed from "Start as a brand" to "Sign up" / "Kayıt ol" (links to `/{lang}/signup`). Files: `components/SiteHeader.js`, `lib/routes.js`, `locales/`.
- Login page is now a single email + password form (no brand/creator panels): the account itself decides whether it is a brand or a creator account. Files: `components/LoginPanels.js`, `locales/`.
- Added a "Log in" button in the header (desktop) and mobile menu, and a `/{lang}/login` page with two separate panels: brand account and creator account. Prototype only: no accounts exist, nothing is sent or stored. Header nav spacing tightened; label tracking `.label-tight` added.
  - Files: `app/[lang]/login/page.js`, `components/LoginPanels.js`, `components/SiteHeader.js`, `components/MobileNav.js`, `lib/routes.js`, `app/globals.css`, `locales/`
  - Why: user request. No new packages.

## 2026-10-08 (multi-page site, two-sided content)
- The site now has real pages per language: `/{lang}` (short overview), `/{lang}/creators` (search + niche filter), `/{lang}/jobs` (open jobs from brands with niche filter), `/{lang}/how-it-works` (steps, numbers, comparison table, FAQ) and `/{lang}/signup` (brand or creator form; prototype, nothing is stored; `?role=creator` preselects the side).
- Header, footer and `<main>` moved into `app/[lang]/layout.js` so every page shares them. Navigation uses real routes (`getNavLinks` in `lib/routes.js`). The language switcher keeps the current page.
- Creators can reach brands: new "Open jobs" marquee on the home page, a job board page, a "For creators" tab in How it works (4 creator steps), creator rows in the comparison table, two creator FAQ items, an "open jobs" statistic and a hero link to open jobs.
- Fictional job data in `data/briefs.js`; all text in `locales/` (EN and TR, `jobs`, `pages`, `signup`, extra `howItWorks`, `hero`, `faq`, `comparison`, `stats` keys).
  - Files: `app/[lang]/` (layout, page, creators, jobs, how-it-works, signup), `components/` (BriefCard, OpenBriefsSection, JobBoard, CreatorDirectory, PageHeader, HowItWorksTabs, SignupForm; updated HowItWorksSection, SiteHeader, MobileNav, SiteFooter, HeroSection, LanguageSwitcher), `lib/routes.js`, `data/briefs.js`, `data/stats.js`, `locales/`, `app/globals.css`
  - Why: user request. No new packages.

## 2026-10-08 (dark burgundy theme, reference-style layout)
- Switched to a dark burgundy theme and a roomier, more visual layout inspired by a reference UGC portfolio site. Content stays a two-sided marketplace.
- New fonts: Manrope (body) replaces DM Sans; Space Mono for labels and navigation. Hero headline accent is italic. Larger radii and section spacing, slower hover transitions.
- New "Content formats" section: scrollable row of gradient placeholder tiles (no photos). New footer with navigation, contact and language switcher. Header shows a small subtitle. Removed the scalloped section edges.
- Closing section (`SignUpCta`) now uses the dark surface with a soft burgundy glow; the brand card is the burgundy gradient accent, the creator card a dark card. Files: `components/SignUpCta.js`, `app/globals.css`.
- The "Content formats" tiles and the featured creator cards now slide sideways on their own (CSS marquee, pauses on hover, static when reduced motion is on). The creator filter chips still work; the row restarts when the filter changes. Files: `components/GallerySection.js`, `components/CreatorGrid.js`, `components/FeaturedCreators.js`.
- Turkish text now says "içerik üretici" instead of "creator" (all occurrences, with correct suffixes). File: `locales/tr.js`. English is unchanged.
- All new text is in `locales/en.js` and `locales/tr.js` (`gallery`, `footer`, `header.tagline`).
  - Files: `app/globals.css`, `app/[lang]/layout.js`, `app/[lang]/page.js`, `components/` (GallerySection and SiteFooter new; Button, SectionHeading, SiteHeader, MobileNav, LanguageSwitcher, HeroSection, ReceiptCard, CreatorCard, CreatorGrid, HowItWorksSection, TestimonialsSection, SignUpCta and others), `data/gallery.js` (new), `data/creators.js`, `locales/`, `CLAUDE.md`
  - Why: user request. No new packages.

## 2026-10-08 (English and Turkish)
- Added a language switcher (EN | TR) in the top bar and a Turkish translation of every UI text. Pages now live at `/en` and `/tr`; `proxy.js` redirects `/` using the saved choice (cookie `NEXT_LOCALE`), then the browser language, then English.
- Numbers, currency and percentages follow the language through the Intl API (for example `₺2.500` and `%96` in Turkish).
- Testimonial quotes and roles, niche names and the receipt package name moved from data files into the locale files. Components receive a `lang` prop and read text with `getMessages(lang)`.
  - Files: `proxy.js`, `locales/` (config.js, index.js, en.js, tr.js), `app/[lang]/layout.js`, `app/[lang]/page.js` (moved from `app/`), `components/LanguageSwitcher.js`, all other `components/`, `lib/routes.js`, `data/testimonials.js`, `data/sampleOrder.js`, `CLAUDE.md`
  - Why: user request. No new packages.
- `dynamicParams` is not allowed together with `cacheComponents` in this Next.js version, so unknown languages are rejected with `notFound()`.

## 2026-10-08 (color system redesign)
- Replaced the cream paper look with a white page and a very light burgundy tint (#FBF1F4) for alternating sections (How it works, Featured creators, Brand stories). Removed the paper grain.
- One color family: burgundy. Removed the tomato accent (hero light spot, stamp, closing button, focus ring) and the amber/orange/sand avatar tones; avatars and the rating star now use burgundy shades.
- Closing section is now a vivid burgundy gradient (#6A1633 to #B0365B) with light spots and glass panels; buttons are white and outlined white.
- Lines changed from warm beige to light pink-gray (#EFE3E8). Focus rings use #B0365B (white on dark sections).
  - Files: `app/globals.css`, `components/` (Button, SiteHeader, SignUpCta, SectionHeading, HowItWorksSection, FeaturedCreators, TestimonialsSection, CreatorCard, and every component that used the focus ring), `data/creators.js`, `CLAUDE.md`
  - Why: user found the cream background aged and asked for a burgundy palette as consistent as the reference site's single-color harmony.

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

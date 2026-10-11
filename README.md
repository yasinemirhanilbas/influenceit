# InfluenceIt

A two-sided marketplace prototype for Turkey where **brands find creators** and **creators find brands**, with a (simulated) escrow payment. It is a demo project, not a production service: everything runs locally and all people, brands and numbers are fictional.

## What works

- Bilingual site (English and Turkish) with a calm light theme.
- Creator directory with search and niche filters, and a public profile page per creator (stats, photos, social accounts, price packages).
- Sign-up for brands (short form) and creators (4-step wizard: basic info, photos, social media, services and prices) and real login with a signed cookie.
- Jobs: brands post jobs, creators apply with a message, brands choose or decline applicants and can close or reopen a job. Each open job shows suggested creators with the reasons for the match (niche, budget, delivery time, rating).
- Orders with a status machine (waiting for payment, paid in escrow, delivered, revision, approved), mock payment and video delivery.
- Creators manage their own packages (price, delivery time, revisions, stay on profile).
- Account page for both roles, terms and privacy pages.

## Run it

Requirements: Node.js 20 or newer.

```bash
npm install
npm run reset   # creates dev.db and fills it with fictional demo data
npm run dev     # http://localhost:3030
```

`npm run reset` can be run again at any time to start from clean demo data.

Demo accounts (password `demo1234`):

| Role | Email |
|---|---|
| Creator | `mira-solis@example.com` |
| Brand | `northloom-coffee@example.com` |

Every seed creator uses `<slug>@example.com` and every seed brand uses its slugified name, for example `marlow-finch@example.com`.

## Demo script (3-5 minutes)

Start clean: `npm run reset`, then `npm run dev`. Use two browser windows (or one normal and one private window).

1. **Brand** (`northloom-coffee@example.com`): open *My account*. Show the open job and the suggested creators with the reasons for each match.
2. **Brand**: click *Post a job*, fill the form, submit. The job appears in the public list.
3. **Creator** (`mira-solis@example.com`, other window): open the job, send an application with a short message. Show *My account* with the status "Waiting".
4. **Brand**: in *My account*, open the applications of the job and click *Choose creator*. The job closes, the creator sees "Chosen".
5. **Brand**: open the creator profile, pick a package, place the order (status "Waiting for payment"), then fill the mock payment form with any numbers and pay: "Paid, in escrow".
6. **Creator**: open the order and deliver it with a short video and a note.
7. **Brand**: ask for a revision once, **creator** delivers again, **brand** approves. The status bar reaches "Approved" and the escrow is shown as released.
8. **Creator**: open *My packages* and edit a package. The public profile shows the change.

Invalid steps are refused on the server (for example approving an unpaid order, or a creator choosing applicants).

## Why these choices (one sentence each)

- **Next.js:** pages and server code in one project, so a small team ships a full flow fast.
- **SQLite + Prisma:** zero setup, a real relational model, and `npm run reset` gives the same clean demo every time.
- **Order status machine:** every change goes through one list of allowed transitions, so a wrong click cannot skip payment or approval.
- **Simulated escrow:** real escrow needs a licensed provider; the demo shows the state changes that a provider would drive.
- **Server-side checks:** roles and ownership are verified in every server action, never only in the interface.
- **Locale files:** all UI text lives in `locales/`, so a new language is one new file.
- **Explainable suggestions:** the matching score is simple on purpose and shows why a creator was suggested.

## Tech stack and why

| Part | Choice | Why |
|---|---|---|
| App | Next.js (App Router, JavaScript) | One codebase for pages and server code; server actions keep forms simple |
| Style | Tailwind CSS v4 | Design tokens in one file (`app/globals.css`) |
| Database | SQLite + Prisma | Zero setup for a local demo, real relational model, easy reset and seed |
| Auth | Own small implementation (`scrypt` password hash, signed HTTP-only cookie) | No extra service to run; enough to show roles and permissions |
| Text | `locales/en.js` and `locales/tr.js` | No hardcoded UI text, a new language is one new file |

## How the main parts fit together

- `prisma/schema.prisma`: User, CreatorProfile, BrandProfile, Package, Order, Job, Application, SocialAccount.
- `lib/queries.js`: cached database reads (`"use cache"` with tags); writes refresh them with `updateTag`.
- `app/[lang]/...`: pages; `app/[lang]/auth/actions.js` and `app/[lang]/jobs/actions.js`: server actions that check the logged-in user and role on the server.
- `lib/matching.js`: explainable creator suggestions (pure functions, easy to test).

## What we did on purpose not build

- **Real payments and escrow.** This needs a licensed payment provider. Here the money is only shown as held until the brand approves.
- **Real identity checks.** Follower counts are typed in by the creator and not verified, because most platforms have no public API for it. In a real product they would come from OAuth connections.
- **Messaging, reviews, notifications, mobile app, deployment.** Out of scope for a demo.

## Next steps

- Dark theme (designed, not built).
- Verified metrics through platform OAuth.
- A search service for larger creator lists.

Detailed history of every change: `CHANGELOG.md`. Working rules and decisions: `CLAUDE.md`.

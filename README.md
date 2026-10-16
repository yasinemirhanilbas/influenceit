# InfluenceIt

A two-sided marketplace prototype for Turkey where **brands find creators** and **creators find brands**, with a (simulated) escrow payment. It is a demo project, not a production service: everything runs locally and all people, brands and numbers are fictional.

## For reviewers: how to run it (about 3 minutes)

1. Install [Node.js](https://nodejs.org) 20 or newer (the LTS version is fine) and Git.
2. Open a terminal and run:
   ```bash
   git clone https://github.com/yasinemirhanilbas/influenceit.git
   cd influenceit
   npm install
   npm run reset
   npm run dev
   ```
3. Open <http://localhost:3030> in your browser. The site is in English and Turkish (switch at the top right).
4. Log in with a demo account (password `demo1234`): brand `northloom-coffee@example.com` or creator `mira-solis@example.com`. Use two browser windows (one private) to play both sides.
5. Follow the **Demo script** below (3-5 minutes), or read `INTERVIEW.md` for the one-page summary.

Good to know:
- Nothing is real: all people, brands, prices and payments are fictional, and the payment form only simulates holding money in escrow. Do not type real card numbers.
- No database or account setup is needed: `npm run reset` creates a local SQLite file with demo data and can be run again at any time to start clean.
- The chat assistant (bottom right) needs a Google Gemini API key, which is not part of the repository. Without it the assistant says it is unavailable and everything else works. To try it, copy `.env.example` to `.env`, set `GEMINI_API_KEY` and `GEMINI_MODEL="gemini-3.5-flash"`, and restart `npm run dev`.
- Run `npm test` for the automated tests (order status machine, creator matching, language files).
- If port 3030 is taken, stop the other program or change the port in `package.json`.

## What works

- Bilingual site (English and Turkish) with a calm light theme.
- Creator directory with search and niche filters, and a public profile page per creator (stats, clickable photo gallery, social accounts, price packages).
- Sign-up for brands (short form) and creators (4-step wizard: basic info, photos, social media, services and prices) and real login with a signed cookie.
- Jobs: brands post jobs, creators apply with a message, brands choose or decline applicants and can close or reopen a job. Each open job shows suggested creators with the reasons for the match (niche, budget, delivery time, rating).
- Orders with a status machine (waiting for payment, paid in escrow, delivered, revision, approved), mock payment and video delivery. Choosing an applicant creates the order from the job; a brand can also order a creator's package from the profile.
- Messaging between brands and creators (inbox with unread count, one conversation per pair, started from a profile, job, order or application).
- Creators manage their own packages (price, delivery time, revisions, stay on profile).
- Account page for both roles, terms and privacy pages.
- Site assistant: a chat bubble (bottom right) powered by Gemini that answers questions about the site only. Needs `GEMINI_API_KEY` in `.env` (see `.env.example`); without it the assistant says it is not available and everything else works.

## Run it

Requirements: Node.js 20 or newer.

```bash
npm install
npm run reset   # creates dev.db and fills it with fictional demo data
npm run dev     # http://localhost:3030
```

`npm run reset` can be run again at any time to start from clean demo data.

Optional: copy `.env.example` to `.env` and set `GEMINI_API_KEY` to turn on the site assistant (key from Google AI Studio; never commit `.env`). Restart `npm run dev` after changing `.env`.

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
4. **Brand**: in *My account*, open the applications of the job and click *Choose creator*. The job closes and an order is created from the job (job price, status "Waiting for payment"). The creator sees "Chosen" and the order appears in *My orders* of both sides.
5. **Brand**: click *Open order* and fill the mock payment form with any numbers: "Paid, in escrow". Before the payment the creator has no delivery form.
6. **Creator**: open *My orders*, open the order and deliver it with a short video and a note.
7. **Brand**: ask for a revision once, **creator** delivers again, **brand** approves. The status bar reaches "Approved" and the escrow is shown as released.
8. **Brand** or **creator**: open *Messages* (or the "Message" button on an order or profile), write a message, and answer it from the other window.
9. **Creator**: open *My packages* and edit a package. The public profile shows the change.
10. **Anyone**: click the chat bubble (bottom right) and ask, for example, "How does escrow work?". Then ask something off topic ("Write me a poem") to show that it politely declines.

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

## Project structure

| Folder | What lives there |
|---|---|
| `app/[lang]/` | Pages for `/en` and `/tr`. Each feature has its own folder (`jobs`, `orders`, `messages`, `account`, `creators`, ...); server actions sit next to their pages in `actions.js`. |
| `app/api/` | Routes that are not pages: `images` (public creator photos), `orders/[id]/video` (only the two parties), `assistant` (chat assistant). |
| `components/` | Reusable parts. Files starting with `Order`, `Message`, `Creator`, `Job` belong to that feature; the rest are shared (header, footer, buttons). |
| `lib/` | Logic without pages: database reads (`queries.js`), the order status machine (`orderStatus.js`, `orders.js`), matching, messaging, sessions, uploads, formatting, link targets (`routes.js`), allowed option lists (`options.js`). |
| `locales/` | All UI text: `en.js` and `tr.js` with the same keys. |
| `data/` | Fixed sample content for the home page (brands, testimonials, gallery). |
| `prisma/` | Schema, seed script and seed photos (`npm run reset` rebuilds `dev.db`). |
| `tests/` | `npm test`. |

Rules of thumb: a new page goes in `app/[lang]/<feature>/`, its link in `lib/routes.js`, its text in both locale files; permission checks belong in the server action, not only in the interface; money is stored as a number plus a currency; the database is `dev.db` (not committed), uploads are in `storage/` (not committed). Editor basics are in `.editorconfig`.

Database models: User, CreatorProfile, SocialAccount, BrandProfile, Package, Order, Job, Application, Conversation, Message.

## What we did on purpose not build

- **Real payments and escrow.** This needs a licensed payment provider. Here the money is only shown as held until the brand approves.
- **Real identity checks.** Follower counts are typed in by the creator and not verified, because most platforms have no public API for it. In a real product they would come from OAuth connections.
- **Reviews, notifications (including email), mobile app, deployment.** Out of scope for a demo. Messaging is simple on purpose: text only, refreshed every few seconds, no attachments.

## Next steps

- Dark theme (designed, not built).
- Verified metrics through platform OAuth.
- A search service for larger creator lists.

Run the tests with `npm test` (order status machine, creator matching, language files). A one-page summary for interviews is in `INTERVIEW.md`.

Detailed history of every change: `CHANGELOG.md`. Working rules and decisions: `CLAUDE.md`.

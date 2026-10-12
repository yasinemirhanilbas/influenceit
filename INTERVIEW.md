# InfluenceIt: interview summary

A creator–brand marketplace prototype for Turkey, built to show a complete, working main flow in a short time. Everything is fictional demo data.

## The problem
Brands and influencers find each other through scattered direct messages. Trust is weak on both sides: the brand fears paying for work that never arrives, the creator fears delivering and not being paid. Briefs, prices, deadlines and revisions live in chat threads.

## The idea
One place where a brand finds a creator (or a creator finds a job), agrees a fixed price, and the money is held until the brand approves the work. The prototype simulates the held payment; the rest is real working software.

## Demo (3-5 minutes)
Step by step in `README.md` ("Demo script"). In short: brand posts a job, a creator applies, the brand chooses, an order is created from the job, the brand pays (held in escrow), the creator delivers a video, the brand asks for one revision and then approves. Messaging works at every step.

## What is real and what is simulated
- Real: sign-up and login (own implementation), roles and permissions checked on the server, database, order status machine, video upload with content checks, messaging, creator suggestions with reasons, two languages (English and Turkish).
- Simulated on purpose: payment and escrow, follower numbers (typed in, not verified). Real versions need a licensed payment provider and OAuth with the social platforms.

## Technical decisions, one sentence each
- **Next.js (App Router, plain JavaScript):** pages and server code in one project; server actions keep forms simple.
- **SQLite + Prisma:** no setup for a demo, a real relational model, and `npm run reset` gives the same clean data every time.
- **Order status machine (`lib/orderStatus.js`):** one list of allowed moves, used by the pages (which buttons to show) and by the server (what to accept), so a wrong click cannot skip payment or approval.
- **Server-side permission checks:** every action checks who is logged in and who owns the record, never only the interface.
- **Pure, explainable matching (`lib/matching.js`):** a simple score (niche, budget, delivery time, rating) that shows why a creator was suggested; easy to test.
- **Text in `locales/`:** no hardcoded UI text, so a new language is one new file.
- **Tests (`npm test`):** the status machine, the matching score and the language files (same keys, same placeholders) are covered.

## Known limits (said honestly)
No rate limit on login, a fallback session secret for local use, no security headers, text-only messaging with periodic refresh, no notifications, no real payments. The first three are small fixes (see the Backlog in `CLAUDE.md`).

## How I would grow it in a team
1. **Payments:** a licensed provider with real escrow (for example a marketplace payment product), webhooks drive the same status machine.
2. **Verified metrics:** OAuth connections to the platforms so follower counts and audience data are read, not typed.
3. **Search:** a search service (or database full-text search first) once the creator list is large, with filters and ranking.
4. **Trust and safety:** reviews after approved orders, dispute handling, reporting and blocking users.
5. **Operations:** PostgreSQL, object storage for media, background jobs for notifications and emails, monitoring, and rate limits.
6. **Quality:** end-to-end tests of the demo flow in CI.

// Single shared Prisma client. Import `db` from here; do not create new clients elsewhere.
// The globalThis cache keeps one client alive across hot reloads in `next dev`.
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

function createClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
  return new PrismaClient({ adapter });
}

const globalForDb = globalThis;

export const db = globalForDb.__influenceitDb ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__influenceitDb = db;
}

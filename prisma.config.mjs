// Prisma CLI configuration (Prisma 7 reads the database URL from here).
// A local .env file is optional; the default points at a SQLite file in the project root.
try {
  process.loadEnvFile();
} catch {
  // No .env file: fall back to the default below.
}

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});

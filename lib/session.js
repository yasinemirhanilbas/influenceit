// Login session: a signed cookie that holds the user id and an expiry time.
// The signature uses SESSION_SECRET (set it in .env; the fallback below is for local demos only).
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { db } from "@/lib/db";

const COOKIE = "influenceit_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function secret() {
  return process.env.SESSION_SECRET ?? "local-demo-secret-change-me";
}

function sign(payload) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function createToken(userId) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function readToken(token) {
  const [payload, signature] = (token ?? "").split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export async function startSession(userId) {
  const store = await cookies();
  store.set(COOKIE, createToken(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production", // browsers still accept it on http://localhost
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

// The logged-in user (with brand or creator profile), or null.
export async function getSessionUser() {
  await connection(); // request-time only: the expiry check below reads the clock
  const store = await cookies();
  const data = readToken(store.get(COOKIE)?.value);
  if (!data) return null;
  return db.user.findUnique({
    where: { id: data.uid },
    include: { brandProfile: true, creatorProfile: true },
  });
}

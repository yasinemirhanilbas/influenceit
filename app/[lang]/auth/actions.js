"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { CITIES, NICHES } from "@/lib/options";
import { hashPassword, verifyPassword } from "@/lib/password.mjs";
import { getRoutes } from "@/lib/routes";
import { endSession, startSession } from "@/lib/session";
import { isLocale } from "@/locales";

// Server actions for sign-up, log-in and log-out.
// They return { error: "<key>" } on failure; the forms translate the key with locales (signup.errors / login.errors).

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AVATAR_SHAPES = ["circle", "arch", "square"];
const AVATAR_COLORS = [
  ["#F4C2D0", "#22111A"],
  ["#E9809F", "#22111A"],
  ["#B0365B", "#FFFFFF"],
  ["#D9A5B8", "#22111A"],
  ["#F8E1E8", "#5A1229"],
  ["#8E2748", "#FFFFFF"],
];

const text = (formData, key) => String(formData.get(key) ?? "").trim();

function safeLang(formData) {
  const lang = text(formData, "lang");
  return isLocale(lang) ? lang : "en";
}

function slugify(value) {
  return value
    .toLocaleLowerCase("en")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(base) {
  let slug = base || "creator";
  let n = 1;
  while (await db.creatorProfile.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function signUpAction(_previous, formData) {
  const lang = safeLang(formData);
  const role = text(formData, "role") === "creator" ? "CREATOR" : "BRAND";
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!firstName || !lastName || firstName.length > 40 || lastName.length > 40) return { error: "name" };
  if (!EMAIL.test(email)) return { error: "email" };
  if (password.length < 8) return { error: "password" };
  if (formData.get("terms") !== "on") return { error: "terms" };
  if (await db.user.findUnique({ where: { email } })) return { error: "emailTaken" };

  const name = `${firstName} ${lastName}`;
  const niche = text(formData, "niche");
  if (!NICHES.includes(niche)) return { error: "niche" };
  const passwordHash = await hashPassword(password);

  let user;
  if (role === "BRAND") {
    const companyName = text(formData, "companyName");
    if (!companyName || companyName.length > 60) return { error: "company" };
    user = await db.user.create({
      data: {
        role,
        name,
        email,
        passwordHash,
        brandProfile: { create: { companyName, industry: niche } },
      },
    });
  } else {
    const handleBase = text(formData, "handle").replace(/^@/, "").toLowerCase();
    const city = text(formData, "city");
    if (!/^[a-z0-9._]{2,30}$/.test(handleBase)) return { error: "handle" };
    if (!CITIES.includes(city)) return { error: "city" };
    const slug = await uniqueSlug(slugify(name));
    const pick = slug.length % AVATAR_COLORS.length;
    user = await db.user.create({
      data: {
        role,
        name,
        email,
        passwordHash,
        creatorProfile: {
          create: {
            slug,
            handle: `@${handleBase}`,
            niche,
            city,
            bio: "New on InfluenceIt.",
            followers: 0,
            rating: 0,
            completedOrders: 0,
            deliveryDays: 3,
            verified: false,
            avatarShape: AVATAR_SHAPES[slug.length % AVATAR_SHAPES.length],
            avatarBg: AVATAR_COLORS[pick][0],
            avatarFg: AVATAR_COLORS[pick][1],
          },
        },
      },
    });
    updateTag("creators");
  }

  await startSession(user.id);
  redirect(getRoutes(lang).account);
}

export async function logInAction(_previous, formData) {
  const lang = safeLang(formData);
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = email ? await db.user.findUnique({ where: { email } }) : null;
  // Same error for "no such email" and "wrong password" so the form does not reveal which accounts exist.
  if (!user || !(await verifyPassword(password, user.passwordHash))) return { error: "invalid" };
  await startSession(user.id);
  redirect(getRoutes(lang).account);
}

export async function logOutAction(formData) {
  const lang = safeLang(formData);
  await endSession();
  redirect(getRoutes(lang).home);
}

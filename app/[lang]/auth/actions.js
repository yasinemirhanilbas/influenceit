"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { deleteImages, inspectImage, saveImage } from "@/lib/images";
import { ABOUT_MAX, CATEGORIES, CITIES, FOLLOWERS_MAX, GALLERY_MAX, GENDERS, NICHES, PLATFORMS, USERNAME_PATTERN } from "@/lib/options";
import { hashPassword, verifyPassword } from "@/lib/password.mjs";
import { normalizePhone } from "@/lib/phone";
import { getRoutes } from "@/lib/routes";
import { endSession, startSession } from "@/lib/session";
import { getMessages, isLocale } from "@/locales";

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

// Brand sign-up (one page). Creators use creatorSignUpAction below (multi-step form).
export async function signUpAction(_previous, formData) {
  const lang = safeLang(formData);
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const companyName = text(formData, "companyName");
  const industry = text(formData, "niche");

  if (!firstName || !lastName || firstName.length > 40 || lastName.length > 40) return { error: "name" };
  if (!EMAIL.test(email)) return { error: "email" };
  if (password.length < 8) return { error: "password" };
  if (!companyName || companyName.length > 60) return { error: "company" };
  if (!NICHES.includes(industry)) return { error: "niche" };
  if (formData.get("terms") !== "on") return { error: "terms" };
  if (await db.user.findUnique({ where: { email } })) return { error: "emailTaken" };

  let user;
  try {
    user = await db.user.create({
      data: {
        role: "BRAND",
        name: `${firstName} ${lastName}`,
        email,
        passwordHash: await hashPassword(password),
        brandProfile: { create: { companyName, industry } },
      },
    });
  } catch (error) {
    // Two sign-ups with the same email at the same moment: the database unique index catches the second one.
    if (error?.code === "P2002") return { error: "emailTaken" };
    throw error;
  }

  await startSession(user.id);
  redirect(getRoutes(lang).account);
}

// Creator sign-up (multi-step form). Steps: 1 basic info, 2 photos, 3 social accounts (4 services: nothing to send yet).
// Errors carry a key from signup.errors.
export async function creatorSignUpAction(_previous, formData) {
  const lang = safeLang(formData);
  const firstName = text(formData, "firstName");
  const lastName = text(formData, "lastName");
  const email = text(formData, "email").toLowerCase();
  const gender = text(formData, "gender");
  const city = text(formData, "city");
  const about = text(formData, "about");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");
  const phone = normalizePhone(text(formData, "phoneCode"), text(formData, "phone"));
  const categories = [...new Set(formData.getAll("categories").map(String))];

  // Step 1
  if (!firstName || !lastName || firstName.length > 40 || lastName.length > 40) return { error: "name" };
  if (!EMAIL.test(email)) return { error: "email" };
  if (!GENDERS.includes(gender)) return { error: "gender" };
  if (!phone) return { error: "phone" };
  if (!CITIES.includes(city)) return { error: "city" };
  if (categories.length === 0 || !categories.every((id) => CATEGORIES.includes(id))) return { error: "categories" };
  if (about.length > ABOUT_MAX) return { error: "about" };
  if (password.length < 8) return { error: "password" };
  if (password !== passwordConfirm) return { error: "passwordMatch" };
  if (formData.get("terms") !== "on") return { error: "terms" };

  // Step 2
  const profileFile = formData.get("profileImage");
  if (!(profileFile instanceof File) || profileFile.size === 0) return { error: "profileImage" };
  const galleryFiles = formData.getAll("gallery").filter((file) => file instanceof File && file.size > 0);
  if (galleryFiles.length > GALLERY_MAX) return { error: "imageType" };
  const inspected = [];
  for (const file of [profileFile, ...galleryFiles]) {
    const result = await inspectImage(file);
    if (result.error) return { error: result.error };
    inspected.push(result);
  }

  // Step 3: at least one platform, each with a username and a follower count typed by the creator.
  const picked = [...new Set(formData.getAll("platforms").map(String))].filter((id) => PLATFORMS.includes(id));
  if (picked.length === 0) return { error: "platforms" };
  const socialAccounts = [];
  for (const platform of picked) {
    const username = text(formData, `${platform}_username`).replace(/^@/, "");
    const followersText = text(formData, `${platform}_followers`);
    if (!USERNAME_PATTERN.test(username)) return { error: "socialUsername" };
    if (!/^\d{1,10}$/.test(followersText) || Number(followersText) > FOLLOWERS_MAX) return { error: "socialFollowers" };
    socialAccounts.push({ platform, username, followers: Number(followersText) });
  }
  const totalFollowers = socialAccounts.reduce((sum, account) => sum + account.followers, 0);

  if (await db.user.findUnique({ where: { email } })) return { error: "emailTaken" };

  // Everything is valid: now write the photos to disk, then the account.
  const savedNames = [];
  for (const image of inspected) savedNames.push(await saveImage(image));
  const [profileImage, ...galleryImages] = savedNames;

  const name = `${firstName} ${lastName}`;
  const slug = await uniqueSlug(slugify(name));
  const pick = slug.length % AVATAR_COLORS.length;
  let user;
  try {
    user = await db.user.create({
      data: {
        role: "CREATOR",
        name,
        email,
        passwordHash: await hashPassword(password),
        creatorProfile: {
          create: {
            slug,
            // The handle shown on cards is the username of the first platform the creator listed.
            handle: `@${socialAccounts[0].username}`,
            niche: categories[0],
            categories: categories.join(","),
            city,
            gender,
            phone,
            bio: about || getMessages(lang).signup.defaultBio,
            profileImage,
            galleryImages: galleryImages.join(","),
            followers: totalFollowers,
            rating: 0,
            completedOrders: 0,
            deliveryDays: 3,
            verified: false,
            avatarShape: AVATAR_SHAPES[slug.length % AVATAR_SHAPES.length],
            avatarBg: AVATAR_COLORS[pick][0],
            avatarFg: AVATAR_COLORS[pick][1],
            socialAccounts: { create: socialAccounts },
          },
        },
      },
    });
  } catch (error) {
    await deleteImages(savedNames);
    if (error?.code === "P2002") return { error: "emailTaken" };
    throw error;
  }
  updateTag("creators");

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

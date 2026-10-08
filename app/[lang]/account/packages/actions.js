"use server";

import { refresh, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { PACKAGE_LIMITS } from "@/lib/options";
import { getSessionUser } from "@/lib/session";

// Server actions for creators to manage their own packages.
// They return { error: "<key>" } on failure; the forms translate the key with locales (packages.errors).
// On success they return { ok: "added" | "saved" | "deleted", at: <timestamp> }.

const text = (formData, key) => String(formData.get(key) ?? "").trim();

// The creator profile of the logged-in user, or null (not logged in, or a brand account).
async function getOwnCreatorProfile() {
  const user = await getSessionUser();
  return user?.role === "CREATOR" ? user.creatorProfile : null;
}

function readWholeNumber(value, min, max) {
  if (!/^\d{1,9}$/.test(value)) return null;
  const number = Number(value);
  return number >= min && number <= max ? number : null;
}

// Validates the shared form fields. Returns { data } or { error }.
function readFields(formData) {
  const name = text(formData, "name");
  const description = text(formData, "description");
  const priceAmount = readWholeNumber(text(formData, "price"), 1, PACKAGE_LIMITS.priceMax);
  const deliveryDays = readWholeNumber(text(formData, "deliveryDays"), 1, PACKAGE_LIMITS.daysMax);

  if (!name || name.length > PACKAGE_LIMITS.nameMax) return { error: "name" };
  if (!description || description.length > PACKAGE_LIMITS.descriptionMax) return { error: "description" };
  if (priceAmount === null) return { error: "price" };
  if (deliveryDays === null) return { error: "days" };
  return { data: { name, description, priceAmount, deliveryDays } };
}

// A package id from the form, only if it belongs to this creator.
async function findOwnPackage(creator, formData) {
  const id = Number(text(formData, "id"));
  if (!Number.isInteger(id) || id < 1) return null;
  return db.package.findFirst({ where: { id, creatorId: creator.id }, select: { id: true } });
}

// Lists and profile pages read creators through a cached query: expire it, then refresh this page.
function showChanges() {
  updateTag("creators");
  refresh();
}

// Adds a package, or updates one when the form contains a package id.
export async function savePackageAction(_previous, formData) {
  const creator = await getOwnCreatorProfile();
  if (!creator) return { error: "forbidden" };

  const parsed = readFields(formData);
  if (parsed.error) return parsed;

  if (formData.get("id")) {
    const own = await findOwnPackage(creator, formData);
    if (!own) return { error: "notFound" };
    await db.package.update({ where: { id: own.id }, data: parsed.data });
    showChanges();
    return { ok: "saved", at: Date.now() };
  }

  const count = await db.package.count({ where: { creatorId: creator.id } });
  if (count >= PACKAGE_LIMITS.maxPackages) return { error: "limit" };
  await db.package.create({ data: { ...parsed.data, priceCurrency: "TRY", creatorId: creator.id } });
  showChanges();
  return { ok: "added", at: Date.now() };
}

// Deletes a package. Packages that already have orders are kept (orders point to them).
export async function deletePackageAction(_previous, formData) {
  const creator = await getOwnCreatorProfile();
  if (!creator) return { error: "forbidden" };

  const own = await findOwnPackage(creator, formData);
  if (!own) return { error: "notFound" };
  if ((await db.order.count({ where: { packageId: own.id } })) > 0) return { error: "hasOrders" };

  await db.package.delete({ where: { id: own.id } });
  showChanges();
  return { ok: "deleted", at: Date.now() };
}

"use server";

import { redirect } from "next/navigation";
import { refresh, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { applyTransition, getOrderForUser } from "@/lib/orders";
import { ORDER_ACTIONS, ORDER_STATUS, ROLE, canPerform } from "@/lib/orderStatus";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { deleteVideo, saveVideo } from "@/lib/storage";
import { isLocale } from "@/locales";

// Server actions for the order flow. They return { error: "<key>" } on failure (forms translate it with
// locales orders.errors) or { ok: "<what happened>", at } on success. Every action checks again who the
// user is and whether the order is theirs and in the right status; the buttons on the page are only a hint.

const text = (formData, key) => String(formData.get(key) ?? "").trim();

function safeLang(formData) {
  const lang = text(formData, "lang");
  return isLocale(lang) ? lang : "en";
}

function isWebLink(value) {
  if (value.length > 300) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Finds the order from the form, checks the user's side and that this action is allowed right now.
async function loadOrder(formData, action) {
  const user = await getSessionUser();
  if (!user) return { error: "forbidden" };
  const found = await getOrderForUser(user, text(formData, "id"));
  if (!found) return { error: "notFound" };
  if (found.role !== ORDER_ACTIONS[action].role) return { error: "forbidden" };
  if (!canPerform(action, found.order.status, found.role)) return { error: "invalidState" };
  return found;
}

export async function createOrderAction(_previous, formData) {
  const lang = safeLang(formData);
  const user = await getSessionUser();
  if (!user || user.role !== ROLE.BRAND || !user.brandProfile) return { error: "forbidden" };

  const brief = text(formData, "brief");
  if (brief.length < 20 || brief.length > 1000) return { error: "brief" };

  const packageId = Number(text(formData, "packageId"));
  const pkg = Number.isInteger(packageId) && packageId > 0 ? await db.package.findUnique({ where: { id: packageId } }) : null;
  if (!pkg) return { error: "package" };

  const order = await db.order.create({
    data: {
      brandId: user.brandProfile.id,
      creatorId: pkg.creatorId,
      packageId: pkg.id,
      brief,
      status: ORDER_STATUS.PENDING,
      packageName: pkg.name,
      priceAmount: pkg.priceAmount,
      priceCurrency: pkg.priceCurrency,
    },
  });
  redirect(getRoutes(lang).order(order.id));
}

// Mock payment: card details are checked in the browser only and never reach this action.
export async function payOrderAction(_previous, formData) {
  const found = await loadOrder(formData, "pay");
  if (found.error) return found;
  if (!(await applyTransition(found.order.id, "pay"))) return { error: "invalidState" };
  refresh();
  return { ok: "paid", at: Date.now() };
}

// The creator delivers a link, a video, or both. On a redelivery the old video stays unless a new one is sent.
export async function deliverOrderAction(_previous, formData) {
  const found = await loadOrder(formData, "deliver");
  if (found.error) return found;
  const { order } = found;

  const link = text(formData, "link");
  const note = text(formData, "note");
  const file = formData.get("video");
  const hasNewVideo = Boolean(file) && typeof file === "object" && file.size > 0;

  if (link && !isWebLink(link)) return { error: "link" };
  if (note.length > 500) return { error: "note" };
  if (!link && !hasNewVideo && !order.deliveryVideo) return { error: "linkOrVideo" };

  let newVideo = null;
  if (hasNewVideo) {
    const saved = await saveVideo(file);
    if (saved.error) return saved;
    newVideo = saved.name;
  }

  const moved = await applyTransition(order.id, "deliver", {
    deliveryLink: link || null,
    deliveryNote: note || null,
    deliveryVideo: newVideo ?? order.deliveryVideo,
  });
  if (!moved) {
    if (newVideo) await deleteVideo(newVideo);
    return { error: "invalidState" };
  }
  if (newVideo && order.deliveryVideo) await deleteVideo(order.deliveryVideo);
  refresh();
  return { ok: "delivered", at: Date.now() };
}

export async function approveOrderAction(_previous, formData) {
  const found = await loadOrder(formData, "approve");
  if (found.error) return found;
  if (!(await applyTransition(found.order.id, "approve"))) return { error: "invalidState" };
  updateTag("creators"); // the creator's completed-orders number is shown on lists and profiles
  refresh();
  return { ok: "approved", at: Date.now() };
}

export async function reviseOrderAction(_previous, formData) {
  const found = await loadOrder(formData, "revise");
  if (found.error) return found;
  const revisionNote = text(formData, "revisionNote");
  if (revisionNote.length < 5 || revisionNote.length > 500) return { error: "revisionNote" };
  if (!(await applyTransition(found.order.id, "revise", { revisionNote }))) return { error: "invalidState" };
  refresh();
  return { ok: "revised", at: Date.now() };
}

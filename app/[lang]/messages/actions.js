"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { db } from "@/lib/db";
import { MESSAGES_PER_MINUTE, MESSAGE_MAX, getConversationForUser } from "@/lib/messages";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { isLocale } from "@/locales";

// Server actions for messaging. Both sides can start a conversation: a brand with a creator (creatorSlug),
// a creator with a brand (brandId). Errors from sendMessageAction are keys of messages.errors.

const text = (formData, key) => String(formData.get(key) ?? "").trim();

function safeLang(formData) {
  const lang = text(formData, "lang");
  return isLocale(lang) ? lang : "en";
}

// Opens the conversation with the other party (creating it the first time) and goes to it.
export async function startConversationAction(formData) {
  const routes = getRoutes(safeLang(formData));
  const user = await getSessionUser();
  if (!user) redirect(routes.login);

  let brandId = null;
  let creatorId = null;
  if (user.brandProfile) {
    const creator = await db.creatorProfile.findUnique({ where: { slug: text(formData, "creatorSlug") }, select: { id: true } });
    if (creator) {
      brandId = user.brandProfile.id;
      creatorId = creator.id;
    }
  } else if (user.creatorProfile) {
    const brandNumber = Number(text(formData, "brandId"));
    const brand = Number.isInteger(brandNumber) ? await db.brandProfile.findUnique({ where: { id: brandNumber }, select: { id: true } }) : null;
    if (brand) {
      brandId = brand.id;
      creatorId = user.creatorProfile.id;
    }
  }
  if (brandId === null) redirect(routes.messages);

  const conversation = await db.conversation.upsert({
    where: { brandId_creatorId: { brandId, creatorId } },
    update: {},
    create: { brandId, creatorId },
  });
  redirect(routes.message(conversation.id));
}

export async function sendMessageAction(_previous, formData) {
  const user = await getSessionUser();
  if (!user) return { error: "notAllowed" };

  const body = text(formData, "body");
  if (!body) return { error: "empty" };
  if (body.length > MESSAGE_MAX) return { error: "tooLong" };

  const conversation = await getConversationForUser(user, text(formData, "conversationId"));
  if (!conversation) return { error: "notAllowed" };

  const recent = await db.message.count({ where: { senderId: user.id, createdAt: { gt: new Date(Date.now() - 60_000) } } });
  if (recent >= MESSAGES_PER_MINUTE) return { error: "tooFast" };

  const now = new Date();
  await db.$transaction([
    db.message.create({ data: { conversationId: conversation.id, senderId: user.id, body, createdAt: now } }),
    db.conversation.update({ where: { id: conversation.id }, data: { updatedAt: now } }),
  ]);
  refresh();
  return { sent: now.getTime() };
}

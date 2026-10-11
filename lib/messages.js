// Messaging between brands and creators (server-side helpers). One conversation per brand-creator pair.
import { db } from "@/lib/db";

export { MESSAGES_PER_MINUTE, MESSAGE_MAX } from "@/lib/messages-config";

// "BRAND" or "CREATOR" side of a conversation for this user, or null when the user is not part of it.
export function sideOf(conversation, user) {
  if (user.brandProfile && user.brandProfile.id === conversation.brandId) return "BRAND";
  if (user.creatorProfile && user.creatorProfile.id === conversation.creatorId) return "CREATOR";
  return null;
}

// The conversation with both parties, only when the user is one of them (otherwise null).
export async function getConversationForUser(user, id) {
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) return null;
  const conversation = await db.conversation.findUnique({
    where: { id: numeric },
    include: { brand: { include: { user: true } }, creator: { include: { user: true } } },
  });
  if (!conversation || !sideOf(conversation, user)) return null;
  return conversation;
}

// The other party as plain data: { name, subtitle, avatar, href }. The brand has no photo, so it gets a neutral square.
export function counterpartOf(conversation, side) {
  if (side === "BRAND") {
    const creator = conversation.creator;
    return {
      kind: "CREATOR",
      name: creator.user.name,
      subtitle: creator.handle,
      slug: creator.slug,
      avatar: { shape: creator.avatarShape, bg: creator.avatarBg, fg: creator.avatarFg, imageName: creator.profileImage },
    };
  }
  return {
    kind: "BRAND",
    name: conversation.brand.companyName,
    subtitle: conversation.brand.industry,
    slug: null,
    avatar: { shape: "square", bg: "#E2D6DA", fg: "#2A1F24", imageName: null },
  };
}

// Conversation list for the inbox: newest activity first, with the last message and the unread count for this user.
export async function listConversations(user) {
  const where = user.brandProfile
    ? { brandId: user.brandProfile.id }
    : user.creatorProfile
      ? { creatorId: user.creatorProfile.id }
      : { id: -1 };
  const rows = await db.conversation.findMany({
    where,
    include: {
      brand: { include: { user: true } },
      creator: { include: { user: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      _count: { select: { messages: { where: { senderId: { not: user.id }, readAt: null } } } },
    },
    orderBy: { updatedAt: "desc" },
  });
  const side = user.brandProfile ? "BRAND" : "CREATOR";
  return rows.map((row) => ({
    id: row.id,
    counterpart: counterpartOf(row, side),
    last: row.messages[0] ?? null,
    unread: row._count.messages,
  }));
}

// Number of unread messages for the user (used for the badge on the account page).
export async function countUnread(user) {
  const where = user.brandProfile
    ? { conversation: { brandId: user.brandProfile.id } }
    : user.creatorProfile
      ? { conversation: { creatorId: user.creatorProfile.id } }
      : null;
  if (!where) return 0;
  return db.message.count({ where: { ...where, senderId: { not: user.id }, readAt: null } });
}

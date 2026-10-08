// Order reads and the one safe way to change an order's status.
// Pages and server actions both use these, so the access and status rules exist in one place.
import { db } from "@/lib/db";
import { ORDER_ACTIONS, ROLE } from "@/lib/orderStatus";

const orderInclude = {
  brand: true,
  creator: { include: { user: true } },
};

// Which side of the order this user is on ("BRAND" or "CREATOR"), or null for everyone else.
export function getOrderRole(user, order) {
  if (user?.role === ROLE.BRAND && user.brandProfile?.id === order.brandId) return ROLE.BRAND;
  if (user?.role === ROLE.CREATOR && user.creatorProfile?.id === order.creatorId) return ROLE.CREATOR;
  return null;
}

// The order and the user's side of it, or null when it does not exist or is not theirs.
export async function getOrderForUser(user, id) {
  const orderId = Number(id);
  if (!user || !Number.isInteger(orderId) || orderId < 1) return null;
  const order = await db.order.findUnique({ where: { id: orderId }, include: orderInclude });
  if (!order) return null;
  const role = getOrderRole(user, order);
  return role ? { order, role } : null;
}

// All orders of the logged-in brand (placed) or creator (received), newest first.
export async function listOrdersForUser(user) {
  const where = user.role === ROLE.BRAND ? { brandId: user.brandProfile?.id ?? -1 } : { creatorId: user.creatorProfile?.id ?? -1 };
  return db.order.findMany({ where, include: orderInclude, orderBy: { createdAt: "desc" } });
}

const TIMESTAMP = { pay: "paidAt", deliver: "deliveredAt", approve: "completedAt" };

// Moves an order along ORDER_ACTIONS in one atomic step. The update only matches while the order is
// still in an allowed starting status, so a double click or a second browser tab cannot apply it twice.
// Approving also counts one more completed order for the creator, in the same transaction.
// Returns true when the order moved, false when it was no longer in the right status.
export async function applyTransition(orderId, action, data = {}) {
  const rule = ORDER_ACTIONS[action];
  return db.$transaction(async (tx) => {
    const result = await tx.order.updateMany({
      where: { id: orderId, status: { in: rule.from } },
      data: { ...data, status: rule.to, ...(TIMESTAMP[action] ? { [TIMESTAMP[action]]: new Date() } : {}) },
    });
    if (result.count !== 1) return false;
    if (action === "approve") {
      const order = await tx.order.findUnique({ where: { id: orderId }, select: { creatorId: true } });
      await tx.creatorProfile.update({ where: { id: order.creatorId }, data: { completedOrders: { increment: 1 } } });
    }
    return true;
  });
}

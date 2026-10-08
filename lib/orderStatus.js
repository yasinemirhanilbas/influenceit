// Allowed order statuses and user roles. The database stores them as plain strings.
// The status machine itself (allowed transitions) is built in Phase 3.
export const ORDER_STATUS = {
  PENDING: "PENDING", // created, not paid yet
  PAID: "PAID", // mock payment done, money held in escrow
  DELIVERED: "DELIVERED", // creator submitted the work
  REVISION: "REVISION", // brand asked for changes
  APPROVED: "APPROVED", // brand approved, escrow released
};

export const ORDER_STATUS_VALUES = Object.values(ORDER_STATUS);

export const ROLE = {
  BRAND: "BRAND",
  CREATOR: "CREATOR",
};

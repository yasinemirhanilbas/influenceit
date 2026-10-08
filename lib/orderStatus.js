// Order statuses, user roles and the rules for moving an order from one status to the next.
// The database stores them as plain strings. Everything about "who may do what, and when"
// lives here, so pages (which buttons to show) and server actions (what to allow) agree.
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

// The only allowed moves. Anything not listed here is rejected.
// "role" is who may do it; "from" are the statuses it can start from; "to" is the new status.
export const ORDER_ACTIONS = {
  pay: { role: ROLE.BRAND, from: [ORDER_STATUS.PENDING], to: ORDER_STATUS.PAID },
  deliver: { role: ROLE.CREATOR, from: [ORDER_STATUS.PAID, ORDER_STATUS.REVISION], to: ORDER_STATUS.DELIVERED },
  approve: { role: ROLE.BRAND, from: [ORDER_STATUS.DELIVERED], to: ORDER_STATUS.APPROVED },
  revise: { role: ROLE.BRAND, from: [ORDER_STATUS.DELIVERED], to: ORDER_STATUS.REVISION },
};

export function canPerform(action, status, role) {
  const rule = ORDER_ACTIONS[action];
  return Boolean(rule) && rule.role === role && rule.from.includes(status);
}

// Names of the actions this role may take right now on an order in this status.
export function getAvailableActions(status, role) {
  return Object.keys(ORDER_ACTIONS).filter((action) => canPerform(action, status, role));
}

// Position on the four-step progress bar (0 = order placed ... 3 = approved).
// A revision goes back to "work in progress", the same step as PAID.
export const PROGRESS_STEP = {
  PENDING: 0,
  PAID: 1,
  REVISION: 1,
  DELIVERED: 2,
  APPROVED: 3,
};

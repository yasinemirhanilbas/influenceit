import { test } from "node:test";
import assert from "node:assert/strict";
import { ORDER_STATUS, ORDER_ACTIONS, ROLE, PROGRESS_STEP, canPerform, getAvailableActions } from "../lib/orderStatus.js";

const { PENDING, PAID, DELIVERED, REVISION, APPROVED } = ORDER_STATUS;

test("happy path: pay, deliver, approve", () => {
  assert.equal(canPerform("pay", PENDING, ROLE.BRAND), true);
  assert.equal(canPerform("deliver", PAID, ROLE.CREATOR), true);
  assert.equal(canPerform("approve", DELIVERED, ROLE.BRAND), true);
});

test("revision loop: revise, deliver again, approve", () => {
  assert.equal(canPerform("revise", DELIVERED, ROLE.BRAND), true);
  assert.equal(canPerform("deliver", REVISION, ROLE.CREATOR), true);
});

test("an unpaid order cannot be delivered or approved", () => {
  assert.equal(canPerform("deliver", PENDING, ROLE.CREATOR), false);
  assert.equal(canPerform("approve", PENDING, ROLE.BRAND), false);
  assert.equal(canPerform("approve", PAID, ROLE.BRAND), false);
});

test("an approved order is final", () => {
  for (const action of Object.keys(ORDER_ACTIONS)) {
    for (const role of Object.values(ROLE)) assert.equal(canPerform(action, APPROVED, role), false);
  }
});

test("the wrong role is refused", () => {
  assert.equal(canPerform("pay", PENDING, ROLE.CREATOR), false);
  assert.equal(canPerform("deliver", PAID, ROLE.BRAND), false);
  assert.equal(canPerform("approve", DELIVERED, ROLE.CREATOR), false);
});

test("unknown actions, statuses and roles are refused", () => {
  assert.equal(canPerform("refund", PAID, ROLE.BRAND), false);
  assert.equal(canPerform("pay", "NOPE", ROLE.BRAND), false);
  assert.equal(canPerform("pay", PENDING, "ADMIN"), false);
});

test("available actions per status and role", () => {
  assert.deepEqual(getAvailableActions(PENDING, ROLE.BRAND), ["pay"]);
  assert.deepEqual(getAvailableActions(DELIVERED, ROLE.BRAND).sort(), ["approve", "revise"]);
  assert.deepEqual(getAvailableActions(PAID, ROLE.CREATOR), ["deliver"]);
  assert.deepEqual(getAvailableActions(PAID, ROLE.BRAND), []);
});

test("every status has a progress step", () => {
  for (const status of Object.values(ORDER_STATUS)) assert.equal(typeof PROGRESS_STEP[status], "number");
});

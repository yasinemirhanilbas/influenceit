import { test } from "node:test";
import assert from "node:assert/strict";
import { MATCH_MIN_SCORE, MATCH_LIMIT, scoreCreator, suggestCreators } from "../lib/matching.js";

const job = { niche: "Food", budgetAmount: 3000, budgetCurrency: "TRY", deliveryDays: 5 };
const creator = (over = {}) => ({
  id: 1,
  niches: ["Food"],
  rating: 5,
  completedOrders: 10,
  cheapestPrice: { amount: 2500, currency: "TRY" },
  fastestDays: 3,
  ...over,
});

test("a perfect creator scores 100 with four reasons plus niche", () => {
  const { score, reasons } = scoreCreator(job, creator());
  assert.equal(score, 100);
  assert.deepEqual(reasons.map((r) => r.type), ["niche", "budget", "delivery", "rating"]);
});

test("a price up to 20% over budget gets half the budget points", () => {
  const { score, reasons } = scoreCreator(job, creator({ cheapestPrice: { amount: 3600, currency: "TRY" } }));
  assert.equal(score, 85);
  assert.ok(reasons.some((r) => r.type === "budgetClose"));
});

test("a price far over budget or in another currency gets no budget points", () => {
  assert.equal(scoreCreator(job, creator({ cheapestPrice: { amount: 9000, currency: "TRY" } })).score, 70);
  assert.equal(scoreCreator(job, creator({ cheapestPrice: { amount: 100, currency: "USD" } })).score, 70);
});

test("slow delivery gets no delivery points; no rating gets no rating points", () => {
  assert.equal(scoreCreator(job, creator({ fastestDays: 9 })).score, 85);
  assert.equal(scoreCreator(job, creator({ rating: 0 })).score, 85);
});

test("suggestions need the job's niche", () => {
  const out = suggestCreators(job, [creator({ id: 1, niches: ["Travel"] })]);
  assert.deepEqual(out, []);
});

test("suggestions need the minimum score", () => {
  const weak = creator({ id: 2, rating: 0, cheapestPrice: { amount: 9000, currency: "TRY" }, fastestDays: 9 });
  assert.equal(scoreCreator(job, weak).score, 40);
  assert.equal(suggestCreators(job, [weak]).length, 1);
  assert.ok(MATCH_MIN_SCORE <= 40);
});

test("best first, limited, and excluded creators are skipped", () => {
  const list = [1, 2, 3, 4, 5].map((id) => creator({ id, rating: id }));
  const out = suggestCreators(job, list);
  assert.equal(out.length, MATCH_LIMIT);
  assert.deepEqual(out.map((m) => m.creator.id), [5, 4, 3]);
  const skipped = suggestCreators(job, list, { excludeIds: [5] });
  assert.deepEqual(skipped.map((m) => m.creator.id), [4, 3, 2]);
});

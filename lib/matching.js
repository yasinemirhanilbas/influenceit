// Suggests creators for a job with a simple, explainable score (0-100). Pure functions: no database access here.
// Each reason is { type, ...values }; the page turns it into text with locales (account.match.reasons).
export const MATCH_MIN_SCORE = 40;
export const MATCH_LIMIT = 3;

// job: { niche, budgetAmount, budgetCurrency, deliveryDays }
// creator: { niches: string[], rating, completedOrders, cheapestPrice: { amount, currency }, fastestDays }
export function scoreCreator(job, creator) {
  let score = 0;
  const reasons = [];

  // Niche fit: 40 points.
  if (creator.niches.includes(job.niche)) {
    score += 40;
    reasons.push({ type: "niche" });
  }

  // Budget fit: 30 points when the cheapest package fits, 15 when it is at most 20% over.
  const price = creator.cheapestPrice;
  if (price && price.currency === job.budgetCurrency) {
    if (price.amount <= job.budgetAmount) {
      score += 30;
      reasons.push({ type: "budget", amount: price.amount, currency: price.currency });
    } else if (price.amount <= job.budgetAmount * 1.2) {
      score += 15;
      reasons.push({ type: "budgetClose", amount: price.amount, currency: price.currency });
    }
  }

  // Delivery fit: 15 points when the fastest package is not slower than the job asks.
  if (creator.fastestDays && creator.fastestDays <= job.deliveryDays) {
    score += 15;
    reasons.push({ type: "delivery", days: creator.fastestDays });
  }

  // Track record: up to 15 points from the rating (5 stars = 15).
  if (creator.rating > 0) {
    score += Math.round((creator.rating / 5) * 15);
    reasons.push({ type: "rating", rating: creator.rating, orders: creator.completedOrders });
  }

  return { score, reasons };
}

// Best creators for one job: they must work in the job's niche and reach MATCH_MIN_SCORE points; highest first, at most `limit`.
// Creators in `excludeIds` (for example those who already applied) are skipped.
export function suggestCreators(job, creators, { limit = MATCH_LIMIT, excludeIds = [] } = {}) {
  return creators
    .filter((creator) => !excludeIds.includes(creator.id))
    .map((creator) => ({ creator, ...scoreCreator(job, creator) }))
    .filter((match) => match.reasons.some((reason) => reason.type === "niche") && match.score >= MATCH_MIN_SCORE)
    .sort((a, b) => b.score - a.score || b.creator.completedOrders - a.creator.completedOrders)
    .slice(0, limit);
}

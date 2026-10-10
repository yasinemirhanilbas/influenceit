// Packages a creator sells, built in the last sign-up step. Shared by the sign-up form (browser) and the server action.
// A package = one platform + a few content lines (type and amount) + a price the creator sets.

// Content types per platform. Labels come from locales: signup.creator.services.types["<platform>_<type>"].
export const CONTENT_TYPES = {
  instagram: ["story", "reels", "carousel", "post"],
  tiktok: ["video"],
  youtube: ["video", "short", "integration"],
  x: ["post", "thread"],
  kick: ["stream_ad", "stream_mention"],
};

// Types whose amount is counted in hours (the brand name stays on the live stream for that long) instead of pieces.
export const HOUR_TYPES = ["kick_stream_ad"];
export const isHourType = (platform, type) => HOUR_TYPES.includes(`${platform}_${type}`);
export const countRange = (platform, type) => (isHourType(platform, type) ? { min: 1, max: 48 } : { min: 1, max: 20 });

// Ready-made starting points: lists of [type, amount]. The creator can change everything afterwards.
export const PRESETS = {
  instagram: [
    [["story", 1]],
    [["story", 3]],
    [["reels", 1]],
    [["carousel", 1]],
    [["reels", 1], ["story", 1]],
    [["reels", 1], ["story", 2]],
    [["reels", 1], ["post", 1], ["story", 3]],
  ],
  tiktok: [[["video", 1]], [["video", 2]], [["video", 3]]],
  youtube: [[["integration", 1]], [["video", 1]], [["short", 1]], [["video", 1], ["short", 2]]],
  x: [[["post", 1]], [["post", 3]], [["thread", 1]]],
  kick: [[["stream_ad", 5]], [["stream_ad", 10]], [["stream_ad", 20]], [["stream_ad", 10], ["stream_mention", 3]]],
};
export const DEFAULT_DELIVERY_DAYS = { instagram: 3, tiktok: 4, youtube: 7, x: 2, kick: 3 };

// How long the content stays online ("" = not specified).
export const STAY_OPTIONS = ["", "24h", "7d", "30d", "permanent"];

export const PACKAGES_MAX = 8;
export const ITEMS_MAX = 5;
export const PRICE_MAX = 1_000_000;
export const DELIVERY_MAX = 60;
export const REVISIONS_MAX = 5;

const isWhole = (value) => /^\d+$/.test(String(value ?? "").trim());

// Checks a list of packages from the form. Returns { packages } (cleaned, safe to save) or { error, platform? }.
// Error keys: services (none or malformed), servicePrice, serviceDetails.
export function normalizePackages(raw, platforms) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > PACKAGES_MAX) return { error: "services" };
  const packages = [];
  for (const entry of raw) {
    const platform = entry?.platform;
    if (!platforms.includes(platform) || !CONTENT_TYPES[platform]) return { error: "services" };
    const fail = (error) => ({ error, platform });

    const items = Array.isArray(entry.items) ? entry.items : [];
    if (items.length === 0 || items.length > ITEMS_MAX) return fail("serviceDetails");
    const cleanItems = [];
    for (const item of items) {
      if (!CONTENT_TYPES[platform].includes(item?.type) || !isWhole(item?.count)) return fail("serviceDetails");
      const count = Number(item.count);
      const { min, max } = countRange(platform, item.type);
      if (count < min || count > max) return fail("serviceDetails");
      cleanItems.push({ type: item.type, count });
    }
    // The same type twice in one package would make a confusing name; merge or reject.
    if (new Set(cleanItems.map((item) => item.type)).size !== cleanItems.length) return fail("serviceDetails");

    if (!isWhole(entry.price) || Number(entry.price) < 1 || Number(entry.price) > PRICE_MAX) return fail("servicePrice");
    if (!isWhole(entry.deliveryDays) || Number(entry.deliveryDays) < 1 || Number(entry.deliveryDays) > DELIVERY_MAX) return fail("serviceDetails");
    if (!isWhole(entry.revisions) || Number(entry.revisions) > REVISIONS_MAX) return fail("serviceDetails");
    const stay = String(entry.stay ?? "");
    if (!STAY_OPTIONS.includes(stay)) return fail("serviceDetails");

    packages.push({
      platform,
      items: cleanItems,
      price: Number(entry.price),
      deliveryDays: Number(entry.deliveryDays),
      revisions: Number(entry.revisions),
      stay,
    });
  }
  return { packages };
}

// "2 TikTok Video", "1 Reels + 2 Story", "10-hour on-screen ad": built from the locale templates in services.types.
export function packageName(platform, items, services) {
  return items
    .map((item) => services.types[`${platform}_${item.type}`].name.replace("{count}", String(item.count)))
    .join(" + ");
}

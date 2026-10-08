// Seed script: fills the database with FICTIONAL creators, brands and orders.
// No real people, brands or logos. Data is fixed (no randomness), so every machine gets the same result.
// Run with: npm run db:seed (or npm run reset to wipe and refill).
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const db = new PrismaClient({ adapter });

const CURRENCY = "TRY";
const CITIES = ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Istanbul", "Izmir", "Ankara"];

// slug | name | handle | niche | followers | rating | completedOrders | deliveryDays | startingPrice | avatarShape | avatarBg | avatarFg
const CREATORS = [
  ["mira-solis", "Mira Solis", "@mira.solis", "Beauty", 42100, 4.9, 86, 3, 2500, "circle", "#F4C7B8", "#1C1917"],
  ["arda-valen", "Arda Valen", "@arda.valen", "Tech", 76500, 4.8, 64, 4, 4800, "arch", "#7A1F3D", "#FFFFFF"],
  ["eylul-rowan", "Eylül Rowan", "@eylul.rowan", "Food", 18400, 5.0, 41, 2, 1200, "square", "#E9B949", "#1C1917"],
  ["kaan-hollis", "Kaan Hollis", "@kaan.hollis", "Fitness", 31900, 4.7, 58, 3, 2000, "circle", "#F2542D", "#1C1917"],
  ["lale-brandt", "Lale Brandt", "@lale.brandt", "Travel", 58200, 4.9, 73, 5, 3600, "arch", "#DCCDB6", "#1C1917"],
  ["deniz-faro", "Deniz Faro", "@deniz.faro", "Home", 24700, 4.8, 35, 3, 1800, "square", "#1C1917", "#FBF7F0"],
  ["zeynep-calder", "Zeynep Calder", "@zeynep.calder", "Beauty", 27300, 4.8, 52, 3, 1500, "square", "#F4C7B8", "#1C1917"],
  ["emre-quill", "Emre Quill", "@emre.quill", "Tech", 612000, 4.6, 97, 5, 9500, "circle", "#22111A", "#FBF7F0"],
  ["defne-harlow", "Defne Harlow", "@defne.harlow", "Fitness", 38600, 4.9, 44, 2, 2200, "arch", "#E9B949", "#1C1917"],
  ["selin-marlow", "Selin Marlow", "@selin.marlow", "Beauty", 33400, 4.7, 39, 3, 1700, "circle", "#DCCDB6", "#1C1917"],
  ["baran-oakley", "Baran Oakley", "@baran.oakley", "Tech", 51200, 4.8, 47, 4, 3900, "arch", "#22111A", "#FBF7F0"],
  ["nehir-alden", "Nehir Alden", "@nehir.alden", "Food", 22100, 4.9, 61, 2, 1400, "square", "#F2542D", "#1C1917"],
  ["tolga-reeve", "Tolga Reeve", "@tolga.reeve", "Fitness", 87400, 4.6, 70, 4, 5200, "circle", "#7A1F3D", "#FFFFFF"],
  ["ada-winslow", "Ada Winslow", "@ada.winslow", "Travel", 41800, 4.8, 55, 5, 2900, "arch", "#E9B949", "#1C1917"],
  ["cem-ardent", "Cem Ardent", "@cem.ardent", "Home", 19600, 4.7, 28, 3, 1300, "square", "#DCCDB6", "#1C1917"],
  ["ece-thornton", "Ece Thornton", "@ece.thornton", "Home", 64300, 4.9, 82, 3, 4100, "circle", "#F4C7B8", "#1C1917"],
  ["onur-vale", "Onur Vale", "@onur.vale", "Tech", 98500, 4.5, 66, 4, 4600, "arch", "#1C1917", "#FBF7F0"],
  ["ipek-marden", "İpek Marden", "@ipek.marden", "Beauty", 15800, 4.8, 31, 2, 1000, "square", "#E9B949", "#1C1917"],
  ["burak-linden", "Burak Linden", "@burak.linden", "Tech", 29700, 4.7, 36, 3, 2300, "circle", "#F2542D", "#1C1917"],
  ["selma-prescott", "Selma Prescott", "@selma.prescott", "Food", 47200, 4.9, 59, 3, 2700, "arch", "#7A1F3D", "#FFFFFF"],
  ["yigit-calloway", "Yiğit Calloway", "@yigit.calloway", "Fitness", 23500, 4.6, 33, 2, 1600, "square", "#DCCDB6", "#1C1917"],
  ["naz-fenwick", "Naz Fenwick", "@naz.fenwick", "Beauty", 35900, 4.8, 48, 3, 2400, "circle", "#22111A", "#FBF7F0"],
  ["kerem-ashby", "Kerem Ashby", "@kerem.ashby", "Travel", 72600, 4.7, 62, 5, 4400, "arch", "#F4C7B8", "#1C1917"],
  ["duru-kessler", "Duru Kessler", "@duru.kessler", "Tech", 26400, 4.8, 29, 3, 1900, "square", "#E9B949", "#1C1917"],
];

const BIOS = {
  Beauty: "Honest skincare and makeup reviews. Short, clear videos that show real results.",
  Tech: "Hands-on gadget and app reviews. No hype, just what works and what does not.",
  Food: "Home cooking and local flavors, shot in natural light with simple recipes.",
  Fitness: "Training routines and healthy habits for busy people, from home or the gym.",
  Travel: "Weekend routes and hidden spots, with practical tips on budget and timing.",
  Home: "Small-space styling and everyday home ideas that are easy to copy.",
};

// name | industry | budget (TRY)
const BRANDS = [
  ["Northloom Coffee", "Food & Drink", 30000],
  ["Marlow & Finch", "Fashion", 45000],
  ["Tamarind Lane", "Food & Drink", 20000],
  ["Kiln & Co.", "Home", 25000],
  ["Oakmoor Goods", "Home", 35000],
  ["Sunday Fig", "Beauty", 40000],
];

// Package templates: price is a multiple of the creator's starting price (rounded to 50).
const PACKAGE_TEMPLATES = [
  { name: "1 Story", description: "One story frame with your product and a link sticker.", factor: 1, daysExtra: 0 },
  { name: "1 Reel", description: "One short video, filmed and edited by the creator.", factor: 1.3, daysExtra: 1 },
  { name: "1 Reel + 3 Stories", description: "A reel plus three story frames for the same campaign.", factor: 1.68, daysExtra: 2 },
];

const roundTo50 = (value) => Math.round(value / 50) * 50;
const daysAgo = (days) => new Date(Date.UTC(2026, 9, 8, 9, 0, 0) - days * 86400000);

// brandIndex | creatorSlug | packageIndex | status | brief | daysAgo
const ORDERS = [
  [0, "eylul-rowan", 1, "PENDING", "Show our new cold brew in a simple morning routine.", 1],
  [1, "mira-solis", 2, "PAID", "Autumn collection campaign: styling and a short unboxing.", 3],
  [2, "nehir-alden", 0, "PAID", "Quick story about our spice blend with a recipe idea.", 4],
  [3, "deniz-faro", 1, "DELIVERED", "Place our ceramic mugs in a cozy kitchen scene.", 9],
  [4, "ece-thornton", 2, "REVISION", "Living room refresh with our wooden shelves. Please show the shelves earlier.", 12],
  [5, "zeynep-calder", 1, "APPROVED", "Daily routine video with our face cream.", 20],
  [0, "selma-prescott", 2, "APPROVED", "Weekend brunch featuring our coffee beans.", 25],
  [1, "naz-fenwick", 0, "PENDING", "Story with our new scarf and a discount code.", 0],
];

async function main() {
  // Wipe in dependency order so the seed can be re-run safely.
  await db.order.deleteMany();
  await db.package.deleteMany();
  await db.creatorProfile.deleteMany();
  await db.brandProfile.deleteMany();
  await db.user.deleteMany();

  const creatorBySlug = new Map();
  for (const [index, row] of CREATORS.entries()) {
    const [slug, name, handle, niche, followers, rating, completedOrders, deliveryDays, startingPrice, avatarShape, avatarBg, avatarFg] = row;
    const user = await db.user.create({ data: { role: "CREATOR", name } });
    const profile = await db.creatorProfile.create({
      data: {
        userId: user.id,
        slug,
        handle,
        niche,
        city: CITIES[index % CITIES.length],
        bio: BIOS[niche],
        followers,
        rating,
        completedOrders,
        deliveryDays,
        verified: rating >= 4.7,
        avatarShape,
        avatarBg,
        avatarFg,
        packages: {
          create: PACKAGE_TEMPLATES.map((template) => ({
            name: template.name,
            description: template.description,
            priceAmount: roundTo50(startingPrice * template.factor),
            priceCurrency: CURRENCY,
            deliveryDays: deliveryDays + template.daysExtra,
          })),
        },
      },
      include: { packages: { orderBy: { priceAmount: "asc" } } },
    });
    creatorBySlug.set(slug, profile);
  }

  const brands = [];
  for (const [companyName, industry, budget] of BRANDS) {
    const user = await db.user.create({ data: { role: "BRAND", name: companyName } });
    brands.push(
      await db.brandProfile.create({
        data: { userId: user.id, companyName, industry, budgetAmount: budget, budgetCurrency: CURRENCY },
      }),
    );
  }

  for (const [brandIndex, slug, packageIndex, status, brief, ago] of ORDERS) {
    const creator = creatorBySlug.get(slug);
    const pkg = creator.packages[packageIndex];
    const created = daysAgo(ago);
    const paid = status === "PENDING" ? null : new Date(created.getTime() + 3600000);
    const delivered = ["DELIVERED", "REVISION", "APPROVED"].includes(status)
      ? new Date(created.getTime() + pkg.deliveryDays * 86400000)
      : null;
    await db.order.create({
      data: {
        brandId: brands[brandIndex].id,
        creatorId: creator.id,
        packageId: pkg.id,
        brief,
        status,
        priceAmount: pkg.priceAmount,
        priceCurrency: pkg.priceCurrency,
        deliveryLink: delivered ? `https://example.com/delivery/${slug}` : null,
        createdAt: created,
        paidAt: paid,
        deliveredAt: delivered,
        completedAt: status === "APPROVED" ? new Date(delivered.getTime() + 86400000) : null,
      },
    });
  }

  const counts = {
    users: await db.user.count(),
    creators: await db.creatorProfile.count(),
    brands: await db.brandProfile.count(),
    packages: await db.package.count(),
    orders: await db.order.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

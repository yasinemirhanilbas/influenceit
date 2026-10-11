// Seed script: fills the database with FICTIONAL creators, brands and orders.
// No real people, brands or logos. Data is fixed (no randomness), so every machine gets the same result.
// Run with: npm run db:seed (or npm run reset to wipe and refill).
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { hashPassword } from "../lib/password.mjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const db = new PrismaClient({ adapter });

const CURRENCY = "TRY";

// Fictional seed photos (abstract illustrations, no real people) live in prisma/seed-images/.
// They are copied into storage/images/ under a fixed 32-character name, the same place real uploads go.
const SEED_IMAGE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "seed-images");
const STORAGE_IMAGE_DIR = path.join(process.cwd(), "storage", "images");
function placeSeedImage(file) {
  const source = path.join(SEED_IMAGE_DIR, file);
  if (!existsSync(source)) return null;
  mkdirSync(STORAGE_IMAGE_DIR, { recursive: true });
  const name = `${createHash("md5").update(file).digest("hex")}.jpg`;
  copyFileSync(source, path.join(STORAGE_IMAGE_DIR, name));
  return name;
}
// Every seed account uses this shared demo password. Emails are <slug>@example.com.
const DEMO_PASSWORD = "demo1234";
const CITIES = ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Istanbul", "Izmir", "Ankara"];

// slug | name | handle | niche | followers | rating | completedOrders | deliveryDays | startingPrice | avatarShape | avatarBg | avatarFg
const CREATORS = [
  ["mira-solis", "Mira Solis", "@mira.solis", "Beauty", 42100, 4.9, 86, 3, 2500, "circle", "#D9C4CB", "#2A1F24"],
  ["arda-valen", "Arda Valen", "@arda.valen", "Tech", 76500, 4.8, 64, 4, 4800, "arch", "#C9D1C8", "#2A1F24"],
  ["eylul-rowan", "Eylül Rowan", "@eylul.rowan", "Food", 18400, 5.0, 41, 2, 1200, "square", "#D4CBB8", "#2A1F24"],
  ["kaan-hollis", "Kaan Hollis", "@kaan.hollis", "Fitness", 31900, 4.7, 58, 3, 2000, "circle", "#C7CDD3", "#2A1F24"],
  ["lale-brandt", "Lale Brandt", "@lale.brandt", "Travel", 58200, 4.9, 73, 5, 3600, "arch", "#CDB6BD", "#2A1F24"],
  ["deniz-faro", "Deniz Faro", "@deniz.faro", "Home", 24700, 4.8, 35, 3, 1800, "square", "#E2D6DA", "#2A1F24"],
  ["zeynep-calder", "Zeynep Calder", "@zeynep.calder", "Beauty", 27300, 4.8, 52, 3, 1500, "square", "#D9C4CB", "#2A1F24"],
  ["emre-quill", "Emre Quill", "@emre.quill", "Tech", 612000, 4.6, 97, 5, 9500, "circle", "#BDA7AF", "#2A1F24"],
  ["defne-harlow", "Defne Harlow", "@defne.harlow", "Fitness", 38600, 4.9, 44, 2, 2200, "arch", "#D4CBB8", "#2A1F24"],
  ["selin-marlow", "Selin Marlow", "@selin.marlow", "Beauty", 33400, 4.7, 39, 3, 1700, "circle", "#CDB6BD", "#2A1F24"],
  ["baran-oakley", "Baran Oakley", "@baran.oakley", "Tech", 51200, 4.8, 47, 4, 3900, "arch", "#BDA7AF", "#2A1F24"],
  ["nehir-alden", "Nehir Alden", "@nehir.alden", "Food", 22100, 4.9, 61, 2, 1400, "square", "#C7CDD3", "#2A1F24"],
  ["tolga-reeve", "Tolga Reeve", "@tolga.reeve", "Fitness", 87400, 4.6, 70, 4, 5200, "circle", "#C9D1C8", "#2A1F24"],
  ["ada-winslow", "Ada Winslow", "@ada.winslow", "Travel", 41800, 4.8, 55, 5, 2900, "arch", "#D4CBB8", "#2A1F24"],
  ["cem-ardent", "Cem Ardent", "@cem.ardent", "Home", 19600, 4.7, 28, 3, 1300, "square", "#CDB6BD", "#2A1F24"],
  ["ece-thornton", "Ece Thornton", "@ece.thornton", "Home", 64300, 4.9, 82, 3, 4100, "circle", "#D9C4CB", "#2A1F24"],
  ["onur-vale", "Onur Vale", "@onur.vale", "Tech", 98500, 4.5, 66, 4, 4600, "arch", "#E2D6DA", "#2A1F24"],
  ["ipek-marden", "İpek Marden", "@ipek.marden", "Beauty", 15800, 4.8, 31, 2, 1000, "square", "#D4CBB8", "#2A1F24"],
  ["burak-linden", "Burak Linden", "@burak.linden", "Tech", 29700, 4.7, 36, 3, 2300, "circle", "#C7CDD3", "#2A1F24"],
  ["selma-prescott", "Selma Prescott", "@selma.prescott", "Food", 47200, 4.9, 59, 3, 2700, "arch", "#C9D1C8", "#2A1F24"],
  ["yigit-calloway", "Yiğit Calloway", "@yigit.calloway", "Fitness", 23500, 4.6, 33, 2, 1600, "square", "#CDB6BD", "#2A1F24"],
  ["naz-fenwick", "Naz Fenwick", "@naz.fenwick", "Beauty", 35900, 4.8, 48, 3, 2400, "circle", "#BDA7AF", "#2A1F24"],
  ["kerem-ashby", "Kerem Ashby", "@kerem.ashby", "Travel", 72600, 4.7, 62, 5, 4400, "arch", "#D9C4CB", "#2A1F24"],
  ["duru-kessler", "Duru Kessler", "@duru.kessler", "Tech", 26400, 4.8, 29, 3, 1900, "square", "#D4CBB8", "#2A1F24"],
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
  ["Northloom Coffee", "Food", 30000],
  ["Marlow & Finch", "Fashion", 45000],
  ["Tamarind Lane", "Food", 20000],
  ["Kiln & Co.", "Home", 25000],
  ["Oakmoor Goods", "Home", 35000],
  ["Sunday Fig", "Beauty", 40000],
  ["Quillon Studio", "Tech", 50000],
  ["Pebblewick", "Home", 25000],
];

// Open jobs. brandIndex | niche | format | budget | deliveryDays | applicants | title | summary | titleTr | summaryTr
const JOBS = [
  [0, "Food", "reelStories", 3000, 5, 12, "Coffee subscription launch reel", "Show your morning routine with our new subscription box.", "Kahve aboneliği lansman reel'i", "Yeni abonelik kutumuzla sabah rutinini göster."],
  [1, "Beauty", "tutorial", 2500, 4, 18, "Skincare routine tutorial", "A five-step evening routine with our new serum.", "Cilt bakım rutini eğitimi", "Yeni serumumuzla beş adımlı bir akşam rutini."],
  [2, "Travel", "vlog", 4500, 7, 9, "Weekend city escape vlog", "Share a two-day trip using our travel tote.", "Hafta sonu şehir kaçamağı vlogu", "Seyahat çantamızla iki günlük bir gezi paylaş."],
  [3, "Home", "photoSet", 3500, 6, 14, "Ceramic mugs photo set", "Styled kitchen shots of our new mug collection.", "Seramik kupa fotoğraf seti", "Yeni kupa koleksiyonumuz için şık mutfak kareleri."],
  [4, "Fitness", "review", 2800, 5, 21, "Training bottle honest review", "Use our bottle for a week and tell us what you think.", "Antrenman matarası dürüst inceleme", "Matarayı bir hafta kullan ve ne düşündüğünü anlat."],
  [5, "Food", "review", 1800, 3, 24, "Seasonal jam taste test", "A first taste of our autumn jam flavors.", "Mevsimlik reçel tadım testi", "Sonbahar reçel çeşitlerimizin ilk tadımı."],
  [6, "Tech", "unboxing", 5200, 6, 7, "Desk gadget unboxing", "Unbox and set up our compact desk dock.", "Masa aksesuarı kutu açılımı", "Kompakt masa istasyonumuzu aç ve kur."],
  [7, "Home", "reelStories", 2200, 4, 11, "Cozy corner room refresh", "Show how our throw blankets change a small corner.", "Rahat köşe yenileme", "Battaniyelerimizin küçük bir köşeyi nasıl değiştirdiğini göster."],
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
  [4, "ece-thornton", 2, "REVISION", "Living room refresh with our wooden shelves.", 12],
  [5, "zeynep-calder", 1, "APPROVED", "Daily routine video with our face cream.", 20],
  [0, "selma-prescott", 2, "APPROVED", "Weekend brunch featuring our coffee beans.", 25],
  [1, "naz-fenwick", 0, "PENDING", "Story with our new scarf and a discount code.", 0],
];

async function main() {
  // Wipe in dependency order so the seed can be re-run safely.
  await db.message.deleteMany();
  await db.conversation.deleteMany();
  await db.socialAccount.deleteMany();
  await db.order.deleteMany();
  await db.application.deleteMany();
  await db.job.deleteMany();
  await db.package.deleteMany();
  await db.creatorProfile.deleteMany();
  await db.brandProfile.deleteMany();
  await db.user.deleteMany();

  const passwordHash = await hashPassword(DEMO_PASSWORD);
  const creatorBySlug = new Map();
  for (const [index, row] of CREATORS.entries()) {
    const [slug, name, handle, niche, followers, rating, completedOrders, deliveryDays, startingPrice, avatarShape, avatarBg, avatarFg] = row;
    const user = await db.user.create({ data: { role: "CREATOR", name, email: `${slug}@example.com`, passwordHash } });
    const profile = await db.creatorProfile.create({
      data: {
        userId: user.id,
        slug,
        handle,
        niche,
        categories: niche,
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
        profileImage: placeSeedImage(`${slug}-profile.jpg`),
        // 0, 1 or 2 extra photos, depending on the creator
        galleryImages: [1, 2].map((n) => placeSeedImage(`${slug}-gallery-${n}.jpg`)).filter(Boolean).join(","),
        // Split the follower total over one or two platforms so the numbers add up.
        socialAccounts: {
          create:
            index % 2 === 0
              ? [
                  { platform: "instagram", username: handle.replace(/^@/, ""), followers: Math.round(followers * 0.7) },
                  { platform: "tiktok", username: handle.replace(/^@/, ""), followers: followers - Math.round(followers * 0.7) },
                ]
              : [{ platform: "instagram", username: handle.replace(/^@/, ""), followers }],
        },
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
    const user = await db.user.create({ data: { role: "BRAND", name: companyName, email: `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}@example.com`, passwordHash } });
    brands.push(
      await db.brandProfile.create({
        data: { userId: user.id, companyName, companyTitle: `${companyName} Ltd.`, phone: `+90555010${String(brands.length).padStart(4, "0")}`, industry, budgetAmount: budget, budgetCurrency: CURRENCY },
      }),
    );
  }

  // Applications: the first N creators (starting at a different place per job) apply to each job.
  const creatorProfiles = [...creatorBySlug.values()];
  for (const [jobIndex, row] of JOBS.entries()) {
    const [brandIndex, niche, format, budget, deliveryDays, applicants, title, summary, titleTr, summaryTr] = row;
    const job = await db.job.create({
      data: {
        brandId: brands[brandIndex].id,
        title,
        summary,
        titleTr,
        summaryTr,
        niche,
        format,
        budgetAmount: budget,
        budgetCurrency: CURRENCY,
        deliveryDays,
        createdAt: daysAgo(jobIndex + 1),
      },
    });
    for (let n = 0; n < applicants; n += 1) {
      const creator = creatorProfiles[(jobIndex * 3 + n) % creatorProfiles.length];
      await db.application.create({
        data: { jobId: job.id, creatorId: creator.id, message: "I would love to work on this brief." },
      });
    }
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
        packageName: pkg.name,
        deliveryNote: delivered ? "Delivered as agreed. Tell me if you want any changes." : null,
        revisionNote: status === "REVISION" ? "Please show the shelves earlier in the video." : null,
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

  // A few conversations so the inbox is not empty. [brandIndex, creator slug, [who writes ("B" brand, "C" creator), text, minutes ago]]
  const CHATS = [
    [0, "eylul-rowan", [
      ["B", "Hi Eylül, we love your recipe videos. Do you have time for a cold brew video next week?", 3000],
      ["C", "Hi! Thank you. Yes, I can film on Tuesday. Do you want it in the morning light?", 2900],
      ["B", "Perfect, morning light please. I will place the order now.", 2800],
    ]],
    [1, "mira-solis", [
      ["B", "Hello Mira, could you also show the product in a night routine?", 600],
      ["C", "Sure, I can add a short night-routine part. It would add one day to the delivery.", 580],
      ["B", "That works for us. Thank you!", 120],
    ]],
    [2, "arda-valen", [["C", "Hello, I saw your open brief. Is a 60-second video also fine, or do you need exactly 30 seconds?", 90]]],
  ];
  for (const [brandIndex, slug, lines] of CHATS) {
    const brand = brands[brandIndex];
    const creator = creatorBySlug.get(slug);
    const brandUser = await db.user.findUnique({ where: { id: brand.userId } });
    const stamp = (minutesAgo) => new Date(Date.now() - minutesAgo * 60000);
    const conversation = await db.conversation.create({
      data: { brandId: brand.id, creatorId: creator.id, createdAt: stamp(lines[0][2]), updatedAt: stamp(lines[lines.length - 1][2]) },
    });
    for (const [who, body, minutesAgo] of lines) {
      await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: who === "B" ? brandUser.id : creator.userId,
          body,
          createdAt: stamp(minutesAgo),
          // Older messages are read; the newest one stays unread so the badge shows up.
          readAt: minutesAgo > 200 ? stamp(minutesAgo - 5) : null,
        },
      });
    }
  }

  const counts = {
    users: await db.user.count(),
    creators: await db.creatorProfile.count(),
    brands: await db.brandProfile.count(),
    packages: await db.package.count(),
    orders: await db.order.count(),
    jobs: await db.job.count(),
    applications: await db.application.count(),
    conversations: await db.conversation.count(),
    messages: await db.message.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());

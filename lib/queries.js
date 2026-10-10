// Database reads used by pages. Results are cached ("use cache") so pages still prerender;
// writes call updateTag("creators" | "jobs") to refresh them.
// Rows are mapped to plain objects the components already understand.
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { imageUrl, splitList } from "@/lib/images";

function mapCreator(row) {
  const cheapest = row.packages.reduce((min, pkg) => (pkg.priceAmount < min.priceAmount ? pkg : min), row.packages[0]);
  return {
    id: row.slug,
    name: row.user.name,
    handle: row.handle,
    niche: row.niche,
    city: row.city,
    bio: row.bio,
    followers: row.followers,
    rating: row.rating,
    completedOrders: row.completedOrders,
    deliveryDays: row.deliveryDays,
    verified: row.verified,
    avatar: { shape: row.avatarShape, bg: row.avatarBg, fg: row.avatarFg, image: imageUrl(row.profileImage) },
    gallery: splitList(row.galleryImages).map(imageUrl),
    startingPrice: cheapest
      ? { amount: cheapest.priceAmount, currency: cheapest.priceCurrency }
      : { amount: 0, currency: "TRY" },
  };
}

// Creators without any package are hidden until they add one.
// Pass `limit` to get only the first N creators (home page); omit it for all.
export async function getCreators(limit) {
  "use cache";
  cacheTag("creators");
  cacheLife("minutes");
  const rows = await db.creatorProfile.findMany({
    where: { packages: { some: {} } },
    include: { user: true, packages: true },
    orderBy: { id: "asc" },
    ...(limit ? { take: limit } : {}),
  });
  return rows.map(mapCreator);
}

// Open jobs, newest first. Title and summary use the Turkish copy when it exists and lang is "tr".
export async function getOpenJobs(lang) {
  "use cache";
  cacheTag("jobs");
  cacheLife("minutes");
  const rows = await db.job.findMany({
    where: { status: "OPEN" },
    include: { brand: true, _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => ({
    id: String(row.id),
    brand: row.brand.companyName,
    niche: row.niche,
    format: row.format,
    title: (lang === "tr" && row.titleTr) || row.title,
    summary: (lang === "tr" && row.summaryTr) || row.summary,
    budget: { amount: row.budgetAmount, currency: row.budgetCurrency },
    deliveryDays: row.deliveryDays,
    applicants: row._count.applications,
  }));
}

// One job by id (any status), or null. Used by the job page.
export async function getJob(id, lang) {
  "use cache";
  cacheTag("jobs");
  cacheLife("minutes");
  const numeric = Number(id);
  if (!Number.isInteger(numeric)) return null;
  const row = await db.job.findUnique({
    where: { id: numeric },
    include: { brand: true, _count: { select: { applications: true } } },
  });
  if (!row) return null;
  return {
    id: row.id,
    brand: row.brand.companyName,
    niche: row.niche,
    format: row.format,
    status: row.status,
    title: (lang === "tr" && row.titleTr) || row.title,
    summary: (lang === "tr" && row.summaryTr) || row.summary,
    budget: { amount: row.budgetAmount, currency: row.budgetCurrency },
    deliveryDays: row.deliveryDays,
    applicants: row._count.applications,
  };
}

// Ids of all jobs, used to prebuild the job pages.
export async function getJobIds() {
  "use cache";
  cacheTag("jobs");
  cacheLife("minutes");
  const rows = await db.job.findMany({ select: { id: true }, orderBy: { id: "asc" } });
  return rows.map((row) => String(row.id));
}

// Number of open jobs, shown in the stats strip.
export async function getOpenJobCount() {
  "use cache";
  cacheTag("jobs");
  cacheLife("minutes");
  return db.job.count({ where: { status: "OPEN" } });
}

// Slugs of all creators, used to prebuild the profile pages.
export async function getCreatorSlugs() {
  "use cache";
  cacheTag("creators");
  cacheLife("minutes");
  const rows = await db.creatorProfile.findMany({ where: { packages: { some: {} } }, select: { slug: true }, orderBy: { id: "asc" } });
  return rows.map((row) => row.slug);
}

// One creator with all packages (cheapest first), or null when the slug is unknown.
export async function getCreator(slug) {
  "use cache";
  cacheTag("creators");
  cacheLife("minutes");
  const row = await db.creatorProfile.findUnique({
    where: { slug },
    include: { user: true, packages: { orderBy: { priceAmount: "asc" } }, socialAccounts: { orderBy: { id: "asc" } } },
  });
  if (!row) return null;
  return {
    ...mapCreator(row),
    socials: row.socialAccounts.map((account) => ({ platform: account.platform, username: account.username, followers: account.followers })),
    packages: row.packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      price: { amount: pkg.priceAmount, currency: pkg.priceCurrency },
      deliveryDays: pkg.deliveryDays,
      revisions: pkg.revisions,
      stay: pkg.stay,
    })),
  };
}

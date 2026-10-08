import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import PackagesManager from "@/components/PackagesManager";
import PageHeader from "@/components/PageHeader";
import { db } from "@/lib/db";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).packages.title, robots: { index: false } };
}

// Reads the login cookie, so it must render at request time (inside Suspense).
async function PackagesContent({ lang }) {
  const routes = getRoutes(lang);
  const { packages: copy } = getMessages(lang);
  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const creator = user.role === "CREATOR" ? user.creatorProfile : null;
  if (!creator) redirect(routes.account);

  const rows = await db.package.findMany({
    where: { creatorId: creator.id },
    orderBy: { priceAmount: "asc" },
    include: { _count: { select: { orders: true } } },
  });
  const items = rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    priceAmount: row.priceAmount,
    priceCurrency: row.priceCurrency,
    deliveryDays: row.deliveryDays,
    orderCount: row._count.orders,
  }));

  return (
    <div>
      <p className="rounded-xl bg-soft p-4 text-sm text-ink-soft">
        {items.length > 0 ? copy.liveNote : copy.hiddenNote}
      </p>
      <PackagesManager lang={lang} items={items} />
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Button href={routes.account} variant="secondary" arrow={false}>
          {copy.back}
        </Button>
        {items.length > 0 ? (
          <Button href={routes.creatorProfile(creator.slug)} variant="secondary" arrow={false}>
            {copy.viewProfile}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default async function PackagesPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { packages: copy } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.heading} subtitle={copy.subheading} />
      <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-ink-soft">{copy.loading}</p>}>
          <PackagesContent lang={lang} />
        </Suspense>
      </section>
    </>
  );
}

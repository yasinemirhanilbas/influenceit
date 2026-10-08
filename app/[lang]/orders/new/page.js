import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import OrderForm from "@/components/OrderForm";
import PageHeader from "@/components/PageHeader";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { ROLE } from "@/lib/orderStatus";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getIntlLocale, getMessages, interpolate, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).orders.title, robots: { index: false } };
}

// Reads the login cookie and the ?package= address part, so it renders at request time (inside Suspense).
async function NewOrderContent({ lang, searchParams }) {
  const routes = getRoutes(lang);
  const { orders: copy } = getMessages(lang);
  const intl = getIntlLocale(lang);
  const query = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect(routes.login);

  if (user.role !== ROLE.BRAND || !user.brandProfile) {
    return (
      <div>
        <p className="text-ink-soft">{copy.onlyBrands}</p>
        <div className="mt-6">
          <Button href={routes.account} variant="secondary" arrow={false}>
            {getMessages(lang).account.eyebrow}
          </Button>
        </div>
      </div>
    );
  }

  const packageId = Number(Array.isArray(query.package) ? query.package[0] : query.package);
  const pkg =
    Number.isInteger(packageId) && packageId > 0
      ? await db.package.findUnique({ where: { id: packageId }, include: { creator: { include: { user: true } } } })
      : null;

  if (!pkg) {
    return (
      <div>
        <p className="text-ink-soft">{copy.packageMissing}</p>
        <div className="mt-6">
          <Button href={routes.creators}>{copy.browseCreators}</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-card border border-line bg-card p-6 shadow-card">
        <p className="label-mono text-xs font-bold text-brand">{copy.summaryHeading}</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-semibold">{pkg.name}</h2>
            <p className="mt-1 text-sm text-ink-soft">
              {pkg.creator.user.name} ({pkg.creator.handle})
            </p>
            <p className="mt-3 leading-relaxed text-ink-soft">{pkg.description}</p>
            <p className="mt-2 text-sm text-ink-soft">{interpolate(copy.deliveryDays, { days: pkg.deliveryDays })}</p>
          </div>
          <p className="font-display text-3xl font-semibold">{formatCurrency(pkg.priceAmount, pkg.priceCurrency, intl)}</p>
        </div>
      </div>
      <OrderForm lang={lang} packageId={pkg.id} />
    </div>
  );
}

export default async function NewOrderPage({ params, searchParams }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { orders: copy } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.newHeading} subtitle={copy.newSubheading} />
      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-ink-soft">{copy.loading}</p>}>
          <NewOrderContent lang={lang} searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

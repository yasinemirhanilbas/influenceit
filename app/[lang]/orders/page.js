import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PageHeader from "@/components/PageHeader";
import { formatCurrency, formatDate } from "@/lib/format";
import { listOrdersForUser } from "@/lib/orders";
import { ROLE } from "@/lib/orderStatus";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getIntlLocale, getMessages, interpolate, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).orders.title, robots: { index: false } };
}

// Reads the login cookie, so it must render at request time (inside Suspense).
async function OrdersContent({ lang }) {
  const routes = getRoutes(lang);
  const { orders: copy } = getMessages(lang);
  const intl = getIntlLocale(lang);
  const user = await getSessionUser();
  if (!user) redirect(routes.login);

  const isBrand = user.role === ROLE.BRAND;
  const orders = await listOrdersForUser(user);

  if (orders.length === 0) {
    return (
      <div>
        <p className="text-ink-soft">{isBrand ? copy.emptyBrand : copy.emptyCreator}</p>
        {isBrand ? (
          <div className="mt-6">
            <Button href={routes.creators}>{copy.browseCreators}</Button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <ul className="space-y-5">
      {orders.map((order) => (
        <li
          key={order.id}
          className="relative rounded-card border border-line bg-card p-5 shadow-card transition hover:border-brand"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="label-mono text-xs text-ink-soft">{interpolate(copy.orderNumber, { number: order.id })}</p>
              <h2 className="mt-1 font-display text-xl font-semibold">
                <Link
                  href={routes.order(order.id)}
                  className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                >
                  {order.packageName}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {isBrand ? `${order.creator.user.name} (${order.creator.handle})` : order.brand.companyName}
              </p>
            </div>
            <OrderStatusBadge status={order.status} label={copy.status[order.status]} />
          </div>
          <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
            <span>{formatCurrency(order.priceAmount, order.priceCurrency, intl)}</span>
            <span>
              {copy.placedOn}: {formatDate(order.createdAt, intl)}
            </span>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default async function OrdersPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { orders: copy } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.listHeading} subtitle={copy.listSubheading} />
      <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-ink-soft">{copy.loading}</p>}>
          <OrdersContent lang={lang} />
        </Suspense>
      </section>
    </>
  );
}

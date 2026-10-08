import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import OrderDeliverForm from "@/components/OrderDeliverForm";
import OrderPayPanel from "@/components/OrderPayPanel";
import OrderProgress from "@/components/OrderProgress";
import OrderReviewPanel from "@/components/OrderReviewPanel";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import PageHeader from "@/components/PageHeader";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrderForUser } from "@/lib/orders";
import { ORDER_STATUS, ROLE, getAvailableActions } from "@/lib/orderStatus";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getIntlLocale, getMessages, interpolate, isLocale } from "@/locales";

// Orders are private and only exist at runtime, so nothing real can be prebuilt. One sample id lets the
// build check the page; every real order id is rendered on request.
export function generateStaticParams() {
  return [{ id: "0" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).orders.title, robots: { index: false } };
}

const isWebLink = (value) => /^https?:\/\//i.test(value ?? "");

function Section({ title, children }) {
  return (
    <section className="mt-8 rounded-card border border-line bg-card p-6 shadow-card">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

// The order page is only for the brand and the creator of that order. It reads the login cookie and the
// order id, so everything renders at request time (inside Suspense).
async function OrderContent({ params }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const routes = getRoutes(lang);
  const { orders: copy } = getMessages(lang);
  const intl = getIntlLocale(lang);

  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const found = await getOrderForUser(user, id);
  if (!found) notFound();
  const { order, role } = found;

  const actions = getAvailableActions(order.status, role);
  const isBrand = role === ROLE.BRAND;
  const counterpart = isBrand
    ? { label: copy.creatorLabel, value: `${order.creator.user.name} (${order.creator.handle})` }
    : { label: copy.brandLabel, value: order.brand.companyName };
  const price = formatCurrency(order.priceAmount, order.priceCurrency, intl);
  const hasDelivery = Boolean(order.deliveryLink || order.deliveryVideo || order.deliveryNote);
  const waiting = copy.wait[role]?.[order.status];

  return (
    <>
      <PageHeader
        eyebrow={interpolate(copy.orderNumber, { number: order.id })}
        title={order.packageName}
        subtitle={`${counterpart.label}: ${counterpart.value}`}
      />
      <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <OrderStatusBadge status={order.status} label={copy.status[order.status]} />
          <p className="text-sm text-ink-soft">
            {copy.priceLabel}: <span className="font-semibold text-ink">{price}</span>
          </p>
          <p className="text-sm text-ink-soft">
            {copy.placedOn}: {formatDate(order.createdAt, intl)}
          </p>
        </div>

        <div className="mt-8 rounded-card border border-line bg-card p-6 shadow-card">
          <OrderProgress status={order.status} labels={copy.steps} title={copy.progressLabel} />
        </div>

        <Section title={copy.briefHeading}>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">{order.brief}</p>
        </Section>

        {hasDelivery ? (
          <Section title={copy.deliveryHeading}>
            <dl className="mt-3 space-y-4">
              {isWebLink(order.deliveryLink) ? (
                <div>
                  <dt className="label-mono text-xs text-ink-soft">{copy.deliveryLinkLabel}</dt>
                  <dd className="mt-1 break-all">
                    <a
                      href={order.deliveryLink}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                    >
                      {order.deliveryLink}
                    </a>
                  </dd>
                </div>
              ) : null}
              {order.deliveryVideo ? (
                <div>
                  <dt className="label-mono text-xs text-ink-soft">{copy.deliveryVideoLabel}</dt>
                  <dd className="mt-2">
                    <video
                      controls
                      preload="metadata"
                      src={`/api/orders/${order.id}/video`}
                      className="w-full max-w-2xl rounded-xl border border-line bg-black"
                    />
                  </dd>
                </div>
              ) : null}
              {order.deliveryNote ? (
                <div>
                  <dt className="label-mono text-xs text-ink-soft">{copy.deliveryNoteLabel}</dt>
                  <dd className="mt-1 whitespace-pre-line text-ink-soft">{order.deliveryNote}</dd>
                </div>
              ) : null}
            </dl>
          </Section>
        ) : null}

        {order.status === ORDER_STATUS.REVISION && order.revisionNote ? (
          <Section title={copy.revisionHeading}>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">{order.revisionNote}</p>
          </Section>
        ) : null}

        <Section title={copy.nextHeading}>
          {actions.includes("pay") ? (
            <>
              <h3 className="mt-3 font-display text-lg font-semibold">{copy.payHeading}</h3>
              <OrderPayPanel lang={lang} orderId={order.id} amountLabel={price} />
            </>
          ) : null}
          {actions.includes("deliver") ? (
            <OrderDeliverForm
              lang={lang}
              orderId={order.id}
              defaultLink={order.deliveryLink}
              defaultNote={order.deliveryNote}
              hasVideo={Boolean(order.deliveryVideo)}
              again={order.status === ORDER_STATUS.REVISION}
            />
          ) : null}
          {actions.includes("approve") ? (
            <>
              <h3 className="mt-3 font-display text-lg font-semibold">{copy.reviewHeading}</h3>
              <OrderReviewPanel lang={lang} orderId={order.id} />
            </>
          ) : null}
          {actions.length === 0 && waiting ? <p className="mt-3 text-ink-soft">{waiting}</p> : null}
        </Section>

        <div className="mt-10">
          <Button href={routes.orders} variant="secondary" arrow={false}>
            {copy.backToList}
          </Button>
        </div>
      </section>
    </>
  );
}

export default function OrderPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-5 py-16">
          <p className="text-ink-soft">…</p>
        </div>
      }
    >
      <OrderContent params={params} />
    </Suspense>
  );
}

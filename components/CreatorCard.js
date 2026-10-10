import Link from "next/link";
import Avatar from "./Avatar";
import { StarIcon, VerifiedIcon } from "./icons";
import { getMessages, interpolate } from "@/locales";
import { formatCompactNumber, formatCurrency, formatRating } from "@/lib/format";
import { getTier } from "@/lib/creators";
import { getIntlLocale } from "@/locales";
import { getRoutes } from "@/lib/routes";

// `duplicate` cards (marquee copies) keep the link out of the tab order.
export default function CreatorCard({ creator, lang, duplicate = false }) {
  const messages = getMessages(lang);
  const { common, featured } = messages;
  const intl = getIntlLocale(lang);
  const price = formatCurrency(creator.startingPrice.amount, creator.startingPrice.currency, intl);
  const rating = formatRating(creator.rating, intl);

  return (
    <article className="relative flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5">
      <div className="flex items-start gap-4">
        <Avatar name={creator.name} avatar={creator.avatar} />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold">
            <Link
              href={getRoutes(lang).creatorProfile(creator.id)}
              tabIndex={duplicate ? -1 : undefined}
              className="truncate after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand-light"
            >
              {creator.name}
            </Link>
            {creator.verified ? (
              <span className="relative inline-flex shrink-0 text-brand" title={common.verifiedProfile}>
                <VerifiedIcon className="h-5 w-5" />
                <span className="sr-only">{common.verifiedProfile}</span>
              </span>
            ) : null}
          </h3>
          <p className="text-sm text-ink-soft">{creator.handle}</p>
          <p className="text-sm text-ink-soft">
            {interpolate(common.followers, { count: formatCompactNumber(creator.followers, intl) })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-dark">
          {featured.niches[creator.niche] ?? creator.niche}
        </span>
        <span className="rounded-full border border-line bg-card px-3 py-1 font-medium text-ink-soft">
          {featured.tiers[getTier(creator.followers)]}
        </span>
      </div>

      <div className="mt-4 mb-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        <p
          className="flex items-center gap-1.5 font-semibold text-ink"
          aria-label={interpolate(featured.ratingLabel, { rating })}
        >
          <StarIcon className="h-4 w-4 text-brass" />
          {rating}
          <span className="font-normal text-ink-soft">
            ({interpolate(featured.orders, { count: creator.completedOrders })})
          </span>
        </p>
        <p>{interpolate(featured.delivery, { days: creator.deliveryDays })}</p>
      </div>

      <p className="mt-auto border-t-2 border-dashed border-line pt-4 font-display text-xl font-semibold">
        {interpolate(common.fromPrice, { price })}
      </p>
    </article>
  );
}

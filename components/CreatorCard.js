import Avatar from "./Avatar";
import { StarIcon, VerifiedIcon } from "./icons";
import { messages, interpolate } from "@/locales";
import { formatCompactNumber, formatCurrency, formatRating } from "@/lib/format";
import { getTier } from "@/lib/creators";

export default function CreatorCard({ creator }) {
  const { common, featured } = messages;
  const price = formatCurrency(creator.startingPrice.amount, creator.startingPrice.currency);
  const rating = formatRating(creator.rating);

  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-paper p-5 shadow-card transition hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <Avatar name={creator.name} avatar={creator.avatar} />
        <div className="min-w-0">
          <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold">
            <span className="truncate">{creator.name}</span>
            {creator.verified ? (
              <span className="inline-flex shrink-0 text-brand" title={common.verifiedProfile}>
                <VerifiedIcon className="h-5 w-5" />
                <span className="sr-only">{common.verifiedProfile}</span>
              </span>
            ) : null}
          </h3>
          <p className="text-sm text-ink-soft">{creator.handle}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-dark">
          {creator.niche}
        </span>
        <span className="rounded-full border border-line bg-white px-3 py-1 font-medium text-ink-soft">
          {featured.tiers[getTier(creator.followers)]}
        </span>
        <span className="text-ink-soft">
          {interpolate(common.followers, { count: formatCompactNumber(creator.followers) })}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-soft">
        <p
          className="flex items-center gap-1.5 font-semibold text-ink"
          aria-label={interpolate(featured.ratingLabel, { rating })}
        >
          <StarIcon className="h-4 w-4 text-[#E9B949]" />
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

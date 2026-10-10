import Link from "next/link";
import { notFound } from "next/navigation";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import { VerifiedIcon, StarIcon } from "@/components/icons";
import SignUpCta from "@/components/SignUpCta";
import { formatCompactNumber, formatCurrency, formatRating } from "@/lib/format";
import { getCreator, getCreatorSlugs } from "@/lib/queries";
import { getRoutes } from "@/lib/routes";
import { getIntlLocale, getMessages, interpolate, isLocale } from "@/locales";

// The language comes from the parent layout; this prebuilds every creator for it.
export async function generateStaticParams() {
  const slugs = await getCreatorSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const creator = await getCreator(slug);
  if (!creator) return {};
  const { profile } = getMessages(lang);
  return { title: interpolate(profile.metaTitle, { name: creator.name }), description: creator.bio };
}

export default async function CreatorProfilePage({ params }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const creator = await getCreator(slug);
  if (!creator) notFound();

  const messages = getMessages(lang);
  const { profile, common, featured } = messages;
  const routes = getRoutes(lang);
  const intl = getIntlLocale(lang);

  const stats = [
    { label: profile.followers, value: formatCompactNumber(creator.followers, intl) },
    { label: profile.rating, value: formatRating(creator.rating, intl), star: true },
    { label: profile.completed, value: String(creator.completedOrders) },
    { label: profile.delivery, value: interpolate(profile.deliveryValue, { days: creator.deliveryDays }) },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <Link
            href={routes.creators}
            className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            ← {profile.back}
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar name={creator.name} avatar={creator.avatar} size="h-24 w-24" text="text-3xl" />
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 font-display text-4xl font-semibold leading-tight sm:text-5xl">
                {creator.name}
                {creator.verified ? (
                  <span className="inline-flex shrink-0 text-brand" title={common.verifiedProfile}>
                    <VerifiedIcon className="h-7 w-7" />
                    <span className="sr-only">{common.verifiedProfile}</span>
                  </span>
                ) : null}
              </h1>
              <p className="mt-1 text-lg text-ink-soft">{creator.handle}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-dark">
                  {featured.niches[creator.niche] ?? creator.niche}
                </span>
                <span className="rounded-full border border-line bg-card px-3 py-1 font-medium text-ink-soft">
                  {profile.cities[creator.city] ?? creator.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <dl aria-label={profile.statsLabel} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-card border border-line bg-card p-5 shadow-card">
              <dt className="label-mono text-xs text-ink-soft">{stat.label}</dt>
              <dd className="mt-2 flex items-center gap-1.5 font-display text-2xl font-semibold">
                {stat.star ? <StarIcon className="h-5 w-5 text-brand-light" /> : null}
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 max-w-2xl">
          <h2 className="font-display text-2xl font-semibold">{profile.aboutHeading}</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-soft">{creator.bio}</p>
        </div>

        {creator.gallery.length > 0 ? (
          <div className="mt-12">
            <h2 className="font-display text-2xl font-semibold">{profile.galleryHeading}</h2>
            <ul className="mt-6 grid max-w-3xl grid-cols-3 gap-3 sm:gap-5">
              {creator.gallery.map((src, index) => (
                <li key={src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={interpolate(profile.photoAlt, { name: creator.name, number: index + 1 })}
                    loading="lazy"
                    className="aspect-square w-full rounded-card border border-line object-cover"
                  />
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-12">
          <h2 className="font-display text-2xl font-semibold">{profile.packagesHeading}</h2>
          <p className="mt-2 text-ink-soft">{profile.packagesNote}</p>
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
            {creator.packages.map((pkg) => (
              <li key={pkg.id}>
                <article className="flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card">
                  <h3 className="font-display text-xl font-semibold">{pkg.name}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{pkg.description}</p>
                  <p className="mt-5 font-display text-3xl font-semibold">
                    {formatCurrency(pkg.price.amount, pkg.price.currency, intl)}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    {interpolate(profile.packageDelivery, { days: pkg.deliveryDays })}
                  </p>
                  <Button href={routes.signUpBrand} size="sm" className="mt-5 w-full">
                    {profile.order}
                  </Button>
                </article>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-soft">{profile.orderHint}</p>
        </div>
      </section>

      <SignUpCta lang={lang} />
    </>
  );
}

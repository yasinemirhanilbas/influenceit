import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Avatar from "@/components/Avatar";
import { BrandJobs, CreatorApplications } from "@/components/AccountJobs";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { db } from "@/lib/db";
import { imageUrl, splitList } from "@/lib/images";
import { suggestCreators } from "@/lib/matching";
import { countUnread } from "@/lib/messages";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { logOutAction } from "@/app/[lang]/auth/actions";
import { getMessages, interpolate, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).account.title, robots: { index: false } };
}

function Row({ label, value }) {
  return (
    <div className="rounded-card border border-line bg-card p-5 shadow-card">
      <dt className="label-mono text-xs text-ink-soft">{label}</dt>
      <dd className="mt-2 break-words font-display text-xl font-semibold">{value}</dd>
    </div>
  );
}

// Reads the login cookie, so it must render at request time (inside Suspense).
async function AccountContent({ lang }) {
  const routes = getRoutes(lang);
  const { account, featured, profile, signup, messages: messagesCopy } = getMessages(lang);
  const categoryLabel = (id) => featured.niches[id] ?? id;
  const user = await getSessionUser();
  if (!user) redirect(routes.login);

  const unread = await countUnread(user);
  const isBrand = user.role === "BRAND" && user.brandProfile;
  const creator = user.creatorProfile;
  const rows = [{ label: account.emailLabel, value: user.email }];
  let hasPackages = true;
  let myJobs = [];
  let myApplications = [];
  let suggestions = {};

  if (isBrand) {
    const [jobs, orders, ownJobs] = await Promise.all([
      db.job.count({ where: { brandId: user.brandProfile.id, status: "OPEN" } }),
      db.order.count({ where: { brandId: user.brandProfile.id } }),
      db.job.findMany({
        where: { brandId: user.brandProfile.id },
        include: { applications: { include: { creator: { include: { user: true } } }, orderBy: { id: "desc" } } },
        orderBy: { createdAt: "desc" },
      }),
    ]);
    myJobs = ownJobs;

    // Suggested creators for each open job (see lib/matching.js). Creators who already applied are left out.
    const openJobs = ownJobs.filter((job) => job.status === "OPEN");
    if (openJobs.length > 0) {
      const rows = await db.creatorProfile.findMany({ where: { packages: { some: {} } }, include: { user: true, packages: true } });
      const pool = rows.map((row) => {
        const cheapest = row.packages.reduce((min, pkg) => (pkg.priceAmount < min.priceAmount ? pkg : min), row.packages[0]);
        return {
          id: row.id,
          slug: row.slug,
          name: row.user.name,
          avatar: { shape: row.avatarShape, bg: row.avatarBg, fg: row.avatarFg, image: imageUrl(row.profileImage) },
          niches: [...new Set([row.niche, ...splitList(row.categories)])],
          rating: row.rating,
          completedOrders: row.completedOrders,
          cheapestPrice: { amount: cheapest.priceAmount, currency: cheapest.priceCurrency },
          fastestDays: Math.min(...row.packages.map((pkg) => pkg.deliveryDays)),
        };
      });
      for (const job of openJobs) {
        suggestions[job.id] = suggestCreators(job, pool, { excludeIds: job.applications.map((application) => application.creatorId) });
      }
    }
    rows.push(
      { label: account.companyLabel, value: user.brandProfile.companyName },
      { label: account.companyTitleLabel, value: user.brandProfile.companyTitle ?? "-" },
      { label: account.phoneLabel, value: user.brandProfile.phone ?? "-" },
      { label: account.industryLabel, value: signup.sectors[user.brandProfile.industry] ?? featured.niches[user.brandProfile.industry] ?? user.brandProfile.industry },
      { label: account.jobsLabel, value: String(jobs) },
      { label: account.ordersLabel, value: String(orders) },
    );
  } else if (creator) {
    const [applications, orders, packages, sent] = await Promise.all([
      db.application.count({ where: { creatorId: creator.id } }),
      db.order.count({ where: { creatorId: creator.id } }),
      db.package.count({ where: { creatorId: creator.id } }),
      db.application.findMany({
        where: { creatorId: creator.id },
        include: { job: { include: { brand: true } } },
        orderBy: { id: "desc" },
      }),
    ]);
    myApplications = sent;
    hasPackages = packages > 0;
    rows.push(
      { label: account.handleLabel, value: creator.handle },
      {
        label: account.categoriesLabel,
        value: (splitList(creator.categories).length ? splitList(creator.categories) : [creator.niche]).map(categoryLabel).join(", "),
      },
      { label: account.cityLabel, value: profile.cities[creator.city] ?? creator.city },
      { label: account.applicationsLabel, value: String(applications) },
      { label: account.ordersLabel, value: String(orders) },
    );
  }

  return (
    <div>
      <p className="label-mono text-xs font-bold text-brand">{isBrand ? account.roleBrand : account.roleCreator}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">{interpolate(account.welcome, { name: user.name })}</h2>
      <p className="mt-2 text-ink-soft">{isBrand ? account.brandNext : account.creatorNext}</p>

      {creator ? (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Avatar
            name={user.name}
            avatar={{ shape: creator.avatarShape, bg: creator.avatarBg, fg: creator.avatarFg, image: imageUrl(creator.profileImage) }}
            size="h-20 w-20"
            text="text-2xl"
          />
          {splitList(creator.galleryImages).length > 0 ? (
            <div>
              <p className="label-mono text-xs text-ink-soft">{account.photosHeading}</p>
              <ul className="mt-2 flex gap-2">
                {splitList(creator.galleryImages).map((name) => (
                  <li key={name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl(name)} alt="" loading="lazy" className="h-16 w-16 rounded-xl border border-line object-cover" />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <Row key={row.label} {...row} />
        ))}
      </dl>

      {isBrand ? <BrandJobs jobs={myJobs} suggestions={suggestions} lang={lang} /> : null}
      {creator ? <CreatorApplications applications={myApplications} lang={lang} /> : null}

      {creator && !hasPackages ? (
        <p className="mt-6 rounded-xl bg-soft p-4 text-sm text-ink-soft">{account.creatorNoPackages}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {isBrand ? (
          <Button href={routes.creators}>{account.findCreators}</Button>
        ) : (
          <>
            <Button href={routes.packages} variant={hasPackages ? "secondary" : "primary"}>
              {account.managePackages}
            </Button>
            <Button href={routes.jobs} variant="secondary">
              {account.browseJobs}
            </Button>
          </>
        )}
        <Button href={routes.orders} variant="secondary" arrow={false}>
          {account.myOrders}
        </Button>
        <Button href={routes.messages} variant="secondary" arrow={false}>
          {unread > 0 ? interpolate(messagesCopy.openWithCount, { count: unread }) : messagesCopy.open}
        </Button>
        {creator && hasPackages ? (
          <Button href={routes.creatorProfile(creator.slug)} variant="secondary" arrow={false}>
            {account.viewProfile}
          </Button>
        ) : null}
        <form action={logOutAction}>
          <input type="hidden" name="lang" value={lang} />
          <button
            type="submit"
            className="min-h-12 rounded-full border border-line px-7 font-semibold hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            {account.logOut}
          </button>
        </form>
      </div>
    </div>
  );
}

export default async function AccountPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { account } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={account.eyebrow} title={account.eyebrow} />
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-ink-soft">{account.loading}</p>}>
          <AccountContent lang={lang} />
        </Suspense>
      </section>
    </>
  );
}

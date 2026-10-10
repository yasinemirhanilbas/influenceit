import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ApplyForm from "@/components/ApplyForm";
import Button from "@/components/Button";
import SignUpCta from "@/components/SignUpCta";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { getJob, getJobIds } from "@/lib/queries";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getIntlLocale, getMessages, interpolate, isLocale } from "@/locales";

// The language comes from the parent layout; this prebuilds every job that exists at build time.
export async function generateStaticParams() {
  const ids = await getJobIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) return {};
  const job = await getJob(id, lang);
  if (!job) return {};
  return { title: interpolate(getMessages(lang).jobDetail.metaTitle, { title: job.title }), description: job.summary };
}

function Notice({ children }) {
  return (
    <p role="status" className="mb-6 rounded-xl bg-brand-soft p-4 text-sm font-semibold text-brand-dark">
      {children}
    </p>
  );
}

// Depends on who is logged in, so it renders at request time (inside Suspense).
async function ApplySection({ job, lang, searchParams }) {
  const { jobDetail } = getMessages(lang);
  const routes = getRoutes(lang);
  const query = await searchParams;
  const user = await getSessionUser();

  let body;
  if (!user) {
    body = (
      <>
        <p className="text-ink-soft">{jobDetail.loginPrompt}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button href={routes.login}>{jobDetail.logIn}</Button>
          <Button href={routes.signUpCreator} variant="secondary">
            {jobDetail.signUp}
          </Button>
        </div>
      </>
    );
  } else if (!user.creatorProfile) {
    body = (
      <>
        <p className="text-ink-soft">{jobDetail.creatorsOnly}</p>
        <div className="mt-5">
          <Button href={routes.account} variant="secondary">
            {jobDetail.myAccount}
          </Button>
        </div>
      </>
    );
  } else {
    const existing = await db.application.findUnique({
      where: { jobId_creatorId: { jobId: job.id, creatorId: user.creatorProfile.id } },
    });
    if (existing) body = <p className="text-ink-soft">{jobDetail[`alreadyApplied${existing.status}`] ?? jobDetail.alreadyApplied}</p>;
    else if (job.status !== "OPEN") body = <p className="text-ink-soft">{jobDetail.closed}</p>;
    else body = <ApplyForm jobId={job.id} lang={lang} />;
  }

  return (
    <div>
      {query?.posted ? <Notice>{jobDetail.posted}</Notice> : null}
      {query?.applied ? <Notice>{jobDetail.applied}</Notice> : null}
      <h2 className="font-display text-2xl font-semibold">{jobDetail.applyHeading}</h2>
      <div className="mt-4">{body}</div>
    </div>
  );
}

export default async function JobPage({ params, searchParams }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const job = await getJob(id, lang);
  if (!job) notFound();

  const { jobDetail, jobs, featured } = getMessages(lang);
  const routes = getRoutes(lang);
  const intl = getIntlLocale(lang);

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <Link
            href={routes.jobs}
            className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            ← {jobDetail.back}
          </Link>
          <p className="label-mono mt-6 text-xs font-bold text-brand">
            {job.brand} · {featured.niches[job.niche] ?? job.niche}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight sm:text-5xl">{job.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{job.summary}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:py-16 lg:grid-cols-[1fr_2fr]">
        <dl className="grid h-fit gap-4 rounded-card border border-line bg-card p-6 shadow-card">
          <div>
            <dt className="label-mono text-xs text-ink-soft">{jobs.budgetLabel}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold">
              {formatCurrency(job.budget.amount, job.budget.currency, intl)}
            </dd>
          </div>
          <div>
            <dt className="label-mono text-xs text-ink-soft">{jobDetail.formatLabel}</dt>
            <dd className="mt-1 font-semibold">{jobs.formats[job.format] ?? job.format}</dd>
          </div>
          <div>
            <dt className="label-mono text-xs text-ink-soft">{jobDetail.deliveryLabel}</dt>
            <dd className="mt-1 font-semibold">{interpolate(jobs.delivery, { days: job.deliveryDays })}</dd>
          </div>
          <div>
            <dt className="label-mono text-xs text-ink-soft">{jobDetail.applicantsLabel}</dt>
            <dd className="mt-1 font-semibold">{interpolate(jobs.applicants, { count: job.applicants })}</dd>
          </div>
        </dl>

        <Suspense fallback={<p className="text-ink-soft">{jobDetail.loading}</p>}>
          <ApplySection job={job} lang={lang} searchParams={searchParams} />
        </Suspense>
      </section>
      <SignUpCta lang={lang} />
    </>
  );
}

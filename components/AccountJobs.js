import Link from "next/link";
import Avatar from "./Avatar";
import Button from "./Button";
import { decideApplicationAction, setJobStatusAction } from "@/app/[lang]/jobs/actions";
import { startConversationAction } from "@/app/[lang]/messages/actions";
import { formatCurrency, formatRating } from "@/lib/format";
import { getRoutes } from "@/lib/routes";
import { getIntlLocale, getMessages, interpolate } from "@/locales";

// Lists on the account page. Data comes from the account page query, so these are plain server components.

const statusBadge = {
  PENDING: "bg-soft text-ink-soft",
  ACCEPTED: "bg-brand-soft text-brand-dark",
  REJECTED: "bg-soft text-ink-soft line-through",
};

// A one-button form that runs a server action with hidden fields.
function ActionForm({ action, fields, children, primary = false }) {
  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <button
        type="submit"
        className={`min-h-11 rounded-full px-4 text-sm font-semibold transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
          primary ? "bg-brand-gradient text-white shadow-glow hover:brightness-110" : "border border-line bg-card text-ink hover:border-brand"
        }`}
      >
        {children}
      </button>
    </form>
  );
}

// Brand: own jobs with the applications they received.
export function BrandJobs({ jobs, suggestions = {}, lang }) {
  const { account, jobs: jobsCopy, messages: messagesCopy } = getMessages(lang);
  const routes = getRoutes(lang);
  const intl = getIntlLocale(lang);

  return (
    <section className="mt-12" aria-labelledby="my-jobs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="my-jobs" className="font-display text-2xl font-semibold">
          {account.myJobsHeading}
        </h3>
        <Button href={routes.newJob} size="sm">
          {account.postJob}
        </Button>
      </div>

      {jobs.length === 0 ? <p className="mt-4 text-ink-soft">{account.noJobs}</p> : null}

      <ul className="mt-5 space-y-5">
        {jobs.map((job) => (
          <li key={job.id} className="rounded-card border border-line bg-card p-5 shadow-card sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <Link
                  href={routes.job(job.id)}
                  className="font-display text-xl font-semibold underline-offset-4 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                >
                  {(lang === "tr" && job.titleTr) || job.title}
                </Link>
                <p className="mt-1 text-sm text-ink-soft">
                  {formatCurrency(job.budgetAmount, job.budgetCurrency, intl)} · {interpolate(jobsCopy.delivery, { days: job.deliveryDays })}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand-dark">
                  {job.status === "OPEN" ? account.statusOpen : account.statusClosed}
                </span>
                <ActionForm
                  action={setJobStatusAction}
                  fields={{ lang, jobId: job.id, status: job.status === "OPEN" ? "CLOSED" : "OPEN" }}
                >
                  {job.status === "OPEN" ? account.closeJob : account.reopenJob}
                </ActionForm>
              </div>
            </div>

            {suggestions[job.id]?.length > 0 ? (
              <div className="mt-5 rounded-xl bg-soft p-4">
                <p className="label-mono text-xs font-bold text-brand">{account.match.heading}</p>
                <p className="mt-1 text-sm text-ink-soft">{account.match.note}</p>
                <ul className="mt-3 grid gap-3 md:grid-cols-3">
                  {suggestions[job.id].map(({ creator, score, reasons }) => (
                    <li key={creator.id} className="rounded-xl border border-line bg-card p-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={creator.name} avatar={creator.avatar} size="h-10 w-10" text="text-sm" />
                        <div className="min-w-0">
                          <Link
                            href={routes.creatorProfile(creator.slug)}
                            className="block truncate font-semibold underline-offset-4 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                          >
                            {creator.name}
                          </Link>
                          <p className="text-xs font-semibold text-brand">{interpolate(account.match.score, { score })}</p>
                        </div>
                      </div>
                      <ul className="mt-3 space-y-1 text-xs text-ink-soft">
                        {reasons.map((reason) => (
                          <li key={reason.type}>
                            ✓{" "}
                            {interpolate(account.match.reasons[reason.type], {
                              amount: reason.amount === undefined ? "" : formatCurrency(reason.amount, reason.currency, intl),
                              days: reason.days,
                              rating: reason.rating === undefined ? "" : formatRating(reason.rating, intl),
                              orders: reason.orders,
                            })}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <details open={job.applications.length <= 3} className="mt-5">
              <summary className="label-mono cursor-pointer text-xs text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light">
                {interpolate(account.applicationsCount, { count: job.applications.length })}
              </summary>
            {job.applications.length === 0 ? (
              <p className="mt-2 text-sm text-ink-soft">{account.noApplications}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {job.applications.map((application) => (
                  <li key={application.id} className="py-3">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-semibold">
                      {application.creator.user.name}
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[application.status] ?? statusBadge.PENDING}`}>
                        {account.applicationStatus[application.status] ?? account.applicationStatus.PENDING}
                      </span>
                      <Link
                        href={routes.creatorProfile(application.creator.slug)}
                        className="text-sm font-medium text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                      >
                        {account.viewApplicant}
                      </Link>
                    </p>
                    <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-ink-soft">{application.message}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ActionForm action={startConversationAction} fields={{ lang, creatorSlug: application.creator.slug }}>
                        {messagesCopy.messageCreator}
                      </ActionForm>
                      {application.status === "ACCEPTED" && job.order ? (
                        <Button href={routes.order(job.order.id)} variant="secondary" arrow={false}>
                          {account.openOrder}
                        </Button>
                      ) : null}
                      {application.status === "PENDING" ? (
                        <>
                          {job.order ? null : (
                            <ActionForm action={decideApplicationAction} fields={{ lang, applicationId: application.id, decision: "accept" }} primary>
                              {account.accept}
                            </ActionForm>
                          )}
                          <ActionForm action={decideApplicationAction} fields={{ lang, applicationId: application.id, decision: "reject" }}>
                            {account.reject}
                          </ActionForm>
                        </>
                      ) : application.status === "ACCEPTED" && job.order && job.order.status !== "PENDING" ? null : (
                        <ActionForm action={decideApplicationAction} fields={{ lang, applicationId: application.id, decision: "reset" }}>
                          {account.undoDecision}
                        </ActionForm>
                      )}
                    </div>
                    {application.status === "ACCEPTED" && job.order ? (
                      <p className="mt-2 text-sm text-ink-soft">
                        {job.order.status === "PENDING" ? account.orderPayHint : account.orderPaidHint}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Creator: the applications they sent.
export function CreatorApplications({ applications, lang }) {
  const { account, messages: messagesCopy } = getMessages(lang);
  const routes = getRoutes(lang);

  return (
    <section className="mt-12" aria-labelledby="my-applications">
      <h3 id="my-applications" className="font-display text-2xl font-semibold">
        {account.myApplicationsHeading}
      </h3>

      {applications.length === 0 ? <p className="mt-4 text-ink-soft">{account.noMyApplications}</p> : null}

      <ul className="mt-5 space-y-4">
        {applications.map((application) => (
          <li key={application.id} className="rounded-card border border-line bg-card p-5 shadow-card">
            <p className="label-mono text-xs text-ink-soft">{application.job.brand.companyName}</p>
            <Link
              href={routes.job(application.job.id)}
              className="mt-1 inline-block font-display text-lg font-semibold underline-offset-4 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
            >
              {(lang === "tr" && application.job.titleTr) || application.job.title}
            </Link>
            <span className={`ml-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge[application.status] ?? statusBadge.PENDING}`}>
              {account.applicationStatus[application.status] ?? account.applicationStatus.PENDING}
            </span>
            <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-ink-soft">{application.message}</p>
            {application.status === "ACCEPTED" && application.job.order ? (
              <p className="mt-2 text-sm text-ink-soft">
                {application.job.order.status === "PENDING" ? account.creatorOrderHint : account.creatorOrderPaidHint}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {application.status === "ACCEPTED" && application.job.order ? (
                <Button href={routes.order(application.job.order.id)} variant="secondary" arrow={false}>
                  {account.openOrder}
                </Button>
              ) : null}
              <ActionForm action={startConversationAction} fields={{ lang, brandId: application.job.brand.id }}>
                {messagesCopy.messageBrand}
              </ActionForm>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

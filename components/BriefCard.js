import Button from "./Button";
import { getMessages, getIntlLocale, interpolate } from "@/locales";
import { formatCurrency } from "@/lib/format";
import { getRoutes } from "@/lib/routes";

export default function BriefCard({ brief, lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { jobs, featured } = messages;
  const intl = getIntlLocale(lang);

  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg font-semibold">{brief.brand}</p>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand-dark">
          {featured.niches[brief.niche] ?? brief.niche}
        </span>
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold leading-snug">{brief.title}</h3>
      <p className="mt-2 flex-1 leading-relaxed text-ink-soft">{brief.summary}</p>

      <p className="label-mono mt-4 text-xs text-brand">{jobs.formats[brief.format]}</p>

      <dl className="mt-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 border-t-2 border-dashed border-line pt-4 text-sm text-ink-soft">
        <div>
          <dt className="sr-only">{jobs.budgetLabel}</dt>
          <dd className="font-display text-xl font-semibold text-ink">
            {formatCurrency(brief.budget.amount, brief.budget.currency, intl)}
          </dd>
        </div>
        <div className="text-right">
          <dd>{interpolate(jobs.delivery, { days: brief.deliveryDays })}</dd>
          <dd>{interpolate(jobs.applicants, { count: brief.applicants })}</dd>
        </div>
      </dl>

      <Button href={routes.signUpCreator} size="sm" variant="secondary" className="mt-4 w-full">
        {jobs.apply}
      </Button>
    </article>
  );
}

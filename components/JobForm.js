"use client";

import { useActionState } from "react";
import { createJobAction } from "@/app/[lang]/jobs/actions";
import { JOB_BUDGET_MAX, JOB_BUDGET_MIN, JOB_DAYS_MAX, JOB_FORMATS, JOB_SUMMARY_MAX, JOB_TITLE_MAX, NICHES } from "@/lib/options";
import { getMessages, interpolate } from "@/locales";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-field bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

// Form for a brand to post a job. Values stay in the form when the server returns an error.
export default function JobForm({ lang }) {
  const { jobForm, jobs, featured } = getMessages(lang);
  const [state, formAction, pending] = useActionState(createJobAction, null);

  return (
    <div className="mx-auto max-w-2xl rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="lang" value={lang} />

        <label className="block">
          <span className="text-sm font-semibold">{jobForm.titleLabel}</span>
          <input name="title" required maxLength={JOB_TITLE_MAX} placeholder={jobForm.titlePlaceholder} className={inputClass} />
        </label>

        <label className="block">
          <span className="text-sm font-semibold">{jobForm.summaryLabel}</span>
          <textarea
            name="summary"
            required
            rows={4}
            maxLength={JOB_SUMMARY_MAX}
            placeholder={interpolate(jobForm.summaryPlaceholder, { max: JOB_SUMMARY_MAX })}
            className={`${inputClass} py-3`}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">{jobForm.nicheLabel}</span>
            <select name="niche" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                {jobForm.choose}
              </option>
              {NICHES.map((niche) => (
                <option key={niche} value={niche}>
                  {featured.niches[niche] ?? niche}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{jobForm.formatLabel}</span>
            <select name="format" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                {jobForm.choose}
              </option>
              {JOB_FORMATS.map((format) => (
                <option key={format} value={format}>
                  {jobs.formats[format]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{jobForm.budgetLabel}</span>
            <input
              name="budget"
              type="number"
              inputMode="numeric"
              required
              min={JOB_BUDGET_MIN}
              max={JOB_BUDGET_MAX}
              step="1"
              placeholder={jobForm.budgetPlaceholder}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{jobForm.daysLabel}</span>
            <input
              name="days"
              type="number"
              inputMode="numeric"
              required
              min="1"
              max={JOB_DAYS_MAX}
              step="1"
              placeholder={jobForm.daysPlaceholder}
              className={inputClass}
            />
          </label>
        </div>

        <fieldset className="space-y-5 rounded-xl border border-dashed border-line p-4 sm:p-5">
          <legend className="px-2 text-sm font-semibold">{jobForm.otherHeading}</legend>
          <p className="text-sm text-ink-soft">{jobForm.otherHint}</p>
          <label className="block">
            <span className="text-sm font-semibold">{jobForm.otherTitleLabel}</span>
            <input name="titleOther" maxLength={JOB_TITLE_MAX} className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{jobForm.otherSummaryLabel}</span>
            <textarea name="summaryOther" rows={3} maxLength={JOB_SUMMARY_MAX} className={`${inputClass} py-3`} />
          </label>
        </fieldset>

        <button
          type="submit"
          disabled={pending}
          className="bg-brand-gradient disabled:opacity-60 min-h-12 w-full rounded-full px-7 font-semibold text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
        >
          {pending ? jobForm.submitting : jobForm.submit}
        </button>
        {state?.error ? (
          <p role="alert" className="text-sm text-brand-dark">
            {jobForm.errors[state.error] ?? jobForm.errors.generic}
          </p>
        ) : null}
      </form>
    </div>
  );
}

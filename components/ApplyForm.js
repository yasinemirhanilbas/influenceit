"use client";

import { useActionState } from "react";
import { applyAction } from "@/app/[lang]/jobs/actions";
import { APPLY_MESSAGE_MAX, APPLY_MESSAGE_MIN } from "@/lib/options";
import { getMessages, interpolate } from "@/locales";

// Short message a creator sends with an application. The text stays in the box when the server returns an error.
export default function ApplyForm({ jobId, lang }) {
  const { jobDetail } = getMessages(lang);
  const [state, formAction, pending] = useActionState(applyAction, null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="jobId" value={jobId} />
      <label className="block">
        <span className="text-sm font-semibold">{jobDetail.messageLabel}</span>
        <textarea
          name="message"
          required
          rows={5}
          minLength={APPLY_MESSAGE_MIN}
          maxLength={APPLY_MESSAGE_MAX}
          placeholder={interpolate(jobDetail.messagePlaceholder, { max: APPLY_MESSAGE_MAX })}
          className="mt-2 w-full rounded-xl border border-field bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="bg-brand-gradient disabled:opacity-60 min-h-12 w-full rounded-full px-7 font-semibold text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light sm:w-auto"
      >
        {pending ? jobDetail.submitting : jobDetail.submit}
      </button>
      {state?.error ? (
        <p role="alert" className="text-sm text-brand-dark">
          {jobDetail.errors[state.error] ?? jobDetail.errors.generic}
        </p>
      ) : null}
    </form>
  );
}

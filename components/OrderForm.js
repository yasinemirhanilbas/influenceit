"use client";

import { useActionState } from "react";
import { createOrderAction } from "@/app/[lang]/orders/actions";
import FormError from "@/components/FormError";
import { inputClass, primaryButton } from "@/components/formStyles";
import { getMessages } from "@/locales";

// The brief form for a new order. On success the action redirects to the order page.
export default function OrderForm({ lang, packageId }) {
  const { orders: copy } = getMessages(lang);
  const [state, formAction, pending] = useActionState(createOrderAction, null);

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="packageId" value={packageId} />
      <label className="block">
        <span className="text-sm font-semibold">{copy.briefLabel}</span>
        <textarea
          name="brief"
          required
          rows={6}
          minLength={20}
          maxLength={1000}
          placeholder={copy.briefPlaceholder}
          aria-describedby="brief-hint"
          className={`${inputClass} py-3`}
        />
        <span id="brief-hint" className="mt-1 block text-sm text-ink-soft">
          {copy.briefHint}
        </span>
      </label>
      <FormError message={state?.error ? (copy.errors[state.error] ?? copy.errors.generic) : null} />
      <button type="submit" disabled={pending} className={`${primaryButton} mt-6 w-full sm:w-auto`}>
        {pending ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}

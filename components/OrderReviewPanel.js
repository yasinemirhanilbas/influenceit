"use client";

import { useActionState, useState } from "react";
import { approveOrderAction, reviseOrderAction } from "@/app/[lang]/orders/actions";
import FormError from "@/components/FormError";
import { inputClass, primaryButton, secondaryButton } from "@/components/formStyles";
import { getMessages } from "@/locales";

// The brand's two choices after a delivery: approve (releases the payment) or ask for changes.
export default function OrderReviewPanel({ lang, orderId }) {
  const { orders: copy } = getMessages(lang);
  const [approveState, approveAction, approving] = useActionState(approveOrderAction, null);
  const [reviseState, reviseAction, revising] = useActionState(reviseOrderAction, null);
  const [asking, setAsking] = useState(false);
  const message = (key) => (key ? (copy.errors[key] ?? copy.errors.generic) : null);

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center gap-3">
        <form action={approveAction}>
          <input type="hidden" name="id" value={orderId} />
          <button type="submit" disabled={approving || revising} className={primaryButton}>
            {approving ? copy.approving : copy.approve}
          </button>
        </form>
        {asking ? null : (
          <button type="button" onClick={() => setAsking(true)} className={secondaryButton}>
            {copy.reviseToggle}
          </button>
        )}
      </div>
      <FormError message={message(approveState?.error)} />

      {asking ? (
        <form action={reviseAction} className="mt-6">
          <input type="hidden" name="id" value={orderId} />
          <label className="block">
            <span className="text-sm font-semibold">{copy.reviseLabel}</span>
            <textarea
              name="revisionNote"
              required
              rows={4}
              minLength={5}
              maxLength={500}
              placeholder={copy.revisePlaceholder}
              className={`${inputClass} py-3`}
            />
          </label>
          <FormError message={message(reviseState?.error)} />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="submit" disabled={revising || approving} className={primaryButton}>
              {revising ? copy.revising : copy.reviseButton}
            </button>
            <button type="button" onClick={() => setAsking(false)} className={secondaryButton}>
              {copy.cancel}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}

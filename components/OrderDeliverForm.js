"use client";

import { useActionState, useState } from "react";
import { deliverOrderAction } from "@/app/[lang]/orders/actions";
import FormError from "@/components/FormError";
import { inputClass, primaryButton } from "@/components/formStyles";
import { VIDEO_MAX_BYTES } from "@/lib/options";
import { getMessages } from "@/locales";

// Delivery form for the creator: a link, a video file, or both, plus an optional note.
// Used for the first delivery and again after the brand asks for changes (fields are pre-filled).
export default function OrderDeliverForm({ lang, orderId, defaultLink, defaultNote, hasVideo, again }) {
  const { orders: copy } = getMessages(lang);
  const [state, formAction, pending] = useActionState(deliverOrderAction, null);
  const [clientError, setClientError] = useState(null);

  // Catch an oversized video in the browser, before it is uploaded.
  function submit(formData) {
    const file = formData.get("video");
    if (file && file.size > VIDEO_MAX_BYTES) {
      setClientError("videoSize");
      return;
    }
    setClientError(null);
    formAction(formData);
  }

  const error = clientError ?? state?.error;

  return (
    <form action={submit} className="mt-4">
      <input type="hidden" name="id" value={orderId} />
      <h3 className="font-display text-xl font-semibold">{again ? copy.deliverAgainHeading : copy.deliverHeading}</h3>
      <p className="mt-1 text-ink-soft">{copy.deliverIntro}</p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-sm font-semibold">{copy.linkLabel}</span>
          <input
            name="link"
            type="url"
            maxLength={300}
            defaultValue={defaultLink ?? ""}
            placeholder={copy.linkPlaceholder}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{copy.videoLabel}</span>
          <input
            name="video"
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            className={`${inputClass} py-3`}
          />
          <span className="mt-1 block text-sm text-ink-soft">{hasVideo ? copy.videoKept : copy.videoHint}</span>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{copy.noteLabel}</span>
          <textarea name="note" rows={3} maxLength={500} defaultValue={defaultNote ?? ""} className={`${inputClass} py-3`} />
        </label>
      </div>

      <FormError message={error ? (copy.errors[error] ?? copy.errors.generic) : null} />
      <button type="submit" disabled={pending} className={`${primaryButton} mt-6 w-full sm:w-auto`}>
        {pending ? copy.delivering : copy.deliverButton}
      </button>
    </form>
  );
}

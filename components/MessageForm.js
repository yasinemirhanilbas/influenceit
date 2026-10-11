"use client";

import { useActionState, useRef, useState } from "react";
import { sendMessageAction } from "@/app/[lang]/messages/actions";
import FormError from "@/components/FormError";
import { inputClass, primaryButton } from "@/components/formStyles";
import { MESSAGE_MAX } from "@/lib/messages-config";
import { getMessages, interpolate } from "@/locales";

// Send box of a conversation. The text stays when the server rejects it and is cleared after a successful send.
// Ctrl+Enter (or Cmd+Enter) sends.
export default function MessageForm({ lang, conversationId }) {
  const { messages: copy } = getMessages(lang);
  const [state, formAction, pending] = useActionState(sendMessageAction, null);
  const [body, setBody] = useState("");
  const formRef = useRef(null);

  // A new action result arrived: clear the box after a successful send (set during render, not in an effect).
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state?.sent) setBody("");
  }

  const errorText = state?.error ? interpolate(copy.errors[state.error] ?? copy.errors.generic, { max: MESSAGE_MAX }) : null;

  return (
    <form ref={formRef} action={formAction} className="mt-6">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="conversationId" value={conversationId} />
      <label className="block">
        <span className="sr-only">{copy.placeholder}</span>
        <textarea
          name="body"
          required
          rows={3}
          maxLength={MESSAGE_MAX}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          placeholder={copy.placeholder}
          aria-describedby="message-hint"
          className={`${inputClass} py-3`}
        />
      </label>
      <p id="message-hint" className="mt-1 text-sm text-ink-soft">
        {interpolate(copy.hint, { max: MESSAGE_MAX })}
      </p>
      <FormError message={errorText} />
      <button type="submit" disabled={pending || body.trim() === ""} className={`${primaryButton} mt-4 w-full sm:w-auto`}>
        {pending ? copy.sending : copy.send}
      </button>
    </form>
  );
}

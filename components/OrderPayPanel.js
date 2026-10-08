"use client";

import { useActionState, useState } from "react";
import { payOrderAction } from "@/app/[lang]/orders/actions";
import FormError from "@/components/FormError";
import { inputClass, primaryButton } from "@/components/formStyles";
import { getMessages, interpolate } from "@/locales";

// Mock payment screen. The card fields only check that the right number of digits was typed
// (16 for the number, 4 for the date, 3 for the CVC). They are not real card checks, they have no
// `name`, and nothing typed here is sent to the server or stored. Pressing pay just marks the order paid.
const onlyDigits = (value, max) => value.replace(/\D/g, "").slice(0, max);
const formatNumber = (value) => onlyDigits(value, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
const formatExpiry = (value) => {
  const digits = onlyDigits(value, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export default function OrderPayPanel({ lang, orderId, amountLabel }) {
  const { orders: copy } = getMessages(lang);
  const [state, formAction, pending] = useActionState(payOrderAction, null);
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [showErrors, setShowErrors] = useState(false);

  const expiryDigits = onlyDigits(card.expiry, 4);
  const month = Number(expiryDigits.slice(0, 2));
  const problems = {
    name: card.name.trim().length < 2,
    number: onlyDigits(card.number, 16).length !== 16,
    expiry: expiryDigits.length !== 4 || month < 1 || month > 12,
    cvc: onlyDigits(card.cvc, 3).length !== 3,
  };

  function submit(formData) {
    if (Object.values(problems).some(Boolean)) {
      setShowErrors(true);
      return;
    }
    formAction(formData);
  }

  function field(key, label, placeholder, extra) {
    const invalid = showErrors && problems[key];
    return (
      <label className="block">
        <span className="text-sm font-semibold">{label}</span>
        <input
          type="text"
          value={card[key]}
          onChange={(event) => setCard({ ...card, [key]: extra.format(event.target.value) })}
          placeholder={placeholder}
          inputMode={extra.inputMode}
          autoComplete="off"
          aria-invalid={invalid}
          aria-describedby={invalid ? `card-${key}-error` : undefined}
          className={inputClass}
        />
        {invalid ? (
          <span id={`card-${key}-error`} className="mt-1 block text-sm text-brand-dark">
            {copy.cardErrors[key]}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <form action={submit} noValidate className="mt-4">
      <input type="hidden" name="id" value={orderId} />
      <p className="text-ink-soft">{copy.payIntro}</p>
      <p className="mt-4 rounded-xl border border-brand-light bg-brand-soft p-4 text-sm text-brand-dark">{copy.payDemo}</p>

      <div className="mt-6 space-y-5">
        {field("name", copy.cardName, copy.cardNamePlaceholder, { format: (value) => value.slice(0, 40), inputMode: "text" })}
        {field("number", copy.cardNumber, copy.cardNumberPlaceholder, { format: formatNumber, inputMode: "numeric" })}
        <div className="grid gap-5 sm:grid-cols-2">
          {field("expiry", copy.cardExpiry, copy.cardExpiryPlaceholder, { format: formatExpiry, inputMode: "numeric" })}
          {field("cvc", copy.cardCvc, copy.cardCvcPlaceholder, { format: (value) => onlyDigits(value, 3), inputMode: "numeric" })}
        </div>
      </div>

      <FormError message={state?.error ? (copy.errors[state.error] ?? copy.errors.generic) : null} />
      <button type="submit" disabled={pending} className={`${primaryButton} mt-6 w-full sm:w-auto`}>
        {pending ? copy.paying : interpolate(copy.payButton, { amount: amountLabel })}
      </button>
    </form>
  );
}

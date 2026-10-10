"use client";

import { useState } from "react";
import { interpolate } from "@/locales";
import { DEFAULT_PHONE_CODE, PHONE_CODES, limitPhoneInput, phoneRule } from "@/lib/phone";

// Phone number with a country code select. Fields are named phoneCode and phone; the server checks them with normalizePhone.
// Typing is limited to digits and to the country's maximum length (see lib/phone.js).
// copy: { label, hint, code, digits } (digits has a {count} placeholder).
const base =
  "min-h-12 rounded-xl border border-line bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

export default function PhoneField({ copy }) {
  const [code, setCode] = useState(DEFAULT_PHONE_CODE);
  const [phone, setPhone] = useState("");
  const rule = phoneRule(code);
  const count = rule.min === rule.max ? rule.max : `${rule.min}-${rule.max}`;

  return (
    <label className="block">
      <span className="text-sm font-semibold">{copy.label}</span>
      <div className="mt-2 flex gap-3">
        <select
          name="phoneCode"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setPhone((current) => limitPhoneInput(event.target.value, current));
          }}
          aria-label={copy.code}
          className={`${base} w-32 shrink-0`}
        >
          {PHONE_CODES.map((item) => (
            <option key={item.code} value={item.code}>{item.label}</option>
          ))}
        </select>
        <input
          name="phone"
          type="tel"
          autoComplete="tel-national"
          inputMode="numeric"
          value={phone}
          onChange={(event) => setPhone(limitPhoneInput(code, event.target.value))}
          placeholder={rule.example}
          aria-required="true"
          className={`${base} min-w-0 flex-1`}
        />
      </div>
      <span className="mt-1 block text-sm text-ink-soft">
        {copy.hint} {interpolate(copy.digits, { count })}
      </span>
    </label>
  );
}

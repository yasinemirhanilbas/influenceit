"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMessages, interpolate } from "@/locales";
import { signUpAction } from "@/app/[lang]/auth/actions";
import CreatorSignupWizard from "@/components/CreatorSignupWizard";
import TermsText from "@/components/TermsText";
import PhoneField from "@/components/PhoneField";
import { BRAND_SECTORS } from "@/lib/options";
import { getRoutes } from "@/lib/routes";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-field bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

function BuildingIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M4 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M14 10h5a1 1 0 0 1 1 1v10M3 21h18M8 8h2M8 12h2M8 16h2" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <rect x="3" y="6" width="12" height="12" rx="2" />
      <path d="m15 10 6-3v10l-6-3" />
    </svg>
  );
}

function RoleCard({ active, onClick, icon, title, text }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative rounded-card border p-5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
        active ? "border-brand bg-brand-soft" : "border-line bg-paper hover:border-brand"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? "bg-brand-gradient text-white" : "bg-card text-ink-soft"}`}
      >
        {icon}
      </span>
      <span className="mt-4 block font-display text-lg font-semibold">{title}</span>
      <span className="mt-1 block text-sm text-ink-soft">{text}</span>
      {active ? (
        <span
          aria-hidden="true"
          className="bg-brand-gradient absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-white"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
            <path d="m4 10 4 4 8-8" />
          </svg>
        </span>
      ) : null}
    </button>
  );
}

// Brand sign-up: a single short form.
function BrandForm({ lang, signup, featured }) {
  const [state, formAction, pending] = useActionState(signUpAction, null);

  function handleSubmit(event) {
    event.preventDefault();
    // Calling the action ourselves (not through <form action>) keeps typed values after a server error.
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
      <input type="hidden" name="lang" value={lang} />
      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">{signup.firstName}</span>
            <input name="firstName" type="text" required autoComplete="given-name" className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{signup.lastName}</span>
            <input name="lastName" type="text" required autoComplete="family-name" className={inputClass} />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold">{signup.email}</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{signup.passwordLabel}</span>
          <input name="password" type="password" required minLength={8} autoComplete="new-password" className={inputClass} />
          <span className="mt-1 block text-sm text-ink-soft">{signup.passwordHint}</span>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{signup.company}</span>
          <input name="companyName" type="text" required maxLength={60} className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{signup.companyTitle}</span>
          <input name="companyTitle" type="text" required maxLength={100} autoComplete="organization" className={inputClass} />
        </label>
        <PhoneField
          copy={{ label: signup.creator.phone, hint: signup.creator.phoneHint, code: signup.creator.phoneCode, digits: signup.creator.phoneDigits }}
        />
        <label className="block">
          <span className="text-sm font-semibold">{signup.industry}</span>
          <select name="niche" required defaultValue="" className={inputClass}>
            <option value="" disabled>{signup.sectorPlaceholder}</option>
            {BRAND_SECTORS.map((sector) => (
              <option key={sector} value={sector}>{signup.sectors[sector]}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-6 flex items-start gap-3">
        <input name="terms" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-[#7a2742]" />
        <span className="text-ink-soft">
          <TermsText lang={lang} />
        </span>
      </label>

      <p className="mt-6 rounded-xl bg-soft p-4 text-sm text-ink-soft">{signup.infoBrand}</p>

      {state?.error ? (
        <p role="alert" className="mt-6 rounded-xl border border-brand-light bg-brand-soft p-4 text-sm text-brand-dark">
          {signup.errors[state.error] ?? signup.errors.generic}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="bg-brand-gradient disabled:opacity-60 mt-6 min-h-12 w-full rounded-full px-7 font-semibold text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
      >
        {pending ? signup.submitting : signup.submit}
      </button>
      <p className="mt-4 text-center text-sm text-ink-soft">{signup.note}</p>
    </form>
  );
}

export default function SignupForm({ lang }) {
  const { signup, featured } = getMessages(lang);
  const routes = getRoutes(lang);
  const params = useSearchParams();
  const [role, setRole] = useState(params.get("role") === "creator" ? "creator" : "brand");

  return (
    <div>
      <p className="mb-6 text-ink-soft">
        {signup.haveAccount}{" "}
        <Link
          href={routes.login}
          className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
        >
          {signup.logIn} →
        </Link>
      </p>

      <fieldset>
        <legend className="text-sm font-semibold">{signup.roleLabel}</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RoleCard
            active={role === "brand"}
            onClick={() => setRole("brand")}
            icon={<BuildingIcon />}
            title={signup.roleBrand}
            text={signup.roleBrandText}
          />
          <RoleCard
            active={role === "creator"}
            onClick={() => setRole("creator")}
            icon={<VideoIcon />}
            title={signup.roleCreator}
            text={signup.roleCreatorText}
          />
        </div>
      </fieldset>

      {role === "brand" ? <BrandForm lang={lang} signup={signup} featured={featured} /> : <div className="mt-6"><CreatorSignupWizard lang={lang} /></div>}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useActionState } from "react";
import { getMessages } from "@/locales";
import { logInAction } from "@/app/[lang]/auth/actions";
import { getRoutes } from "@/lib/routes";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-base text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

// One login form for everyone. The account itself decides whether it is
// a brand or a creator account, so there is no account-type choice here.
export default function LoginPanels({ lang }) {
  const { login } = getMessages(lang);
  const routes = getRoutes(lang);
  const [state, formAction, pending] = useActionState(logInAction, null);

  return (
    <div className="mx-auto max-w-md rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
      <form action={formAction} className="space-y-5">
        <input type="hidden" name="lang" value={lang} />
        <label className="block">
          <span className="text-sm font-semibold">{login.email}</span>
          <input name="email" type="email" required autoComplete="email" className={inputClass} />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{login.password}</span>
          <input name="password" type="password" required autoComplete="current-password" className={inputClass} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="bg-brand-gradient disabled:opacity-60 min-h-12 w-full rounded-full px-7 font-semibold text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
        >
          {pending ? login.submitting : login.submit}
        </button>
        {state?.error ? (
          <p role="alert" className="text-sm text-brand-dark">
            {login.errors[state.error] ?? login.errors.invalid}
          </p>
        ) : null}
      </form>

      <p className="mt-6 rounded-xl bg-soft p-4 text-sm text-ink-soft">{login.demoAccounts}</p>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {login.noAccount}{" "}
        <Link
          href={routes.signUp}
          className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
        >
          {login.signUp}
        </Link>
      </p>
    </div>
  );
}

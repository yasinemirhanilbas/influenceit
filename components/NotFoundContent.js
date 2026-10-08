"use client";

import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import { defaultLocale, isLocale } from "@/locales/config";
import { getMessages } from "@/locales";
import { getRoutes } from "@/lib/routes";

export default function NotFoundContent() {
  const segment = (usePathname() ?? "").split("/")[1];
  const lang = isLocale(segment) ? segment : defaultLocale;
  const { notFound: copy } = getMessages(lang);
  const routes = getRoutes(lang);

  return (
    <section aria-labelledby="not-found-heading" className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 py-24 text-center sm:py-32">
        <p className="text-gradient font-display text-8xl font-semibold leading-none sm:text-9xl">404</p>
        <h1 id="not-found-heading" className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
          {copy.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">{copy.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href={routes.home}>{copy.home}</Button>
          <Button href={routes.jobs} variant="secondary">
            {copy.jobs}
          </Button>
        </div>
      </div>
    </section>
  );
}

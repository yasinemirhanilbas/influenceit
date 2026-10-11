"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import { defaultLocale, isLocale } from "@/locales/config";
import { getMessages } from "@/locales";
import { getRoutes } from "@/lib/routes";

// Shown when a page throws an unexpected error. The language comes from the address.
export default function ErrorPage({ error, retry }) {
  const segment = (usePathname() ?? "").split("/")[1];
  const lang = isLocale(segment) ? segment : defaultLocale;
  const { errorPage: copy } = getMessages(lang);
  const routes = getRoutes(lang);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section aria-labelledby="error-heading" className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-5 py-24 text-center sm:py-32">
        <h1 id="error-heading" className="font-display text-3xl font-semibold sm:text-4xl">
          {copy.heading}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-ink-soft">{copy.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-action px-6 text-sm font-semibold text-white"
          >
            {copy.retry}
          </button>
          <Button href={routes.home} variant="secondary">
            {copy.home}
          </Button>
        </div>
      </div>
    </section>
  );
}

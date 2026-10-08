"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_COOKIE, localeNames, locales } from "@/locales/config";
import { getMessages } from "@/locales";

// Remember the choice so the next visit to "/" opens in the same language.
function saveLocale(code) {
  document.cookie = `${LOCALE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`;
}

export default function LanguageSwitcher({ lang }) {
  const { header } = getMessages(lang);
  const pathname = usePathname() ?? `/${lang}`;
  // Keep the current page when switching language: /en/jobs -> /tr/jobs
  const rest = pathname.replace(new RegExp(`^/${lang}(?=/|$)`), "");

  return (
    <nav aria-label={header.languageLabel}>
      <ul className="flex items-center gap-1">
        {locales.map((code) => {
          const active = code === lang;
          return (
            <li key={code}>
              <Link
                href={`/${code}${rest}`}
                lang={code}
                hrefLang={code}
                aria-label={localeNames[code]}
                aria-current={active ? "true" : undefined}
                onClick={() => saveLocale(code)}
                className={`inline-flex min-h-7 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
                  active ? "bg-brand-gradient text-white" : "text-ink-soft hover:text-ink"
                }`}
              >
                {code.toUpperCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

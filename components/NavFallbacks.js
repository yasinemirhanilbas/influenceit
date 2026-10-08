import Link from "next/link";
import { localeNames, locales } from "@/locales/config";

// Shown while the client parts that read the address are loading.
// Same links, without the "current page" highlight.
export function NavLinksFallback({ links }) {
  return (
    <ul className="label-mono label-tight flex items-center gap-5 text-xs xl:gap-6">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="whitespace-nowrap border-b-2 border-transparent py-2 text-ink-soft"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function LanguageSwitcherFallback({ lang }) {
  return (
    <ul className="flex items-center gap-1">
      {locales.map((code) => (
        <li key={code}>
          <Link
            href={`/${code}`}
            lang={code}
            hrefLang={code}
            aria-label={localeNames[code]}
            aria-current={code === lang ? "true" : undefined}
            className={`inline-flex min-h-7 min-w-9 items-center justify-center rounded-full px-2 text-xs font-bold tracking-wide ${
              code === lang ? "bg-brand-gradient text-white" : "text-ink-soft"
            }`}
          >
            {code.toUpperCase()}
          </Link>
        </li>
      ))}
    </ul>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import HeaderAccount, { GuestButtons } from "./HeaderAccount";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";
import NavLinks from "./NavLinks";
import { LanguageSwitcherFallback, NavLinksFallback } from "./NavFallbacks";
import { getMessages } from "@/locales";
import { getNavLinks, getRoutes } from "@/lib/routes";

export default function SiteHeader({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { header, common } = messages;
  const navLinks = getNavLinks(lang);
  const mainLinks = navLinks.filter((link) => link.route !== "stories");

  return (
    <>
      <div className="border-b border-line bg-soft text-ink-soft">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-xs sm:text-sm">
          <p>{header.supportHours}</p>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${header.supportEmail}`}
              className="hidden hover:underline focus-visible:outline-2 focus-visible:outline-brand-light sm:inline"
            >
              {header.supportEmail}
            </a>
            <Suspense fallback={<LanguageSwitcherFallback lang={lang} />}>
              <LanguageSwitcher lang={lang} />
            </Suspense>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Link
            href={routes.home}
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            <span
              aria-hidden="true"
              className="bg-brand-gradient flex h-8 w-8 items-center justify-center rounded-lg font-display text-lg font-semibold text-white"
            >
              I
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-xl font-semibold text-brand">
                {common.brandName}
              </span>
              <span className="label-mono hidden whitespace-nowrap text-[10px] text-ink-soft sm:block">
                {header.tagline}
              </span>
            </span>
          </Link>

          <nav aria-label={header.mainNavLabel} className="hidden lg:block">
            <Suspense fallback={<NavLinksFallback links={mainLinks} />}>
              <NavLinks links={mainLinks} />
            </Suspense>
          </nav>

          <div className="flex items-center gap-2">
            <Suspense
              fallback={
                <>
                  <GuestButtons lang={lang} />
                  <MobileNav lang={lang} signedIn={false} />
                </>
              }
            >
              <HeaderAccount lang={lang} />
            </Suspense>
          </div>
        </div>
      </header>
    </>
  );
}

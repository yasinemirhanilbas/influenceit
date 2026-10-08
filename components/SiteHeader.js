import Link from "next/link";
import Button from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileNav from "./MobileNav";
import { getMessages } from "@/locales";
import { getNavLinks, getRoutes } from "@/lib/routes";

export default function SiteHeader({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { header, common } = messages;
  const navLinks = getNavLinks(lang);

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
            <LanguageSwitcher lang={lang} />
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
            <ul className="label-mono label-tight flex items-center gap-5 text-xs xl:gap-6">
              {navLinks
                .filter((link) => link.route !== "stories")
                .map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="whitespace-nowrap py-2 text-ink-soft transition-colors duration-[420ms] hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline-flex">
              <Button href={routes.login} size="sm" arrow={false} variant="secondary">
                {header.logIn}
              </Button>
            </span>
            <span className="hidden sm:inline-flex lg:hidden xl:inline-flex">
              <Button href={routes.signUp} size="sm" arrow={false}>
                {header.signUp}
              </Button>
            </span>
            <MobileNav lang={lang} />
          </div>
        </div>
      </header>
    </>
  );
}

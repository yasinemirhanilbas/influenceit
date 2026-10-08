import Link from "next/link";
import Button from "./Button";
import MobileNav from "./MobileNav";
import { messages } from "@/locales";
import { routes } from "@/lib/routes";

export default function SiteHeader() {
  const { header, common } = messages;

  return (
    <>
      <div className="bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2 text-xs sm:text-sm">
          <p>{header.supportHours}</p>
          <a
            href={`mailto:${header.supportEmail}`}
            className="hidden hover:underline focus-visible:outline-2 focus-visible:outline-accent sm:inline"
          >
            {header.supportEmail}
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
          <Link
            href={routes.home}
            className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span
              aria-hidden="true"
              className="bg-brand-gradient flex h-8 w-8 items-center justify-center rounded-lg font-display text-lg font-semibold text-white"
            >
              I
            </span>
            <span className="font-display text-xl font-semibold text-brand">
              {common.brandName}
            </span>
          </Link>

          <nav aria-label={header.mainNavLabel} className="hidden md:block">
            <ul className="flex items-center gap-7 text-sm font-medium">
              {header.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="py-2 text-ink-soft transition hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex">
              <Button href={routes.signUpBrand} size="sm" arrow={false}>
                {common.startAsBrand}
              </Button>
            </span>
            <MobileNav />
          </div>
        </div>
      </header>
    </>
  );
}

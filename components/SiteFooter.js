import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";
import { getMessages } from "@/locales";
import { getNavLinks, getRoutes } from "@/lib/routes";

export default function SiteFooter({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { footer, header, common } = messages;
  const navLinks = getNavLinks(lang);

  return (
    <footer className="border-t border-line bg-soft">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href={routes.home} className="font-display text-3xl font-semibold text-brand">
            {common.brandName}
          </Link>
          <p className="mt-3 max-w-xs text-ink-soft">{footer.tagline}</p>
          <div className="mt-6">
            <LanguageSwitcher lang={lang} />
          </div>
        </div>

        <nav aria-label={footer.navTitle}>
          <p className="label-mono text-xs font-bold text-brand">{footer.navTitle}</p>
          <ul className="mt-4 space-y-3">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink-soft transition-colors duration-[420ms] hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="label-mono text-xs font-bold text-brand">{footer.contactTitle}</p>
          <p className="mt-4">
            <a href={`mailto:${header.supportEmail}`} className="text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-brand-light">
              {header.supportEmail}
            </a>
          </p>
          <p className="mt-2 text-ink-soft">{header.supportHours}</p>
          <a href="#main" className="label-mono mt-6 inline-block text-xs text-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-brand-light">
            {footer.backToTop} ↑
          </a>
        </div>
      </div>
      <div className="border-t border-line px-5 py-5 text-center text-xs text-ink-soft">
        {footer.note}
      </div>
    </footer>
  );
}

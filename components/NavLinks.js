"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Top navigation links. The link of the page you are on is highlighted.
// Links that point to a section (#...) are never highlighted.
export default function NavLinks({ links }) {
  const pathname = usePathname();

  return (
    <ul className="label-mono label-tight flex items-center gap-5 text-xs xl:gap-6">
      {links.map((link) => {
        const active = !link.href.includes("#") && pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`whitespace-nowrap border-b-2 py-2 transition-colors duration-[420ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
                active
                  ? "border-brand text-ink"
                  : "border-transparent text-ink-soft hover:text-brand"
              }`}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "./icons";
import Button from "./Button";
import { messages } from "@/locales";
import { routes } from "@/lib/routes";

export default function MobileNav() {
  const { header, common } = messages;
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? header.closeMenu : header.menu}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open ? (
        <nav
          id="mobile-nav-panel"
          aria-label={header.mainNavLabel}
          className="absolute left-5 right-5 top-full mt-2 rounded-card border border-line bg-white p-3 shadow-card"
        >
          <ul>
            {header.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-dashed border-line p-2 pt-4">
            <Button href={routes.signUpBrand} className="w-full">
              {common.startAsBrand}
            </Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}

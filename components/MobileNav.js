"use client";

import { useState } from "react";
import { MenuIcon, XIcon } from "./icons";
import Button from "./Button";
import { getMessages } from "@/locales";
import Link from "next/link";
import { getNavLinks, getRoutes } from "@/lib/routes";

export default function MobileNav({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { header, common } = messages;
  const navLinks = getNavLinks(lang);
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? header.closeMenu : header.menu}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
      >
        {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      {open ? (
        <nav
          id="mobile-nav-panel"
          aria-label={header.mainNavLabel}
          className="absolute left-5 right-5 top-full mt-2 rounded-card border border-line bg-card p-3 shadow-card"
        >
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="label-mono block rounded-xl px-4 py-3 text-sm hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand-light"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-dashed border-line p-2 pt-4">
            <Button href={routes.signUpBrand} className="w-full">
              {common.startAsBrand}
            </Button>
            <Button href={routes.signUpCreator} variant="secondary" className="mt-2 w-full">
              {common.joinAsCreator}
            </Button>
            <Button href={routes.login} variant="secondary" arrow={false} className="mt-2 w-full">
              {header.logIn}
            </Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import CreatorCard from "./CreatorCard";
import { getMessages, interpolate } from "@/locales";
import { getNiches } from "@/lib/creators";

const ALL = "all";

export default function CreatorDirectory({ creators, lang }) {
  const { featured, pages } = getMessages(lang);
  const copy = pages.creators;
  const niches = getNiches(creators);
  const [active, setActive] = useState(ALL);
  const [query, setQuery] = useState("");

  const text = query.trim().toLowerCase();
  const shown = creators.filter(
    (creator) =>
      (active === ALL || creator.niche === active) &&
      (!text || `${creator.name} ${creator.handle}`.toLowerCase().includes(text)),
  );

  function chipClass(isActive) {
    return `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
      isActive
        ? "bg-brand-gradient border-transparent text-white shadow-glow"
        : "border-line bg-card text-ink hover:border-brand"
    }`;
  }

  return (
    <div>
      <label className="block max-w-md">
        <span className="label-mono text-xs text-ink-soft">{copy.searchLabel}</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={copy.searchPlaceholder}
          className="mt-2 min-h-12 w-full rounded-full border border-line bg-card px-5 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
        />
      </label>

      <div
        role="group"
        aria-label={featured.filterLabel}
        className="-mx-5 mt-6 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button type="button" aria-pressed={active === ALL} onClick={() => setActive(ALL)} className={chipClass(active === ALL)}>
          {featured.allNiches}
        </button>
        {niches.map((niche) => (
          <button key={niche} type="button" aria-pressed={active === niche} onClick={() => setActive(niche)} className={chipClass(active === niche)}>
            {featured.niches[niche] ?? niche}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">
        {shown.length ? interpolate(copy.count, { count: shown.length }) : copy.noResults}
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((creator) => (
          <li key={creator.id} className="card-in">
            <CreatorCard creator={creator} lang={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
}

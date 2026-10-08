"use client";

import { useState } from "react";
import CreatorCard from "./CreatorCard";
import { messages, interpolate } from "@/locales";
import { getNiches } from "@/lib/creators";

const ALL = "all";

export default function CreatorGrid({ creators }) {
  const { featured } = messages;
  const niches = getNiches(creators);
  const [active, setActive] = useState(ALL);

  const shown = active === ALL ? creators : creators.filter((creator) => creator.niche === active);

  function chipClass(isActive) {
    return `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
      isActive
        ? "bg-brand-gradient border-transparent text-white shadow-glow"
        : "border-line bg-white text-ink hover:border-ink"
    }`;
  }

  return (
    <div>
      <div
        role="group"
        aria-label={featured.filterLabel}
        className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button
          type="button"
          aria-pressed={active === ALL}
          onClick={() => setActive(ALL)}
          className={chipClass(active === ALL)}
        >
          {featured.allNiches}
        </button>
        {niches.map((niche) => (
          <button
            key={niche}
            type="button"
            aria-pressed={active === niche}
            onClick={() => setActive(niche)}
            className={chipClass(active === niche)}
          >
            {niche}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {interpolate(featured.resultCount, { count: shown.length })}
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((creator) => (
          <li key={creator.id} className="card-in">
            <CreatorCard creator={creator} />
          </li>
        ))}
      </ul>
    </div>
  );
}

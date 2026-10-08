"use client";

import { useState } from "react";
import CreatorCard from "./CreatorCard";
import { getMessages, interpolate } from "@/locales";
import { getNiches } from "@/lib/creators";

const ALL = "all";

export default function CreatorGrid({ creators, lang }) {
  const messages = getMessages(lang);
  const { featured } = messages;
  const niches = getNiches(creators);
  const [active, setActive] = useState(ALL);

  const shown = active === ALL ? creators : creators.filter((creator) => creator.niche === active);

  // Repeat the cards until the row is long enough, then twice for a seamless loop.
  const MIN_CARDS = 6;
  const repeats = Math.max(1, Math.ceil(MIN_CARDS / Math.max(shown.length, 1)));
  const base = Array.from({ length: repeats }, (_, round) =>
    shown.map((creator) => ({
      key: `${round}-${creator.id}`,
      creator,
      duplicate: round > 0,
    })),
  ).flat();
  const sequence = [
    ...base,
    ...base.map((item) => ({ ...item, key: `copy-${item.key}`, duplicate: true })),
  ];

  function chipClass(isActive) {
    return `min-h-11 shrink-0 rounded-full border px-4 text-sm font-semibold transition active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
      isActive
        ? "bg-brand-gradient border-transparent text-white shadow-glow"
        : "border-line bg-card text-ink hover:border-brand"
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
            {featured.niches[niche] ?? niche}
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {interpolate(featured.resultCount, { count: shown.length })}
      </p>

      {/* Full-width row that slides on its own; pauses on hover */}
      <div
        className="marquee mt-8 overflow-hidden pb-4 [margin-inline:calc(50%-50vw)] [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]"
      >
        <ul key={active} className="marquee-track" style={{ animationDuration: "80s" }}>
          {sequence.map((item) => (
            <li
              key={item.key}
              className="w-72 shrink-0 pr-5 sm:w-80"
              {...(item.duplicate ? { "aria-hidden": "true", "data-duplicate": "" } : {})}
            >
              <CreatorCard creator={item.creator} lang={lang} duplicate={item.duplicate} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

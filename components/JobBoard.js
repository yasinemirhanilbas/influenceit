"use client";

import { useState } from "react";
import BriefCard from "./BriefCard";
import { getMessages, interpolate } from "@/locales";

const ALL = "all";

export default function JobBoard({ briefs, lang }) {
  const { jobs, featured } = getMessages(lang);
  const niches = [...new Set(briefs.map((brief) => brief.niche))];
  const [active, setActive] = useState(ALL);
  const shown = active === ALL ? briefs : briefs.filter((brief) => brief.niche === active);

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
        aria-label={jobs.filterLabel}
        className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
      >
        <button type="button" aria-pressed={active === ALL} onClick={() => setActive(ALL)} className={chipClass(active === ALL)}>
          {jobs.allNiches}
        </button>
        {niches.map((niche) => (
          <button key={niche} type="button" aria-pressed={active === niche} onClick={() => setActive(niche)} className={chipClass(active === niche)}>
            {featured.niches[niche] ?? niche}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">
        {shown.length ? interpolate(jobs.resultCount, { count: shown.length }) : jobs.noResults}
      </p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((brief) => (
          <li key={brief.id} className="card-in">
            <BriefCard brief={brief} lang={lang} />
          </li>
        ))}
      </ul>
    </div>
  );
}

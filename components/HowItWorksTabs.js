"use client";

import { useState } from "react";
import { interpolate } from "@/locales";

// Highlighted step: escrow for brands, payout for creators.
const HIGHLIGHT = { brands: 2, creators: 3 };

export default function HowItWorksTabs({ copy }) {
  const [side, setSide] = useState("brands");
  const steps = side === "brands" ? copy.steps : copy.creatorSteps;
  const tag = side === "brands" ? copy.escrowTag : copy.paidTag;

  function tabClass(isActive) {
    return `min-h-11 rounded-full px-5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${
      isActive ? "bg-brand-gradient text-white shadow-glow" : "text-ink-soft hover:text-ink"
    }`;
  }

  return (
    <div>
      <div
        role="group"
        aria-label={copy.tabsLabel}
        className="mt-8 inline-flex gap-1 rounded-full border border-line bg-card p-1"
      >
        <button type="button" aria-pressed={side === "brands"} onClick={() => setSide("brands")} className={tabClass(side === "brands")}>
          {copy.tabBrands}
        </button>
        <button type="button" aria-pressed={side === "creators"} onClick={() => setSide("creators")} className={tabClass(side === "creators")}>
          {copy.tabCreators}
        </button>
      </div>

      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {steps.map((step, index) => {
          const highlighted = index === HIGHLIGHT[side];
          return (
            <li
              key={`${side}-${step.title}`}
              className={`card-in relative rounded-card border p-6 ${highlighted ? "border-brand bg-brand-soft" : "border-line bg-card shadow-card"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-gradient font-display text-5xl font-semibold leading-none">
                  {index + 1}
                </span>
                {highlighted ? (
                  <span className="rounded-md border-2 border-stamp px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-stamp">
                    {tag}
                  </span>
                ) : null}
              </div>
              <p className="sr-only">{interpolate(copy.stepLabel, { number: index + 1 })}</p>
              <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 leading-relaxed text-ink-soft">{step.description}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

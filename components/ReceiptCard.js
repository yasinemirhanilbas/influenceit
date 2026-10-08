"use client";

import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { CheckIcon, VerifiedIcon } from "./icons";
import { getMessages, interpolate } from "@/locales";
import { formatCurrency } from "@/lib/format";
import { getIntlLocale } from "@/locales";
import { sampleOrder } from "@/data/sampleOrder";

const TOTAL_STEPS = 4;
// First render matches the static state: order placed and payment in escrow.
const INITIAL_COMPLETED = 2;

function Notches({ top }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute -left-3 h-6 w-6 rounded-full bg-paper"
        style={{ top }}
      />
      <span
        aria-hidden="true"
        className="absolute -right-3 h-6 w-6 rounded-full bg-paper"
        style={{ top }}
      />
    </>
  );
}

export default function ReceiptCard({ lang }) {
  const messages = getMessages(lang);
  const { receipt, common, hero } = messages;
  const { creator, price } = sampleOrder;
  const total = formatCurrency(price.amount, price.currency, getIntlLocale(lang));
  const [completed, setCompleted] = useState(INITIAL_COMPLETED);

  // Walk through the order steps in a loop. Skipped for reduced motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return undefined;

    const finished = completed === TOTAL_STEPS;
    const timer = setTimeout(
      () => setCompleted(finished ? 1 : completed + 1),
      finished ? 3800 : 2200,
    );
    return () => clearTimeout(timer);
  }, [completed]);

  const released = completed === TOTAL_STEPS;
  const inEscrow = completed >= 2 && !released;

  let stampText = receipt.stampOrdered;
  let stampTone = "border-ink-soft text-ink-soft";
  if (inEscrow) {
    stampText = receipt.stampHeld;
    stampTone = "border-stamp text-stamp";
  } else if (released) {
    stampText = receipt.stampReleased;
    stampTone = "border-brand text-brand";
  }

  let chipText = hero.chipPending;
  if (released) chipText = interpolate(hero.chipPaid, { amount: total });
  else if (inEscrow) chipText = interpolate(hero.chipProtected, { amount: total });

  return (
    <div className="relative mx-auto mb-6 w-full max-w-sm pt-4 lg:max-w-md">
      <p className="float-chip absolute left-4 top-0 z-10 flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold shadow-card lg:-left-6">
        <VerifiedIcon className="h-4 w-4 text-brand" />
        {hero.chipVerified}
      </p>
      <p
        className="float-chip float-chip-delay absolute -bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold shadow-card lg:-right-6"
        aria-hidden="true"
      >
        <span className="bg-brand-gradient flex h-5 w-5 items-center justify-center rounded-full text-white">
          <CheckIcon className="h-3 w-3" />
        </span>
        {chipText}
      </p>

      <div className="relative rounded-card border border-line bg-card px-6 pb-6 pt-6 shadow-card">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-lg font-semibold">{receipt.title}</p>
          <p className="text-sm text-ink-soft">
            {interpolate(receipt.orderNumber, { number: sampleOrder.number })}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Avatar name={creator.name} avatar={creator.avatar} size="h-12 w-12" text="text-base" />
          <div>
            <p className="font-semibold">{creator.name}</p>
            <p className="text-sm text-ink-soft">
              {messages.featured.niches[creator.niche] ?? creator.niche}
            </p>
          </div>
        </div>

        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{receipt.packageLabel}</dt>
            <dd className="font-medium">{receipt.packageName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{receipt.priceLabel}</dt>
            <dd className="font-medium">{total}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">{receipt.feeLabel}</dt>
            <dd className="font-medium">{receipt.feeValue}</dd>
          </div>
        </dl>

        <div className="relative my-6 border-t-2 border-dashed border-line">
          <Notches top="-0.75rem" />
        </div>

        <div className="relative flex min-h-[3.25rem] items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink-soft">{receipt.totalLabel}</p>
            <p className="font-display text-3xl font-semibold">{total}</p>
          </div>
          <p
            key={stampText}
            className={`stamp stamp-pop rounded-md border-2 px-3 py-1.5 text-center text-xs font-bold uppercase leading-tight tracking-wider ${stampTone}`}
          >
            {stampText}
          </p>
        </div>

        <ol aria-label={receipt.timelineLabel} className="mt-6 space-y-3">
          {receipt.steps.map((label, index) => {
            const done = index < completed;
            return (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-500 ${done ? "border-transparent bg-brand-gradient text-white" : "border-line bg-transparent text-transparent"}`}
                >
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <span className={`transition-colors duration-500 ${done ? "font-medium" : "text-ink-soft"}`}>
                  {label}
                </span>
                <span className="sr-only">{done ? common.completed : common.pending}</span>
              </li>
            );
          })}
        </ol>

        <p className="mt-5 border-t border-dashed border-line pt-4 text-center text-sm text-ink-soft">
          {released ? receipt.footnoteDone : receipt.footnoteWaiting}
        </p>
      </div>
    </div>
  );
}

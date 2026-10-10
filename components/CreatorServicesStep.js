"use client";

import { useState } from "react";
import { interpolate } from "@/locales";
import {
  CONTENT_TYPES, DEFAULT_DELIVERY_DAYS, DELIVERY_MAX, ITEMS_MAX, PACKAGES_MAX, PRESETS, PRICE_MAX, REVISIONS_MAX, STAY_OPTIONS,
  countRange, isHourType, packageName,
} from "@/lib/services";

// Step 4 of the creator sign-up: packages and prices. The list of packages lives in the wizard (so it is sent with
// the form); this component only draws it and edits it through setPackages. Every price is typed in by the creator.

const fieldClass =
  "min-h-12 w-full rounded-xl border border-field bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
const buttonFocus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
const digitsOnly = (value) => value.replace(/\D/g, "");

let nextKey = 1;
const newKey = () => `pkg-${nextKey++}`;

export function newPackage(platform, items) {
  return {
    key: newKey(),
    platform,
    items: items.map(([type, count]) => ({ type, count })),
    price: "",
    deliveryDays: String(DEFAULT_DELIVERY_DAYS[platform]),
    revisions: "1",
    stay: "",
  };
}

export default function CreatorServicesStep({ copy, platforms, packages, setPackages, activePlatform, setActivePlatform, PlatformIcon }) {
  const services = copy.services;
  const [message, setMessage] = useState(null);
  const current = platforms.includes(activePlatform) ? activePlatform : platforms[0];
  // Step 3 requires a platform, so this is empty only while the (hidden) step is rendered before any choice.
  if (!current) return null;
  const shown = packages.filter((pkg) => pkg.platform === current);
  const atMax = packages.length >= PACKAGES_MAX;
  const countOf = (platform) => packages.filter((pkg) => pkg.platform === platform).length;
  const nameOf = (pkg) => packageName(pkg.platform, pkg.items.map((item) => ({ ...item, count: item.count || 1 })), services);

  function addPackage(items) {
    if (atMax) {
      setMessage(interpolate(services.maxReached, { max: PACKAGES_MAX }));
      return;
    }
    setMessage(null);
    setPackages([...packages, newPackage(current, items)]);
  }

  const update = (key, patch) => setPackages(packages.map((pkg) => (pkg.key === key ? { ...pkg, ...patch } : pkg)));
  const updateItem = (pkg, index, patch) =>
    update(pkg.key, { items: pkg.items.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  const remove = (key) => {
    setMessage(null);
    setPackages(packages.filter((pkg) => pkg.key !== key));
  };

  function changeType(pkg, index, type) {
    const { min, max } = countRange(pkg.platform, type);
    const count = Math.min(max, Math.max(min, Number(pkg.items[index].count) || min));
    updateItem(pkg, index, { type, count });
  }

  function step(pkg, index, delta) {
    const item = pkg.items[index];
    const { min, max } = countRange(pkg.platform, item.type);
    updateItem(pkg, index, { count: Math.min(max, Math.max(min, Number(item.count) + delta)) });
  }

  function addContent(pkg) {
    const used = pkg.items.map((item) => item.type);
    const free = CONTENT_TYPES[pkg.platform].find((type) => !used.includes(type));
    if (!free || pkg.items.length >= ITEMS_MAX) return;
    update(pkg.key, { items: [...pkg.items, { type: free, count: countRange(pkg.platform, free).min }] });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-semibold">{services.title}</h2>
        <p className="mt-1 text-sm text-ink-soft">{services.text}</p>
      </div>

      <div role="tablist" aria-label={services.title} className="flex flex-wrap gap-2">
        {platforms.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={current === id}
            onClick={() => setActivePlatform(id)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${buttonFocus} ${
              current === id ? "bg-brand-gradient border-transparent text-white" : "border-line bg-paper text-ink-soft hover:border-brand"
            }`}
          >
            <PlatformIcon id={id} className="h-4 w-4" />
            {copy.platforms[id]}
            {countOf(id) > 0 ? (
              <span className="rounded-full bg-white/25 px-2 text-xs" aria-label={interpolate(services.defined, { count: countOf(id) })}>
                {countOf(id)}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold">{services.startLabel}</p>
        <p className="mt-1 text-sm text-ink-soft">{interpolate(services.startHint, { max: PACKAGES_MAX })}</p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {PRESETS[current].map((preset, index) => {
            const label = packageName(current, preset.map(([type, count]) => ({ type, count })), services);
            const added = shown.some((pkg) => pkg.items.length === preset.length && pkg.items.every((item, i) => item.type === preset[i][0] && Number(item.count) === preset[i][1]));
            return (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => addPackage(preset)}
                  className={`flex min-h-16 w-full flex-col items-start rounded-xl border p-3 text-left text-sm transition ${buttonFocus} ${
                    added ? "border-brand bg-brand-soft" : "border-line bg-paper hover:border-brand"
                  }`}
                >
                  <span className="font-semibold">{label}</span>
                  <span className="mt-1 font-semibold text-brand">+ {added ? services.pickAgain : services.pick}</span>
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => addPackage([[CONTENT_TYPES[current][0], countRange(current, CONTENT_TYPES[current][0]).min]])}
              className={`flex min-h-16 w-full flex-col items-start rounded-xl border border-dashed border-brand p-3 text-left text-sm transition hover:bg-brand-soft ${buttonFocus}`}
            >
              <span className="font-semibold text-brand-dark">{services.custom}</span>
              <span className="mt-1 text-ink-soft">{services.customHint}</span>
            </button>
          </li>
        </ul>
        {message ? <p role="status" className="mt-3 text-sm text-brand-dark">{message}</p> : null}
      </div>

      {shown.length === 0 ? <p className="rounded-xl bg-soft p-4 text-sm text-ink-soft">{services.none}</p> : null}

      {shown.map((pkg, number) => (
        <article key={pkg.key} className="space-y-4 rounded-xl border border-line bg-paper p-4 sm:p-5">
          <header className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="label-mono text-xs text-ink-soft">{interpolate(services.packageNumber, { number: number + 1 })}</p>
              <h3 className="font-display text-lg font-semibold">{nameOf(pkg)}</h3>
            </div>
            <button
              type="button"
              onClick={() => remove(pkg.key)}
              aria-label={`${services.removePackage}: ${nameOf(pkg)}`}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-brand-dark transition hover:border-brand ${buttonFocus}`}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M9 7V4h6v3" />
              </svg>
            </button>
          </header>

          <div className="space-y-3">
            <p className="text-sm font-semibold">{services.includes}</p>
            {pkg.items.map((item, index) => {
              const hours = isHourType(pkg.platform, item.type);
              const taken = pkg.items.filter((_, i) => i !== index).map((other) => other.type);
              return (
                <div key={index} className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={item.type}
                      onChange={(event) => changeType(pkg, index, event.target.value)}
                      aria-label={services.contentType}
                      className={`${fieldClass} min-w-0 sm:w-auto sm:flex-1`}
                    >
                      {CONTENT_TYPES[pkg.platform].filter((type) => !taken.includes(type)).map((type) => (
                        <option key={type} value={type}>{services.types[`${pkg.platform}_${type}`].label}</option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1" role="group" aria-label={services.amount}>
                      <button type="button" onClick={() => step(pkg, index, -1)} aria-label={services.less} className={`h-12 w-12 rounded-xl border border-line text-lg font-semibold transition hover:border-brand ${buttonFocus}`}>−</button>
                      <span className="w-10 text-center font-semibold" aria-live="polite">{item.count}</span>
                      <button type="button" onClick={() => step(pkg, index, 1)} aria-label={services.more} className={`h-12 w-12 rounded-xl border border-line text-lg font-semibold transition hover:border-brand ${buttonFocus}`}>+</button>
                    </div>
                    {pkg.items.length > 1 ? (
                      <button type="button" onClick={() => update(pkg.key, { items: pkg.items.filter((_, i) => i !== index) })} aria-label={services.removeContent} className={`h-12 w-12 rounded-xl border border-line text-brand-dark transition hover:border-brand ${buttonFocus}`}>×</button>
                    ) : null}
                  </div>
                  {hours ? <p className="text-sm text-ink-soft">{services.hourHint}</p> : null}
                </div>
              );
            })}
            {pkg.items.length < Math.min(ITEMS_MAX, CONTENT_TYPES[pkg.platform].length) ? (
              <button
                type="button"
                onClick={() => addContent(pkg)}
                className={`min-h-11 rounded-xl border border-dashed border-line px-4 text-sm font-semibold text-ink-soft transition hover:border-brand ${buttonFocus}`}
              >
                + {services.addContent}
              </button>
            ) : null}
          </div>

          <label className="block">
            <span className="text-sm font-semibold">
              {services.price}
              <span aria-hidden="true" className="text-brand"> *</span>
            </span>
            <div className="relative mt-2">
              <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft">₺</span>
              <input
                value={pkg.price}
                onChange={(event) => update(pkg.key, { price: digitsOnly(event.target.value).slice(0, 7) })}
                inputMode="numeric"
                autoComplete="off"
                placeholder={services.pricePlaceholder}
                aria-required="true"
                aria-describedby={`${pkg.key}-price-hint`}
                max={PRICE_MAX}
                className={`${fieldClass} pl-9`}
              />
            </div>
            <span id={`${pkg.key}-price-hint`} className="mt-1 block text-sm text-ink-soft">{services.priceHint}</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-sm font-semibold">{services.delivery}</span>
              <div className="relative mt-2">
                <input
                  value={pkg.deliveryDays}
                  onChange={(event) => update(pkg.key, { deliveryDays: digitsOnly(event.target.value).slice(0, 2) })}
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={2}
                  aria-label={`${services.delivery} (${services.days}, 1-${DELIVERY_MAX})`}
                  className={`${fieldClass} pr-14`}
                />
                <span aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">{services.days}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{services.revisions}</span>
              <input
                value={pkg.revisions}
                onChange={(event) => update(pkg.key, { revisions: digitsOnly(event.target.value).slice(0, 1) })}
                inputMode="numeric"
                autoComplete="off"
                maxLength={1}
                aria-label={`${services.revisions} (0-${REVISIONS_MAX})`}
                className={`${fieldClass} mt-2`}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{services.stay}</span>
              <select value={pkg.stay} onChange={(event) => update(pkg.key, { stay: event.target.value })} className={`${fieldClass} mt-2`}>
                {STAY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{services.stays[option]}</option>
                ))}
              </select>
            </label>
          </div>
        </article>
      ))}

      <p className="rounded-xl bg-brand-soft p-3 text-sm font-semibold text-brand-dark" aria-live="polite">
        {interpolate(packages.length === 1 ? services.definedOne : services.defined, { count: packages.length })}
      </p>
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import { deletePackageAction, savePackageAction } from "@/app/[lang]/account/packages/actions";
import { formatCurrency } from "@/lib/format";
import { PACKAGE_LIMITS } from "@/lib/options";
import { REVISIONS_MAX, STAY_OPTIONS } from "@/lib/services";
import { getIntlLocale, getMessages, interpolate } from "@/locales";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
const primaryButton =
  "bg-brand-gradient disabled:opacity-60 min-h-11 rounded-full px-6 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
const secondaryButton =
  "disabled:opacity-60 min-h-11 rounded-full border border-line px-5 text-sm font-semibold transition hover:border-brand active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

function ErrorNote({ error, copy }) {
  if (!error) return null;
  return (
    <p role="alert" className="mt-4 rounded-xl border border-brand-light bg-brand-soft p-4 text-sm text-brand-dark">
      {copy.errors[error] ?? copy.errors.generic}
    </p>
  );
}

// The four package inputs, shared by the "add" and "edit" forms.
function PackageFields({ copy, pkg }) {
  return (
    <div className="space-y-5">
      <label className="block">
        <span className="text-sm font-semibold">{copy.nameLabel}</span>
        <input
          name="name"
          type="text"
          required
          maxLength={PACKAGE_LIMITS.nameMax}
          defaultValue={pkg?.name ?? ""}
          placeholder={copy.namePlaceholder}
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{copy.descriptionLabel}</span>
        <textarea
          name="description"
          required
          rows={3}
          maxLength={PACKAGE_LIMITS.descriptionMax}
          defaultValue={pkg?.description ?? ""}
          placeholder={copy.descriptionPlaceholder}
          className={`${inputClass} py-3`}
        />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">{copy.priceLabel}</span>
          <input
            name="price"
            type="number"
            required
            min={1}
            max={PACKAGE_LIMITS.priceMax}
            step={1}
            inputMode="numeric"
            defaultValue={pkg?.priceAmount ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{copy.daysLabel}</span>
          <input
            name="deliveryDays"
            type="number"
            required
            min={1}
            max={PACKAGE_LIMITS.daysMax}
            step={1}
            inputMode="numeric"
            defaultValue={pkg?.deliveryDays ?? ""}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{copy.revisionsLabel}</span>
          <input
            name="revisions"
            type="number"
            required
            min={0}
            max={REVISIONS_MAX}
            step={1}
            inputMode="numeric"
            defaultValue={pkg?.revisions ?? 1}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="text-sm font-semibold">{copy.stayLabel}</span>
          <select name="stay" defaultValue={pkg?.stay ?? ""} className={inputClass}>
            {STAY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {copy.stays[option]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}

function PackageCard({ pkg, lang }) {
  const messages = getMessages(lang);
  const copy = messages.packages;
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saveState, saveAction, saving] = useActionState(savePackageAction, null);
  const [deleteState, deleteAction, deleting] = useActionState(deletePackageAction, null);

  if (editing) {
    return (
      <li className="rounded-card border border-brand bg-card p-6 shadow-card">
        <form action={saveAction}>
          <input type="hidden" name="id" value={pkg.id} />
          <PackageFields copy={copy} pkg={pkg} />
          <ErrorNote error={saveState?.error} copy={copy} />
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving ? copy.saving : copy.save}
            </button>
            <button type="button" onClick={() => setEditing(false)} className={secondaryButton}>
              {copy.cancel}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-card border border-line bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold">{pkg.name}</h3>
          <p className="mt-2 leading-relaxed text-ink-soft">{pkg.description}</p>
          <p className="mt-2 text-sm text-ink-soft">
            {interpolate(messages.profile.packageDelivery, { days: pkg.deliveryDays })}
            {" · "}
            {interpolate(copy.revisionsValue, { count: pkg.revisions })}
            {pkg.stay ? ` · ${copy.stayValue} ${copy.stays[pkg.stay]}` : ""}
          </p>
        </div>
        <p className="font-display text-3xl font-semibold">
          {formatCurrency(pkg.priceAmount, pkg.priceCurrency, getIntlLocale(lang))}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => setEditing(true)} className={secondaryButton}>
          {copy.edit}
        </button>
        {pkg.orderCount > 0 ? (
          <p className="text-sm text-ink-soft">{copy.hasOrdersNote}</p>
        ) : confirming ? (
          <form action={deleteAction} className="flex flex-wrap items-center gap-3">
            <input type="hidden" name="id" value={pkg.id} />
            <button type="submit" disabled={deleting} className={primaryButton}>
              {deleting ? copy.deleting : copy.deleteConfirm}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className={secondaryButton}>
              {copy.cancel}
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className={secondaryButton}>
            {copy.delete}
          </button>
        )}
      </div>
      <ErrorNote error={deleteState?.error} copy={copy} />
    </li>
  );
}

function AddPackageForm({ lang }) {
  const { packages: copy } = getMessages(lang);
  const [state, formAction, pending] = useActionState(savePackageAction, null);

  return (
    <div className="rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
      <h2 className="font-display text-2xl font-semibold">{copy.addHeading}</h2>
      {/* The key changes after a successful add, which clears the inputs. */}
      <form key={state?.ok === "added" ? state.at : "new"} action={formAction} className="mt-6">
        <PackageFields copy={copy} />
        <ErrorNote error={state?.error} copy={copy} />
        {state?.ok === "added" ? (
          <p role="status" className="mt-4 rounded-xl bg-soft p-4 text-sm text-ink-soft">
            {copy.added}
          </p>
        ) : null}
        <button type="submit" disabled={pending} className={`${primaryButton} mt-6`}>
          {pending ? copy.adding : copy.add}
        </button>
      </form>
    </div>
  );
}

export default function PackagesManager({ lang, items }) {
  const { packages: copy } = getMessages(lang);
  const full = items.length >= PACKAGE_LIMITS.maxPackages;

  return (
    <div className="mt-8 space-y-8">
      {items.length === 0 ? (
        <p className="text-ink-soft">{copy.emptyList}</p>
      ) : (
        <ul className="space-y-5">
          {items.map((pkg) => (
            // The key includes the values, so the card resets (leaves edit mode) after a save.
            <PackageCard
              key={`${pkg.id}-${pkg.name}-${pkg.description}-${pkg.priceAmount}-${pkg.deliveryDays}-${pkg.revisions}-${pkg.stay}`}
              pkg={pkg}
              lang={lang}
            />
          ))}
        </ul>
      )}

      {full ? (
        <p className="rounded-xl bg-soft p-4 text-sm text-ink-soft">
          {interpolate(copy.limitReached, { max: PACKAGE_LIMITS.maxPackages })}
        </p>
      ) : (
        <AddPackageForm lang={lang} />
      )}
    </div>
  );
}

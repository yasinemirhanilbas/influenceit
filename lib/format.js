// Formatting helpers based on the Intl API.
// Prices are stored as a number plus a currency code, never as formatted text.
// Default Intl locale; pass getIntlLocale(lang) from locales/config.js to override.
export const DEFAULT_LOCALE = "en-TR";

export function formatCurrency(amount, currency, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol", // shows ₺ instead of "TRY"
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(value, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatPercent(value, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRating(value, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(value, locale = DEFAULT_LOCALE) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(new Date(value));
}

export function formatNumber(value, locale = DEFAULT_LOCALE) {
  return new Intl.NumberFormat(locale).format(value);
}

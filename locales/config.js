// Language settings shared by the app, proxy.js and the language switcher.
// Keep this file tiny: proxy.js imports it.
export const locales = ["en", "tr"];
export const defaultLocale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

// Names are written in their own language, as the switcher shows them.
export const localeNames = { en: "English", tr: "Türkçe" };

// Locale tags passed to the Intl API (numbers, currency, percent).
export const intlLocales = { en: "en-TR", tr: "tr-TR" };

export function isLocale(value) {
  return locales.includes(value);
}

export function getIntlLocale(lang) {
  return intlLocales[lang] ?? intlLocales[defaultLocale];
}

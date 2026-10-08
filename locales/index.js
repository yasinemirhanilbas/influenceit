import en from "./en";
import tr from "./tr";
import { defaultLocale } from "./config";

export * from "./config";

const dictionaries = { en, tr };

// Returns all UI text for a language. Unknown languages fall back to English.
export function getMessages(lang) {
  return dictionaries[lang] ?? dictionaries[defaultLocale];
}

// Replaces {name} placeholders in a template string.
export function interpolate(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

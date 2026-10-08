import en from "./en";

// Single entry point for UI text. To add a language, create locales/<code>.js
// and select it here (for example from a cookie or a route segment).
export const messages = en;

// Replaces {name} placeholders in a template string.
export function interpolate(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}

// Phone numbers: the creator picks a country code and types the rest. Shared by the sign-up form and the server action.
// Digits after the country code (without a leading 0): min and max, plus an example shown as placeholder.
export const PHONE_CODES = [
  { code: "+90", label: "TR +90", min: 10, max: 10, example: "532 123 45 67" },
  { code: "+357", label: "CY +357", min: 8, max: 8, example: "99 123456" },
  { code: "+49", label: "DE +49", min: 10, max: 11, example: "151 2345 6789" },
  { code: "+44", label: "GB +44", min: 10, max: 10, example: "7400 123456" },
  { code: "+1", label: "US/CA +1", min: 10, max: 10, example: "212 555 0123" },
  { code: "+31", label: "NL +31", min: 9, max: 9, example: "6 12345678" },
  { code: "+32", label: "BE +32", min: 8, max: 9, example: "470 12 34 56" },
  { code: "+33", label: "FR +33", min: 9, max: 9, example: "6 12 34 56 78" },
  { code: "+34", label: "ES +34", min: 9, max: 9, example: "612 345 678" },
  { code: "+39", label: "IT +39", min: 9, max: 10, example: "312 345 6789" },
  { code: "+41", label: "CH +41", min: 9, max: 9, example: "78 123 45 67" },
  { code: "+43", label: "AT +43", min: 10, max: 11, example: "664 1234567" },
  { code: "+7", label: "RU/KZ +7", min: 10, max: 10, example: "912 345 67 89" },
  { code: "+994", label: "AZ +994", min: 9, max: 9, example: "50 123 45 67" },
  { code: "+966", label: "SA +966", min: 9, max: 9, example: "51 234 5678" },
  { code: "+971", label: "AE +971", min: 9, max: 9, example: "50 123 4567" },
];
export const DEFAULT_PHONE_CODE = "+90";

export const phoneRule = (code) => PHONE_CODES.find((item) => item.code === code) ?? null;

// Used while typing: keeps digits only (one leading 0 is allowed) and cuts the number at the country's maximum.
export function limitPhoneInput(code, raw) {
  const rule = phoneRule(code);
  const digits = String(raw ?? "").replace(/\D/g, "").replace(/^0+/, "0");
  if (!rule) return digits;
  return digits.slice(0, rule.max + (digits.startsWith("0") ? 1 : 0));
}

// Returns the number as "+<code><digits>" (for example "+905321234567"), or null when it is not valid.
// A leading 0 is dropped. The digit count must fit the country (see PHONE_CODES).
export function normalizePhone(code, raw) {
  const rule = phoneRule(code);
  if (!rule) return null;
  if (!/^[\d\s()-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  return digits.length >= rule.min && digits.length <= rule.max ? `${code}${digits}` : null;
}

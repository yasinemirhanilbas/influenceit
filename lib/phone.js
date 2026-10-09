// Phone numbers: the creator picks a country code and types the rest. Shared by the sign-up form and the server action.
export const PHONE_CODES = [
  { code: "+90", label: "TR +90" },
  { code: "+357", label: "CY +357" },
  { code: "+49", label: "DE +49" },
  { code: "+44", label: "GB +44" },
  { code: "+1", label: "US/CA +1" },
  { code: "+31", label: "NL +31" },
  { code: "+32", label: "BE +32" },
  { code: "+33", label: "FR +33" },
  { code: "+34", label: "ES +34" },
  { code: "+39", label: "IT +39" },
  { code: "+41", label: "CH +41" },
  { code: "+43", label: "AT +43" },
  { code: "+7", label: "RU/KZ +7" },
  { code: "+994", label: "AZ +994" },
  { code: "+966", label: "SA +966" },
  { code: "+971", label: "AE +971" },
];
export const DEFAULT_PHONE_CODE = "+90";

// Returns the number as "+<code><digits>" (for example "+905321234567"), or null when it is not valid.
// A leading 0 is dropped. Turkish numbers must have exactly 10 digits after the code; others 6 to 12.
export function normalizePhone(code, raw) {
  if (!PHONE_CODES.some((item) => item.code === code)) return null;
  if (!/^[\d\s()-]+$/.test(raw)) return null;
  const digits = raw.replace(/\D/g, "").replace(/^0+/, "");
  const valid = code === "+90" ? digits.length === 10 : digits.length >= 6 && digits.length <= 12;
  return valid ? `${code}${digits}` : null;
}

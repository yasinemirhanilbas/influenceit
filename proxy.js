import { NextResponse } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE } from "./locales/config";

// Picks the language for first-time visits: saved choice first, then the
// browser's Accept-Language header, then the default.
function pickLocale(request) {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;

  const header = request.headers.get("accept-language") ?? "";
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { language: tag.toLowerCase().split("-")[0], weight: q ? Number(q) : 1 };
    })
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  const match = ranked.find((item) => isLocale(item.language));
  return match ? match.language : defaultLocale;
}

// Only the root URL needs a redirect. Every page lives under /en or /tr.
export function proxy(request) {
  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};

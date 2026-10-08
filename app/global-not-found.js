import "./globals.css";
import { Fraunces, Manrope } from "next/font/google";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin", "latin-ext"], display: "swap" });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata = {
  title: "404 | InfluenceIt",
  description: "Page not found.",
};

// Used when an address matches no route at all, so the language is unknown.
// Both languages are shown on purpose, with no links. Text stays here because this page
// bypasses the normal layout and locale loading.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body className="min-h-screen antialiased">
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 text-center">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
          <div className="relative">
            <p className="text-gradient font-display text-8xl font-semibold leading-none sm:text-9xl">404</p>
            <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
              This page does not exist
            </h1>
            <p className="mt-2 text-lg text-ink-soft">Bu sayfa mevcut değil</p>
          </div>
        </main>
      </body>
    </html>
  );
}

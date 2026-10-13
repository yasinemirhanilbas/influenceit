import { Fraunces, Manrope, Space_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AssistantWidget from "@/components/AssistantWidget";
import { getMessages, isLocale, locales } from "@/locales";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Pre-render every language listed in locales/config.js.
// Other values are rejected with notFound() below and in the page.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const messages = getMessages(lang);
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const messages = getMessages(lang);

  return (
    <html lang={lang} className={`${fraunces.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          {messages.common.skipToContent}
        </a>
        <SiteHeader lang={lang} />
        <main id="main">{children}</main>
        <SiteFooter lang={lang} />
        <AssistantWidget lang={lang} copy={messages.assistant} />
      </body>
    </html>
  );
}

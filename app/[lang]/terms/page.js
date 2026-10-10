import { notFound } from "next/navigation";
import LegalPage from "@/components/LegalPage";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).legal.terms.title };
}

export default async function TermsPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <LegalPage lang={lang} kind="terms" />;
}

import { notFound } from "next/navigation";
import ComparisonSection from "@/components/ComparisonSection";
import FaqSection from "@/components/FaqSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PageHeader from "@/components/PageHeader";
import SignUpCta from "@/components/SignUpCta";
import StatsSection from "@/components/StatsSection";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { pages } = getMessages(lang);
  return { title: pages.howItWorks.title, description: pages.howItWorks.description };
}

export default async function HowItWorksPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { pages } = getMessages(lang);
  const copy = pages.howItWorks;

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.heading} subtitle={copy.subheading} />
      <HowItWorksSection lang={lang} />
      <StatsSection lang={lang} />
      <ComparisonSection lang={lang} />
      <FaqSection lang={lang} />
      <SignUpCta lang={lang} />
    </>
  );
}

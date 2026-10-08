import { notFound } from "next/navigation";
import CreatorDirectory from "@/components/CreatorDirectory";
import PageHeader from "@/components/PageHeader";
import SignUpCta from "@/components/SignUpCta";
import { creators } from "@/data/creators";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { pages } = getMessages(lang);
  return { title: pages.creators.title, description: pages.creators.description };
}

export default async function CreatorsPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { pages } = getMessages(lang);
  const copy = pages.creators;

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.heading} subtitle={copy.subheading} />
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <CreatorDirectory creators={creators} lang={lang} />
      </section>
      <SignUpCta lang={lang} />
    </>
  );
}

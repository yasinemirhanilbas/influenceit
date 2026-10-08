import { notFound } from "next/navigation";
import LoginPanels from "@/components/LoginPanels";
import PageHeader from "@/components/PageHeader";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { pages } = getMessages(lang);
  return { title: pages.login.title, description: pages.login.description };
}

export default async function LoginPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { pages } = getMessages(lang);
  const copy = pages.login;

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.heading} subtitle={copy.subheading} />
      <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <LoginPanels lang={lang} />
      </section>
    </>
  );
}

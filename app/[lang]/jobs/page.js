import { notFound } from "next/navigation";
import JobBoard from "@/components/JobBoard";
import PageHeader from "@/components/PageHeader";
import SignUpCta from "@/components/SignUpCta";
import { getOpenJobs } from "@/lib/queries";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { pages } = getMessages(lang);
  return { title: pages.jobs.title, description: pages.jobs.description };
}

export default async function JobsPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { pages, jobs } = getMessages(lang);
  const copy = pages.jobs;
  const briefs = await getOpenJobs(lang);

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.heading} subtitle={copy.subheading} />
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <JobBoard briefs={briefs} lang={lang} />
        <p className="mt-8 text-sm text-ink-soft">{jobs.note}</p>
      </section>
      <SignUpCta lang={lang} />
    </>
  );
}

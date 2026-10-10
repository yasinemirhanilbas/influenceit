import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Button from "@/components/Button";
import JobForm from "@/components/JobForm";
import PageHeader from "@/components/PageHeader";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).jobForm.metaTitle, robots: { index: false } };
}

// Reads the login cookie, so it must render at request time (inside Suspense).
async function NewJobContent({ lang }) {
  const routes = getRoutes(lang);
  const { jobForm } = getMessages(lang);
  const user = await getSessionUser();
  if (!user) redirect(routes.login);

  if (!user.brandProfile) {
    return (
      <div className="mx-auto max-w-2xl rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
        <p className="text-ink-soft">{jobForm.brandOnly}</p>
        <div className="mt-6">
          <Button href={routes.jobs} variant="secondary">
            {jobForm.backToJobs}
          </Button>
        </div>
      </div>
    );
  }

  return <JobForm lang={lang} />;
}

export default async function NewJobPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { jobForm } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={jobForm.eyebrow} title={jobForm.heading} subtitle={jobForm.subheading} />
      <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-ink-soft">{jobForm.loading}</p>}>
          <NewJobContent lang={lang} />
        </Suspense>
      </section>
    </>
  );
}

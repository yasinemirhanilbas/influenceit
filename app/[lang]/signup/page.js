import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SignupForm from "@/components/SignupForm";
import { getMessages, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const { pages } = getMessages(lang);
  return { title: pages.signup.title, description: pages.signup.description };
}

export default async function SignupPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { signup } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={signup.eyebrow} title={signup.heading} subtitle={signup.subheading} />
      <section className="mx-auto max-w-xl px-5 py-12 sm:py-16">
        {/* useSearchParams needs a Suspense boundary */}
        <Suspense fallback={null}>
          <SignupForm lang={lang} />
        </Suspense>
      </section>
    </>
  );
}

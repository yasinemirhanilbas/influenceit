import PageHeader from "./PageHeader";
import { getMessages } from "@/locales";

// Plain text page for the terms and the privacy policy. Text lives in locales (`legal.terms` / `legal.privacy`).
export default function LegalPage({ lang, kind }) {
  const { legal } = getMessages(lang);
  const copy = legal[kind];

  return (
    <>
      <PageHeader eyebrow={legal.eyebrow} title={copy.heading} subtitle={copy.intro} />
      <section className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <p className="rounded-xl bg-soft p-4 text-sm text-ink-soft">{legal.prototypeNote}</p>
        <div className="mt-8 space-y-8">
          {copy.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{section.text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

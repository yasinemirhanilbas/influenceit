import SectionHeading from "./SectionHeading";
import { ChevronIcon } from "./icons";
import { messages } from "@/locales";

export default function FaqSection() {
  const { faq } = messages;

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 border-b border-line"
    >
      <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:grid lg:grid-cols-[1fr_1.6fr] lg:gap-16 lg:py-24">
        <SectionHeading
          id="faq-heading"
          eyebrow={faq.eyebrow}
          title={faq.heading}
          subtitle={faq.subheading}
        />

        <div className="mt-10 space-y-3 lg:mt-0">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-card border border-line bg-card shadow-card"
            >
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 py-4 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronIcon className="h-5 w-5 shrink-0 text-brand transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 leading-relaxed text-ink-soft">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

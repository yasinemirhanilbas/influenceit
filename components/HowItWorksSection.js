import SectionHeading from "./SectionHeading";
import { messages, interpolate } from "@/locales";

// Index of the step that is highlighted as the escrow step.
const ESCROW_STEP_INDEX = 2;

export default function HowItWorksSection() {
  const { howItWorks } = messages;

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative scroll-mt-24 border-b border-line bg-card"
    >
      <div aria-hidden="true" className="scallop-top" />
      <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:py-24">
        <SectionHeading
          id="how-heading"
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.heading}
          subtitle={howItWorks.subheading}
        />

        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {howItWorks.steps.map((step, index) => {
            const isEscrow = index === ESCROW_STEP_INDEX;
            return (
              <li
                key={step.title}
                className={`relative rounded-card border p-6 ${isEscrow ? "border-brand bg-brand-soft" : "border-line bg-paper shadow-card"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gradient font-display text-5xl font-semibold leading-none">
                    {index + 1}
                  </span>
                  {isEscrow ? (
                    <span className="rounded-md border-2 border-stamp px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-stamp">
                      {howItWorks.escrowTag}
                    </span>
                  ) : null}
                </div>
                <p className="sr-only">{interpolate(howItWorks.stepLabel, { number: index + 1 })}</p>
                <h3 className="mt-5 font-display text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{step.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

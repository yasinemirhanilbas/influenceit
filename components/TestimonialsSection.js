import SectionHeading from "./SectionHeading";
import { messages } from "@/locales";
import { testimonials } from "@/data/testimonials";
import { formatCompactNumber } from "@/lib/format";

function getInitial(name) {
  return name[0].toUpperCase();
}

export default function TestimonialsSection() {
  const { testimonials: copy } = messages;

  return (
    <section
      id="stories"
      aria-labelledby="testimonials-heading"
      className="relative scroll-mt-24 border-b border-line bg-card"
    >
      <div aria-hidden="true" className="scallop-top" />
      <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:py-24">
        <SectionHeading
          id="testimonials-heading"
          eyebrow={copy.eyebrow}
          title={copy.heading}
        />

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-paper p-6 shadow-card">
                <p className="font-display leading-none">
                  <span className="text-gradient text-6xl font-semibold">
                    {formatCompactNumber(item.metric.value)}
                  </span>
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-soft">
                  {copy.metricLabels[item.metric.labelKey]}
                </p>

                <blockquote className="mt-5 flex-1 font-display text-lg leading-snug">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>

                <figcaption className="mt-5 flex items-center gap-3 border-t border-dashed border-line pt-4">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-ink font-display text-lg font-semibold text-paper"
                  >
                    {getInitial(item.brand)}
                  </span>
                  <span>
                    <span className="block font-semibold">{item.brand}</span>
                    <span className="block text-sm text-ink-soft">
                      {item.person}, {item.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-ink-soft">{copy.note}</p>
      </div>
    </section>
  );
}

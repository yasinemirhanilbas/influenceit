import SectionHeading from "./SectionHeading";
import { getMessages } from "@/locales";
import { testimonials } from "@/data/testimonials";
import { getIntlLocale } from "@/locales";
import { formatCompactNumber } from "@/lib/format";

function getInitial(name) {
  return name[0].toUpperCase();
}

export default function TestimonialsSection({ lang }) {
  const messages = getMessages(lang);
  const { testimonials: copy } = messages;

  return (
    <section
      id="stories"
      aria-labelledby="testimonials-heading"
      className="relative scroll-mt-24 border-b border-line bg-soft"
    >
      <div className="reveal mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:py-32">
        <SectionHeading
          id="testimonials-heading"
          eyebrow={copy.eyebrow}
          title={copy.heading}
        />

        <ul className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id}>
              <figure className="flex h-full flex-col rounded-card border border-line bg-card p-6 shadow-card">
                <p className="font-display leading-none">
                  <span className="text-gradient text-6xl font-semibold">
                    {formatCompactNumber(item.metric.value, getIntlLocale(lang))}
                  </span>
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-soft">
                  {copy.metricLabels[item.metric.labelKey]}
                </p>

                <blockquote className="mt-5 flex-1 font-display text-lg leading-snug">
                  &ldquo;{copy.items[item.id].quote}&rdquo;
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
                      {item.person}, {copy.items[item.id].role}
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

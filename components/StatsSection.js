import SectionHeading from "./SectionHeading";
import { messages } from "@/locales";
import { stats } from "@/data/stats";
import { formatCompactNumber, formatNumber, formatPercent } from "@/lib/format";

function formatStat({ value, kind }) {
  if (kind === "percent") return formatPercent(value);
  if (kind === "compact") return formatCompactNumber(value);
  return formatNumber(value);
}

export default function StatsSection() {
  const { stats: copy } = messages;

  return (
    <section aria-labelledby="stats-heading" className="border-b border-line">
      <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <SectionHeading id="stats-heading" eyebrow={copy.eyebrow} title={copy.heading} />

        <dl className="mt-10 grid grid-cols-2 overflow-hidden rounded-card border border-line bg-card shadow-card lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`p-6 sm:p-8 ${index % 2 === 0 ? "border-r border-dashed border-line" : ""} ${index < 2 ? "border-b border-dashed border-line lg:border-b-0" : ""} ${index === 1 ? "lg:border-r lg:border-dashed" : ""} ${index === 2 ? "lg:border-r lg:border-dashed" : ""}`}
            >
              <dd className="text-gradient font-display text-5xl font-semibold leading-none">
                {formatStat(stat)}
              </dd>
              <dt className="mt-3 text-sm text-ink-soft">{copy.items[stat.id]}</dt>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm text-ink-soft">{copy.note}</p>
      </div>
    </section>
  );
}

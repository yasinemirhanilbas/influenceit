import Link from "next/link";
import BriefCard from "./BriefCard";
import SectionHeading from "./SectionHeading";
import { getMessages } from "@/locales";
import { briefs } from "@/data/briefs";
import { getRoutes } from "@/lib/routes";

function Cards({ lang, duplicate = false }) {
  return briefs.map((brief) => (
    <li
      key={`${duplicate ? "copy-" : ""}${brief.id}`}
      className="w-72 shrink-0 pr-5 sm:w-80"
      {...(duplicate ? { "aria-hidden": "true", "data-duplicate": "" } : {})}
    >
      <BriefCard brief={brief} lang={lang} />
    </li>
  ));
}

export default function OpenBriefsSection({ lang }) {
  const { jobs } = getMessages(lang);
  const routes = getRoutes(lang);

  return (
    <section
      id="jobs"
      aria-labelledby="jobs-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-line"
    >
      <div className="reveal mx-auto max-w-6xl px-5 pt-20 sm:pt-24 lg:pt-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="jobs-heading"
            eyebrow={jobs.eyebrow}
            title={jobs.heading}
            subtitle={jobs.subheading}
          />
          <Link
            href={routes.jobs}
            className="inline-flex min-h-12 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            {jobs.browseAll}
          </Link>
        </div>
      </div>

      <div className="marquee mt-10 overflow-hidden pb-4 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <ul
          aria-label={jobs.listLabel}
          className="marquee-track marquee-track-reverse"
          style={{ animationDuration: "70s" }}
        >
          <Cards lang={lang} />
          <Cards lang={lang} duplicate />
        </ul>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-16 text-sm text-ink-soft">{jobs.note}</p>
    </section>
  );
}

import Link from "next/link";
import CreatorGrid from "./CreatorGrid";
import SectionHeading from "./SectionHeading";
import { messages } from "@/locales";
import { creators } from "@/data/creators";
import { routes } from "@/lib/routes";

export default function FeaturedCreators() {
  const { featured } = messages;

  return (
    <section
      id="creators"
      aria-labelledby="featured-heading"
      className="relative scroll-mt-24 border-b border-line bg-card"
    >
      <div aria-hidden="true" className="scallop-top" />
      <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="featured-heading"
            eyebrow={featured.eyebrow}
            title={featured.heading}
            subtitle={featured.subheading}
          />
          <Link
            href={routes.browseCreators}
            className="inline-flex min-h-12 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {featured.browseAll}
          </Link>
        </div>

        <CreatorGrid creators={creators} />
      </div>
    </section>
  );
}

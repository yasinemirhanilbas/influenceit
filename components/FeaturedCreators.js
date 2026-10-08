import Link from "next/link";
import CreatorGrid from "./CreatorGrid";
import SectionHeading from "./SectionHeading";
import { getMessages } from "@/locales";
import { creators } from "@/data/creators";
import { getRoutes } from "@/lib/routes";

export default function FeaturedCreators({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { featured } = messages;

  return (
    <section
      id="creators"
      aria-labelledby="featured-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-line bg-soft"
    >
      <div className="reveal mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:py-32">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="featured-heading"
            eyebrow={featured.eyebrow}
            title={featured.heading}
            subtitle={featured.subheading}
          />
          <Link
            href={routes.browseCreators}
            className="inline-flex min-h-12 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            {featured.browseAll}
          </Link>
        </div>

        <CreatorGrid creators={creators} lang={lang} />
      </div>
    </section>
  );
}

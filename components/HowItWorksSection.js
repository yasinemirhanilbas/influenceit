import Link from "next/link";
import HowItWorksTabs from "./HowItWorksTabs";
import SectionHeading from "./SectionHeading";
import { getMessages } from "@/locales";
import { getRoutes } from "@/lib/routes";

export default function HowItWorksSection({ lang, showFullLink = false }) {
  const { howItWorks } = getMessages(lang);
  const routes = getRoutes(lang);

  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="relative scroll-mt-24 border-b border-line bg-soft"
    >
      <div className="reveal mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:py-32">
        <SectionHeading
          id="how-heading"
          eyebrow={howItWorks.eyebrow}
          title={howItWorks.heading}
          subtitle={howItWorks.subheading}
        />
        <HowItWorksTabs copy={howItWorks} />
        {showFullLink ? (
          <Link
            href={routes.howItWorks}
            className="mt-8 inline-flex min-h-12 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            {howItWorks.seeFull}
          </Link>
        ) : null}
      </div>
    </section>
  );
}

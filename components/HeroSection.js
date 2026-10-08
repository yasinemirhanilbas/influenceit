import Link from "next/link";
import Button from "./Button";
import ReceiptCard from "./ReceiptCard";
import { CheckIcon } from "./icons";
import { getMessages } from "@/locales";
import { getRoutes } from "@/lib/routes";

export default function HeroSection({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { hero, common } = messages;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-line"
    >
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-4 sm:pb-20 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <p className="label-mono mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-card/80 px-3.5 py-1.5 text-xs text-ink-soft shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-gradient" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-7xl"
          >
            <span className="block">{hero.headlineLead}</span>
            <span className="text-gradient block pb-1 italic">{hero.headlineEmphasis}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            {hero.subheadline}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div>
              <Button href={routes.signUpBrand} variant="primary" className="w-full">
                {common.startAsBrand}
              </Button>
              <p className="mt-2 text-sm text-ink-soft">{hero.brandHint}</p>
            </div>
            <div>
              <Button href={routes.signUpCreator} variant="secondary" className="w-full">
                {common.joinAsCreator}
              </Button>
              <p className="mt-2 text-sm text-ink-soft">{hero.creatorHint}</p>
            </div>
          </div>

          <p className="mt-8 text-ink-soft">
            {hero.twoSided}{" "}
            <Link
              href={routes.jobs}
              className="font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
            >
              {hero.browseJobs}
            </Link>
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {hero.trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 lg:mt-6">
          <ReceiptCard lang={lang} />
        </div>
      </div>
    </section>
  );
}

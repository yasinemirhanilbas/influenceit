import Button from "./Button";
import ReceiptCard from "./ReceiptCard";
import { CheckIcon } from "./icons";
import { messages } from "@/locales";
import { routes } from "@/lib/routes";

export default function HeroSection() {
  const { hero, common } = messages;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-line"
    >
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-4 sm:pb-20 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:pb-28">
        <div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-sm font-medium text-ink-soft shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-gradient" />
            {hero.eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl"
          >
            <span className="block">{hero.headlineLead}</span>
            <span className="text-gradient block pb-1">{hero.headlineEmphasis}</span>
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

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium">
            {hero.trustItems.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 lg:mt-6">
          <ReceiptCard />
        </div>
      </div>
    </section>
  );
}

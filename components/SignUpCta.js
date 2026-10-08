import Button from "./Button";
import SectionHeading from "./SectionHeading";
import { messages } from "@/locales";
import { routes } from "@/lib/routes";

export default function SignUpCta() {
  const { cta, common } = messages;

  return (
    <section aria-labelledby="cta-heading" className="bg-brand-gradient-deep text-paper">
      <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:py-20 lg:py-24">
        <SectionHeading
          id="cta-heading"
          eyebrow={common.brandName}
          title={cta.heading}
          subtitle={cta.subheading}
          tone="dark"
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="flex flex-col rounded-card border border-paper/20 bg-brand-dark/60 p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold">{cta.brand.title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-paper/85">{cta.brand.description}</p>
            <Button href={routes.signUpBrand} variant="accent" className="mt-6 w-full sm:w-fit">
              {common.startAsBrand}
            </Button>
          </div>
          <div className="flex flex-col rounded-card border border-paper/20 bg-brand-dark/60 p-6 sm:p-8">
            <h3 className="font-display text-2xl font-semibold">{cta.creator.title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-paper/85">{cta.creator.description}</p>
            <Button href={routes.signUpCreator} variant="light" className="mt-6 w-full sm:w-fit">
              {common.joinAsCreator}
            </Button>
          </div>
        </div>

        <p className="mt-10 text-sm text-paper/75">{cta.prototypeNote}</p>
      </div>
    </section>
  );
}

import Button from "./Button";
import SectionHeading from "./SectionHeading";
import { getMessages } from "@/locales";
import { getRoutes } from "@/lib/routes";

export default function SignUpCta({ lang }) {
  const messages = getMessages(lang);
  const routes = getRoutes(lang);
  const { cta, common } = messages;

  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden border-t border-line bg-soft">
      <div aria-hidden="true" className="cta-glow pointer-events-none absolute inset-0" />
      <div className="reveal relative mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:py-32">
        <SectionHeading
          id="cta-heading"
          eyebrow={common.brandName}
          title={cta.heading}
          subtitle={cta.subheading}
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="bg-brand-gradient-deep flex flex-col rounded-card p-6 text-white shadow-glow sm:p-8">
            <h3 className="font-display text-2xl font-semibold">{cta.brand.title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-white/90">{cta.brand.description}</p>
            <Button href={routes.signUpBrand} variant="light" className="mt-6 w-full sm:w-fit">
              {common.startAsBrand}
            </Button>
          </div>
          <div className="flex flex-col rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
            <h3 className="font-display text-2xl font-semibold">{cta.creator.title}</h3>
            <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{cta.creator.description}</p>
            <Button href={routes.signUpCreator} variant="secondary" className="mt-6 w-full sm:w-fit">
              {common.joinAsCreator}
            </Button>
          </div>
        </div>

        <p className="mt-10 text-sm text-ink-soft">{cta.prototypeNote}</p>
      </div>
    </section>
  );
}

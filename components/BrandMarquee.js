import { messages } from "@/locales";
import { brands } from "@/data/brands";

const wordmarkStyles = {
  serif: "font-display text-xl font-semibold",
  italic: "font-display text-xl italic font-medium",
  spaced: "text-sm font-semibold uppercase tracking-[0.25em]",
  bold: "text-xl font-extrabold tracking-tight",
};

function Wordmarks({ duplicate = false }) {
  return brands.map((brand) => (
    <li
      key={`${duplicate ? "copy-" : ""}${brand.id}`}
      className={`whitespace-nowrap px-8 text-ink/70 ${wordmarkStyles[brand.style]}`}
      {...(duplicate ? { "aria-hidden": "true", "data-duplicate": "" } : {})}
    >
      {brand.name}
    </li>
  ));
}

export default function BrandMarquee() {
  const { brandStrip } = messages;

  return (
    <section aria-label={brandStrip.label} className="border-b border-line py-8">
      <p className="px-5 text-center text-xs font-semibold uppercase tracking-widest text-ink-soft">
        {brandStrip.label}
      </p>
      <div className="marquee mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="marquee-track items-center">
          <Wordmarks />
          <Wordmarks duplicate />
        </ul>
      </div>
      <p className="mt-5 px-5 text-center text-xs text-ink-soft">{brandStrip.note}</p>
    </section>
  );
}

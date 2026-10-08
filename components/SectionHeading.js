export default function SectionHeading({ id, eyebrow, title, subtitle, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <div className="max-w-2xl">
      <p
        className={`text-sm font-semibold uppercase tracking-widest ${dark ? "text-brand-soft" : "text-brand"}`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-3 text-lg ${dark ? "text-paper/80" : "text-ink-soft"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export default function SectionHeading({ id, eyebrow, title, subtitle, tone = "light" }) {
  const dark = tone === "dark";
  return (
    <div className="max-w-2xl">
      <p
        className={`label-mono text-xs font-bold ${dark ? "text-white/80" : "text-brand"}`}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-5xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-3 text-lg ${dark ? "text-white/90" : "text-ink-soft"}`}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

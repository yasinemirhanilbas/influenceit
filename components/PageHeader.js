export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <section aria-labelledby="page-heading" className="relative overflow-hidden border-b border-line">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <p className="label-mono text-xs font-bold text-brand">{eyebrow}</p>
        <h1
          id="page-heading"
          className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-6xl"
        >
          {title}
        </h1>
        {subtitle ? <p className="mt-4 max-w-2xl text-lg text-ink-soft">{subtitle}</p> : null}
      </div>
    </section>
  );
}

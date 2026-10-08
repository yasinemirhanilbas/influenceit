import SectionHeading from "./SectionHeading";
import { CheckIcon, XIcon } from "./icons";
import { getMessages } from "@/locales";

function Cell({ value, messages }) {
  const { common, comparison } = messages;

  if (value === "yes") {
    return (
      <>
        <span
          aria-hidden="true"
          className="bg-brand-gradient inline-flex h-7 w-7 items-center justify-center rounded-full text-white"
        >
          <CheckIcon className="h-4 w-4" />
        </span>
        <span className="sr-only">{common.yes}</span>
      </>
    );
  }
  if (value === "no") {
    return (
      <>
        <span
          aria-hidden="true"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-line text-ink-soft"
        >
          <XIcon className="h-3.5 w-3.5" />
        </span>
        <span className="sr-only">{common.no}</span>
      </>
    );
  }
  return <span className="text-sm font-medium text-ink-soft">{comparison.manual}</span>;
}

export default function ComparisonSection({ lang }) {
  const messages = getMessages(lang);
  const { comparison } = messages;

  return (
    <section aria-labelledby="comparison-heading" className="border-b border-line">
      <div className="reveal mx-auto max-w-4xl px-5 py-20 sm:py-24 lg:py-32">
        <SectionHeading
          id="comparison-heading"
          eyebrow={comparison.eyebrow}
          title={comparison.heading}
          subtitle={comparison.subheading}
        />

        <div className="mt-10 overflow-hidden rounded-card border border-line bg-card shadow-card">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">{comparison.heading}</caption>
            <thead>
              <tr className="text-sm">
                <th scope="col" className="px-4 py-4 font-semibold text-ink-soft sm:px-6">
                  {comparison.featureColumn}
                </th>
                <th
                  scope="col"
                  className="w-24 bg-brand-soft px-2 py-4 text-center font-display text-base font-semibold text-brand-dark sm:w-36"
                >
                  {comparison.usColumn}
                </th>
                <th
                  scope="col"
                  className="w-24 px-2 py-4 text-center font-semibold text-ink-soft sm:w-36"
                >
                  {comparison.othersColumn}
                </th>
              </tr>
            </thead>
            <tbody>
              {comparison.rows.map((row) => (
                <tr key={row.label} className="border-t border-dashed border-line">
                  <th
                    scope="row"
                    className="px-4 py-4 text-sm font-medium sm:px-6 sm:text-base"
                  >
                    {row.label}
                  </th>
                  <td className="bg-brand-soft/60 px-2 py-4 text-center">
                    <Cell value={row.us} messages={messages} />
                  </td>
                  <td className="px-2 py-4 text-center">
                    <Cell value={row.others} messages={messages} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

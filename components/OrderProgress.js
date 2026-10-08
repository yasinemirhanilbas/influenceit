import { PROGRESS_STEP } from "@/lib/orderStatus";

// Four-step progress bar. PROGRESS_STEP gives the latest finished step; the one after it is "up next".
export default function OrderProgress({ status, labels, title }) {
  const finished = PROGRESS_STEP[status] ?? 0;
  return (
    <ol aria-label={title} className="grid gap-4 sm:grid-cols-4">
      {labels.map((label, index) => {
        const complete = index <= finished;
        const next = index === finished + 1;
        const circle = complete
          ? "bg-brand-gradient border-transparent text-white"
          : next
            ? "border-brand text-brand"
            : "border-line text-ink-soft";
        return (
          <li key={label} aria-current={next ? "step" : undefined} className="flex items-center gap-3 sm:block">
            <span
              aria-hidden="true"
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${circle}`}
            >
              {complete ? "✓" : index + 1}
            </span>
            <span className={`text-sm font-semibold sm:mt-3 sm:block ${complete || next ? "text-ink" : "text-ink-soft"}`}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

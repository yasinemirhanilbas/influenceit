const looks = {
  PENDING: "border-line bg-card text-ink-soft",
  PAID: "border-brand-light bg-brand-soft text-brand-dark",
  DELIVERED: "border-brand bg-brand-soft text-brand-dark",
  REVISION: "border-brand-light bg-soft text-brand",
  APPROVED: "bg-brand-gradient border-transparent text-white",
};

// Small coloured label for an order status. `label` is already translated.
export default function OrderStatusBadge({ status, label }) {
  return (
    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${looks[status] ?? looks.PENDING}`}>
      {label}
    </span>
  );
}

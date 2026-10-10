// Error box under a form. `message` is already translated; nothing is shown without one.
export default function FormError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 rounded-xl border border-brand-light bg-brand-soft p-4 text-sm text-brand-dark">
      {message}
    </p>
  );
}

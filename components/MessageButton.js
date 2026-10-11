import { startConversationAction } from "@/app/[lang]/messages/actions";

const style =
  "inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-full border border-line bg-card px-7 font-semibold text-ink transition hover:border-brand active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

// "Message" button: opens (or creates) the conversation with the other party.
// Pass creatorSlug when the viewer is a brand, brandId when the viewer is a creator.
export default function MessageButton({ lang, label, creatorSlug, brandId, className = "" }) {
  return (
    <form action={startConversationAction} className={className}>
      <input type="hidden" name="lang" value={lang} />
      {creatorSlug ? <input type="hidden" name="creatorSlug" value={creatorSlug} /> : null}
      {brandId ? <input type="hidden" name="brandId" value={brandId} /> : null}
      <button type="submit" className={style}>
        {label}
      </button>
    </form>
  );
}

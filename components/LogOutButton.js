import { logOutAction } from "@/app/[lang]/auth/actions";
import { getMessages } from "@/locales";

// Log-out button for the header and the mobile menu. A form, so it works without extra client code.
export default function LogOutButton({ lang, className = "", size = "sm" }) {
  const { header } = getMessages(lang);
  const sizeClass = size === "sm" ? "min-h-11 px-5 text-sm" : "min-h-12 px-7 text-base";

  return (
    <form action={logOutAction} className={className}>
      <input type="hidden" name="lang" value={lang} />
      <button
        type="submit"
        className={`inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-line bg-card font-semibold text-ink transition hover:border-brand active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light ${sizeClass}`}
      >
        {header.logOut}
      </button>
    </form>
  );
}

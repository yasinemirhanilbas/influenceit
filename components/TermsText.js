import Link from "next/link";
import { getMessages } from "@/locales";
import { getRoutes } from "@/lib/routes";

// "I have read and accept the {terms} and the {privacy}." with both words as links (opened in a new tab so the form is kept).
export default function TermsText({ lang }) {
  const { signup } = getMessages(lang);
  const routes = getRoutes(lang);
  const linkClass =
    "font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
  const parts = signup.terms.split(/(\{terms\}|\{privacy\})/);

  return (
    <>
      {parts.map((part, index) => {
        if (part === "{terms}") {
          return (
            <Link key={index} href={routes.terms} target="_blank" className={linkClass}>
              {signup.termsLinkTerms}
            </Link>
          );
        }
        if (part === "{privacy}") {
          return (
            <Link key={index} href={routes.privacy} target="_blank" className={linkClass}>
              {signup.termsLinkPrivacy}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
}

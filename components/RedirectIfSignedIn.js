import { redirect } from "next/navigation";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";

// Renders nothing; sends logged-in visitors to their account (used on the login and sign-up pages, inside Suspense).
export default async function RedirectIfSignedIn({ lang }) {
  const user = await getSessionUser();
  if (user) redirect(getRoutes(lang).account);
  return null;
}

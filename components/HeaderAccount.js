import Button from "./Button";
import MobileNav from "./MobileNav";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getMessages } from "@/locales";

// Header buttons for visitors: shown while the login state loads and when nobody is logged in.
export function GuestButtons({ lang }) {
  const routes = getRoutes(lang);
  const { header } = getMessages(lang);
  return (
    <>
      <span className="hidden lg:inline-flex">
        <Button href={routes.login} size="sm" arrow={false} variant="secondary">
          {header.logIn}
        </Button>
      </span>
      <span className="hidden sm:inline-flex lg:hidden xl:inline-flex">
        <Button href={routes.signUp} size="sm" arrow={false}>
          {header.signUp}
        </Button>
      </span>
    </>
  );
}

// Reads the login cookie, so it renders at request time (wrap it in Suspense).
export default async function HeaderAccount({ lang }) {
  const user = await getSessionUser();
  const routes = getRoutes(lang);
  const { header } = getMessages(lang);

  return (
    <>
      {user ? (
        <span className="hidden sm:inline-flex">
          <Button href={routes.account} size="sm" arrow={false}>
            {header.account}
          </Button>
        </span>
      ) : (
        <GuestButtons lang={lang} />
      )}
      <MobileNav lang={lang} signedIn={Boolean(user)} />
    </>
  );
}

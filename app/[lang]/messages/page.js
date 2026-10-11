import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import PageHeader from "@/components/PageHeader";
import { imageUrl } from "@/lib/images";
import { listConversations } from "@/lib/messages";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getIntlLocale, getMessages, interpolate, isLocale } from "@/locales";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).messages.title, robots: { index: false } };
}

// Reads the login cookie, so it must render at request time (inside Suspense).
async function Inbox({ lang }) {
  const routes = getRoutes(lang);
  const { messages: copy } = getMessages(lang);
  const intl = getIntlLocale(lang);
  const user = await getSessionUser();
  if (!user) redirect(routes.login);

  const conversations = await listConversations(user);
  const isBrand = Boolean(user.brandProfile);

  if (conversations.length === 0) {
    return (
      <div>
        <p className="text-ink-soft">{isBrand ? copy.emptyBrand : copy.emptyCreator}</p>
        <div className="mt-6">
          <Button href={isBrand ? routes.creators : routes.jobs}>{isBrand ? copy.browseCreators : copy.browseJobs}</Button>
        </div>
      </div>
    );
  }

  const time = new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" });
  return (
    <ul className="space-y-4">
      {conversations.map((item) => (
        <li
          key={item.id}
          className="relative flex items-center gap-4 rounded-card border border-line bg-card p-4 shadow-card transition hover:border-brand sm:p-5"
        >
          <Avatar
            name={item.counterpart.name}
            avatar={{ ...item.counterpart.avatar, image: imageUrl(item.counterpart.avatar.imageName) }}
            size="h-14 w-14"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 className="font-display text-lg font-semibold">
                <Link
                  href={routes.message(item.id)}
                  className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                >
                  {item.counterpart.name}
                </Link>
              </h2>
              {item.last ? <span className="text-xs text-ink-soft">{time.format(new Date(item.last.createdAt))}</span> : null}
            </div>
            <p className="mt-1 truncate text-sm text-ink-soft">
              {item.last
                ? `${item.last.senderId === user.id ? copy.you : ""}${item.last.body}`
                : copy.noMessagesYet}
            </p>
          </div>
          {item.unread > 0 ? (
            <span className="shrink-0 rounded-full bg-action px-3 py-1 text-xs font-semibold text-white">
              {interpolate(copy.unread, { count: item.unread })}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export default async function MessagesPage({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { messages: copy } = getMessages(lang);

  return (
    <>
      <PageHeader eyebrow={copy.eyebrow} title={copy.heading} subtitle={copy.subheading} />
      <section className="mx-auto max-w-4xl px-5 py-12 sm:py-16">
        <Suspense fallback={<p className="text-ink-soft">{copy.loading}</p>}>
          <Inbox lang={lang} />
        </Suspense>
      </section>
    </>
  );
}

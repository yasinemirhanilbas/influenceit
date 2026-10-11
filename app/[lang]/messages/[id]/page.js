import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Avatar from "@/components/Avatar";
import Button from "@/components/Button";
import MessageForm from "@/components/MessageForm";
import ThreadLive from "@/components/ThreadLive";
import { db } from "@/lib/db";
import { imageUrl } from "@/lib/images";
import { counterpartOf, getConversationForUser, sideOf } from "@/lib/messages";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { getIntlLocale, getMessages, isLocale } from "@/locales";

// Conversations are private and only exist at runtime, so nothing real can be prebuilt. One sample id lets the
// build check the page; every real conversation is rendered on request.
export function generateStaticParams() {
  return [{ id: "0" }];
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return { title: getMessages(lang).messages.title, robots: { index: false } };
}

// Only the brand and the creator of the conversation can open it. It reads the login cookie and the id,
// so everything renders at request time (inside Suspense).
async function Thread({ params }) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const routes = getRoutes(lang);
  const { messages: copy } = getMessages(lang);
  const intl = getIntlLocale(lang);

  const user = await getSessionUser();
  if (!user) redirect(routes.login);
  const conversation = await getConversationForUser(user, id);
  if (!conversation) notFound();

  const side = sideOf(conversation, user);
  const other = counterpartOf(conversation, side);

  // Opening the conversation marks the other side's messages as read.
  await db.message.updateMany({
    where: { conversationId: conversation.id, senderId: { not: user.id }, readAt: null },
    data: { readAt: new Date() },
  });
  const messages = await db.message.findMany({ where: { conversationId: conversation.id }, orderBy: { createdAt: "asc" } });
  const time = new Intl.DateTimeFormat(intl, { dateStyle: "medium", timeStyle: "short" });

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 py-8 sm:py-10">
          <Link
            href={routes.messages}
            className="inline-flex min-h-11 items-center font-semibold text-brand underline underline-offset-4 hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          >
            ← {copy.back}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Avatar name={other.name} avatar={{ ...other.avatar, image: imageUrl(other.avatar.imageName) }} size="h-16 w-16" text="text-xl" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold leading-tight">{other.name}</h1>
              <p className="mt-1 text-sm text-ink-soft">
                {other.kind === "BRAND" ? copy.roleBrand : copy.roleCreator}
                {other.kind === "CREATOR" ? ` · ${other.subtitle}` : ""}
              </p>
            </div>
            {other.slug ? (
              <Button href={routes.creatorProfile(other.slug)} variant="secondary" size="sm" arrow={false}>
                {copy.viewProfile}
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-8 sm:py-10">
        {messages.length === 0 ? (
          <p className="rounded-card border border-line bg-card p-6 text-ink-soft">{copy.noMessagesYet}</p>
        ) : (
          <ol className="space-y-3" aria-label={copy.thread}>
            {messages.map((message) => {
              const mine = message.senderId === user.id;
              return (
                <li key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-card sm:max-w-[70%] ${
                      mine ? "bg-action text-white" : "border border-line bg-card text-ink"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{message.body}</p>
                    <p className={`mt-1 text-xs ${mine ? "text-white/80" : "text-ink-soft"}`}>{time.format(message.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        <ThreadLive count={messages.length} />
        <MessageForm lang={lang} conversationId={conversation.id} />
      </section>
    </>
  );
}

export default function MessageThreadPage({ params }) {
  return (
    <Suspense fallback={<p className="mx-auto max-w-4xl px-5 py-12 text-ink-soft">…</p>}>
      <Thread params={params} />
    </Suspense>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ASSISTANT_MAX_INPUT } from "@/lib/assistantConfig";
import { inputClass } from "@/components/formStyles";

// Round chat button in the bottom right corner that opens the site assistant.
// The answer is streamed from /api/assistant as plain text and shown as text only (never as HTML).
export default function AssistantWidget({ lang, copy }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: "user" | "assistant", content }
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, error, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  async function send(raw) {
    const question = raw.trim();
    if (!question || pending) return;
    if (question.length > ASSISTANT_MAX_INPUT) {
      setError(copy.errors.tooLong);
      return;
    }
    const history = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError(null);
    setPending(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: history }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "generic");
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) throw new Error("generic");
    } catch (failure) {
      if (controller.signal.aborted) return;
      setMessages(history); // drop the empty or half answer; the question stays so it can be asked again
      setError(copy.errors[failure.message] ?? copy.errors.generic);
    } finally {
      if (abortRef.current === controller) setPending(false);
    }
  }

  function onKeyDown(event) {
    if (event.key === "Escape") close();
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6" onKeyDown={onKeyDown}>
      {open ? (
        <section
          role="dialog"
          aria-label={copy.title}
          className="flex h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-card border border-line bg-card shadow-card"
        >
          <header className="flex items-start justify-between gap-3 border-b border-line bg-brand-gradient px-4 py-3 text-white">
            <div>
              <h2 className="font-display text-lg font-semibold">{copy.title}</h2>
              <p className="text-sm text-white/85">{copy.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={copy.close}
              className="-mr-1 grid size-9 shrink-0 place-items-center rounded-full text-xl leading-none hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ×
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" role="log" aria-live="polite" aria-label={copy.title}>
            <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-sm leading-relaxed">{copy.greeting}</p>
            {messages.length === 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {copy.suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-line px-3 py-1.5 text-left text-sm text-ink-soft transition hover:border-brand hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
            {messages.map((message, index) =>
              message.role === "user" ? (
                <p key={index} className="ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-brand-soft px-3.5 py-2.5 text-sm leading-relaxed text-brand-dark">
                  {message.content}
                </p>
              ) : (
                <p key={index} className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-sm leading-relaxed">
                  {message.content || (pending ? copy.thinking : "")}
                </p>
              ),
            )}
            {error ? (
              <p role="alert" className="rounded-xl border border-line px-3.5 py-2.5 text-sm text-ink-soft">
                {error}
              </p>
            ) : null}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="border-t border-line p-3"
          >
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={ASSISTANT_MAX_INPUT}
                placeholder={copy.placeholder}
                aria-label={copy.placeholder}
                autoComplete="off"
                className={`${inputClass} !mt-0 min-w-0 flex-1`}
              />
              <button
                type="submit"
                disabled={pending || input.trim().length === 0}
                className="bg-brand-gradient min-h-12 shrink-0 rounded-full px-5 font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
              >
                {copy.send}
              </button>
            </div>
            <p className="mt-2 text-xs text-ink-soft">{copy.disclaimer}</p>
          </form>
        </section>
      ) : null}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? copy.close : copy.open}
        aria-expanded={open}
        className="bg-brand-gradient grid size-14 place-items-center rounded-full text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />}
        </svg>
      </button>
    </div>
  );
}

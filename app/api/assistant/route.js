import {
  ASSISTANT_DEFAULT_MODEL,
  ASSISTANT_MAX_HISTORY,
  ASSISTANT_MAX_INPUT,
  ASSISTANT_MAX_OUTPUT_TOKENS,
  ASSISTANT_MAX_REPLY_CHARS,
  ASSISTANT_REQUESTS_PER_MINUTE,
  ASSISTANT_TEMPERATURE,
  ASSISTANT_TIMEOUT_MS,
} from "@/lib/assistantConfig";
import { buildSystemInstruction } from "@/lib/assistantKnowledge";
import { isLocale } from "@/locales";

// The site assistant: receives the chat so far, asks Gemini (with the site knowledge and the rules as system
// instruction) and streams the answer back as plain text. The API key never leaves the server.
// Errors are JSON: { error: "unavailable" | "tooFast" | "invalid" | "upstream" }.

const json = (error, status) => Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

// Very small in-memory limiter: fine for a single local server; a real deployment would use a shared store.
const hits = new Map();
function tooFast(key) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < 60000);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 1000) {
    for (const [name, times] of hits) if (times.every((time) => now - time >= 60000)) hits.delete(name);
  }
  return recent.length > ASSISTANT_REQUESTS_PER_MINUTE;
}

// Keeps only well-formed {role, content} messages, the last few, with lengths limited. Returns null when invalid.
function cleanMessages(raw) {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 100) return null;
  const messages = [];
  for (const item of raw) {
    if (!item || typeof item.content !== "string" || (item.role !== "user" && item.role !== "assistant")) return null;
    const content = item.content.trim();
    if (item.role === "user" && (content.length === 0 || content.length > ASSISTANT_MAX_INPUT)) return null;
    messages.push({ role: item.role, content: item.role === "user" ? content : content.slice(0, ASSISTANT_MAX_REPLY_CHARS) });
  }
  const recent = messages.slice(-ASSISTANT_MAX_HISTORY);
  while (recent.length > 0 && recent[0].role !== "user") recent.shift(); // Gemini wants the chat to start with the user
  if (recent.length === 0 || recent[recent.length - 1].role !== "user") return null;
  return recent;
}

// Picks the text out of one Gemini stream event.
function textOf(event) {
  const parts = event?.candidates?.[0]?.content?.parts;
  return Array.isArray(parts) ? parts.map((part) => (typeof part.text === "string" ? part.text : "")).join("") : "";
}

export async function POST(request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return json("unavailable", 503);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (tooFast(ip)) return json("tooFast", 429);

  let body;
  try {
    body = await request.json();
  } catch {
    return json("invalid", 400);
  }
  const messages = cleanMessages(body?.messages);
  if (!messages) return json("invalid", 400);
  const lang = isLocale(body?.lang) ? body.lang : "en";

  const base = process.env.GEMINI_API_BASE || "https://generativelanguage.googleapis.com";
  const model = process.env.GEMINI_MODEL || ASSISTANT_DEFAULT_MODEL;
  let upstream;
  try {
    upstream = await fetch(`${base}/v1beta/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemInstruction(lang) }] },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
        generationConfig: { temperature: ASSISTANT_TEMPERATURE, maxOutputTokens: ASSISTANT_MAX_OUTPUT_TOKENS },
      }),
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(ASSISTANT_TIMEOUT_MS)]),
    });
  } catch {
    return json("upstream", 502);
  }
  if (!upstream.ok || !upstream.body) return json("upstream", 502);

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const reader = upstream.body.getReader();
  let buffer = "";

  // Reads from Gemini until at least one piece of text is found. Returns the texts, or null when the stream ended.
  async function nextTexts() {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) return null;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      const texts = [];
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        try {
          const text = textOf(JSON.parse(line.slice(5).trim()));
          if (text) texts.push(text);
        } catch {
          // an incomplete or unknown event: ignore it
        }
      }
      if (texts.length > 0) return texts;
    }
  }

  // Wait for the first text before answering, so a blocked or empty answer becomes a clean error response.
  let first;
  try {
    first = await nextTexts();
  } catch {
    return json("upstream", 502);
  }
  if (!first) return json("upstream", 502);

  const stream = new ReadableStream({
    start(controller) {
      for (const text of first) controller.enqueue(encoder.encode(text));
    },
    async pull(controller) {
      try {
        const texts = await nextTexts();
        if (!texts) {
          controller.close();
          return;
        }
        for (const text of texts) controller.enqueue(encoder.encode(text));
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

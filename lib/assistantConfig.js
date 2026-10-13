// Limits and settings of the site assistant. Plain constants only, so both the chat window (browser)
// and the server route can import this file. Secrets and server-only settings are read in the route.
export const ASSISTANT_MAX_INPUT = 500; // characters in one user message
export const ASSISTANT_MAX_HISTORY = 10; // last messages sent to the model with each question
export const ASSISTANT_MAX_REPLY_CHARS = 2000; // assistant messages from the history are cut to this length
export const ASSISTANT_REQUESTS_PER_MINUTE = 10; // per visitor (IP address)
export const ASSISTANT_TEMPERATURE = 0.2; // low: short, factual, close to the site text
export const ASSISTANT_MAX_OUTPUT_TOKENS = 1500;
export const ASSISTANT_TIMEOUT_MS = 30000;
export const ASSISTANT_DEFAULT_MODEL = "gemini-2.5-flash"; // override with GEMINI_MODEL in .env

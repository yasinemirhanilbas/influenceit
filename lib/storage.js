// Local storage for delivery videos. Files live in storage/uploads/ (git-ignored, not under public/),
// so they can only be reached through the checked route app/api/orders/[id]/video.
// Names are random; the visitor's file name is never used.
import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { VIDEO_MAX_BYTES } from "@/lib/options";

const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");
const STORED_NAME = /^[a-f0-9]{32}\.(mp4|webm|mov)$/;

export const VIDEO_MIME = { mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime" };

// Looks at the first bytes of the file, not at what the visitor claims it is.
// MP4 and MOV start with a size and the word "ftyp" (MOV has the brand "qt  "); WebM starts with 1A 45 DF A3.
export function detectVideoType(bytes) {
  if (bytes.length >= 12 && bytes.subarray(4, 8).toString("latin1") === "ftyp") {
    return bytes.subarray(8, 12).toString("latin1") === "qt  " ? "mov" : "mp4";
  }
  if (bytes.length >= 4 && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) {
    return "webm";
  }
  return null;
}

// Saves an uploaded File. Returns { name } or { error: "videoSize" | "videoType" }.
export async function saveVideo(file) {
  if (!file || file.size === 0) return { error: "videoType" };
  if (file.size > VIDEO_MAX_BYTES) return { error: "videoSize" };

  const extension = path.extname(file.name ?? "").slice(1).toLowerCase();
  const bytes = Buffer.from(await file.arrayBuffer());
  const type = detectVideoType(bytes);
  const extensionOk = extension in VIDEO_MIME;
  // MP4 and MOV share a container; WebM must be WebM both by name and by content.
  const matches = type && extensionOk && (type === "webm") === (extension === "webm");
  if (!matches) return { error: "videoType" };

  const name = `${randomBytes(16).toString("hex")}.${type}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), bytes);
  return { name };
}

// Full path of a stored video, or null when the name does not look like one we created.
export function getVideoPath(name) {
  return typeof name === "string" && STORED_NAME.test(name) ? path.join(UPLOAD_DIR, name) : null;
}

export function getVideoMime(name) {
  return VIDEO_MIME[name.split(".").pop()] ?? "application/octet-stream";
}

export async function deleteVideo(name) {
  const file = getVideoPath(name);
  if (!file) return;
  try {
    await unlink(file);
  } catch {
    // Already gone: nothing to do.
  }
}

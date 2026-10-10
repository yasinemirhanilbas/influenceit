import { randomBytes } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { IMAGE_MAX_BYTES } from "@/lib/options";

// Creator photos (profile photo + gallery). Files live in storage/images/ (git-ignored) under random names;
// the database only stores the file name. Photos are public: they are served by app/api/images/[name].

const IMAGE_DIR = path.join(process.cwd(), "storage", "images");
const NAME_PATTERN = /^[a-f0-9]{32}\.(jpg|png|webp)$/;
const MIME = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

// Decide the real type from the first bytes, not from the file name the browser sent.
export function detectImageType(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (bytes.length >= 12 && bytes.subarray(0, 4).toString("latin1") === "RIFF" && bytes.subarray(8, 12).toString("latin1") === "WEBP") return "webp";
  return null;
}

// Check one uploaded file. Returns { bytes, ext } or { error: "imageType" | "imageSize" }.
export async function inspectImage(file) {
  if (!(file instanceof File) || file.size === 0) return { error: "imageType" };
  if (file.size > IMAGE_MAX_BYTES) return { error: "imageSize" };
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = detectImageType(bytes);
  return ext ? { bytes, ext } : { error: "imageType" };
}

export async function saveImage({ bytes, ext }) {
  await mkdir(IMAGE_DIR, { recursive: true });
  const name = `${randomBytes(16).toString("hex")}.${ext}`;
  await writeFile(path.join(IMAGE_DIR, name), bytes);
  return name;
}

export async function deleteImages(names) {
  for (const name of names) {
    if (NAME_PATTERN.test(name)) await unlink(path.join(IMAGE_DIR, name)).catch(() => {});
  }
}

export function isImageName(name) {
  return NAME_PATTERN.test(name);
}

export function imageMime(name) {
  return MIME[name.split(".").pop()];
}

export async function readImage(name) {
  if (!NAME_PATTERN.test(name)) return null;
  return readFile(path.join(IMAGE_DIR, name)).catch(() => null);
}

// Public URL of a stored photo (used by pages that show creator photos).
export function imageUrl(name) {
  return name ? `/api/images/${name}` : null;
}

// "a.jpg,b.png" <-> ["a.jpg", "b.png"]
export const splitList = (value) => (value ? value.split(",").filter(Boolean) : []);

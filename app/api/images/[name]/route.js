import { imageMime, isImageName, readImage } from "@/lib/images";

// Serves a stored creator photo. File names are random and never change, so browsers may cache them for good.
export async function GET(_request, { params }) {
  const { name } = await params;
  if (!isImageName(name)) return new Response("Not found", { status: 404 });
  const bytes = await readImage(name);
  if (!bytes) return new Response("Not found", { status: 404 });
  return new Response(bytes, {
    headers: {
      "Content-Type": imageMime(name),
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

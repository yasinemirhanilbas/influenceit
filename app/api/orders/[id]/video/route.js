import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";
import { getOrderForUser } from "@/lib/orders";
import { getSessionUser } from "@/lib/session";
import { getVideoMime, getVideoPath } from "@/lib/storage";

// Streams the delivery video of an order, only to the brand and the creator of that order.
// Supports Range requests so the browser can seek inside the video.
export async function GET(request, { params }) {
  const { id } = await params;
  const user = await getSessionUser();
  const found = await getOrderForUser(user, id);
  const file = found ? getVideoPath(found.order.deliveryVideo) : null;
  if (!file) return new Response("Not found", { status: 404 });

  let size;
  try {
    size = (await stat(file)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers = {
    "Content-Type": getVideoMime(found.order.deliveryVideo),
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  };

  let start = 0;
  let end = size - 1;
  let status = 200;
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (match[1] === "" && match[2] === "")) {
      return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
    }
    if (match[1] === "") {
      start = Math.max(size - Number(match[2]), 0); // "last N bytes"
    } else {
      start = Number(match[1]);
      if (match[2] !== "") end = Math.min(Number(match[2]), size - 1);
    }
    if (start > end || start >= size) {
      return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
    }
    status = 206;
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
  }

  headers["Content-Length"] = String(end - start + 1);
  return new Response(Readable.toWeb(createReadStream(file, { start, end })), { status, headers });
}

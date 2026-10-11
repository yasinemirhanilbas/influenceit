"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Keeps an open conversation fresh: re-reads the page every few seconds while the tab is visible,
// and scrolls to the newest message when the number of messages changes. Renders only the scroll anchor.
export default function ThreadLive({ count, intervalMs = 10000 }) {
  const router = useRouter();
  const endRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);

  useEffect(() => {
    if (count > 0) endRef.current?.scrollIntoView({ block: "nearest" });
  }, [count]);

  return <div ref={endRef} aria-hidden="true" />;
}

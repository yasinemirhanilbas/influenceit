import { Suspense } from "react";
import NotFoundContent from "@/components/NotFoundContent";

// Shown for unknown addresses and for notFound() calls inside /en and /tr.
// The language is read from the address in the client part, which needs Suspense.
export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundContent />
    </Suspense>
  );
}

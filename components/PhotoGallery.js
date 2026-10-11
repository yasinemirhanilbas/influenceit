"use client";

import { useRef, useState } from "react";
import { interpolate } from "@/locales";

// Photo grid of a creator profile. Clicking a photo opens it large in a native <dialog> (Esc closes it,
// focus stays inside, arrow keys and the buttons switch photos).
// photos: [{ src, alt }]. labels: profile.photoOpen / photoClose / photoPrev / photoNext / photoCounter.
export default function PhotoGallery({ photos, labels }) {
  const dialogRef = useRef(null);
  const [index, setIndex] = useState(0);
  const total = photos.length;
  if (total === 0) return null;

  const open = (next) => {
    setIndex(next);
    dialogRef.current?.showModal();
  };
  const step = (delta) => setIndex((current) => (current + delta + total) % total);
  const current = photos[index];

  const grid = total === 1 ? "max-w-xl grid-cols-1" : total === 2 ? "max-w-3xl grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  const navButton =
    "flex h-12 w-12 items-center justify-center rounded-full bg-card text-xl font-semibold text-ink shadow-card transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

  return (
    <>
      <ul className={`mt-6 grid gap-4 sm:gap-5 ${grid}`}>
        {photos.map((photo, number) => (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => open(number)}
              aria-label={interpolate(labels.photoOpen, { number: number + 1 })}
              className="group block w-full overflow-hidden rounded-card border border-line bg-soft shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
        }}
        aria-label={current.alt}
        className="m-auto w-[min(96vw,64rem)] max-w-none rounded-card bg-transparent p-0 backdrop:bg-black/70"
      >
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.src} alt={current.alt} className="max-h-[80vh] w-full rounded-card bg-card object-contain" />
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={labels.photoClose}
            className={`${navButton} absolute right-3 top-3`}
          >
            ×
          </button>
          {total > 1 ? (
            <>
              <button type="button" onClick={() => step(-1)} aria-label={labels.photoPrev} className={`${navButton} absolute left-3 top-1/2 -translate-y-1/2`}>
                ‹
              </button>
              <button type="button" onClick={() => step(1)} aria-label={labels.photoNext} className={`${navButton} absolute right-3 top-1/2 -translate-y-1/2`}>
                ›
              </button>
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card px-4 py-1 text-sm font-semibold shadow-card">
                {interpolate(labels.photoCounter, { current: index + 1, total })}
              </p>
            </>
          ) : null}
        </div>
      </dialog>
    </>
  );
}

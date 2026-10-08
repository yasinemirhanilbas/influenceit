import SectionHeading from "./SectionHeading";
import { getMessages } from "@/locales";
import { galleryTiles } from "@/data/gallery";

const shapes = {
  circle: "left-1/2 top-[38%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full",
  arch: "left-1/2 top-[40%] h-48 w-32 -translate-x-1/2 -translate-y-1/2 rounded-t-full rounded-b-2xl",
  square: "left-1/2 top-[38%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-3xl",
};

function PlayIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5" fill="currentColor">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

function Tiles({ gallery, featured, duplicate = false }) {
  return galleryTiles.map((tile, index) => {
    const copy = gallery.tiles[tile.id];
    return (
      <li
        key={`${duplicate ? "copy-" : ""}${tile.id}`}
        className={`w-64 shrink-0 pr-5 sm:w-80 ${index % 2 === 1 ? "mt-10" : ""}`}
        {...(duplicate ? { "aria-hidden": "true", "data-duplicate": "" } : {})}
      >
        <div
          className="tile aspect-[9/16]"
          style={{ backgroundImage: `linear-gradient(160deg, ${tile.from}, ${tile.to})` }}
        >
          <span aria-hidden="true" className={`absolute bg-white/15 ${shapes[tile.shape]}`} />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[38%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#5a1229]"
          >
            <PlayIcon />
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5 pt-16 text-white">
            <p className="label-mono text-xs">{featured.niches[copy.niche] ?? copy.niche}</p>
            <p className="mt-1 font-display text-xl font-semibold">{copy.format}</p>
          </div>
        </div>
      </li>
    );
  });
}

export default function GallerySection({ lang }) {
  const messages = getMessages(lang);
  const { gallery, featured } = messages;

  return (
    <section aria-labelledby="gallery-heading" className="border-b border-line">
      <div className="reveal mx-auto max-w-6xl px-5 py-20 sm:py-24 lg:py-32">
        <SectionHeading
          id="gallery-heading"
          eyebrow={gallery.eyebrow}
          title={gallery.heading}
          subtitle={gallery.subheading}
        />
      </div>

      {/* Slides sideways on its own; pauses on hover. Static and wrapped for reduced motion. */}
      <div className="marquee overflow-hidden pb-6 [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)]">
        <ul aria-label={gallery.listLabel} className="marquee-track" style={{ animationDuration: "50s" }}>
          <Tiles gallery={gallery} featured={featured} />
          <Tiles gallery={gallery} featured={featured} duplicate />
        </ul>
      </div>

      <p className="mx-auto max-w-6xl px-5 pb-12 text-sm text-ink-soft">{gallery.note}</p>
    </section>
  );
}

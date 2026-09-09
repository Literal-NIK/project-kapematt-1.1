import { useRef, useState } from "react";

/** Sideways-scrolling image gallery: swipe on mobile, arrows on desktop. */
export function ProductGallery({
  images,
  alt,
  aspect = "aspect-square",
  priority = false,
}: {
  images: string[];
  alt: string;
  aspect?: string;
  priority?: boolean;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (dir: -1 | 1) => {
    const node = scroller.current;
    if (!node) return;
    const next = Math.min(Math.max(index + dir, 0), images.length - 1);
    setIndex(next);
    node.scrollTo({ left: next * node.clientWidth, behavior: "smooth" });
  };

  const onScroll = () => {
    const node = scroller.current;
    if (!node) return;
    setIndex(Math.round(node.scrollLeft / node.clientWidth));
  };

  return (
    <div className="group relative overflow-hidden">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={images.length > 1 ? `${alt} — image ${i + 1}` : alt}
            loading={priority && i === 0 ? "eager" : "lazy"}
            className={`w-full shrink-0 snap-center object-cover ${aspect}`}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            disabled={index === 0}
            className="absolute left-2 top-1/2 hidden size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-glass font-mono text-sm text-foreground opacity-0 backdrop-blur transition-opacity disabled:opacity-0 group-hover:opacity-100 sm:grid"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            disabled={index === images.length - 1}
            className="absolute right-2 top-1/2 hidden size-8 -translate-y-1/2 place-items-center rounded-full border border-line bg-glass font-mono text-sm text-foreground opacity-0 backdrop-blur transition-opacity disabled:opacity-0 group-hover:opacity-100 sm:grid"
          >
            ›
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-4 bg-foreground/70" : "w-1.5 bg-foreground/25"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

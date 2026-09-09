import { useEffect, useRef, useState, type ReactNode } from "react";

export type HeroSlide = {
  image: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  body?: string;
};

export function HeroSlideshow({
  slides,
  children,
  interval = 6500,
  className = "",
  contentClassName = "",
}: {
  slides: HeroSlide[];
  children: ReactNode | ((slide: HeroSlide, index: number) => ReactNode);
  interval?: number;
  className?: string;
  contentClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % slides.length),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [interval, slides.length]);

  const go = (direction: 1 | -1) =>
    setActive((current) => (current + direction + slides.length) % slides.length);

  const current = slides[active] ?? slides[0]!;

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      onTouchStart={(e) => {
        touchStart.current = e.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchStart.current;
        const end = e.changedTouches[0]?.clientX;
        touchStart.current = null;
        if (start == null || end == null || slides.length < 2) return;
        const delta = end - start;
        if (Math.abs(delta) > 45) go(delta < 0 ? 1 : -1);
      }}
    >
      {slides.map((slide, index) => (
        <img
          key={`${slide.image}-${index}`}
          src={slide.image}
          alt={index === active ? slide.alt : ""}
          aria-hidden={index !== active}
          loading={index === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-hero-overlay" />
      <div className={`relative z-10 text-hero-foreground ${contentClassName}`}>
        {typeof children === "function" ? children(current, active) : children}
      </div>
      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-hero-foreground/25 bg-hero-foreground/15 text-hero-foreground backdrop-blur transition-colors hover:bg-hero-foreground/30 sm:grid"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 z-20 hidden size-10 -translate-y-1/2 place-items-center rounded-full border border-hero-foreground/25 bg-hero-foreground/15 text-hero-foreground backdrop-blur transition-colors hover:bg-hero-foreground/30 sm:grid"
          >
            ›
          </button>
          <div className="absolute bottom-5 right-5 z-20 flex gap-1.5">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                className={`h-1.5 rounded-full bg-hero-foreground transition-all ${
                  active === index ? "w-7 opacity-100" : "w-2 opacity-45"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

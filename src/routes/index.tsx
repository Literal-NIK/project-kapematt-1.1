import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import heroAisle from "@/assets/hero-aisle.jpg";
import deliCounter from "@/assets/deli-counter.jpg";
import bakeryCounter from "@/assets/bakery-counter.jpg";
import { DEPARTMENTS, PRODUCTS, STORE, offerProducts } from "@/data/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HeroSlideshow, type HeroSlide } from "@/components/HeroSlideshow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kapematt Supermarket — Fresh stock, weekly offers in Nairobi" },
      {
        name: "description",
        content:
          "Browse Kapematt Supermarket: fresh produce, butchery, deli and bakery, this week's offers, store hours and directions. Catalog only, no checkout.",
      },
      { property: "og:title", content: "Kapematt Supermarket" },
      {
        property: "og:description",
        content:
          "Fresh produce, deli and bakery restocked every morning. Browse the catalog and this week's offers.",
      },
    ],
  }),
  component: HomePage,
});


function HomePage() {
  const [deptOpen, setDeptOpen] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const feedEnd = useRef<HTMLDivElement>(null);
  const offers = offerProducts().slice(0, 4);

  useEffect(() => {
    const node = feedEnd.current;
    if (!node || visibleProducts >= PRODUCTS.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleProducts((count) => Math.min(count + 8, PRODUCTS.length));
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleProducts]);

  const heroSlides: HeroSlide[] = [
    {
      image: heroAisle,
      alt: "Kapematt produce aisle stocked at opening hour",
      eyebrow: "Aisle 01 - Opening hour",
      title: "Fresh stock, on the shelf this morning.",
      body: "Produce, bakery and deli landed at 6am. Browse the day's offers before the crates run low.",
    },
    ...offers.slice(0, 3).map((product) => ({
      image: product.images[0] ?? heroAisle,
      alt: `${product.name} on offer`,
      eyebrow: `On offer - ${product.brand}`,
      title: `${product.name}, on promotion this week.`,
      body: `${product.packSize}. Available at the shelf while stock lasts.`,
    })),
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
      {/* HERO */}
      <HeroSlideshow
        slides={heroSlides}
        className="prism-line mt-8 min-h-[520px] rounded-3xl"
        contentClassName="flex min-h-[520px] flex-col justify-center p-7 sm:p-12"
      >
        {(current) => (
          <div className="flex max-w-2xl flex-col justify-center">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
              {current.eyebrow}
            </span>
            <h1 className="mt-4 max-w-[16ch] text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
              {current.title}
            </h1>
            <p className="mt-4 max-w-[42ch] text-pretty text-hero-foreground/80">
              {current.body}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/offers"
                className="rounded-full bg-hero-foreground px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:opacity-90"
              >
                Shop this week's offers
              </Link>
              <Link
                to="/catalog"
                className="rounded-full border border-hero-foreground/30 bg-glass px-5 py-2.5 text-sm font-medium backdrop-blur"
              >
                Browse departments
              </Link>
            </div>
          </div>
        )}
      </HeroSlideshow>

      {/* DEPARTMENTS */}
      <Reveal as="section" className="mt-12" delay={80}>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            <button
              type="button"
              onClick={() => setDeptOpen((v) => !v)}
              aria-expanded={deptOpen}
              aria-controls="department-chips"
              className="inline-flex items-center gap-2 lg:pointer-events-none"
            >
              Departments
              <span
                aria-hidden="true"
                className={`font-mono text-sm text-muted-foreground transition-transform lg:hidden ${
                  deptOpen ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            ({String(DEPARTMENTS.length).padStart(2, "0")})
          </span>
        </div>
        <div
          id="department-chips"
          className={`mt-4 flex-wrap gap-2 lg:flex ${deptOpen ? "flex" : "hidden"}`}
        >
          {DEPARTMENTS.map((d, i) => (
            <Link
              key={d.slug}
              to="/departments/$slug"
              params={{ slug: d.slug }}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                i === 0
                  ? "bg-leaf font-medium text-accent-foreground"
                  : "border border-line bg-glass hover:border-leaf/40"
              }`}
            >
              {d.name}
            </Link>
          ))}
        </div>
      </Reveal>

      {/* OFFERS */}
      <Reveal as="section" className="mt-12" delay={140}>
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              This week's offers
            </h2>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              Ends Sun 22:00 · prices in KES
            </p>
          </div>
          <Link to="/offers" className="font-mono text-xs text-leaf">
            View all
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {offers.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </Reveal>

      {/* ALL DEPARTMENTS FEED */}
      <Reveal as="section" className="mt-12" delay={100}>
        <div className="flex items-end justify-between border-b border-line pb-4">
          <div>
            <span className="font-mono text-xs uppercase text-leaf">Across every aisle</span>
            <h2 className="mt-1 font-display text-2xl font-semibold">Explore all products</h2>
          </div>
          <Link to="/catalog" className="font-mono text-xs text-leaf">Full catalog</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:gap-5 xl:grid-cols-5">
          {PRODUCTS.slice(0, visibleProducts).map((product) => (
            <div key={product.id} className="relative"><ProductCard product={product} /></div>
          ))}
        </div>
        <div ref={feedEnd} className="h-8" aria-hidden="true" />
      </Reveal>

      {/* DELI & BAKERY */}
      <Reveal as="section" className="mt-12" delay={120}>
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-glass p-8 backdrop-blur">
            <span className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-amber/25 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                  Deli counter
                </span>
                <h3 className="mt-3 max-w-[14ch] font-display text-3xl font-bold leading-tight tracking-tight">
                  Cold cuts, sliced to order.
                </h3>
                <Link
                  to="/deli"
                  className="mt-4 inline-block font-mono text-xs text-leaf"
                >
                  Today's meals →
                </Link>
              </div>
              <img
                src={deliCounter}
                width={1080}
                height={720}
                loading="lazy"
                alt="Deli counter stacked with smoked meats and cheeses"
                className="aspect-16/10 w-full rounded-xl object-cover"
              />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-glass p-8 backdrop-blur">
            <span className="pointer-events-none absolute -left-10 bottom-0 size-44 rounded-full bg-leaf/20 blur-2xl" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
                  Bakery
                </span>
                <h3 className="mt-3 max-w-[14ch] font-display text-3xl font-bold leading-tight tracking-tight">
                  Baked at dawn, warm by 7.
                </h3>
                <Link
                  to="/bakery"
                  className="mt-4 inline-block font-mono text-xs text-leaf"
                >
                  Fresh today →
                </Link>
              </div>
              <img
                src={bakeryCounter}
                width={1080}
                height={720}
                loading="lazy"
                alt="Bakery counter with fresh breads and pastries"
                className="aspect-16/10 w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* STORE INFO */}
      <Reveal as="section" className="mt-12" delay={100}>
        <div className="grid gap-5 rounded-3xl border border-line bg-glass p-6 backdrop-blur sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Our store
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight">
              {STORE.name}
            </h2>
            <p className="mt-2 max-w-[32ch] text-pretty text-sm text-muted-foreground">
              {STORE.address}. Free parking in the rear yard.
            </p>
            <Link to="/store" className="mt-4 inline-block font-mono text-xs text-leaf">
              Directions →
            </Link>
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Hours
            </span>
            <ul className="mt-3 space-y-1 text-sm">
              {STORE.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="font-mono text-xs">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Contact
            </span>
            <ul className="mt-3 space-y-1 text-sm">
              <li>{STORE.phone}</li>
              <li>{STORE.email}</li>
              <li className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-leaf">
                <span className="size-1.5 rounded-full bg-leaf" />
                Open now
              </li>
            </ul>
          </div>
        </div>
      </Reveal>

      {/* CAREERS TEASER */}
      <Reveal as="section" className="mt-12" delay={100}>
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-glass p-6 backdrop-blur sm:flex-row sm:items-center sm:p-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Careers
            </span>
            <p className="mt-2 max-w-[46ch] text-pretty text-sm text-muted-foreground">
              We're hiring for the bakery, deli and till teams. Walk-in
              applications welcome on weekday mornings.
            </p>
          </div>
          <Link
            to="/careers"
            className="rounded-full border border-line bg-paper px-5 py-2.5 text-sm font-medium"
          >
            See open roles
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

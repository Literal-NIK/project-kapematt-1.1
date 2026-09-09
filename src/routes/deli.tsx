import { createFileRoute } from "@tanstack/react-router";
import deliCounter from "@/assets/deli-counter.jpg";
import { PRODUCTS, STORE, TODAYS_MEALS } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HeroSlideshow } from "@/components/HeroSlideshow";

export const Route = createFileRoute("/deli")({
  head: () => ({
    meta: [
      { title: "Deli counter — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Cold cuts, cheeses, salads and today's hot meals sliced and served to order at the Kapematt deli counter in Nairobi.",
      },
      { property: "og:title", content: "Deli counter — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Cold cuts, cheeses, salads and today's ready meals.",
      },
    ],
  }),
  component: DeliPage,
});

function DeliPage() {
  const products = PRODUCTS.filter(
    (p) => p.counter === "deli" || p.department === "deli",
  );
  const counter = STORE.counters.find((c) => c.name.includes("Deli"));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <HeroSlideshow
          slides={[
            {
              image: deliCounter,
              alt: "Kapematt deli counter with cured meats and cheeses",
              eyebrow: "Deli counter",
              title: "Sliced to order, every day",
              body: "Cold cuts, cheeses, salads and ready meals. Tell us the thickness and we'll cut it while you wait.",
            },
            ...products.slice(0, 2).map((product) => ({
              image: product.images[0] ?? deliCounter,
              alt: product.name,
              eyebrow: "At the counter",
              title: product.name,
              body: `${product.brand} - ${product.packSize}. Cut and wrapped while you wait.`,
            })),
          ]}
          className="min-h-[420px] rounded-2xl"
          contentClassName="flex min-h-[420px] flex-col justify-center p-7 sm:p-12"
        >
          {(current) => (
            <>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
                {current.eyebrow}
              </span>
              <h1 className="mt-3 max-w-[18ch] font-display text-3xl font-bold sm:text-4xl">
                {current.title}
              </h1>
              <p className="mt-3 max-w-[50ch] text-pretty text-hero-foreground/80">
                {current.body}
              </p>
              <p className="mt-4 font-mono text-xs text-hero-foreground/75">
                {counter ? `${counter.name} - ${counter.time}` : "Open daily"}
              </p>
            </>
          )}
        </HeroSlideshow>
      </Reveal>

      <Reveal className="mt-12" delay={80}>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Today's meals
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {TODAYS_MEALS.map((m) => (
            <li
              key={m.name}
              className="rounded-2xl border border-line bg-glass p-4 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-display font-semibold">{m.name}</span>
                <span
                  className={`font-mono text-[11px] ${
                    m.soldOut ? "text-muted-foreground" : "text-leaf"
                  }`}
                >
                  {m.soldOut ? "Sold out" : "Available"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{m.note}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-12" delay={120}>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          At the counter
        </h2>
        <div className="mt-5">
          <ProductGrid products={products} />
        </div>
      </Reveal>
    </div>
  );
}

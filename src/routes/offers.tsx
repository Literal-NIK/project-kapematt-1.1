import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { DEPARTMENTS, departmentBySlug, offerProducts } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useMode } from "@/lib/mode";

export const Route = createFileRoute("/offers")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { dept?: string | undefined } => ({
    dept: typeof search["dept"] === "string" ? (search["dept"] as string) : undefined,
  }),


  head: () => ({
    meta: [
      { title: "Weekly offers — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "This week's promotions at Kapematt Supermarket, with expiry times and the departments they belong to. Offers run while stock lasts.",
      },
      { property: "og:title", content: "Weekly offers — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Active promotions with expiry indicators, filtered by department.",
      },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { dept } = Route.useSearch();
  const navigate = useNavigate({ from: "/offers" });
  const { pricesVisible } = useMode();

  const all = offerProducts();
  const products = useMemo(
    () => (dept ? all.filter((p) => p.department === dept) : all),
    [all, dept],
  );
  const activeDepts = Array.from(new Set(all.map((p) => p.department)));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
          This week
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Weekly offers
        </h1>
        <p className="mt-2 max-w-[54ch] text-pretty text-muted-foreground">
          {pricesVisible
            ? "Promotional prices revert automatically when an offer expires. Offers run while stock lasts."
            : "Wholesale mode shows bulk terms only — see the wholesale offers page for case-based deals."}
        </p>
      </Reveal>

      <Reveal className="mt-6 flex flex-wrap gap-2" delay={80}>
        <button
          type="button"
          onClick={() => navigate({ search: {} })}
          className={`rounded-full px-3 py-1.5 text-sm ${
            !dept ? "bg-foreground text-background" : "border border-line bg-glass"
          }`}
        >
          All departments
        </button>
        {activeDepts.map((slug) => (
          <button
            key={slug}
            type="button"
            onClick={() => navigate({ search: { dept: slug } })}
            className={`rounded-full px-3 py-1.5 text-sm ${
              dept === slug
                ? "bg-leaf text-accent-foreground"
                : "border border-line bg-glass hover:border-leaf/40"
            }`}
          >
            {departmentBySlug(slug)?.name ?? slug}
          </button>
        ))}
      </Reveal>

      <Reveal className="mt-8" delay={120}>
        <ul className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <li
              key={p.id}
              className="glass-card flex items-center justify-between rounded-xl px-4 py-3"
            >
              <span className="text-sm font-medium">{p.name}</span>
              <span className="font-mono text-[11px] text-amber">
                Ends {p.offerEnds ?? "Sun 22:00"}
              </span>
            </li>
          ))}
        </ul>
        <ProductGrid products={products} />
      </Reveal>

      <p className="mt-8 font-mono text-xs text-muted-foreground">
        {DEPARTMENTS.length} departments · offers refresh every Monday at 06:00
      </p>
    </div>
  );
}

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  BRANDS,
  DEPARTMENTS,
  PRODUCTS,
  effectivePrice,
  hasOffer,
} from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useMode } from "@/lib/mode";

import { parseCatalogSearch, type CatalogSearch } from "@/lib/catalog-search";

export const Route = createFileRoute("/catalog")({
  validateSearch: parseCatalogSearch,

  head: () => ({
    meta: [
      { title: "Full catalog — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Filter the full Kapematt catalog by department, brand, price, stock and active offers. Retail prices in KES, wholesale pack sizes on request.",
      },
      { property: "og:title", content: "Full catalog — Kapematt Supermarket" },
      {
        property: "og:description",
        content:
          "Every department, filterable by brand, price, stock and offers.",
      },
    ],
  }),
  component: CatalogPage,
});

const PRICE_STEPS = [250, 500, 1000, 2500];

function CatalogPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalog" });
  const { pricesVisible } = useMode();

  const setSearch = (patch: Partial<CatalogSearch>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch }) });

  const products = useMemo(() => {
    let list = PRODUCTS.slice();
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subCategory.toLowerCase().includes(q),
      );
    }
    if (search.dept) list = list.filter((p) => p.department === search.dept);
    if (search.brand) list = list.filter((p) => p.brand === search.brand);
    if (search.max && pricesVisible)
      list = list.filter((p) => effectivePrice(p) <= search.max!);
    if (search.stock === "in") list = list.filter((p) => p.stock !== "out");
    if (search.offers) list = list.filter(hasOffer);

    if (search.sort === "price-asc")
      list.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    if (search.sort === "price-desc")
      list.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    if (search.sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, pricesVisible]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Full catalog
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Everything on the shelves
        </h1>
        <p className="mt-2 max-w-[52ch] text-pretty text-muted-foreground">
          {products.length} of {PRODUCTS.length} products
          {search.q ? ` matching “${search.q}”` : ""}. Filters are scoped to the{" "}
          {pricesVisible ? "retail" : "wholesale"} view.
        </p>
      </Reveal>

      <Reveal className="mt-8" delay={80}>
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSearch({ dept: undefined })}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                !search.dept
                  ? "bg-foreground text-background"
                  : "border border-line bg-paper"
              }`}
            >
              All departments
            </button>
            {DEPARTMENTS.map((d) => (
              <button
                key={d.slug}
                type="button"
                onClick={() => setSearch({ dept: d.slug })}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  search.dept === d.slug
                    ? "bg-leaf text-accent-foreground"
                    : "border border-line bg-paper hover:border-leaf/40"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Brand
              </span>
              <select
                value={search.brand ?? ""}
                onChange={(e) =>
                  setSearch({ brand: e.target.value || undefined })
                }
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
              >
                <option value="">All brands</option>
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            {pricesVisible && (
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Max price
                </span>
                <select
                  value={search.max ?? ""}
                  onChange={(e) =>
                    setSearch({
                      max: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                >
                  <option value="">Any price</option>
                  {PRICE_STEPS.map((s) => (
                    <option key={s} value={s}>
                      Up to KES {s.toLocaleString("en-KE")}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Availability
              </span>
              <select
                value={search.stock ?? "all"}
                onChange={(e) =>
                  setSearch({
                    stock: e.target.value === "in" ? "in" : undefined,
                  })
                }
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
              >
                <option value="all">All items</option>
                <option value="in">Available only</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Sort
              </span>
              <select
                value={search.sort ?? "featured"}
                onChange={(e) =>
                  setSearch({
                    sort:
                      e.target.value === "featured"
                        ? undefined
                        : (e.target.value as CatalogSearch["sort"]),
                  })
                }
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A–Z</option>
                {pricesVisible && <option value="price-asc">Price low → high</option>}
                {pricesVisible && <option value="price-desc">Price high → low</option>}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!search.offers}
                onChange={(e) =>
                  setSearch({ offers: e.target.checked ? true : undefined })
                }
                className="size-4 accent-[var(--leaf)]"
              />
              On offer only
            </label>
            <Link
              to="/catalog"
              search={{}}
              className="font-mono text-xs text-muted-foreground hover:text-foreground"
            >
              Clear filters
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-8" delay={140}>
        <ProductGrid products={products} />
      </Reveal>
    </div>
  );
}

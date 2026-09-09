import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { BRANDS, DEPARTMENTS, PRODUCTS } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { parseCatalogSearch, type CatalogSearch } from "@/lib/catalog-search";

export const Route = createFileRoute("/wholesale/catalog")({
  validateSearch: parseCatalogSearch,
  head: () => ({
    meta: [
      { title: "Wholesale catalog — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Every Kapematt line in bulk: case sizes, units of measure and minimum order quantities, filterable by department and brand. Prices on quotation.",
      },
      { property: "og:title", content: "Wholesale catalog — Kapematt" },
      {
        property: "og:description",
        content: "Case sizes, units of measure and MOQs. Prices on quotation.",
      },
    ],
  }),
  component: WholesaleCatalogPage,
});

function WholesaleCatalogPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/wholesale/catalog" });

  const setSearch = (patch: Partial<CatalogSearch>) =>
    navigate({ to: ".", search: (prev) => ({ ...prev, ...patch }) });

  const products = useMemo(() => {
    let list = PRODUCTS.slice();
    if (search.q) {
      const q = search.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.caseSize.toLowerCase().includes(q),
      );
    }
    if (search.dept) list = list.filter((p) => p.department === search.dept);
    if (search.brand) list = list.filter((p) => p.brand === search.brand);
    if (search.stock === "in") list = list.filter((p) => p.stock !== "out");
    if (search.sort === "name")
      list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Wholesale catalog
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Case sizes and minimum orders
        </h1>
        <p className="mt-2 max-w-[56ch] text-pretty text-muted-foreground">
          {products.length} of {PRODUCTS.length} lines
          {search.q ? ` matching “${search.q}”` : ""}. Prices are quoted per
          customer and never shown on the site.
        </p>
      </Reveal>

      <Reveal className="mt-8" delay={80}>
        <div className="glass-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSearch({ dept: undefined })}
              className={`rounded-full px-3 py-1.5 text-sm ${
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
                className={`rounded-full px-3 py-1.5 text-sm ${
                  search.dept === d.slug
                    ? "bg-leaf text-accent-foreground"
                    : "border border-line bg-paper hover:border-leaf/40"
                }`}
              >
                {d.name}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
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
            <label className="text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Availability
              </span>
              <select
                value={search.stock ?? "all"}
                onChange={(e) =>
                  setSearch({ stock: e.target.value === "in" ? "in" : undefined })
                }
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
              >
                <option value="all">All lines</option>
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
                    sort: e.target.value === "name" ? "name" : undefined,
                  })
                }
                className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A–Z</option>
              </select>
            </label>
          </div>

          <div className="mt-4 border-t border-line pt-4">
            <Link
              to="/wholesale/catalog"
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

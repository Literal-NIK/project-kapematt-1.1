import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PRODUCTS, effectivePrice, formatKES } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Staff offers admin — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Internal mock console for Kapematt staff to review promotional prices against synced base prices and expiry dates.",
      },
      { property: "og:title", content: "Staff offers admin — Kapematt" },
      {
        property: "og:description",
        content: "Review promotional prices, offer labels and expiry dates.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [query, setQuery] = useState("");
  const [onlyOffers, setOnlyOffers] = useState(false);

  const rows = PRODUCTS.filter((p) => {
    if (onlyOffers && p.promoPrice === undefined) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
          Staff only · demo
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
          Offer management
        </h1>
        <p className="mt-2 max-w-[60ch] text-pretty text-sm text-muted-foreground">
          Base prices sync from the store system and are read-only here.
          Promotional prices are a separate field maintained by staff. This demo
          console is read-only until the backend is connected.
        </p>
      </Reveal>

      <Reveal className="mt-6 flex flex-wrap items-center gap-3" delay={80}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full max-w-xs rounded-full border border-line bg-glass px-4 py-2 text-sm outline-none sm:w-auto"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyOffers}
            onChange={(e) => setOnlyOffers(e.target.checked)}
            className="size-4 accent-[var(--leaf)]"
          />
          Active promotions only
        </label>
        <span className="font-mono text-xs text-muted-foreground">
          {rows.length} rows
        </span>
      </Reveal>

      <Reveal className="mt-6 overflow-x-auto" delay={120}>
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <th className="py-3 pr-4">Product</th>
              <th className="py-3 pr-4">Base price</th>
              <th className="py-3 pr-4">Promo price</th>
              <th className="py-3 pr-4">Label</th>
              <th className="py-3 pr-4">Ends</th>
              <th className="py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-line/60">
                <td className="py-3 pr-4">
                  <span className="font-medium">{p.name}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    {p.brand} · {p.packSize}
                  </span>
                </td>
                <td className="py-3 pr-4 font-mono text-xs">
                  {formatKES(p.basePrice)}
                </td>
                <td className="py-3 pr-4 font-mono text-xs">
                  {p.promoPrice === undefined
                    ? "—"
                    : formatKES(effectivePrice(p))}
                </td>
                <td className="py-3 pr-4 text-xs">{p.offerLabel ?? "—"}</td>
                <td className="py-3 pr-4 font-mono text-xs">
                  {p.offerEnds ?? "—"}
                </td>
                <td className="py-3 font-mono text-xs capitalize">{p.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}

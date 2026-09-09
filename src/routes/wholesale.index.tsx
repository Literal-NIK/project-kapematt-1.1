import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DEPARTMENTS, PRODUCTS, STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/wholesale/")({
  head: () => ({
    meta: [
      { title: "Wholesale — Kapematt Supermarket, Nairobi" },
      {
        name: "description",
        content:
          "Bulk supply from Kapematt for kiosks, restaurants and offices: case sizes, minimum order quantities and quotes on request. No online checkout.",
      },
      { property: "og:title", content: "Wholesale — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Case sizes, minimum order quantities and quotes on request.",
      },
    ],
  }),
  component: WholesalePage,
});

function WholesalePage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Wholesale
        </span>
        <h1 className="mt-3 max-w-[20ch] text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Bulk supply for kiosks, kitchens and offices
        </h1>
        <p className="mt-3 max-w-[58ch] text-pretty text-muted-foreground">
          Browse the same catalog in case sizes with minimum order quantities.
          Wholesale prices are quoted per customer — nothing is priced on the
          site.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/wholesale/catalog"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Wholesale catalog
          </Link>
          <Link
            to="/wholesale/offers"
            className="rounded-full border border-line bg-glass px-5 py-2.5 text-sm font-medium"
          >
            Bulk terms
          </Link>
        </div>
      </Reveal>

      <Reveal className="mt-10 grid gap-4 sm:grid-cols-3" delay={80}>
        {[
          {
            t: "Case sizes",
            b: "Every line lists its case configuration and unit of measure.",
          },
          {
            t: "Minimum orders",
            b: "MOQ is shown per product so you can plan a full pallet or a single case.",
          },
          {
            t: "Quotes in 24h",
            b: "Send a request and we come back with pricing and lead time.",
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-3xl border border-line bg-glass p-6 backdrop-blur"
          >
            <h2 className="font-display font-semibold">{c.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.b}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-12" delay={100}>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Departments available in bulk
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {DEPARTMENTS.map((d) => (
            <Link
              key={d.slug}
              to="/wholesale/catalog"
              search={{ dept: d.slug }}
              className="rounded-full border border-line bg-glass px-4 py-2 text-sm hover:border-leaf/40"
            >
              {d.name}
            </Link>
          ))}
        </div>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {PRODUCTS.length} lines listed · more available on request
        </p>
      </Reveal>

      <Reveal className="mt-12" delay={120}>
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Request a quote
          </h2>
          <p className="mt-2 max-w-[54ch] text-pretty text-sm text-muted-foreground">
            Tell us the lines and volumes you need. Our trade desk replies within
            one working day — or call {STORE.phone}.
          </p>
          {sent ? (
            <p className="mt-6 rounded-xl border border-line bg-glass p-4 text-sm">
              Request received. The trade desk will contact you with pricing and
              lead times.
            </p>
          ) : (
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Business name
                </span>
                <input
                  name="business"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Contact person
                </span>
                <input
                  name="person"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Phone
                </span>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Lines and volumes
                </span>
                <textarea
                  name="lines"
                  rows={4}
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
                >
                  Request quote
                </button>
              </div>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}

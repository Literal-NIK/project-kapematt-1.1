import { createFileRoute, Link } from "@tanstack/react-router";
import { STORE, offerProducts } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

const TERMS = [
  {
    t: "Volume tiers",
    b: "Pricing steps at 5, 20 and 50 cases per line. Mixed pallets count toward the same tier.",
  },
  {
    t: "Standing orders",
    b: "Weekly repeat orders get a fixed price for the quarter and priority allocation on short stock.",
  },
  {
    t: "Payment",
    b: "Cash, mobile money or 14-day account after two settled invoices.",
  },
  {
    t: "Collection",
    b: "Collect from the rear yard between 06:00 and 09:00 to avoid retail traffic.",
  },
];

export const Route = createFileRoute("/wholesale/offers")({
  head: () => ({
    meta: [
      { title: "Bulk terms — Kapematt Wholesale" },
      {
        name: "description",
        content:
          "Kapematt wholesale terms: volume tiers, standing orders, payment options and collection windows, plus lines currently on trade promotion.",
      },
      { property: "og:title", content: "Bulk terms — Kapematt Wholesale" },
      {
        property: "og:description",
        content: "Volume tiers, standing orders, payment and collection windows.",
      },
    ],
  }),
  component: WholesaleOffersPage,
});

function WholesaleOffersPage() {
  const lines = offerProducts();

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
          Trade
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Bulk terms
        </h1>
        <p className="mt-2 max-w-[56ch] text-pretty text-muted-foreground">
          Wholesale pricing is quoted per customer, so no figures appear here.
          These are the terms every quote is built on.
        </p>
      </Reveal>

      <Reveal className="mt-8 grid gap-4 sm:grid-cols-2" delay={80}>
        {TERMS.map((t) => (
          <div
            key={t.t}
            className="rounded-3xl border border-line bg-glass p-6 backdrop-blur"
          >
            <h2 className="font-display font-semibold">{t.t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.b}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-12" delay={120}>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Lines on trade promotion
        </h2>
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-glass backdrop-blur">
          {lines.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <Link
                  to="/wholesale/$productId"
                  params={{ productId: p.id }}
                  className="font-medium hover:text-leaf"
                >
                  {p.name}
                </Link>
                <span className="block font-mono text-[11px] text-muted-foreground">
                  {p.caseSize} · MOQ {p.moq} {p.unitOfMeasure}
                </span>
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {p.offerEnds ? `Ends ${p.offerEnds}` : "While stock lasts"}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-10" delay={100}>
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-glass p-6 backdrop-blur sm:flex-row sm:items-center">
          <p className="max-w-[52ch] text-pretty text-sm text-muted-foreground">
            Ready to price it up? Send your lines and volumes, or call the trade
            desk on {STORE.phone}.
          </p>
          <Link
            to="/wholesale"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Request a quote
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

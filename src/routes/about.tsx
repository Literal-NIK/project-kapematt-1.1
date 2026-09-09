import { createFileRoute, Link } from "@tanstack/react-router";
import { DEPARTMENTS, STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Kapematt — a neighbourhood supermarket" },
      {
        name: "description",
        content:
          "How Kapematt Supermarket works: one Nairobi location, daily restocking, counters staffed by people who cut and bake on site.",
      },
      { property: "og:title", content: "About Kapematt Supermarket" },
      {
        property: "og:description",
        content: "One location, daily restocking, counters staffed on site.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          About us
        </span>
        <h1 className="mt-3 max-w-[18ch] text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
          A supermarket that still runs on its counters
        </h1>
        <p className="mt-4 max-w-[60ch] text-pretty text-muted-foreground">
          Kapematt is a single-location neighbourhood supermarket on Kacheliba Road, Makutano.
          Produce arrives before dawn, the bakery starts at half past four, and
          the butchery cuts to order all day. No branches, no franchise playbook
          — just one shop we stock properly.
        </p>
      </Reveal>

      <Reveal className="mt-10 grid gap-5 sm:grid-cols-3" delay={80}>
        {[
          {
            k: "Daily",
            t: "Restocked at 6am",
            b: "Produce, deli and bakery land before the doors open.",
          },
          {
            k: `${DEPARTMENTS.length}`,
            t: "Departments",
            b: "From fresh produce to household, all under one roof.",
          },
          {
            k: "1",
            t: "Location",
            b: STORE.address,
          },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded-3xl border border-line bg-glass p-6 backdrop-blur"
          >
            <span className="font-display text-3xl font-bold">{c.k}</span>
            <h2 className="mt-2 font-display font-semibold">{c.t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{c.b}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="mt-12 grid gap-8 lg:grid-cols-2" delay={120}>
        <section>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            What we care about
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <span className="text-foreground">Honest pricing.</span> Shelf
              price is the price. Promotions expire on their own.
            </li>
            <li>
              <span className="text-foreground">Kenyan suppliers first.</span>{" "}
              Produce and dairy come from growers we can drive to.
            </li>
            <li>
              <span className="text-foreground">Waste discipline.</span> Bakery
              and deli are made to the day's demand, not to a warehouse forecast.
            </li>
          </ul>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Buying in bulk?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Restaurants, kiosks and offices can browse the wholesale catalog with
            case sizes and minimum order quantities, then request a quote.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/wholesale"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Wholesale
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-line bg-glass px-5 py-2.5 text-sm font-medium"
            >
              Contact us
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: "Find us — Kapematt Limited, Makutano" },
      {
        name: "description",
        content:
          "Kapematt Limited address, opening hours, counter times, parking and directions. One location on Kacheliba Road, Makutano.",
      },
      { property: "og:title", content: "Find us — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Address, hours, counter times and directions.",
      },
    ],
  }),
  component: StorePage,
});

function StorePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Find us
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          One store, stocked every morning
        </h1>
        <p className="mt-2 max-w-[50ch] text-pretty text-muted-foreground">
          {STORE.address}. Free parking in the rear yard, matatu stage two minutes' walk away.
        </p>
      </Reveal>

      <Reveal className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]" delay={80}>
        <div className="overflow-hidden rounded-3xl border border-line">
          <iframe
            title={`Map showing ${STORE.name}`}
            src={`https://www.google.com/maps?q=${STORE.mapQuery}&output=embed`}
            loading="lazy"
            className="h-[420px] w-full border-0"
          />
        </div>
        <div className="grid gap-5">
          <div className="rounded-3xl border border-line bg-glass p-6 backdrop-blur">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Opening hours
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {STORE.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="font-mono text-xs">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-glass p-6 backdrop-blur">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Counters
            </h2>
            <ul className="mt-3 space-y-1 text-sm">
              {STORE.counters.map((c) => (
                <li key={c.name} className="flex justify-between gap-4">
                  <span>{c.name}</span>
                  <span className="font-mono text-xs">{c.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-line bg-glass p-6 backdrop-blur">
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Contact
            </h2>
            <p className="mt-3 text-sm">{STORE.phone}</p>
            <p className="text-sm">{STORE.email}</p>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${STORE.mapQuery}`}
              className="mt-4 inline-block font-mono text-xs text-leaf"
            >
              Get directions →
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

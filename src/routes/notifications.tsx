import { createFileRoute, Link } from "@tanstack/react-router";
import { offerProducts } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Store notices from Kapematt: new offers, counter announcements and restock news for our Nairobi supermarket.",
      },
      { property: "og:title", content: "Notifications — Kapematt" },
      {
        property: "og:description",
        content: "New offers, counter announcements and restock news.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const offers = offerProducts().slice(0, 5);

  return (
    <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Store notices
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">
          Notifications
        </h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          Everything the store announced this week. Personalised alerts arrive
          with optional accounts.
        </p>
      </Reveal>

      <Reveal className="mt-8 space-y-3" delay={80}>
        <article className="rounded-2xl border border-line bg-glass p-5 backdrop-blur">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
            Bakery
          </span>
          <p className="mt-1 text-sm">
            Sourdough is out of the oven at 05:30 daily. Cinnamon rolls at 07:00
            and 15:00.
          </p>
        </article>
        <article className="rounded-2xl border border-line bg-glass p-5 backdrop-blur">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-leaf">
            Restock
          </span>
          <p className="mt-1 text-sm">
            Fresh produce crates land at 06:00 every morning, including Sunday.
          </p>
        </article>
        {offers.map((p) => (
          <article
            key={p.id}
            className="rounded-2xl border border-line bg-glass p-5 backdrop-blur"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Offer{p.offerEnds ? ` · ends ${p.offerEnds}` : ""}
            </span>
            <p className="mt-1 text-sm">
              <Link
                to="/product/$productId"
                params={{ productId: p.id }}
                className="hover:text-leaf"
              >
                {p.name}
              </Link>{" "}
              is on promotion{p.offerLabel ? ` — ${p.offerLabel}` : ""}.
            </p>
          </article>
        ))}
      </Reveal>
    </div>
  );
}

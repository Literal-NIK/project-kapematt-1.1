import { createFileRoute, Link } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

const ROLES = [
  {
    title: "Bakery assistant",
    type: "Full time · Early shift",
    body: "Mixing, shaping and counter service from 04:30. Experience helpful, attitude matters more.",
  },
  {
    title: "Deli counter attendant",
    type: "Full time · Rotating shift",
    body: "Slicing, portioning and serving hot meals. Food handling certificate required.",
  },
  {
    title: "Till operator",
    type: "Part time · Weekends",
    body: "Front-of-store service, cash and mobile money handling.",
  },
  {
    title: "Stock controller",
    type: "Full time",
    body: "Goods receiving, shelf replenishment and stock counts across departments.",
  },
];

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Open roles at Kapematt Supermarket in Nairobi: bakery, deli, till and stock control. Walk-in applications welcome on weekday mornings.",
      },
      { property: "og:title", content: "Careers at Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Bakery, deli, till and stock roles at our Nairobi store.",
      },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Careers
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Work the floor with us
        </h1>
        <p className="mt-2 max-w-[54ch] text-pretty text-muted-foreground">
          We train on the job and promote from inside. Bring your ID and papers
          to the customer service desk on a weekday morning, or email{" "}
          {STORE.email}.
        </p>
      </Reveal>

      <Reveal className="mt-8 grid gap-4 sm:grid-cols-2" delay={80}>
        {ROLES.map((r) => (
          <article
            key={r.title}
            className="glass-card rounded-2xl p-6"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {r.type}
            </span>
            <h2 className="mt-2 font-display text-lg font-semibold">
              {r.title}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            <a
              href={`mailto:${STORE.email}?subject=Application — ${r.title}`}
              className="mt-4 inline-block font-mono text-xs text-leaf"
            >
              Apply by email →
            </a>
          </article>
        ))}
      </Reveal>

      <Reveal className="mt-10" delay={120}>
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-glass p-6 backdrop-blur sm:flex-row sm:items-center">
          <p className="max-w-[52ch] text-pretty text-sm text-muted-foreground">
            Nothing that fits? Send an open application and we'll keep it on file
            for the next intake.
          </p>
          <Link
            to="/contact"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
          >
            Contact us
          </Link>
        </div>
      </Reveal>
    </div>
  );
}

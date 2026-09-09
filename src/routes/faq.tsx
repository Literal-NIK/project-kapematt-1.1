import { createFileRoute } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

const FAQS = [
  {
    q: "Can I buy online?",
    a: "No. This site is a catalog only — there is no cart, checkout or online payment. Browse here, then buy in store.",
  },
  {
    q: "Are the prices on the site current?",
    a: "Shelf prices sync from the store system and promotional prices are managed separately by staff. Occasional differences are resolved at the till in your favour.",
  },
  {
    q: "Do I need an account?",
    a: "No. Retail and wholesale browsing are both open. An optional account will later let you save favourite products.",
  },
  {
    q: "Why can't I see wholesale prices?",
    a: "Wholesale is quoted per customer based on case size and volume. The wholesale catalog shows pack sizes and minimum order quantities; request a quote for pricing.",
  },
  {
    q: "How long do offers last?",
    a: "Each offer shows its expiry. Promotional prices revert automatically when the offer ends or stock runs out.",
  },
  {
    q: "Can I order a custom cake?",
    a: "You can send an inquiry from the bakery page. The team calls you back to confirm design, size and collection time.",
  },
  {
    q: "Do you deliver?",
    a: `Not at the moment. Collection is at ${STORE.address}, with free parking in the rear yard.`,
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Answers about Kapematt: no online checkout, price accuracy, optional accounts, wholesale quotes, offer expiry and custom cakes.",
      },
      { property: "og:title", content: "FAQs — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Common questions about browsing, prices, offers and wholesale.",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Help
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h1>
      </Reveal>

      <Reveal className="mt-8 space-y-3" delay={80}>
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-line bg-glass p-5 backdrop-blur"
          >
            <summary className="cursor-pointer list-none font-display font-semibold">
              {f.q}
            </summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </Reveal>
    </div>
  );
}

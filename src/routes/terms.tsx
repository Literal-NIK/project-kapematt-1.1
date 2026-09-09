import { createFileRoute } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & privacy — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Terms of use and privacy notice for the Kapematt Supermarket catalog site: catalog accuracy, offers, inquiries and how we handle your details.",
      },
      { property: "og:title", content: "Terms & privacy — Kapematt" },
      {
        property: "og:description",
        content: "How this catalog site works and how we handle your details.",
      },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    h: "Catalog only",
    p: "This site displays products stocked at our single location. It is not a shop: there is no cart, no checkout and no online payment. Nothing on this site constitutes a binding offer to sell.",
  },
  {
    h: "Prices and availability",
    p: "Retail prices are shown in Kenyan shillings and sync from our store system. Promotional prices are managed separately and expire automatically. Stock indicators are a guide; the till price and in-store availability prevail.",
  },
  {
    h: "Wholesale",
    p: "Wholesale listings show case sizes and minimum order quantities without prices. Quotes are issued per customer and are valid for the period stated on the quote.",
  },
  {
    h: "Inquiries and forms",
    p: "Contact, cake and quote forms are inquiries, not orders. We use the details you submit only to respond to that inquiry, and we do not sell them to third parties.",
  },
  {
    h: "Optional accounts",
    p: "Browsing requires no account. If you create one, we store only what is needed to sign you in and to remember saved products. You can ask us to delete it at any time.",
  },
  {
    h: "Images and content",
    p: "Product photography is illustrative. Packaging, weights and recipes may change without notice; always read the pack in store, especially for allergens.",
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Legal
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Terms & privacy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about this notice? Email {STORE.email}.
        </p>
      </Reveal>

      <Reveal className="mt-8 space-y-6" delay={80}>
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 text-pretty text-sm text-muted-foreground">
              {s.p}
            </p>
          </section>
        ))}
      </Reveal>
    </div>
  );
}

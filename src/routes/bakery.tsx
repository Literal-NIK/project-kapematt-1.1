import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { sendCakeInquiry } from "@/lib/mail.functions";
import bakeryCounter from "@/assets/bakery-counter.jpg";
import { FRESH_TODAY, PRODUCTS, STORE } from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { HeroSlideshow } from "@/components/HeroSlideshow";

export const Route = createFileRoute("/bakery")({
  head: () => ({
    meta: [
      { title: "Bakery — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Bread, cakes and pastries baked on site every morning at Kapematt. See what's fresh today and send a custom cake inquiry.",
      },
      { property: "og:title", content: "Bakery — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Baked on site each morning. Fresh-today list and cake inquiries.",
      },
    ],
  }),
  component: BakeryPage,
});

function BakeryPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = useServerFn(sendCakeInquiry);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await send({
        data: {
          name: String(form.get("name") ?? ""),
          phone: String(form.get("phone") ?? ""),
          date: String(form.get("date") ?? ""),
          servings: String(form.get("servings") ?? ""),
          notes: String(form.get("notes") ?? ""),
        },
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send your inquiry. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  const products = PRODUCTS.filter(
    (p) => p.counter === "bakery" || p.department === "bakery",
  );
  const counter = STORE.counters.find((c) => c.name.includes("Bakery"));

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <HeroSlideshow
          slides={[
            {
              image: bakeryCounter,
              alt: "Kapematt bakery counter with fresh loaves and pastries",
              eyebrow: "Bakery",
              title: "Baked at dawn, warm by seven",
              body: "Sourdough, brown loaves, mandazi, cinnamon rolls and celebration cakes - all made in the back of the store.",
            },
            ...products.slice(0, 2).map((product) => ({
              image: product.images[0] ?? bakeryCounter,
              alt: product.name,
              eyebrow: "Fresh today",
              title: product.name,
              body: `${product.brand} - ${product.packSize}. Pulled from the oven this morning.`,
            })),
          ]}
          className="min-h-[420px] rounded-2xl"
          contentClassName="flex min-h-[420px] flex-col justify-center p-7 sm:p-12"
        >
          {(current) => (
            <>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
                {current.eyebrow}
              </span>
              <h1 className="mt-3 max-w-[18ch] font-display text-3xl font-bold sm:text-4xl">
                {current.title}
              </h1>
              <p className="mt-3 max-w-[50ch] text-pretty text-hero-foreground/80">
                {current.body}
              </p>
              <p className="mt-4 font-mono text-xs text-hero-foreground/75">
                {counter ? `${counter.name} - ${counter.time}` : "Open daily"}
              </p>
            </>
          )}
        </HeroSlideshow>
      </Reveal>

      <Reveal className="mt-12" delay={80}>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          Fresh today
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {FRESH_TODAY.map((f) => (
            <li
              key={f.name}
              className="rounded-2xl border border-line bg-glass p-4 backdrop-blur"
            >
              <span className="font-display font-semibold">{f.name}</span>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {f.note}
              </p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-12" delay={120}>
        <h2 className="font-display text-2xl font-semibold tracking-tight">
          On the shelf
        </h2>
        <div className="mt-5">
          <ProductGrid products={products} />
        </div>
      </Reveal>

      <Reveal className="mt-12" delay={100}>
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <h2 id="cake-inquiry" className="scroll-mt-28 font-display text-2xl font-semibold tracking-tight">
            Custom cake inquiry
          </h2>
          <p className="mt-2 max-w-[54ch] text-pretty text-sm text-muted-foreground">
            This is an inquiry, not an order. The bakery team calls you back to
            confirm design, size and collection time.
          </p>
          {sent ? (
            <p className="mt-6 rounded-xl border border-line bg-glass p-4 text-sm">
              Thanks — your inquiry is noted. We'll ring you within one working
              day.
            </p>
          ) : (
            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
              <Field label="Your name" name="name" />
              <Field label="Phone" name="phone" type="tel" />
              <Field label="Collection date" name="date" type="date" />
              <Field label="Servings" name="servings" />
              <label className="text-sm sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Design notes
                </span>
                <textarea
                  name="notes"
                  rows={4}
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background disabled:opacity-60"
                >
                  {busy ? "Sending…" : "Send inquiry"}
                </button>
                {error && (
                  <p className="mt-3 text-sm text-destructive">{error}</p>
                )}
              </div>
            </form>
          )}
        </div>
      </Reveal>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="text-sm">
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required
        className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
      />
    </label>
  );
}

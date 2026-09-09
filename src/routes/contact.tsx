import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { sendContactMessage } from "@/lib/mail.functions";
import { STORE } from "@/data/catalog";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Reach the Kapematt team about stock, counters, wholesale quotes or feedback. Phone, email and a message form for our Nairobi store.",
      },
      { property: "og:title", content: "Contact Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Phone, email and a message form for our Nairobi store.",
      },
    ],
  }),
  component: ContactPage,
});

const TOPICS = [
  "General question",
  "Stock availability",
  "Wholesale quote",
  "Bakery / custom cake",
  "Feedback or complaint",
];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = useServerFn(sendContactMessage);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const form = new FormData(e.currentTarget);
    try {
      await send({
        data: {
          name: String(form.get("name") ?? ""),
          contact: String(form.get("contact") ?? ""),
          topic: String(form.get("topic") ?? ""),
          message: String(form.get("message") ?? ""),
        },
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't send your message. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
          Contact
        </span>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Talk to the store
        </h1>
        <p className="mt-2 max-w-[54ch] text-pretty text-muted-foreground">
          We answer the phone during trading hours and reply to email within one
          working day.
        </p>
      </Reveal>

      <Reveal className="mt-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]" delay={80}>
        <div className="rounded-3xl border border-line bg-glass p-6 backdrop-blur">
          <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Direct
          </h2>
          <p className="mt-3 text-sm">{STORE.phone}</p>
          <p className="text-sm">{STORE.email}</p>
          <p className="mt-4 text-sm text-muted-foreground">{STORE.address}</p>
          <ul className="mt-4 space-y-1 text-sm">
            {STORE.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="font-mono text-xs">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card rounded-3xl p-6 sm:p-8">
          {sent ? (
            <p className="text-sm">
              Thanks — your message is with the team. We'll get back to you at
              the contact you provided.
            </p>
          ) : (
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Name
                </span>
                <input
                  name="name"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Email or phone
                </span>
                <input
                  name="contact"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Topic
                </span>
                <select
                  name="topic"
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={5}
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
                  {busy ? "Sending…" : "Send message"}
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Account (optional) — Kapematt Supermarket" },
      {
        name: "description",
        content:
          "Browsing Kapematt needs no account. An optional account will let you save favourite products and follow offers on the items you buy.",
      },
      { property: "og:title", content: "Account — Kapematt Supermarket" },
      {
        property: "og:description",
        content: "Optional account for saved products and offer alerts.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="mx-auto max-w-[520px] px-4 py-16 sm:px-6">
      <Reveal>
        <div className="glass-card rounded-3xl p-6 sm:p-8">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-leaf">
            Optional
          </span>
          <h1 className="mt-3 font-display text-2xl font-bold tracking-tight">
            Account sign in
          </h1>
          <p className="mt-2 text-pretty text-sm text-muted-foreground">
            You don't need an account to browse the catalog, offers or wholesale
            pages. Accounts are for saving favourite products — coming soon.
          </p>

          {sent ? (
            <p className="mt-6 rounded-xl border border-line bg-glass p-4 text-sm">
              Accounts aren't live yet. We've noted your interest and will let
              you know when saved products launch.
            </p>
          ) : (
            <form
              className="mt-6 grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="text-sm">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm"
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
              >
                Notify me
              </button>
            </form>
          )}

          <div className="mt-6 flex gap-4 font-mono text-xs">
            <Link to="/catalog" className="text-leaf">
              Browse catalog →
            </Link>
            <Link to="/offers" className="text-leaf">
              This week's offers →
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

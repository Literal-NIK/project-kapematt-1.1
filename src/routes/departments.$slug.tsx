import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  DEPARTMENTS,
  departmentBySlug,
  hasOffer,
  productsByDepartment,
} from "@/data/catalog";
import { ProductGrid } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/departments/$slug")({
  loader: ({ params }) => {
    const department = departmentBySlug(params.slug);
    if (!department) throw notFound();
    return { department };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Department not found — Kapematt" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { department } = loaderData;
    const title = `${department.name} — Kapematt Supermarket`;
    return {
      meta: [
        { title },
        { name: "description", content: department.blurb },
        { property: "og:title", content: title },
        { property: "og:description", content: department.blurb },
      ],
    };
  },
  component: DepartmentPage,
});

function DepartmentPage() {
  const { department } = Route.useLoaderData();
  const [sub, setSub] = useState<string | null>(null);

  const products = productsByDepartment(department.slug);
  const filtered = useMemo(
    () => (sub ? products.filter((p) => p.subCategory === sub) : products),
    [products, sub],
  );
  const offers = products.filter(hasOffer);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <Reveal>
        <nav className="font-mono text-xs text-muted-foreground">
          <Link to="/catalog" className="hover:text-foreground">
            Catalog
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-foreground">{department.name}</span>
        </nav>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {department.name}
        </h1>
        <p className="mt-2 max-w-[54ch] text-pretty text-muted-foreground">
          {department.blurb}
        </p>
      </Reveal>

      <Reveal className="mt-6 flex flex-wrap gap-2" delay={80}>
        <button
          type="button"
          onClick={() => setSub(null)}
          className={`rounded-full px-3 py-1.5 text-sm ${
            sub === null
              ? "bg-foreground text-background"
              : "border border-line bg-glass"
          }`}
        >
          All {products.length}
        </button>
        {department.subCategories.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSub(s)}
            className={`rounded-full px-3 py-1.5 text-sm ${
              sub === s
                ? "bg-leaf text-accent-foreground"
                : "border border-line bg-glass hover:border-leaf/40"
            }`}
          >
            {s}
          </button>
        ))}
      </Reveal>

      {offers.length > 0 && (
        <Reveal className="mt-8" delay={100}>
          <div className="rounded-2xl border border-line bg-glass p-4 backdrop-blur">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber">
              Active offers in {department.name}
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              {offers.map((p) => p.name).join(" · ")}
            </p>
          </div>
        </Reveal>
      )}

      <Reveal className="mt-8" delay={140}>
        <ProductGrid products={filtered} />
      </Reveal>

      <Reveal className="mt-12" delay={100}>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          Other departments
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {DEPARTMENTS.filter((d) => d.slug !== department.slug).map((d) => (
            <Link
              key={d.slug}
              to="/departments/$slug"
              params={{ slug: d.slug }}
              className="rounded-full border border-line bg-glass px-4 py-2 text-sm hover:border-leaf/40"
            >
              {d.name}
            </Link>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

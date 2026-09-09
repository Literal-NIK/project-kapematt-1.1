import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  PRODUCTS,
  departmentBySlug,
  formatKES,
  productById,
} from "@/data/catalog";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid, StockDot } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { useMode } from "@/lib/mode";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = productById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Product not found — Kapematt" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — Kapematt Supermarket`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { pricesVisible } = useMode();
  const department = departmentBySlug(product.department);
  const related = PRODUCTS.filter(
    (p) => p.department === product.department && p.id !== product.id,
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <nav className="font-mono text-xs text-muted-foreground">
        <Link to="/catalog" className="hover:text-foreground">
          Catalog
        </Link>
        <span aria-hidden="true"> / </span>
        {department && (
          <>
            <Link
              to="/departments/$slug"
              params={{ slug: department.slug }}
              className="hover:text-foreground"
            >
              {department.name}
            </Link>
            <span aria-hidden="true"> / </span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="glass-card overflow-hidden rounded-3xl">
          <ProductGallery
            images={product.images}
            alt={product.name}
            aspect="aspect-4/3"
            priority
          />
        </div>

        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {product.brand} · {product.packSize}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3 flex items-center gap-4">
            <StockDot stock={product.stock} />
            {product.offerLabel && (
              <span className="rounded-md bg-amber px-2 py-1 font-mono text-[11px] text-foreground">
                {product.offerLabel}
              </span>
            )}
          </div>

          {pricesVisible ? (
            <div className="mt-5 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold">
                {formatKES(product.promoPrice ?? product.basePrice)}
              </span>
              {product.promoPrice !== undefined && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatKES(product.basePrice)}
                </span>
              )}
              {product.unitPrice && (
                <span className="font-mono text-xs text-muted-foreground">
                  {product.unitPrice}
                </span>
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-line bg-glass p-4 text-sm">
              <p className="font-medium">Wholesale view</p>
              <p className="mt-1 text-muted-foreground">
                {product.caseSize} · MOQ {product.moq} {product.unitOfMeasure}.
                Prices on quotation.
              </p>
              <Link
                to="/wholesale/$productId"
                params={{ productId: product.id }}
                className="mt-2 inline-block font-mono text-xs text-leaf"
              >
                Wholesale details →
              </Link>
            </div>
          )}

          <p className="mt-5 text-pretty text-muted-foreground">
            {product.description}
          </p>

          {product.prepNote && (
            <p className="mt-4 rounded-xl border border-line bg-glass p-3 text-sm">
              {product.prepNote}
            </p>
          )}

          {product.ingredients && (
            <section className="mt-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Ingredients
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.ingredients}
              </p>
            </section>
          )}

          {product.allergens && product.allergens.length > 0 && (
            <section className="mt-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Allergens
              </h2>
              <p className="mt-2 text-sm">{product.allergens.join(", ")}</p>
            </section>
          )}

          {product.nutrition && product.nutrition.length > 0 && (
            <section className="mt-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Nutrition
              </h2>
              <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
                {product.nutrition.map((n) => (
                  <div key={n.label} className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{n.label}</dt>
                    <dd className="font-mono text-xs">{n.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <p className="mt-8 font-mono text-[11px] text-muted-foreground">
            Catalog only — no online checkout. Availability confirmed in store.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <Reveal className="mt-14" delay={80}>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            More from {department?.name ?? "this aisle"}
          </h2>
          <div className="mt-5">
            <ProductGrid products={related} />
          </div>
        </Reveal>
      )}
    </div>
  );
}

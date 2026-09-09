import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PRODUCTS, STORE, departmentBySlug, productById } from "@/data/catalog";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid, StockDot } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/wholesale/$productId")({
  loader: ({ params }) => {
    const product = productById(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Line not found — Kapematt Wholesale" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} in bulk — Kapematt Wholesale`;
    const description = `${product.caseSize}, MOQ ${product.moq} ${product.unitOfMeasure}. Prices on quotation from Kapematt Supermarket.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: WholesaleProductPage,
});

function WholesaleProductPage() {
  const { product } = Route.useLoaderData();
  const department = departmentBySlug(product.department);
  const related = PRODUCTS.filter(
    (p) => p.department === product.department && p.id !== product.id,
  ).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
      <nav className="font-mono text-xs text-muted-foreground">
        <Link to="/wholesale/catalog" className="hover:text-foreground">
          Wholesale catalog
        </Link>
        <span aria-hidden="true"> / </span>
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
            {product.brand} · {department?.name ?? product.department}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {product.name}
          </h1>
          <div className="mt-3">
            <StockDot stock={product.stock} />
          </div>

          <dl className="mt-6 grid gap-3 rounded-2xl border border-line bg-glass p-5 text-sm backdrop-blur sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Case size
              </dt>
              <dd className="mt-1">{product.caseSize}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Unit of measure
              </dt>
              <dd className="mt-1">{product.unitOfMeasure}</dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Minimum order
              </dt>
              <dd className="mt-1">
                {product.moq} {product.unitOfMeasure}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Retail pack
              </dt>
              <dd className="mt-1">{product.packSize}</dd>
            </div>
            {product.wholesaleTerms && (
              <div className="sm:col-span-2">
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Terms
                </dt>
                <dd className="mt-1">{product.wholesaleTerms}</dd>
              </div>
            )}
          </dl>

          <p className="mt-5 text-pretty text-muted-foreground">
            {product.description}
          </p>

          {product.allergens && product.allergens.length > 0 && (
            <p className="mt-4 text-sm">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Allergens:{" "}
              </span>
              {product.allergens.join(", ")}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/wholesale"
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Request a quote
            </Link>
            <Link
              to="/product/$productId"
              params={{ productId: product.id }}
              className="rounded-full border border-line bg-glass px-5 py-2.5 text-sm font-medium"
            >
              Retail details
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            Prices on quotation · trade desk {STORE.phone}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <Reveal className="mt-14" delay={80}>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Other bulk lines
          </h2>
          <div className="mt-5">
            <ProductGrid products={related} />
          </div>
        </Reveal>
      )}
    </div>
  );
}

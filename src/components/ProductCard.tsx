import { Link } from "@tanstack/react-router";
import {
  STOCK_LABEL,
  formatKES,
  type Product,
} from "@/data/catalog";
import { departmentBySlug } from "@/data/catalog";
import { useMode } from "@/lib/mode";
import { ProductGallery } from "./ProductGallery";

export function StockDot({ stock }: { stock: Product["stock"] }) {
  const tone =
    stock === "in"
      ? "text-leaf"
      : stock === "low"
        ? "text-amber"
        : "text-muted-foreground";
  const dot =
    stock === "in" ? "bg-leaf" : stock === "low" ? "bg-amber" : "bg-muted";
  return (
    <span className={`flex items-center gap-1 font-mono text-[11px] ${tone}`}>
      <span className={`size-1.5 rounded-full ${dot}`} />
      {STOCK_LABEL[stock]}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { mode, pricesVisible } = useMode();
  const department = departmentBySlug(product.department);
  const isWholesale = mode === "wholesale";

  return (
    <article className="glass-card flex h-full min-w-0 flex-col overflow-hidden rounded-lg transition-shadow hover:shadow-lg hover:shadow-foreground/5">
      <div className="relative">
        <ProductGallery images={product.images} alt={product.name} />
        {!isWholesale && product.offerLabel && (
          <span className="absolute left-2 top-2 rounded-md bg-amber px-1.5 py-1 font-mono text-[9px] font-medium text-foreground sm:left-3 sm:top-3 sm:px-2 sm:text-[11px]">
            {product.offerLabel}
          </span>
        )}
        {product.counter && (
          <span className="absolute right-2 top-2 rounded-md bg-glass px-1.5 py-1 font-mono text-[9px] uppercase text-foreground backdrop-blur sm:right-3 sm:top-3 sm:px-2 sm:text-[10px]">
            {product.counter}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-2.5 sm:p-4">
        <span className="truncate font-mono text-[8px] uppercase text-muted-foreground sm:text-[10px] sm:tracking-[0.18em]">
          {department?.name ?? product.department}
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-9 font-display text-sm font-semibold leading-tight sm:min-h-0 sm:text-base">
          <Link
            to={isWholesale ? "/wholesale/$productId" : "/product/$productId"}
            params={{ productId: product.id }}
            className="after:absolute after:inset-0"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-sm">
          {product.brand} ·{" "}
          {isWholesale ? product.caseSize : product.packSize}
        </p>

        {isWholesale ? (
          <div className="mt-auto flex flex-col items-start gap-1 pt-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-3">
            <span className="font-mono text-[11px] text-muted-foreground">
              MOQ {product.moq || "—"} {product.unitOfMeasure}
            </span>
            <StockDot stock={product.stock} />
          </div>
        ) : (
          <div className="mt-auto flex flex-col items-start gap-1 pt-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3 sm:pt-3">
            {pricesVisible ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-base font-bold sm:text-lg">
                    {formatKES(product.promoPrice ?? product.basePrice)}
                  </span>
                  {product.promoPrice !== undefined && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatKES(product.basePrice)}
                    </span>
                  )}
                </div>
                {product.unitPrice && (
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {product.unitPrice}
                  </span>
                )}
              </div>
            ) : (
              <span className="font-mono text-[11px] text-muted-foreground">
                Quote on request
              </span>
            )}
            <StockDot stock={product.stock} />
          </div>
        )}
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
        No products match these filters yet.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:gap-5 xl:grid-cols-5">
      {products.map((p) => (
        <div key={p.id} className="relative">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

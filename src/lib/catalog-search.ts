export type CatalogSearch = {
  q?: string | undefined;
  dept?: string | undefined;
  brand?: string | undefined;
  max?: number | undefined;
  stock?: "all" | "in" | undefined;
  offers?: boolean | undefined;
  sort?: "featured" | "price-asc" | "price-desc" | "name" | undefined;
};

export function parseCatalogSearch(
  search: Record<string, unknown>,
): CatalogSearch {
  const q = search["q"];
  const dept = search["dept"];
  const brand = search["brand"];
  const max = search["max"];
  const sort = search["sort"];
  return {
    q: typeof q === "string" && q ? q : undefined,
    dept: typeof dept === "string" ? dept : undefined,
    brand: typeof brand === "string" ? brand : undefined,
    max: typeof max === "number" ? max : undefined,
    stock: search["stock"] === "in" ? "in" : undefined,
    offers: search["offers"] === true ? true : undefined,
    sort:
      sort === "price-asc" || sort === "price-desc" || sort === "name"
        ? sort
        : undefined,
  };
}

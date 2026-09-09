import { DEPARTMENTS, PRODUCTS } from "@/data/catalog";

export type Suggestion =
  | { kind: "department"; label: string; sub: string; slug: string }
  | { kind: "product"; label: string; sub: string; id: string }
  | { kind: "term"; label: string; sub: string };

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(cur[j - 1]! + 1, prev[j]! + 1, prev[j - 1]! + cost);
    }
    prev = cur;
  }
  return prev[n]!;
}

/** 0 = no match, higher = better. Tolerates misspellings. */
function score(query: string, text: string): number {
  const t = text.toLowerCase();
  if (t.startsWith(query)) return 100 - t.length * 0.01;
  if (t.includes(query)) return 70 - t.length * 0.01;
  const words = t.split(/[^a-z0-9]+/).filter(Boolean);
  let best = 0;
  for (const w of words) {
    const d = levenshtein(query, w);
    const tolerance = query.length <= 4 ? 1 : query.length <= 7 ? 2 : 3;
    if (d <= tolerance) best = Math.max(best, 60 - d * 10);
  }
  return best;
}

export function suggest(rawQuery: string, limit = 8): Suggestion[] {
  const q = rawQuery.trim().toLowerCase();
  if (q.length < 2) return [];

  const scored: { s: number; item: Suggestion }[] = [];

  for (const d of DEPARTMENTS) {
    const s = Math.max(
      score(q, d.name),
      ...d.subCategories.map((c) => score(q, c) * 0.9),
    );
    if (s > 0)
      scored.push({
        s: s + 15,
        item: {
          kind: "department",
          label: d.name,
          sub: "Department",
          slug: d.slug,
        },
      });
  }

  for (const p of PRODUCTS) {
    const s = Math.max(
      score(q, p.name),
      score(q, p.brand) * 0.85,
      score(q, p.subCategory) * 0.8,
    );
    if (s > 0)
      scored.push({
        s,
        item: {
          kind: "product",
          label: p.name,
          sub: `${p.brand} · ${p.packSize}`,
          id: p.id,
        },
      });
  }

  scored.sort((a, b) => b.s - a.s);

  const results = scored.slice(0, limit).map((x) => x.item);

  // Offer a corrected search term when the raw query matched nothing exactly.
  const exact = PRODUCTS.some((p) => p.name.toLowerCase().includes(q));
  const top = results[0];
  if (!exact && top && !q.split(/\s+/).every((w) => top.label.toLowerCase().includes(w))) {
    results.unshift({
      kind: "term",
      label: top.label,
      sub: `Search instead for “${top.label}”`,
    });
  }
  return results.slice(0, limit);
}

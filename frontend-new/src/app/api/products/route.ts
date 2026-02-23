import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
import { readItems } from "@directus/sdk";

interface TypeItem {
  [key: string]: unknown;
}
interface TypeRelation {
  collection: string;
  item: TypeItem;
}
interface Product {
  id: string | number;
  model?: string | null;
  slug?: string | null;
  short_description?: string | null;
  main_image?: any;
  price?: number | null;
  brand?: any;
  state?: string | null;
  status?: string | null;
  type?: TypeRelation[] | TypeRelation | null;
  [key: string]: unknown;
}

const FILTER_PREFIX = "f__";

function toPositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

function toComparable(v: unknown) {
  if (v == null) return "";
  return String(v).trim().toLowerCase();
}

function slugifyComparable(v: unknown) {
  return toComparable(v)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractValuesFromItemValue(val: unknown): string[] {
  if (val == null) return [];

  if (Array.isArray(val)) return val.flatMap((x) => extractValuesFromItemValue(x));

  if (typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const candidates = [obj.value, obj.id, obj.key, obj.slug, obj.name, obj.title, obj.label];

    const out = candidates
      .map((c) => (c == null ? "" : String(c)))
      .map((s) => s.trim())
      .filter(Boolean);

    if (out.length) return out;

    try {
      return [JSON.stringify(obj)];
    } catch {
      return [];
    }
  }

  return [String(val).trim()];
}

function valueMatches(itemValue: unknown, expectedValues: string[]) {
  const actualList = extractValuesFromItemValue(itemValue);
  if (!actualList.length) return false;

  return expectedValues.some((expected) => {
    const exp = toComparable(expected);
    const expSlug = slugifyComparable(expected);

    return actualList.some((actual) => {
      const act = toComparable(actual);
      const actSlug = slugifyComparable(actual);
      return act === exp || actSlug === expSlug;
    });
  });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get("category");
    if (!categorySlug) {
      return NextResponse.json({ error: "Missing category parameter" }, { status: 400 });
    }

    const page = toPositiveInt(searchParams.get("page"), 1);
    const perPage = toPositiveInt(searchParams.get("perPage"), 12);

    // slug -> kolekcja
    const categoryCollection = await mapSlugToCollection(categorySlug);
    if (!categoryCollection) {
      return NextResponse.json({ error: `Unknown category slug: ${categorySlug}` }, { status: 404 });
    }

    const allowedCollections = [categoryCollection];

    const subcategorySlug = searchParams.get("subcategory");
    if (subcategorySlug) {
      const subCol = await mapSlugToCollection(subcategorySlug);
      if (subCol) allowedCollections.push(subCol);
    }

    // bazowy filtr
    const baseFilter: any = {
      status: { _eq: "published" },
      _and: [
        {
          type: {
            collection: { _in: allowedCollections },
          },
        },
      ],
    };

    const allProducts = (await directus.request(
      readItems("products", {
        fields: [
          "id",
          "model",
          "slug",
          "short_description",
          "main_image.*",
          "price",
          "brand.*",
          "state",
          "weight",
          "type.collection",
          "type.item.*",
        ],
        filter: baseFilter,
         sort: ["weight"],
        limit: 1000,
      })
    )) as Product[];

    // ✅ Bierzemy TYLKO parametry zaczynające się od f__
    const filters: Record<string, string[]> = {};
    for (const [rawKey, rawValue] of searchParams.entries()) {
      if (!rawKey.startsWith(FILTER_PREFIX)) continue; // ✅ twarde odcięcie
      if (!rawValue) continue;

      const key = rawKey.slice(FILTER_PREFIX.length).trim();
      if (!key) continue;

      const values = rawValue
        .split(",")
        .map((v) => decodeURIComponent(v).trim())
        .filter(Boolean);

      if (!values.length) continue;

      filters[key] = values;
    }

    // ✅ filtrowanie tylko po type.item w allowedCollections
    const filtered = allProducts.filter((product) => {
      if (Object.keys(filters).length === 0) return true;

      const typeArray = Array.isArray(product.type) ? product.type : product.type ? [product.type] : [];
      const relevantTypes = typeArray.filter((t) => allowedCollections.includes(t.collection));
      if (!relevantTypes.length) return false;

      return Object.entries(filters).every(([key, expectedValues]) => {
        return relevantTypes.some((t) => {
          const item = t.item || {};
          return valueMatches(item[key], expectedValues);
        });
      });
    });

    // paginacja
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    return NextResponse.json({
      page: safePage,
      perPage,
      total,
      totalPages,
      count: paginated.length,
      products: paginated,
      appliedFilters: Object.keys(filters).length ? filters : null,
      allowedCollections,
    });
  } catch (error: any) {
    console.error("❌ Błąd w /api/products:", error?.message || error, error?.errors || "");
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Products endpoint failed", message, directusErrors: error?.errors || undefined },
      { status: 502 }
    );
  }
}
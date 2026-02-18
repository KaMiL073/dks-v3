import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
import { readItems, readFields } from "@directus/sdk";

/** Typy pomocnicze */
interface TypeItem {
  [key: string]: string | number | boolean | null | undefined;
}

interface TypeRelation {
  collection: string;
  item: TypeItem;
}

interface Product {
  id: number;
  model?: string;
  slug?: string;
  short_description?: string;
  main_image?: { id?: string } | string;
  price?: number;
  brand?: { id?: string | number; name?: string };
  state?: string;
  status?: string;

  // ✅ POTRZEBNE DO “FILTRA” PRZY KAFELKU
  primarycategory?: string | null;

  // M2A
  type?: TypeRelation[] | TypeRelation;

  [key: string]: unknown;
}

function toPositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

function norm(s: unknown) {
  return String(s ?? "").trim().toLowerCase();
}

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/** Główna funkcja API */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 🔹 Parametr kategorii
    const categorySlug = searchParams.get("category");
    if (!categorySlug) {
      return NextResponse.json({ error: "Missing category parameter" }, { status: 400 });
    }

    // ✅ Paginacja
    const page = toPositiveInt(searchParams.get("page"), 1);
    const perPage = toPositiveInt(searchParams.get("perPage"), 12);

    // 🔹 Zamiana slug → kolekcja
    const collection = await mapSlugToCollection(categorySlug);
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown category slug: ${categorySlug}` },
        { status: 404 }
      );
    }

    // (opcjonalnie) sprawdzenie schematu
    await directus.request(readFields("products"));

    // 🔹 Bazowy filtr
    const baseFilter: {
      status: { _eq: string };
      _and: Array<{
        type: {
          collection: { _in: string[] };
        };
      }>;
    } = {
      status: { _eq: "published" },
      _and: [
        {
          type: {
            collection: { _in: [collection] }, // główna kategoria
          },
        },
      ],
    };

    // ✅ Subkategoria (nie nadpisuje filtra)
    const subcategorySlug = searchParams.get("subcategory");
    if (subcategorySlug) {
      const subcategoryCollection = await mapSlugToCollection(subcategorySlug);
      if (subcategoryCollection) {
        baseFilter._and[0].type.collection._in.push(subcategoryCollection);
      }
    }

    // 🔹 Pobranie produktów z Directusa
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

          // ✅ DODANE — potrzebne na kafelku
          "primarycategory",

          // M2A
          "type.collection",
          "type.item.*",
        ],
        filter: baseFilter,
        limit: 300,
      })
    )) as Product[];

    // 🔹 Filtrowanie po query params (np. ?color=czarny&format=a4)
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      // ⛔️ NIE traktuj jako filtry:
      if (key === "category" || key === "subcategory" || key === "page" || key === "perPage") {
        return;
      }

      if (!value) return;
      if (!filters[key]) filters[key] = [];

      // wspieramy CSV: a,b,c
      value.split(",").forEach((v) => {
        const trimmed = v.trim();
        if (trimmed) filters[key].push(trimmed);
      });
    });

    const filtered = allProducts.filter((product) => {
      if (Object.keys(filters).length === 0) return true;

      const typeArray = asArray(product.type);

      return Object.entries(filters).every(([key, values]) => {
        // ✅ 1) najpierw sprawdzamy pola ROOT produktu (np. primarycategory)
        const rootVal = (product as any)?.[key];
        if (rootVal !== undefined && rootVal !== null && String(rootVal).trim() !== "") {
          const rv = norm(rootVal);
          return values.some((v) => norm(v) === rv);
        }

        // ✅ 2) potem szukamy w M2A type.item.*
        return typeArray.some((t) => {
          const item = (t as any)?.item || {};
          const val = item[key];
          if (val === undefined || val === null || String(val).trim() === "") return false;
          const iv = norm(val);
          return values.some((v) => norm(v) === iv);
        });
      });
    });

    // ✅ Paginacja po filtrowaniu
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * perPage;
    const end = start + perPage;
    const paginated = filtered.slice(start, end);

    return NextResponse.json({
      page: safePage,
      perPage,
      total,
      totalPages,
      count: paginated.length,
      products: paginated,
    });
  } catch (error) {
    console.error("❌ Błąd w /api/products:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: "Internal Server Error", details: message }, { status: 500 });
  }
}
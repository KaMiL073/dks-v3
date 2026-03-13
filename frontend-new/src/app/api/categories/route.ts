// frontend-new/src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

// 🔹 Mapowanie slugów kategorii na kolekcje w Directusie
const categoryMap: Record<string, string> = {
  "rozwiazania-dla-biura": "office_solutions",
  drukarki: "printers",
  "urzadzenia-wielofunkcyjne": "multifunction_devices",
  "oprogramowanie-biuro": "office_software",
  "oprogramowanie-druk": "printing_software",
  "duzy-format": "large_format_solutions",
  termowizja: "thermal_imagers",
  "materialy-eksploatacyjne": "consumables",
  laptopy: "laptops",
  komputery: "computers",
  "tablice-interaktywne": "multiboards",
};

type CategoryItem = { slug: string; collection: string };

type Product = {
  id: string | number;
  model?: string;
  slug?: string;
  status?: string;
  price?: number | null;
  main_image?: { id?: string } | string | null;
  brand?: { id?: string; name?: string } | null;
  type?: unknown;
};

// TS nie widzi directus.request w Twoim typie klienta, ale runtime może mieć.
// Robimy więc minimalny wrapper na unknown.
type DirectusRequestLike = {
  request: (operation: unknown) => Promise<unknown>;
};

function getDirectusRequestClient(): DirectusRequestLike {
  const client = directus as unknown as Partial<DirectusRequestLike>;
  if (typeof client.request !== "function") {
    throw new Error('Directus client does not expose "request" method.');
  }
  return client as DirectusRequestLike;
}

// readItems w SDK jest generyczne i u Ciebie typy robią z kolekcji "never".
// Omijamy to jednym, kontrolowanym castem (bez any).
type ReadItemsFn = (collection: string, query: Record<string, unknown>) => unknown;
const readItemsLoose = readItems as unknown as ReadItemsFn;

async function getProductsByCategory(category: string): Promise<Product[]> {
  const collection = categoryMap[category];
  if (!collection) return [];

  const op = readItemsLoose("products", {
    fields: [
      "id",
      "model",
      "slug",
      "status",
      "price",
      "main_image.id",
      "brand.id",
      "brand.name",
      "type.collection",
      "type.item",
    ],
    filter: {
      _and: [
        { status: { _eq: "published" } },
        {
          type: {
            _some: {
              collection: { _eq: collection },
            },
          },
        },
      ],
    },
    // limit: -1 bywa różnie interpretowane w REST/SDK
    limit: 1000,
  });

  const client = getDirectusRequestClient();
  const result = await client.request(op);

  return Array.isArray(result) ? (result as Product[]) : [];
}

/**
 * GET /api/categories
 * - bez parametru: zwraca listę kategorii
 * - z ?category=<slug>: zwraca produkty z tej kategorii
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");

    // 1) Lista kategorii
    if (!categorySlug) {
      const categories: CategoryItem[] = Object.entries(categoryMap).map(([slug, collection]) => ({
        slug,
        collection,
      }));
      return NextResponse.json({ categories }, { status: 200 });
    }

    // 2) Produkty dla kategorii
    const collection = categoryMap[categorySlug];
    if (!collection) {
      return NextResponse.json({ error: `Nieznana kategoria: ${categorySlug}` }, { status: 400 });
    }

    const products = await getProductsByCategory(categorySlug);

    return NextResponse.json(
      {
        category: categorySlug,
        collection,
        count: products.length,
        products,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Categories endpoint failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";
import { mapCollectionToSlug } from "@/lib/directusCategoryMapper";

/** 🔹 Typ produktu (zgodny z Twoim Directusem) */
export interface Product {
  id: string;
  model: string;
  slug: string;
  price?: number;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  short_description?: string;
  main_image?: { id: string };
  brand?: { id: string; name: string; logo?: string };
  category?: { slug: string };
  subcategory?: { slug: string };
  type?: {
    collection?: string;
    item?: Record<string, string | number | boolean | null | undefined>;
  }[];
}

/** 🔹 Typ opcji filtrów */
export interface FilterOption {
  value: string;
  text: string;
}

/** 🔹 Typ filtra */
export interface Filter {
  name: string;
  displayName: string;
  options: FilterOption[];
}

/* -------------------------------------------------------------------------- */
/* 🧩 API helpers — frontendowa warstwa nad endpointami Next.js               */
/* -------------------------------------------------------------------------- */

/** 🔹 Pobranie produktów przez API (z backendowego endpointu Next.js) */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.products ?? [];
}

/** 🔹 Pobranie produktów z filtrami */
export async function getProductsFiltered(
  category: string,
  selected: Record<string, string[]>
): Promise<Product[]> {
  const res = await fetch(
    `/api/products?category=${encodeURIComponent(category)}&filters=${encodeURIComponent(
      JSON.stringify(selected)
    )}`
  );
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.products ?? [];
}

/** 🔹 Pobranie filtrów dla danej kategorii */
export async function getFiltersForCategory(category: string): Promise<Filter[]> {
  const res = await fetch(`/api/products/filters?category=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  return data.filters ?? [];
}

/* -------------------------------------------------------------------------- */
/* 🧠 Directus — pobieranie pojedynczego produktu                            */
/* -------------------------------------------------------------------------- */

/**
 * 🔹 Pobranie pojedynczego produktu po slugu
 * Używa mapowania `collection → display_template`, żeby zbudować poprawny slug kategorii
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const items = await directus.request(
      readItems("products", {
        filter: { slug: { _eq: slug } },
        limit: 1,
        fields: [
          "id",
          "model",
          "slug",
          "price",
          "description",
          "seo_title",
          "seo_description",
          "images.*",
          "brand.id",
          "brand.name",
          "brand.logo",
          "type.collection",
          "type.item.*",
          "components.collection",
          "components.item.*",
          "files.directus_files_id.*"
        ],
      })
    );

    if (!Array.isArray(items) || items.length === 0) return null;

    const product = items[0] as Product;

    // 🔹 Wyciągamy kategorię z pola "type.collection"
    const collectionName = product?.type?.[0]?.collection;
    const categorySlug = collectionName
      ? await mapCollectionToSlug(collectionName)
      : null;

    // 🔹 Uzupełniamy dane o "category.slug" — by działały linki
    return {
      ...product,
      category: categorySlug ? { slug: categorySlug } : undefined,
    };
  } catch (err) {
    console.error("❌ getProductBySlug error:", err);
    return null;
  }
}
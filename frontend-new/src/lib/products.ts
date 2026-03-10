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

  main_image?: { id: string } | string;

  brand?: { id: string; name: string; logo?: string };

  /** ✅ nazwa kolekcji-kategorii (np. "laptops") */
  primarycategory?: string | null;

  /** ✅ Obrazy do slidera (ProductPage oczekuje directus_files_id jako string) */
  images?: { directus_files_id: string }[];

  /** kategoria do linków (slug) */
  category?: { slug: string };
  subcategory?: { slug: string };

  /**
   * ✅ Znormalizowane "type" do formatu M2A:
   * [{ collection: 'some_collection', item: {...} }]
   */
  type?: {
    collection?: string;
    item?: Record<string, string | number | boolean | null | undefined>;
  }[];

  components?: {
    collection?: string;
    item?: Record<string, unknown>;
  }[];

  files?: {
    directus_files_id?: { id: string } | string;
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

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("API error");
  const data: unknown = await res.json();
  if (data && typeof data === "object" && Array.isArray((data as { products?: unknown }).products)) {
    return (data as { products: Product[] }).products ?? [];
  }
  return [];
}

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
  const data: unknown = await res.json();
  if (data && typeof data === "object" && Array.isArray((data as { products?: unknown }).products)) {
    return (data as { products: Product[] }).products ?? [];
  }
  return [];
}

export async function getFiltersForCategory(category: string): Promise<Filter[]> {
  const res = await fetch(`/api/products/filters?category=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error("API error");
  const data: unknown = await res.json();
  if (data && typeof data === "object" && Array.isArray((data as { filters?: unknown }).filters)) {
    return (data as { filters: Filter[] }).filters ?? [];
  }
  return [];
}

/* -------------------------------------------------------------------------- */
/* 🧠 Directus — pobieranie pojedynczego produktu                            */
/* -------------------------------------------------------------------------- */

type ProductRow = Record<string, unknown>;

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function pickString(v: unknown): string | undefined {
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  return undefined;
}

function normalizeFileId(v: unknown): string | null {
  const asString = pickString(v);
  if (asString) return asString;

  if (isRecord(v)) {
    const id = pickString(v.id);
    if (id) return id;
  }

  return null;
}

function normalizeImages(images: unknown): { directus_files_id: string }[] {
  if (!Array.isArray(images)) return [];

  const out: { directus_files_id: string }[] = [];

  for (const img of images) {
    if (!isRecord(img)) continue;

    const id = normalizeFileId(img.directus_files_id);
    if (id) out.push({ directus_files_id: id });
  }

  return out;
}

function normalizeType(typeVal: unknown): {
  collection?: string;
  item?: Record<string, string | number | boolean | null | undefined>;
}[] {
  if (!Array.isArray(typeVal) || typeVal.length === 0) return [];

  const first = typeVal[0];
  const looksLikeM2A = isRecord(first) && ("collection" in first || "item" in first);
  if (!looksLikeM2A) return [];

  const out: {
    collection?: string;
    item?: Record<string, string | number | boolean | null | undefined>;
  }[] = [];

  for (const t of typeVal) {
    if (!isRecord(t)) continue;

    const coll = pickString(t.collection);

    const itemRaw = t.item;
    const item = isRecord(itemRaw) ? (itemRaw as Record<string, unknown>) : undefined;

    let safeItem: Record<string, string | number | boolean | null | undefined> | undefined;

    if (item) {
      safeItem = {};
      for (const [k, v] of Object.entries(item)) {
        if (
          typeof v === "string" ||
          typeof v === "number" ||
          typeof v === "boolean" ||
          v === null ||
          v === undefined
        ) {
          safeItem[k] = v;
        }
      }
    }

    if (!coll && !safeItem) continue;
    out.push({ collection: coll, item: safeItem });
  }

  return out;
}

/**
 * 🔹 Pobranie pojedynczego produktu po slugu
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("products", {
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
          "short_description",
          "primarycategory",
          "main_image.*",
          "brand.id",
          "brand.name",
          "brand.logo",
          "images.id",
          "images.directus_files_id.*",
          "type.collection",
          "type.item.*",
          "components.collection",
          "components.item.*",
          "files.directus_files_id.*",
        ],
        deep: {
          images: { directus_files_id: { _fields: ["id"] } },
          files: { directus_files_id: { _fields: ["id"] } },
          type: {
            item: { _fields: ["*"] },
          },
        },
      })
    );

    const items: ProductRow[] = Array.isArray(res) ? (res as ProductRow[]) : [];
    if (items.length === 0) return null;

    const raw = items[0];
    if (!isRecord(raw)) return null;

    const id = pickString(raw.id);
    const model = pickString(raw.model);
    const rawSlug = pickString(raw.slug);

    if (!id || !model || !rawSlug) return null;

    const primarycategory = pickString(raw.primarycategory) ?? null;

    const categorySlug = primarycategory ? await mapCollectionToSlug(primarycategory) : null;

    const images = normalizeImages(raw.images);
    const type = normalizeType(raw.type);

    const product: Product = {
      ...(raw as unknown as Product),
      id,
      model,
      slug: rawSlug,
      images,
      type,
      category: categorySlug ? { slug: categorySlug } : undefined,
      primarycategory,
    };

    return product;
  } catch (err: unknown) {
    console.error("❌ getProductBySlug error:", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* 🏷️ Produkty po marce                                                      */
/* -------------------------------------------------------------------------- */

export async function getProductsByBrandId(brandId: string): Promise<Product[]> {
  const res = await directus.request(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (readItems as any)("products", {
      filter: { brand: { _eq: brandId } },
      fields: ["id", "model", "slug", "main_image.*", "brand.id", "brand.name"],
      limit: 100,
    })
  );

  const rows: ProductRow[] = Array.isArray(res) ? (res as ProductRow[]) : [];
  return rows
    .filter(isRecord)
    .map((r) => {
      const id = pickString(r.id) ?? "";
      const model = pickString(r.model) ?? "";
      const slug = pickString(r.slug) ?? "";
      return { ...(r as unknown as Product), id, model, slug };
    })
    .filter((p) => p.id && p.model && p.slug);
}
// import { directus } from "@/lib/directus";
// import { readItems } from "@directus/sdk";
// import { mapCollectionToSlug } from "@/lib/directusCategoryMapper";

// /** 🔹 Typ produktu (zgodny z Twoim Directusem) */
// export interface Product {
//   id: string;
//   model: string;
//   slug: string;

//   price?: number;
//   description?: string;
//   seo_title?: string;
//   seo_description?: string;
//   short_description?: string;

//   main_image?: { id: string } | string;

//   brand?: { id: string; name: string; logo?: string };

//   /** ✅ nazwa kolekcji-kategorii (np. "laptops") */
//   primarycategory?: string | null;

//   /** ✅ Obrazy do slidera (ProductPage oczekuje directus_files_id jako string) */
//   images?: { directus_files_id: string }[];

//   /** kategoria do linków (slug) */
//   category?: { slug: string };
//   subcategory?: { slug: string };

//   /**
//    * ✅ Znormalizowane "type" do formatu M2A:
//    * [{ collection: 'some_collection', item: {...} }]
//    */
//   type?: {
//     collection?: string;
//     item?: Record<string, string | number | boolean | null | undefined>;
//   }[];

//   components?: {
//     collection?: string;
//     item?: Record<string, unknown>;
//   }[];

//   files?: {
//     directus_files_id?: { id: string } | string;
//   }[];
// }

// /** 🔹 Typ opcji filtrów */
// export interface FilterOption {
//   value: string;
//   text: string;
// }

// /** 🔹 Typ filtra */
// export interface Filter {
//   name: string;
//   displayName: string;
//   options: FilterOption[];
// }

// /* -------------------------------------------------------------------------- */
// /* 🧩 API helpers — frontendowa warstwa nad endpointami Next.js               */
// /* -------------------------------------------------------------------------- */

// export async function getProductsByCategory(category: string): Promise<Product[]> {
//   const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
//   if (!res.ok) throw new Error("API error");
//   const data = await res.json();
//   return data.products ?? [];
// }

// export async function getProductsFiltered(
//   category: string,
//   selected: Record<string, string[]>
// ): Promise<Product[]> {
//   const res = await fetch(
//     `/api/products?category=${encodeURIComponent(category)}&filters=${encodeURIComponent(
//       JSON.stringify(selected)
//     )}`
//   );
//   if (!res.ok) throw new Error("API error");
//   const data = await res.json();
//   return data.products ?? [];
// }

// export async function getFiltersForCategory(category: string): Promise<Filter[]> {
//   const res = await fetch(`/api/products/filters?category=${encodeURIComponent(category)}`);
//   if (!res.ok) throw new Error("API error");
//   const data = await res.json();
//   return data.filters ?? [];
// }

// /* -------------------------------------------------------------------------- */
// /* 🧠 Directus — pobieranie pojedynczego produktu                            */
// /* -------------------------------------------------------------------------- */

// function normalizeFileId(v: unknown): string | null {
//   if (typeof v === "string" && v.trim()) return v.trim();
//   if (v && typeof v === "object" && typeof (v as any).id === "string" && (v as any).id.trim())
//     return String((v as any).id).trim();
//   return null;
// }

// /**
//  * 🔹 Pobranie pojedynczego produktu po slugu
//  * ✅ Kategorię do filtrów/linków bierzemy z `primarycategory`
//  * ✅ Type: pobieramy M2A razem z `type.collection` i `type.item.*`
//  * ✅ Images: normalizujemy do directus_files_id:string dla slidera
//  */
// export async function getProductBySlug(slug: string): Promise<Product | null> {
//   try {
//     const items = (await directus.request(
//       readItems("products", {
//         filter: { slug: { _eq: slug } },
//         limit: 1,
//         fields: [
//           "id",
//           "model",
//           "slug",
//           "price",
//           "description",
//           "seo_title",
//           "seo_description",
//           "short_description",

//           "primarycategory",

//           "main_image.*",

//           "brand.id",
//           "brand.name",
//           "brand.logo",

//           // ✅ images
//           "images.id",
//           "images.directus_files_id.*",

//           // ✅ type (M2A): MUSI być collection + item.*
//           "type.collection",
//           "type.item.*",

//           "components.collection",
//           "components.item.*",

//           "files.directus_files_id.*",
//         ],
//         deep: {
//           images: { directus_files_id: { _fields: ["id"] } },
//           files: { directus_files_id: { _fields: ["id"] } },

//           // ✅ dopnij też deep dla M2A (bezpiecznie)
//           type: {
//             item: { _fields: ["*"] },
//           },
//         },
//       })
//     )) as any[];

//     if (!Array.isArray(items) || items.length === 0) return null;

//     const product = items[0] as any;

//     // ✅ 1) kategoria: preferuj primarycategory
//     const collectionName =
//       (typeof product.primarycategory === "string" && product.primarycategory.trim()) || null;

//     // ✅ 2) mapowanie collection -> slug (display_template)
//     const categorySlug = collectionName ? await mapCollectionToSlug(collectionName) : null;

//     // ✅ 3) normalize images to [{directus_files_id:string}]
//     const normalizedImages = Array.isArray(product.images)
//       ? product.images
//           .map((img: any) => {
//             const id = normalizeFileId(img?.directus_files_id);
//             return id ? { directus_files_id: id } : null;
//           })
//           .filter(Boolean)
//       : [];

//     // ✅ 4) normalize type:
//     // oczekujemy M2A: [{ collection, item }]
//     // jeśli Directus zwróci coś innego (np. same ID), to NIE ZGADUJEMY kolekcji,
//     // bo to może być wiele kolekcji (Twoje payloady to sugerują).
//     let normalizedType: any[] = [];

//     if (Array.isArray(product.type) && product.type.length > 0) {
//       const first = product.type[0];

//       const looksLikeM2A =
//         first &&
//         typeof first === "object" &&
//         ("collection" in first || "item" in first);

//       if (looksLikeM2A) {
//         normalizedType = product.type
//           .map((t: any) => {
//             const coll = typeof t?.collection === "string" ? t.collection : undefined;
//             const item = t?.item && typeof t.item === "object" ? t.item : undefined;

//             // zostaw tylko sensowne wpisy
//             if (!coll && !item) return null;
//             return { collection: coll, item };
//           })
//           .filter(Boolean);
//       } else {
//         // fallback: zostaw pusto, bo bez collection nie da się bezpiecznie powiązać
//         normalizedType = [];
//       }
//     }

//     return {
//       ...product,
//       images: normalizedImages,
//       type: normalizedType,
//       category: categorySlug ? { slug: categorySlug } : undefined,
//       primarycategory: collectionName,
//     } as Product;
//   } catch (err) {
//     console.error("❌ getProductBySlug error:", err);
//     return null;
//   }
// }

// /* -------------------------------------------------------------------------- */
// /* 🏷️ Produkty po marce                                                      */
// /* -------------------------------------------------------------------------- */

// export async function getProductsByBrandId(brandId: string): Promise<Product[]> {
//   const items = await directus.request(
//     readItems("products", {
//       filter: { brand: { _eq: brandId } },
//       fields: ["id", "model", "slug", "main_image.*", "brand.id", "brand.name"],
//       limit: 100,
//     })
//   );
//   return (Array.isArray(items) ? items : []) as Product[];
// }
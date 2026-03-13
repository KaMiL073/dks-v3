import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readFields } from "@directus/sdk";
import { resolveCategoryToCollection } from "@/lib/directusCategoryMapper";
import { categoriesMap } from "@/lib/categories";

type Choice = { text?: unknown; value?: unknown };
type DirectusField = {
  field?: string;
  collection?: string;
  meta?: {
    interface?: string;
    hidden?: boolean;
    options?: { choices?: Choice[] };
    display?: string;
    translations?: Array<{ translation?: string }>;
  };
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function getField(obj: Record<string, unknown>, key: string): unknown {
  return obj[key];
}

function isAllowedCollection(collection: string) {
  if (!collection) return false;
  if (collection.startsWith("directus_")) return false;
  return true;
}

function normalizeText(v: unknown) {
  if (v == null) return "";
  return String(v).trim();
}

function isUsefulField(f: DirectusField) {
  const field = String(f?.field ?? "").trim();
  if (!field) return false;

  const banned = new Set([
    "id",
    "status",
    "sort",
    "user_created",
    "user_updated",
    "date_created",
    "date_updated",
    "primarycategory",
  ]);
  if (banned.has(field)) return false;

  if (f?.meta?.hidden) return false;

  const iface = f?.meta?.interface;
  const allowedIfaces = new Set(["select-dropdown", "multi-select-dropdown"]);
  if (!allowedIfaces.has(String(iface ?? ""))) return false;

  const choices = f?.meta?.options?.choices;
  if (!Array.isArray(choices) || choices.length === 0) return false;

  const normalized = choices.map((c) => normalizeText(c?.text)).filter(Boolean);
  if (normalized.length > 0 && normalized.every((t) => t.startsWith("$t:"))) return false;

  return true;
}

/**
 * Wrappery typów – bez any, bez "request does not exist", bez "never".
 */
const client = directus as unknown as { request: (op: unknown) => Promise<unknown> };
const readFieldsUnsafe = readFields as unknown as (arg: unknown) => unknown;

async function fetchFieldsForCollection(collection: string): Promise<DirectusField[]> {
  // 1) readFields(collection)
  try {
    const res: unknown = await client.request(readFieldsUnsafe(collection));

    if (Array.isArray(res)) {
      const hasManyCollections =
        res.some((x) => isRecord(x) && typeof x.collection === "string" && x.collection !== collection) ||
        (res.length > 200 &&
          res.some((x) => isRecord(x) && typeof x.collection === "string" && x.collection.length > 0));

      if (!hasManyCollections) return res as DirectusField[];
    }
  } catch {
    // ignore -> fallback
  }

  // 2) readFields({ collection })
  try {
    const res: unknown = await client.request(readFieldsUnsafe({ collection }));
    if (Array.isArray(res)) return res as DirectusField[];
  } catch {
    // ignore -> fallback
  }

  // 3) REST fallback: /fields/{collection}
  type MinimalRequest = { method: "GET"; path: string };
  const res: unknown = await client.request({
    method: "GET",
    path: `/fields/${collection}`,
  } satisfies MinimalRequest);

  if (Array.isArray(res)) return res as DirectusField[];
  if (isRecord(res) && Array.isArray(res.data)) return res.data as DirectusField[];

  return [];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categorySlug = searchParams.get("category");
    const subcategorySlug = searchParams.get("subcategory");

    if (!categorySlug) {
      return NextResponse.json({ error: "Missing category" }, { status: 400 });
    }

    const targetSlug = subcategorySlug || categorySlug;

    let collection =
      (await resolveCategoryToCollection(targetSlug).catch(() => targetSlug)) || targetSlug;

    // fallback po lokalnej mapie (bez any)
    const catMap = categoriesMap as unknown as Record<string, string>;
    if (collection === targetSlug && typeof catMap[targetSlug] === "string") {
      collection = catMap[targetSlug];
    }

    if (!isAllowedCollection(collection)) {
      return NextResponse.json(
        { error: "Invalid collection resolved", collection, slug: targetSlug },
        { status: 400 }
      );
    }

    const fields = await fetchFieldsForCollection(collection);

    const onlyThisCollection = fields.filter((f) => {
      const c = String(f?.collection ?? "").trim();
      return !c || c === collection;
    });

    const rawFilters = onlyThisCollection
      .filter(isUsefulField)
      .map((f) => {
        const choices: Choice[] = f.meta?.options?.choices ?? [];

        const options = choices
          .map((c) => ({
            text: normalizeText(c?.text),
            value: normalizeText(c?.value),
          }))
          .filter((o) => o.text && o.value);

        const label =
          normalizeText(f.meta?.display) ||
          normalizeText(f.meta?.translations?.[0]?.translation) ||
          String(f.field);

        return { field: String(f.field), label, options };
      })
      .filter((x) => x.options.length > 0);

    const deduped = Array.from(new Map(rawFilters.map((x) => [x.field, x] as const)).values());

    return NextResponse.json({
      filters: deduped,
      collection,
      slug: targetSlug,
    });
  } catch (err: unknown) {
    const message = isRecord(err) && typeof err.message === "string" ? err.message : String(err);

    const directusErrors =
      isRecord(err) && Array.isArray(getField(err, "errors")) ? getField(err, "errors") : undefined;

    console.error("[/api/products/filters] ERROR:", message, directusErrors ?? "");

    return NextResponse.json(
      {
        error: "Filters endpoint failed",
        message,
        directusErrors,
      },
      { status: 502 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { directus } from "@/lib/directus";
// import { readFields } from "@directus/sdk";
// import { resolveCategoryToCollection } from "@/lib/directusCategoryMapper";
// import { categoriesMap } from "@/lib/categories";

// type Choice = { text?: unknown; value?: unknown };
// type DirectusField = {
//   field?: string;
//   collection?: string;
//   meta?: {
//     interface?: string;
//     hidden?: boolean;
//     options?: { choices?: Choice[] };
//     display?: string;
//     translations?: Array<{ translation?: string }>;
//   };
// };

// function isAllowedCollection(collection: string) {
//   if (!collection) return false;
//   if (collection.startsWith("directus_")) return false; // core
//   return true;
// }

// function normalizeText(v: unknown) {
//   if (v == null) return "";
//   // czasem Directus trzyma text jako obiekt (tłumaczenia) – tu tniemy do stringa
//   return String(v).trim();
// }

// function isUsefulField(f: DirectusField) {
//   const field = String(f?.field ?? "").trim();
//   if (!field) return false;

//   // meta/system – nie chcemy w filtrach
//   const banned = new Set([
//     "id",
//     "status",
//     "sort",
//     "user_created",
//     "user_updated",
//     "date_created",
//     "date_updated",
//     "primarycategory",
//   ]);
//   if (banned.has(field)) return false;

//   // ukryte w Directus -> nie pokazuj
//   if (f?.meta?.hidden) return false;

//   const iface = f?.meta?.interface;
//   const allowedIfaces = new Set(["select-dropdown", "multi-select-dropdown"]);
//   if (!allowedIfaces.has(String(iface ?? ""))) return false;

//   const choices = f?.meta?.options?.choices;
//   if (!Array.isArray(choices) || choices.length === 0) return false;

//   // jeśli to typowe directusowe $t:... (np. status), to wyrzuć
//   const normalized = choices
//     .map((c) => normalizeText(c?.text))
//     .filter(Boolean);

//   if (normalized.length > 0 && normalized.every((t) => t.startsWith("$t:"))) return false;

//   return true;
// }

// /**
//  * Najważniejsze: pobierz pola WYŁĄCZNIE dla jednej kolekcji.
//  * W zależności od wersji @directus/sdk, readFields() ma różne sygnatury,
//  * więc robimy bezpieczne fallbacki + walidację wyniku.
//  */
// async function fetchFieldsForCollection(collection: string): Promise<DirectusField[]> {
//   // 1) Najczęstsze w SDK: readFields(collection)
//   try {
//     const res = (await directus.request(readFields(collection as any))) as any;
//     if (Array.isArray(res)) {
//       // jeśli SDK zwróciło “global listę” pól (różne kolekcje),
//       // to wywalamy i przechodzimy do fallbacku
//       const hasManyCollections =
//         res.some((x) => x?.collection && x.collection !== collection) ||
//         (res.length > 200 && res.some((x) => String(x?.collection ?? "").length > 0));

//       if (!hasManyCollections) return res as DirectusField[];
//     }
//   } catch {
//     // ignore -> fallback
//   }

//   // 2) Inna sygnatura: readFields({ collection })
//   try {
//     const res = (await directus.request(readFields({ collection } as any))) as any;
//     if (Array.isArray(res)) return res as DirectusField[];
//   } catch {
//     // ignore -> fallback
//   }

//   // 3) Ostateczny fallback: “surowe” REST /fields/{collection}
//   // directus.request potrafi przyjąć obiekt requesta zależnie od implementacji w Twoim "@/lib/directus"
//   const res = (await (directus as any).request({
//     method: "GET",
//     path: `/fields/${collection}`,
//   })) as any;

//   if (Array.isArray(res)) return res as DirectusField[];
//   if (Array.isArray(res?.data)) return res.data as DirectusField[];

//   return [];
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const categorySlug = searchParams.get("category");
//     const subcategorySlug = searchParams.get("subcategory");

//     if (!categorySlug) {
//       return NextResponse.json({ error: "Missing category" }, { status: 400 });
//     }

//     // deterministycznie: subcategory > category
//     const targetSlug = subcategorySlug || categorySlug;

//     // slug -> kolekcja
//     let collection =
//       (await resolveCategoryToCollection(targetSlug).catch(() => targetSlug)) || targetSlug;

//     // fallback po lokalnej mapie
//     if (collection === targetSlug && (categoriesMap as any)?.[targetSlug]) {
//       collection = (categoriesMap as any)[targetSlug];
//     }

//     if (!isAllowedCollection(collection)) {
//       return NextResponse.json(
//         { error: "Invalid collection resolved", collection, slug: targetSlug },
//         { status: 400 }
//       );
//     }

//     const fields = await fetchFieldsForCollection(collection);

//     // twardy filtr: jeśli w polach jest collection, to MA być tylko ta kolekcja
//     const onlyThisCollection = fields.filter((f: any) => {
//       const c = String(f?.collection ?? "").trim();
//       return !c || c === collection;
//     });

//     const rawFilters = onlyThisCollection
//       .filter(isUsefulField)
//       .map((f: any) => {
//         const choices = (f.meta?.options?.choices || []) as Choice[];

//         const options = choices
//           .map((c) => ({
//             text: normalizeText(c?.text),
//             value: normalizeText(c?.value),
//           }))
//           .filter((o) => o.text && o.value);

//         // label: preferuj display -> translation -> field
//         const label =
//           normalizeText(f.meta?.display) ||
//           normalizeText(f.meta?.translations?.[0]?.translation) ||
//           String(f.field);

//         return { field: String(f.field), label, options };
//       })
//       .filter((x) => x.options.length > 0);

//     // deduplikacja po field
//     const deduped = Array.from(new Map(rawFilters.map((x) => [x.field, x] as const)).values());

//     return NextResponse.json({
//       filters: deduped,
//       collection,
//       slug: targetSlug,
//     });
//   } catch (err: any) {
//     console.error("[/api/products/filters] ERROR:", err?.message || err, err?.errors || "");
//     return NextResponse.json(
//       {
//         error: "Filters endpoint failed",
//         message: err?.message || String(err),
//         directusErrors: err?.errors || undefined,
//       },
//       { status: 502 }
//     );
//   }
// }
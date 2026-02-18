import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import {
  mapSlugToCollection,
  getDisplayTemplateForCollection,
} from "@/lib/directusCategoryMapper";
import { readItems, readFields } from "@directus/sdk";

type TypeItem = Record<string, unknown>;
type TypeRelation = { collection: string; item: TypeItem };

type Product = {
  id: number;
  status?: string;
  primarycategory?: string | null;
  type?: TypeRelation[] | TypeRelation;
};

type DirectusFieldMeta = {
  field: string;
  meta?: {
    translations?: { language: string; translation: string }[] | null;
    options?: { choices?: { text: string; value: string }[] } | null;
  };
};

type FieldUiMeta = {
  label?: string;
  choiceTextByValue: Map<string, string>;
};

const fieldMetaCache = new Map<string, Map<string, FieldUiMeta>>(); // collection -> (field -> meta)

function asArray<T>(v: T | T[] | undefined | null): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function pickPlLabel(
  translations?: { language: string; translation: string }[] | null
) {
  if (!translations?.length) return undefined;

  const lower = (s: string) => s.toLowerCase();
  return (
    translations.find((t) => lower(t.language) === "pl-pl")?.translation ??
    translations.find((t) => lower(t.language).startsWith("pl"))?.translation
  );
}

async function getCollectionFieldUiMeta(collection: string) {
  const cached = fieldMetaCache.get(collection);
  if (cached) return cached;

  const fields = (await directus.request(
    readFields(collection)
  )) as DirectusFieldMeta[];

  const map = new Map<string, FieldUiMeta>();

  for (const f of fields) {
    const label = pickPlLabel(f.meta?.translations ?? null);

    const choiceTextByValue = new Map<string, string>();
    const choices = f.meta?.options?.choices ?? [];
    for (const c of choices) {
      choiceTextByValue.set(String(c.value), String(c.text));
    }

    map.set(f.field, { label, choiceTextByValue });
  }

  fieldMetaCache.set(collection, map);
  return map;
}

function humanizeField(field: string) {
  // fallbacki, gdy nie ma tłumaczeń w Directus
  const map: Record<string, string> = {
    primarycategory: "Kategoria",
    brand: "Marka",
    state: "Stan",
  };
  if (map[field]) return map[field];

  return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

function isSkippableField(key: string) {
  return (
    key === "id" ||
    key === "status" ||
    key === "sort" ||
    key === "user_created" ||
    key === "date_created" ||
    key === "user_updated" ||
    key === "date_updated"
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const categorySlug = searchParams.get("category");
    if (!categorySlug) {
      return NextResponse.json(
        { error: "Missing category parameter" },
        { status: 400 }
      );
    }

    // slug -> kolekcja (np. rozwiazania-dla-biura -> office_solutions)
    const collection = await mapSlugToCollection(categorySlug);
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown category slug: ${categorySlug}` },
        { status: 404 }
      );
    }

    // ✅ meta pól z Directusa: labelki + choices (tłumaczenia)
    const uiMeta = await getCollectionFieldUiMeta(collection);

    // produkty z tej kategorii
    const products = (await directus.request(
      readItems("products", {
        fields: ["id", "status", "primarycategory", "type.collection", "type.item.*"],
        filter: {
          status: { _eq: "published" },
          _and: [{ type: { collection: { _in: [collection] } } }],
        },
        limit: 300,
      })
    )) as Product[];

    // agregacja wartości
    const valuesByField = new Map<string, Set<string>>();

    // ✅ 1) ROOT: primarycategory
    for (const p of products) {
      const v =
        typeof p.primarycategory === "string" ? p.primarycategory.trim() : "";
      if (!v) continue;

      if (!valuesByField.has("primarycategory"))
        valuesByField.set("primarycategory", new Set());
      valuesByField.get("primarycategory")!.add(v);
    }

    // ✅ 2) M2A: type.item.*
    for (const p of products) {
      const typeArray = asArray(p.type);
      for (const t of typeArray) {
        const item = (t?.item ?? {}) as Record<string, unknown>;
        for (const [k, raw] of Object.entries(item)) {
          if (isSkippableField(k)) continue;
          if (raw === null || raw === undefined) continue;

          const v = String(raw).trim();
          if (!v) continue;

          if (!valuesByField.has(k)) valuesByField.set(k, new Set());
          valuesByField.get(k)!.add(v);
        }
      }
    }

    // budujemy wynik
    const filters = await Promise.all(
      Array.from(valuesByField.entries())
        .filter(([, set]) => set.size > 0)
        .map(async ([field, set]) => {
          const sorted = Array.from(set).sort((a, b) => a.localeCompare(b, "pl"));

          // label: z Directus translations (fallback humanize)
          const metaForField = uiMeta.get(field);
          const label = metaForField?.label ?? humanizeField(field);

          // primarycategory -> text = slug display_template (przyjazny URL)
          if (field === "primarycategory") {
            const options = await Promise.all(
              sorted.map(async (value) => {
                const slug = await getDisplayTemplateForCollection(value).catch(
                  () => value
                );
                return { value, text: slug || value };
              })
            );
            return { field, label, options };
          }

          // pozostałe pola -> options.text z choices (Directus) jeśli istnieje
          const options = sorted.map((value) => {
            const text = metaForField?.choiceTextByValue.get(String(value)) ?? value;
            return { value, text };
          });

          return { field, label, options };
        })
    );

    // stabilna kolejność: primarycategory na początku, reszta alfabetycznie po labelu
    filters.sort((a, b) => {
      if (a.field === "primarycategory") return -1;
      if (b.field === "primarycategory") return 1;
      return a.label.localeCompare(b.label, "pl");
    });

    return NextResponse.json({ filters });
  } catch (error) {
    console.error("❌ Błąd w /api/products/filters:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}

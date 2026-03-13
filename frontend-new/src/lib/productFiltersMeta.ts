import "server-only";

import { readFieldsByCollection } from "@directus/sdk";
import { directus } from "@/lib/directus";

export interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

interface ProductTypeItem {
  collection?: string;
  item?: Record<string, unknown>;
}

interface ProductLike {
  type?: ProductTypeItem[] | ProductTypeItem | null;
}

interface DirectusFieldMetaTranslation {
  language?: string;
  translation?: string;
}

interface DirectusFieldChoice {
  text?: string;
  value?: string;
}

interface DirectusFieldMeta {
  hidden?: boolean;
  translations?: DirectusFieldMetaTranslation[] | null;
  options?: {
    choices?: DirectusFieldChoice[] | null;
  } | null;
}

interface DirectusFieldRow {
  field?: string;
  meta?: DirectusFieldMeta | null;
}

type DirectusRequestArg = Parameters<typeof directus.request>[0];

function pickString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_\s-]+/g, "");
}

function getPolishTranslation(meta?: DirectusFieldMeta | null): string | undefined {
  const translations = Array.isArray(meta?.translations) ? meta.translations : [];

  const polish = translations.find((entry) => {
    const lang = normalize(entry?.language);
    return lang === "plpl" || lang === "pl";
  });

  if (polish?.translation?.trim()) {
    return polish.translation.trim();
  }

  const firstAvailable = translations.find(
    (entry) => typeof entry?.translation === "string" && entry.translation.trim()
  );

  if (firstAvailable?.translation?.trim()) {
    return firstAvailable.translation.trim();
  }

  return undefined;
}

function isIgnoredField(field: string): boolean {
  return new Set([
    "id",
    "status",
    "sort",
    "user_created",
    "date_created",
    "user_updated",
    "date_updated",
    "category",
    "devices",
    "collection",
  ]).has(field);
}

async function fetchFieldsForCollection(collection: string): Promise<FilterField[]> {
  const response = await directus.request(
    readFieldsByCollection(collection) as DirectusRequestArg
  );

  const rows = Array.isArray(response) ? (response as DirectusFieldRow[]) : [];

  return rows
    .map((row): FilterField | null => {
      const field = pickString(row.field);
      if (!field || isIgnoredField(field)) return null;
      if (row.meta?.hidden) return null;

      const label = getPolishTranslation(row.meta) ?? field;

      const rawChoices = Array.isArray(row.meta?.options?.choices)
        ? row.meta.options.choices
        : [];

      const options = rawChoices
        .map((choice) => {
          const text = pickString(choice?.text);
          const value = pickString(choice?.value);

          if (!text || !value) return null;
          return { text, value };
        })
        .filter((option): option is { text: string; value: string } => option !== null);

      return {
        field,
        label,
        ...(options.length ? { options } : {}),
      };
    })
    .filter((filter): filter is FilterField => filter !== null);
}

function scoreCollectionAgainstItem(
  filters: FilterField[],
  item: Record<string, unknown>
): number {
  const itemKeys = Object.keys(item).map((key) => normalize(key));

  return filters.reduce((acc, filter) => {
    return acc + (itemKeys.includes(normalize(filter.field)) ? 1 : 0);
  }, 0);
}

function collectionPriority(collection: string): number {
  const priorities: Record<string, number> = {
    printers_and_multifunction_devices: 100,
    laptops: 90,
    wide_format: 80,
    supplies: 70,
    office_solutions: 10,
  };

  return priorities[collection] ?? 0;
}

export async function getFiltersMeta(product: ProductLike): Promise<FilterField[]> {
  const rawType = product.type;

  const typeEntries = Array.isArray(rawType)
    ? rawType
    : rawType
      ? [rawType]
      : [];

  const candidates = typeEntries
    .map((entry) => {
      const collection = pickString(entry.collection);
      const item =
        entry.item && typeof entry.item === "object"
          ? (entry.item as Record<string, unknown>)
          : null;

      if (!collection || !item) return null;

      return { collection, item };
    })
    .filter(
      (entry): entry is { collection: string; item: Record<string, unknown> } => entry !== null
    );

  if (candidates.length === 0) {
    return [];
  }

  let bestFilters: FilterField[] = [];
  let bestScore = -1;
  let bestPriority = -1;

  for (const candidate of candidates) {
    try {
      const allFilters = await fetchFieldsForCollection(candidate.collection);

      const matchingFilters = allFilters.filter((filter) =>
        Object.keys(candidate.item).some((key) => normalize(key) === normalize(filter.field))
      );

      const score = scoreCollectionAgainstItem(matchingFilters, candidate.item);
      const priority = collectionPriority(candidate.collection);

      const shouldReplace =
        score > bestScore || (score === bestScore && priority > bestPriority);

      if (shouldReplace) {
        bestScore = score;
        bestPriority = priority;
        bestFilters = matchingFilters;
      }
    } catch {
      // pomijamy kolekcję, jeśli Directus nie zwróci pól
    }
  }

  return bestFilters;
}
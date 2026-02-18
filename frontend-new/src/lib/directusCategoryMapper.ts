import { directus } from "@/lib/directus";
import { readCollections, Collection } from "@directus/sdk";

/** Typ metadanych kolekcji w Directusie */
interface DirectusCollectionMeta {
  display_template?: string;
  icon?: string;
  hidden?: boolean;
  note?: string;
}

/** Typ kolekcji Directusa */
type DirectusCollection = Collection<DirectusCollectionMeta>;

/** Cache dla kolekcji */
let cachedCollections: DirectusCollection[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 1 minuta

/**
 * 📦 Pobiera listę kolekcji z Directusa z cachingiem
 */
export async function getAllCollections(): Promise<DirectusCollection[]> {
  const now = Date.now();

  // 🕒 użyj cache, jeśli nie minął TTL
  if (cachedCollections && now - lastFetchTime < CACHE_TTL) {
    return cachedCollections;
  }

  const collections = (await directus.request(readCollections())) as DirectusCollection[];

  cachedCollections = collections;
  lastFetchTime = now;

  return collections;
}

/**
 * 🔀 Mapowanie slug → kolekcja (dla kategorii i subkategorii)
 * Szuka po `meta.display_template` lub po nazwie kolekcji
 */
export async function mapSlugToCollection(slug: string): Promise<string | null> {
  const collections = await getAllCollections();
  const normalizedSlug = slug.toLowerCase().trim();

  // 🔹 Szukamy kolekcji po display_template
  const found = collections.find((col) => {
    const display = col.meta?.display_template?.toLowerCase().trim();
    return display === normalizedSlug;
  });

  if (found) {
    // console.log(`✅ [DirectusMapper] Zmapowano slug '${slug}' → '${found.collection}'`);
    return found.collection;
  }

  // 🔹 Szukamy po nazwie kolekcji
  const byName = collections.find(
    (col) => col.collection.toLowerCase().trim() === normalizedSlug
  );

  if (byName) {
    // console.log(`✅ [DirectusMapper] Zmapowano slug '${slug}' → '${byName.collection}' (po nazwie)`);
    return byName.collection;
  }

  console.warn(`⚠️ [DirectusMapper] Nie znaleziono kolekcji dla slug: '${slug}'`);
  return null;
}

export async function mapCollectionToSlug(
  collection: string
): Promise<string | null> {
  const collections = await getAllCollections();
  const found = collections.find(
    (col) =>
      col.collection.toLowerCase().trim() === collection.toLowerCase().trim()
  );

  return found?.meta?.display_template ?? null;
}

/**
 * 🔧 Helper: pobiera display_template (czyli slug kategorii)
 * np. "office_solutions" → "rozwiazania-dla-biura"
 */
export async function getDisplayTemplateForCollection(
  collection: string
): Promise<string> {
  const slug = await mapCollectionToSlug(collection);
  return slug ?? collection;
}

export async function resolveCategoryToCollection(slug: string): Promise<string> {
  const collection = await mapSlugToCollection(slug);
  if (!collection) {
    console.warn(`⚠️ [resolveCategoryToCollection] Nie znaleziono kolekcji dla slug: ${slug}`);
    return slug; // fallback
  }
  return collection;
}
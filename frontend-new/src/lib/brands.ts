// src/lib/brands.ts
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export interface Brand {
  id: string;
  name: string;
  slug?: string | null;
  logo?: string | null;
  description?: string | null;
  seo_description?: string | null;
}

/** Pobierz markę po slugu (priorytet) lub nazwie (fallback) */
export async function getBrandBySlugOrName(slugOrName: string): Promise<Brand | null> {
  // 1) spróbuj po slugu (masz już pole `slug` w brands i 200 w logach)
  try {
    const bySlug = await directus.request(
      readItems("brands", {
        filter: { slug: { _eq: slugOrName } },
        limit: 1,
        fields: ["id", "name", "slug", "logo", "description", "seo_description"],
      })
    );
    if (Array.isArray(bySlug) && bySlug.length > 0) return bySlug[0] as Brand;
  } catch (e) {
    console.warn("⚠ getBrandBySlugOrName: slug zapytanie nieudane -> fallback po name", e);
  }

  // 2) fallback po name (dokładne dopasowanie – pole typu "string" nie wspiera `_ilike`)
  try {
    const byName = await directus.request(
      readItems("brands", {
        filter: { name: { _eq: slugOrName } },
        limit: 1,
        fields: ["id", "name", "slug", "logo", "description", "seo_description"],
      })
    );
    if (Array.isArray(byName) && byName.length > 0) return byName[0] as Brand;
  } catch (e) {
    console.warn("⚠ getBrandBySlugOrName: name zapytanie nieudane", e);
  }

  console.warn("⚠ Brak marki dla:", slugOrName);
  return null;
}
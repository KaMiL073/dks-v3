import { directus } from "./directus";
import { readItems } from "@directus/sdk";

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  sort: number;
  seo_title?: string | null;
  seo_description?: string | null;
}

export async function getCategories(): Promise<BlogCategory[]> {
  try {
    return await directus.request(
      readItems("categories", {
        fields: ["id", "slug", "name", "sort", "seo_title", "seo_description"],
        sort: ["sort"],
        limit: -1,
      })
    );
  } catch (err) {
    console.error("🔴 Błąd pobierania kategorii:", err);
    return [];
  }
}
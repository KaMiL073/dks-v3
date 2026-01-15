// frontend-new/src/lib/getCategories.ts
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export type Category = {
  id: string | number;
  slug: string;
  name: string;
  sort: number | null;
  seo_title: string | null;
  seo_description: string | null;
};

export async function getCategories(): Promise<Category[]> {
  const items = await directus.request(
    readItems("categories", {
      fields: ["id", "slug", "name", "sort", "seo_title", "seo_description"],
      sort: ["sort"],
      limit: -1,
    })
  );

  return items as Category[];
}
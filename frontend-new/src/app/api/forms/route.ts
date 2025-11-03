import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

export async function getProductsByCategory(category: string) {
  try {
    return await directus.request(
      readItems("products", {
        fields: ["id", "model", "slug", "price", "main_image.id", "brand.id", "brand.name"],
        filter: {
          type: {
            _some: {
              collection: { _eq: category }
            }
          }
        },
        limit: 100,
      })
    );
  } catch (error) {
    console.error("❌ getProductsByCategory error:", error);
    return [];
  }
}

export async function getFiltersForCategory(collection: string) {
  try {
    if (!collection) return [];
    return await directus.request(
      readItems(collection, {
        fields: ["*"],
        limit: 50,
      })
    );
  } catch (error) {
    console.error("❌ getFiltersForCategory error:", error);
    return [];
  }
}
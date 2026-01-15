import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

// 🔹 Mapowanie slugów kategorii na kolekcje w Directusie
const categoryMap: Record<string, string> = {
  "rozwiazania-dla-biura": "office_solutions",
  "drukarki": "printers",
  "urzadzenia-wielofunkcyjne": "multifunction_devices",
  "oprogramowanie-biuro": "office_software",
  "oprogramowanie-druk": "printing_software",
  "duzy-format": "large_format_solutions",
  "termowizja": "thermal_imagers",
  "materialy-eksploatacyjne": "consumables",
  "laptopy": "laptops",
  "komputery": "computers",
  "tablice-interaktywne": "multiboards",
};

export async function getProductsByCategory(category: string) {
  try {
    const collection = categoryMap[category];
    if (!collection) {
      console.warn(`❌ Nieznana kategoria: ${category}`);
      return [];
    }

    const products = await directus.request(
      readItems("products", {
        fields: [
          "id",
          "model",
          "slug",
          "status",
          "price",
          "main_image.id",
          "brand.id",
          "brand.name",
          "type.collection",
          "type.item",
        ],
        filter: {
          _and: [
            { status: { _eq: "published" } },
            {
              type: {
                _some: {
                  collection: { _eq: collection },
                },
              },
            },
          ],
        },
        limit: -1,
      })
    );

    console.log(`✅ [${category}] znaleziono ${products.length} produktów`);
    return products;
  } catch (error) {
    console.error("❌ getProductsByCategory error:", error);
    return [];
  }
}
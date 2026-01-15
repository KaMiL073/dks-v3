import { directus } from "./directus";
import { readItems } from "@directus/sdk";

/* ============================================================
   🔥 Typy
   ============================================================ */
export interface Certification {
  id: string;
  name: string;
  image: string | null;     // pełny URL jak w newsach
  order: number | null;
}

/* ============================================================
   🔥 Helper: URL do obrazu
   ============================================================ */
function imageUrl(id: string | null) {
  return id ? `https://dks.pl/backend/assets/${id}?imwidth=1920` : null;
}

/* ============================================================
   🔥 Pobieranie listy certyfikatów
   ============================================================ */
export async function getCertifications(
  attributes: Record<string, unknown> = {}
): Promise<Certification[]> {
  try {
    const data = await directus.request(
      readItems("certifications", {
        fields: ["id", "name", "image", "order", "status"],
        filter: { status: { _eq: "published" } },
        // sort po order rosnąco; null może mieszać — dlatego i tak dosortujemy lokalnie
        sort: ["order", "name"],
        limit: 200,
        ...attributes,
      })
    );

    const sorted = (data as any[]).slice().sort((a, b) => {
      const ao = a.order ?? Number.POSITIVE_INFINITY;
      const bo = b.order ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;
      return String(a.name ?? "").localeCompare(String(b.name ?? ""), "pl");
    });

    return sorted.map((item: any) => ({
      id: String(item.id),
      name: item.name,
      order: item.order ?? null,
      image: imageUrl(item.image ?? null),
    }));
  } catch (err) {
    console.error("❌ Błąd pobierania certyfikatów:", err);
    return [];
  }
}
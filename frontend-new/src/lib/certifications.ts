import { directus } from "./directus";
import { readItems } from "@directus/sdk";

/* ============================================================
   🔥 Typy
   ============================================================ */
export interface Certification {
  id: string;
  name: string;
  image: string | null; // pełny URL jak w newsach
  order: number | null;
}

type CertificationRow = {
  id?: unknown;
  name?: unknown;
  image?: unknown;
  order?: unknown;
  status?: unknown;
  [key: string]: unknown;
};

/* ============================================================
   🔥 Helpery
   ============================================================ */
function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function pickString(v: unknown): string | undefined {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return undefined;
}

function pickNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return undefined;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("certifications", {
        fields: ["id", "name", "image", "order", "status"],
        filter: { status: { _eq: "published" } },
        sort: ["order", "name"],
        limit: 200,
        ...attributes,
      })
    );

    // Directus zwykle zwraca tablicę rekordów, ale robimy bezpiecznie
    const rows: CertificationRow[] = Array.isArray(data)
      ? (data as CertificationRow[])
      : isRecord(data) && Array.isArray((data as Record<string, unknown>).data)
        ? ((data as Record<string, unknown>).data as CertificationRow[])
        : [];

    const sorted = rows.slice().sort((a, b) => {
      const ao = pickNumber(a.order) ?? Number.POSITIVE_INFINITY;
      const bo = pickNumber(b.order) ?? Number.POSITIVE_INFINITY;
      if (ao !== bo) return ao - bo;

      const an = pickString(a.name) ?? "";
      const bn = pickString(b.name) ?? "";
      return an.localeCompare(bn, "pl");
    });

    return sorted.map((item) => {
      const id = pickString(item.id) ?? "";
      const name = pickString(item.name) ?? "";
      const img = pickString(item.image) ?? null;
      const order = pickNumber(item.order) ?? null;

      return {
        id,
        name,
        order,
        image: imageUrl(img),
      };
    });
  } catch (err: unknown) {
    console.error("❌ Błąd pobierania certyfikatów:", err);
    return [];
  }
}

// import { directus } from "./directus";
// import { readItems } from "@directus/sdk";

// /* ============================================================
//    🔥 Typy
//    ============================================================ */
// export interface Certification {
//   id: string;
//   name: string;
//   image: string | null;     // pełny URL jak w newsach
//   order: number | null;
// }

// /* ============================================================
//    🔥 Helper: URL do obrazu
//    ============================================================ */
// function imageUrl(id: string | null) {
//   return id ? `https://dks.pl/backend/assets/${id}?imwidth=1920` : null;
// }

// /* ============================================================
//    🔥 Pobieranie listy certyfikatów
//    ============================================================ */
// export async function getCertifications(
//   attributes: Record<string, unknown> = {}
// ): Promise<Certification[]> {
//   try {
//     const data = await directus.request(
//       readItems("certifications", {
//         fields: ["id", "name", "image", "order", "status"],
//         filter: { status: { _eq: "published" } },
//         // sort po order rosnąco; null może mieszać — dlatego i tak dosortujemy lokalnie
//         sort: ["order", "name"],
//         limit: 200,
//         ...attributes,
//       })
//     );

//     const sorted = (data as any[]).slice().sort((a, b) => {
//       const ao = a.order ?? Number.POSITIVE_INFINITY;
//       const bo = b.order ?? Number.POSITIVE_INFINITY;
//       if (ao !== bo) return ao - bo;
//       return String(a.name ?? "").localeCompare(String(b.name ?? ""), "pl");
//     });

//     return sorted.map((item: any) => ({
//       id: String(item.id),
//       name: item.name,
//       order: item.order ?? null,
//       image: imageUrl(item.image ?? null),
//     }));
//   } catch (err) {
//     console.error("❌ Błąd pobierania certyfikatów:", err);
//     return [];
//   }
// }
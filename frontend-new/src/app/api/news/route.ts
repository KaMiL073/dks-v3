// frontend-new/src/app/api/news/route.ts
import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readItems } from "@directus/sdk";

type NewsItemResponse = {
  id: string | number;
  title?: string;
  lead?: string;
  slug?: string;
  image?: unknown;
  date_created?: string;
  tags?: unknown;
  category?: {
    id?: string | number;
    slug?: string;
    name?: string;
  } | null;
};

export async function GET() {
  try {
    const operation: unknown = readItems("news" as never, {
      limit: 5,
      sort: ["-date_created"] as never,
      fields: [
        "id",
        "title",
        "lead",
        "slug",
        "image",
        "date_created",
        "tags",
        "category.id",
        "category.slug",
        "category.name",
      ] as never,
      filter: { status: { _eq: "published" } } as never,
    });

    // UWAGA: u Ciebie directus jest typowany tak, że TS nie widzi .request
    // więc robimy bezpieczne zawężenie typu tylko na potrzeby wywołania:
    const client = directus as unknown as { request: (op: unknown) => Promise<unknown> };
    const items = await client.request(operation);

    return NextResponse.json(
      { ok: true, items: Array.isArray(items) ? (items as NewsItemResponse[]) : [] },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ /api/news GET error:", error);
    return NextResponse.json(
      {
        ok: false,
        error: "Server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

// import { NextResponse } from "next/server";
// import { directus } from "../../../lib/directus";
// import { readItems } from "@directus/sdk";

// interface NewsItemResponse {
//   id: string;
//   title: string;
//   lead: string;
//   slug: string;
//   image: string | null;
// }

// export async function GET() {
//   try {
//     // Pobranie maks. 5 newsów
//     const items = await directus.request(
//       readItems<NewsItemResponse>("news", {
//         limit: 5,
//         sort: ["-date_created"],
//         fields: ["id", "title", "lead", "slug", "image"],
//       })
//     );

//     // Mapowanie danych i dodanie pełnego URL dla obrazów
//     const mapped = items.map((item) => ({
//       ...item,
//       image: item.image
//         ? `https://dks.pl/backend/assets/${item.image}?imwidth=1920`
//         : null,
//     }));

//     return NextResponse.json(mapped);
//   } catch (err) {
//     console.error("❌ Błąd pobierania newsów:", err);
//     return NextResponse.json({ error: "Błąd pobierania newsów" }, { status: 500 });
//   }
// }

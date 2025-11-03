import { NextResponse } from "next/server";
import { directus } from "../../../lib/directus";
import { readItems } from "@directus/sdk";

interface NewsItemResponse {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
}

export async function GET() {
  try {
    // Pobranie maks. 5 newsów
    const items = await directus.request(
      readItems<NewsItemResponse>("news", {
        limit: 5,
        sort: ["-date_created"],
        fields: ["id", "title", "lead", "slug", "image"],
      })
    );

    // Mapowanie danych i dodanie pełnego URL dla obrazów
    const mapped = items.map((item) => ({
      ...item,
      image: item.image
        ? `https://dks.pl/backend/assets/${item.image}?imwidth=1920`
        : null,
    }));

    return NextResponse.json(mapped);
  } catch (err) {
    console.error("❌ Błąd pobierania newsów:", err);
    return NextResponse.json({ error: "Błąd pobierania newsów" }, { status: 500 });
  }
}

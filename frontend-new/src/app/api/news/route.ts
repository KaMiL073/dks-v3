import { NextResponse } from "next/server";
import backend from "../../../../lib/directus";

interface NewsItemResponse {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
}

interface NewsApiResponse {
  data: NewsItemResponse[];
}

export async function GET() {
  try {
    const resp = await backend.get<NewsApiResponse>("/items/news", {
      params: { sort: "-date_created", limit: 5 },
    });

    const items = resp.data.data.map((item) => ({
      id: item.id,
      title: item.title,
      lead: item.lead,
      slug: item.slug,
      image: item.image
        ? `https://dks.pl/backend/assets/${item.image}?imwidth=1920`
        : null,
    }));

    return NextResponse.json(items);
  } catch (_err) {
    // eslint-disable-next-line no-console
    console.error("Błąd pobierania newsów:", _err);
    return NextResponse.json(
      { error: "Błąd pobierania newsów" },
      { status: 500 }
    );
  }
}
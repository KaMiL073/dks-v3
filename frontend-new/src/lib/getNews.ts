import backend from "../directus";

export interface News {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
}

interface NewsItemResponse {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
}

interface NewsResponse {
  data: NewsItemResponse[];
}

export default async function getNews(
  attributes: Record<string, unknown> = {}
): Promise<News[]> {
  try {
    const resp = await backend.get<NewsResponse>("/items/news", {
      params: {
        sort: "-date_created", // 🔥 najnowsze jako pierwsze
        ...attributes,
      },
    });
console.log('---------');

console.log(resp.data.data);
console.log('---------');

return resp.data.data.map((item) => ({
      id: item.id,
      title: item.title,
      lead: item.lead,
      slug: item.slug,
      image: item.image
        ? `https://dks.pl/backend/assets/${item.image}?imwidth=1920` // tymczasowo stare obrazki
        : null,
    }));
  } catch (err) {
    console.error("Błąd pobierania newsów:", err);
    return [];
  }
}
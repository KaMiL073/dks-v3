import { directus } from "./directus";
import { readItems } from "@directus/sdk";

/* ============================================================
   🔥 Typy
   ============================================================ */
export interface News {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
  date_created: string;
  tags?: string[];
  categorySlug: string | null;
  categoryName: string | null;
}

export interface SinglePost extends News {
  content: string;
}

export type PagedNews = {
  items: News[];
  total: number; // ile wszystkich pasujących
  page: number; // 1-based
  perPage: number;
  totalPages: number;
};

type NewsRow = {
  id?: unknown;
  title?: unknown;
  lead?: unknown;
  slug?: unknown;
  content?: unknown;
  image?: unknown;
  date_created?: unknown;
  tags?: unknown;
  category?: unknown;
  category_name?: unknown;
  [key: string]: unknown;
};

type CountRow = { count?: unknown };

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

function pickStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => pickString(x))
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

/* ============================================================
   🔥 Helper: URL do obrazu
   ============================================================ */
function imageUrl(id: string | null) {
  return id ? `https://dks.pl/backend/assets/${id}?imwidth=1920` : null;
}

/* ============================================================
   🔥 Mapowanie item -> News
   ============================================================ */
function mapNewsItem(row: NewsRow): News {
  const category = isRecord(row.category) ? row.category : undefined;

  return {
    id: pickString(row.id) ?? "",
    title: pickString(row.title) ?? "",
    lead: pickString(row.lead) ?? "",
    slug: pickString(row.slug) ?? "",
    date_created: pickString(row.date_created) ?? "",
    tags: pickStringArray(row.tags),
    image: imageUrl(pickString(row.image) ?? null),
    categorySlug: category ? pickString(category.slug) ?? null : null,
    categoryName: category ? pickString(category.name) ?? null : null,
  };
}

/* ============================================================
   ✅ Paginacja (offset-based)
   ============================================================ */
export async function getNewsPaged(
  args: {
    page?: number;
    perPage?: number;
    category?: string; // slug kategorii (categories.slug)
  } = {}
): Promise<PagedNews> {
  const page =
    Number.isFinite(args.page) && (args.page as number) > 0
      ? (args.page as number)
      : 1;

  const perPage =
    Number.isFinite(args.perPage) && (args.perPage as number) > 0
      ? (args.perPage as number)
      : 12;

  const filter: Record<string, unknown> = {};
  if (args.category) {
    filter.category = { slug: { _eq: args.category } };
  }

  try {
    // Total count (aggregate)
    const totalRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("news", {
        aggregate: { count: "*" },
        ...(Object.keys(filter).length ? { filter } : {}),
      } as Record<string, unknown>)
    );

    const totalArr = Array.isArray(totalRaw) ? (totalRaw as CountRow[]) : [];
    const totalCount = Number(
      totalArr.length > 0 && totalArr[0]?.count != null ? totalArr[0].count : 0
    );

    const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

    const safePage = Math.min(page, totalPages);
    const safeOffset = (safePage - 1) * perPage;

    const dataRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("news", {
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
        ],
        sort: ["-date_created"],
        limit: perPage,
        offset: safeOffset,
        ...(Object.keys(filter).length ? { filter } : {}),
      })
    );

    const rows: NewsRow[] = Array.isArray(dataRaw) ? (dataRaw as NewsRow[]) : [];
    const items = rows.map(mapNewsItem);

    return {
      items,
      total: Number.isFinite(totalCount) ? totalCount : 0,
      page: safePage,
      perPage,
      totalPages,
    };
  } catch (err: unknown) {
    console.error("❌ Błąd pobierania newsów (paged):", err);
    return {
      items: [],
      total: 0,
      page: 1,
      perPage,
      totalPages: 1,
    };
  }
}

/* ============================================================
   🔥 1. Stara funkcja (kompatybilna)
   ============================================================ */
export default async function getNews(
  attributes: Record<string, unknown> = {}
): Promise<News[]> {
  const attrs: Record<string, unknown> = { ...attributes };

  const categoryId = pickString(attrs.categoryId) ?? pickString(attrs.category);

  const filters: Record<string, unknown> = {};
  if (categoryId) {
    filters.filter = { category: { _eq: categoryId } };
    delete attrs.categoryId;
    delete attrs.category;
  }

  try {
    const dataRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("news", {
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
        ],
        sort: ["-date_created"],
        ...filters,
        ...attrs,
      })
    );

    const rows: NewsRow[] = Array.isArray(dataRaw) ? (dataRaw as NewsRow[]) : [];
    return rows.map(mapNewsItem);
  } catch (err: unknown) {
    console.error("❌ Błąd pobierania newsów:", err);
    return [];
  }
}

/* ============================================================
   🔥 2. Pobieranie pojedynczego artykułu
   ============================================================ */
export async function getSinglePost(slug: string): Promise<SinglePost | null> {
  try {
    const dataRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("news", {
        filter: { slug: { _eq: slug } },
        limit: 1,
        fields: [
          "id",
          "title",
          "lead",
          "slug",
          "content",
          "image",
          "date_created",
          "tags",
          "category.id",
          "category.slug",
          "category.name",
        ],
      })
    );

    const rows: NewsRow[] = Array.isArray(dataRaw) ? (dataRaw as NewsRow[]) : [];
    if (rows.length === 0) return null;

    const post = rows[0];
    const mapped = mapNewsItem(post);

    return {
      ...mapped,
      content: pickString(post.content) ?? "",
    };
  } catch (err: unknown) {
    console.error("❌ Błąd pobierania artykułu:", err);
    return null;
  }
}

/* ============================================================
   🔥 3. Pobieranie polecanych artykułów
   ============================================================ */
export async function getRecommended(
  categoryId: string,
  excludeSlug: string
): Promise<News[]> {
  try {
    const dataRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("news", {
        filter: {
          category: { _eq: categoryId },
          slug: { _neq: excludeSlug },
        },
        sort: ["-date_created"],
        limit: 2,
        fields: [
          "id",
          "title",
          "lead",
          "slug",
          "image",
          "date_created",
          "tags",
          "category.slug",
          "category.name",
        ],
      })
    );

    const rows: NewsRow[] = Array.isArray(dataRaw) ? (dataRaw as NewsRow[]) : [];
    return rows.map(mapNewsItem);
  } catch (err: unknown) {
    console.error("❌ Błąd pobierania polecanych:", err);
    return [];
  }
}

/* ============================================================
   🔥 Case study 
   ============================================================ */

export async function getLatestCaseStudies(limit = 3): Promise<News[]> {
  try {
    const dataRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readItems as any)("news", {
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
        ],
        filter: {
          status: { _eq: "published" },
          category: {
            slug: { _eq: "case-study" },
          },
        },
        sort: ["-date_created"],
        limit,
      })
    );

    const rows: NewsRow[] = Array.isArray(dataRaw) ? (dataRaw as NewsRow[]) : [];
    return rows.map(mapNewsItem);
  } catch (err: unknown) {
    console.error("❌ Błąd pobierania case studies:", err);
    return [];
  }
}

// import { directus } from "./directus";
// import { readItems } from "@directus/sdk";

// /* ============================================================
//    🔥 Typy
//    ============================================================ */
// export interface News {
//   id: string;
//   title: string;
//   lead: string;
//   slug: string;
//   image: string | null;
//   date_created: string;
//   tags?: string[];
//   categorySlug: string | null;
//   categoryName: string | null;
// }

// export interface SinglePost extends News {
//   content: string;
// }

// export type PagedNews = {
//   items: News[];
//   total: number;     // ile wszystkich pasujących
//   page: number;      // 1-based
//   perPage: number;
//   totalPages: number;
// };

// /* ============================================================
//    🔥 Helper: URL do obrazu
//    ============================================================ */
// function imageUrl(id: string | null) {
//   return id ? `https://dks.pl/backend/assets/${id}?imwidth=1920` : null;
// }

// /* ============================================================
//    🔥 Mapowanie item -> News
//    ============================================================ */
// function mapNewsItem(item: any): News {
//   return {
//     id: item.id,
//     title: item.title,
//     lead: item.lead,
//     slug: item.slug,
//     date_created: item.date_created,
//     tags: item.tags || [],
//     image: imageUrl(item.image),
//     categorySlug: item.category?.slug ?? null,
//     categoryName: item.category?.name ?? null,
//   };
// }

// /* ============================================================
//    ✅ Paginacja (offset-based)
//    - page: 1..N
//    - perPage: np. 12
//    - category: slug kategorii (opcjonalnie)
//    ============================================================ */
// export async function getNewsPaged(args: {
//   page?: number;
//   perPage?: number;
//   category?: string; // slug kategorii (categories.slug)
// } = {}): Promise<PagedNews> {
//   const page = Number.isFinite(args.page) && (args.page as number) > 0 ? (args.page as number) : 1;
//   const perPage =
//     Number.isFinite(args.perPage) && (args.perPage as number) > 0
//       ? (args.perPage as number)
//       : 12;

//   const offset = (page - 1) * perPage;

//   // filtr po slug kategorii (relacja: category.slug)
//   const filter: any = {};
//   if (args.category) {
//     filter.category = { slug: { _eq: args.category } };
//   }

//   try {
//     // Total count
//     const total = await directus.request(
//       readItems("news", {
//         aggregate: { count: "*" },
//         ...(Object.keys(filter).length ? { filter } : {}),
//       } as any)
//     );

//     const totalCount =
//       Array.isArray(total) && total[0]?.count ? Number(total[0].count) : 0;

//     const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

//     // jeśli ktoś wejdzie na stronę > totalPages, zwróć pustą listę (a strona i tak zrobi notFound)
//     const safePage = Math.min(page, totalPages);
//     const safeOffset = (safePage - 1) * perPage;

//     const data = await directus.request(
//       readItems("news", {
//         fields: [
//           "id",
//           "title",
//           "lead",
//           "slug",
//           "image",
//           "date_created",
//           "tags",
//           "category.id",
//           "category.slug",
//           "category.name",
//         ],
//         sort: ["-date_created"],
//         limit: perPage,
//         offset: safeOffset,
//         ...(Object.keys(filter).length ? { filter } : {}),
//       })
//     );

//     const items = (data || []).map(mapNewsItem);

//     return {
//       items,
//       total: totalCount,
//       page: safePage,
//       perPage,
//       totalPages,
//     };
//   } catch (err) {
//     console.error("❌ Błąd pobierania newsów (paged):", err);
//     return {
//       items: [],
//       total: 0,
//       page: 1,
//       perPage,
//       totalPages: 1,
//     };
//   }
// }

// /* ============================================================
//    🔥 1. Stara funkcja (kompatybilna) — zostawiam, ale używaj getNewsPaged
//    ============================================================ */
// export default async function getNews(attributes: Record<string, unknown> = {}): Promise<News[]> {
//   const filters: any = {};

//   const categoryId = (attributes as any).categoryId || (attributes as any).category;
//   if (categoryId) {
//     // UWAGA: to dalej filtruje po category = id (jak wcześniej),
//     // ale w paginacji używamy category.slug, więc na stronach paginacji nie używamy tej funkcji.
//     filters.filter = {
//       category: { _eq: categoryId },
//     };
//     delete (attributes as any).categoryId;
//     delete (attributes as any).category;
//   }

//   try {
//     const data = await directus.request(
//       readItems("news", {
//         fields: [
//           "id",
//           "title",
//           "lead",
//           "slug",
//           "image",
//           "date_created",
//           "tags",
//           "category.id",
//           "category.slug",
//           "category.name",
//         ],
//         sort: ["-date_created"],
//         ...filters,
//         ...attributes,
//       })
//     );

//     return (data || []).map(mapNewsItem);
//   } catch (err) {
//     console.error("❌ Błąd pobierania newsów:", err);
//     return [];
//   }
// }

// /* ============================================================
//    🔥 2. Pobieranie pojedynczego artykułu
//    ============================================================ */
// export async function getSinglePost(slug: string): Promise<SinglePost | null> {
//   try {
//     const data = await directus.request(
//       readItems("news", {
//         filter: { slug: { _eq: slug } },
//         limit: 1,
//         fields: [
//           "id",
//           "title",
//           "lead",
//           "slug",
//           "content",
//           "image",
//           "date_created",
//           "tags",
//           "category.id",
//           "category.slug",
//           "category.name",
//         ],
//       })
//     );

//     if (!data || data.length === 0) return null;

//     const post = data[0];

//     return {
//       id: post.id,
//       title: post.title,
//       lead: post.lead,
//       slug: post.slug,
//       content: post.content,
//       date_created: post.date_created,
//       tags: post.tags || [],
//       image: imageUrl(post.image),
//       categorySlug: post.category?.slug ?? null,
//       categoryName: post.category?.name ?? null,
//     };
//   } catch (err) {
//     console.error("❌ Błąd pobierania artykułu:", err);
//     return null;
//   }
// }

// /* ============================================================
//    🔥 3. Pobieranie polecanych artykułów
//    ============================================================ */
// export async function getRecommended(categoryId: string, excludeSlug: string): Promise<News[]> {
//   try {
//     const data = await directus.request(
//       readItems("news", {
//         filter: {
//           category: { _eq: categoryId },
//           slug: { _neq: excludeSlug },
//         },
//         sort: ["-date_created"],
//         limit: 2,
//         fields: [
//           "id",
//           "title",
//           "lead",
//           "slug",
//           "image",
//           "date_created",
//           "tags",
//           "category.slug",
//           "category.name",
//         ],
//       })
//     );

//     return (data || []).map(mapNewsItem);
//   } catch (err) {
//     console.error("❌ Błąd pobierania polecanych:", err);
//     return [];
//   }
// }
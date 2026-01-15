import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
import { readItems, readFields } from "@directus/sdk";

/** Typy pomocnicze */
interface TypeItem {
  [key: string]: string | number | boolean | null | undefined;
}

interface TypeRelation {
  collection: string;
  item: TypeItem;
}

interface Product {
  id: number;
  model?: string;
  slug?: string;
  short_description?: string;
  main_image?: { id?: string };
  price?: number;
  brand?: { id?: string | number; name?: string };
  state?: string;
  status?: string;
  type?: TypeRelation[] | TypeRelation;
  [key: string]: unknown;
}

function toPositiveInt(value: string | null, fallback: number) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

/** Główna funkcja API */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // 🔹 Parametr kategorii
    const categorySlug = searchParams.get("category");
    if (!categorySlug) {
      return NextResponse.json(
        { error: "Missing category parameter" },
        { status: 400 }
      );
    }

    // ✅ Paginacja
    const page = toPositiveInt(searchParams.get("page"), 1);
    const perPage = toPositiveInt(searchParams.get("perPage"), 12);

    // 🔹 Zamiana slug → kolekcja (np. 'rozwiazania-dla-biura' → 'office_solutions')
    const collection = await mapSlugToCollection(categorySlug);
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown category slug: ${categorySlug}` },
        { status: 404 }
      );
    }

    // 🔹 Sprawdzenie schematu produktów
    await directus.request(readFields("products"));

    // 🔹 Bazowy filtr
    const baseFilter: {
      status: { _eq: string };
      _and: Array<{
        type: {
          collection: { _in: string[] };
        };
      }>;
    } = {
      status: { _eq: "published" },
      _and: [
        {
          type: {
            collection: { _in: [collection] }, // główna kategoria
          },
        },
      ],
    };

    // ✅ Subkategoria (nie nadpisuje filtra)
    const subcategorySlug = searchParams.get("subcategory");
    if (subcategorySlug) {
      const subcategoryCollection = await mapSlugToCollection(subcategorySlug);
      if (subcategoryCollection) {
        baseFilter._and[0].type.collection._in.push(subcategoryCollection);
      }
    }

    // 🔹 Pobranie produktów z Directusa (max 300 jak było)
    const allProducts = (await directus.request(
      readItems("products", {
        fields: [
          "id",
          "model",
          "slug",
          "short_description",
          "main_image.*",
          "price",
          "brand.*",
          "state",
          "type.collection",
          "type.item.*",
        ],
        filter: baseFilter,
        limit: 300,
      })
    )) as Product[];

    // 🔹 Filtrowanie po query params (np. ?color=czarny&format=a4)
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      // ⛔️ NIE traktuj jako filtry:
      if (
        key === "category" ||
        key === "subcategory" ||
        key === "page" ||
        key === "perPage"
      )
        return;

      if (!value) return;
      if (!filters[key]) filters[key] = [];
      // wspieramy też CSV: a,b,c
      value.split(",").forEach((v) => {
        const trimmed = v.trim();
        if (trimmed) filters[key].push(trimmed);
      });
    });

    const filtered = allProducts.filter((product) => {
      if (Object.keys(filters).length === 0) return true;

      const typeArray = Array.isArray(product.type)
        ? product.type
        : product.type
        ? [product.type]
        : [];

      // 🔸 Szukamy pasującego elementu w typach
      return Object.entries(filters).every(([key, values]) =>
        typeArray.some((t) => {
          const item = t.item || {};
          const val = item[key];
          if (!val) return false;
          return values.some(
            (v) => String(v).toLowerCase() === String(val).toLowerCase()
          );
        })
      );
    });

    // ✅ Paginacja po filtrowaniu
    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, totalPages);

    const start = (safePage - 1) * perPage;
    const end = start + perPage;
    const paginated = filtered.slice(start, end);

    return NextResponse.json({
      page: safePage,
      perPage,
      total,
      totalPages,
      count: paginated.length,
      products: paginated,
    });
  } catch (error) {
    console.error("❌ Błąd w /api/products:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}


// import { NextResponse } from "next/server";
// import { directus } from "@/lib/directus";
// import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
// import { readItems, readFields } from "@directus/sdk";

// /** Typy pomocnicze */
// interface TypeItem {
//   [key: string]: string | number | boolean | null | undefined;
// }

// interface TypeRelation {
//   collection: string;
//   item: TypeItem;
// }

// interface Product {
//   id: number;
//   model?: string;
//   slug?: string;
//   short_description?: string;
//   main_image?: { id?: string };
//   price?: number;
//   brand?: { id?: string | number; name?: string };
//   state?: string;
//   status?: string;
//   type?: TypeRelation[] | TypeRelation;
//   [key: string]: unknown;
// }

// /** Główna funkcja API */
// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);

//     // 🔹 Parametr kategorii
//     const categorySlug = searchParams.get("category");
//     if (!categorySlug) {
//       return NextResponse.json(
//         { error: "Missing category parameter" },
//         { status: 400 }
//       );
//     }

//     // 🔹 Zamiana slug → kolekcja (np. 'rozwiazania-dla-biura' → 'office_solutions')
//     const collection = await mapSlugToCollection(categorySlug);
//     if (!collection) {
//       return NextResponse.json(
//         { error: `Unknown category slug: ${categorySlug}` },
//         { status: 404 }
//       );
//     }

//     // 🔹 Sprawdzenie schematu produktów
//     await directus.request(readFields("products"));

//     // 🔹 Bazowy filtr
//     const baseFilter: {
//       status: { _eq: string };
//       _and: Array<{
//         type: {
//           collection: { _in: string[] };
//         };
//       }>;
//     } = {
//       status: { _eq: "published" },
//       _and: [
//         {
//           type: {
//             collection: { _in: [collection] }, // główna kategoria
//           },
//         },
//       ],
//     };

//     // ✅ Subkategoria (nie nadpisuje filtra)
//     const subcategorySlug = searchParams.get("subcategory");
//     if (subcategorySlug) {
//       const subcategoryCollection = await mapSlugToCollection(subcategorySlug);
//       if (subcategoryCollection) {
//         baseFilter._and[0].type.collection._in.push(subcategoryCollection);
//       }
//     }

//     // 🔹 Pobranie produktów z Directusa
//     const allProducts = (await directus.request(
//       readItems("products", {
//         fields: [
//           "id",
//           "model",
//           "slug",
//           "short_description",
//           "main_image.*",
//           "price",
//           "brand.*",
//           "state",
//           "type.collection",
//           "type.item.*",
//         ],
//         filter: baseFilter,
//         limit: 300,
//       })
//     )) as Product[];

//     // 🔹 Filtrowanie po query params (np. ?color=czarny&format=a4)
//     const filters: Record<string, string[]> = {};
//     searchParams.forEach((value, key) => {
//       if (key !== "category" && key !== "subcategory" && value) {
//         if (!filters[key]) filters[key] = [];
//         filters[key].push(value);
//       }
//     });

//     const filtered = allProducts.filter((product) => {
//       if (Object.keys(filters).length === 0) return true;

//       const typeArray = Array.isArray(product.type)
//         ? product.type
//         : product.type
//         ? [product.type]
//         : [];

//       // 🔸 Szukamy pasującego elementu w typach (np. office_solutions, office_software)
//       return Object.entries(filters).every(([key, values]) =>
//         typeArray.some((t) => {
//           const item = t.item || {};
//           const val = item[key];
//           if (!val) return false;
//           return values.some(
//             (v) => String(v).toLowerCase() === String(val).toLowerCase()
//           );
//         })
//       );
//     });

//     // ✅ Zwracamy dane
//     return NextResponse.json({
//       count: filtered.length,
//       products: filtered,
//     });
//   } catch (error) {
//     console.error("❌ Błąd w /api/products:", error);
//     const message = error instanceof Error ? error.message : "Unknown error";
//     return NextResponse.json(
//       { error: "Internal Server Error", details: message },
//       { status: 500 }
//     );
//   }
// }
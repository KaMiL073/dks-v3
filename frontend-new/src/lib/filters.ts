import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { readFields } from "@directus/sdk";
import { resolveCategoryToCollection } from "@/lib/directusCategoryMapper";

interface DirectusChoice {
  text: string;
  value: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // category = rodzic URL, np. "rozwiazania-dla-biura"
  // subcategory = opcjonalny slug subkategorii, np. "drukarki-i-urzadzenia-wielofunkcyjne"
  const categorySlug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");

  if (!categorySlug) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  try {
    const slugForCollection = subcategorySlug || categorySlug;
    const collection = await resolveCategoryToCollection(slugForCollection);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = (await directus.request((readFields as any)(collection))) as any[];

    const filters = fields
      .filter((f) => f?.meta?.interface === "select-dropdown")
      .map((f) => ({
        field: f.field,
        label: f?.meta?.display || f.field,
        options: ((f?.meta?.options?.choices || []) as DirectusChoice[]).map((c) => ({
          text: c.text,
          value: c.value,
        })),
      }));

    return NextResponse.json({ filters });
  } catch (err) {
    console.error("❌ /api/products/filters error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { directus } from "@/lib/directus";
// import { readFields } from "@directus/sdk";
// import { resolveCategoryToCollection } from "@/lib/directusCategoryMapper";

// interface DirectusChoice {
//   text: string;
//   value: string;
// }

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);

//   // category = rodzic URL, np. "rozwiazania-dla-biura"
//   // subcategory = opcjonalny slug subkategorii, np. "drukarki-i-urzadzenia-wielofunkcyjne"
//   const categorySlug = searchParams.get("category");
//   const subcategorySlug = searchParams.get("subcategory");

//   if (!categorySlug) {
//     return NextResponse.json({ error: "Missing category" }, { status: 400 });
//   }

//   try {
//     // ✅ KLUCZ: wybieramy kolekcję wprost:
//     // - jeśli jest subcategory -> filtruj po subkolekcji
//     // - jeśli nie -> filtruj po kolekcji rodzica
//     const slugForCollection = subcategorySlug || categorySlug;

//     const collection = await resolveCategoryToCollection(slugForCollection);

//     const fields = await directus.request(readFields(collection));

//     const filters = fields
//       .filter((f) => f.meta?.interface === "select-dropdown")
//       .map((f) => ({
//         field: f.field,
//         label: f.meta?.display || f.field,
//         options: ((f.meta?.options?.choices || []) as DirectusChoice[]).map((c) => ({
//           text: c.text,
//           value: c.value,
//         })),
//       }));

//     return NextResponse.json({ filters });
//   } catch (err) {
//     console.error("❌ /api/products/filters error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
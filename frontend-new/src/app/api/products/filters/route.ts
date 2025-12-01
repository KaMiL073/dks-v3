import { NextResponse } from "next/server";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";

interface DirectusChoice {
  text: string;
  value: string;
  meta?: {
    translations?: { translation: string }[];
  };
}

interface DirectusField {
  field: string;
  meta?: {
    interface?: string;
    field?: string;
    translations?: { translation: string }[];
    options?: {
      choices?: DirectusChoice[];
    };
  };
}

interface FilterOption {
  field: string;
  label: string;
  options: {
    text: string;
    value: string;
  }[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");

    if (!categorySlug) {
      return NextResponse.json(
        { error: "Missing category parameter" },
        { status: 400 }
      );
    }

    // 🔀 Mapowanie slug → kolekcja (np. 'rozwiazania-dla-biura' → 'office_solutions')
    const collection = await mapSlugToCollection(categorySlug);
    if (!collection) {
      return NextResponse.json(
        { error: `Unknown category slug: ${categorySlug}` },
        { status: 404 }
      );
    }

    // 🔹 REST do Directusa
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/fields/${collection}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.SERVICE_USER_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch fields for collection: ${collection}`);
    }

    const json = (await response.json()) as { data: DirectusField[] };
    const fields = json.data || [];

    // 🎯 Wybieramy tylko pola typu "select-dropdown" z choices
    const filters: FilterOption[] = fields
      .filter(
        (f) =>
          f.meta?.interface === "select-dropdown" &&
          Array.isArray(f.meta?.options?.choices)
      )
      .map((f) => ({
        field: f.field,
        label:
          f.meta?.translations?.[0]?.translation ??
          f.meta?.field ??
          f.field,
        options:
          f.meta?.options?.choices?.map((c) => ({
            text: c.text,
            value:
              c.value ??
              c.meta?.translations?.[0]?.translation ??
              c.text,
          })) ?? [],
      }));

    return NextResponse.json({ filters });
  } catch (error) {
    console.error("❌ Błąd w /api/products/filters:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal Server Error", details: message },
      { status: 500 }
    );
  }
}
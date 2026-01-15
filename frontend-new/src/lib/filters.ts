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
  const categorySlug = searchParams.get("category");

  if (!categorySlug) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  const collection = await resolveCategoryToCollection(categorySlug);

  try {
    const fields = await directus.request(readFields(collection));

    const filters = fields
      .filter((f) => f.meta?.interface === "select-dropdown") // np. tylko pola z opcjami
      .map((f) => ({
        field: f.field,
        label: f.meta?.display || f.field,
        options: ((f.meta?.options?.choices || []) as DirectusChoice[]).map(
          (c) => ({
            text: c.text,
            value: c.value,
          })
        ),
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
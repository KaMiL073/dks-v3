import { readItems } from "@directus/sdk";
import { NextRequest, NextResponse } from "next/server";
import { directus, type DirectusNewsRow } from "@/lib/directus";

function imageId(value: DirectusNewsRow["image"]) {
  if (typeof value === "string") return value;
  return value?.id || null;
}

export async function GET(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit"));
  const limit = Number.isFinite(requestedLimit)
    ? Math.min(Math.max(Math.trunc(requestedLimit), 1), 12)
    : 4;

  try {
    const rows = await directus.request(
      readItems("news", {
        fields: ["id", "title", "lead", "slug", "image"],
        filter: {
          status: { _eq: "published" },
          category: {
            slug: { _eq: "export" },
          },
        },
        sort: ["-date_created"],
        limit,
      }),
    );

    const items = rows.map((item) => ({
      id: String(item.id || ""),
      title: item.title || "",
      lead: item.lead || "",
      slug: item.slug || "",
      image: imageId(item.image),
    }));

    return NextResponse.json({ ok: true, items });
  } catch {
    return NextResponse.json(
      { ok: false, items: [], error: "Unable to fetch export news" },
      { status: 502 },
    );
  }
}

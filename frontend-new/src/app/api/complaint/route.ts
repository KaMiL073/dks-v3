import { NextResponse } from "next/server";

const DIRECTUS_URL =
  process.env.API_INTERNAL_URL ||
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_API_URL;

const DIRECTUS_TOKEN =
  process.env.SERVICE_USER_TOKEN ||
  process.env.DIRECTUS_TOKEN ||
  process.env.DIRECTUS_STATIC_TOKEN ||
  process.env.API_TOKEN;

export async function POST(req: Request) {
  if (!DIRECTUS_URL) {
    return NextResponse.json(
      { error: "DIRECTUS_URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();

    const { recaptcha, ...payload } = body;

    const response = await fetch(`${DIRECTUS_URL}/items/complaint`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(DIRECTUS_TOKEN
          ? {
              Authorization: `Bearer ${DIRECTUS_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Directus complaint create failed",
          details: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("Complaint API error:", error);

    return NextResponse.json(
      { error: "Complaint API error" },
      { status: 500 }
    );
  }
}
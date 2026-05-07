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
  try {
    if (!DIRECTUS_URL) {
      return NextResponse.json(
        { error: "Missing Directus URL" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const res = await fetch(`${DIRECTUS_URL}/items/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(DIRECTUS_TOKEN
          ? {
              Authorization: `Bearer ${DIRECTUS_TOKEN}`,
            }
          : {}),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: await res.text() },
        { status: res.status }
      );
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json(
      { error: "Form submit error" },
      { status: 500 }
    );
  }
}
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

const SALESPERSON_CODE_PATTERN = /^[a-z]{1,4}-[a-z0-9]{6,32}$/;

type EventFormBody = Record<string, unknown> & {
  salespersonCode?: unknown;
};

async function resolveSalespersonId(code: string): Promise<string | null> {
  if (!DIRECTUS_URL || !DIRECTUS_TOKEN) return null;

  const query = new URLSearchParams({
    "filter[invitation_code][_eq]": code,
    "filter[status][_eq]": "active",
    fields: "id",
    limit: "1",
  });

  const response = await fetch(`${DIRECTUS_URL}/users?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${DIRECTUS_TOKEN}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Directus user lookup failed with ${response.status}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ id?: string }>;
  };

  return payload.data?.[0]?.id ?? null;
}

export async function POST(req: Request) {
  try {
    if (!DIRECTUS_URL) {
      return NextResponse.json(
        { error: "Missing Directus URL" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as EventFormBody;
    const rawCode =
      typeof body.salespersonCode === "string"
        ? body.salespersonCode.trim().toLowerCase()
        : "";

    if (rawCode && !SALESPERSON_CODE_PATTERN.test(rawCode)) {
      return NextResponse.json(
        { error: "Invalid salesperson code" },
        { status: 400 }
      );
    }

    const salespersonId = rawCode
      ? await resolveSalespersonId(rawCode)
      : null;

    if (rawCode && !salespersonId) {
      return NextResponse.json(
        { error: "Invalid salesperson code" },
        { status: 400 }
      );
    }

    // The relation is resolved server-side. Never trust a user id supplied by
    // the browser, because it would allow attributing a signup to another user.
    const formData = { ...body };
    delete formData.salespersonCode;
    delete formData.salesperson;
    const directusPayload = {
      ...formData,
      ...(salespersonId ? { salesperson: salespersonId } : {}),
    };

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
      body: JSON.stringify(directusPayload),
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

import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";
import { createItem } from "@directus/sdk";

type NewPayload = {
  form_name: string;
  email: string;
  form_data: Record<string, unknown>;
};

const COLLECTION = "contact_forms";

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function pickString(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}

function pickBoolString(v: unknown): string | null {
  // na starej stronie w DB często były "false"/"true" jako stringi
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "string") return v;
  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const isNewFormat =
      typeof body?.form_name === "string" &&
      typeof body?.email === "string" &&
      isRecord(body?.form_data);

    // 1) Normalizujemy dane formularza do jednego obiektu
    const form_name = isNewFormat ? (body.form_name as string) : "ContactForm";
    const email = isNewFormat
      ? (body.email as string)
      : String((body as any)?.email ?? "");

    const form_data: Record<string, unknown> = isNewFormat
      ? (body.form_data as Record<string, unknown>)
      : body; // stary format: płasko

    // 2) Wypychanie najważniejszych pól na top-level (żeby lista w Directus nie była pusta)
    //    (dopasowane do pól które widać w Twoim API response: name/email/phone/message/province/nip/clause/clause_for_answers)
    const topLevel = {
      name: pickString(form_data.name),
      email: pickString(form_data.email) ?? email,
      phone: pickString(form_data.phone),
      message: pickString(form_data.message),
      province: pickString(form_data.province),

      nip: pickString(form_data.nip),

      // stare nazwy z Directusa:
      clause: pickBoolString((form_data as any).clause ?? (form_data as any).consentMarketing),
      clause_for_answers: pickBoolString(
        (form_data as any).clause_for_answers ?? (form_data as any).consentData
      ),
    };

    const payload: NewPayload & Record<string, unknown> = {
      form_name,
      email,
      form_data,
      ...topLevel,
    };

    if (!payload.email) {
      return NextResponse.json({ ok: false, error: "Brak pola email." }, { status: 400 });
    }
    if (!payload.form_name) {
      return NextResponse.json({ ok: false, error: "Brak pola form_name." }, { status: 400 });
    }

    const created = await directus.request(createItem(COLLECTION, payload as any));
    return NextResponse.json({ ok: true, created }, { status: 200 });
  } catch (error) {
    console.error("❌ /api/forms POST error:", error);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
import { NextResponse } from "next/server";
import { createDirectus, createItem, rest, staticToken } from "@directus/sdk";
import crypto from "crypto";

type NewPayload = {
  form_name: string;
  email: string;
  form_data: Record<string, unknown>;
};

const COLLECTION = "contact_forms";
const directusUrl = process.env.DIRECTUS_URL || "http://directus:8055";

const formsDirectus = createDirectus(directusUrl)
  .with(staticToken(process.env.SERVICE_USER_TOKEN || ""))
  .with(rest());

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function pickString(v: unknown): string | null {
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return null;
}

function pickBoolString(v: unknown): string | null {
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "string") return v;
  return null;
}

function getField(obj: Record<string, unknown>, key: string): unknown {
  return obj[key];
}

function stableStringify(obj: unknown): string | undefined {
  if (obj === null) return "null";

  const t = typeof obj;

  if (t === "string") return JSON.stringify(obj);
  if (t === "number") return Number.isFinite(obj) ? String(obj) : "null";
  if (t === "boolean") return obj ? "true" : "false";

  if (t === "undefined" || t === "function" || t === "symbol") return undefined;

  if (Array.isArray(obj)) {
    const items = obj
      .map((v) => {
        const s = stableStringify(v);
        return s === undefined ? "null" : s;
      })
      .join(",");

    return `[${items}]`;
  }

  if (isRecord(obj)) {
    const keys = Object.keys(obj).sort();
    const props: string[] = [];

    for (const k of keys) {
      const v = stableStringify(obj[k]);
      if (v === undefined) continue;
      props.push(`${JSON.stringify(k)}:${v}`);
    }

    return `{${props.join(",")}}`;
  }

  return undefined;
}

function signPayload(payload: Record<string, unknown>): string {
  const secret = process.env.FORMS_HMAC_SECRET;

  if (!secret) {
    throw new Error("Missing FORMS_HMAC_SECRET");
  }

  const body = stableStringify(payload);

  if (!body) {
    throw new Error("Cannot stringify payload");
  }

  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

export async function POST(request: Request) {
  try {
    const raw: unknown = await request.json();

    if (!isRecord(raw)) {
      return NextResponse.json(
        { ok: false, error: "Niepoprawne body (JSON)." },
        { status: 400 }
      );
    }

    if (!process.env.SERVICE_USER_TOKEN) {
      throw new Error("Missing SERVICE_USER_TOKEN");
    }

    const body = raw;

    /**
     * ✅ RECAPTCHA VALIDATION
     */
    const recaptchaToken = pickString(getField(body, "recaptchaToken"));

    if (!recaptchaToken) {
      return NextResponse.json(
        { ok: false, error: "Brak tokena reCAPTCHA." },
        { status: 400 }
      );
    }

    if (!process.env.RECAPTCHA_SECRET_KEY) {
      throw new Error("Missing RECAPTCHA_SECRET_KEY");
    }

    const verifyResp = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        }),
      }
    );

    const verify = await verifyResp.json();

    if (!verify.success) {
      return NextResponse.json(
        { ok: false, error: "Niepoprawna reCAPTCHA.", verify },
        { status: 400 }
      );
    }

    /**
     * FORMAT
     */
    const isNewFormat =
      typeof body.form_name === "string" &&
      typeof body.email === "string" &&
      isRecord(body.form_data);

    const form_name: string =
      isNewFormat && typeof body.form_name === "string"
        ? body.form_name
        : "ContactForm";

    const legacyEmail = pickString(getField(body, "email")) ?? "";

    const email: string =
      isNewFormat && typeof body.email === "string"
        ? body.email
        : legacyEmail;

    const rawFormData: Record<string, unknown> =
      isNewFormat && isRecord(body.form_data) ? body.form_data : body;

    /**
     * ❗ USUWAMY recaptchaToken z danych
     */
    const { recaptchaToken: _recaptchaToken, ...form_data } = rawFormData;

    const clause = pickBoolString(
      getField(form_data, "clause") ?? getField(form_data, "consentMarketing")
    );

    const clause_for_answers = pickBoolString(
      getField(form_data, "clause_for_answers") ??
        getField(form_data, "consentData")
    );

    const topLevel = {
      name: pickString(getField(form_data, "name")),
      phone: pickString(getField(form_data, "phone")),
      message: pickString(getField(form_data, "message")),
      province: pickString(getField(form_data, "province")),
      nip: pickString(getField(form_data, "nip")),
      clause,
      clause_for_answers,
    };

    const emailFromFormData = pickString(getField(form_data, "email"));
    const finalEmail = emailFromFormData ?? email;

    const payload: NewPayload & Record<string, unknown> = {
      form_name,
      email: finalEmail,
      form_data,
      ...topLevel,
    };

    if (!payload.email) {
      return NextResponse.json(
        { ok: false, error: "Brak pola email." },
        { status: 400 }
      );
    }

    if (!payload.form_name) {
      return NextResponse.json(
        { ok: false, error: "Brak pola form_name." },
        { status: 400 }
      );
    }

    payload.__sig = signPayload(payload);

    /**
     * DIRECTUS
     */
    const operation = createItem(COLLECTION as never, payload as never);
    const created = await formsDirectus.request(operation);

    return NextResponse.json({ ok: true, created }, { status: 200 });
  } catch (error: unknown) {
    console.error("❌ /api/forms POST error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: "Server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
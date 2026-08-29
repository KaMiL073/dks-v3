import { createItem } from "@directus/sdk";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { directus } from "@/lib/directus";

const FORM_NAME = "export";
const RECAPTCHA_ACTION = "export_form";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requiredText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function stableStringify(value: unknown): string | undefined {
  if (value === null) return "null";

  const type = typeof value;
  if (type === "string") return JSON.stringify(value);
  if (type === "number") {
    return Number.isFinite(value) ? String(value) : "null";
  }
  if (type === "boolean") return value ? "true" : "false";
  if (
    type === "undefined" ||
    type === "function" ||
    type === "symbol"
  ) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return `[${value
      .map((item) => stableStringify(item) ?? "null")
      .join(",")}]`;
  }

  if (isRecord(value)) {
    const properties = Object.keys(value)
      .sort()
      .flatMap((key) => {
        const serialized = stableStringify(value[key]);
        return serialized === undefined
          ? []
          : [`${JSON.stringify(key)}:${serialized}`];
      });

    return `{${properties.join(",")}}`;
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
    throw new Error("Cannot serialize form payload");
  }

  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing RECAPTCHA_SECRET_KEY");
  }

  const response = await fetch(
    "https://www.recaptcha.net/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
      cache: "no-store",
    },
  );

  const result = (await response.json()) as {
    success?: boolean;
    score?: number;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };

  const valid =
    result.success === true &&
    result.action === RECAPTCHA_ACTION &&
    typeof result.score === "number" &&
    result.score >= 0.5;

  if (!valid) {
    console.warn("Export form reCAPTCHA rejected:", {
      success: result.success,
      score: result.score,
      action: result.action,
      hostname: result.hostname,
      errorCodes: result["error-codes"],
    });
  }

  return {
    valid,
    errorCodes: result["error-codes"] ?? [],
  };
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const requestHostname = new URL(request.url).hostname;
    const localRecaptchaBypass =
      process.env.NODE_ENV === "development" &&
      process.env.RECAPTCHA_BYPASS_LOCAL === "true" &&
      (requestHostname === "localhost" || requestHostname === "127.0.0.1");

    if (!isRecord(body) || body.form_name !== FORM_NAME) {
      return NextResponse.json(
        { ok: false, error: "Invalid form request." },
        { status: 400 },
      );
    }

    if (!localRecaptchaBypass) {
      const recaptchaToken = requiredText(body.recaptchaToken);
      if (!recaptchaToken) {
        return NextResponse.json(
          {
            ok: false,
            code: "recaptcha_failed",
            error: "Security verification failed.",
          },
          { status: 400 },
        );
      }

      const recaptcha = await verifyRecaptcha(recaptchaToken);
      if (!recaptcha.valid) {
        return NextResponse.json(
          {
            ok: false,
            code: recaptcha.errorCodes.includes("browser-error")
              ? "recaptcha_browser_error"
              : "recaptcha_failed",
            error: "Security verification failed.",
          },
          { status: 400 },
        );
      }
    }

    if (!isRecord(body.form_data)) {
      return NextResponse.json(
        { ok: false, error: "Invalid form data." },
        { status: 400 },
      );
    }

    const source = body.form_data;
    const name = requiredText(source.name);
    const email = requiredText(source.email);
    const message = requiredText(source.message);
    const country = requiredText(source.country);
    const consentData = source.consentData === true;

    if (!name || !email || !message || !country || !consentData) {
      return NextResponse.json(
        { ok: false, error: "Complete all required fields." },
        { status: 400 },
      );
    }

    const brands = Array.isArray(source.brands)
      ? source.brands
          .filter((brand): brand is string => typeof brand === "string")
          .map((brand) => brand.trim())
          .filter(Boolean)
      : [];

    const formData = {
      name,
      company: optionalText(source.company),
      email,
      phone: optionalText(source.phone),
      country,
      brands,
      message,
      consentData: true,
      clause_for_answers: true,
      clause: false,
    };

    const payload: Record<string, unknown> = {
      form_name: FORM_NAME,
      email,
      form_data: formData,
      name,
      phone: formData.phone,
      message,
      province: FORM_NAME,
      nip: null,
      clause: "false",
      clause_for_answers: "true",
    };

    payload.__sig = signPayload(payload);

    await directus.request(createItem("contact_forms", payload));

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Export form submission failed:", error);
    return NextResponse.json(
      { ok: false, error: "The form could not be sent." },
      { status: 500 },
    );
  }
}

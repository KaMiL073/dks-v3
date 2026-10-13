import { NextResponse } from "next/server";
import { createHmac } from "node:crypto";
import { validateFormRecaptcha } from "@/lib/formRecaptcha.mjs";

export const runtime = "nodejs";
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    if (slug.length > 160 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return NextResponse.json({ ok: false, error: "Nie znaleziono ankiety." }, { status: 404 });
    // Bound streamed bodies too; Content-Length alone is untrusted.
    const reader = request.body?.getReader();
    if (!reader) return NextResponse.json({ ok: false, error: "Brak odpowiedzi." }, { status: 400 });
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 120000) { await reader.cancel(); return NextResponse.json({ ok: false, error: "Odpowiedzi są za duże." }, { status: 413 }); }
      chunks.push(value);
    }
    let body;
    try { body = JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { return NextResponse.json({ ok: false, error: "Niepoprawne dane formularza." }, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body) || body.website) return NextResponse.json({ ok: false, error: "Niepoprawne dane formularza." }, { status: 400 });
    const secret = process.env.FORMS_HMAC_SECRET;
    if (!secret) throw new Error("Survey signing unavailable");
    const bypass = process.env.NODE_ENV !== "production" && process.env.RECAPTCHA_BYPASS_LOCAL === "true" && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(new URL(request.url).hostname);
    if (!bypass) {
      if (typeof body.recaptchaToken !== "string" || !body.recaptchaToken || body.recaptchaToken.length > 10000) return NextResponse.json({ ok: false, error: "Brak weryfikacji antyspamowej." }, { status: 400 });
      if (!process.env.RECAPTCHA_SECRET_KEY) throw new Error("Survey captcha unavailable");
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST", body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: body.recaptchaToken }), signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) throw new Error("Captcha unavailable");
      const hosts = (process.env.RECAPTCHA_ALLOWED_HOSTNAMES || "dks.pl,www.dks.pl").split(",").map(h => h.trim()).filter(Boolean);
      if (process.env.NODE_ENV !== "production") hosts.push("localhost", "127.0.0.1", "::1");
      if (validateFormRecaptcha(await response.json(), "SurveyForm", hosts)) return NextResponse.json({ ok: false, error: "Weryfikacja antyspamowa nie powiodła się. Spróbuj ponownie." }, { status: 400 });
    }
    // The proxy must overwrite X-Real-IP. Hash rotates every ten minutes and is never stored with answers.
    const rateKey = createHmac("sha256", secret).update(`${Math.floor(Date.now() / 600000)}:${request.headers.get("x-real-ip") || "unknown"}`).digest("hex");
    const payload = JSON.stringify({ action: "submit", slug, timestamp: Date.now(), rateKey, body: { answers: body.answers, contact: body.contact } });
    const signature = createHmac("sha256", secret).update(payload).digest("hex");
    const url = process.env.DIRECTUS_INTERNAL_URL || process.env.API_INTERNAL_URL || process.env.DIRECTUS_URL || "http://directus:8055";
    const response = await fetch(`${url.replace(/\/$/, "")}/surveys/${encodeURIComponent(slug)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ payload, signature }), signal: AbortSignal.timeout(15000), cache: "no-store",
    });
    if (response.status >= 500) throw new Error("Survey storage unavailable");
    const result = await response.json();
    return NextResponse.json(result, { status: response.status, headers: { "Cache-Control": "no-store", ...(response.status === 429 ? { "Retry-After": "600" } : {}) } });
  } catch {
    return NextResponse.json({ ok: false, error: "Nie udało się wysłać ankiety. Spróbuj ponownie później." }, { status: 503 });
  }
}

import "server-only";
import { createHmac } from "node:crypto";

export type SurveyQuestion = {
  id: string; title: string; description: string | null;
  type: "short_text" | "long_text" | "single_choice" | "multiple_choice";
  required: boolean; options: { id: string; label: string }[];
};
export type Survey = {
  title: string; slug: string; description: string | null; mode: "anonymous" | "contact";
  privacy_notice: string | null; success_message: string;
  contact_name: "hidden" | "optional" | "required";
  contact_email: "hidden" | "optional" | "required";
  contact_phone: "hidden" | "optional" | "required";
  contact_company: "hidden" | "optional" | "required";
  questions: SurveyQuestion[];
};
export async function getSurvey(slug: string): Promise<Survey | null> {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) || slug.length > 160) return null;
  const secret = process.env.FORMS_HMAC_SECRET;
  if (!secret) throw new Error("Survey signing unavailable");
  const payload = JSON.stringify({ action: "read", slug, timestamp: Date.now() });
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  const url = process.env.DIRECTUS_INTERNAL_URL || process.env.API_INTERNAL_URL || process.env.DIRECTUS_URL || "http://directus:8055";
  const response = await fetch(`${url.replace(/\/$/, "")}/surveys/${encodeURIComponent(slug)}`, {
    headers: { "x-survey-payload": payload, "x-survey-signature": signature },
    cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Survey configuration unavailable");
  return await response.json() as Survey;
}

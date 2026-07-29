import "server-only";

import {
  createDirectus,
  rest,
  staticToken,
  type DirectusClient,
  type RestClient,
  type StaticTokenClient,
} from "@directus/sdk";

export type DirectusNewsRow = {
  id?: string | number;
  title?: string | null;
  lead?: string | null;
  slug?: string | null;
  image?: string | { id?: string | null } | null;
  status?: string | null;
  date_created?: string | null;
  category?: {
    slug?: string | null;
  } | null;
};

type ContactFormItem = Record<string, unknown> & {
  id?: string | number;
  form_name?: string | null;
  email?: string | null;
};

type DirectusSchema = {
  news: DirectusNewsRow[];
  contact_forms: ContactFormItem[];
};

function cleanEnv(value: string | undefined): string {
  const normalized = (value ?? "").trim();

  if (!normalized) return "";
  if (normalized === "undefined" || normalized === "null") return "";

  return normalized;
}

function resolveBackendUrl(): string {
  const internal =
    cleanEnv(process.env.DIRECTUS_INTERNAL_URL) ||
    cleanEnv(process.env.API_INTERNAL_URL);

  if (internal) return internal.replace(/\/$/, "");

  const raw =
    cleanEnv(process.env.DIRECTUS_URL) ||
    cleanEnv(process.env.NEXT_PUBLIC_DIRECTUS_URL) ||
    cleanEnv(process.env.NEXT_PUBLIC_API_URL) ||
    cleanEnv(process.env.NEXT_PUBLIC_BACKEND_URL);

  if (!raw) return "http://directus:8055";

  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://directus:8055";
  }
}

function resolveToken(): string | null {
  const token =
    cleanEnv(process.env.SERVICE_USER_TOKEN) ||
    cleanEnv(process.env.DIRECTUS_TOKEN) ||
    cleanEnv(process.env.DIRECTUS_STATIC_TOKEN) ||
    cleanEnv(process.env.API_TOKEN);

  return token || null;
}

const BACKEND_URL = resolveBackendUrl();
const TOKEN = resolveToken();

export const directusToken = TOKEN;
export const directusBackendUrl = BACKEND_URL;

export const directus: DirectusClient<DirectusSchema> &
  RestClient<DirectusSchema> &
  Partial<StaticTokenClient<DirectusSchema>> = TOKEN
  ? (createDirectus<DirectusSchema>(BACKEND_URL)
      .with(staticToken(TOKEN))
      .with(rest()) as DirectusClient<DirectusSchema> &
      RestClient<DirectusSchema> &
      StaticTokenClient<DirectusSchema>)
  : (createDirectus<DirectusSchema>(BACKEND_URL).with(
      rest(),
    ) as DirectusClient<DirectusSchema> &
      RestClient<DirectusSchema> &
      Partial<StaticTokenClient<DirectusSchema>>);

// import { createDirectus, rest, staticToken } from "@directus/sdk";

// const directusUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
// const apiKey = process.env.SERVICE_USER_TOKEN || "";

// export const directus = createDirectus(directusUrl)
//   .with(staticToken(apiKey))
//   .with(rest({ cache: "no-store" }));

// import { createDirectus, rest } from '@directus/sdk';

// export const directus = createDirectus(
//   process.env.NEXT_PUBLIC_BACKEND_URL as string
// ).with(rest({
//   auth: {
//     staticToken: process.env.SERVICE_USER_TOKEN as string,
//   },
// }));

// src/lib/directus.ts
// frontend-new/src/lib/directus.ts
// frontend-new/src/lib/directus.ts
// frontend-new/src/lib/directus.ts
import "server-only";

import {
  createDirectus,
  rest,
  staticToken,
  type DirectusClient,
  type RestClient,
  type StaticTokenClient,
} from "@directus/sdk";

type DirectusSchema = {
  // możesz zostawić minimalnie — Ty i tak robisz (readItems as any)
  brands: {
    id: string;
    name: string;
    slug?: string | null;
    logo?: string | null;
    description?: string | null;
    seo_description?: string | null;
  };
};

function cleanEnv(v: string | undefined): string {
  const s = (v ?? "").trim();
  if (!s) return "";
  if (s === "undefined" || s === "null") return "";
  return s;
}

/**
 * Server-side Directus SDK wymaga ABSOLUTNEGO URL.
 * Jeśli ktoś poda "/backend", to na serwerze to jest niepoprawne.
 */
function resolveBackendUrl(): string {
  const internal =
    cleanEnv(process.env.DIRECTUS_INTERNAL_URL) ||
    cleanEnv(process.env.API_INTERNAL_URL);

  if (internal) return internal.replace(/\/$/, "");

  const raw = cleanEnv(process.env.NEXT_PUBLIC_BACKEND_URL);
  if (!raw) return "http://directus:8055";

  try {
    return new URL(raw).toString().replace(/\/$/, "");
  } catch {
    return "http://directus:8055";
  }
}

function resolveToken(): string | null {
  const token = cleanEnv(process.env.SERVICE_USER_TOKEN);
  return token || null;
}

const BACKEND_URL = resolveBackendUrl();
const TOKEN = resolveToken();

const base = createDirectus<DirectusSchema>(BACKEND_URL).with(rest());

export const directus: DirectusClient<DirectusSchema> &
  RestClient<DirectusSchema> &
  Partial<StaticTokenClient<DirectusSchema>> = TOKEN
  ? (base.with(staticToken(TOKEN)) as DirectusClient<DirectusSchema> &
      RestClient<DirectusSchema> &
      StaticTokenClient<DirectusSchema>)
  : (base as DirectusClient<DirectusSchema> &
      RestClient<DirectusSchema> &
      Partial<StaticTokenClient<DirectusSchema>>);

// import { createDirectus, rest, staticToken } from "@directus/sdk";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
// const TOKEN = process.env.SERVICE_USER_TOKEN!;

// export const directus = createDirectus(BACKEND_URL)
//   .with(staticToken(TOKEN))
//   .with(rest());
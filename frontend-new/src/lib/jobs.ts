import "server-only";

import { readItems } from "@directus/sdk";
import { directus } from "./directus";

export type Job = {
  id: number;
  status: string;
  position: string;
  region: string | null;
  city: string | null;
  description: string | null;
  short_description: string | null;
  order: number | null;
  slug: string;
  date_updated?: string | null;
  aside?: string | null;
};

type DirectusJobItem = {
  id: number;
  status: string;
  position: string;
  region?: string | null;
  city?: string | null;
  description?: string | null;
  short_description?: string | null;
  order?: number | null;
  slug: string;
  date_updated?: string | null;
  aside?: string | null;
};

type DirectusJobSlugItem = {
  slug: string;
};

function mapJob(item: DirectusJobItem): Job {
  return {
    id: item.id,
    status: item.status,
    position: item.position,
    region: item.region ?? null,
    city: item.city ?? null,
    description: item.description ?? null,
    short_description: item.short_description ?? null,
    order: item.order ?? null,
    slug: item.slug,
    date_updated: item.date_updated ?? null,
    aside: item.aside ?? null,
  };
}

function isDirectusJobItem(value: unknown): value is DirectusJobItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "number" &&
    typeof item.status === "string" &&
    typeof item.position === "string" &&
    typeof item.slug === "string"
  );
}

function isDirectusJobSlugItem(value: unknown): value is DirectusJobSlugItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;
  return typeof item.slug === "string";
}

function toJobItems(value: unknown): DirectusJobItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isDirectusJobItem);
}

function toJobSlugItems(value: unknown): DirectusJobSlugItem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isDirectusJobSlugItem);
}

const recruitmentFields = [
  "id",
  "status",
  "position",
  "region",
  "city",
  "description",
  "short_description",
  "order",
  "slug",
  "date_updated",
  "aside",
] as const;

export async function getJobs(): Promise<Job[]> {
  try {
    const response = await directus.request(
      readItems("Recruitments" as never, {
        fields: [...recruitmentFields] as never,
        filter: {
          status: {
            _eq: "published",
          },
        },
        sort: ["order", "-date_updated"] as never,
      }) as Parameters<typeof directus.request>[0]
    );

    return toJobItems(response).map(mapJob);
  } catch (error) {
    console.error("Błąd podczas pobierania ofert pracy z Directusa:", error);
    return [];
  }
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  try {
    const response = await directus.request(
      readItems("Recruitments" as never, {
        fields: [...recruitmentFields] as never,
        filter: {
          _and: [
            {
              status: {
                _eq: "published",
              },
            },
            {
              slug: {
                _eq: slug,
              },
            },
          ],
        },
        limit: 1,
      }) as Parameters<typeof directus.request>[0]
    );

    const job = toJobItems(response)[0];
    return job ? mapJob(job) : null;
  } catch (error) {
    console.error("Błąd podczas pobierania oferty pracy po slug:", error);
    return null;
  }
}

export async function getJobSlugs(): Promise<{ slug: string }[]> {
  try {
    const response = await directus.request(
      readItems("Recruitments" as never, {
        fields: ["slug"] as never,
        filter: {
          status: {
            _eq: "published",
          },
        },
      }) as Parameters<typeof directus.request>[0]
    );

    return toJobSlugItems(response).filter((item) => item.slug.trim().length > 0);
  } catch (error) {
    console.error("Błąd podczas pobierania slugów ofert pracy:", error);
    return [];
  }
}
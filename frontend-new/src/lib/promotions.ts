import { readItems } from "@directus/sdk";
import { directus } from "./directus";

export type PromotionComponent = {
  id: number;
  sort?: number | null;
  collection: string;
  item: Record<string, unknown> | null;
};

export type PromotionItem = {
  id: number;
  name?: string | null;
  slug?: string | null;
  status?: string | null;
  date_created?: string | null;
  components_promotions?: PromotionComponent[];
};

const listFields = [
  "id",
  "name",
  "slug",
  "components_promotions.id",
  "components_promotions.sort",
  "components_promotions.collection",
  "components_promotions.item",
  "components_promotions.item.*",
] as const;

const detailFields = [
  ...listFields,
  "status",
  "date_created",
  "components_promotions.item.item.*",
  "components_promotions.item.items.*",
  "components_promotions.item.key_value.*",
  "components_promotions.item.info.*",
  "components_promotions.item.logo.*",
  "components_promotions.item.agenda.*",
  "components_promotions.item.speakers.*",
  "components_promotions.item.speakers.speakers_id.*",
  "components_promotions.item.collection.*",
  "components_promotions.item.collection.consultants_id.*",
] as const;

function normalize<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    Array.isArray((res as { data?: unknown }).data)
  ) {
    return (res as { data: T[] }).data;
  }

  return [];
}

function logDirectusError(label: string, error: unknown) {
  console.error(label, JSON.stringify(error, null, 2));

  if (error instanceof Error) {
    console.error(`${label} message:`, error.message);
  }
}

export async function getPromotions() {
  try {
    const res = await directus.request(
      readItems("promotions", {
        fields: [...listFields],
        limit: -1,
      })
    );

    return normalize<PromotionItem>(res);
  } catch (error) {
    logDirectusError("getPromotions error:", error);
    return [];
  }
}

export async function getPromotionsSlugs() {
  try {
    const res = await directus.request(
      readItems("promotions", {
        fields: ["slug"],
        limit: -1,
      })
    );

    return normalize<{ slug: string }>(res);
  } catch (error) {
    logDirectusError("getPromotionsSlugs error:", error);
    return [];
  }
}

export async function getPromotionBySlug(slug: string) {
  try {
    const res = await directus.request(
      readItems("promotions", {
        fields: [...detailFields],
        filter: {
          slug: {
            _eq: slug,
          },
        },
        limit: 1,
      })
    );

    return normalize<PromotionItem>(res)[0] ?? null;
  } catch (error) {
    logDirectusError("getPromotionBySlug error:", error);
    return null;
  }
}
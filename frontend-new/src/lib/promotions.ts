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
  seo_title?: string | null;
  seo_description?: string | null;
  slug?: string | null;
  status?: string | null;
  date_created?: string | null;
  components_promotions?: PromotionComponent[];
};

const listFields = [
  "id",
  "name",
  "seo_title",
  "seo_description",
  "slug",

  "components_promotions.id",
  "components_promotions.sort",
  "components_promotions.collection",
  "components_promotions.item",
  "components_promotions.item.*",

  // hero_section
  "components_promotions.item:hero_section.title",
  "components_promotions.item:hero_section.image",
  "components_promotions.item:hero_section.background_image",

  // rich_content
  "components_promotions.item:rich_content.header_type",
  "components_promotions.item:rich_content.heading_styles",
  "components_promotions.item:rich_content.subtitle_type",
  "components_promotions.item:rich_content.subtitle_styles",
] as const;

const detailFields = [
  ...listFields,

  "status",
  "date_created",

  // hero_section
  "components_promotions.item:hero_section.title",
  "components_promotions.item:hero_section.subtitle",
  "components_promotions.item:hero_section.button_label",
  "components_promotions.item:hero_section.button_url",
  "components_promotions.item:hero_section.image",
  "components_promotions.item:hero_section.background_image",
  "components_promotions.item:hero_section.variant",
  "components_promotions.item:hero_section.content_position",
  "components_promotions.item:hero_section.image_vertical_align",
  "components_promotions.item:hero_section.image_fit",

  // rich_content
  "components_promotions.item:rich_content.title",
  "components_promotions.item:rich_content.subtitle",
  "components_promotions.item:rich_content.content",
  "components_promotions.item:rich_content.image",
  "components_promotions.item:rich_content.layout",
  "components_promotions.item:rich_content.text_button",
  "components_promotions.item:rich_content.url_button",

  // repeaters
  "components_promotions.item.item.*",
  "components_promotions.item.items.*",
  "components_promotions.item.key_value.*",
  "components_promotions.item.info.*",

  // logos
  "components_promotions.item.logo.*",

  // agenda
  "components_promotions.item.agenda.*",
  "components_promotions.item.agenda.agenda_id.*",
  "components_promotions.item.agenda.agenda_id.speakers.*",

  // speakers
  "components_promotions.item.speakers.*",
  "components_promotions.item.speakers.speakers_id.*",

  // consultants
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

export function getPromotionHeroTitle(promo: PromotionItem) {
  const components = Array.isArray(promo.components_promotions)
    ? promo.components_promotions
    : [];

  const hero = components.find(
    (component) => component.collection === "hero_section"
  );

  const title = hero?.item?.title;

  return typeof title === "string" && title.trim() ? title.trim() : null;
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

    const item = normalize<PromotionItem>(res)[0] ?? null;

    return item;
  } catch (error) {
    logDirectusError("getPromotionBySlug error:", error);
    return null;
  }
}

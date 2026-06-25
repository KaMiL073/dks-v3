import "server-only";

import { readFieldsByCollection, readItems } from "@directus/sdk";

import { directus } from "@/lib/directus";

export type OfferPageDescription = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  leftColumn?: string;
  rightColumn?: string;
};

type FieldRow = {
  field?: unknown;
};

type TextFieldRow = {
  identifier?: unknown;
  content?: unknown;
};

function pickString(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return undefined;
}

function pickFirstField(fields: Set<string>, candidates: string[]) {
  return candidates.find((field) => fields.has(field));
}

function pickValue(row: Record<string, unknown>, field?: string) {
  return field ? pickString(row[field]) : undefined;
}

function pickTextField(row: Record<string, unknown>, identifiers: string[]) {
  const textFields = row.text_fields;
  if (!Array.isArray(textFields)) return undefined;

  const normalized = new Set(identifiers.map((identifier) => identifier.toLowerCase()));

  for (const item of textFields) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;

    const textField = item as TextFieldRow;
    const identifier = pickString(textField.identifier)?.toLowerCase();

    if (!identifier || !normalized.has(identifier)) continue;

    const content = pickString(textField.content);
    if (content) return content;
  }

  return undefined;
}

function expandPathVariants(values: string[]) {
  const variants = new Set<string>();

  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed) continue;

    variants.add(trimmed);

    const withoutLeadingSlash = trimmed.replace(/^\/+/, "");
    if (withoutLeadingSlash) {
      variants.add(withoutLeadingSlash);
      variants.add(`/${withoutLeadingSlash}`);
    }
  }

  return Array.from(variants);
}

export function mergeOfferPageDescription(
  primary?: OfferPageDescription,
  fallback?: OfferPageDescription
): OfferPageDescription | undefined {
  const merged: OfferPageDescription = {
    title: primary?.title || fallback?.title,
    seoTitle: primary?.seoTitle || fallback?.seoTitle,
    seoDescription: primary?.seoDescription || fallback?.seoDescription,
    leftColumn: primary?.leftColumn || fallback?.leftColumn,
    rightColumn: primary?.rightColumn || fallback?.rightColumn,
  };

  return Object.values(merged).some(Boolean) ? merged : undefined;
}

export async function getOfferPageDescription(
  slug: string | string[]
): Promise<OfferPageDescription | undefined> {
  try {
    const slugValues = expandPathVariants(
      (Array.isArray(slug) ? slug : [slug])
      .map((value) => value.trim())
        .filter(Boolean)
    );

    if (slugValues.length === 0) return undefined;

    const fieldsRaw = await directus.request(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (readFieldsByCollection as any)("pages")
    );

    const rows: FieldRow[] = Array.isArray(fieldsRaw) ? (fieldsRaw as FieldRow[]) : [];
    const fields = new Set(
      rows
        .map((row) => pickString(row.field))
        .filter((field): field is string => Boolean(field))
    );

    const slugField = pickFirstField(fields, [
      "slug",
      "link",
      "url",
      "path",
      "permalink",
      "full_slug",
    ]);
    if (!slugField) return undefined;

    const titleField = pickFirstField(fields, ["name", "heading", "page_title"]);
    const seoTitleField = pickFirstField(fields, [
      "title",
      "seo_title",
      "seoTitle",
      "meta_title",
      "metaTitle",
    ]);
    const seoDescriptionField = pickFirstField(fields, [
      "seo_description",
      "seoDescription",
      "meta_description",
      "metaDescription",
      "description",
    ]);
    const leftColumnField = pickFirstField(fields, [
      "left_column",
      "leftColumn",
      "description_left",
      "descriptionLeft",
      "content_left",
      "contentLeft",
      "content",
      "body",
    ]);
    const rightColumnField = pickFirstField(fields, [
      "right_column",
      "rightColumn",
      "description_right",
      "descriptionRight",
      "content_right",
      "contentRight",
    ]);
    const textFieldsField = fields.has("text_fields") ? "text_fields.*" : undefined;
    const statusField = fields.has("status") ? "status" : undefined;

    const requestedFields = Array.from(
      new Set(
        [
          slugField,
          titleField,
          seoTitleField,
          seoDescriptionField,
          leftColumnField,
          rightColumnField,
          textFieldsField,
          statusField,
        ].filter((field): field is string => Boolean(field))
      )
    );

    let page: Record<string, unknown> | undefined;

    for (const slugValue of slugValues) {
      const filter: Record<string, unknown> = {
        [slugField]: { _eq: slugValue },
      };

      if (statusField) {
        filter[statusField] = { _eq: "published" };
      }

      const dataRaw = await directus.request(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (readItems as any)("pages", {
          fields: requestedFields,
          filter,
          sort: fields.has("date_updated") ? ["-date_updated"] : undefined,
          limit: 1,
        })
      );

      const items: Record<string, unknown>[] = Array.isArray(dataRaw)
        ? (dataRaw as Record<string, unknown>[])
        : [];

      page = items[0];
      if (page) break;
    }

    if (!page) return undefined;

    return {
      title: pickValue(page, titleField),
      seoTitle: pickValue(page, seoTitleField),
      seoDescription: pickValue(page, seoDescriptionField),
      leftColumn:
        pickTextField(page, ["leftColumn", "left_column", "left", "lewa_kolumna"]) ||
        pickValue(page, leftColumnField),
      rightColumn:
        pickTextField(page, ["rightColumn", "right_column", "right", "prawa_kolumna"]) ||
        pickValue(page, rightColumnField),
    };
  } catch {
    return undefined;
  }
}

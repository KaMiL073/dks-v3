// frontend-new/src/lib/fields.ts

import "server-only";

const DIRECTUS_URL =
  process.env.API_INTERNAL_URL ||
  process.env.DIRECTUS_INTERNAL_URL ||
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://directus:8055";

const DIRECTUS_TOKEN =
  process.env.SERVICE_USER_TOKEN ||
  process.env.DIRECTUS_TOKEN ||
  process.env.DIRECTUS_STATIC_TOKEN ||
  process.env.API_TOKEN;

const BLOCKED_FIELDS = [
  "id",
  "status",
  "sort",
  "user_created",
  "date_created",
  "user_updated",
  "date_updated",
];

const LANG = "pl-PL";

type DirectusTranslation = {
  language?: string;
  translation?: string;
};

type DirectusChoice = {
  text?: string;
  value?: string;
};

type DirectusField = {
  field?: string;
  type?: string;
  meta?: {
    interface?: string;
    readonly?: boolean;
    hidden?: boolean;
    required?: boolean;
    sort?: number;
    note?: string | null;
    display?: string | null;
    group?: string | null;
    special?: string[] | null;
    translations?: DirectusTranslation[] | null;
    options?: {
      choices?: DirectusChoice[];
    } | null;
  } | null;
  schema?: {
    is_nullable?: boolean;
    default_value?: string | number | boolean | null;
  } | null;
};

export type MappedDirectusField = {
  name: string;
  displayName: string;
  interface: string;
  type?: string;
  required: boolean;
  hidden: boolean;
  value: string;
  options: {
    text: string;
    value: string;
  }[];
};

export type MappedDirectusFieldGroup = {
  key: string;
  displayName: string;
  sort: number;
  fields: MappedDirectusField[];
};

function getTranslation(field: DirectusField) {
  return field.meta?.translations?.find(
    (translation) => translation.language === LANG
  )?.translation;
}

function getDisplayName(field: DirectusField) {
  const translation = getTranslation(field);

  return (
    translation ||
    field.meta?.note ||
    field.meta?.display ||
    field.field ||
    ""
  );
}

function mapOptions(field: DirectusField) {
  const choices = field.meta?.options?.choices ?? [];

  return choices.map((choice) => ({
    text: String(choice.text ?? choice.value ?? ""),
    value: String(choice.value ?? choice.text ?? ""),
  }));
}

function isGroupField(field: DirectusField) {
  return (
    field.type === "alias" ||
    field.meta?.special?.includes("group") ||
    field.meta?.interface === "group-detail" ||
    field.meta?.interface === "group-accordion"
  );
}

function mapField(field: DirectusField): MappedDirectusField {
  return {
    name: field.field ?? "",
    displayName: getDisplayName(field),
    interface: field.meta?.interface || "input",
    type: field.type,
    required:
      field.meta?.required === true || field.schema?.is_nullable === false,
    hidden: field.meta?.hidden === true,
    value:
      field.schema?.default_value === null ||
      field.schema?.default_value === undefined
        ? ""
        : String(field.schema.default_value),
    options: mapOptions(field),
  };
}

async function getDirectusFields(collection: string): Promise<DirectusField[]> {
  try {
    const url = `${DIRECTUS_URL.replace(/\/$/, "")}/fields/${collection}?limit=-1`;

    const response = await fetch(url, {
      headers: DIRECTUS_TOKEN
        ? {
            Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          }
        : {},
      cache: "no-store",
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("getDirectusFields failed:", {
        collection,
        status: response.status,
        body: text,
      });

      return [];
    }

    const json: { data?: DirectusField[] } = await response.json();

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error(`getDirectusFields(${collection}) error:`, error);
    return [];
  }
}

export async function getFields(
  collection: string
): Promise<MappedDirectusField[]> {
  const allFields = await getDirectusFields(collection);

  return allFields
    .filter((field) => {
      if (!field.field) return false;
      if (BLOCKED_FIELDS.includes(field.field)) return false;
      if (field.meta?.readonly) return false;
      if (field.meta?.hidden) return false;
      if (isGroupField(field)) return false;

      return true;
    })
    .sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0))
    .map(mapField);
}

export async function getGroupedFields(
  collection: string
): Promise<MappedDirectusFieldGroup[]> {
  const allFields = await getDirectusFields(collection);

  const groups = allFields
    .filter((field) => field.field && isGroupField(field))
    .sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0))
    .map((field) => ({
      key: field.field ?? "",
      displayName: getDisplayName(field),
      sort: field.meta?.sort ?? 0,
      fields: [] as MappedDirectusField[],
    }));

  const normalFields = allFields
    .filter((field) => {
      if (!field.field) return false;
      if (BLOCKED_FIELDS.includes(field.field)) return false;
      if (field.meta?.readonly) return false;
      if (field.meta?.hidden) return false;
      if (isGroupField(field)) return false;

      return true;
    })
    .sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0));

  for (const field of normalFields) {
    const mappedField = mapField(field);
    const groupKey = field.meta?.group;

    if (!groupKey) {
      let ungrouped = groups.find((group) => group.key === "ungrouped");

      if (!ungrouped) {
        ungrouped = {
          key: "ungrouped",
          displayName: "Pozostałe",
          sort: 9999,
          fields: [],
        };

        groups.push(ungrouped);
      }

      ungrouped.fields.push(mappedField);
      continue;
    }

    const group = groups.find((item) => item.key === groupKey);

    if (!group) {
      groups.push({
        key: groupKey,
        displayName: groupKey,
        sort: 9999,
        fields: [mappedField],
      });

      continue;
    }

    group.fields.push(mappedField);
  }

  return groups
    .filter((group) => group.fields.length > 0)
    .sort((a, b) => a.sort - b.sort);
}
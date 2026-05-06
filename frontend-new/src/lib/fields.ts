const DIRECTUS_URL =
  process.env.API_INTERNAL_URL ||
  process.env.DIRECTUS_URL ||
  process.env.NEXT_PUBLIC_API_URL;

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

export async function getFields(collection: string) {
  if (!DIRECTUS_URL) return [];

  try {
    const res = await fetch(`${DIRECTUS_URL}/fields/${collection}`, {
      headers: DIRECTUS_TOKEN
        ? {
            Authorization: `Bearer ${DIRECTUS_TOKEN}`,
          }
        : {},
      cache: "no-store",
    });

    if (!res.ok) {
      console.warn("Fields fetch failed:", res.status);
      return [];
    }

    const json: { data?: DirectusField[] } = await res.json();

    return (json.data ?? [])
      .filter((field) => {
        if (!field.field) return false;
        if (BLOCKED_FIELDS.includes(field.field)) return false;
        if (field.meta?.readonly) return false;

        return true;
      })
      .sort((a, b) => (a.meta?.sort ?? 0) - (b.meta?.sort ?? 0))
      .map((field) => ({
        name: field.field ?? "",
        displayName: getDisplayName(field),
        interface: field.meta?.interface || "input",
        type: field.type,
        required:
          field.meta?.required === true ||
          field.schema?.is_nullable === false,
        hidden: field.meta?.hidden === true,
        value:
          field.schema?.default_value === null ||
          field.schema?.default_value === undefined
            ? ""
            : String(field.schema.default_value),
        options: mapOptions(field),
      }));
  } catch (error) {
    console.error("getFields error:", error);
    return [];
  }
}
// frontend-new/src/lib/fields.ts

import "server-only";

import {
  readCollections,
  readFieldsByCollection,
  withToken,
} from "@directus/sdk";
import { directus, directusToken } from "@/lib/directus";

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
  languages_code?: string;
  code?: string;
  translation?: string;
};

type DirectusChoice = {
  label?: string;
  name?: string;
  text?: string;
  value?: string;
  translations?: DirectusTranslation[] | null;
};

type DirectusField = {
  collection?: string;
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
      choices?: DirectusChoice[] | null;
      items?: DirectusChoice[] | null;
      options?: DirectusChoice[] | null;
    } | null;
  } | null;
  schema?: {
    is_nullable?: boolean;
    default_value?: string | number | boolean | null;
  } | null;
};

type DirectusCollection = {
  collection?: string;
  meta?: {
    note?: string | null;
    display_template?: string | null;
    translations?:
      | {
          language?: string;
          translation?: string;
        }[]
      | null;
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

function fallbackField(
  name: string,
  displayName: string,
  options: Partial<MappedDirectusField> = {}
): MappedDirectusField {
  return {
    name,
    displayName,
    interface: "input",
    type: "string",
    required: true,
    hidden: false,
    value: "",
    options: [],
    ...options,
  };
}

export const debtCollectionFallbackFields: MappedDirectusFieldGroup[] = [
  {
    key: "contact",
    displayName: "Dane kontaktowe",
    sort: 1,
    fields: [
      fallbackField("name", "Osoba kontaktowa"),
      fallbackField("nip", "NIP"),
      fallbackField("email", "E-mail"),
      fallbackField("phone", "Telefon"),
    ],
  },
  {
    key: "message",
    displayName: "Wiadomość",
    sort: 2,
    fields: [
      fallbackField("message", "Wiadomość", {
        interface: "input-multiline",
      }),
    ],
  },
];

export const complaintFallbackFields: MappedDirectusFieldGroup[] = [
  {
    key: "contact_Information",
    displayName: "Informacje Kontaktowe",
    sort: 1,
    fields: [
      fallbackField("full_name", "Imię i nazwisko"),
      fallbackField("email", "E-mail"),
      fallbackField("phone", "Telefon"),
      fallbackField("company_name", "Firma"),
      fallbackField("topics", "Temat"),
    ],
  },
  {
    key: "Hicopy_Distribution_Complaint_Submission_Form",
    displayName: "Formularz zgłoszenia reklamacyjnego Hicopy Distribution",
    sort: 2,
    fields: [
      fallbackField("Producent", "Producent", {
        interface: "select-dropdown",
      }),
      fallbackField(
        "device_model",
        "Nazwa / model reklamowanego urządzenia"
      ),
      fallbackField("serial_number", "Numer seryjny"),
      fallbackField("firmware_version", "Wersja firmware"),
      fallbackField("purchase_invoice_number", "Numer faktury"),
    ],
  },
  {
    key: "application_details",
    displayName: "Szczegóły zgłoszenia",
    sort: 3,
    fields: [
      fallbackField("title", "Temat zgłoszenia"),
      fallbackField("description", "Opis problemu", {
        interface: "input-multiline",
        required: false,
      }),
      fallbackField("files", "Załączniki", {
        interface: "files",
        required: false,
      }),
    ],
  },
  {
    key: "Device_Information",
    displayName: "Informacje o urządzeniu",
    sort: 4,
    fields: [
      fallbackField("counter", "Licznik"),
      fallbackField("installation_date", "Data instalacji"),
      fallbackField("issue_date", "Data wystąpienia problemu"),
    ],
  },
  {
    key: "Return_Shipping_Address",
    displayName: "Adres wysyłki zwrotnej",
    sort: 5,
    fields: [
      fallbackField("return_company", "Firma"),
      fallbackField("return_full_name", "Osoba kontaktowa"),
      fallbackField("return_phone", "Telefon", {
        required: false,
      }),
      fallbackField("return_address", "Adres", {
        interface: "input-multiline",
      }),
    ],
  },
];

function getTranslation(field: DirectusField) {
  const translations = field.meta?.translations ?? [];

  return translations.find((translation) => {
    const language =
      translation.language || translation.languages_code || translation.code;

    return language === LANG || language === "pl_PL" || language === "pl";
  })?.translation;
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
  const choices =
    field.meta?.options?.choices ??
    field.meta?.options?.items ??
    field.meta?.options?.options ??
    [];

  return choices
    .map((choice) => {
      const translatedText = choice.translations?.find((translation) => {
        const language =
          translation.language || translation.languages_code || translation.code;

        return language === LANG || language === "pl_PL" || language === "pl";
      })?.translation;

      const text = String(
        translatedText ??
        choice.text ??
        choice.label ??
        choice.name ??
        choice.value ??
        ""
      );

      const value = String(
        choice.value ?? choice.text ?? choice.label ?? choice.name ?? ""
      );

      return {
        text,
        value,
      };
    })
    .filter((choice) => choice.text && choice.value);
}

function isGroupField(field: DirectusField) {
  return (
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
    const command = readFieldsByCollection(collection);
    const response = await directus.request(
      directusToken ? withToken(directusToken, command) : command
    );

    return Array.isArray(response) ? (response as DirectusField[]) : [];
  } catch (error) {
    console.error(
      `getDirectusFields(${collection}) error:`,
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

async function getDirectusCollections(): Promise<DirectusCollection[]> {
  try {
    const command = readCollections();
    const response = await directus.request(
      directusToken ? withToken(directusToken, command) : command
    );

    return Array.isArray(response)
      ? (response as DirectusCollection[])
      : [];
  } catch (error) {
    console.error(
      "getDirectusCollections error:",
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

function normalizeSearchValue(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l");
}

function collectionMatchesTerms(
  collection: DirectusCollection,
  terms: string[]
) {
  const values = [
    collection.collection,
    collection.meta?.note,
    collection.meta?.display_template,
    ...(collection.meta?.translations?.map(
      (translation) => translation.translation
    ) ?? []),
  ]
    .filter((value): value is string => Boolean(value))
    .map(normalizeSearchValue);

  return terms.some((term) => {
    const normalizedTerm = normalizeSearchValue(term);

    return values.some((value) => value.includes(normalizedTerm));
  });
}

function shouldRenderField(field: DirectusField) {
  if (!field.field) return false;
  if (BLOCKED_FIELDS.includes(field.field)) return false;
  if (field.meta?.readonly) return false;
  if (field.meta?.hidden) return false;
  if (isGroupField(field)) return false;

  return true;
}

export async function getFields(
  collection: string
): Promise<MappedDirectusField[]> {
  const allFields = await getDirectusFields(collection);

  return allFields
    .filter(shouldRenderField)
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
    .filter(shouldRenderField)
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

export async function getFirstGroupedFields(
  collections: string[],
  searchTerms: string[] = []
): Promise<MappedDirectusFieldGroup[]> {
  for (const collection of collections) {
    const groups = await getGroupedFields(collection);

    if (groups.length > 0) {
      return groups;
    }
  }

  if (searchTerms.length > 0) {
    const directusCollections = await getDirectusCollections();

    const matchedCollections = directusCollections
      .filter((collection) => collectionMatchesTerms(collection, searchTerms))
      .map((collection) => collection.collection)
      .filter((collection): collection is string => Boolean(collection));

    for (const collection of matchedCollections) {
      if (collections.includes(collection)) continue;

      const groups = await getGroupedFields(collection);

      if (groups.length > 0) {
        return groups;
      }
    }
  }

  return [];
}

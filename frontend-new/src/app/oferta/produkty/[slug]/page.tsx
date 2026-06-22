import "server-only";

import { notFound } from "next/navigation";
import { readFieldsByCollection } from "@directus/sdk";
import type { Metadata } from "next";

import ProductPage from "@/app/oferta/[category]/[...slug]/ProductPage";
import { directus } from "@/lib/directus";
import { getProductBySlug, type Product as LibProduct } from "@/lib/products";

interface ProductImage {
  directus_files_id?: string | { id?: string } | null;
  url?: string;
  backend_url?: string;
  backend_url_small?: string;
}

interface ProductFile {
  id?: string;
  filename_download?: string;
  directus_files_id?: string | { id?: string; filename_download?: string };
}

interface ProductComponent {
  collection: string;
  item: Record<string, unknown>;
}

interface ProductTypeItem {
  collection?: string;
  item?: Record<string, unknown>;
}

interface Product {
  id: string | number;
  model?: string;
  slug?: string;
  seo_title?: string;
  seo_description?: string;
  description?: string;
  short_description?: string;
  price?: number;
  primarycategory?: string | null;
  main_image?: string | { id?: string } | null;
  images?: ProductImage[];
  brand?: { name?: string; id?: string };
  type?: ProductTypeItem[];
  components?: ProductComponent[];
  files?: ProductFile[];
}

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

interface DirectusFieldMetaTranslation {
  language?: string;
  translation?: string;
}

interface DirectusFieldChoice {
  text?: string;
  value?: string;
}

interface DirectusFieldMeta {
  hidden?: boolean;
  translations?: DirectusFieldMetaTranslation[] | null;
  options?: {
    choices?: DirectusFieldChoice[] | null;
  } | null;
}

interface DirectusFieldRow {
  field?: string;
  meta?: DirectusFieldMeta | null;
}

type DirectusRequestArg = Parameters<typeof directus.request>[0];

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

function toPlainText(input?: unknown, maxLen = 300): string {
  const str = typeof input === "string" ? input : "";
  if (!str) return "";

  const noHtml = str
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<\/?[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return noHtml.length > maxLen ? `${noHtml.slice(0, maxLen - 1)}…` : noHtml;
}

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_\s-]+/g, "");
}

function normalizeMainImage(mainImage: LibProduct["main_image"]): Product["main_image"] {
  if (!mainImage) return null;

  if (typeof mainImage === "string") {
    return mainImage;
  }

  if (
    typeof mainImage === "object" &&
    mainImage !== null &&
    typeof mainImage.id === "string"
  ) {
    return { id: mainImage.id };
  }

  return null;
}

function normalizeImages(images: LibProduct["images"]): ProductImage[] {
  if (!Array.isArray(images)) return [];

  return images
    .map((image): ProductImage | null => {
      if (!image) return null;

      return {
        directus_files_id: image.directus_files_id,
      };
    })
    .filter((image): image is ProductImage => image !== null);
}

function normalizeFiles(files: LibProduct["files"]): ProductFile[] {
  if (!Array.isArray(files)) return [];

  return files
    .map((file): ProductFile | null => {
      if (!file) return null;

      return {
        directus_files_id: file.directus_files_id,
      };
    })
    .filter((file): file is ProductFile => file !== null);
}

function normalizeComponents(components: LibProduct["components"]): ProductComponent[] {
  if (!Array.isArray(components)) return [];

  return components
    .map((component): ProductComponent | null => {
      if (!component) return null;
      if (typeof component.collection !== "string" || !component.collection.trim()) {
        return null;
      }
      if (!component.item || typeof component.item !== "object") return null;

      return {
        collection: component.collection,
        item: component.item,
      };
    })
    .filter((component): component is ProductComponent => component !== null);
}

function normalizeType(type: LibProduct["type"]): ProductTypeItem[] {
  if (!Array.isArray(type)) return [];

  return type
    .map((entry): ProductTypeItem | null => {
      if (!entry) return null;

      const collection = pickString(entry.collection);
      const item =
        entry.item && typeof entry.item === "object"
          ? (entry.item as Record<string, unknown>)
          : undefined;

      if (!collection && !item) return null;

      return {
        collection,
        item,
      };
    })
    .filter((entry): entry is ProductTypeItem => entry !== null);
}

function normalizeProduct(product: LibProduct): Product {
  return {
    id: product.id,
    model: product.model,
    slug: product.slug,
    seo_title: product.seo_title,
    seo_description: product.seo_description,
    description: product.description,
    short_description: product.short_description,
    price: product.price,
    primarycategory: product.primarycategory ?? null,
    main_image: normalizeMainImage(product.main_image),
    images: normalizeImages(product.images),
    brand: product.brand
      ? {
          id: product.brand.id,
          name: product.brand.name,
        }
      : undefined,
    type: normalizeType(product.type),
    components: normalizeComponents(product.components),
    files: normalizeFiles(product.files),
  };
}

function getPolishTranslation(meta?: DirectusFieldMeta | null): string | undefined {
  const translations = Array.isArray(meta?.translations) ? meta.translations : [];

  const polish = translations.find((entry) => {
    const lang = normalize(entry?.language);
    return lang === "plpl" || lang === "pl";
  });

  if (polish?.translation?.trim()) {
    return polish.translation.trim();
  }

  const firstAvailable = translations.find(
    (entry) => typeof entry?.translation === "string" && entry.translation.trim()
  );

  if (firstAvailable?.translation?.trim()) {
    return firstAvailable.translation.trim();
  }

  return undefined;
}

function isIgnoredField(field: string): boolean {
  return new Set([
    "id",
    "status",
    "sort",
    "user_created",
    "date_created",
    "user_updated",
    "date_updated",
    "category",
    "devices",
    "collection",
  ]).has(field);
}

async function fetchFieldsForCollection(collection: string): Promise<FilterField[]> {
  const response = await directus.request(
    readFieldsByCollection(collection) as DirectusRequestArg
  );

  const rows = Array.isArray(response) ? (response as DirectusFieldRow[]) : [];

  return rows
    .map((row): FilterField | null => {
      const field = pickString(row.field);
      if (!field || isIgnoredField(field)) return null;
      if (row.meta?.hidden) return null;

      const label = getPolishTranslation(row.meta) ?? field;

      const rawChoices = Array.isArray(row.meta?.options?.choices)
        ? row.meta.options.choices
        : [];

      const options = rawChoices
        .map((choice) => {
          const text = pickString(choice?.text);
          const value = pickString(choice?.value);

          if (!text || !value) return null;
          return { text, value };
        })
        .filter((option): option is { text: string; value: string } => option !== null);

      return {
        field,
        label,
        ...(options.length ? { options } : {}),
      };
    })
    .filter((filter): filter is FilterField => filter !== null);
}

function scoreCollectionAgainstItem(
  filters: FilterField[],
  item: Record<string, unknown>
): number {
  const itemKeys = Object.keys(item).map((key) => normalize(key));

  return filters.reduce((acc, filter) => {
    return acc + (itemKeys.includes(normalize(filter.field)) ? 1 : 0);
  }, 0);
}

function collectionPriority(collection: string): number {
  const priorities: Record<string, number> = {
    printers_and_multifunction_devices: 100,
    laptops: 90,
    wide_format: 80,
    supplies: 70,
    office_solutions: 10,
  };

  return priorities[collection] ?? 0;
}

async function getFiltersMeta(product: Product): Promise<FilterField[]> {
  const typeEntries = Array.isArray(product.type) ? product.type : [];

  const candidates = typeEntries
    .map((entry) => {
      const collection = pickString(entry.collection);
      const item =
        entry.item && typeof entry.item === "object"
          ? (entry.item as Record<string, unknown>)
          : null;

      if (!collection || !item) return null;

      return { collection, item };
    })
    .filter(
      (entry): entry is { collection: string; item: Record<string, unknown> } => entry !== null
    );

  if (candidates.length === 0) {
    return [];
  }

  let bestFilters: FilterField[] = [];
  let bestScore = -1;
  let bestPriority = -1;

  for (const candidate of candidates) {
    try {
      const allFilters = await fetchFieldsForCollection(candidate.collection);

      const matchingFilters = allFilters.filter((filter) =>
        Object.keys(candidate.item).some((key) => normalize(key) === normalize(filter.field))
      );

      const score = scoreCollectionAgainstItem(matchingFilters, candidate.item);
      const priority = collectionPriority(candidate.collection);

      const shouldReplace =
        score > bestScore || (score === bestScore && priority > bestPriority);

      if (shouldReplace) {
        bestScore = score;
        bestPriority = priority;
        bestFilters = matchingFilters;
      }
    } catch {
      // pomijamy kolekcję, jeśli Directus nie zwróci pól
    }
  }

  return bestFilters;
}

type PageParams = {
  slug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produkt DKS",
      description: "Poznaj szczegóły produktu w ofercie DKS.",
    };
  }

  const title = product.seo_title?.trim() || product.model || "Produkt DKS";
  const description =
    toPlainText(product.seo_description, 155) ||
    toPlainText(product.short_description, 155) ||
    toPlainText(product.description, 155) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ProductSlugPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const normalizedProduct = normalizeProduct(product);
  const filtersMeta = await getFiltersMeta(normalizedProduct);

  return <ProductPage product={normalizedProduct} filtersMeta={filtersMeta} />;
}

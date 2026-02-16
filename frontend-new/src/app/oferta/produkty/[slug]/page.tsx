// frontend-new/src/app/oferta/produkty/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { getProductBySlug } from "@/lib/products";
import ProductPage from "@/app/oferta/[category]/[...slug]/ProductPage";
import JsonLd from "@/components/seo/JsonLd";

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

type ProductLike = {
  id: string | number;
  slug?: string;
  model?: string;
  short_description?: unknown;
  description?: unknown;
  seo_description?: unknown;
  primarycategory?: string | null;
  brand?: { name?: string };
  category?: { name?: string; title?: string };
  category_name?: string;
  main_image?: unknown;
  type?: { collection?: string; item?: Record<string, unknown> }[];
};

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");

function absUrl(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${BASE_URL}${path}`;
}

function directusAssetUrl(assetId: string, params?: string) {
  const qs = params ? (params.startsWith("?") ? params : `?${params}`) : "";
  return `${BASE_URL}/backend/assets/${assetId}${qs}`;
}

function directusOgImage(assetId: string) {
  return directusAssetUrl(assetId, "fit=cover&width=1200&height=630");
}

async function getRequestBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  // SSR w dockerze: nie uderzaj w localhost
  if (!host || host.includes("localhost")) return "http://proxy";
  return `${proto}://${host}`;
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

function getCategoryString(product: ProductLike): string | undefined {
  const candidates = [
    product?.category?.name,
    product?.category?.title,
    product?.category_name,
    product?.primarycategory ?? undefined,
  ];
  return candidates.find((v) => typeof v === "string" && v.trim().length > 0)?.trim();
}

function getMainImageId(product: ProductLike): string | undefined {
  const mi: any = product?.main_image;

  if (typeof mi === "string" && mi.trim()) return mi.trim();
  if (mi?.id && typeof mi.id === "string") return mi.id;
  if (mi?.directus_files_id?.id && typeof mi.directus_files_id.id === "string")
    return mi.directus_files_id.id;

  return undefined;
}

function pickCategoryKey(product: ProductLike): string {
  const primary = typeof product?.primarycategory === "string" ? product.primarycategory.trim() : "";
  if (primary) return primary;

  const set = new Set(
    Array.isArray(product?.type)
      ? product.type
          .map((t) => (typeof t?.collection === "string" ? t.collection.trim() : ""))
          .filter(Boolean)
      : []
  );

  const preferred = [
    "laptops",
    "printers_and_multifunction_devices",
    "printers",
    "multifunction_devices",
    "office_solutions",
  ];

  for (const p of preferred) if (set.has(p)) return p;
  return set.values().next().value || "produkty";
}

async function fetchFilters(categoryKey: string): Promise<FilterField[]> {
  const origin = await getRequestBaseUrl();
  const url = `${origin}/api/products/filters?category=${encodeURIComponent(categoryKey)}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  const data: { filters?: FilterField[] } = await res.json().catch(() => ({}));
  return data.filters ?? [];
}

/* -------------------------------------------------------------------------- */
/* META                                                                       */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = (await getProductBySlug(slug)) as ProductLike | null;

  if (!product) return { title: "Produkt – DKS" };

  const canonicalSlug = product.slug || slug;
  const url = absUrl(`/oferta/produkty/${canonicalSlug}`);

  const title = product.model || canonicalSlug.replaceAll("-", " ");
  const description =
    toPlainText(product.short_description, 180) ||
    toPlainText(product.description, 180) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  const imgId = getMainImageId(product);
  const ogImage = imgId ? directusOgImage(imgId) : absUrl("/og/oferta.jpg");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = (await getProductBySlug(slug)) as ProductLike | null;
  if (!product) return notFound();

  const canonicalSlug = product.slug || slug;
  const pageUrl = absUrl(`/oferta/produkty/${canonicalSlug}`);
  const productName = product.model || canonicalSlug.replaceAll("-", " ");

  const brandName = product?.brand?.name;
  const category = getCategoryString(product);

  const schemaDescription =
    toPlainText(product.seo_description, 300) ||
    toPlainText(product.short_description, 300) ||
    toPlainText(product.description, 300) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  const imgId = getMainImageId(product);
  const images = imgId ? [directusAssetUrl(imgId)] : [];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: productName,
    url: pageUrl,
    mainEntity: {
      "@type": "Product",
      name: productName,
      ...(brandName ? { brand: { "@type": "Brand", name: brandName } } : {}),
      ...(category ? { category } : {}),
      ...(images.length ? { image: images } : {}),
      description: schemaDescription,
    },
  };

  // filtry (PL etykiety)
  const categoryKey = pickCategoryKey(product);
  const filters = await fetchFilters(categoryKey);

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductPage product={product as any} filtersMeta={filters} />
    </>
  );
}
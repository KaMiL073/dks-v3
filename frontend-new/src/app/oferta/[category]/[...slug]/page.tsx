import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { getProductBySlug } from "@/lib/products";
import ProductPage from "./ProductPage";
import JsonLd from "@/components/seo/JsonLd";

/** Typ filtru zwracanego z /api/products/filters */
export interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

/**
 * SSR-safe origin (żeby nie walić po https://dks.pl na localhost)
 * Działa za nginx / reverse proxy (x-forwarded-*)
 */
function getRequestBaseUrl() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(pathname: string) {
  const base = getBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
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

export default async function ProductCatchAllPage({
  params,
}: {
  params: { category: string; slug: string[] };
}) {
  // ✅ guard na wypadek dziwnych edge-case
  if (!params) return notFound();

  const { category, slug } = params;

  // ✅ slug produktu to ostatni segment z [...slug]
  const productSlug = Array.isArray(slug) && slug.length ? slug[slug.length - 1] : null;
  if (!productSlug) return notFound();

  const product = await getProductBySlug(productSlug);
  if (!product) return notFound();

  // ✅ JSON-LD (opcjonalnie)
  const canonicalSlug = (product as any)?.slug || productSlug;
  const pageUrl = absUrl(`/oferta/produkty/${canonicalSlug}`);
  const productName = (product as any)?.model || canonicalSlug.replaceAll("-", " ");
  const schemaDescription =
    (product as any)?.seo_description ||
    toPlainText((product as any)?.short_description, 300) ||
    toPlainText((product as any)?.description, 300) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: productName,
    url: pageUrl,
    mainEntity: {
      "@type": "Product",
      name: productName,
      description: toPlainText(schemaDescription, 300),
    },
  };

  // ✅ FILTRY: z primarycategory
  let filters: FilterField[] = [];
  try {
    const origin = getRequestBaseUrl();

    const primary =
      typeof (product as any)?.primarycategory === "string"
        ? (product as any).primarycategory.trim()
        : "";

    const categoryKey = primary || category || "produkty";

    const url = `${origin}/api/products/filters?category=${encodeURIComponent(categoryKey)}`;
    const res = await fetch(url, { cache: "no-store" });

    if (res.ok) {
      const data: { filters?: FilterField[] } = await res.json();
      filters = data.filters ?? [];
    }
  } catch (e) {
    console.log("🟥 [catch-all] filters fetch error:", e);
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductPage product={product as any} filtersMeta={filters} />
    </>
  );
}
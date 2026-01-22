import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/products";
import ProductPage from "@/app/oferta/[category]/[...slug]/ProductPage";

/** 🔹 Typ filtru zwracanego z /api/products/filters */
interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl";
}

function absUrl(pathname: string) {
  const base = getBaseUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

function directusOgImage(assetId: string) {
  return `https://dks.pl/backend/assets/${assetId}?fit=cover&width=1200&height=630`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produkt – DKS" };

  const pathname = `/oferta/produkty/${slug}`;
  const url = absUrl(pathname);

  const title =
    (product.model as string | undefined) || slug.replaceAll("-", " ");
  const description =
    (product.short_description as string | undefined) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  const imgId = (product as any)?.main_image?.id as string | undefined;
  const ogImage = imgId ? directusOgImage(imgId) : absUrl("/og/oferta.jpg");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  // Filtry: bierzemy po kategorii produktu jeśli masz ją na produkcie,
  // a jeśli nie — możesz wziąć po "default" albo nie brać wcale.
  let filters: FilterField[] = [];
  try {
    const baseUrl = getBaseUrl();
    // Jeśli masz np. product.category_slug → użyj tego zamiast "produkty"
    const res = await fetch(
      `${baseUrl}/api/products/filters?category=produkty`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const data: { filters?: FilterField[] } = await res.json();
      filters = data.filters ?? [];
    }
  } catch {
    // bez filtrów też OK
  }

  return <ProductPage product={product} filtersMeta={filters} />;
}
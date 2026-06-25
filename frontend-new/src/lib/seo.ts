import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");

export function absoluteUrl(pathname: string) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}

export function absoluteTitle(title: string): Metadata["title"] {
  return { absolute: title };
}

type ProductTitleInput = {
  model?: string;
  slug?: string;
  seo_title?: string;
  brand?: { name?: string | null } | null;
};

export function productTitle(product: ProductTitleInput) {
  if (product.seo_title?.trim()) return product.seo_title.trim();

  const model = product.model?.trim();
  const brand = product.brand?.name?.trim();

  if (model && brand) return `${model} | ${brand} | DKS`;
  if (model) return `${model} | DKS`;

  return "Produkt DKS";
}

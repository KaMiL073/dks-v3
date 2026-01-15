import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/products";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";

import ClientCategoryPage from "../ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";
import ProductPage from "./ProductPage";

import getDescription from "@/content/oferta"; // ✅ default export

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

type OfferDesc = {
  title?: string;
  leftColumn?: string;
  rightColumn?: string;
  seoTitle?: string;
  seoDescription?: string;
};

function pickSeoFromDesc(desc?: OfferDesc | null) {
  return {
    title: desc?.seoTitle || desc?.title || null,
    description: desc?.seoDescription || null,
  };
}

/**
 * ✅ Meta: SEO zawsze bazuje na getDescription()
 * - jeśli jesteśmy na subkategorii: getDescription(subcategorySlug)
 * - jeśli na produkcie: bazujemy na getDescription(subcategorySlug)
 * - jeśli 1 slug jest produktem: próbujemy getDescription(category) jako fallback
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string[] }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  const fallbackTitle = "Oferta – DKS";
  const fallbackDescription =
    "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.";
  const fallbackOgImage = absUrl("/og/oferta.jpg"); // dodaj plik w /public/og/oferta.jpg

  const url = absUrl(`/oferta/${category}/${slug?.join("/") || ""}`);

  if (!slug || slug.length === 0) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      keywords: "",
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url,
        siteName: "DKS",
        locale: "pl_PL",
        type: "website",
        images: [{ url: fallbackOgImage, width: 1200, height: 630, alt: fallbackTitle }],
      },
      twitter: {
        card: "summary_large_image",
        title: fallbackTitle,
        description: fallbackDescription,
        images: [fallbackOgImage],
      },
      alternates: { canonical: url },
    };
  }

  // domyślne
  let title = fallbackTitle;
  let description = fallbackDescription;
  let ogImage = fallbackOgImage;

  // --- CASE A: /oferta/[category]/[subcategory]  (slug.length === 1)
  if (slug.length === 1) {
    const one = slug[0];

    // 1) jeśli to subkategoria: SEO z getDescription(one)
    const descForSub = getDescription(one) as OfferDesc | undefined;
    const seoSub = pickSeoFromDesc(descForSub);

    if (seoSub.title || seoSub.description) {
      title = seoSub.title || title;
      description = seoSub.description || description;
    } else {
      // 2) jeśli brak opisu subkategorii, może to produkt — sprawdzamy produkt
      const product = await getProductBySlug(one);

      if (product) {
        // SEO nadal z getDescription(category) (fallback), bo "one" jest produktem
        const descForCategory = getDescription(category) as OfferDesc | undefined;
        const seoCat = pickSeoFromDesc(descForCategory);

        title = seoCat.title || title;
        description = seoCat.description || description;

        // OG image z produktu (to jest ok)
        const imgId = (product as any)?.main_image?.id as string | undefined;
        if (imgId) ogImage = directusOgImage(imgId);

        // (opcjonalnie) możesz nadpisać title modelem produktu, ale nie musisz
        // title = (product.model as string | undefined) || title;
        // description = (product.short_description as string | undefined) || description;
      }
    }
  }

  // --- CASE B: /oferta/[category]/[subcategory]/[product] (slug.length === 2)
  if (slug.length === 2) {
    const [subcategorySlug, productSlug] = slug;

    // ✅ SEO bazowe: zawsze z opisu subkategorii
    const descForSub = getDescription(subcategorySlug) as OfferDesc | undefined;
    const seoSub = pickSeoFromDesc(descForSub);

    title = seoSub.title || title;
    description = seoSub.description || description;

    // Produkt: OG image + opcjonalne doprecyzowanie meta
    const product = await getProductBySlug(productSlug);
    if (product) {
      const imgId = (product as any)?.main_image?.id as string | undefined;
      if (imgId) ogImage = directusOgImage(imgId);

      // opcjonalnie doprecyzuj, ale nie rozwalaj SEO z oferty:
      // jeśli chcesz, żeby product zawsze wygrywał, odkomentuj
      // title = (product.model as string | undefined) || title;
      // description = (product.short_description as string | undefined) || description;
    }
  }

  return {
    title,
    description,
    keywords: "",

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

    alternates: {
      canonical: url,
    },
  };
}

/** 🔹 Dynamiczna strona kategorii / produktu */
export default async function DynamicOfferPage({
  params,
}: {
  params: Promise<{ category: string; slug: string[] }>;
}) {
  const { category, slug } = await params;

  if (!slug || slug.length === 0) return notFound();

  // 1️⃣ Jeden slug → subkategoria lub produkt
  if (slug.length === 1) {
    const subcategorySlug = slug[0];

    // 🔍 Sprawdź, czy to produkt
    const product = await getProductBySlug(subcategorySlug);
    if (product) {
      const baseUrl = getBaseUrl();

      let filters: FilterField[] = [];
      try {
        const res = await fetch(
          `${baseUrl}/api/products/filters?category=${encodeURIComponent(category)}`,
          { cache: "no-store" }
        );
        if (res.ok) {
          const data: { filters?: FilterField[] } = await res.json();
          filters = data.filters ?? [];
        }
      } catch (err) {
        console.warn("⚠️ Nie udało się pobrać filtrów:", err);
      }

      return <ProductPage product={product} filtersMeta={filters} />;
    }

    // 🔹 Jeśli nie produkt — traktuj jako subkategorię
    const subcategoryCollection = await mapSlugToCollection(subcategorySlug);
    if (!subcategoryCollection) return notFound();

    // ✅ H1: title z getDescription().title (nie seoTitle)
    const desc = getDescription(subcategorySlug) as OfferDesc | undefined;

    return (
      <div className="p-6 xl:px-28 py-20">
        <div className="self-stretch py-12">
          <Heading1 variant="semibold">
            {desc?.title ?? subcategorySlug.replaceAll("-", " ")}
          </Heading1>
        </div>

        <ClientCategoryPage category={category} subcategory={subcategorySlug} />
      </div>
    );
  }

  // 2️⃣ Dwa slugi → /oferta/[category]/[subcategory]/[product]
  if (slug.length === 2) {
    const [subcategorySlug, productSlug] = slug;

    const product = await getProductBySlug(productSlug);
    if (!product) return notFound();

    const baseUrl = getBaseUrl();

    let filters: FilterField[] = [];
    try {
      const res = await fetch(
        `${baseUrl}/api/products/filters?category=${encodeURIComponent(subcategorySlug)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data: { filters?: FilterField[] } = await res.json();
        filters = data.filters ?? [];
      }
    } catch (err) {
      console.warn("⚠️ Nie udało się pobrać filtrów:", err);
    }

    return <ProductPage product={product} filtersMeta={filters} />;
  }

  return notFound();
}
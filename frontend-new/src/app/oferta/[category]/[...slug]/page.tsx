import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/products";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";

import ClientCategoryPage from "../ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";
import ProductPage from "./ProductPage";

import getDescription from "@/content/oferta"; // masz export default

/** 🔹 Typ filtru zwracanego z /api/products/filters */
interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

/** ✅ Base URL */
function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl";
}

/** ✅ Absolutny URL dla ścieżki */
function absUrl(pathname: string) {
  const base = getBaseUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

/** ✅ OG image z Directusa (dopasuj jeśli macie inne parametry) */
function directusOgImage(assetId: string) {
  return `https://dks.pl/backend/assets/${assetId}?fit=cover&width=1200&height=630`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string[] }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  const siteUrl = getBaseUrl();
  const fallbackOgImage = absUrl("/og/oferta.jpg"); // ustaw sobie plik w /public/og/oferta.jpg

  // Bez slugów ta trasa i tak robi notFound, ale zostawiamy asekuracyjnie:
  if (!slug || slug.length === 0) {
    const url = absUrl(`/oferta/${category}`);
    const title = "Oferta – DKS";
    const description = "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.";

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
        images: [
          { url: fallbackOgImage, width: 1200, height: 630, alt: title },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [fallbackOgImage],
      },
      alternates: { canonical: url },
    };
  }

  const pathname = `/oferta/${category}/${slug.join("/")}`;
  const url = absUrl(pathname);

  // --- domyślne ---
  let title = "Oferta – DKS";
  let description = "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.";
  let ogImage = fallbackOgImage;

  // Helper: SEO z opisu (seoTitle/seoDescription)
  const applyDescSeo = (desc: any, fallbackTitle?: string) => {
    if (!desc) return;
    title = desc.seoTitle || desc.title || fallbackTitle || title;
    description = desc.seoDescription || description;
  };

  // 1 slug: subkategoria lub produkt
  if (slug.length === 1) {
    const one = slug[0];

    const product = await getProductBySlug(one);

    if (product) {
      // ✅ produkt ma pierwszeństwo, ale gdy braki – fallback do opisu
      const desc = getDescription(one) || getDescription(category);

      title =
        (product.model as string | undefined) ||
        desc?.seoTitle ||
        desc?.title ||
        one.replaceAll("-", " ");

      description =
        (product.short_description as string | undefined) ||
        desc?.seoDescription ||
        description;

      const imgId = (product as any)?.main_image?.id as string | undefined;
      if (imgId) ogImage = directusOgImage(imgId);
    } else {
      // ✅ subkategoria: SEO z getDescription(subSlug)
      const desc = getDescription(one);
      applyDescSeo(desc, one.replaceAll("-", " "));
    }
  }

  // 2 slugi: /oferta/[category]/[subcategory]/[product]
  if (slug.length === 2) {
    const [subcategorySlug, productSlug] = slug;

    const product = await getProductBySlug(productSlug);

    // ✅ SEO z opisu subkategorii jako baza
    const desc = getDescription(subcategorySlug) || getDescription(category);
    applyDescSeo(desc, productSlug.replaceAll("-", " "));

    // ✅ produkt nadpisuje jeśli ma dane
    if (product) {
      title = (product.model as string | undefined) || title;
      description = (product.short_description as string | undefined) || description;

      const imgId = (product as any)?.main_image?.id as string | undefined;
      if (imgId) ogImage = directusOgImage(imgId);
    }
  }

  // keywords możesz później zbudować np. z category/subcategory
  const keywords = "";

  return {
    title,
    description,
    keywords,

    openGraph: {
      title,
      description,
      url,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
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

    // ✅ H1: title z getDescription (nie seoTitle)
    const desc = getDescription(subcategorySlug);

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
    if (!product) {
      console.warn("⚠️ Produkt nie znaleziony:", productSlug);
      return notFound();
    }

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
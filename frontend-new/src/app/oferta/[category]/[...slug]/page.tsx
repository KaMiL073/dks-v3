import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getProductBySlug } from "@/lib/products";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";

import ClientCategoryPage from "../ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";

import getDescription from "@/content/oferta";

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

  const fallbackOgImage = absUrl("/og/oferta.jpg");

  // Asekuracyjnie
  if (!slug || slug.length === 0) {
    const url = absUrl(`/oferta/${category}`);
    return {
      title: "Oferta – DKS",
      description: "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.",
      openGraph: {
        title: "Oferta – DKS",
        description: "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.",
        url,
        siteName: "DKS",
        locale: "pl_PL",
        type: "website",
        images: [{ url: fallbackOgImage, width: 1200, height: 630, alt: "Oferta – DKS" }],
      },
      twitter: {
        card: "summary_large_image",
        title: "Oferta – DKS",
        description: "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.",
        images: [fallbackOgImage],
      },
      alternates: { canonical: url },
    };
  }

  // ✅ Jeśli to produkt -> ustaw canonical na /oferta/produkty/<slug>
  // (nawet jeśli ktoś wejdzie starym adresem, canonical nie będzie duplikował)
  const maybeProductSlug = slug.length === 1 ? slug[0] : slug.length === 2 ? slug[1] : null;
  if (maybeProductSlug) {
    const product = await getProductBySlug(maybeProductSlug);
    if (product) {
      const canonicalPath = `/oferta/produkty/${product.slug || maybeProductSlug}`;
      const canonicalUrl = absUrl(canonicalPath);

      const title =
        (product.model as string | undefined) || (product.slug || maybeProductSlug).replaceAll("-", " ");
      const description =
        (product.short_description as string | undefined) ||
        "Poznaj szczegóły produktu w ofercie DKS.";

      const imgId = (product as any)?.main_image?.id as string | undefined;
      const ogImage = imgId ? directusOgImage(imgId) : fallbackOgImage;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: canonicalUrl,
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
        alternates: { canonical: canonicalUrl },
      };
    }
  }

  // ✅ To nie produkt => normalne SEO dla podkategorii/sekcji
  const pathname = `/oferta/${category}/${slug.join("/")}`;
  const url = absUrl(pathname);

  let title = "Oferta – DKS";
  let description = "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.";
  let ogImage = fallbackOgImage;

  const descKey = slug.length === 1 ? slug[0] : slug[0];
  const desc = getDescription(descKey) || getDescription(category);

  if (desc) {
    title = desc.seoTitle || desc.title || title;
    description = desc.seoDescription || description;
  }

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

/** 🔹 Dynamiczna strona kategorii / produktu */
export default async function DynamicOfferPage({
  params,
}: {
  params: Promise<{ category: string; slug: string[] }>;
}) {
  const { category, slug } = await params;

  if (!slug || slug.length === 0) return notFound();

  // ✅ 1 slug: albo subkategoria, albo (stary URL produktu) -> REDIRECT
  if (slug.length === 1) {
    const one = slug[0];

    const product = await getProductBySlug(one);
    if (product) {
      // ✅ Jedyny dozwolony URL produktu:
      redirect(`/oferta/produkty/${product.slug || one}`);
    }

    // subkategoria
    const subcategoryCollection = await mapSlugToCollection(one);
    if (!subcategoryCollection) return notFound();

    const desc = getDescription(one);

    return (
      <div className="p-6 xl:px-28 py-20">
        <div className="self-stretch py-12">
          <Heading1 variant="semibold">
            {desc?.title ?? one.replaceAll("-", " ")}
          </Heading1>
        </div>

        <ClientCategoryPage category={category} subcategory={one} />
      </div>
    );
  }

  // ✅ 2 slugi: /oferta/[category]/[subcategory]/[product] -> jeśli produkt istnieje -> REDIRECT
  if (slug.length === 2) {
    const [, productSlug] = slug;

    const product = await getProductBySlug(productSlug);
    if (product) {
      redirect(`/oferta/produkty/${product.slug || productSlug}`);
    }

    // Jeśli nie ma produktu, to nie obsługujemy tu innych bytów
    return notFound();
  }

  return notFound();
}
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";

import { getProductBySlug } from "@/lib/products";
import ClientCategoryPage from "@/app/oferta/[category]/ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";
import getDescription from "@/content/oferta";
import { getOfferPageDescription, mergeOfferPageDescription } from "@/lib/pages";
import { absoluteTitle, productTitle } from "@/lib/seo";

type OfferDesc = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  leftColumn?: string;
  rightColumn?: string;
};

type ProductLike = {
  id: string | number;
  slug?: string;
  model?: string;
  canonical?: unknown;
  seo_title?: unknown;
  seo_description?: unknown;
  short_description?: unknown;
  description?: unknown;
  primarycategory?: string | null;
  brand?: { name?: string; id?: string };
};

type PageParams = {
  category: string;
  slug: string[];
};

type PageProps = {
  params: Promise<PageParams>;
};

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

function asOptionalString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function getProductCanonical(product: ProductLike, fallbackSlug: string) {
  const canonicalSlug = product.slug || fallbackSlug;
  const canonical = asOptionalString(product.canonical)?.trim();
  if (canonical && canonical.includes("/oferta/produkty/")) return canonical;

  return `/oferta/produkty/${canonicalSlug}`;
}

function getProductMetadata(product: ProductLike, productSlug: string): Metadata {
  const canonicalSlug = product.slug || productSlug;
  const canonicalPath = getProductCanonical(product, productSlug);
  const title = productTitle({
    model: product.model,
    slug: canonicalSlug,
    seo_title: asOptionalString(product.seo_title),
    brand: product.brand,
  });
  const description =
    toPlainText(product.seo_description, 155) ||
    toPlainText(product.short_description, 155) ||
    toPlainText(product.description, 155) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  return {
    title: absoluteTitle(title),
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: canonicalPath,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;

  if (!Array.isArray(slug) || slug.length === 0) {
    return {};
  }

  if (slug.length === 1) {
    const subcategory = slug[0];
    const product = (await getProductBySlug(subcategory)) as ProductLike | null;

    if (product) {
      return getProductMetadata(product, subcategory);
    }

    const desc = mergeOfferPageDescription(
      await getOfferPageDescription([
        subcategory,
        `/oferta/${category}/${subcategory}`,
      ]),
      getDescription(subcategory) as OfferDesc | undefined
    );

    const title = desc?.seoTitle || desc?.title || subcategory.replaceAll("-", " ");
    const description =
      desc?.seoDescription || "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.";
    const url = absUrl(`/oferta/${category}/${subcategory}`);
    const ogImage = absUrl("/og/oferta.jpg");

    return {
      title: absoluteTitle(title),
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

  const productSlug = slug[slug.length - 1];

  if (!productSlug) {
    return {};
  }

  const product = (await getProductBySlug(productSlug)) as ProductLike | null;

  if (!product) {
    return {
      title: "Produkt DKS",
      description: "Poznaj szczegóły produktu w ofercie DKS.",
    };
  }

  return getProductMetadata(product, productSlug);
}

export default async function ProductCatchAllPage({ params }: PageProps) {
  const { category, slug } = await params;

  if (!Array.isArray(slug) || slug.length === 0) {
    notFound();
  }

  if (slug.length === 1) {
    const subcategory = slug[0];

    if (!subcategory) {
      notFound();
    }

    const product = (await getProductBySlug(subcategory)) as ProductLike | null;

    if (product) {
      permanentRedirect(`/oferta/produkty/${product.slug || subcategory}`);
    }

    const desc = mergeOfferPageDescription(
      await getOfferPageDescription([
        subcategory,
        `/oferta/${category}/${subcategory}`,
      ]),
      getDescription(subcategory) as OfferDesc | undefined
    );
    const heading = desc?.title ?? subcategory.replaceAll("-", " ");

    return (
      <div className="p-6 xl:px-28 py-20">
        <div className="self-stretch py-12">
          <Heading1 variant="semibold">{heading}</Heading1>
        </div>

        <ClientCategoryPage
          category={category}
          subcategory={subcategory}
          initialPage={1}
          initialDescription={desc}
        />
      </div>
    );
  }

  const productSlug = slug[slug.length - 1];

  if (!productSlug) {
    notFound();
  }

  const raw = (await getProductBySlug(productSlug)) as ProductLike | null;

  if (!raw) {
    notFound();
  }

  permanentRedirect(`/oferta/produkty/${raw.slug || productSlug}`);
}
// import { notFound } from "next/navigation";
// import { headers } from "next/headers";

// import { getProductBySlug } from "@/lib/products";
// import ProductPage from "./ProductPage";
// import JsonLd from "@/components/seo/JsonLd";
// import ClientCategoryPage from "@/app/oferta/[category]/ClientCategoryPage"; // <-- DODAJ

// export interface FilterField {
//   field: string;
//   label: string;
//   options?: { text: string; value: string }[];
// }

// function getRequestBaseUrl() {
//   const h = headers();
//   const host = h.get("x-forwarded-host") ?? h.get("host");
//   const proto = h.get("x-forwarded-proto") ?? "http";
//   if (!host) return "http://localhost:3000";
//   return `${proto}://${host}`;
// }

// function getBaseUrl() {
//   return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
// }

// function absUrl(pathname: string) {
//   const base = getBaseUrl();
//   const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
//   return `${base}${path}`;
// }

// function toPlainText(input?: unknown, maxLen = 300): string {
//   const str = typeof input === "string" ? input : "";
//   if (!str) return "";

//   const noHtml = str
//     .replace(/<style[\s\S]*?<\/style>/gi, " ")
//     .replace(/<script[\s\S]*?<\/script>/gi, " ")
//     .replace(/<\/?[^>]+>/g, " ")
//     .replace(/&nbsp;/g, " ")
//     .replace(/&amp;/g, "&")
//     .replace(/&quot;/g, '"')
//     .replace(/&#39;/g, "'")
//     .replace(/\s+/g, " ")
//     .trim();

//   return noHtml.length > maxLen ? `${noHtml.slice(0, maxLen - 1)}…` : noHtml;
// }

// export default async function ProductCatchAllPage({
//   params,
// }: {
//   params: Promise<{ category: string; slug: string[] }>; // ✅ params as Promise
// }) {
//   const { category, slug } = await params; // ✅ await params

//   if (!Array.isArray(slug) || slug.length === 0) return notFound();

//   /**
//    * ✅ SUBKATEGORIA / LISTING:
//    * /oferta/<category>/<subcategory>
//    */
//   if (slug.length === 1) {
//     const subcategory = slug[0];

//     // render listingu (ten sam komponent co dla /oferta/[category])
//     return (
//       <div className="p-6 xl:px-28 py-20">
//         <ClientCategoryPage category={category} subcategory={subcategory} initialPage={1} />
//       </div>
//     );
//   }

//   /**
//    * ✅ PRODUKT:
//    * /oferta/<category>/.../<productSlug> (ostatni segment)
//    */
//   const productSlug = slug[slug.length - 1];
//   if (!productSlug) return notFound();

//   const product = await getProductBySlug(productSlug);
//   if (!product) return notFound();

//   const canonicalSlug = (product as any)?.slug || productSlug;
//   const pageUrl = absUrl(`/oferta/produkty/${canonicalSlug}`);
//   const productName = (product as any)?.model || canonicalSlug.replaceAll("-", " ");
//   const schemaDescription =
//     (product as any)?.seo_description ||
//     toPlainText((product as any)?.short_description, 300) ||
//     toPlainText((product as any)?.description, 300) ||
//     "Poznaj szczegóły produktu w ofercie DKS.";

//   const productJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "WebPage",
//     name: productName,
//     url: pageUrl,
//     mainEntity: {
//       "@type": "Product",
//       name: productName,
//       description: toPlainText(schemaDescription, 300),
//     },
//   };

//   // ✅ FILTRY: bierz z primarycategory (to pole istnieje)
//   let filters: FilterField[] = [];
//   try {
//     const origin = getRequestBaseUrl();

//     const primary =
//       typeof (product as any)?.primarycategory === "string"
//         ? (product as any).primarycategory.trim()
//         : "";

//     const categoryKey = primary || category || "produkty";
//     const url = `${origin}/api/products/filters?category=${encodeURIComponent(categoryKey)}`;
//     const res = await fetch(url, { cache: "no-store" });

//     if (res.ok) {
//       const data: { filters?: FilterField[] } = await res.json();
//       filters = data.filters ?? [];
//     }
//   } catch (e) {
//   }

//   return (
//     <>
//       <JsonLd data={productJsonLd} />
//       <ProductPage product={product as any} filtersMeta={filters} />
//     </>
//   );
// }

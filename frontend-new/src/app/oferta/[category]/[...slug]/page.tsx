import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { ComponentProps } from "react";

import { getProductBySlug } from "@/lib/products";
import ProductPage from "./ProductPage";
import JsonLd from "@/components/seo/JsonLd";
import ClientCategoryPage from "@/app/oferta/[category]/ClientCategoryPage";

export interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

type ProductPageProduct = ComponentProps<typeof ProductPage>["product"];

type ProductLike = {
  id: string | number;
  slug?: string;
  model?: string;
  seo_description?: unknown;
  short_description?: unknown;
  description?: unknown;
  primarycategory?: string | null;
};

type PageParams = {
  category: string;
  slug: string[];
};

type PageProps = {
  params: Promise<PageParams>;
};

async function getRequestBaseUrl() {
  const h = await headers();
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

function asOptionalString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
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

    return (
      <div className="p-6 xl:px-28 py-20">
        <ClientCategoryPage category={category} subcategory={subcategory} initialPage={1} />
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

  const safeProductLike: ProductLike = {
    ...raw,
    slug: asOptionalString(raw.slug),
    model: asOptionalString(raw.model),
    seo_description: asOptionalString(raw.seo_description),
    short_description: asOptionalString(raw.short_description),
    description: asOptionalString(raw.description),
    primarycategory:
      typeof raw.primarycategory === "string" ? raw.primarycategory : raw.primarycategory ?? null,
  };

  const productForPage = safeProductLike as unknown as ProductPageProduct;

  const canonicalSlug = safeProductLike.slug || productSlug;
  const pageUrl = absUrl(`/oferta/produkty/${canonicalSlug}`);
  const productName = safeProductLike.model || canonicalSlug.replaceAll("-", " ");

  const schemaDescription =
    (typeof safeProductLike.seo_description === "string" ? safeProductLike.seo_description : "") ||
    toPlainText(safeProductLike.short_description, 300) ||
    toPlainText(safeProductLike.description, 300) ||
    "Poznaj szczegóły produktu w ofercie DKS.";

  const productJsonLd: Record<string, unknown> = {
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

  let filters: FilterField[] = [];

  try {
    const origin = await getRequestBaseUrl();

    const primary =
      typeof safeProductLike.primarycategory === "string"
        ? safeProductLike.primarycategory.trim()
        : "";

    const categoryKey = primary || category || "produkty";
    const url = `${origin}/api/products/filters?category=${encodeURIComponent(categoryKey)}`;
    const res = await fetch(url, { cache: "no-store" });

    if (res.ok) {
      const data: unknown = await res.json();

      if (
        data &&
        typeof data === "object" &&
        Array.isArray((data as { filters?: unknown }).filters)
      ) {
        filters = (data as { filters: FilterField[] }).filters;
      }
    }
  } catch {
    // celowo pomijamy błąd pobierania filtrów
  }

  return (
    <>
      <JsonLd data={productJsonLd} />
      <ProductPage product={productForPage} filtersMeta={filters} />
    </>
  );
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
//     console.log("🟠 [catch-all] filters fetch error:", e);
//   }

//   return (
//     <>
//       <JsonLd data={productJsonLd} />
//       <ProductPage product={product as any} filtersMeta={filters} />
//     </>
//   );
// }

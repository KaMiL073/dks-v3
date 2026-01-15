import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
import ClientCategoryPage from "../../ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";

import getDescription from "@/content/oferta";

type OfferDesc = {
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl";
}

function absUrl(pathname: string) {
  const base = getBaseUrl().replace(/\/$/, "");
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}): Promise<Metadata> {
  const { category, page } = await params;

  const pageNum = Number(page);
  if (!Number.isFinite(pageNum) || pageNum < 1) return {};

  const desc = getDescription(category) as OfferDesc | undefined;

  const baseTitle = desc?.seoTitle || desc?.title || category.replaceAll("-", " ");
  const title = `${baseTitle} – strona ${pageNum}`;
  const description =
    desc?.seoDescription ||
    "Poznaj ofertę DKS – sprawdź dostępne produkty i rozwiązania.";

  const url = absUrl(`/oferta/${category}/page/${pageNum}`);
  const ogImage = absUrl("/og/oferta.jpg");

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
    alternates: {
      canonical: url,
    },
  };
}

export default async function CategoryPaginationPage({
  params,
}: {
  params: Promise<{ category: string; page: string }>;
}) {
  const { category, page } = await params;

  const pageNum = Number(page);
  if (!Number.isFinite(pageNum) || pageNum < 1) return notFound();

  const collection = await mapSlugToCollection(category);
  if (!collection) return notFound();

  const desc = getDescription(category) as OfferDesc | undefined;

  return (
    <div className="p-6 xl:px-28 py-20">
      <div className="self-stretch py-12">
        <Heading1 variant="semibold">
          {desc?.title ?? category.replaceAll("-", " ")}
        </Heading1>
      </div>

      <ClientCategoryPage
        category={category}
        categorySlug={category}
        collection={collection}
        initialPage={pageNum}
      />
    </div>
  );
}
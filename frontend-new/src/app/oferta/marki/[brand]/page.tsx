import { notFound } from "next/navigation";
import { getBrandBySlugOrName } from "@/lib/brands";
import { getProductsByBrandId } from "@/lib/products";
import { Heading } from "@/components/ui/Typography/Heading";
import ProductsList from "@/app/oferta/components/ProductsList";

const SITE_URL = "https://dks.pl";

function getBrandDescription(
  name: string,
  seoDescription?: string | null,
) {
  if (
    typeof seoDescription === "string" &&
    seoDescription.trim()
  ) {
    return seoDescription.trim();
  }

  return `Urządzenia ${name} dla firm – drukarki, urządzenia wielofunkcyjne i rozwiązania do biura dostępne w ofercie DKS.`;
}

/**
 * Strona konkretnej marki (np. /oferta/marki/canon)
 */
export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;

  const brandData = await getBrandBySlugOrName(brand);

  if (!brandData) {
    return notFound();
  }

  const products = await getProductsByBrandId(brandData.id);

  return (
    <main className="w-full px-4 sm:px-10 lg:px-28 py-16 flex flex-col gap-10">
      <div className="self-stretch py-12">
        <Heading as="h1" headingValue="h1_semibold">
          Urządzenia {brandData.name}
        </Heading>
      </div>

      <ProductsList products={products} />
    </main>
  );
}

/**
 * SEO / metadata
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand } = await params;

  const brandData = await getBrandBySlugOrName(brand);

  if (!brandData) {
    return {
      title: `Marka ${brand} – DKS`,
      description: `Produkty marki ${brand} dostępne w ofercie DKS.`,
      alternates: {
        canonical: `${SITE_URL}/oferta/marki/${brand}`,
      },
    };
  }

  const slug = brandData.slug || brand;

  const title = `Urządzenia ${brandData.name} – DKS`;

  const description = getBrandDescription(
    brandData.name,
    brandData.seo_description,
  );

  const canonicalUrl = `${SITE_URL}/oferta/marki/${slug}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
    },
  };
}
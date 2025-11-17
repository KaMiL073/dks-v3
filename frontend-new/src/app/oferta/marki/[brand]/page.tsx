import { notFound } from "next/navigation";
import { getBrandBySlugOrName } from "@/lib/brands";
import { getProductsByBrandId } from "@/lib/products";
import { Heading } from "@/components/ui/Typography/Heading";
import ProductsList from "@/app/oferta/components/ProductsList";

/**
 * Strona konkretnej marki (np. /oferta/marki/canon)
 */
export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  // ✅ Next 15 – params jest Promisem
  const { brand } = await params;

  // 🧩 Pobierz dane marki
  const brandData = await getBrandBySlugOrName(brand);
  if (!brandData) return notFound();

  // 🧩 Pobierz produkty tej marki
  const products = await getProductsByBrandId(brandData.id);

  return (
    <main className="w-full px-4 sm:px-10 lg:px-28 py-16 flex flex-col gap-10">
      {/* 🏷️ Nagłówek marki */}

            <div className="self-stretch py-12">
              <Heading as="h2"  headingValue="h1_semibold">
                {brandData.name}
              </Heading>
            </div>

      {/* 🧱 Lista produktów */}
      <ProductsList
        products={products}
        categorySlug="marki"
        subcategory={brandData.slug || brand}
      />
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

  return {
    title: brandData
      ? `Urządzenia ${brandData.name} – DKS`
      : `Marka ${brand}`,
    description:
      brandData?.seo_description ??
      `Produkty marki ${brandData?.name ?? brand}.`,
  };
}
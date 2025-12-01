import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { mapSlugToCollection } from "@/lib/directusCategoryMapper";
import ClientCategoryPage from "../ClientCategoryPage";
import { Heading1 } from "@/components/ui/Typography/Heading1";
import ProductPage from "./ProductPage";

/** 🔹 Typ filtru zwracanego z /api/products/filters */
interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
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
      // ✅ Pobierz filtry dla tej kategorii
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      let filters: FilterField[] = [];
      try {
        const res = await fetch(
          `${baseUrl}/api/products/filters?category=${encodeURIComponent(
            category
          )}`,
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

    return (
      <div className="p-6 xl:px-28 py-20">
        <div className="self-stretch py-12">
          <Heading1 variant="semibold">
            {subcategorySlug.replaceAll("-", " ")}
          </Heading1>
        </div>
        <ClientCategoryPage
          category={category}
          categorySlug={category}
          subcategory={subcategorySlug}
        />
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

    // ✅ Pobierz filtry dla subkategorii
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let filters: FilterField[] = [];
    try {
      const res = await fetch(
        `${baseUrl}/api/products/filters?category=${encodeURIComponent(
          subcategorySlug
        )}`,
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
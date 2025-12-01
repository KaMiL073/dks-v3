"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";

// 🧩 Typ relacji Directus M2A (many-to-any)
interface DirectusRelation {
  collection: string;
  item: Record<string, unknown>;
}

interface Product {
  id: number | string;
  model?: string;
  slug?: string;
  main_image?: { id?: string } | string;
  brand?: { name?: string };
  type?: DirectusRelation[] | DirectusRelation; // 🔹 typ bez `any`
}

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

export default function ProductsList({
  products,
  filtersMeta = [],
  categorySlug,
  subcategory,
}: {
  products: Product[];
  filtersMeta?: FilterField[];
  categorySlug: string;
  subcategory?: string;
}) {
  if (!products?.length) {
    return (
      <p className="text-gray-500 text-base font-['Montserrat']">
        Brak produktów spełniających kryteria.
      </p>
    );
  }

  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
    "http://localhost:8055";

  // 🔹 Pomocnicza funkcja: pobiera wartość filtra z produktu
  const getFilterValue = (product: Product, filterField: string): string | undefined => {
    const typeArray = Array.isArray(product.type)
      ? product.type
      : product.type
      ? [product.type]
      : [];

    for (const t of typeArray) {
      const item = t?.item as Record<string, unknown>;
      if (filterField in item && item[filterField]) {
        return String(item[filterField]);
      }
    }
    return undefined;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {products.map((product) => {
        const imageUrl =
          typeof product.main_image === "string"
            ? `${backend}/assets/${product.main_image}`
            : product.main_image?.id
            ? `${backend}/assets/${product.main_image.id}`
            : "https://placehold.co/368x249";

        const visibleFilters = filtersMeta.slice(0, 4);

        return (
          <div
            key={product.id}
            className="bg-surface-page border-b border-border-primary pb-4"
          >
            {/* 📷 Zdjęcie */}
            <div className="relative w-full h-64">
              <Image
                src={imageUrl}
                alt={product.model || "Produkt"}
                fill
                style={{ objectFit: "contain" }}
              />
            </div>

            {/* 📄 Dane produktu */}
            <div className="flex flex-col flex-grow">
              <div className="text-2xl font-semibold mb-1">{product.model}</div>
              {product.brand?.name && (
                <div className="text-lg font-semibold mb-2">
                  {product.brand.name}
                </div>
              )}

              {/* 🔹 Filtry — tylko pierwsze 4 */}
              <div className="text-sm text-gray-800 space-y-1">
                {visibleFilters.map((filter) => {
                  const value = getFilterValue(product, filter.field);
                  if (!value) return null;

                  return (
                    <div key={filter.field}>
                      <span className="font-semibold">{filter.label}:</span>{" "}
                      <span>{value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🔘 Przycisk */}
            <Button
              className="mt-4"
              href={
                subcategory
                  ? `/oferta/${categorySlug}/${subcategory}/${product.slug}`
                  : `/oferta/${categorySlug}/${product.slug}`
              }
            >
              Zobacz więcej
            </Button>
          </div>
        );
      })}
    </div>
  );
}
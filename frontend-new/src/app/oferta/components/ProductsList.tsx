"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";

// Typ relacji Directus M2A (many-to-any)
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
  type?: DirectusRelation[] | DirectusRelation;
}

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

/**
 * Zwraca URL obrazka produktu w formie:
 * /backend/assets/<id>?imwidth=...
 *
 * - request idzie do nginx -> directus
 * - nie generuje /_next/image?url=...
 * - unoptimized=true dla directusa
 *
 * Jeśli brak obrazka -> lokalny placeholder z /public
 */
function productImageSrc(main_image: Product["main_image"], imwidth = 900) {
  const id =
    typeof main_image === "string"
      ? main_image
      : main_image?.id
      ? main_image.id
      : null;

  if (!id) return "/static/placeholder-product.svg";

  return `/backend/assets/${id}?imwidth=${imwidth}`;
}

export default function ProductsList({
  products,
  filtersMeta = [],
}: {
  products: Product[];
  filtersMeta?: FilterField[];
}) {
  if (!products?.length) {
    return (
      <p className="text-gray-500 text-base font-['Montserrat']">
        Brak produktów spełniających kryteria.
      </p>
    );
  }

  const getFilterValue = (
    product: Product,
    filterField: string
  ): string | undefined => {
    const typeArray = Array.isArray(product.type)
      ? product.type
      : product.type
      ? [product.type]
      : [];

    for (const t of typeArray) {
      const item = t?.item as Record<string, unknown> | undefined;
      if (item && filterField in item && item[filterField]) {
        return String(item[filterField]);
      }
    }
    return undefined;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {products.map((product) => {
        const imageUrl = productImageSrc(product.main_image, 900);
        const isDirectus = imageUrl.startsWith("/backend/assets/");
        const visibleFilters = filtersMeta.slice(0, 4);

        // ✅ JEDYNY poprawny adres produktu:
        const productHref = product.slug
          ? `/oferta/produkty/${product.slug}`
          : null;

        return (
          <div
            key={product.id}
            className="bg-surface-page border-b border-border-primary pb-4"
          >
            {/* Zdjęcie */}
            <div className="relative w-full h-64">
              <Image
                src={imageUrl}
                alt={product.model || "Produkt"}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: "contain" }}
                unoptimized={isDirectus}
              />
            </div>

            {/* Dane produktu */}
            <div className="flex flex-col flex-grow">
              <div className="text-2xl font-semibold mb-1">{product.model}</div>

              {product.brand?.name ? (
                <div className="text-lg font-semibold mb-2">
                  {product.brand.name}
                </div>
              ) : null}

              {/* Filtry — tylko pierwsze 4 */}
              <div className="text-sm text-gray-800 space-y-1">
                {visibleFilters.map((filter) => {
                  const value = getFilterValue(product, filter.field);
                  if (!value) return null;

                  const label =
                    filter.options?.find((o) => o.value === value)?.text ??
                    value;

                  return (
                    <div key={filter.field}>
                      <span className="font-semibold">{filter.label}:</span>{" "}
                      <span>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Przycisk */}
            {productHref ? (
              <Button className="mt-4" href={productHref}>
                Zobacz więcej
              </Button>
            ) : (
              <Button className="mt-4" disabled>
                Brak linku (brak slug)
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

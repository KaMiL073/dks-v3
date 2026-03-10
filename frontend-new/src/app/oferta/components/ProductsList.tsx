"use client";

import Button from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

interface DirectusRelation {
  collection?: string;
  item?: Record<string, unknown>;
}

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

interface Product {
  id: number | string;
  model?: string;
  slug?: string;
  main_image?: { id?: string } | string;
  brand?: { name?: string };
  type?: DirectusRelation[] | DirectusRelation;
  primarycategory?: string | null;
  filtersMeta?: FilterField[];
}

function productImageSrc(main_image: Product["main_image"], imwidth = 900) {
  const id =
    typeof main_image === "string" ? main_image : main_image?.id ? main_image.id : null;

  if (!id) return "/static/placeholder-product.svg";
  return `/backend/assets/${id}?imwidth=${imwidth}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_\s-]+/g, "");
}

function toDisplayString(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || undefined;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => toDisplayString(item))
      .filter((item): item is string => Boolean(item));

    return parts.length ? parts.join(", ") : undefined;
  }

  if (isRecord(value)) {
    const candidates = [
      value.name,
      value.title,
      value.label,
      value.value,
      value.text,
      value.slug,
    ];

    for (const candidate of candidates) {
      const parsed = toDisplayString(candidate);
      if (parsed) return parsed;
    }

    if ("item" in value) {
      return toDisplayString(value.item);
    }
  }

  return undefined;
}

function getFilterValue(product: Product, filterField: string): string | undefined {
  const rootVal = (product as unknown as Record<string, unknown>)[filterField];
  const rootParsed = toDisplayString(rootVal);

  if (rootParsed) {
    return rootParsed;
  }

  const wanted = normalize(filterField);

  const typeArray = Array.isArray(product.type)
    ? product.type
    : product.type
      ? [product.type]
      : [];

  for (const entry of typeArray) {
    const item = entry?.item;
    if (!isRecord(item)) continue;

    for (const [key, value] of Object.entries(item)) {
      if (normalize(key) !== wanted) continue;

      const parsed = toDisplayString(value);
      if (parsed) {
        return parsed;
      }
    }
  }

  return undefined;
}

function getDisplayValue(filter: FilterField, rawValue: string): string {
  const matched = filter.options?.find(
    (option) => normalize(option.value) === normalize(rawValue)
  );

  return matched?.text ?? rawValue;
}

export default function ProductsList({
  products,
}: {
  products: Product[];
}) {
  if (!products?.length) {
    return (
      <p className="text-gray-500 text-base font-['Montserrat']">
        Brak produktów spełniających kryteria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(304px,1fr))] mt-[48px] gap-12">
      {products.map((product) => {
        const imageUrl = productImageSrc(product.main_image, 900);
        const isDirectus = imageUrl.startsWith("/backend/assets/");
        const visibleFilters = (product.filtersMeta ?? []).slice(0, 4);
        const productHref = product.slug ? `/oferta/produkty/${product.slug}` : null;

        return (
          <div
            key={product.id}
            className="bg-surface-page border-b border-border-primary pb-4 mb-[48px] min-w-[304px] max-w-[400px]"
          >
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

            <div className="flex flex-col flex-grow">
              {productHref ? (
                <h3 className="text-2xl font-semibold mb-1">
                  <Link href={productHref}>
                    {product.model || "Produkt"}
                    {product.brand?.name ? (
                      <>
                        <br />
                        <span className="text-lg font-semibold">{product.brand.name}</span>
                      </>
                    ) : null}
                  </Link>
                </h3>
              ) : (
                <h3 className="text-2xl font-semibold mb-1">
                  {product.model || "Produkt"}
                  {product.brand?.name ? ` ${product.brand.name}` : ""}
                </h3>
              )}

              <div className="text-sm text-gray-800 space-y-1">
                {visibleFilters.map((filter) => {
                  const rawValue = getFilterValue(product, filter.field);
                  if (!rawValue) return null;

                  const displayValue = getDisplayValue(filter, rawValue);

                  return (
                    <div key={filter.field}>
                      <span className="font-semibold">{filter.label}:</span>{" "}
                      <span>{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {productHref ? (
              <Button className="mt-4" href={productHref}>
                Zobacz więcej
              </Button>
            ) : (
              <Button className="mt-4" type="button">
                Brak linku (brak slug)
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
// "use client";

// import Button from "@/components/ui/Button";
// import Image from "next/image";
// import Link from "next/link";

// interface DirectusRelation {
//   collection?: string;
//   item?: Record<string, unknown>;
// }

// interface Product {
//   id: number | string;
//   model?: string;
//   slug?: string;
//   main_image?: { id?: string } | string;
//   brand?: { name?: string };
//   type?: DirectusRelation[] | DirectusRelation;
//   primarycategory?: string | null;
// }

// interface FilterField {
//   field: string;
//   label: string;
//   options?: { text: string; value: string }[];
// }

// function productImageSrc(main_image: Product["main_image"], imwidth = 900) {
//   const id =
//     typeof main_image === "string" ? main_image : main_image?.id ? main_image.id : null;

//   if (!id) return "/static/placeholder-product.svg";
//   return `/backend/assets/${id}?imwidth=${imwidth}`;
// }

// function isRecord(value: unknown): value is Record<string, unknown> {
//   return typeof value === "object" && value !== null && !Array.isArray(value);
// }

// function normalize(value: string) {
//   return value
//     .toLowerCase()
//     .trim()
//     .replace(/[_\s-]+/g, "");
// }

// function prettifyLabel(key: string) {
//   const customLabels: Record<string, string> = {
//     typurzadzenia: "Typ urządzenia",
//     systemdruku: "System druku",
//     rodzajwydruku: "Rodzaj wydruku",
//     formatpapierumaks: "Format papieru (maks.)",
//     formatpapieru: "Format papieru",
//     drukdwustronny: "Druk dwustronny",
//     skanowanie: "Skanowanie",
//     kopiowanie: "Kopiowanie",
//     fax: "Fax",
//     wifi: "Wi-Fi",
//     printtechnology: "Technologia druku",
//     colormode: "Tryb koloru",
//     papersize: "Format papieru",
//     duplex: "Druk dwustronny",
//     scan: "Skanowanie",
//     copy: "Kopiowanie",
//   };

//   const hit = customLabels[normalize(key)];
//   if (hit) return hit;

//   const normalized = key.replace(/_/g, " ").trim();
//   return normalized.charAt(0).toUpperCase() + normalized.slice(1);
// }

// function translateAutoValue(value: string) {
//   const dict: Record<string, string> = {
//     laser: "laserowy",
//     inkjet: "atramentowy",
//     color: "kolorowy",
//     colour: "kolorowy",
//     mono: "monochromatyczny",
//     monochrome: "monochromatyczny",
//     blackwhite: "czarno-biały",
//     a4: "A4",
//     a3: "A3",
//     yes: "tak",
//     no: "nie",
//     true: "tak",
//     false: "nie",
//     printer: "drukarka",
//     mfp: "urządzenie wielofunkcyjne",
//     multifunction: "urządzenie wielofunkcyjne",
//   };

//   const mapped = dict[normalize(value)];
//   return mapped ?? value;
// }

// function toDisplayString(value: unknown): string | undefined {
//   if (value === null || value === undefined) return undefined;

//   if (typeof value === "string") {
//     const trimmed = value.trim();
//     return trimmed || undefined;
//   }

//   if (typeof value === "number" || typeof value === "boolean") {
//     return String(value);
//   }

//   if (Array.isArray(value)) {
//     const parts = value
//       .map((item) => toDisplayString(item))
//       .filter((item): item is string => Boolean(item));

//     return parts.length ? parts.join(", ") : undefined;
//   }

//   if (isRecord(value)) {
//     const candidates = [
//       value.name,
//       value.title,
//       value.label,
//       value.value,
//       value.text,
//       value.slug,
//     ];

//     for (const candidate of candidates) {
//       const parsed = toDisplayString(candidate);
//       if (parsed) return parsed;
//     }

//     if ("item" in value) {
//       return toDisplayString(value.item);
//     }
//   }

//   return undefined;
// }

// function getTypeItems(product: Product): Record<string, unknown>[] {
//   const typeArray = Array.isArray(product.type)
//     ? product.type
//     : product.type
//       ? [product.type]
//       : [];

//   return typeArray
//     .map((entry) => (isRecord(entry?.item) ? entry.item : null))
//     .filter((item): item is Record<string, unknown> => item !== null);
// }

// function getFilterValue(product: Product, filterField: string): string | undefined {
//   const root = product as unknown as Record<string, unknown>;
//   const wanted = normalize(filterField);

//   for (const [key, value] of Object.entries(root)) {
//     if (normalize(key) === wanted) {
//       const parsed = toDisplayString(value);
//       if (parsed) return parsed;
//     }
//   }

//   const typeItems = getTypeItems(product);

//   for (const item of typeItems) {
//     for (const [key, value] of Object.entries(item)) {
//       if (normalize(key) === wanted) {
//         const parsed = toDisplayString(value);
//         if (parsed) return parsed;
//       }
//     }
//   }

//   return undefined;
// }

// function getAutoFilters(product: Product): FilterField[] {
//   const ignoredKeys = new Set([
//     "id",
//     "status",
//     "sort",
//     "user_created",
//     "date_created",
//     "user_updated",
//     "date_updated",
//     "devices",
//     "collection",
//     "category",
//     "primarycategory",
//   ]);

//   const preferredOrder = [
//     "typ_urzadzenia",
//     "system_druku",
//     "rodzaj_wydruku",
//     "format_papieru_maks",
//     "format_papieru",
//     "duplex",
//     "print_technology",
//     "color_mode",
//     "paper_size",
//   ];

//   const typeItems = getTypeItems(product);
//   if (!typeItems.length) return [];

//   let bestItem: Record<string, unknown> | null = null;
//   let bestCount = -1;

//   for (const item of typeItems) {
//     const count = Object.entries(item).filter(([key, value]) => {
//       return !ignoredKeys.has(key) && Boolean(toDisplayString(value));
//     }).length;

//     if (count > bestCount) {
//       bestCount = count;
//       bestItem = item;
//     }
//   }

//   if (!bestItem) return [];

//   const entries = Object.entries(bestItem).filter(
//     ([key, value]) => !ignoredKeys.has(key) && Boolean(toDisplayString(value))
//   );

//   entries.sort(([a], [b]) => {
//     const ai = preferredOrder.findIndex((x) => normalize(x) === normalize(a));
//     const bi = preferredOrder.findIndex((x) => normalize(x) === normalize(b));

//     const aRank = ai === -1 ? 999 : ai;
//     const bRank = bi === -1 ? 999 : bi;

//     return aRank - bRank;
//   });

//   return entries.slice(0, 4).map(([key]) => ({
//     field: key,
//     label: prettifyLabel(key),
//   }));
// }

// function getVisibleFilters(product: Product, filtersMeta: FilterField[]): FilterField[] {
//   const filteredMeta = filtersMeta.filter((filter) => {
//     const normalizedField = normalize(filter.field);
//     return normalizedField !== "primarycategory" && normalizedField !== "category";
//   });

//   const matched = filteredMeta
//     .filter((filter) => Boolean(getFilterValue(product, filter.field)))
//     .slice(0, 4);

//   if (matched.length > 0) {
//     return matched;
//   }

//   return getAutoFilters(product);
// }

// function getDisplayValue(filter: FilterField, rawValue: string) {
//   const matchedOption = filter.options?.find(
//     (option) => normalize(option.value) === normalize(rawValue)
//   );

//   if (matchedOption?.text) {
//     return matchedOption.text;
//   }

//   return translateAutoValue(rawValue);
// }

// export default function ProductsList({
//   products,
//   filtersMeta = [],
// }: {
//   products: Product[];
//   filtersMeta?: FilterField[];
// }) {
//   if (!products?.length) {
//     return (
//       <p className="text-gray-500 text-base font-['Montserrat']">
//         Brak produktów spełniających kryteria.
//       </p>
//     );
//   }

//   return (
//     <div className="grid grid-cols-[repeat(auto-fit,minmax(304px,1fr))] mt-[48px] gap-12">
//       {products.map((product) => {
//         const imageUrl = productImageSrc(product.main_image, 900);
//         const isDirectus = imageUrl.startsWith("/backend/assets/");
//         const visibleFilters = getVisibleFilters(product, filtersMeta);
//         const productHref = product.slug ? `/oferta/produkty/${product.slug}` : null;

//         return (
//           <div
//             key={product.id}
//             className="bg-surface-page border-b border-border-primary pb-4 mb-[48px] min-w-[304px] max-w-[400px]"
//           >
//             <div className="relative w-full h-64">
//               <Image
//                 src={imageUrl}
//                 alt={product.model || "Produkt"}
//                 fill
//                 sizes="(max-width: 768px) 100vw, 33vw"
//                 style={{ objectFit: "contain" }}
//                 unoptimized={isDirectus}
//               />
//             </div>

//             <div className="flex flex-col flex-grow">
//               {productHref ? (
//                 <h3 className="text-2xl font-semibold mb-1">
//                   <Link href={productHref}>
//                     {product.model || "Produkt"}
//                     {product.brand?.name ? (
//                       <>
//                         <br />
//                         <span className="text-lg font-semibold">{product.brand.name}</span>
//                       </>
//                     ) : null}
//                   </Link>
//                 </h3>
//               ) : (
//                 <h3 className="text-2xl font-semibold mb-1">
//                   {product.model || "Produkt"}
//                   {product.brand?.name ? ` ${product.brand.name}` : ""}
//                 </h3>
//               )}

//               <div className="text-sm text-gray-800 space-y-1">
//                 {visibleFilters.map((filter) => {
//                   const rawValue = getFilterValue(product, filter.field);
//                   if (!rawValue) return null;

//                   const displayValue = getDisplayValue(filter, rawValue);

//                   return (
//                     <div key={filter.field}>
//                       <span className="font-semibold">{filter.label}:</span>{" "}
//                       <span>{displayValue}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {productHref ? (
//               <Button className="mt-4" href={productHref}>
//                 Zobacz więcej
//               </Button>
//             ) : (
//               <Button className="mt-4" type="button">
//                 Brak linku (brak slug)
//               </Button>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
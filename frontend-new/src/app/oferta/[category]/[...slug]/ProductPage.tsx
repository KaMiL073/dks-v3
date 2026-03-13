"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import Tabs from "../../components/Tabs";
import { initializeVisualEditor, setAttr } from "@/lib/visual-editor";

import "@/styles/rich-content.scss";

interface DirectusRelationItem {
  collection?: string;
  item?: Record<string, unknown>;
}

interface ProductComponent {
  collection: string;
  item: Record<string, unknown>;
}

interface ProductImage {
  directus_files_id?: string | { id?: string } | null;
  url?: string;
  backend_url?: string;
  backend_url_small?: string;
}

interface ProductFile {
  id?: string;
  filename_download?: string;
  directus_files_id?: string | { id?: string; filename_download?: string };
}

interface Product {
  id?: string | number;
  model?: string;
  slug?: string;
  description?: string;
  price?: number;
  primarycategory?: string | null;
  main_image?: string | { id?: string } | null;
  images?: ProductImage[] | null;
  brand?: { name?: string; id?: string } | null;
  type?: DirectusRelationItem[] | null;
  components?: ProductComponent[] | null;
  files?: ProductFile[] | null;
}

type TabsProduct = {
  id: string | number;
  description?: string;
  files?: ProductFile[];
  components?: ProductComponent[];
};

export interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

const FALLBACK_IMAGE = "/static/576x464.svg";
const VISIBLE_THUMBS = 4;

function normalize(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .trim()
    .replace(/[_\s-]+/g, "");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getAssetId(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (typeof obj.id === "string" || typeof obj.id === "number") {
      return String(obj.id);
    }

    const df = obj.directus_files_id;
    if (typeof df === "string" || typeof df === "number") {
      return String(df);
    }

    if (df && typeof df === "object") {
      const nested = df as Record<string, unknown>;
      if (typeof nested.id === "string" || typeof nested.id === "number") {
        return String(nested.id);
      }
    }
  }

  return null;
}

function assetPath(value: unknown, imwidth = 1920): string | null {
  const id = getAssetId(value);
  if (!id) return null;
  return `/backend/assets/${id}?imwidth=${imwidth}`;
}

function isMeaningfulValue(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function stringifyValue(value: unknown): string | null {
  if (value == null) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || null;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    const items = value
      .map((item) => stringifyValue(item))
      .filter((item): item is string => Boolean(item));

    return items.length ? items.join(", ") : null;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;

    if (typeof obj.text === "string" && obj.text.trim()) return obj.text.trim();
    if (typeof obj.label === "string" && obj.label.trim()) return obj.label.trim();
    if (typeof obj.title === "string" && obj.title.trim()) return obj.title.trim();
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name.trim();
    if (typeof obj.value === "string" && obj.value.trim()) return obj.value.trim();
  }

  return null;
}

function formatFallbackLabel(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^./, (s) => s.toUpperCase());
}

function getRenderableFieldCount(item: Record<string, unknown>): number {
  const ignoredKeys = new Set([
    "id",
    "status",
    "sort",
    "user_created",
    "date_created",
    "user_updated",
    "date_updated",
    "devices",
    "collection",
    "category",
  ]);

  return Object.entries(item).filter(
    ([key, value]) => !ignoredKeys.has(key) && isMeaningfulValue(value)
  ).length;
}

function getFilterMatchCount(item: Record<string, unknown>, filters: FilterField[]): number {
  const itemKeys = Object.keys(item).map((key) => normalize(key));

  return filters.reduce((acc, filter) => {
    const wanted = normalize(filter.field);
    return acc + (itemKeys.includes(wanted) ? 1 : 0);
  }, 0);
}

type VEWindow = Window &
  typeof globalThis & {
    DirectusVisualEditor?: unknown;
    __DirectusVisualEditor?: unknown;
  };

export default function ProductPage({
  product,
  filtersMeta = [],
}: {
  product?: Product | null;
  filtersMeta?: FilterField[];
}) {
  const [isVisualEditor, setIsVisualEditor] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const safeProduct: Product = product ?? {
    id: "unknown",
    model: "Produkt",
    images: [],
    files: [],
    type: [],
    brand: null,
    description: "",
    main_image: null,
    primarycategory: null,
  };

  const productId: string | number = safeProduct.id ?? "unknown";

  const tabsProduct: TabsProduct = useMemo(
    () => ({
      id: productId,
      description: safeProduct.description,
      files: Array.isArray(safeProduct.files) ? safeProduct.files : [],
      components: Array.isArray(safeProduct.components) ? safeProduct.components : [],
    }),
    [productId, safeProduct.description, safeProduct.files, safeProduct.components]
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initializeVisualEditor();
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("Directus init error:", err);
        }
      }

      if (!cancelled) {
        const w = window as VEWindow;
        if (w.DirectusVisualEditor || w.__DirectusVisualEditor) {
          setIsVisualEditor(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data: unknown = event.data;

      const hit =
        (typeof data === "object" &&
          data !== null &&
          ("action" in data || "type" in data) &&
          (((data as { action?: unknown }).action === "confirm") ||
            ((data as { type?: unknown }).type === "directus-visual-editor-init"))) ||
        (typeof data === "string" && data.includes("Directus Visual Editor"));

      if (hit) setIsVisualEditor(true);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const galleryImages = useMemo(() => {
    const imgs = Array.isArray(safeProduct.images) ? safeProduct.images.filter(Boolean) : [];

    return imgs
      .map((img) => {
        if (typeof img?.url === "string" && img.url.trim()) return img.url;
        if (typeof img?.backend_url === "string" && img.backend_url.trim()) return img.backend_url;
        return assetPath(img?.directus_files_id, 1920);
      })
      .filter((src): src is string => typeof src === "string" && src.length > 0);
  }, [safeProduct.images]);

  const mainImage = useMemo(() => {
    return assetPath(safeProduct.main_image, 1920);
  }, [safeProduct.main_image]);

  const images = useMemo(() => {
    if (galleryImages.length > 0) return galleryImages;
    if (mainImage) return [mainImage];
    return [FALLBACK_IMAGE];
  }, [galleryImages, mainImage]);

  useEffect(() => {
    setCurrentIndex(0);
    setThumbStart(0);
  }, [productId, images.length]);

  useEffect(() => {
    setCurrentIndex((i) => clamp(i, 0, Math.max(0, images.length - 1)));
    setThumbStart((i) => clamp(i, 0, Math.max(0, images.length - VISIBLE_THUMBS)));
  }, [images.length]);

  const canScrollLeft = thumbStart > 0;
  const canScrollRight = thumbStart + VISIBLE_THUMBS < images.length;

  const visibleImages = useMemo(() => {
    return images.slice(thumbStart, thumbStart + VISIBLE_THUMBS);
  }, [images, thumbStart]);

  const handlePrevThumbs = useCallback(() => {
    if (!canScrollLeft) return;
    setThumbStart((i) => Math.max(0, i - 1));
  }, [canScrollLeft]);

  const handleNextThumbs = useCallback(() => {
    if (!canScrollRight) return;
    setThumbStart((i) => Math.min(Math.max(0, images.length - VISIBLE_THUMBS), i + 1));
  }, [canScrollRight, images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) <= 50) return;

    setCurrentIndex((i) => {
      if (distance > 0) return Math.min(i + 1, images.length - 1);
      return Math.max(i - 1, 0);
    });
  }, [images.length]);

  const typeItemForPrimaryCategory = useMemo(() => {
    const types = Array.isArray(safeProduct.type) ? safeProduct.type.filter(Boolean) : [];
    if (!types.length) return null;

    const candidates = types
      .map(
        (
          entry
        ): { collection: string | undefined; item: Record<string, unknown> } | null => {
          const item =
            entry?.item && typeof entry.item === "object"
              ? (entry.item as Record<string, unknown>)
              : null;

          if (!item) return null;

          return {
            collection: entry?.collection,
            item,
          };
        }
      )
      .filter(
        (
          entry
        ): entry is { collection: string | undefined; item: Record<string, unknown> } =>
          entry !== null
      );

    if (!candidates.length) return null;

    const visibleFilters = Array.isArray(filtersMeta) ? filtersMeta : [];

    if (visibleFilters.length > 0) {
      let bestMatch: Record<string, unknown> | null = null;
      let bestScore = -1;
      let bestRenderableCount = -1;

      for (const candidate of candidates) {
        const score = getFilterMatchCount(candidate.item, visibleFilters);
        const renderableCount = getRenderableFieldCount(candidate.item);

        if (
          score > bestScore ||
          (score === bestScore && renderableCount > bestRenderableCount)
        ) {
          bestScore = score;
          bestRenderableCount = renderableCount;
          bestMatch = candidate.item;
        }
      }

      if (bestMatch && bestScore > 0) {
        return bestMatch;
      }
    }

    let richestItem: Record<string, unknown> | null = null;
    let richestCount = -1;

    for (const candidate of candidates) {
      const renderableCount = getRenderableFieldCount(candidate.item);
      if (renderableCount > richestCount) {
        richestCount = renderableCount;
        richestItem = candidate.item;
      }
    }

    if (richestItem) {
      return richestItem;
    }

    return candidates[0]?.item ?? null;
  }, [safeProduct.type, filtersMeta]);

  const normalizedKeyMap = useMemo(() => {
    if (!typeItemForPrimaryCategory) return null;

    const map = new Map<string, string>();
    for (const key of Object.keys(typeItemForPrimaryCategory)) {
      map.set(normalize(key), key);
    }
    return map;
  }, [typeItemForPrimaryCategory]);

  const resolvedFilters = useMemo(() => {
    const item = typeItemForPrimaryCategory;
    if (!item) return [];

    const visibleFilters = Array.isArray(filtersMeta) ? filtersMeta.slice(0, 8) : [];

    if (visibleFilters.length > 0 && normalizedKeyMap) {
      const mapped = visibleFilters
        .map((filter) => {
          const wanted = normalize(filter.field);
          const realKey = normalizedKeyMap.get(wanted);
          if (!realKey) return null;

          const raw = item[realKey];
          if (!isMeaningfulValue(raw)) return null;

          const rawValue = stringifyValue(raw);
          if (!rawValue) return null;

          const pretty =
            filter.options?.find((option) => normalize(option.value) === normalize(rawValue))
              ?.text ?? rawValue;

          return {
            field: filter.field,
            label: filter.label,
            value: pretty,
          };
        })
        .filter(
          (entry): entry is { field: string; label: string; value: string } => entry !== null
        );

      if (mapped.length > 0) {
        return mapped;
      }
    }

    const ignoredKeys = new Set([
      "id",
      "status",
      "sort",
      "user_created",
      "date_created",
      "user_updated",
      "date_updated",
      "devices",
      "collection",
      "category",
    ]);

    return Object.entries(item)
      .filter(([key, value]) => !ignoredKeys.has(key) && isMeaningfulValue(value))
      .map(([key, value]) => {
        const prettyValue = stringifyValue(value);
        if (!prettyValue) return null;

        return {
          field: key,
          label: formatFallbackLabel(key),
          value: prettyValue,
        };
      })
      .filter(
        (entry): entry is { field: string; label: string; value: string } => entry !== null
      )
      .slice(0, 8);
  }, [typeItemForPrimaryCategory, normalizedKeyMap, filtersMeta]);

  console.log("resolvedFilters:", JSON.stringify(resolvedFilters, null, 2));

  const isMissingProduct = !product;

  return (
    <main
      className="w-full mx-auto px-4 md:px-6 py-9 2xl:px-28 md:py-12"
      data-directus={setAttr({
        collection: "products",
        item: productId,
        fields: ["seo_title", "seo_description"],
        mode: "drawer",
      })}
    >
      {isMissingProduct ? (
        <p className="text-gray-500">Brak danych produktu.</p>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-18 items-center lg:items-start">
            <div
              className="flex-1 flex flex-col items-center w-full gap-8"
              data-directus={setAttr({
                collection: "products",
                item: productId,
                fields: "images",
                mode: "drawer",
              })}
            >
              <div
                className="w-full lg:max-w-[600px] h-[460px] flex justify-center items-center overflow-hidden bg-gray-100"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <Image
                  src={images[currentIndex]}
                  alt={safeProduct.model || "Produkt"}
                  width={576}
                  height={460}
                  className="object-contain transition-transform duration-300 ease-in-out"
                  priority
                  unoptimized={images[currentIndex].startsWith("/backend/assets/")}
                />
              </div>

              {images.length > 1 && (
                <div className="flex justify-center items-center gap-3 w-full max-w-[600px] select-none">
                  <button
                    onClick={handlePrevThumbs}
                    aria-label="Poprzedni slajd"
                    disabled={!canScrollLeft}
                    className={`hidden md:flex justify-center items-center transition ${
                      canScrollLeft ? "opacity-100" : "opacity-40 cursor-default"
                    }`}
                    type="button"
                  >
                    <Image
                      src="/static/icons/ArrowBack.svg"
                      alt="Poprzedni"
                      width={32}
                      height={32}
                    />
                  </button>

                  <div className="flex justify-start items-center gap-4 overflow-hidden flex-1 transition-all duration-300 ease-in-out">
                    {visibleImages.map((img, i) => (
                      <button
                        key={`${img}-${i}`}
                        onClick={() => setCurrentIndex(i + thumbStart)}
                        className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 border border-transparent hover:border-gray-300 transition"
                        aria-label={`Wybierz miniaturę ${i + 1}`}
                        type="button"
                      >
                        <Image
                          src={img}
                          alt={`miniatura-${i}`}
                          fill
                          style={{ objectFit: "cover" }}
                          unoptimized={img.startsWith("/backend/assets/")}
                        />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextThumbs}
                    aria-label="Następny slajd"
                    disabled={!canScrollRight}
                    className={`hidden md:flex justify-center items-center transition ${
                      canScrollRight ? "opacity-100" : "opacity-40 cursor-default"
                    }`}
                    type="button"
                  >
                    <Image
                      src="/static/icons/ArrowNext.svg"
                      alt="Następny"
                      width={32}
                      height={32}
                    />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col w-full items-start">
              <div className="mb-10">
                <h2
                  className="text-gray-500 text-3xl font-semibold font-['Montserrat'] mb-1"
                  data-directus={setAttr({
                    collection: "products",
                    item: productId,
                    fields: "brand",
                    mode: "popover",
                  })}
                >
                  {safeProduct.brand?.name || "Marka"}
                </h2>

                <h1
                  className="text-5xl md:text-6xl font-semibold font-['Montserrat'] text-Text-headings"
                  data-directus={setAttr({
                    collection: "products",
                    item: productId,
                    fields: "model",
                    mode: "popover",
                  })}
                >
                  {safeProduct.model || "Model produktu"}
                </h1>
              </div>

              <div
                className="flex flex-col gap-3 mb-10"
                data-directus={setAttr({
                  collection: "products",
                  item: productId,
                  fields: "type",
                  mode: "popover",
                })}
              >
                {resolvedFilters.length > 0 ? (
                  resolvedFilters.map((filter) => (
                    <div
                      key={filter.field}
                      className="text-2xl font-normal font-['Montserrat'] leading-7 text-Text-body"
                    >
                      {filter.label}:{" "}
                      <span className="font-semibold text-Text-headings">
                        {filter.value}
                      </span>
                    </div>
                  ))
                ) : isVisualEditor ? (
                  <p className="text-gray-400 italic text-lg">
                    Brak filtrów do wyświetlenia.
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                className="bg-[#E4002B] text-white text-2xl font-semibold font-['Montserrat'] py-4 px-10 rounded-lg hover:bg-red-600 transition"
              >
                Skontaktuj się z nami
              </button>
            </div>
          </div>

          <div
            className="w-full mt-20 py-10"
            data-directus={setAttr({
              collection: "products",
              item: productId,
              fields: ["components", "components_nav", "files"],
              mode: "drawer",
            })}
          >
            <Tabs product={tabsProduct} files={tabsProduct.files ?? []} />
          </div>
        </>
      )}
    </main>
  );
}
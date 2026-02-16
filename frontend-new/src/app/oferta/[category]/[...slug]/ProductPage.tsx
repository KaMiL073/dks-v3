// frontend-new/src/app/oferta/[category]/[...slug]/ProductPage.tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Tabs from "../../components/Tabs";
import { initializeVisualEditor, setAttr } from "@/lib/visual-editor";
import "@/styles/rich-content.scss";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface DirectusRelationItem {
  collection?: string;
  item: Record<string, unknown>;
}

interface ProductComponent {
  collection: string;
  item: Record<string, unknown>;
}

interface Product {
  id: string | number;
  model?: string;
  slug?: string;
  description?: string;
  price?: number;

  primarycategory?: string | null;

  images?: { directus_files_id: string }[];
  brand?: { name?: string; id?: string };
  type?: DirectusRelationItem[];
  components?: ProductComponent[];
  files?: { id: string; filename_download?: string }[];
}

export interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const FALLBACK_IMAGE = "/static/576x464.svg";
const VISIBLE_THUMBS = 4;

// stała – nie licz tego przy każdym renderze
const BACKEND =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8055").replace(/\/$/, "");

function normalize(v: unknown) {
  return String(v ?? "").toLowerCase().trim().replace(/[_\s-]+/g, "");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function ProductPage({
  product,
  filtersMeta = [],
}: {
  product: Product;
  filtersMeta?: FilterField[];
}) {
  /* -------------------------------- Visual Editor ------------------------------- */

  const [isVisualEditor, setIsVisualEditor] = useState(false);

  // init VE (tylko raz)
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initializeVisualEditor();
      } catch (err) {
        // nie spamuj w prod; w dev przyda się
        if (process.env.NODE_ENV !== "production") {
          console.error("Directus init error:", err);
        }
      }
      if (!cancelled) {
        // dodatkowe wykrycie: jeżeli VE już jest globalnie
        const w = window as any;
        if (w?.DirectusVisualEditor || w?.__DirectusVisualEditor) setIsVisualEditor(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // nasłuch message (tylko raz)
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data: any = event.data;

      const hit =
        (typeof data === "object" && (data?.action === "confirm" || data?.type === "directus-visual-editor-init")) ||
        (typeof data === "string" && data.includes("Directus Visual Editor"));

      if (hit) setIsVisualEditor(true);
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  /* --------------------------------- Images ----------------------------------- */

  const galleryImages = useMemo(() => {
    const imgs = Array.isArray(product?.images) ? product.images : [];
    return imgs.length > 0 ? imgs.map((img) => `${BACKEND}/assets/${img.directus_files_id}`) : [];
  }, [product?.images]);

  const images = useMemo(() => {
    return galleryImages.length > 0 ? galleryImages : [FALLBACK_IMAGE];
  }, [galleryImages]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);

  // reset gdy zmienia się produkt / galeria
  useEffect(() => {
    setCurrentIndex(0);
    setThumbStart(0);
  }, [product?.id, images.length]);

  // pilnuj, żeby indeksy były poprawne (np. gdy obrazków ubyło)
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
    setThumbStart((i) => Math.min(images.length - VISIBLE_THUMBS, i + 1));
  }, [canScrollRight, images.length]);

  /* ---------------------------------- Swipe ----------------------------------- */

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
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

  /* --------------------------------- Filters ---------------------------------- */

  const visibleFilters = useMemo(() => (Array.isArray(filtersMeta) ? filtersMeta.slice(0, 4) : []), [
    filtersMeta,
  ]);

  const typeItemForPrimaryCategory = useMemo(() => {
    const types = Array.isArray(product?.type) ? product.type : [];
    if (!types.length) return null;

    const primary = typeof product?.primarycategory === "string" ? product.primarycategory : "";
    const p = normalize(primary);

    // 1) exact match: collection === primarycategory
    if (p) {
      const exact = types.find((t) => normalize(t?.collection) === p);
      if (exact?.item) return exact.item;
    }

    // 2) fallback: devices/type zawiera primary
    if (p) {
      const fallback = types.find((t) => {
        const item = (t?.item ?? {}) as Record<string, unknown>;
        return normalize(item["devices"]).includes(p) || normalize(item["type"]).includes(p);
      });
      if (fallback?.item) return fallback.item;
    }

    // 3) first valid item
    const first = types.find((t) => t?.item && typeof t.item === "object");
    return (first?.item as Record<string, unknown>) ?? null;
  }, [product?.type, product?.primarycategory]);

  // mapa: normalizedKey -> realKey (żeby Disk == disk działało szybko)
  const normalizedKeyMap = useMemo(() => {
    const item = typeItemForPrimaryCategory as Record<string, unknown> | null;
    if (!item) return null;

    const map = new Map<string, string>();
    for (const k of Object.keys(item)) {
      map.set(normalize(k), k);
    }
    return map;
  }, [typeItemForPrimaryCategory]);

  const resolvedFilters = useMemo(() => {
    const item = typeItemForPrimaryCategory as Record<string, unknown> | null;
    if (!item || !normalizedKeyMap || visibleFilters.length === 0) return [];

    return visibleFilters
      .map((f) => {
        const wanted = normalize(f.field);
        const realKey = normalizedKeyMap.get(wanted) ?? f.field;

        const raw = (item as any)?.[realKey];
        if (raw == null) return null;

        const val = String(raw).trim();
        if (!val) return null;

        const pretty = f.options?.find((o) => String(o.value) === val)?.text ?? val;

        return { field: f.field, label: f.label, value: pretty };
      })
      .filter(Boolean) as { field: string; label: string; value: string }[];
  }, [typeItemForPrimaryCategory, normalizedKeyMap, visibleFilters]);

  /* ---------------------------------- UI -------------------------------------- */

  return (
    <main
      className="w-full mx-auto px-4 md:px-6 py-9 2xl:px-28 md:py-12"
      data-directus={setAttr({
        collection: "products",
        item: product.id,
        fields: ["seo_title", "seo_description"],
        mode: "drawer",
      })}
    >
      <div className="flex flex-col lg:flex-row gap-18 items-center lg:items-start">
        {/* LEWA STRONA — GALERIA */}
        <div
          className="flex-1 flex flex-col items-center w-full gap-8"
          data-directus={setAttr({
            collection: "products",
            item: product.id,
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
              alt={product.model || "Produkt"}
              width={576}
              height={460}
              className="object-contain transition-transform duration-300 ease-in-out"
              priority
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
              >
                <Image src="/static/icons/ArrowBack.svg" alt="Poprzedni" width={32} height={32} />
              </button>

              <div className="flex justify-start items-center gap-4 overflow-hidden flex-1 transition-all duration-300 ease-in-out">
                {visibleImages.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setCurrentIndex(i + thumbStart)}
                    className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 border border-transparent hover:border-gray-300 transition"
                    aria-label={`Wybierz miniaturę ${i + 1}`}
                  >
                    <Image src={img} alt={`miniatura-${i}`} fill style={{ objectFit: "cover" }} />
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
              >
                <Image src="/static/icons/ArrowNext.svg" alt="Następny" width={32} height={32} />
              </button>
            </div>
          )}
        </div>

        {/* PRAWA STRONA — INFORMACJE */}
        <div className="flex-1 flex flex-col w-full items-start">
          <div className="mb-10">
            <h2
              className="text-gray-500 text-3xl font-semibold font-['Montserrat'] mb-1"
              data-directus={setAttr({
                collection: "products",
                item: product.id,
                fields: "brand",
                mode: "popover",
              })}
            >
              {product.brand?.name || "Marka"}
            </h2>

            <h1
              className="text-5xl md:text-6xl font-semibold font-['Montserrat'] text-Text-headings"
              data-directus={setAttr({
                collection: "products",
                item: product.id,
                fields: "model",
                mode: "popover",
              })}
            >
              {product.model || "Model produktu"}
            </h1>
          </div>

          {/* ✅ FILTRY — polskie label + wartości z type.item */}
          <div
            className="flex flex-col gap-3 mb-10"
            data-directus={setAttr({
              collection: "products",
              item: product.id,
              fields: "type",
              mode: "popover",
            })}
          >
            {resolvedFilters.length > 0 ? (
              resolvedFilters.map((f) => (
                <div
                  key={f.field}
                  className="text-2xl font-normal font-['Montserrat'] leading-7 text-Text-body"
                >
                  {f.label}: <span className="font-semibold text-Text-headings">{f.value}</span>
                </div>
              ))
            ) : (
              // jak wolisz: pokazuj tylko w VE -> {isVisualEditor && (...)}
              <p className="text-gray-400 italic text-lg">Brak filtrów do wyświetlenia.</p>
            )}
          </div>

          <button className="bg-[#E4002B] text-white text-2xl font-semibold font-['Montserrat'] py-4 px-10 rounded-lg hover:bg-red-600 transition">
            Skontaktuj się z nami
          </button>
        </div>
      </div>

      {/* Zakładki */}
      <div
        className="w-full mt-20 py-10"
        data-directus={setAttr({
          collection: "products",
          item: product.id,
          fields: ["components", "components_nav", "files"],
          mode: "drawer",
        })}
      >
        <Tabs product={product} files={product.files} />
      </div>
    </main>
  );
}
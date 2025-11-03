"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Tabs from "../../components/Tabs";
import { initializeVisualEditor, setAttr } from "@/lib/visual-editor";
import "@/styles/rich-content.scss";

// 🧩 Typy Directusa (relacje itp.)
interface DirectusRelationItem {
  collection: string;
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
  images?: { directus_files_id: string }[];
  brand?: { name?: string; id?: string };
  type?: DirectusRelationItem[];
  components?: ProductComponent[];
  files?: { id: string; filename_download?: string }[];
}

interface FilterField {
  field: string;
  label: string;
  options?: { text: string; value: string }[];
}

export default function ProductPage({
  product,
  filtersMeta = [],
}: {
  product: Product;
  filtersMeta?: FilterField[];
}) {
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
    "http://localhost:8055";

  // 🔹 Inicjalizacja Directus Visual Editor
  useEffect(() => {
    initializeVisualEditor();
  }, []);

  // 🔹 Wykrywanie trybu Visual Editora przez nasłuchiwanie postMessage
  const [isVisualEditor, setIsVisualEditor] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMessage = (event: MessageEvent) => {
      const data = event.data;

      // 🟢 Directus 10.12+
      if (typeof data === "object" && data?.action === "confirm") {
        setIsVisualEditor(true);
      }

      // 🟡 Directus <10.11
      if (typeof data === "string" && data.includes("Directus Visual Editor")) {
        setIsVisualEditor(true);
      }

      // 🟠 Starsze wersje
      if (typeof data === "object" && data?.type === "directus-visual-editor-init") {
        setIsVisualEditor(true);
      }
    };

    window.addEventListener("message", handleMessage);

    // 🔸 fallback
    const globalAny = window as unknown as {
      DirectusVisualEditor?: unknown;
      __DirectusVisualEditor?: unknown;
    };

    if (globalAny.DirectusVisualEditor || globalAny.__DirectusVisualEditor) {
      setIsVisualEditor(true);
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // 🔹 Galeria zdjęć produktu
  const galleryImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.map((img) => `${backend}/assets/${img.directus_files_id}`)
      : [];

  const mainImageUrl = galleryImages[0] || "/static/576x464.svg";
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = galleryImages.length > 0 ? galleryImages : [mainImageUrl];

  // 🔹 Swipe obsługa (mobile)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStartX.current = e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    (touchEndX.current = e.touches[0].clientX);
  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0 && currentIndex < images.length - 1)
        setCurrentIndex((i) => i + 1);
      if (distance < 0 && currentIndex > 0)
        setCurrentIndex((i) => i - 1);
    }
  };

  // 🔹 Miniatury
  const [thumbStart, setThumbStart] = useState(0);
  const visibleThumbs = 4;
  const canScrollLeft = thumbStart > 0;
  const canScrollRight = thumbStart + visibleThumbs < images.length;
  const handlePrev = () =>
    canScrollLeft && setThumbStart((i) => Math.max(0, i - 1));
  const handleNext = () =>
    canScrollRight &&
    setThumbStart((i) => Math.min(images.length - visibleThumbs, i + 1));
  const visibleImages = images.slice(thumbStart, thumbStart + visibleThumbs);

  // 🔹 Pobieranie wartości filtrów z relacji typu
  const getFilterValue = (field: string): string | undefined => {
    const typeArray = Array.isArray(product.type) ? product.type : [];
    for (const t of typeArray) {
      const item = t?.item as Record<string, unknown> | undefined;
      if (item && field in item && item[field]) {
        return String(item[field]);
      }
    }
    return undefined;
  };

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
      {/* 🔸 Sekcja z galerią i informacjami */}
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
          {/* Główne zdjęcie */}
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

          {/* Miniatury */}
          {images.length > 1 && (
            <div className="flex justify-center items-center gap-3 w-full max-w-[600px] select-none">
              <button
                onClick={handlePrev}
                aria-label="Poprzedni slajd"
                disabled={!canScrollLeft}
                className={`hidden md:flex justify-center items-center transition ${
                  canScrollLeft ? "opacity-100" : "opacity-40 cursor-default"
                }`}
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
                    key={i}
                    onClick={() => setCurrentIndex(i + thumbStart)}
                    className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0 border border-transparent hover:border-gray-300 transition"
                  >
                    <Image
                      src={img}
                      alt={`miniatura-${i}`}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                aria-label="Następny slajd"
                disabled={!canScrollRight}
                className={`hidden md:flex justify-center items-center transition ${
                  canScrollRight ? "opacity-100" : "opacity-40 cursor-default"
                }`}
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

          {/* 🔸 Filtry */}
          <div
            className="flex flex-col gap-3 mb-10"
            data-directus={setAttr({
              collection: "products",
              item: product.id,
              fields: "type",
              mode: "popover",
            })}
          >
            {filtersMeta.length > 0 ? (
              filtersMeta.slice(0, 4).map((filter, i) => {
                const rawValue = getFilterValue(filter.field);
                const translatedValue =
                  filter.options?.find((opt) => opt.value === rawValue)?.text ||
                  rawValue ||
                  "—";

                return (
                  <div
                    key={i}
                    className="text-2xl font-normal font-['Montserrat'] leading-7 text-Text-body"
                  >
                    {filter.label}:{" "}
                    <span className="font-semibold text-Text-headings">
                      {translatedValue}
                    </span>
                  </div>
                );
              })
            ) : (
              isVisualEditor && (
                <p className="text-gray-400 italic text-lg">
                  Nie wybrano kategorii.
                </p>
              )
            )}
          </div>

          <button className="bg-[#E4002B] text-white text-2xl font-semibold font-['Montserrat'] py-4 px-10 rounded-lg hover:bg-red-600 transition">
            Skontaktuj się z nami
          </button>
        </div>
      </div>

      {/* Zakładki (opis / pliki / komponenty) */}
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
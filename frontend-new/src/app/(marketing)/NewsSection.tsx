"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import BlogImage from "@/components/BlogImage";

export interface News {
  id: string;
  title: string;
  lead: string;
  slug: string;
  image: string | null;
  thumbnail?: string | null;
}

type NewsApiResponse = {
  ok?: boolean;
  items?: News[];
};

// Zamienia:
// - https://dks.pl/backend/assets/<id>?imwidth=1920
// - http://188.252.84.172/backend/assets/<id>?imwidth=1920
// - http://localhost/backend/assets/<id>?imwidth=1920
// - samo UUID
// na:
// - /backend/assets/<id>?imwidth=1920
function normalizeDirectusImage(src: string | null) {
  if (!src) return null;

  if (src.startsWith("/backend/assets/")) return src;

  try {
    const u = new URL(src);

    if (u.pathname.startsWith("/backend/assets/")) {
      return `${u.pathname}${u.search}`;
    }

    return src;
  } catch {
    // jeśli src nie jest URL-em, traktujemy go jako samo ID z Directusa
    return `/backend/assets/${src}`;
  }
}

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<News[]>([]);
  const [current, setCurrent] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const visibleCards = viewportWidth >= 1100 ? 2 : 1;
  const maxIndex = Math.max(0, newsItems.length - visibleCards);
  const cardWidth = (viewportWidth - (visibleCards - 1) * 24) / visibleCards;

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(([entry]) => setViewportWidth(entry.contentRect.width));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [newsItems.length]);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    fetch("/api/news?limit=4")
      .then((res) => res.json())
      .then((data: News[] | NewsApiResponse) => {
        if (Array.isArray(data)) {
          setNewsItems(data);
          return;
        }

        if (Array.isArray(data?.items)) {
          setNewsItems(data.items);
          return;
        }

        setNewsItems([]);
      })
      .catch((err) => {
        console.error("Błąd pobierania newsów:", err);
        setNewsItems([]);
      });
  }, []);

  useEffect(() => {
    if (current > maxIndex) {
      setCurrent(0);
    }
  }, [maxIndex, current]);

  const handlePrev = () => {
    if (newsItems.length <= 1) return;
    setCurrent((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    if (newsItems.length <= 1) return;
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => setCurrent(index);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || newsItems.length <= 1) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();

    touchStartX.current = null;
  };

  if (newsItems.length === 0) {
    return null;
  }

  return (
    <section
      className="p-6 xl:px-28 py-20 flex flex-col items-center gap-16 bg-surface-page"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-4xl font-semibold text-Text-body text-center">
        Dowiedz się więcej
      </h2>

      <div className="flex w-full min-w-0 items-center gap-2 md:gap-6">
        <button type="button" onClick={handlePrev} aria-label="Poprzedni slajd">
          <Image
            src="/static/icons/ArrowBack.svg"
            alt="Poprzedni"
            width={32}
            height={32}
          />
        </button>

        <div ref={viewportRef} className="flex-1 min-w-0 overflow-hidden">
          <div
            className="flex transition-transform duration-500 gap-6"
            style={{ transform: `translateX(-${current * (cardWidth + 24)}px)` }}
          >
            {newsItems.map((item) => {
              const imgSrc =
                normalizeDirectusImage(item.thumbnail || item.image) ??
                "/static/homepage/Obraz-a.webp";

              return (
                <div
                  key={item.id}
                  className="shrink-0 min-w-0 px-6 py-10 bg-gray-300 shadow"
                  style={{ width: viewportWidth ? cardWidth : "100%" }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
                    <BlogImage
                      variant="thumbnail"
                      src={imgSrc}
                      alt={item.title}
                      className="w-full min-w-0 h-auto aspect-[4/3] object-cover"
                    />
                    <div className="min-w-0 flex flex-col justify-center">
                      <p className="text-xl md:text-2xl font-semibold text-Text-body text-center md:text-left break-words">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button type="button" onClick={handleNext} aria-label="Następny slajd">
          <Image
            src="/static/icons/ArrowNext.svg"
            alt="Następny"
            width={32}
            height={32}
          />
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {newsItems.slice(0, maxIndex + 1).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleDotClick(i)}
            className={`w-3 h-3 rounded-full ${
              i === current ? "bg-[#E7000B]" : "bg-[#FFA2A2]"
            }`}
            aria-label={`Przejdź do artykułu ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

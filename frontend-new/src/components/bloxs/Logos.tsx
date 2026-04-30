"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Heading2 } from "@/components/ui/Typography/Heading2";

type LogoFile = {
  id: number;
  logos_id?: number;
  directus_files_id: string;
};

type LogosSectionItem = {
  id: number;
  name?: string;
  description?: string;
  logo?: LogoFile[];
};

export default function LogosSection({
  item,
}: {
  item: LogosSectionItem;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [logosPerPage, setLogosPerPage] = useState(2);
  const activeRef = useRef(0);

  const logos = Array.isArray(item.logo) ? item.logo : [];

  useEffect(() => {
    const updateLogosPerPage = () => {
      const width = window.innerWidth;

      if (width >= 1536) {
        setLogosPerPage(5);
      } else if (width >= 1024) {
        setLogosPerPage(3);
      } else {
        setLogosPerPage(2);
      }
    };

    updateLogosPerPage();
    window.addEventListener("resize", updateLogosPerPage);

    return () => window.removeEventListener("resize", updateLogosPerPage);
  }, []);

  const totalPages = Math.max(1, Math.ceil(logos.length / logosPerPage));

  const scrollToPage = useCallback(
    (pageIndex: number) => {
      const el = containerRef.current;
      if (!el) return;

      const items = Array.from(
        el.querySelectorAll<HTMLElement>(".partner-item")
      );
      if (items.length === 0) return;

      const targetIdx = Math.min(pageIndex * logosPerPage, items.length - 1);
      const targetEl = items[targetIdx];

      const left = targetEl.offsetLeft - el.offsetLeft;
      el.scrollTo({ left, behavior: "smooth" });

      activeRef.current = pageIndex;
      setActiveIndex(pageIndex);
    },
    [logosPerPage]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;

    const recomputeActive = () => {
      const items = Array.from(
        el.querySelectorAll<HTMLElement>(".partner-item")
      );
      if (items.length === 0) return;

      const startOffsets = Array.from({ length: totalPages }, (_, i) => {
        const idx = Math.min(i * logosPerPage, items.length - 1);
        return items[idx].offsetLeft - el.offsetLeft;
      });

      const scrollLeft = el.scrollLeft;
      let best = 0;
      let bestDiff = Infinity;

      startOffsets.forEach((offset, idx) => {
        const diff = Math.abs(scrollLeft - offset);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = idx;
        }
      });

      if (best !== activeRef.current) {
        activeRef.current = best;
        setActiveIndex(best);
      }
    };

    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(recomputeActive);
    };

    el.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);

    handler();

    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      cancelAnimationFrame(raf);
    };
  }, [logosPerPage, totalPages]);

  if (logos.length === 0) return null;

  return (
    <section className="flex flex-col gap-12 bg-surface-page py-12 md:py-20 py-18 px-4 sm:px-6 lg:px-8 xl:px-28">
      <Heading2 variant="semibold">
        {item.name?.trim() || "Nasi Partnerzy"}
      </Heading2>

      {item.description ? <p className="text-xl">{item.description}</p> : null}

      <div
        ref={containerRef}
        className="carousel flex w-full snap-x snap-mandatory gap-16 overflow-x-auto overflow-y-hidden scroll-smooth"
      >
        {logos.map((logo, i) => {
          const src = `/backend/assets/${logo.directus_files_id}`;

          return (
            <div
              key={`${logo.id}-${i}`}
              className="partner-item flex h-20 w-40 flex-shrink-0 snap-start items-center justify-center"
            >
              <img
                src={src}
                alt={`Logo ${i + 1}`}
                className="h-auto max-h-20 w-auto max-w-full object-contain"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToPage(i)}
              className={`h-3 w-3 rounded-full transition-transform focus:outline-none ${
                i === activeIndex ? "scale-110 bg-red-600" : "bg-red-300"
              }`}
              aria-label={`Przejdź do strony ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      )}

      <style jsx>{`
        .carousel::-webkit-scrollbar {
          display: none;
        }

        .carousel {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .partner-item {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}
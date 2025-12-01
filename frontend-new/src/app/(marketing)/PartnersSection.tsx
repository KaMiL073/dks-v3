"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { Heading2 } from "@/components/ui/Typography/Heading2";
import Image from "next/image";

const partners = [
  { src: "static/homepage/logos/konica-minolta.svg", alt: "Konica Minolta", w: 170, h: 80 },
  { src: "static/homepage/logos/lexmark.svg", alt: "Lexmark", w: 150, h: 50 },
  { src: "static/homepage/logos/canon.svg", alt: "Canon", w: 150, h: 50 },
  { src: "static/homepage/logos/hp.svg", alt: "HP", w: 60, h: 60 },
  { src: "static/homepage/logos/epson.svg", alt: "Epson", w: 150, h: 25 },
  { src: "static/homepage/logos/contex.svg", alt: "Contex", w: 150, h: 50 },
  { src: "static/homepage/logos/kip.svg", alt: "KIP", w: 100, h: 100 },
  { src: "static/homepage/logos/lenovo.svg", alt: "Lenovo", w: 150, h: 50 },
  { src: "static/homepage/logos/dell.svg", alt: "Dell", w: 80, h: 80 },
  { src: "static/homepage/logos/brother.svg", alt: "Brother", w: 150, h: 50 },
  { src: "static/homepage/logos/y-soft.svg", alt: "Y Soft", w: 150, h: 50 },
  { src: "static/homepage/logos/ricoh.svg", alt: "Ricoh", w: 150, h: 50 },
];
export default function PartnersSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [logosPerPage, setLogosPerPage] = useState(2);
  const activeRef = useRef(0);

  // ustal logosPerPage zależnie od szerokości ekranu
  useEffect(() => {
    const updateLogosPerPage = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setLogosPerPage(5); // 2xl
      } else if (width >= 1024) {
        setLogosPerPage(3); // lg+
      } else {
        setLogosPerPage(2); // < md
      }
    };

    updateLogosPerPage();
    window.addEventListener("resize", updateLogosPerPage);
    return () => window.removeEventListener("resize", updateLogosPerPage);
  }, []);

  const totalPages = Math.max(1, Math.ceil(partners.length / logosPerPage));

  const scrollToPage = useCallback(
    (pageIndex: number) => {
      const el = containerRef.current;
      if (!el) return;

      const items = Array.from(el.querySelectorAll<HTMLElement>(".partner-item"));
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

  // aktualizacja kropek przy scrollu
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;

    const recomputeActive = () => {
      const items = Array.from(el.querySelectorAll<HTMLElement>(".partner-item"));
      if (items.length === 0) return;

      const startOffsets = Array.from({ length: totalPages }, (_, i) => {
        const idx = Math.min(i * logosPerPage, items.length - 1);
        return items[idx].offsetLeft - el.offsetLeft;
      });

      const scrollLeft = el.scrollLeft;
      let best = 0;
      let bestDiff = Infinity;
      startOffsets.forEach((offset, idx) => {
        const d = Math.abs(scrollLeft - offset);
        if (d < bestDiff) {
          bestDiff = d;
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

    handler(); // initial sync

    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      cancelAnimationFrame(raf);
    };
  }, [logosPerPage, totalPages]);

  return (
    <section className="px-6 md:px-28 py-12 md:py-20 bg-surface-page flex flex-col gap-12">
      <Heading2 variant="semibold">Nasi Partnerzy</Heading2>
      <p className="text-xl">
        Naszą silną i stabilną pozycję na rynku urządzeń biurowych i
        poligraficznych budujemy w oparciu o bliską współpracę z czołowymi
        światowymi producentami i markami.
      </p>

      {/* Karuzela logotypów */}
      <div
        ref={containerRef}
        className="carousel flex w-full gap-16 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
      >
        {partners.map((partner, i) => (
          <div
            key={i}
            className="partner-item flex-shrink-0 snap-start flex items-center justify-center w-40 h-20"
          >
            <Image
              src={partner.src}
              alt={partner.alt}
              width={partner.w}
              height={partner.h}
              className="object-contain"
            />
          </div>
        ))}
      </div>

      {/* Nawigacja kropkami */}
      <div className="flex justify-center gap-3 mt-6">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={`w-3 h-3 rounded-full transition-transform focus:outline-none ${
              i === activeIndex ? "bg-red-600 scale-110" : "bg-red-300"
            }`}
          />
        ))}
      </div>

      {/* Lokalne style */}
      <style jsx>{`
        .carousel::-webkit-scrollbar {
          display: none;
        }
        .carousel {
          -ms-overflow-style: none; /* IE + Edge */
          scrollbar-width: none; /* Firefox */
        }
        .partner-item {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
}
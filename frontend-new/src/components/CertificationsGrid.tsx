"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Certification } from "@/lib/certifications";

export default function CertificationsGrid({ items }: { items: Certification[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = useMemo(
    () => items.find((x) => x.id === activeId) ?? null,
    [items, activeId]
  );

  useEffect(() => {
    if (!active) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setActiveId(null);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  if (!items?.length) return null;

  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-12">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className="group text-left w-full"
            >
              {/* “płótno” pod certyfikat */}
              <div
                className="
                  w-full bg-white
                  flex items-center justify-center
                  overflow-hidden
                "
              >
                <div className="relative w-full h-[320px] sm:h-[360px] lg:h-[420px]">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-Text-body/60">
                      Brak podglądu
                    </div>
                  )}
                </div>
              </div>

              {/* podpis */}
              <p className="mt-4 text-center text-xs md:text-sm text-Text-body/70">
                {item.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* MODAL – podgląd jak klikniesz */}
      {active ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => e.target === e.currentTarget && setActiveId(null)}
        >
          <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-xl">
            <div className="flex items-center justify-between gap-4 px-4 md:px-6 py-4 border-b border-Text-stroke/20">
              <h4 className="text-base md:text-lg font-semibold text-Text-headings">
                {active.name}
              </h4>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="rounded-xl px-3 py-2 text-sm font-medium bg-Text-stroke/10 hover:bg-Text-stroke/20 transition"
              >
                Zamknij
              </button>
            </div>

            <div className="relative w-full h-[70vh] bg-white">
              {active.image ? (
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
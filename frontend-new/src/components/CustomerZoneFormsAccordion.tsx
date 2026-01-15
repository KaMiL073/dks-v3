"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import ServiceCallForm from "@/components/forms/ServiceCallForm";
import ConsumablesOrderFormClientZone from "@/components/forms/ConsumablesOrderFormClientZone";
import CountersFormClientZone from "@/components/forms/CountersFormClientZone";
import DebtCollectionFormClientZone from "@/components/forms/DebtCollectionFormClientZone";
import ContactForm from "./forms/ContactForm";

type SectionKey = "contact" | "service" | "consumables" | "counters" | "debt";

type Item = {
  key: SectionKey;
  title: string;
  hasBorder?: boolean;
};

export default function CustomerZoneFormsAccordion() {
  const items: Item[] = useMemo(
    () => [
      { key: "contact", title: "Kontakt", hasBorder: true },
      { key: "service", title: "Zgłoszenie serwisowe", hasBorder: true },
      {
        key: "consumables",
        title: "Zamawianie materiałów eksploatacyjnych",
        hasBorder: true,
      },
      { key: "counters", title: "Liczniki", hasBorder: true },
      { key: "debt", title: "Dział windykacji", hasBorder: false },
    ],
    []
  );

  // ✅ pozwalamy na zamknięcie (null)
  const [open, setOpen] = useState<SectionKey | null>("contact");

  // refs do scrollowania
  const headerRefs = useRef<Record<SectionKey, HTMLButtonElement | null>>({
    contact: null,
    service: null,
    consumables: null,
    counters: null,
    debt: null,
  });

  const contentRefs = useRef<Record<SectionKey, HTMLDivElement | null>>({
    contact: null,
    service: null,
    consumables: null,
    counters: null,
    debt: null,
  });

  // ✅ po otwarciu: przewiń do początku formularza (z offsetem na sticky nav)
  useEffect(() => {
    if (!open) return;

    // czekamy aż DOM się wyrenderuje (animacja + layout)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = contentRefs.current[open];
        if (!el) return;

        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }, [open]);

  const toggle = (key: SectionKey) => {
    setOpen((prev) => {
      const next = prev === key ? null : key;

      // ✅ jeśli zamykamy sekcję, przewijamy do jej nagłówka
      if (prev === key) {
        requestAnimationFrame(() => {
          const header = headerRefs.current[key];
          header?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }

      return next;
    });
  };

  return (
    <section className="self-stretch px-6 md:px-28 py-20 flex flex-col">
      {items.map((it) => {
        const isOpen = open === it.key;

        return (
          <div key={it.key} className="self-stretch">
            {/* ===== HEADER ===== */}
            <button
              ref={(node) => {
                headerRefs.current[it.key] = node;
              }}
              type="button"
              onClick={() => toggle(it.key)}
              className={[
                "w-full p-6 md:p-12 bg-gray-300 inline-flex items-center gap-2.5 text-left",
                it.hasBorder ? "border-b-4 border-gray-500" : "",
              ].join(" ")}
              aria-expanded={isOpen}
            >
              <div className="flex-1 flex items-center gap-6 md:gap-16">
                <div className="flex-1">
                  <div className="text-Text-headings text-2xl md:text-4xl font-semibold font-['Montserrat'] leading-tight">
                    {it.title}
                  </div>
                </div>

                {/* chevron */}
                <span className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0">
                  <Image
                    src="/static/icons/chevron.svg"
                    alt=""
                    width={48}
                    height={48}
                    className={[
                      "transition-transform duration-200",
                      isOpen ? "rotate-180" : "rotate-0",
                    ].join(" ")}
                  />
                </span>
              </div>
            </button>

            {/* ===== CONTENT ===== */}
            <div
              className={[
                "bg-gray-300 overflow-hidden",
                "grid transition-[grid-template-rows] duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                it.hasBorder ? "border-b-4 border-gray-500" : "",
              ].join(" ")}
            >
              <div className="min-h-0">
                {/* ✅ TO JEST MIEJSCE, DO KTÓREGO SCROLLUJEMY
                    + scroll-margin-top: 80px (żeby sticky nav nie przykrywał) */}
                <div
                  ref={(node) => {
                    contentRefs.current[it.key] = node;
                  }}
                  className="scroll-mt-[80px] py-6 md:py-12 px-6 md:px-12"
                >
                  {it.key === "contact" && <ContactForm compact />
                  }
                  {it.key === "service" && <ServiceCallForm />}
                  {it.key === "consumables" && (
                    <ConsumablesOrderFormClientZone />
                  )}
                  {it.key === "counters" && <CountersFormClientZone />}
                  {it.key === "debt" && <DebtCollectionFormClientZone />}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
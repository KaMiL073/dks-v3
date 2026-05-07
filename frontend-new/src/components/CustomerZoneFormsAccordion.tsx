"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ServiceCallForm from "@/components/forms/ServiceCallForm";
import ConsumablesOrderFormClientZone from "@/components/forms/ConsumablesOrderFormClientZone";
import CountersFormClientZone from "@/components/forms/CountersFormClientZone";
import DebtCollectionFormClientZone from "@/components/forms/DebtCollectionFormClientZone";
import ContactForm from "./forms/ContactForm";

type SectionKey = "contact" | "service" | "consumables" | "counters" | "debt";

type Item = {
  key: SectionKey;
  title: string;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "w-12 h-12 flex items-center justify-center shrink-0 text-Text-headings",
        "transition-transform duration-200",
        open ? "-rotate-90" : "rotate-90", // ✅ FIX
      ].join(" ")}
      aria-hidden="true"
    >
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function CustomerZoneFormsAccordion() {
  const items: Item[] = useMemo(
    () => [
      { key: "contact", title: "Kontakt" },
      { key: "service", title: "Zgłoszenie serwisowe" },
      {
        key: "consumables",
        title: "Zamawianie materiałów eksploatacyjnych",
      },
      { key: "counters", title: "Liczniki" },
      { key: "debt", title: "Dział windykacji" },
    ],
    []
  );

  const [open, setOpen] = useState<SectionKey | null>("contact");

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

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        contentRefs.current[open]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }, [open]);

  const toggle = (key: SectionKey) => {
    setOpen((prev) => {
      const next = prev === key ? null : key;

      if (prev === key) {
        requestAnimationFrame(() => {
          headerRefs.current[key]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }

      return next;
    });
  };

  return (
    <section className="self-stretch px-28 py-20 flex flex-col">
      {items.map((it, index) => {
        const isOpen = open === it.key;
        const isLast = index === items.length - 1;

        return (
          <div key={it.key} className="self-stretch">
            {/* HEADER */}
            <button
              ref={(node) => {
                headerRefs.current[it.key] = node;
              }}
              type="button"
              onClick={() => toggle(it.key)}
              aria-expanded={isOpen}
              className={[
                "w-full p-12 bg-[#D1D5DC] flex justify-between items-center text-left",
                "transition-all duration-200",
                !isLast ? "border-b-4 border-border-primary" : "",
              ].join(" ")}
            >
              <div className="text-Text-headings text-4xl font-semibold font-['Montserrat'] leading-[48px]">
                {it.title}
              </div>

              <Chevron open={isOpen} />
            </button>

            {/* CONTENT */}
            {isOpen && (
              <div className="w-full bg-[#D1D5DC] border-b-4 border-border-primary flex flex-col items-center">
                <div
                  ref={(node) => {
                    contentRefs.current[it.key] = node;
                  }}
                  className="w-full max-w-[1440px] px-28 py-20 scroll-mt-[80px]"
                >
                  {it.key === "contact" && <ContactForm compact />}
                  {it.key === "service" && <ServiceCallForm />}
                  {it.key === "consumables" && (
                    <ConsumablesOrderFormClientZone />
                  )}
                  {it.key === "counters" && <CountersFormClientZone />}
                  {it.key === "debt" && <DebtCollectionFormClientZone />}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
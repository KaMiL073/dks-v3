// frontend-new/src/components/CustomerZoneFormsAccordion.tsx

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import ServiceCallForm from "@/components/forms/ServiceCallForm";
import ConsumablesOrderFormClientZone from "@/components/forms/ConsumablesOrderFormClientZone";
import CountersFormClientZone from "@/components/forms/CountersFormClientZone";
import DebtCollectionFormClientZone from "@/components/forms/DebtCollectionFormClientZone";
import DealerComplaintForm from "@/components/forms/DealerComplaintForm";
import ContactForm from "./forms/ContactForm";

import type { MappedDirectusFieldGroup } from "@/lib/fields";

type SectionKey =
  | "contact"
  | "service"
  | "consumables"
  | "counters"
  | "debt"
  | "complaint";

type Item = {
  key: SectionKey;
  title: string;
};

type Props = {
  complaintFields: MappedDirectusFieldGroup[];
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "w-8 h-8 md:w-10 md:h-10 xl:w-12 xl:h-12 flex items-center justify-center shrink-0 text-Text-headings",
        "transition-transform duration-200",
        open ? "-rotate-90" : "rotate-90",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none">
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

export default function CustomerZoneFormsAccordion({
  complaintFields,
}: Props) {
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
      { key: "complaint", title: "Reklamacja dealerska" },
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
    complaint: null,
  });

  const contentRefs = useRef<Record<SectionKey, HTMLDivElement | null>>({
    contact: null,
    service: null,
    consumables: null,
    counters: null,
    debt: null,
    complaint: null,
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
    <section className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 md:px-10 xl:px-28 py-8 md:py-12 xl:py-20 flex flex-col">
      {items.map((it, index) => {
        const isOpen = open === it.key;
        const isLast = index === items.length - 1;

        return (
          <div key={it.key} className="w-full">
            <button
              ref={(node) => {
                headerRefs.current[it.key] = node;
              }}
              type="button"
              onClick={() => toggle(it.key)}
              aria-expanded={isOpen}
              className={[
                "w-full px-12 py-6 bg-[#D1D5DC] flex justify-between items-center gap-10 text-left",
                "transition-all duration-200",
                !isLast
                  ? "border-b-2 md:border-b-4 border-border-primary"
                  : "",
              ].join(" ")}
            >
              <div className="min-w-0 text-Text-headings text-lg sm:text-xl md:text-2xl xl:text-4xl font-semibold font-['Montserrat'] leading-6 md:leading-8 xl:leading-[48px] break-words">
                {it.title}
              </div>

              <Chevron open={isOpen} />
            </button>

            {isOpen && (
              <div className="w-full bg-[#D1D5DC] border-b-2 md:border-b-4 border-border-primary flex flex-col items-center">
                <div
                  ref={(node) => {
                    contentRefs.current[it.key] = node;
                  }}
                  className="w-full max-w-[1440px] px-4 sm:px-6 md:px-8 xl:px-12 py-6 md:py-10 xl:py-16 scroll-mt-[80px]"
                >
                  {it.key === "contact" && <ContactForm compact />}

                  {it.key === "service" && <ServiceCallForm />}

                  {it.key === "consumables" && (
                    <ConsumablesOrderFormClientZone />
                  )}

                  {it.key === "counters" && (
                    <CountersFormClientZone />
                  )}

                  {it.key === "debt" && (
                    <DebtCollectionFormClientZone />
                  )}

                  {it.key === "complaint" && (
                    <>
                      <DealerComplaintForm groups={complaintFields} />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
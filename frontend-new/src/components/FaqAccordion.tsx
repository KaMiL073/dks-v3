"use client";

import { useId, useState } from "react";
import faqSections, { type FaqSection } from "@/content/faq";

type Props = {
  sections?: FaqSection[];
  className?: string;
  /** opcjonalnie: czy otwierać pierwszy element w każdej sekcji */
  defaultOpenFirst?: boolean;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "w-12 h-16 flex items-center justify-center",
        "transition-transform duration-200",
        open ? "rotate-90" : "-rotate-90",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* prosta strzałka jak w Figmie (obrót robi robotę) */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18l6-6-6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentId = useId();

  return (
    <div className="self-stretch">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className={[
          "w-full pb-8 border-b border-border-primary",
          "inline-flex justify-between items-center gap-6 text-left",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-Text-action-hover/60",
        ].join(" ")}
      >
        <div className="flex-1 flex justify-between items-center gap-6">
          <div className="flex-1 justify-start text-Text-headings text-xl font-semibold font-['Montserrat'] leading-6">
            {question}
          </div>
          <Chevron open={isOpen} />
        </div>
      </button>

      {/* treść odpowiedzi (animacja bez JS do wysokości) */}
      <div
        id={contentId}
        className={[
          "grid transition-all duration-200 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        ].join(" ")}
      >
        <div className="overflow-hidden">
          {!!answer?.trim() && (
            <div className="pt-6 pb-10 text-Text-headings/80 text-base font-['Montserrat'] leading-6">
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FaqAccordion({
  sections = faqSections,
  className = "",
  defaultOpenFirst = false,
}: Props) {
  // stan: sekcjaIndex -> itemIndex (albo null gdy nic nieotwarte)
  const [openMap, setOpenMap] = useState<Record<number, number | null>>(() => {
    if (!defaultOpenFirst) return {};
    const init: Record<number, number | null> = {};
    sections.forEach((_, si) => (init[si] = 0));
    return init;
  });

  if (!sections?.length) return null;

  return (
    <section
      className={[
        // Figmowe: px-28 py-20, gap-32 — ale responsywnie
        "self-stretch px-6 md:px-28 py-12 md:py-20",
        "inline-flex flex-col justify-start items-start gap-16 md:gap-32",
        className,
      ].join(" ")}
    >
      {sections.map((section, si) => {
        const openIndex = openMap[si] ?? null;

        return (
          <div
            key={`${section.title}-${si}`}
            className="self-stretch flex flex-col justify-start items-start"
          >
            <div className="pb-10 md:pb-16 inline-flex justify-center items-center gap-2.5">
              <h2 className="w-full max-w-[720px] justify-start text-Text-headings text-3xl md:text-4xl font-semibold font-['Montserrat'] leading-[40px] md:leading-[48px]">
                {section.title}
              </h2>
            </div>

            <div className="self-stretch flex flex-col justify-start items-start gap-10">
              {section.items.map((item, ii) => {
                const isOpen = openIndex === ii;

                return (
                  <AccordionItem
                    key={`${item.question}-${ii}`}
                    question={item.question}
                    answer={item.answer}
                    isOpen={isOpen}
                    onToggle={() =>
                      setOpenMap((prev) => ({
                        ...prev,
                        [si]: isOpen ? null : ii,
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
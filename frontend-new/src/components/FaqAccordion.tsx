"use client";

import { useId, useState } from "react";
import faqSections, { type FaqSection } from "@/content/faq";

type Props = {
  sections?: FaqSection[];
  className?: string;
  defaultOpenFirst?: boolean;
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "w-12 h-16 flex items-center justify-center",
        "transition-transform duration-200",
        open ? "-rotate-90" : "rotate-90", // ✅ FIX
      ].join(" ")}
      aria-hidden="true"
    >
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
        ].join(" ")}
      >
        <div className="flex-1 flex justify-between items-center gap-6">
          <div className="flex-1 text-Text-headings text-xl font-semibold font-['Montserrat'] leading-6">
            {question}
          </div>
          <Chevron open={isOpen} />
        </div>
      </button>

      {/* CONTENT */}
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
        "self-stretch px-6 md:px-28 py-12 md:py-20",
        "flex flex-col gap-16 md:gap-32",
        className,
      ].join(" ")}
    >
      {sections.map((section, si) => {
        const openIndex = openMap[si] ?? null;

        return (
          <div key={si} className="self-stretch flex flex-col">
            <div className="pb-10 md:pb-16">
              <h2 className="text-Text-headings text-3xl md:text-4xl font-semibold font-['Montserrat'] leading-[48px]">
                {section.title}
              </h2>
            </div>

            <div className="flex flex-col gap-10">
              {section.items.map((item, ii) => {
                const isOpen = openIndex === ii;

                return (
                  <AccordionItem
                    key={ii}
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
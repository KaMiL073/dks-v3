"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type RecruitmentStep = {
  title?: string;
  description: string;
};

type RecruitmentStepsProps = {
  heading?: string;
  steps: RecruitmentStep[];
  defaultActive?: number;
  className?: string;
  arrowSrc?: string;
};

export default function RecruitmentSteps({
  heading = "Etapy rekrutacji",
  steps,
  defaultActive = 0,
  className = "",
  arrowSrc = "/static/icons/arrow-right.svg",
}: RecruitmentStepsProps) {
  const safeDefault = useMemo(() => {
    if (!Number.isFinite(defaultActive)) return 0;
    return Math.min(Math.max(defaultActive, 0), Math.max(steps.length - 1, 0));
  }, [defaultActive, steps.length]);

  const [active, setActive] = useState<number>(safeDefault);

  if (!steps?.length) return null;

  // Na mobile pokazujemy max 4 kroki w układzie 2x2 (jak na screenie)
  const visibleSteps = steps.slice(0, 4);

  return (
    <section
      className={[
        "self-stretch px-6 sm:px-10 inline-flex flex-col justify-start items-start gap-10 lg:gap-16",
        className,
      ].join(" ")}
    >
      <div className="self-stretch flex flex-col justify-center items-start gap-6 lg:gap-12">
        <div className="self-stretch justify-start text-Text-headings text-2xl sm:text-3xl lg:text-4xl font-semibold font-['Montserrat'] leading-[32px] sm:leading-[40px] lg:leading-[56px]">
          {heading}
        </div>
      </div>

      {/* MOBILE: 2x2, DESKTOP: 1x4 */}
      <div className="self-stretch">
        {/* Mobile grid */}
        <div className="grid grid-cols-2 gap-y-6 sm:gap-y-8 lg:hidden">
          {visibleSteps.map((_, idx) => {
            const isActive = idx === active;

            // Na mobile strzałka tylko po 1 i po 3 (czyli po indeksach 0 i 2)
            const showArrow = idx === 0 || idx === 2;

            return (
              <div key={idx} className="flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-pressed={isActive}
                  aria-controls={`recruitment-step-panel-${idx}`}
                  className={[
                    "w-16 h-16 sm:w-20 sm:h-20 rounded-full inline-flex justify-center items-center",
                    isActive ? "bg-red-600" : "bg-gray-500",
                    "transition-colors",
                  ].join(" ")}
                >
                  <span className="text-white text-2xl sm:text-3xl font-semibold font-['Montserrat'] leading-none">
                    {idx + 1}
                  </span>
                </button>

                {showArrow ? (
                  <div className="ml-3 sm:ml-4 flex items-center justify-center">
                    <Image
                      src={arrowSrc}
                      alt=""
                      width={28}
                      height={10}
                      className="object-contain"
                      aria-hidden
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Desktop row */}
        <div className="hidden lg:flex items-center">
          {visibleSteps.map((_, idx) => {
            const isActive = idx === active;

            return (
              <div key={idx} className="flex items-center w-full">
                <div className="flex-1 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setActive(idx)}
                    aria-pressed={isActive}
                    aria-controls={`recruitment-step-panel-${idx}`}
                    className={[
                      "w-24 h-24 rounded-[49px] inline-flex justify-center items-center",
                      isActive ? "bg-red-600" : "bg-gray-500",
                      "transition-colors",
                    ].join(" ")}
                  >
                    <span className="text-white text-4xl font-semibold font-['Montserrat'] leading-[56px]">
                      {idx + 1}
                    </span>
                  </button>
                </div>

                {idx < visibleSteps.length - 1 ? (
                  <div className="flex items-center justify-center">
                    <Image
                      src={arrowSrc}
                      alt=""
                      width={48}
                      height={16}
                      className="object-contain"
                      aria-hidden
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Panel z opisem */}
      <div
        id={`recruitment-step-panel-${active}`}
        className="self-stretch inline-flex flex-col justify-start items-start gap-6"
      >
        <div className="self-stretch justify-center text-Text-headings text-base sm:text-lg lg:text-xl font-normal font-['Montserrat'] leading-6">
          {steps[active]?.description}
        </div>
      </div>
    </section>
  );
}
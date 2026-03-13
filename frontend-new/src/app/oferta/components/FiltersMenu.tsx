"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export type FilterOption = {
  field: string;
  label: string;
  options: { text: string; value: string }[];
};

interface FiltersMenuProps {
  availableFilters: FilterOption[];
  selected?: Record<string, string[]>;
  onSelectedChange?: (next: Record<string, string[]>) => void;
  onApplyFilters?: (filters: Record<string, string[]>) => void;
  onClearFilters?: () => void;
  applyOnChange?: boolean;
  modalTitle?: string;
}

export default function FiltersMenu({
  availableFilters,
  selected,
  onSelectedChange,
  onApplyFilters,
  onClearFilters,
  applyOnChange = false,
  modalTitle = "Filtry",
}: FiltersMenuProps) {
  const [local, setLocal] = useState<Record<string, string[]>>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const effective = selected ?? local;
  const isSingleFilter = availableFilters.length === 1;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selected) {
      setLocal(selected);
    }
  }, [selected]);

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const updateState = (next: Record<string, string[]>) => {
    onSelectedChange?.(next);

    if (!selected) {
      setLocal(next);
    }
  };

  const toggle = (field: string, value: string) => {
    const prev = effective[field] || [];
    const nextValues = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];

    const next = { ...effective, [field]: nextValues };

    updateState(next);

    if (applyOnChange) {
      onApplyFilters?.(next);
    }
  };

  const clear = () => {
    updateState({});
    onClearFilters?.();
    onApplyFilters?.({});
  };

  const apply = () => {
    onApplyFilters?.(effective);
    setMobileOpen(false);
  };

  const dedupedFilters = useMemo(() => {
    return availableFilters.map((filter) => {
      const uniq = Array.from(
        new Map(
          (filter.options ?? []).map((o) => [`${o.value}||${o.text}`, o] as const)
        ).values()
      );

      return { ...filter, options: uniq };
    });
  }, [availableFilters]);

  const renderOption = (
    filter: FilterOption,
    opt: { text: string; value: string },
    inline = false
  ) => {
    const checked = (effective[filter.field] || []).includes(opt.value);
    const inputId = `${filter.field}__${opt.value}__${opt.text}`;

    return (
      <label
        key={`${filter.field}:${opt.value}:${opt.text}`}
        htmlFor={inputId}
        className={[
          "cursor-pointer bg-surface-primary select-none",
          "flex justify-start gap-3",
          inline ? "items-center py-1 pr-4" : "items-start py-1",
        ].join(" ")}
      >
        <input
          id={inputId}
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={() => toggle(filter.field, opt.value)}
        />

        <div
          className={`${
            inline ? "" : "mt-1"
          } w-5 h-5 shrink-0 flex items-center justify-center rounded border-2 transition-all ${
            checked
              ? "border-surface-action bg-surface-action"
              : "border-border-primary bg-surface-primary"
          }`}
          aria-hidden="true"
        >
          {checked && (
            <span className="text-Text-on-action text-[14px] leading-none">
              ✓
            </span>
          )}
        </div>

        <span className="min-w-0 break-words text-Text-body text-base font-normal font-['Montserrat'] leading-5">
          {opt.text}
        </span>
      </label>
    );
  };

  const renderDesktopFiltersContent = () => {
    return (
      <div
        className={[
          "self-stretch",
          isSingleFilter
            ? "flex flex-col gap-4"
            : "inline-flex items-start flex-wrap content-start gap-8",
        ].join(" ")}
      >
        {dedupedFilters.map((filter) => (
          <div
            key={filter.field}
            className={
              isSingleFilter
                ? "w-full inline-flex flex-col justify-start items-start"
                : "w-40 inline-flex flex-col justify-start items-start"
            }
          >
            <div className="pt-6 pb-3 bg-surface-primary flex flex-col justify-start items-start gap-2.5 overflow-hidden">
              <div className="justify-center text-Text-body text-xl font-semibold font-['Montserrat'] leading-normal">
                {filter.label}
              </div>
            </div>

            {isSingleFilter ? (
              <div className="w-full flex flex-wrap items-start gap-x-6 gap-y-2">
                {filter.options.map((opt) => renderOption(filter, opt, true))}
              </div>
            ) : (
              <div className="flex flex-col items-start">
                {filter.options.map((opt) => renderOption(filter, opt, false))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const mobileModal =
    mounted && mobileOpen
      ? createPortal(
          <div className="fixed inset-0 z-[9999] md:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
            />

            <div className="relative z-[10000] h-screen w-screen overflow-y-auto bg-[#F9FAFB]">
              <div className="sticky top-0 z-20 flex justify-end bg-surface-page p-6 pb-0">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Zamknij filtry"
                  className="inline-flex h-[38px] w-[38px] items-center justify-center text-icon-primary transition hover:opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="38"
                    height="38"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-8 px-9 pb-9 pt-4">
                <div className="flex flex-col gap-2">
                  <div className="text-Text-headings text-[28px] font-semibold font-['Montserrat'] leading-9">
                    {modalTitle}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  {dedupedFilters.map((filter) => (
                    <div
                      key={filter.field}
                      className="self-stretch flex flex-col items-start justify-start"
                    >
                      <div className="pt-4 pb-2">
                        <div className="text-Text-body text-xl font-semibold font-['Montserrat'] leading-6">
                          {filter.label}
                        </div>
                      </div>

                      <div className="self-stretch flex flex-col items-start">
                        {filter.options.map((opt) =>
                          renderOption(filter, opt, false)
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={clear}
                    className="flex items-center justify-center gap-2.5 rounded-lg p-2"
                  >
                    <div className="p-2 text-base font-semibold font-['Montserrat'] leading-5">
                      Wyczyść filtry
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={apply}
                    className="flex items-center justify-center bg-[#E7000B] gap-2.5 rounded-lg p-2 transition hover:opacity-90"
                  >
                    <div className="text-base text-white font-semibold font-['Montserrat'] leading-5">
                      Filtruj
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="w-full flex justify-start md:hidden">
        {!mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#99A1AF] px-2 py-2 transition hover:bg-gray-50"
          >
            <span className="text-Text-body text-[20px] font-normal font-['Montserrat'] leading-6">
              Filtry
            </span>
          </button>
        )}
      </div>

      <div className="hidden w-full self-stretch border-b-2 border-border-primary bg-surface-primary p-4 md:flex md:flex-col md:justify-start md:items-end md:gap-2.5">
        {renderDesktopFiltersContent()}

        <div className="mt-4 inline-flex items-start justify-start gap-2.5">
          <button
            type="button"
            onClick={clear}
            className="flex items-center justify-center gap-2.5 rounded-lg p-3 transition hover:bg-gray-50"
          >
            <div className="justify-center text-Text-secondary text-base font-semibold font-['Montserrat'] leading-tight">
              Wyczyść filtry
            </div>
          </button>

          <button
            type="button"
            onClick={apply}
            className="flex nline-flex items-center justify-center bg-[#E7000B] gap-2.5 rounded-lg p-3 transition hover:opacity-90"
          >
            <div className="justify-center text-base text-white font-semibold font-['Montserrat'] leading-tight">
              Filtruj
            </div>
          </button>
        </div>
      </div>

      {mobileModal}
    </>
  );
}
// "use client";

// import { useEffect, useMemo, useState } from "react";

// export type FilterOption = {
//   field: string;
//   label: string;
//   options: { text: string; value: string }[];
// };

// interface FiltersMenuProps {
//   availableFilters: FilterOption[];
//   selected?: Record<string, string[]>;
//   onSelectedChange?: (next: Record<string, string[]>) => void;
//   onApplyFilters?: (filters: Record<string, string[]>) => void;
//   onClearFilters?: () => void;
//   applyOnChange?: boolean;
// }

// export default function FiltersMenu({
//   availableFilters,
//   selected,
//   onSelectedChange,
//   onApplyFilters,
//   onClearFilters,
//   applyOnChange = false,
// }: FiltersMenuProps) {
//   const [local, setLocal] = useState<Record<string, string[]>>({});
//   const effective = selected ?? local;

//   useEffect(() => {
//     if (selected) setLocal(selected);
//   }, [selected]);

//   const toggle = (field: string, value: string) => {
//     const prev = effective[field] || [];
//     const nextValues = prev.includes(value)
//       ? prev.filter((v) => v !== value)
//       : [...prev, value];
//     const next = { ...effective, [field]: nextValues };

//     onSelectedChange?.(next);
//     if (!selected) setLocal(next);
//     if (applyOnChange) onApplyFilters?.(next);
//   };

//   const clear = () => {
//     onSelectedChange?.({});
//     if (!selected) setLocal({});
//     onClearFilters?.();
//     onApplyFilters?.({});
//   };

//   const apply = () => onApplyFilters?.(effective);

//   // ✅ Deduplikacja opcji, żeby nie renderować tych samych wartości dwa razy
//   const dedupedFilters = useMemo(() => {
//     return availableFilters.map((filter) => {
//       const uniq = Array.from(
//         new Map(
//           (filter.options ?? []).map((o) => [`${o.value}||${o.text}`, o] as const)
//         ).values()
//       );
//       return { ...filter, options: uniq };
//     });
//   }, [availableFilters]);

//   return (
//     <div className="w-full self-stretch bg-surface-primary border-b-2 border-border-primary inline-flex flex-col justify-start items-end gap-2.5 p-4">
//       {/* 🔹 Sekcja filtrów */}
//       <div className="self-stretch inline-flex items-start flex-wrap content-start gap-8">
//         {dedupedFilters.map((filter) => (
//           <div
//             key={filter.field}
//             className="w-40 inline-flex flex-col justify-start items-start"
//           >
//             <div className="pt-6 pb-3 bg-surface-primary flex flex-col justify-start items-start gap-2.5 overflow-hidden">
//               <div className="justify-center text-Text-body text-xl font-semibold font-['Montserrat'] leading-normal">
//                 {filter.label}
//               </div>
//             </div>

//             {filter.options.map((opt) => {
//               const checked = (effective[filter.field] || []).includes(opt.value);
//               const inputId = `${filter.field}__${opt.value}__${opt.text}`;

//               return (
//                 <label
//                   key={`${filter.field}:${opt.value}:${opt.text}`}
//                   htmlFor={inputId}
//                   // ✅ było: items-center -> teraz: items-start
//                   className="cursor-pointer py-1 bg-surface-primary flex flex-row justify-start items-start gap-3 select-none"
//                 >
//                   {/* ✅ prawdziwy checkbox (ukryty), dla dostępności */}
//                   <input
//                     id={inputId}
//                     type="checkbox"
//                     className="sr-only"
//                     checked={checked}
//                     onChange={() => toggle(filter.field, opt.value)}
//                   />

//                   {/* ✅ własny checkbox UI */}
//                   <div
//                     // ✅ dodany mt-1 + shrink-0 żeby nie pływał i się nie ściskał
//                     className={`mt-1 w-5 h-5 shrink-0 flex items-center justify-center rounded border-2 transition-all ${
//                       checked
//                         ? "border-surface-action bg-surface-action"
//                         : "border-border-primary bg-surface-primary"
//                     }`}
//                     aria-hidden="true"
//                   >
//                     {checked && (
//                       <span className="text-Text-on-action text-[14px] leading-none">
//                         ✓
//                       </span>
//                     )}
//                   </div>

//                   {/* ✅ tekst: poprawione łamanie i line-height */}
//                   <span className="min-w-0 break-words text-Text-body text-base font-normal font-['Montserrat'] leading-5">
//                     {opt.text}
//                   </span>
//                 </label>
//               );
//             })}
//           </div>
//         ))}
//       </div>

//       {/* 🔹 Przyciski */}
//       <div className="inline-flex justify-start items-start gap-2.5 mt-4">
//         <button
//           type="button"
//           onClick={clear}
//           className="p-3 bg-surface-primary border border-border-primary rounded-lg flex justify-center items-center gap-2.5 hover:bg-gray-50 transition"
//         >
//           <div className="justify-center text-Text-secondary text-base font-semibold font-['Montserrat'] leading-tight">
//             Wyczyść filtry
//           </div>
//         </button>

//         <button
//           type="button"
//           onClick={apply}
//           className="p-3 bg-surface-action rounded-lg flex justify-center items-center gap-2.5 hover:opacity-90 transition"
//         >
//           <div className="justify-center text-Text-on-action text-base font-semibold font-['Montserrat'] leading-tight">
//             Filtruj
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useMemo, useState } from "react";

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
}

export default function FiltersMenu({
  availableFilters,
  selected,
  onSelectedChange,
  onApplyFilters,
  onClearFilters,
  applyOnChange = false,
}: FiltersMenuProps) {
  const [local, setLocal] = useState<Record<string, string[]>>({});
  const effective = selected ?? local;

  useEffect(() => {
    if (selected) setLocal(selected);
  }, [selected]);

  const toggle = (field: string, value: string) => {
    const prev = effective[field] || [];
    const nextValues = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];
    const next = { ...effective, [field]: nextValues };

    onSelectedChange?.(next);
    if (!selected) setLocal(next);
    if (applyOnChange) onApplyFilters?.(next);
  };

  const clear = () => {
    onSelectedChange?.({});
    if (!selected) setLocal({});
    onClearFilters?.();
    onApplyFilters?.({});
  };

  const apply = () => onApplyFilters?.(effective);

  // ✅ Deduplikacja opcji, żeby nie renderować tych samych wartości dwa razy
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

  return (
    <div className="w-full self-stretch bg-surface-primary border-b-2 border-border-primary inline-flex flex-col justify-start items-end gap-2.5 p-4">
      {/* 🔹 Sekcja filtrów */}
      <div className="self-stretch inline-flex items-start flex-wrap content-start gap-8">
        {dedupedFilters.map((filter) => (
          <div
            key={filter.field}
            className="w-40 inline-flex flex-col justify-start items-start"
          >
            <div className="pt-6 pb-3 bg-surface-primary flex flex-col justify-start items-start gap-2.5 overflow-hidden">
              <div className="justify-center text-Text-body text-xl font-semibold font-['Montserrat'] leading-normal">
                {filter.label}
              </div>
            </div>

            {filter.options.map((opt) => {
              const checked = (effective[filter.field] || []).includes(opt.value);
              const inputId = `${filter.field}__${opt.value}__${opt.text}`;

              return (
                <label
                  key={`${filter.field}:${opt.value}:${opt.text}`}
                  htmlFor={inputId}
                  // ✅ było: items-center -> teraz: items-start
                  className="cursor-pointer py-1 bg-surface-primary flex flex-row justify-start items-start gap-3 select-none"
                >
                  {/* ✅ prawdziwy checkbox (ukryty), dla dostępności */}
                  <input
                    id={inputId}
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggle(filter.field, opt.value)}
                  />

                  {/* ✅ własny checkbox UI */}
                  <div
                    // ✅ dodany mt-1 + shrink-0 żeby nie pływał i się nie ściskał
                    className={`mt-1 w-5 h-5 shrink-0 flex items-center justify-center rounded border-2 transition-all ${
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

                  {/* ✅ tekst: poprawione łamanie i line-height */}
                  <span className="min-w-0 break-words text-Text-body text-base font-normal font-['Montserrat'] leading-5">
                    {opt.text}
                  </span>
                </label>
              );
            })}
          </div>
        ))}
      </div>

      {/* 🔹 Przyciski */}
      <div className="inline-flex justify-start items-start gap-2.5 mt-4">
        <button
          type="button"
          onClick={clear}
          className="p-3 bg-surface-primary border border-border-primary rounded-lg flex justify-center items-center gap-2.5 hover:bg-gray-50 transition"
        >
          <div className="justify-center text-Text-secondary text-base font-semibold font-['Montserrat'] leading-tight">
            Wyczyść filtry
          </div>
        </button>

        <button
          type="button"
          onClick={apply}
          className="p-3 bg-surface-action rounded-lg flex justify-center items-center gap-2.5 hover:opacity-90 transition"
        >
          <div className="justify-center text-Text-on-action text-base font-semibold font-['Montserrat'] leading-tight">
            Filtruj
          </div>
        </button>
      </div>
    </div>
  );
}
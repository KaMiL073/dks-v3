"use client";

import { useEffect, useState } from "react";

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

    if (onSelectedChange) onSelectedChange(next);
    if (!selected) setLocal(next);
    if (applyOnChange && onApplyFilters) onApplyFilters(next);
  };

  const clear = () => {
    if (onSelectedChange) onSelectedChange({});
    if (!selected) setLocal({});
    onClearFilters?.();
    if (onApplyFilters) onApplyFilters({});
  };

  const apply = () => onApplyFilters?.(effective);

  return (
    <div className="w-full self-stretch bg-surface-primary border-b-2 border-border-primary inline-flex flex-col justify-start items-end gap-2.5 p-4">
      {/* 🔹 Sekcja filtrów */}
      <div className="self-stretch inline-flex justify-between items-start flex-wrap content-start gap-4">
        {availableFilters.map((filter) => (
          <div key={filter.field} className="w-40 inline-flex flex-col justify-start items-start">
            <div className="pt-6 pb-3 bg-surface-primary flex flex-col justify-start items-start gap-2.5 overflow-hidden">
              <div className="justify-center text-Text-body text-xl font-semibold font-['Montserrat'] leading-normal">
                {filter.label}
              </div>
            </div>

            {filter.options.map((opt) => {
              const checked = (effective[filter.field] || []).includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className="cursor-pointer py-1 bg-surface-primary flex flex-row justify-start items-center gap-3 select-none"
                  onClick={() => toggle(filter.field, opt.value)}
                >
                  {/* ✅ własny checkbox */}
                  <div
                    className={`w-5 h-5 flex items-center justify-center rounded border-2 transition-all ${
                      checked
                        ? "border-surface-action bg-surface-action"
                        : "border-border-primary bg-surface-primary"
                    }`}
                  >
                    {checked && (
                      <span className="text-Text-on-action text-[14px] leading-none">✓</span>
                    )}
                  </div>
                  <span className="text-Text-body text-base font-normal font-['Montserrat'] leading-tight">
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
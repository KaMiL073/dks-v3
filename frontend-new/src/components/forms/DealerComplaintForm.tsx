// frontend-new/src/components/forms/DealerComplaintForm.tsx

"use client";

import React, { useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import Button from "@/components/ui/Button";

import type {
  MappedDirectusField,
  MappedDirectusFieldGroup,
} from "@/lib/fields";

type Props = {
  groups?: MappedDirectusFieldGroup[];
};

const FORM_NAME = "ComplaintForm";

function StatusIcon({ valid }: { valid: boolean }) {
  return (
    <span
      className={[
        "w-6 shrink-0 text-3xl font-semibold leading-none",
        valid ? "text-Text-headings" : "text-dks-red",
      ].join(" ")}
      aria-hidden="true"
    >
      {valid ? "✓" : "×"}
    </span>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={[
        "w-8 h-8 flex items-center justify-center shrink-0 text-Text-headings transition-transform duration-200",
        open ? "-rotate-90" : "rotate-90",
      ].join(" ")}
      aria-hidden="true"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
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

export default function DealerComplaintForm({ groups = [] }: Props) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [openSection, setOpenSection] = useState<string | null>(
    groups?.[0]?.key ?? null
  );

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const visibleGroups = useMemo(() => {
    return groups.filter(
      (group) => group && Array.isArray(group.fields) && group.fields.length > 0
    );
  }, [groups]);

  const sectionValidity = useMemo(() => {
    const result: Record<string, boolean> = {};

    visibleGroups.forEach((group) => {
      result[group.key] = group.fields.every((field) =>
        String(formData[field.name] ?? field.value ?? "").trim()
      );
    });

    return result;
  }, [visibleGroups, formData]);

  const isFormValid = visibleGroups.every(
    (group) => sectionValidity[group.key]
  );

  const inputClass =
    "w-full h-12 bg-[#F9FAFB] rounded-lg border border-border-primary px-4 text-base font-normal font-['Montserrat'] text-Text-body outline-none focus:border-Text-headings";

  const textareaClass =
    "w-full h-44 bg-[#F9FAFB] rounded-lg border border-border-primary px-4 py-3 text-base font-normal font-['Montserrat'] text-Text-body outline-none resize-none focus:border-Text-headings";

  const labelClass =
    "w-full text-Text-body text-sm md:text-base font-normal font-['Montserrat'] leading-5";

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderField = (field: MappedDirectusField) => {
    const fieldName = field?.name ?? "";
    const fieldType = field?.type ?? "";
    const fieldInterface = field?.interface ?? "";
    const normalizedFieldName = fieldName.toLowerCase();

    const value = formData[fieldName] ?? field.value ?? "";

    const isTextarea =
      fieldInterface.includes("textarea") ||
      fieldInterface.includes("multiline") ||
      normalizedFieldName.includes("description") ||
      normalizedFieldName.includes("message");

    const isSelect =
      fieldInterface.includes("select") && field.options.length > 0;

    const inputType =
      fieldType === "integer" || fieldType === "float"
        ? "number"
        : normalizedFieldName.includes("email")
          ? "email"
          : normalizedFieldName.includes("phone")
            ? "tel"
            : normalizedFieldName.includes("date")
              ? "date"
              : "text";

    return (
      <label key={fieldName} className="w-full flex flex-col gap-2">
        <span className={labelClass}>
          {field.displayName}
          {field.required && <span className="text-dks-red ml-1">*</span>}
        </span>

        {isTextarea ? (
          <textarea
            name={fieldName}
            value={value}
            required={field.required}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={textareaClass}
          />
        ) : isSelect ? (
          <select
            name={fieldName}
            value={value}
            required={field.required}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={inputClass}
          >
            <option value="">Wybierz</option>

            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.text}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            name={fieldName}
            value={value}
            required={field.required}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={inputClass}
          />
        )}
      </label>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    try {
      setIsSending(true);

      let recaptcha = "";

      if (executeRecaptcha) {
        recaptcha = await executeRecaptcha(FORM_NAME);
      }

      const payload = {
        ...formData,
        recaptcha,
      };

      const response = await fetch("/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Submit failed");
      }

      alert("Dziękujemy! Formularz został wysłany.");
      setFormData({});
    } catch (error) {
      console.error("Complaint submit error:", error);
      alert("Wystąpił błąd podczas wysyłania formularza.");
    } finally {
      setIsSending(false);
    }
  };

  if (!visibleGroups.length) {
    return (
      <div className="w-full p-4 border border-red-500 rounded text-red-600">
        Brak pól formularza z Directusa.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {visibleGroups.map((group) => {
        const isOpen = openSection === group.key;
        const isValid = sectionValidity[group.key];

        return (
          <section
            key={group.key}
            className="w-full border-b-2 border-border-primary"
          >
            <button
              type="button"
              onClick={() =>
                setOpenSection((prev) =>
                  prev === group.key ? null : group.key
                )
              }
              className="w-full py-4 flex items-center justify-between gap-4 text-left"
            >
              <div className="min-w-0 flex items-center gap-3">
                <StatusIcon valid={isValid} />

                <h3 className="text-Text-headings text-lg md:text-2xl font-semibold font-['Montserrat'] leading-6 md:leading-8">
                  {group.displayName}
                </h3>
              </div>

              <Chevron open={isOpen} />
            </button>

            {isOpen && (
              <div className="w-full px-0 md:px-10 pb-8 flex flex-col gap-4">
                {group.fields.map(renderField)}
              </div>
            )}
          </section>
        );
      })}

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          disabled={isSending || !isFormValid}
          className="w-full sm:w-auto p-4 bg-surface-action rounded-lg inline-flex justify-center items-center text-Text-on-action text-lg md:text-2xl font-semibold font-['Montserrat'] leading-7 disabled:opacity-60"
        >
          {isSending ? "Wysyłanie..." : "Wyślij"}
        </Button>
      </div>
    </form>
  );
}
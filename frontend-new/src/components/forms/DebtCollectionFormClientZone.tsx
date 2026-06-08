"use client";

import { useMemo, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

import Button from "@/components/ui/Button";

import type {
  MappedDirectusField,
  MappedDirectusFieldGroup,
} from "@/lib/fields";

type Props = {
  groups?: MappedDirectusFieldGroup[];
};

const FORM_NAME = "DebtCollectionForm";

function isInformationalField(field: MappedDirectusField) {
  const fieldInterface = field?.interface ?? "";

  return (
    fieldInterface.includes("presentation-notice") ||
    fieldInterface.includes("notice") ||
    fieldInterface.includes("information") ||
    fieldInterface.includes("info")
  );
}

export default function DebtCollectionFormClientZone({ groups = [] }: Props) {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);

  const visibleGroups = useMemo(() => {
    return groups.filter(
      (group) => group && Array.isArray(group.fields) && group.fields.length > 0
    );
  }, [groups]);

  const completeFormData = useMemo(() => {
    const data: Record<string, string> = {};

    visibleGroups.forEach((group) => {
      group.fields.forEach((field) => {
        if (isInformationalField(field)) return;

        data[field.name] = String(formData[field.name] ?? field.value ?? "");
      });
    });

    return data;
  }, [visibleGroups, formData]);

  const requiredFields = useMemo(() => {
    return visibleGroups.flatMap((group) =>
      group.fields.filter(
        (field) => field.required && !isInformationalField(field)
      )
    );
  }, [visibleGroups]);

  const isFormValid = requiredFields.every((field) =>
    String(completeFormData[field.name] ?? "").trim()
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
    if (isInformationalField(field)) {
      return (
        <div
          key={field.name}
          className="w-full text-Text-body text-sm md:text-base font-normal font-['Montserrat'] leading-6"
          dangerouslySetInnerHTML={{ __html: String(field.value ?? "") }}
        />
      );
    }

    const fieldName = field?.name ?? "";
    const fieldType = field?.type ?? "";
    const fieldInterface = field?.interface ?? "";
    const normalizedFieldName = fieldName.toLowerCase();
    const value = completeFormData[fieldName] ?? "";

    const isTextarea =
      fieldInterface.includes("textarea") ||
      fieldInterface.includes("multiline") ||
      normalizedFieldName.includes("description") ||
      normalizedFieldName.includes("message");

    const isSelect =
      fieldInterface.includes("select") || field.options.length > 0;

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
            onChange={(event) => handleChange(fieldName, event.target.value)}
            className={textareaClass}
          />
        ) : isSelect ? (
          <select
            name={fieldName}
            value={value}
            required={field.required}
            onChange={(event) => handleChange(fieldName, event.target.value)}
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
            onChange={(event) => handleChange(fieldName, event.target.value)}
            className={inputClass}
          />
        )}
      </label>
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) {
      alert("Uzupełnij wszystkie wymagane pola.");
      return;
    }

    try {
      setIsSending(true);

      let recaptchaToken = "";

      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha(FORM_NAME);
      }

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: FORM_NAME,
          email: completeFormData.email ?? "",
          form_data: completeFormData,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Submit failed");
      }

      alert("Dziękujemy! Formularz został wysłany.");
      setFormData({});
    } catch (error) {
      console.error("Debt collection submit error:", error);
      alert("Wystąpił błąd podczas wysyłania formularza.");
    } finally {
      setIsSending(false);
    }
  };

  if (visibleGroups.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
      {visibleGroups.map((group) => (
        <section key={group.key} className="w-full flex flex-col gap-4">
          <div className="w-full flex flex-col gap-4">
            {group.fields.map(renderField)}
          </div>
        </section>
      ))}

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

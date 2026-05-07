"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@/components/ui/Button";

type FieldOption = {
  text: string;
  value: string;
};

type FormField = {
  name: string;
  displayName: string;
  interface: string;
  type?: string;
  required?: boolean;
  hidden?: boolean;
  value?: string;
  options?: FieldOption[];
};

type EventFormValues = Record<string, string | string[] | boolean | undefined>;

type Props = {
  fields: FormField[];
  eventSlug: string;
  compact?: boolean;
  className?: string;
};

export default function EventRegistrationForm({
  fields,
  eventSlug,
  compact = false,
  className = "",
}: Props) {
  const { register, handleSubmit, reset } = useForm<EventFormValues>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full h-11 rounded-lg border border-gray-500 px-3 bg-white outline-none focus:border-gray-700";

  const textareaClass =
    "w-full min-h-[140px] rounded-lg border border-gray-500 px-3 py-2 bg-white outline-none focus:border-gray-700";

  const labelClass = "flex flex-col gap-1 text-base text-Text-headings";

  async function onSubmit(data: EventFormValues) {
    setLoading(true);

    try {
      const resp = await fetch("/api/forms/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          formName: "event",
          event: eventSlug,
        }),
      });

      const responseData: unknown = await resp.json();

      if (!resp.ok) {
        throw responseData;
      }

      alert("✅ Dziękujemy! Formularz został wysłany.");
      setSent(true);
      reset();
    } catch (error) {
      console.error("Błąd wysyłania formularza:", error);
      alert("❌ Ups! Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  function renderRequired(field: FormField) {
    return field.required ? <span className="text-red-600"> *</span> : null;
  }

  function getInputType(field: FormField) {
    const name = field.name.toLowerCase();

    if (name.includes("email")) return "email";
    if (name.includes("phone") || name.includes("telefon")) return "tel";
    if (field.type === "integer" || field.type === "float") return "number";
    if (field.type === "date") return "date";
    if (field.type === "datetime" || field.type === "timestamp") {
      return "datetime-local";
    }

    return "text";
  }

  function renderField(field: FormField) {
    const required = field.required ? true : undefined;

    if (field.hidden) {
      return (
        <input
          {...register(field.name)}
          type="hidden"
          defaultValue={field.name === "event" ? eventSlug : field.value}
        />
      );
    }

    switch (field.interface) {
      case "select-dropdown":
        return (
          <label className={labelClass}>
            <span>
              {field.displayName}
              {renderRequired(field)}
            </span>

            <select
              {...register(field.name)}
              required={required}
              defaultValue={field.value ?? ""}
              className={inputClass}
            >
              <option value="">Wybierz</option>

              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.text}
                </option>
              ))}
            </select>
          </label>
        );

      case "select-radio":
        return (
          <div>
            <p className="mb-2 text-base text-Text-headings">
              {field.displayName}
              {renderRequired(field)}
            </p>

            <div className="flex flex-col gap-3">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 text-sm leading-snug text-gray-800"
                >
                  <input
                    {...register(field.name)}
                    type="radio"
                    value={option.value}
                    required={required}
                    className="mt-1"
                  />

                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "select-multiple-checkbox":
        return (
          <div>
            <p className="mb-2 text-base text-Text-headings">
              {field.displayName}
              {renderRequired(field)}
            </p>

            <div className="flex flex-col gap-3">
              {field.options?.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 text-sm leading-snug text-gray-800"
                >
                  <input
                    {...register(field.name)}
                    type="checkbox"
                    value={option.value}
                    className="mt-1"
                  />

                  <span>{option.text}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case "input-multiline":
      case "textarea":
        return (
          <label className={labelClass}>
            <span>
              {field.displayName}
              {renderRequired(field)}
            </span>

            <textarea
              {...register(field.name)}
              required={required}
              defaultValue={field.value}
              className={textareaClass}
            />
          </label>
        );

      case "datetime":
      case "input":
      default:
        return (
          <label className={labelClass}>
            <span>
              {field.displayName}
              {renderRequired(field)}
            </span>

            <input
              {...register(field.name)}
              type={getInputType(field)}
              required={required}
              defaultValue={field.name === "event" ? eventSlug : field.value}
              autoComplete={
                field.name.toLowerCase().includes("email")
                  ? "email"
                  : undefined
              }
              className={inputClass}
            />
          </label>
        );
    }
  }

  return (
    <section
      id="rejestracja"
      className={[
        "w-full bg-gray-300 px-4 py-12 md:px-6 lg:px-28",
        compact ? "" : "",
        className,
      ].join(" ")}
      style={{ scrollMarginTop: "200px" }}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[280px_1fr]">
        <div>
          <h2 className="mb-6 text-2xl font-bold text-Text-headings">
            Zapisz się
          </h2>

          <p className="text-sm leading-relaxed text-Text-headings">
            Wypełnij formularz, aby zapisać się na nadchodzące wydarzenie. Po
            jego wysłaniu otrzymasz na maila informację zwrotną potwierdzającą
            zapis.
          </p>

          <p className="mt-6 text-sm leading-relaxed text-Text-headings">
            W razie pytań dotyczących wydarzenia, prosimy o kontakt z
            przedstawicielem handlowym z Twojego regionu.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-col gap-4">
            {fields.map((field) => (
              <div key={field.name}>{renderField(field)}</div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="text-xs leading-snug text-gray-800">
              <p>
                Formularz korzysta z zabezpieczenia reCAPTCHA.{" "}
                <a
                  className="text-red underline"
                  href="https://www.google.com/intl/pl/policies/privacy/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Prywatność
                </a>
                {" - "}
                <a
                  className="text-red underline"
                  href="https://www.google.com/intl/pl/policies/terms/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Warunki
                </a>
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={sent || loading}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sent ? "Wysłano" : loading ? "Wysyłanie..." : "Wyślij"}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
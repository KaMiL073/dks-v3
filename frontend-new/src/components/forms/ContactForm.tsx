"use client";

import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Button from "@/components/ui/Button";

type OrderType = "" | "W ramach umowy" | "Bez umowy";

type FormState = {
  name: string;
  nip: string;
  email: string;
  phone: string;
  province: string;
  model: string;
  serialNumber: string;
  type: OrderType;
  cyjan: string;
  cyjanQty: string;
  magenta: string;
  magentaQty: string;
  yellow: string;
  yellowQty: string;
  black: string;
  blackQty: string;
  message: string;
  consentData: boolean;
  consentMarketing: boolean;
};

const FORM_NAME = "ConsumablesOrderForm";

const PROVINCES = [
  { value: "pomorskie", label: "Pomorskie" },
  { value: "mazowieckie", label: "Mazowieckie" },
  { value: "slaskie", label: "Śląskie" },
  { value: "wielkopolskie", label: "Wielkopolskie" },
  { value: "lodzkie", label: "Łódzkie" },
  { value: "malopolskie", label: "Małopolskie" },
  { value: "zachodniopomorskie", label: "Zachodniopomorskie" },
  { value: "kujawsko-pomorskie", label: "Kujawsko-pomorskie" },
  { value: "warminsko-mazurskie", label: "Warmińsko-mazurskie" },
  { value: "podkarpackie", label: "Podkarpackie" },
  { value: "podlaskie", label: "Podlaskie" },
  { value: "dolnoslaskie", label: "Dolnośląskie" },
] as const;

const initialForm: FormState = {
  name: "",
  nip: "",
  email: "",
  phone: "",
  province: "pomorskie",
  model: "",
  serialNumber: "",
  type: "",
  cyjan: "",
  cyjanQty: "",
  magenta: "",
  magentaQty: "",
  yellow: "",
  yellowQty: "",
  black: "",
  blackQty: "",
  message: "",
  consentData: false,
  consentMarketing: false,
};

export default function ConsumablesOrderFormClientZone() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSending, setIsSending] = useState(false);

  const isContract = form.type === "W ramach umowy";
  const isNoContract = form.type === "Bez umowy";

  const inputClass =
    "w-full h-10 bg-surface-page rounded-lg border border-border-primary px-3 text-base outline-none focus:border-Text-headings";

  const textareaClass =
    "w-full h-44 bg-surface-page rounded-lg border border-border-primary px-3 py-2 text-base outline-none resize-none";

  const checkboxClass =
    "mt-0.5 w-6 h-6 shrink-0 appearance-none bg-surface-page border border-border-primary rounded-[3px] cursor-pointer checked:bg-surface-action checked:border-surface-action checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:text-center checked:after:leading-6 checked:after:text-sm";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;

    if (name === "nip") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateBeforeSubmit = (): string | null => {
    if (!form.type) return "Wybierz rodzaj zamówienia.";

    if (isContract) {
      const requiredFields: Array<keyof FormState> = [
        "cyjan",
        "cyjanQty",
        "magenta",
        "magentaQty",
        "yellow",
        "yellowQty",
        "black",
        "blackQty",
      ];

      for (const key of requiredFields) {
        if (!String(form[key]).trim()) {
          return "Uzupełnij wszystkie pola tonerów dla umowy.";
        }
      }
    }

    if (isNoContract) {
      const requiredFields: Array<keyof FormState> = [
        "cyjanQty",
        "magentaQty",
        "yellowQty",
        "blackQty",
      ];

      for (const key of requiredFields) {
        if (!String(form[key]).trim()) {
          return "Uzupełnij ilości tonerów.";
        }
      }
    }

    if (!form.consentData) {
      return "Zgoda na przetwarzanie danych jest wymagana.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateBeforeSubmit();
    if (validationError) {
      alert(`❌ ${validationError}`);
      return;
    }

    try {
      setIsSending(true);

      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA nie jest gotowa.");
      }

      const recaptchaToken = await executeRecaptcha("consumables_form");

      const payload = {
        form_name: FORM_NAME,
        email: form.email,
        form_data: form,
        recaptchaToken,
      };

      const resp = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) throw data;

      alert("✅ Wysłano!");
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      alert("❌ Błąd wysyłania.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="px-6 md:px-12 xl:px-28 py-20 flex flex-col lg:flex-row gap-20">
      {/* tekst */}
      <div className="max-w-md">
        <h2 className="text-4xl font-semibold mb-4">Skontaktuj się z nami</h2>
        <p className="text-lg">
          Wypełnij formularz, by zamówić materiały eksploatacyjne.
        </p>
      </div>

      {/* formularz */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Imię / firma" className={inputClass} required />
        <input name="nip" value={form.nip} onChange={handleChange} placeholder="NIP" className={inputClass} required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Telefon" className={inputClass} required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} required />

        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Wiadomość" className={textareaClass} />

        {/* CHECKBOXY */}
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consentData"
            checked={form.consentData}
            onChange={handleChange}
            className={checkboxClass}
          />
          <span>
            Wyrażam zgodę na przetwarzanie danych osobowych...
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consentMarketing"
            checked={form.consentMarketing}
            onChange={handleChange}
            className={checkboxClass}
          />
          <span>
            Wyrażam zgodę marketingową...
          </span>
        </label>

        <Button type="submit" disabled={isSending}>
          {isSending ? "Wysyłanie..." : "Wyślij"}
        </Button>
      </form>
    </section>
  );
}
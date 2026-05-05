	"use client";

import React, { useState } from "react";
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

const PROVINCES = [
  { value: "pomorskie", label: "Pomorskie" },
  { value: "mazowieckie", label: "Mazowieckie" },
  { value: "slaskie", label: "Śląskie" },
  { value: "wielkopolskie", label: "Wielkopolskie" },
];

export default function ConsumablesOrderFormClientZone() {
  const FORM_NAME = "ConsumablesOrderForm";

  const [form, setForm] = useState<FormState>({
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
  });

  const input =
    "text-Text-body text-xl font-normal font-['Montserrat'] leading-6";

  const textarea =
    "self-stretch flex-1 min-h-[220px] rounded-lg border border-border-primary bg-[#F9FAFB] px-3 py-2 font-['Montserrat'] text-base text-Text-body outline-none focus:border-Text-headings resize-none";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;

    const name = target.name as keyof FormState;

    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = (): string | null => {
    if (!form.type) return "Wybierz rodzaj zamówienia.";
    if (!form.consentData) return "Zgoda na przetwarzanie danych jest wymagana.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const payload = {
      form_name: FORM_NAME,
      email: form.email,
      form_data: form,
    };

    try {
      const res = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data: unknown = await res.json();
        throw data;
      }

      alert("✅ Zamówienie zostało wysłane!");

      setForm({
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
      });
    } catch (error: unknown) {
      console.error("Błąd wysyłania formularza:", error);
      alert("❌ Ups! Coś poszło nie tak.");
    }
  };

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* LEFT */}
          <div className="max-w-md">
            <h2 className="text-4xl font-semibold leading-[56px] text-Text-headings">
              Skontaktuj się z nami
            </h2>

            <p className="mt-4 text-xl leading-6 text-Text-headings">
              Wypełnij formularz, by zamówić materiały eksploatacyjne.
              Otrzymasz potwierdzenie na maila.
            </p>
          </div>

          {/* FORM */}
          <div className="flex-1 max-w-[700px] flex flex-col gap-12">

            {/* BASIC */}
            <div className="flex flex-col gap-3">
              <label>
                <span>Imię i Nazwisko / Nazwa firmy:</span>
                <input name="name" value={form.name} onChange={handleChange} className={input} required />
              </label>

              <label>
                <span>NIP:</span>
                <input name="nip" value={form.nip} onChange={handleChange} className={input} required />
              </label>

              <label>
                <span>Telefon:</span>
                <input name="phone" value={form.phone} onChange={handleChange} className={input} required />
              </label>

              <label>
                <span>Email:</span>
                <input name="email" value={form.email} onChange={handleChange} className={input} required />
              </label>

              <label>
                <span>Województwo:</span>
                <select name="province" value={form.province} onChange={handleChange} className={input}>
                  {PROVINCES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* DEVICE */}
            <div className="flex flex-col gap-3">
              <label>
                <span>Model:</span>
                <input name="model" value={form.model} onChange={handleChange} className={input} required />
              </label>

              <label>
                <span>Numer seryjny:</span>
                <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className={input} required />
              </label>

              <label>
                <span>Rodzaj zamówienia:</span>
                <select name="type" value={form.type} onChange={handleChange} className={input} required>
                  <option value="">wybierz</option>
                  <option>W ramach umowy</option>
                  <option>Bez umowy</option>
                </select>
              </label>
            </div>

            {/* MESSAGE */}
            <div>
              <label>
                <span>Treść wiadomości:</span>
                <textarea name="message" value={form.message} onChange={handleChange} className={textarea} />
              </label>
            </div>

            {/* CONSENTS */}
            <div className="flex flex-col gap-4 text-xs">
              <label className="flex gap-3">
                <input type="checkbox" name="consentData" checked={form.consentData} onChange={handleChange} />
                <span>Zgoda na przetwarzanie danych</span>
              </label>

              <label className="flex gap-3">
                <input type="checkbox" name="consentMarketing" checked={form.consentMarketing} onChange={handleChange} />
                <span>Zgoda marketingowa</span>
              </label>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
              <Button className="bg-surface-action text-white px-6 py-3 rounded-lg">
                Wyślij
              </Button>
            </div>

          </div>
        </div>
      </form>
    </section>
  );
}
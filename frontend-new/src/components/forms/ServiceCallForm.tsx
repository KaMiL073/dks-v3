"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";

type ServiceCallFormState = {
  name: string;
  email: string;
  phone: string;
  province: string;
  type: string;
  model: string;
  serialNumber: string;
  message: string;
  consentData: boolean;
  consentMarketing: boolean;
};

const SERVICE_TYPES = [
  "Zgłoszenie usterki urządzenia",
  "Podanie liczników urządzenia",
  "Zakup materiałów eksploatacyjnych",
  "Zakup materiałów eksploatacyjnych w ramach umowy",
  "Zgłoszenie przeglądu",
];

const PROVINCES = [
  { value: "pomorskie", label: "Pomorskie" },
  { value: "mazowieckie", label: "Mazowieckie" },
  { value: "slaskie", label: "Śląskie" },
  { value: "wielkopolskie", label: "Wielkopolskie" },
  { value: "lodzkie", label: "Łódzkie" },
  { value: "malopolskie", label: "Małopolskie" },
  { value: "dolnoslaskie", label: "Dolnośląskie" },
];

export default function ServiceCallForm() {
  const [form, setForm] = useState<ServiceCallFormState>({
    name: "",
    email: "",
    phone: "",
    province: "pomorskie",
    type: SERVICE_TYPES[0],
    model: "",
    serialNumber: "",
    message: "",
    consentData: false,
    consentMarketing: false,
  });

  const [isSending, setIsSending] = useState(false);

  const fieldWrapClass =
    "self-stretch flex flex-col justify-start items-start gap-2";

  const labelClass =
    "self-stretch text-Text-body text-xl font-normal font-['Montserrat'] leading-6";

  const inputClass =
    "self-stretch h-10 bg-[#F9FAFB] rounded-lg border border-border-primary px-3 text-base font-normal font-['Montserrat'] text-Text-body outline-none focus:border-Text-headings";

  const textareaClass =
    "self-stretch h-44 bg-[#F9FAFB] rounded-lg border border-border-primary px-3 py-2 text-base font-normal font-['Montserrat'] text-Text-body outline-none resize-none focus:border-Text-headings";

  const checkboxClass =
    "w-6 h-6 shrink-0 appearance-none bg-[#F9FAFB] rounded border-2 border-border-primary cursor-pointer checked:bg-surface-action checked:border-surface-action checked:after:content-['✓'] checked:after:block checked:after:text-Text-on-action checked:after:text-center checked:after:leading-[22px] checked:after:text-sm";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [target.name]: target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.consentData) {
      alert("❌ Zgoda na przetwarzanie danych jest wymagana.");
      return;
    }

    try {
      setIsSending(true);

      const payload = {
        form_name: "ServiceCallForm",
        email: form.email,
        form_data: form,
      };

      const resp = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) throw data;

      alert("✅ Zgłoszenie zostało wysłane.");

      setForm({
        name: "",
        email: "",
        phone: "",
        province: "pomorskie",
        type: SERVICE_TYPES[0],
        model: "",
        serialNumber: "",
        message: "",
        consentData: false,
        consentMarketing: false,
      });
    } catch (err) {
      console.error(err);
      alert("❌ Coś poszło nie tak.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="self-stretch min-h-[1200px] flex flex-col lg:flex-row justify-start items-start gap-16">
      {/* LEWA KOLUMNA */}
      <div className="w-96 self-stretch inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden shrink-0">
        <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
          <div className="self-stretch">
            <span className="text-Text-headings text-4xl font-semibold font-['Montserrat'] leading-[56px]">
              Skontaktuj się z nami
              <br />
              <br />
            </span>
            <span className="text-Text-headings text-xl font-normal font-['Montserrat'] leading-6">
              Wypełnij formularz, a nasz zespół odezwie się do Ciebie najszybciej jak to możliwe. 
              Doświadczeni specjaliści zapoznają się z Twoją sprawą i zaproponują najlepsze rozwiązanie.
            </span>
          </div>
        </div>
      </div>

      {/* FORMULARZ */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 min-w-[520px] inline-flex flex-col justify-end items-end gap-9"
      >
        <div className="self-stretch flex flex-col justify-start items-center gap-12">
          <div className="self-stretch flex flex-col gap-3">
            <label className={fieldWrapClass}>
              <span className={labelClass}>Imię i Nazwisko / Nazwa firmy:</span>
              <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>Email:</span>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>Telefon:</span>
              <input name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>Województwo:</span>
              <select name="province" value={form.province} onChange={handleChange} className={inputClass}>
                {PROVINCES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>Temat zgłoszenia:</span>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                {SERVICE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="self-stretch flex flex-col gap-3">
            <label className={fieldWrapClass}>
              <span className={labelClass}>Model:</span>
              <input name="model" value={form.model} onChange={handleChange} className={inputClass} />
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>Numer seryjny:</span>
              <input name="serialNumber" value={form.serialNumber} onChange={handleChange} className={inputClass} />
            </label>
          </div>

          <label className="self-stretch flex flex-col gap-2">
            <span className={labelClass}>Treść wiadomości:</span>
            <textarea name="message" value={form.message} onChange={handleChange} required className={textareaClass} />
          </label>
        </div>

        {/* CHECKBOXY */}
        <div className="self-stretch flex flex-col gap-6">
          <label className="inline-flex gap-4">
            <input type="checkbox" name="consentData" checked={form.consentData} onChange={handleChange} required className={checkboxClass} />
              <span className="flex-1 justify-start text-Text-body text-xs font-normal font-['Montserrat'] leading-4">
                Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w
                powyższym formularzu przez DKS Sp. z o.o., zgodnie z przepisami
                rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z
                dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w
                związku z przetwarzaniem danych osobowych i w sprawie swobodnego
                przepływu takich danych oraz uchylenia dyrektywy 95/46/WE ogólne
                rozporządzenie o ochronie danych, Dz. Urz. UE z 4.5.2016 r. L
                119, str. 1, w celu udzielenia odpowiedzi na złożone zapytanie.
                Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej
                zrezygnować. Żądanie usunięcia danych proszę kierować na adres
                rodo@dks.pl. Cofnięcie zgody na przetwarzanie danych nie ma wpływu
                na przetwarzanie danych dokonane przed jego zgłoszeniem.
              </span>
          </label>

          <label className="inline-flex gap-4">
            <input type="checkbox" name="consentMarketing" checked={form.consentMarketing} onChange={handleChange} className={checkboxClass} />
              <span className="flex-1 justify-start text-Text-body text-xs font-normal font-['Montserrat'] leading-4">
                Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w
                powyższym formularzu przez DKS Sp. z o.o., zgodnie z przepisami
                rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z
                dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w
                związku z przetwarzaniem danych osobowych i w sprawie swobodnego
                przepływu takich danych oraz uchylenia dyrektywy 95/46/WE ogólne
                rozporządzenie o ochronie danych, Dz. Urz. UE z 4.5.2016 r. L
                119, str. 1, w celu otrzymywania od DKS Sp. z o.o. treści
                marketingowych oraz informacji handlowych, w tym informacji o
                promocjach i ofertach, za pośrednictwem podanego adresu e-mail
                oraz numeru telefonu. Zgoda jest dobrowolna i w każdym dowolnym
                momencie można z niej zrezygnować. Żądanie usunięcia danych proszę
                kierować na adres rodo@dks.pl. Cofnięcie zgody na przetwarzanie
                danych nie ma wpływu na przetwarzanie danych dokonane przed jego
                zgłoszeniem.
              </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSending}
          className="p-4 bg-surface-action rounded-lg text-Text-on-action text-2xl font-semibold disabled:opacity-60"
        >
          {isSending ? "Wysyłanie..." : "Wyślij"}
        </Button>
      </form>
    </div>
  );
}
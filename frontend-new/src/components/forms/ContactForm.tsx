"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";

export type ContactFormState = {
  name: string;
  nip: string;
  email: string;
  phone: string;
  message: string;
  province: string;
  consentData: boolean;
  consentMarketing: boolean;
};

type ContactFormProps = {
  /**
   * Jeśli wrapper (np. accordion) daje już padding, ustaw compact=true
   * żeby nie robić dodatkowych odstępów w samym formularzu.
   */
  compact?: boolean;
  className?: string;
};

export default function ContactForm({
  compact = false,
  className = "",
}: ContactFormProps) {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    nip: "",
    email: "",
    phone: "",
    message: "",
    province: "pomorskie",
    consentData: false,
    consentMarketing: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, type, value, checked } = target;

    if (name === "nip") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resp = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "ContactForm",
          email: form.email,
          form_data: form,
        }),
      });

      const data = await resp.json();
      if (!resp.ok) throw data;

      alert("✅ Dziękujemy! Formularz został wysłany.");
      setForm({
        name: "",
        nip: "",
        email: "",
        phone: "",
        message: "",
        province: "pomorskie",
        consentData: false,
        consentMarketing: false,
      });
    } catch (err) {
      console.error("Błąd wysyłania formularza:", err);
      alert("❌ Ups! Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  const inputClass =
    "w-full h-11 rounded-lg border border-gray-500 px-3 bg-white outline-none focus:border-gray-700";
  const textareaClass =
    "w-full min-h-[180px] rounded-lg border border-gray-500 px-3 py-2 bg-white outline-none focus:border-gray-700";
  const labelClass = "flex flex-col gap-1 text-base text-Text-headings";

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        "w-full",
        compact ? "" : "py-2",
        className,
      ].join(" ")}
    >
      {/* WSZYSTKIE POLA JEDNO POD DRUGIM */}
      <div className="flex flex-col gap-4">
        <label className={labelClass}>
          Imię i Nazwisko / Nazwa firmy:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          NIP:
          <input
            type="text"
            name="nip"
            value={form.nip}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="[0-9]*"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Telefon:
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            pattern="[0-9+]{8,13}"
            autoComplete="tel"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Województwo:
          <select
            name="province"
            value={form.province}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="pomorskie">Pomorskie</option>
            <option value="mazowieckie">Mazowieckie</option>
            <option value="slaskie">Śląskie</option>
            <option value="wielkopolskie">Wielkopolskie</option>
            <option value="lodzkie">Łódzkie</option>
            <option value="malopolskie">Małopolskie</option>
            <option value="zachodniopomorskie">Zachodniopomorskie</option>
            <option value="kujawsko-pomorskie">Kujawsko-pomorskie</option>
            <option value="warminsko-mazurskie">Warmińsko-mazurskie</option>
            <option value="podkarpackie">Podkarpackie</option>
            <option value="podlaskie">Podlaskie</option>
            <option value="dolnoslaskie">Dolnośląskie</option>
          </select>
        </label>

        <label className={labelClass}>
          Treść wiadomości:
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className={textareaClass}
          />
        </label>
      </div>

      {/* RODO */}
      <div className="mt-6 space-y-4">
        <label className="flex items-start gap-3 text-xs leading-snug text-gray-800">
          <input
            type="checkbox"
            name="consentData"
            checked={form.consentData}
            onChange={handleChange}
            className="mt-1"
            required
          />
          <span>
            Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w powyższym formularzu przez DKS Sp. z o.o., 
            zgodnie z przepisami rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. 
            w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu 
            takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), 
            Dz. Urz. UE z 4.5.2016 r. L 119, str. 1, w celu udzielenia odpowiedzi na złożone zapytanie. 
            Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej zrezygnować. 
            Żądanie usunięcia danych proszę kierować na adres rodo@dks.pl. 
            Cofnięcie zgody na przetwarzanie danych nie ma wpływu na przetwarzanie danych dokonane przed jego zgłoszeniem.

          </span>
        </label>

        <label className="flex items-start gap-3 text-xs leading-snug text-gray-800">
          <input
            type="checkbox"
            name="consentMarketing"
            checked={form.consentMarketing}
            onChange={handleChange}
            className="mt-1"
          />
          <span>
            Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w powyższym formularzu przez DKS Sp. z o.o., 
            zgodnie z przepisami rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. 
            w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu 
            takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), 
            Dz. Urz. UE z 4.5.2016 r. L 119, str. 1, w celu otrzymywania od DKS Sp. z o.o. 
            treści marketingowych oraz informacji handlowych, w tym informacji o promocjach i ofertach, 
            za pośrednictwem podanego adresu e-mail oraz numeru telefonu. Zgoda jest dobrowolna 
            i w każdym dowolnym momencie można z niej zrezygnować. Żądanie usunięcia danych proszę kierować na adres 
            rodo@dks.pl. Cofnięcie zgody na przetwarzanie danych nie ma wpływu na przetwarzanie danych dokonane 
            przed jego zgłoszeniem.
          </span>
        </label>

        <div className="text-tiny leading-3 mb-6">
          <p>
            Informujemy, że: Administratorem Pani/Pana danych osobowych jest DKS Sp. z o.o., z siedzibą przy ul. 
            Energetycznej 15, 80-180 Kowale, e-mail: rodo@dks.pl.</p>
          <p>
            Więcej informacji o tym, jak przetwarzamy Twoje dane znajdziesz w 
            <a className="text-dks-red" href="klauzula-ochrony-danych-data-protection">Klauzuli Ochrony Danych.</a>
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Wyślij
        </Button>
      </div>
    </form>
  );
}
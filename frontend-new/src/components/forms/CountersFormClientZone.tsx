"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

type FormState = {
  name: string;
  nip: string;
  email: string;
  phone: string;
  province: string;
  model: string;
  serialNumber: string;

  monoCounter: string;
  colorCounter: string;
  tbcCounter: string;

  message: string;

  consentData: boolean;
  consentMarketing: boolean;
};

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

export default function CountersFormClientZone() {
  const FORM_NAME = "CountersForm";

  const [form, setForm] = useState<FormState>({
    name: "",
    nip: "",
    email: "",
    phone: "",
    province: "pomorskie",
    model: "",
    serialNumber: "",

    monoCounter: "",
    colorCounter: "",
    tbcCounter: "",

    message: "",

    consentData: false,
    consentMarketing: false,
  });

  const inputBase =
    "w-full h-11 rounded-lg border border-gray-500 bg-white px-3 text-sm md:text-base focus:outline-none";
  const textareaBase =
    "w-full min-h-[180px] rounded-lg border border-gray-500 bg-white px-3 py-2 text-sm md:text-base focus:outline-none";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;

    // NIP: tylko cyfry max 10
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

    if (!form.consentData) {
      alert("❌ Zgoda na przetwarzanie danych jest wymagana.");
      return;
    }

    const payload = {
      form_name: FORM_NAME,
      email: form.email,
      form_data: {
        name: form.name,
        nip: form.nip,
        email: form.email,
        phone: form.phone,
        province: form.province,
        model: form.model,
        serialNumber: form.serialNumber,

        monoCounter: form.monoCounter,
        colorCounter: form.colorCounter,
        tbcCounter: form.tbcCounter,

        message: form.message,

        consentData: form.consentData,
        consentMarketing: form.consentMarketing,
      },
    };

    try {
      const resp = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();
      if (!resp.ok) throw data;

      alert("✅ Dziękujemy! Formularz został wysłany.");

      setForm({
        name: "",
        nip: "",
        email: "",
        phone: "",
        province: "pomorskie",
        model: "",
        serialNumber: "",

        monoCounter: "",
        colorCounter: "",
        tbcCounter: "",

        message: "",

        consentData: false,
        consentMarketing: false,
      });
    } catch (error) {
      console.error("Błąd wysyłki:", error);
      alert("❌ Ups! Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        {/* stabilny layout na lg/xl */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* obraz */}
          <div className="hidden lg:block lg:col-span-5">
            <Image
              className="w-full h-auto object-contain"
              src="/static/homepage/Obraz-c.webp"
              alt="Liczniki"
              width={900}
              height={1200}
              unoptimized
            />
          </div>

          {/* formularz */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Osoba kontaktowa:</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">NIP firmy:</span>
              <input
                name="nip"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{10}"
                required
                value={form.nip}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">E-mail:</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Telefon:</span>
              <input
                name="phone"
                type="tel"
                pattern="[0-9+]{8,13}"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Województwo:</span>
              <select
                name="province"
                required
                value={form.province}
                onChange={handleChange}
                className={inputBase}
              >
                {PROVINCES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Model:</span>
              <input
                name="model"
                type="text"
                required
                value={form.model}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Numer seryjny:</span>
              <input
                name="serialNumber"
                type="text"
                required
                value={form.serialNumber}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Licznik mono:</span>
              <input
                name="monoCounter"
                type="text"
                required
                value={form.monoCounter}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Licznik kolor:</span>
              <input
                name="colorCounter"
                type="text"
                required
                value={form.colorCounter}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Licznik TBC:</span>
              <input
                name="tbcCounter"
                type="text"
                required
                value={form.tbcCounter}
                onChange={handleChange}
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Szczegóły zamówienia:</span>
              <textarea
                name="message"
                required
                value={form.message}
                onChange={handleChange}
                className={textareaBase}
              />
            </label>

            {/* CHECKBOXY */}
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

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <Button
                type="submit"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Wyślij
              </Button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
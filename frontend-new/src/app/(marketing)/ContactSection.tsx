"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

type FormState = {
  name: string;
  nip: string;
  email: string;
  phone: string;
  message: string;
  province: string;
  consentData: boolean;
  consentMarketing: boolean;
};

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
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
    const { name, type, value, checked } = e.target as HTMLInputElement;
      if (name === "nip") {
    if (!/^\d*$/.test(value)) return; // blokuje litery
    if (value.length > 10) return;    // blokuje więcej niż 10 cyfr
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
        body: JSON.stringify(form),
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

  return (
    <section className="self-stretch min-h-[1200px] px-6 xl:px-28 py-20 flex flex-col gap-10">
      <h2 className="text-4xl font-semibold">Skontaktuj się z nami</h2>

      <form
        className="flex flex-col lg:flex-row lg:gap-12"
        onSubmit={handleSubmit}
      >
        {/* Lewa kolumna: obraz */}
        <Image
          className="flex-1 max-w-[514px] object-contain hidden lg:block"
          src="/static/homepage/Obraz-c.webp"
          alt="Kontakt"
          width={514}
          height={1034}
          unoptimized
        />

        {/* Prawa kolumna: formularz */}
        <div className="flex-1 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Imię i Nazwisko / Nazwa firmy:
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="h-10 rounded border border-gray-300 px-3"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            NIP:
            <input
              type="text"
              name="nip"
              value={form.nip}
              onChange={handleChange}        
              required
              autoComplete="name"
              pattern="[0-9]*"
              className="h-10 rounded border border-gray-300 px-3"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Email:
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="h-10 rounded border border-gray-300 px-3"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Telefon:
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="[0-9\+]{8,13}"
              autoComplete="phone"
              className="h-10 rounded border border-gray-300 px-3"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Województwo:
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              required
              className="h-10 rounded border border-gray-300 px-3 bg-white"
            >
              <option value="">-- Wybierz województwo --</option>
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

          <label className="flex flex-col gap-1 text-sm">
            Treść wiadomości:
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              autoComplete="message"
              className="h-44 rounded border border-gray-300 px-3 py-2"
            />
          </label>

          {/* Checkboxy RODO */}
          <label className="flex items-start gap-2 text-xs text-gray-700 leading-snug">
            <input
              type="checkbox"
              name="consentData"
              checked={form.consentData}
              onChange={handleChange}
              className="mt-1 align-top"
            />
              Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w powyższym formularzu przez DKS Sp. z o.o., zgodnie z przepisami rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), Dz. Urz. UE z 4.5.2016 r. L 119, str. 1, w celu udzielenia odpowiedzi na złożone zapytanie. Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej zrezygnować. Żądanie usunięcia danych proszę kierować na adres rodo@dks.pl. Cofnięcie zgody na przetwarzanie danych nie ma wpływu na przetwarzanie danych dokonane przed jego zgłoszeniem.
          </label>

          <label className="flex items-start gap-2 text-xs text-gray-700 leading-snug">
            <input
              type="checkbox"
              name="consentMarketing"
              checked={form.consentMarketing}
              onChange={handleChange}
              className="mt-1 align-top"
            />
            Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w powyższym formularzu przez DKS Sp. z o.o., zgodnie z przepisami rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych), Dz. Urz. UE z 4.5.2016 r. L 119, str. 1, w celu otrzymywania od DKS Sp. z o.o. treści marketingowych oraz informacji handlowych, w tym informacji o promocjach i ofertach, za pośrednictwem podanego adresu e-mail oraz numeru telefonu. Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej zrezygnować. Żądanie usunięcia danych proszę kierować na adres rodo@dks.pl. Cofnięcie zgody na przetwarzanie danych nie ma wpływu na przetwarzanie danych dokonane przed jego zgłoszeniem.
          </label>

          {/* Przycisk Wyślij */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition"
            >
              Wyślij
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}
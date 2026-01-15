"use client";

import React, { useState } from "react";
import Image from "next/image";
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

type Props = {
  compact?: boolean;
};

export default function ServiceCallForm({ compact = false }: Props) {
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type, value, checked } = e.target as HTMLInputElement;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      form_name: "ServiceCallForm",
      email: form.email,
      form_data: { ...form },
    };

    try {
      const resp = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw await resp.json();

      alert("✅ Zgłoszenie zostało wysłane.");
    } catch (err) {
      console.error(err);
      alert("❌ Coś poszło nie tak.");
    }
  };

  const input =
    "w-full h-11 rounded-lg border border-gray-500 px-3 bg-white focus:outline-none";
  const textarea =
    "w-full min-h-[180px] rounded-lg border border-gray-500 px-3 py-2 bg-white focus:outline-none";
  const label = "flex flex-col gap-1 text-base";

  return (
    <section className={compact ? "py-2" : "py-10"}>
      <div className="mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">
          Zgłoszenie serwisowe
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* obraz */}
            <div className="hidden lg:block lg:col-span-5">
              <Image
                src="/static/homepage/Obraz-c.webp"
                alt=""
                width={900}
                height={1200}
                className="w-full h-auto object-contain"
                unoptimized
              />
            </div>

            {/* formularz */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <label className={label}>
                Imię i Nazwisko / Nazwa firmy
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </label>

              <label className={label}>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </label>

              <label className={label}>
                Telefon
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </label>

              <label className={label}>
                Województwo
                <select
                  name="province"
                  value={form.province}
                  onChange={handleChange}
                  className={input}
                >
                  <option value="pomorskie">Pomorskie</option>
                  <option value="mazowieckie">Mazowieckie</option>
                  <option value="slaskie">Śląskie</option>
                  <option value="wielkopolskie">Wielkopolskie</option>
                  <option value="lodzkie">Łódzkie</option>
                  <option value="malopolskie">Małopolskie</option>
                  <option value="dolnoslaskie">Dolnośląskie</option>
                </select>
              </label>

              <label className={label}>
                Temat zgłoszenia
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={input}
                >
                  {SERVICE_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className={label}>
                Model
                <input
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </label>

              <label className={label}>
                Numer seryjny
                <input
                  name="serialNumber"
                  value={form.serialNumber}
                  onChange={handleChange}
                  required
                  className={input}
                />
              </label>

              <label className={label}>
                Treść wiadomości
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className={textarea}
                />
              </label>

              {/* zgody */}
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
                <Button className="bg-red-600 text-white px-6 py-3">
                  Wyślij
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
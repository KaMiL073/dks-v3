"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

type FormState = {
  name: string;
  province: string;
  nip: string;
  email: string;
  phone: string;
  message: string;
  consentData: boolean;
  consentMarketing: boolean;
};

export default function DebtCollectionFormClientZone() {
  const FORM_NAME = "DebtCollectionForm";

  const [form, setForm] = useState<FormState>({
    name: "",
    province: "pomorskie",
    nip: "",
    email: "",
    phone: "",
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
        province: form.province,
        nip: form.nip,
        email: form.email,
        phone: form.phone,
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
        province: "pomorskie",
        nip: "",
        email: "",
        phone: "",
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
    <section className="w-full overflow-x-hidden">
      <form onSubmit={handleSubmit} className="w-full">
        <div
          className={[
            "grid grid-cols-1 items-start",
            "lg:grid-cols-12",
            "gap-8 md:gap-10",
            "lg:gap-10 xl:gap-14",
          ].join(" ")}
        >
          {/* OBRAZ */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 min-w-0">
            <div className="sticky top-6">
              <Image
                className="w-full h-auto max-h-[680px] object-cover rounded-md"
                src="/static/homepage/Obraz-c.webp"
                alt="Dział windykacji"
                width={900}
                height={1200}
                unoptimized
              />
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-7 xl:col-span-8 min-w-0 w-full">
            {/* stabilizuje szerokość na xl/2xl, żeby nie „pchało” layoutu */}
            <div className="w-full max-w-[640px] xl:max-w-[680px]">
              <input
                type="hidden"
                name="province"
                value={form.province}
                readOnly
              />

              <div className="w-full flex flex-col gap-4">
                <label className="flex flex-col gap-1">
                  <span className="text-sm md:text-base text-Text-body font-['Montserrat']">
                    Nazwa firmy:
                  </span>
                  <input
                    name="name"
                    type="text"
                    autoComplete="organization"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm md:text-base text-Text-body font-['Montserrat']">
                    NIP:
                  </span>
                  <input
                    name="nip"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                    value={form.nip}
                    onChange={handleChange}
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm md:text-base text-Text-body font-['Montserrat']">
                    E-mail:
                  </span>
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
                  <span className="text-sm md:text-base text-Text-body font-['Montserrat']">
                    Telefon:
                  </span>
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
                  <span className="text-sm md:text-base text-Text-body font-['Montserrat']">
                    Treść wiadomości:
                  </span>
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
          </div>
          {/* /FORM */}
        </div>
      </form>
    </section>
  );
}
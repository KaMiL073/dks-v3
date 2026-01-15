"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
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

  // W ramach umowy: stan + ilość
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
  { value: "lodzkie", label: "Łódzkie" },
  { value: "malopolskie", label: "Małopolskie" },
  { value: "zachodniopomorskie", label: "Zachodniopomorskie" },
  { value: "kujawsko-pomorskie", label: "Kujawsko-pomorskie" },
  { value: "warminsko-mazurskie", label: "Warmińsko-mazurskie" },
  { value: "podkarpackie", label: "Podkarpackie" },
  { value: "podlaskie", label: "Podlaskie" },
  { value: "dolnoslaskie", label: "Dolnośląskie" },
] as const;

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

  const inputBase =
    "w-full h-11 rounded-lg border border-gray-500 bg-white px-3 text-sm md:text-base focus:outline-none";
  const textareaBase =
    "w-full min-h-[180px] rounded-lg border border-gray-500 bg-white px-3 py-2 text-sm md:text-base focus:outline-none";

  const isContract = form.type === "W ramach umowy";
  const isNoContract = form.type === "Bez umowy";

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

  const requiredContractFields = useMemo(() => {
    if (!isContract) return [];
    return [
      "cyjan",
      "cyjanQty",
      "magenta",
      "magentaQty",
      "yellow",
      "yellowQty",
      "black",
      "blackQty",
    ] as const;
  }, [isContract]);

  const requiredNoContractFields = useMemo(() => {
    if (!isNoContract) return [];
    return ["cyjanQty", "magentaQty", "yellowQty", "blackQty"] as const;
  }, [isNoContract]);

  const validateBeforeSubmit = (): string | null => {
    if (!form.type) return "Wybierz rodzaj zamówienia.";

    if (isContract) {
      for (const k of requiredContractFields) {
        if (!String(form[k] ?? "").trim())
          return "Uzupełnij wszystkie pola tonerów dla umowy.";
      }
    }

    if (isNoContract) {
      for (const k of requiredNoContractFields) {
        if (!String(form[k] ?? "").trim()) return "Uzupełnij ilości tonerów.";
      }
    }

    if (!form.consentData) return "Zgoda na przetwarzanie danych jest wymagana.";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateBeforeSubmit();
    if (validationError) {
      alert(`❌ ${validationError}`);
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
        type: form.type,

        cyjan: form.cyjan,
        cyjanQty: form.cyjanQty,
        magenta: form.magenta,
        magentaQty: form.magentaQty,
        yellow: form.yellow,
        yellowQty: form.yellowQty,
        black: form.black,
        blackQty: form.blackQty,

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

      alert("✅ Dziękujemy! Zamówienie zostało wysłane.");

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
    } catch (err) {
      console.error("Błąd wysyłania formularza:", err);
      alert("❌ Ups! Coś poszło nie tak. Spróbuj ponownie.");
    }
  };

  return (
    <section className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* obraz */}
          <div className="hidden lg:block lg:col-span-5">
            <Image
              className="w-full h-auto object-contain"
              src="/static/homepage/Obraz-c.webp"
              alt="Zamówienie materiałów eksploatacyjnych"
              width={900}
              height={1200}
              unoptimized
            />
          </div>

          {/* formularz */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-w-0">
            {/* ZAWSZE jedna kolumna */}
            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Osoba kontaktowa:</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">NIP firmy:</span>
              <input
                type="text"
                name="nip"
                value={form.nip}
                onChange={handleChange}
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">E-mail:</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Telefon:</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                pattern="[0-9+]{8,13}"
                autoComplete="tel"
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Województwo:</span>
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                required
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
                type="text"
                name="model"
                value={form.model}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">Numer seryjny:</span>
              <input
                type="text"
                name="serialNumber"
                value={form.serialNumber}
                onChange={handleChange}
                required
                autoComplete="off"
                className={inputBase}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm md:text-base">
                Wybierz rodzaj zamówienia:
              </span>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                required
                className={inputBase}
              >
                <option value="" disabled>
                  wybierz
                </option>
                <option>W ramach umowy</option>
                <option>Bez umowy</option>
              </select>
            </label>

            {/* ====== W RAMACH UMOWY ====== */}
            {isContract && (
              <div className="mt-2 flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Cyjan - obecny stan toneru %:</span>
                  <input
                    type="text"
                    name="cyjan"
                    value={form.cyjan}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Cyjan - ilość:</span>
                  <input
                    type="text"
                    name="cyjanQty"
                    value={form.cyjanQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">
                    Magenta - obecny stan toneru %:
                  </span>
                  <input
                    type="text"
                    name="magenta"
                    value={form.magenta}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Magenta - ilość:</span>
                  <input
                    type="text"
                    name="magentaQty"
                    value={form.magentaQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">
                    Yellow - obecny stan toneru %:
                  </span>
                  <input
                    type="text"
                    name="yellow"
                    value={form.yellow}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Yellow - ilość:</span>
                  <input
                    type="text"
                    name="yellowQty"
                    value={form.yellowQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">
                    Black - obecny stan toneru %:
                  </span>
                  <input
                    type="text"
                    name="black"
                    value={form.black}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Black - ilość:</span>
                  <input
                    type="text"
                    name="blackQty"
                    value={form.blackQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>
              </div>
            )}

            {/* ====== BEZ UMOWY ====== */}
            {isNoContract && (
              <div className="mt-2 flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm">Cyjan - ilość:</span>
                  <input
                    type="text"
                    name="cyjanQty"
                    value={form.cyjanQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">Magenta - ilość:</span>
                  <input
                    type="text"
                    name="magentaQty"
                    value={form.magentaQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">Yellow - ilość:</span>
                  <input
                    type="text"
                    name="yellowQty"
                    value={form.yellowQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm">Black - ilość:</span>
                  <input
                    type="text"
                    name="blackQty"
                    value={form.blackQty}
                    onChange={handleChange}
                    required
                    className={inputBase}
                  />
                </label>
              </div>
            )}

            <label className="flex flex-col gap-1 mt-2">
              <span className="text-sm md:text-base">Inne materiały:</span>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className={textareaBase}
              />
            </label>

            {/* ====== RODO ====== */}
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

            {/* Button */}
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
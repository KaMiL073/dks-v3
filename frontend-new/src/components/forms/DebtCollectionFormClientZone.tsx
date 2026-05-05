"use client";

import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
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

const FORM_NAME = "DebtCollectionForm";

const initialForm: FormState = {
  name: "",
  province: "pomorskie",
  nip: "",
  email: "",
  phone: "",
  message: "",
  consentData: false,
  consentMarketing: false,
};

export default function DebtCollectionFormClientZone() {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [form, setForm] = useState<FormState>(initialForm);
  const [isSending, setIsSending] = useState(false);

  const fieldWrapClass =
    "self-stretch flex flex-col justify-start items-start gap-2";

  const labelClass =
    "self-stretch min-h-5 justify-center text-Text-body text-xl font-normal font-['Montserrat'] leading-6";

  const inputClass =
    "self-stretch h-10 bg-[#F9FAFB] rounded-lg border border-border-primary px-3 text-base font-normal font-['Montserrat'] text-Text-body outline-none focus:border-Text-headings";

  const textareaClass =
    "self-stretch h-44 bg-[#F9FAFB] rounded-lg border border-border-primary px-3 py-2 text-base font-normal font-['Montserrat'] text-Text-body outline-none resize-none focus:border-Text-headings";

  const checkboxClass =
    "w-6 h-6 shrink-0 appearance-none bg-[#F9FAFB] rounded border-2 border-border-primary cursor-pointer checked:bg-surface-action checked:border-surface-action checked:after:content-['✓'] checked:after:block checked:after:text-Text-on-action checked:after:text-center checked:after:leading-[22px] checked:after:text-sm";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.consentData) {
      alert("❌ Musisz wyrazić zgodę na przetwarzanie danych.");
      return;
    }

    try {
      setIsSending(true);

      if (!executeRecaptcha) {
        throw new Error("reCAPTCHA nie jest gotowa.");
      }

      const recaptchaToken = await executeRecaptcha("DebtCollectionForm");

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
          clause_for_answers: form.consentData,
          clause: form.consentMarketing,
          consentData: form.consentData,
          consentMarketing: form.consentMarketing,
        },
        recaptchaToken,
      };

      const resp = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw data;
      }

      alert("✅ Dziękujemy! Formularz został wysłany.");
      setForm(initialForm);
    } catch (err) {
      console.error("Błąd wysyłki:", err);
      alert("❌ Ups! Coś poszło nie tak. Spróbuj ponownie.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="self-stretch min-h-[1200px] flex flex-col lg:flex-row justify-start items-start gap-16">
      <div className="w-96 self-stretch inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden shrink-0">
        <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
          <div className="self-stretch justify-end">
            <span className="text-Text-headings text-4xl font-semibold font-['Montserrat'] leading-[56px]">
              Skontaktuj się z nami
              <br />
              <br />
            </span>
            <span className="text-Text-headings text-xl font-normal font-['Montserrat'] leading-6">
              Wypełnij formularz, aby przekazać wiadomość do naszego Działu Windykacji. 
            </span>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex-1 min-w-[520px] inline-flex flex-col justify-end items-end gap-9"
      >
        <input type="hidden" name="province" value={form.province} readOnly />

        <div className="self-stretch flex flex-col justify-start items-center gap-12">
          <div className="self-stretch flex flex-col justify-start items-start gap-3">
            <label className={fieldWrapClass}>
              <span className={labelClass}>Nazwa firmy:</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="organization"
                className={inputClass}
              />
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>NIP:</span>
              <input
                type="text"
                name="nip"
                value={form.nip}
                onChange={handleChange}
                required
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                autoComplete="off"
                className={inputClass}
              />
            </label>

            <label className={fieldWrapClass}>
              <span className={labelClass}>E-mail:</span>
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

            <label className={fieldWrapClass}>
              <span className={labelClass}>Telefon:</span>
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
          </div>

          <label className="self-stretch flex flex-col justify-start items-start gap-2">
            <span className={labelClass}>Treść wiadomości:</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              className={textareaClass}
            />
          </label>
        </div>

        <div className="self-stretch py-9 flex flex-col justify-start items-start gap-6">
          <label className="self-stretch inline-flex justify-start items-start gap-4">
            <input
              type="checkbox"
              name="consentData"
              checked={form.consentData}
              onChange={handleChange}
              required
              className={checkboxClass}
            />
            <span className="flex-1 justify-start text-Text-body text-xs font-normal font-['Montserrat'] leading-4">
              Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w
              powyższym formularzu przez DKS Sp. z o.o., zgodnie z przepisami
              rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z
              dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w
              związku z przetwarzaniem danych osobowych i w sprawie swobodnego
              przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne
              rozporządzenie o ochronie danych), Dz. Urz. UE z 4.5.2016 r. L
              119, str. 1, w celu udzielenia odpowiedzi na złożone zapytanie.
              Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej
              zrezygnować. Żądanie usunięcia danych proszę kierować na adres
              rodo@dks.pl. Cofnięcie zgody na przetwarzanie danych nie ma wpływu
              na przetwarzanie danych dokonane przed jego zgłoszeniem.
            </span>
          </label>

          <label className="self-stretch inline-flex justify-start items-start gap-4">
            <input
              type="checkbox"
              name="consentMarketing"
              checked={form.consentMarketing}
              onChange={handleChange}
              className={checkboxClass}
            />
            <span className="flex-1 justify-start text-Text-body text-xs font-normal font-['Montserrat'] leading-4">
              Wyrażam zgodę na przetwarzanie moich danych osobowych podanych w
              powyższym formularzu przez DKS Sp. z o.o., zgodnie z przepisami
              rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z
              dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w
              związku z przetwarzaniem danych osobowych i w sprawie swobodnego
              przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne
              rozporządzenie o ochronie danych), Dz. Urz. UE z 4.5.2016 r. L
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

          <div className="self-stretch text-Text-body text-xs font-normal font-['Montserrat'] leading-4">
            <p>
              Informujemy, że: Administratorem Pani/Pana danych osobowych jest
              DKS Sp. z o.o., z siedzibą przy ul. Energetycznej 15, 80-180
              Kowale, e-mail: rodo@dks.pl.
            </p>
            <p>
              Więcej informacji o tym, jak przetwarzamy Twoje dane znajdziesz w{" "}
              <a
                className="text-dks-red underline"
                href="/klauzula-ochrony-danych-data-protection"
              >
                Klauzuli Ochrony Danych.
              </a>
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSending}
          className="p-4 bg-surface-action rounded-lg inline-flex justify-end items-end gap-2.5 text-Text-on-action text-2xl font-semibold font-['Montserrat'] leading-7 disabled:opacity-60"
        >
          {isSending ? "Wysyłanie..." : "Wyślij"}
        </Button>
      </form>
    </div>
  );
}
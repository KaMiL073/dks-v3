"use client";
import { useRef, useState, type FormEvent } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { Survey } from "@/lib/surveys";
import Button from "@/components/ui/Button";

const contactFields = [
  { key: "name", label: "Imię i nazwisko", type: "text", autoComplete: "name" },
  { key: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { key: "phone", label: "Telefon", type: "tel", autoComplete: "tel" },
  { key: "company", label: "Firma", type: "text", autoComplete: "organization" },
] as const;
const inputClass = "mt-2 w-full rounded-lg border border-neutral-300 bg-white p-3 focus:border-[#E4002B] focus:outline-none focus:ring-2 focus:ring-red-100";

export default function SurveyForm({ survey }: { survey: Survey }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const sending = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const [multiple, setMultiple] = useState<Record<string, string[]>>({});
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true; setPending(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const bypass = process.env.NODE_ENV !== "production" && process.env.NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL === "true" && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(window.location.hostname);
      if (!bypass && !executeRecaptcha) throw new Error("Ochrona antyspamowa nie jest gotowa. Spróbuj ponownie za chwilę.");
      const recaptchaToken = bypass ? "" : await executeRecaptcha!("survey_submit");
      const answers = Object.fromEntries(survey.questions.map(q => [q.id,
        q.type === "multiple_choice" ? form.getAll(q.id) : form.get(q.id) ?? "",
      ]));
      const contact = survey.mode === "contact" ? Object.fromEntries(contactFields.map(f => [f.key, form.get(`contact_${f.key}`) ?? ""])) : {};
      const response = await fetch(`/api/ankiety/${encodeURIComponent(survey.slug)}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, contact, recaptchaToken, website: form.get("website") }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Nie udało się wysłać ankiety.");
      setDone(true);
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch (err) { setError(err instanceof Error ? err.message : "Nie udało się wysłać ankiety. Spróbuj ponownie."); }
    finally { sending.current = false; setPending(false); }
  }
  if (done) return <div ref={statusRef} tabIndex={-1} role="status" className="rounded-lg bg-green-50 p-6 text-green-900 whitespace-pre-wrap">{survey.success_message}</div>;
  return <form onSubmit={submit} className="space-y-8">
    <fieldset disabled={pending} className="space-y-8">
      <div className="hidden" aria-hidden="true"><label>Strona internetowa<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {survey.questions.map((q, index) => <fieldset key={q.id} aria-describedby={q.description ? `${q.id}-hint` : undefined} className="rounded-xl border border-neutral-200 p-5 sm:p-6">
        <legend className="px-2 font-semibold">{index + 1}. {q.title}{q.required && " *"}</legend>
        {q.description && <p id={`${q.id}-hint`} className="mb-3 whitespace-pre-wrap text-sm text-neutral-600">{q.description}</p>}
        {q.type === "short_text" && <input name={q.id} aria-label={q.title} required={q.required} maxLength={500} className={inputClass} />}
        {q.type === "long_text" && <textarea name={q.id} aria-label={q.title} required={q.required} maxLength={10000} rows={5} className={inputClass} />}
        {(q.type === "single_choice" || q.type === "multiple_choice") && <div className="space-y-3">
          {q.options.map((option, i) => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-lg bg-neutral-50 p-3">
            <input className="mt-1 accent-[#E4002B]" name={q.id} value={option.id} type={q.type === "single_choice" ? "radio" : "checkbox"}
              required={q.required && (q.type === "single_choice" || (i === 0 && !multiple[q.id]?.length))}
              onChange={q.type === "multiple_choice" ? event => {
                const checked = event.target.checked;
                setMultiple(previous => ({ ...previous, [q.id]: checked ? [...(previous[q.id] ?? []), option.id] : (previous[q.id] ?? []).filter(id => id !== option.id) }));
              } : undefined} />
            <span>{option.label}</span>
          </label>)}
        </div>}
      </fieldset>)}
      {survey.mode === "contact" && <fieldset className="rounded-xl border border-neutral-200 p-5 sm:p-6">
        <legend className="px-2 font-semibold">Dane kontaktowe</legend>
        <div className="grid gap-5 sm:grid-cols-2">{contactFields.map(field => {
          const setting = survey[`contact_${field.key}`];
          if (setting === "hidden") return null;
          return <label key={field.key} className="text-sm font-medium">{field.label}{setting === "required" && " *"}
            <input name={`contact_${field.key}`} type={field.type} autoComplete={field.autoComplete} maxLength={250} required={setting === "required"} className={inputClass} />
          </label>;
        })}</div>
      </fieldset>}
      {survey.privacy_notice && <p className="whitespace-pre-wrap text-sm text-neutral-600">{survey.privacy_notice}</p>}
      {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{error}</p>}
      <Button type="submit" disabled={pending}>{pending ? "Wysyłanie…" : "Wyślij ankietę"}</Button>
    </fieldset>
  </form>;
}

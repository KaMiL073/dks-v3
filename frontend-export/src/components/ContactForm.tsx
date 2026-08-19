"use client";

import { FormEvent, useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Button from "../../../frontend-new/src/components/ui/Button";

const brands = ["Canon", "Konica Minolta", "RICOH", "Lexmark", "other"];

export default function ContactForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const localRecaptchaBypass =
    process.env.NEXT_PUBLIC_RECAPTCHA_BYPASS_LOCAL === "true";
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const fieldWrapClass = "w-full flex flex-col items-start gap-2";
  const labelClass =
    "w-full text-Text-body text-base md:text-xl font-normal font-['Montserrat'] leading-6";
  const inputClass =
    "w-full h-10 bg-[#F9FAFB] rounded-lg border border-border-primary px-3 text-base font-normal font-['Montserrat'] text-Text-body outline-none focus:border-Text-headings";
  const textareaClass =
    "w-full h-44 bg-[#F9FAFB] rounded-lg border border-border-primary px-3 py-2 text-base font-normal font-['Montserrat'] text-Text-body outline-none resize-none focus:border-Text-headings";
  const checkboxClass =
    "w-6 h-6 shrink-0 appearance-none bg-[#F9FAFB] rounded border-2 border-border-primary cursor-pointer checked:bg-surface-action checked:border-surface-action checked:after:content-['✓'] checked:after:block checked:after:text-Text-on-action checked:after:text-center checked:after:leading-[22px] checked:after:text-sm";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const form = event.currentTarget;

    try {
      if (!executeRecaptcha && !localRecaptchaBypass) {
        throw new Error("Security verification is not ready");
      }

      const data = new FormData(form);
      const selectedBrands = brands.filter((brand) =>
        data.has(`brand_${brand.toLowerCase().replaceAll(" ", "_")}`),
      );

      const email = String(data.get("email") || "").trim();
      const payload = {
        form_name: "export",
        email,
        form_data: {
          name: String(data.get("name") || "").trim(),
          company: String(data.get("company") || "").trim(),
          email,
          phone: String(data.get("phone") || "").trim(),
          country: String(data.get("country") || "").trim(),
          brands: selectedBrands,
          message: String(data.get("message") || "").trim(),
          consentData: data.get("privacy") === "accepted",
        },
      };

      let sent = false;

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const recaptchaToken = localRecaptchaBypass
          ? "local-development"
          : await executeRecaptcha!("export_form");
        const response = await fetch("/api/forms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, recaptchaToken }),
        });

        if (response.ok) {
          sent = true;
          break;
        }

        const result = (await response.json().catch(() => null)) as {
          code?: string;
        } | null;

        if (
          attempt === 0 &&
          result?.code === "recaptcha_browser_error"
        ) {
          continue;
        }

        throw new Error("Form request failed");
      }

      if (!sent) {
        throw new Error("Form request failed");
      }

      form.reset();
      setState("sent");
    } catch (error) {
      console.error("Export form error:", error);
      setState("error");
    }
  }

  return (
    <form
      className="w-full flex-1 min-w-0 flex flex-col gap-9"
      onSubmit={submit}
    >
      <div className="w-full flex flex-col gap-3">
        <label className={fieldWrapClass}>
          <span className={labelClass}>Name:</span>
          <input
            name="name"
            required
            autoComplete="name"
            className={inputClass}
          />
        </label>

        <label className={fieldWrapClass}>
          <span className={labelClass}>Company:</span>
          <input
            name="company"
            autoComplete="organization"
            className={inputClass}
          />
        </label>

        <label className={fieldWrapClass}>
          <span className={labelClass}>Phone number:</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass}
          />
        </label>

        <label className={fieldWrapClass}>
          <span className={labelClass}>Please contact:</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </label>

        <fieldset className="w-full flex flex-col items-start gap-6">
          <legend className={labelClass}>Brands you are interested in:</legend>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {brands.map((brand) => (
              <label
                key={brand}
                className="inline-flex items-center gap-2 text-Text-body text-base font-normal font-['Montserrat']"
              >
                <input
                  name={`brand_${brand.toLowerCase().replaceAll(" ", "_")}`}
                  type="checkbox"
                  value={brand}
                  className={checkboxClass}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className={fieldWrapClass}>
          <span className={labelClass}>Country:</span>
          <input
            name="country"
            required
            autoComplete="country-name"
            className={inputClass}
          />
        </label>
      </div>

      <label className={fieldWrapClass}>
        <span className={labelClass}>How can we help?</span>
        <textarea
          name="message"
          required
          className={textareaClass}
        />
      </label>

      <label className="w-full flex items-start gap-4">
        <input
          name="privacy"
          type="checkbox"
          value="accepted"
          required
          className={checkboxClass}
        />
        <span className="flex-1 min-w-0 text-Text-body text-xs font-normal font-['Montserrat'] leading-4 break-words">
          I hereby agree to the processing of my personal data by DKS Sp. z
          o.o. for the purpose of handling this enquiry and preparing a
          personalised offer. I confirm that I have read the information
          concerning the processing of personal data and understand that I may
          withdraw my consent at any time.
        </span>
      </label>

      <Button
        type="submit"
        disabled={state === "sending"}
        className="w-full sm:w-auto self-start p-4 bg-surface-action rounded-lg inline-flex justify-center items-center gap-2.5 text-Text-on-action text-lg md:text-2xl font-semibold font-['Montserrat'] leading-7 disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Send"}
      </Button>

      <p className="min-h-6 text-sm text-Text-body" role="status">
        {state === "sent" && "Thank you. Your message has been sent."}
        {state === "error" &&
          "The message could not be sent. Please email us directly."}
      </p>
    </form>
  );
}

"use client";

import Image from "next/image";
import ContactForm from "@/components/forms/ContactForm";

type ContactSectionProps = {
  /**
   * Używasz w accordionzie? Daj compact żeby NIE dublować paddingów.
   * (Accordion już daje px-6/md:px-12)
   */
  compact?: boolean;
  className?: string;
};

export default function ContactSection({
  compact = false,
  className = "",
}: ContactSectionProps) {
  return (
    <section
      className={[
        "w-full p-6 xl:px-28 py-20 ",
        compact ? "py-2" : "py-10",
        className,
      ].join(" ")}
    >
      <div className={["w-full", compact ? "max-w-none" : "mx-auto"].join(" ")}>
        <h2 className="text-3xl md:text-4xl font-semibold text-Text-headings mb-8 md:mb-10">
          Skontaktuj się z nami
        </h2>

        {/* layout: obraz + formularz */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="hidden lg:block lg:col-span-5">
            <Image
              className="w-full h-auto object-contain"
              src="/static/homepage/Obraz-C.webp"
              alt="Kontakt"
              width={900}
              height={1200}
              unoptimized
            />
          </div>

          <div className="lg:col-span-7 min-w-0">
            {/* sam formularz */}
            <ContactForm compact />
          </div>
        </div>
      </div>
    </section>
  );
}
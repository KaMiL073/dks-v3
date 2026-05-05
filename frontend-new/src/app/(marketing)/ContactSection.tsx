"use client";

import ContactForm from "@/components/forms/ContactForm";

type ContactSectionProps = {
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
        "w-full bg-[#D1D5DC] px-6 xl:px-28",
        compact ? "py-4" : "py-12 lg:py-20",
        className,
      ].join(" ")}
    >
      <div className={["w-full", compact ? "" : "max-w-[1200px] mx-auto"].join(" ")}>

        {/* formularz full width */}
        <div className="w-full">
          <ContactForm compact />
        </div>

      </div>
    </section>
  );
}

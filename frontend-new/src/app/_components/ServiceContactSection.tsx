"use client";

type ServiceContactSectionProps = {
  title?: string;
  phone1?: string;
  phone2?: string;
  className?: string; // opcjonalnie nadpisanie spacingu
};

export default function ServiceContactSection({
  title = "Kontakt z serwisem",
  phone1 = "801 004 104",
  phone2 = "58 350 66 05",
  className = "",
}: ServiceContactSectionProps) {
  return (
    <section className={`w-full py-20 ${className}`}>
      <div className="w-full px-6 md:px-12 lg:px-20 xl:px-28 py-20 bg-[#D1D5DC]">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 flex-wrap">
          {/* LEWA KOLUMNA */}
          <div className="flex-1 min-w-[320px] max-w-[710px]">
            {title && (
              <h2 className="text-Text-headings text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight">
                {title}
              </h2>
            )}
          </div>

          {/* PRAWA KOLUMNA */}
          {(phone1 || phone2) && (
            <div className="flex-1 min-w-[240px] text-left lg:text-right">
              {phone1 && (
                <span className="text-Text-headings text-2xl leading-7">
                  Telefon:&nbsp;<br />
                  <span className="underline">{phone1}</span>
                </span>
              )}
              <br />
              {phone2 && (
                <span className="text-Text-headings text-2xl leading-7">
                  &nbsp;&nbsp;
                  <span className="underline">{phone2}</span>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
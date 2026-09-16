import Image from "next/image";

type PromotionLinkSectionProps = {
  title?: string;
  description?: string;
  url?: string;
};

export default function PromotionLinkSection({
  title,
  description,
  url,
}: PromotionLinkSectionProps) {
  const heading = title?.trim();
  const paragraph = description?.trim();
  const link = url?.trim();
  const safeLink =
    link && (/^https?:\/\//i.test(link) || /^\/(?!\/)/.test(link))
      ? link
      : null;

  if (!heading && !paragraph && !safeLink) return null;

  return (
    <section className="bg-[#D1D5DC] px-6 py-12 md:px-12 md:py-16 xl:px-28 xl:py-20">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-16">
        <div className="flex flex-1 flex-col gap-5 md:gap-8">
          {heading && (
            <h2 className="font-['Montserrat'] text-3xl font-semibold leading-tight text-Text-body md:text-4xl md:leading-[56px]">
              {heading}
            </h2>
          )}
          {paragraph && (
            <p className="font-['Montserrat'] text-xl leading-7 text-black md:text-2xl">
              {paragraph}
            </p>
          )}
        </div>

        {safeLink && (
          <a
            href={safeLink}
            aria-label={heading ? `Przejdź do: ${heading}` : "Przejdź do linku"}
            className="flex h-16 w-16 shrink-0 items-center justify-center transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <Image
              src="/static/icons/ArrowNext.svg"
              alt=""
              width={37}
              height={63}
            />
          </a>
        )}
      </div>
    </section>
  );
}

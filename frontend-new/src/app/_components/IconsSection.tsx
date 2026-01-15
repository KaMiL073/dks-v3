// frontend-new/src/app/_components/IconsSection.tsx
import Image from "next/image";

type IconsSectionItem = {
  icon: string;
  label: string;
  description?: string;
};

type IconsSectionProps = {
  title?: string;
  items: IconsSectionItem[];
};

export default function IconsSection({ title, items }: IconsSectionProps) {
  return (
    <section className="self-stretch inline-flex flex-col justify-start items-center gap-12">
      {title ? (
        <h2 className="text-center text-Text-headings text-4xl font-semibold font-['Montserrat'] leading-[48px]">
          {title}
        </h2>
      ) : null}

      <div className="self-stretch inline-flex justify-center items-start gap-6 flex-wrap content-start">
        {items.map((item, idx) => (
          <div
            key={`${item.label}-${idx}`}
            className="w-80 inline-flex flex-col justify-start items-center gap-6"
          >
            <div className="w-32 h-32 relative">
              <Image
                src={item.icon}
                alt={item.label}
                fill
                className="object-contain"
              />
            </div>

            <div className="self-stretch text-center justify-start text-Text-body text-xl font-semibold font-['Montserrat'] leading-6">
              {item.label}
            </div>

            {item.description ? (
              <div className="self-stretch text-center justify-start text-Text-body text-xl font-normal font-['Montserrat'] leading-6">
                {item.description}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
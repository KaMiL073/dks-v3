// frontend-new/src/app/oferta/components/MedykAudienceSection.tsx
import Image from "next/image";

type MedykAudienceItem = {
  icon: string;
  title: string;
  alt?: string;
};

type MedykAudienceSectionProps = {
  title?: string;
  items?: MedykAudienceItem[];
};

function AudienceCard({ item }: { item: MedykAudienceItem }) {
  return (
    <div className="w-full max-w-[280px] flex flex-col items-center gap-6 md:gap-9">
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-[64px] bg-icon-secondary flex items-center justify-center p-2">
        <div className="relative w-[96px] h-[96px]">
          <Image
            src={item.icon}
            alt={item.alt || item.title}
            fill
            className="object-contain"
          />
        </div>
      </div>

      <div className="text-center text-Text-headings text-lg md:text-2xl font-semibold font-['Montserrat'] leading-6 md:leading-7">
        {item.title}
      </div>
    </div>
  );
}

export default function MedykAudienceSection({
  title = "Dla kogo jest XSM Medyk?",
  items = [],
}: MedykAudienceSectionProps) {
  if (!items.length) return null;

  const firstRow = items.slice(0, 5);
//   const secondRow = items.slice(3, 5);

  return (
    <section className="w-full bg-surface-page py-12 md:py-20 overflow-hidden">
      <div className="w-full flex flex-col items-start gap-12 md:gap-16">
        <div className="w-full flex flex-col justify-center items-start gap-12">
          <h2 className="text-Text-headings text-3xl md:text-4xl font-semibold font-['Montserrat'] leading-10 md:leading-[56px]">
            {title}
          </h2>
        </div>

        <div className="w-full flex flex-col gap-10 md:gap-16">
          <div className="w-full flex flex-wrap place-content-evenly  items-start gap-x-8 md:gap-x-16 gap-y-10 md:gap-y-12">
            {firstRow.map((item, index) => (
              <AudienceCard key={`${item.title}-${index}`} item={item} />
            ))}
          </div>

          {/* {secondRow.length > 0 && (
            <div className="w-full flex flex-wrap place-content-evenly items-start gap-x-8 md:gap-x-16 gap-y-10 md:gap-y-12">
              {secondRow.map((item, index) => (
                <AudienceCard key={`${item.title}-${index}`} item={item} />
              ))}
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
}
// frontend-new/src/app/oferta/components/DocumentsBenefitsSection.tsx
import Image from "next/image";

type DocumentsBenefitsItem = {
  image: string;
  title: string;
  alt?: string;
};

type DocumentsBenefitsSectionProps = {
  items?: DocumentsBenefitsItem[];
};

function BenefitCard({ item }: { item: DocumentsBenefitsItem }) {
  return (
    <div className="w-full sm:w-[45%] lg:w-[30%] bg-[#D1D5DC] p-6 md:p-12 flex flex-col gap-8">
      <div className="relative w-full aspect-[368/214] overflow-hidden">
        <Image
          src={item.image}
          alt={item.alt || item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="text-Text-body text-base md:text-xl font-semibold font-['Montserrat'] leading-6">
        {item.title}
      </div>
    </div>
  );
}

export default function DocumentsBenefitsSection({
  items = [],
}: DocumentsBenefitsSectionProps) {
  if (!items.length) return null;

  return (
    <section className="w-full bg-surface-page py-12 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-6 lg:px-0">
        <div className="flex flex-row flex-wrap justify-evenly gap-6">
          {items.map((item, index) => (
            <BenefitCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
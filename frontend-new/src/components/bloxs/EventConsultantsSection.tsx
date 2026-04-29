"use client";

import Image from "next/image";

interface Consultant {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  image?: string | null;
}

interface ConsultantRelation {
  id: number;
  consultants_event_id?: number | null;
  consultants_id: Consultant | number;
}

interface EventConsultantsSectionItem {
  id: number;
  title?: string | null;
  consultants?: ConsultantRelation[];
}

interface EventConsultantsSectionProps {
  item: EventConsultantsSectionItem;
}

function getConsultantName(consultant: Consultant) {
  if (consultant.fullname?.trim()) {
    return consultant.fullname.trim();
  }

  const fullName = `${consultant.name ?? ""} ${consultant.lastname ?? ""}`.trim();
  return fullName || "Konsultant";
}

function getConsultantImage(image?: string | null) {
  if (!image) return null;
  return `/backend/assets/${image}`;
}

export default function EventConsultantsSection({
  item,
}: EventConsultantsSectionProps) {
  const consultants = Array.isArray(item.consultants)
    ? item.consultants
        .map((relation) =>
          typeof relation.consultants_id === "object" &&
          relation.consultants_id !== null
            ? relation.consultants_id
            : null
        )
        .filter((consultant): consultant is Consultant => consultant !== null)
    : [];

  if (consultants.length === 0) return null;

  return (
    <section className="self-stretch py-12 lg:py-20 py-18 px-4 sm:px-6 lg:px-8 xl:px-28">
      <div className="flex flex-col items-start gap-16 ">
        <div className="inline-flex w-full items-center justify-between">
          <h2 className="flex-1 text-3xl font-semibold leading-tight text-black md:text-4xl md:leading-[56px]">
            {item.title?.trim() || "Konsultanci wydarzenia"}
          </h2>
        </div>

        <div className="flex w-full flex-wrap items-start justify-center gap-8">
          {consultants.map((consultant) => {
            const name = getConsultantName(consultant);
            const imageSrc = getConsultantImage(consultant.image);

            return (
              <div
                key={consultant.id}
                className="flex w-full flex-col items-end gap-8 sm:w-[calc(50%-16px)] xl:w-80"
              >
                <div className="relative h-80 w-full overflow-hidden bg-gray-100">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 320px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      Brak zdjęcia
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-col items-start gap-6">
                  <h3 className="w-full text-2xl font-semibold leading-10 text-black md:text-3xl">
                    {name}
                  </h3>

                  <p className="w-full text-lg font-normal leading-6 text-black md:text-xl">
                    {consultant.company?.trim() || "Brak firmy"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
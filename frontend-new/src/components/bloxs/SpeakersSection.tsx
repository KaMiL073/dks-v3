"use client";

import Image from "next/image";

interface Speaker {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  image?: string | null;
  bio?: string | null;
  position?: string | null;
}

interface SpeakerRelation {
  id: number;
  speakers_event_id?: number;
  speakers_id: Speaker | number;
}

interface SpeakersSectionItem {
  id: number;
  title?: string | null;
  speakers?: SpeakerRelation[];
}

interface SpeakersSectionProps {
  item: SpeakersSectionItem;
}

function getSpeakerName(speaker: Speaker) {
  if (speaker.fullname && speaker.fullname.trim()) {
    return speaker.fullname.trim();
  }

  return `${speaker.name ?? ""} ${speaker.lastname ?? ""}`.trim() || "Prelegent";
}

function getSpeakerSubtitle(speaker: Speaker) {
  const position = speaker.position?.replace(/\s+/g, " ").trim();
  const company = speaker.company?.replace(/\s+/g, " ").trim();

  if (position && company) return `${position} | ${company}`;
  if (position) return position;
  if (company) return company;

  return "";
}

function getSpeakerImage(image?: string | null) {
  if (!image) return null;

  return `http://localhost/backend/assets/${image}`;
}

export default function SpeakersSection({ item }: SpeakersSectionProps) {
  const speakers = Array.isArray(item.speakers)
    ? item.speakers
        .map((relation) =>
          typeof relation.speakers_id === "object" && relation.speakers_id !== null
            ? relation.speakers_id
            : null
        )
        .filter((speaker): speaker is Speaker => speaker !== null)
    : [];

  if (speakers.length === 0) return null;

  return (
    <section className="self-stretch py-12 lg:py-20">
      <div className="flex max-w-7xl flex-col items-start gap-16">
        <div className="inline-flex w-full items-center justify-between">
          <h2 className="flex-1 text-3xl font-semibold leading-tight text-black md:text-4xl md:leading-[56px]">
            {item.title?.trim() || "Prelegenci"}
          </h2>
        </div>

        <div className="flex w-full flex-col items-start gap-12">
          {speakers.map((speaker) => {
            const name = getSpeakerName(speaker);
            const subtitle = getSpeakerSubtitle(speaker);
            const imageSrc = getSpeakerImage(speaker.image);

            return (
              <div
                key={speaker.id}
                className="flex w-full flex-col items-start gap-6 md:flex-row md:gap-12"
              >
                <div className="relative h-64 w-full max-w-64 shrink-0 overflow-hidden bg-gray-100">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 256px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                      Brak zdjęcia
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col items-start gap-8">
                  <div className="flex w-full flex-col items-start gap-4">
                    <h3 className="w-full text-2xl font-semibold leading-10 text-black md:text-3xl">
                      {name}
                    </h3>

                    {subtitle ? (
                      <p className="w-full text-lg font-semibold leading-6 text-black md:text-xl">
                        {subtitle}
                      </p>
                    ) : null}
                  </div>

                  {speaker.bio ? (
                    <div className="inline-flex max-h-40 w-full items-center justify-center gap-2.5">
                      <p className="flex-1 overflow-hidden text-base font-normal leading-6 text-black md:h-40 md:text-xl">
                        {speaker.bio.replace(/\s+/g, " ").trim()}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
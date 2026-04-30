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
  if (speaker.fullname?.trim()) return speaker.fullname.trim();

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

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image.replace("http://localhost/backend", "https://dks.pl/backend");
  }

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "https://dks.pl/backend";

  return `${backendUrl.replace(/\/$/, "")}/assets/${image}`;
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
    <section className="w-full py-12 lg:py-20 py-18 px-4 sm:px-6 lg:px-8 xl:px-28">
      <div className="flex w-full flex-col items-start gap-12 px-4 lg:gap-16">
        <h2 className="w-full text-3xl font-semibold leading-tight text-black md:text-4xl md:leading-[56px]">
          {item.title?.trim() || "Prelegenci"}
        </h2>

        <div className="flex w-full flex-col gap-12">
          {speakers.map((speaker) => {
            const name = getSpeakerName(speaker);
            const subtitle = getSpeakerSubtitle(speaker);
            const imageSrc = getSpeakerImage(speaker.image);

            return (
              <article
                key={speaker.id}
                className="flex w-full flex-col gap-6 md:flex-row md:gap-12"
              >
                <div className="relative h-64 w-full max-w-64 shrink-0 overflow-hidden bg-gray-100 max-sm:max-w-full">
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

                <div className="flex min-w-0 flex-1 flex-col gap-5 md:gap-8">
                  <div className="flex flex-col gap-3 md:gap-4">
                    <h3 className="text-2xl font-semibold leading-tight text-black md:text-3xl md:leading-10">
                      {name}
                    </h3>

                    {subtitle ? (
                      <p className="text-base font-semibold leading-6 text-black md:text-xl">
                        {subtitle}
                      </p>
                    ) : null}
                  </div>

                  {speaker.bio ? (
                    <p className="text-base font-normal leading-7 text-black md:text-xl md:leading-8">
                      {speaker.bio.replace(/\s+/g, " ").trim()}
                    </p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
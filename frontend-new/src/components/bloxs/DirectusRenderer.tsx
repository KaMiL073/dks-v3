"use client";

import HeroSection from "./HeroSection";
import RichContentBlock from "./RichContent";
import LogosSection from "./Logos";
import AgendaSection from "./AgendaSection";
import SpeakersSection from "./SpeakersSection";
import EventConsultantsSection from "./EventConsultantsSection";
import KeyInfo from "./KeyInfo";

interface DirectusLogoItem {
  id: number;
  logos_id?: number | null;
  directus_files_id: string;
}

interface DirectusSpeaker {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  image?: string | null;
  bio?: string | null;
  position?: string | null;
}

interface DirectusSpeakerRelation {
  id: number;
  speakers_event_id?: number;
  speakers_id: DirectusSpeaker | number;
}

interface DirectusConsultant {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  image?: string | null;
  bio?: string | null;
  position?: string | null;
}

interface DirectusConsultantRelation {
  id: number;
  consultants_event_id?: number;
  consultants_id: DirectusConsultant | number;
}

interface DirectusKeyInfoItem {
  id?: number | string | null;
  key?: string | null;
  value?: string | null;
}

interface DirectusBlockItem {
  id: string | number;

  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  text_button?: string | null;
  url_button?: string | null;
  image?: string | null;
  layout?: string | null;

  name?: string | null;
  description?: string | null;

  logo?: DirectusLogoItem[];

  speakers?: unknown[];
  consultants?: unknown[];
  collection?: unknown[];

  item?: DirectusKeyInfoItem[];
  items?: DirectusKeyInfoItem[];
  key_value?: DirectusKeyInfoItem[];
  info?: DirectusKeyInfoItem[];

  [key: string]: unknown;
}

interface DirectusBlock {
  collection: string;
  item: DirectusBlockItem | null;
}

interface Product {
  description?: string;
}

type RichLayout = "text_left" | "text_right";

function normalizeLayout(value: unknown): RichLayout | undefined {
  return value === "text_left" || value === "text_right" ? value : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeSpeaker(value: unknown): DirectusSpeaker {
  const speaker = isObject(value) ? value : {};

  return {
    id: Number(speaker.id ?? 0),
    name: typeof speaker.name === "string" ? speaker.name : undefined,
    lastname: typeof speaker.lastname === "string" ? speaker.lastname : undefined,
    fullname: typeof speaker.fullname === "string" ? speaker.fullname : undefined,
    company: typeof speaker.company === "string" ? speaker.company : undefined,
    image: typeof speaker.image === "string" ? speaker.image : undefined,
    bio: typeof speaker.bio === "string" ? speaker.bio : undefined,
    position: typeof speaker.position === "string" ? speaker.position : undefined,
  };
}

function normalizeConsultant(value: unknown): DirectusConsultant {
  const consultant = isObject(value) ? value : {};

  return {
    id: Number(consultant.id ?? 0),
    name: typeof consultant.name === "string" ? consultant.name : undefined,
    lastname:
      typeof consultant.lastname === "string" ? consultant.lastname : undefined,
    fullname:
      typeof consultant.fullname === "string" ? consultant.fullname : undefined,
    company:
      typeof consultant.company === "string" ? consultant.company : undefined,
    image: typeof consultant.image === "string" ? consultant.image : undefined,
    bio: typeof consultant.bio === "string" ? consultant.bio : undefined,
    position:
      typeof consultant.position === "string" ? consultant.position : undefined,
  };
}

function normalizeSpeakerRelation(value: unknown): DirectusSpeakerRelation | null {
  if (!isObject(value)) return null;

  return {
    id: Number(value.id ?? 0),
    speakers_event_id:
      typeof value.speakers_event_id === "number"
        ? value.speakers_event_id
        : undefined,
    speakers_id:
      typeof value.speakers_id === "number"
        ? value.speakers_id
        : normalizeSpeaker(value.speakers_id),
  };
}

function normalizeConsultantRelation(
  value: unknown
): DirectusConsultantRelation | null {
  if (!isObject(value)) return null;

  return {
    id: Number(value.id ?? 0),
    consultants_event_id:
      typeof value.consultants_event_id === "number"
        ? value.consultants_event_id
        : undefined,
    consultants_id:
      typeof value.consultants_id === "number"
        ? value.consultants_id
        : normalizeConsultant(value.consultants_id),
  };
}

export default function DirectusRenderer({
  components,
  product,
}: {
  components: DirectusBlock[];
  product?: Product;
}) {
  if (!components || components.length === 0) {
    return (
      <section className="prose mx-auto my-12">
        <div dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
      </section>
    );
  }

  return (
    <>
      {components.map((block, index) => {
        const { collection, item } = block;

        if (!collection || !item) return null;

        switch (collection.trim()) {
          case "component_hero_section":
            return (
              <HeroSection
                key={`hero-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title: typeof item.title === "string" ? item.title : undefined,
                  subtitle:
                    typeof item.subtitle === "string"
                      ? item.subtitle
                      : undefined,
                  content:
                    typeof item.content === "string" ? item.content : undefined,
                  text_button:
                    typeof item.text_button === "string"
                      ? item.text_button
                      : undefined,
                  url_button:
                    typeof item.url_button === "string"
                      ? item.url_button
                      : undefined,
                  image: typeof item.image === "string" ? item.image : undefined,
                }}
              />
            );

          case "rich_content":
            return (
              <RichContentBlock
                key={`rich-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title: typeof item.title === "string" ? item.title : undefined,
                  subtitle:
                    typeof item.subtitle === "string"
                      ? item.subtitle
                      : undefined,
                  content:
                    typeof item.content === "string" ? item.content : undefined,
                  text_button:
                    typeof item.text_button === "string"
                      ? item.text_button
                      : undefined,
                  url_button:
                    typeof item.url_button === "string"
                      ? item.url_button
                      : undefined,
                  image: typeof item.image === "string" ? item.image : undefined,
                  layout: normalizeLayout(item.layout),
                }}
              />
            );

          case "logos":
            return (
              <LogosSection
                key={`logos-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  name: typeof item.name === "string" ? item.name : "",
                  description:
                    typeof item.description === "string"
                      ? item.description
                      : "",
                  logo: Array.isArray(item.logo)
                    ? item.logo.map((logoItem) => ({
                        id: Number(logoItem.id),
                        logos_id:
                          typeof logoItem.logos_id === "number"
                            ? logoItem.logos_id
                            : undefined,
                        directus_files_id: logoItem.directus_files_id,
                      }))
                    : [],
                }}
              />
            );

          case "agenda_event":
            return (
              <AgendaSection
                key={`agenda-${item.id}-${index}`}
                item={item as never}
              />
            );

          case "speakers_event": {
            const speakers = Array.isArray(item.speakers)
              ? item.speakers
                  .map(normalizeSpeakerRelation)
                  .filter(
                    (speaker): speaker is DirectusSpeakerRelation =>
                      speaker !== null
                  )
              : [];

            return (
              <SpeakersSection
                key={`speakers-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title:
                    typeof item.title === "string" ? item.title : "Prelegenci",
                  speakers,
                }}
              />
            );
          }

          case "consultants_event": {
            const rawConsultants = Array.isArray(item.consultants)
              ? item.consultants
              : Array.isArray(item.collection)
                ? item.collection
                : [];

            const consultants = rawConsultants
              .map(normalizeConsultantRelation)
              .filter(
                (consultant): consultant is DirectusConsultantRelation =>
                  consultant !== null
              );

            return (
              <EventConsultantsSection
                key={`consultants-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title:
                    typeof item.title === "string"
                      ? item.title
                      : "Konsultanci wydarzenia",
                  consultants,
                }}
              />
            );
          }

          case "keyinfo": {
            const keyInfoItems = Array.isArray(item.item)
              ? item.item
              : Array.isArray(item.items)
                ? item.items
                : Array.isArray(item.key_value)
                  ? item.key_value
                  : Array.isArray(item.info)
                    ? item.info
                    : [];

            return (
              <KeyInfo
                key={`keyinfo-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title:
                    typeof item.title === "string"
                      ? item.title
                      : typeof item.name === "string"
                        ? item.name
                        : undefined,
                  items: keyInfoItems.map((infoItem) => ({
                    id: infoItem.id,
                    key: typeof infoItem.key === "string" ? infoItem.key : "",
                    value:
                      typeof infoItem.value === "string" ? infoItem.value : "",
                  })),
                }}
              />
            );
          }

          default:
            return (
              <section
                key={`unknown-${index}`}
                className="rounded-lg bg-yellow-100 p-4 text-yellow-800"
              >
                <p>Nieznany blok: {collection}</p>
              </section>
            );
        }
      })}
    </>
  );
}
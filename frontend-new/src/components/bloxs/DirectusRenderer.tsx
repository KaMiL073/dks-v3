"use client";

import EventHero from "./EventHero";
import HeroSection from "./HeroSection";
import RichContentBlock from "./RichContent";
import LogosSection from "./Logos";
import AgendaSection from "./AgendaSection";
import SpeakersSection from "./SpeakersSection";
import EventConsultantsSection from "./EventConsultantsSection";
import KeyInfo from "./KeyInfo";

import type { ComponentEventItem } from "@/lib/eventsCreate";

type Product = {
  description?: string;
};

type RendererItem = ComponentEventItem & {
  [key: string]: unknown;
};

type RendererComponent = {
  id?: number | string;
  sort?: number | string | null;
  events_create_id?: number | string | null;
  collection: string;
  item: RendererItem | null;
};

type RichLayout = "text_left" | "text_right";

function normalizeLayout(value: unknown): RichLayout | undefined {
  return value === "text_left" || value === "text_right" ? value : undefined;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getSortValue(block: RendererComponent) {
  const blockSort =
    typeof block.sort === "number"
      ? block.sort
      : typeof block.sort === "string"
        ? Number(block.sort)
        : null;

  if (typeof blockSort === "number" && Number.isFinite(blockSort)) {
    return blockSort;
  }

  const itemSort =
    typeof block.item?.sort === "number"
      ? block.item.sort
      : typeof block.item?.sort === "string"
        ? Number(block.item.sort)
        : null;

  if (typeof itemSort === "number" && Number.isFinite(itemSort)) {
    return itemSort;
  }

  return Number.MAX_SAFE_INTEGER;
}

function normalizeSpeaker(value: unknown) {
  const speaker = isObject(value) ? value : {};

  return {
    id: Number(speaker.id ?? 0),
    name: asString(speaker.name),
    lastname: asString(speaker.lastname),
    fullname: asString(speaker.fullname),
    company: asString(speaker.company),
    image: asString(speaker.image),
    bio: asString(speaker.bio),
    position: asString(speaker.position),
  };
}

function normalizeSpeakerRelation(value: unknown) {
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

function normalizeConsultant(value: unknown) {
  const consultant = isObject(value) ? value : {};

  return {
    id: Number(consultant.id ?? 0),
    name: asString(consultant.name),
    lastname: asString(consultant.lastname),
    fullname: asString(consultant.fullname),
    company: asString(consultant.company),
    image: asString(consultant.image),
    bio: asString(consultant.bio),
    position: asString(consultant.position),
  };
}

function normalizeConsultantRelation(value: unknown) {
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
  components: RendererComponent[];
  product?: Product;
}) {
  if (!components || components.length === 0) {
    return (
      <section className="prose mx-auto my-12">
        <div dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
      </section>
    );
  }

  const sortedComponents = [...components].sort((a, b) => {
    const sortA = getSortValue(a);
    const sortB = getSortValue(b);

    if (sortA !== sortB) return sortA - sortB;

    return Number(a.id ?? 0) - Number(b.id ?? 0);
  });

  return (
    <>
      {sortedComponents.map((block, index) => {
        const { collection, item } = block;

        if (!collection || !item) return null;

        const collectionName = collection.trim();

        switch (collectionName) {
          case "hero_section":
            return (
              <EventHero
                key={`event-hero-${item.id}-${index}`}
                title={asString(item.title)}
                subtitle={asString(item.subtitle)}
                buttonLabel={
                  asString(item.button_label) ?? asString(item.text_button)
                }
                buttonUrl={asString(item.button_url) ?? asString(item.url_button)}
                image={asString(item.image)}
                backgroundImage={asString(item.background_image)}
                variant={
                  item.variant === "boxed-image" || item.variant === "full-height"
                    ? item.variant
                    : "full-height"
                }
                contentPosition={
                  item.content_position === "right" ? "right" : "left"
                }
                imageVerticalAlign={
                  item.image_vertical_align === "bottom" ? "bottom" : "center"
                }
                imageFit={item.image_fit === "cover" ? "cover" : "contain"}
              />
            );

          case "component_hero_section":
            return (
              <HeroSection
                key={`hero-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title: asString(item.title),
                  subtitle: asString(item.subtitle),
                  content: asString(item.content),
                  text_button: asString(item.text_button),
                  url_button: asString(item.url_button),
                  image: asString(item.image),
                }}
              />
            );

          case "rich_content":
            return (
              <RichContentBlock
                key={`rich-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title: asString(item.title),
                  subtitle: asString(item.subtitle),
                  content: asString(item.content),
                  text_button: asString(item.text_button),
                  url_button: asString(item.url_button),
                  image: asString(item.image),
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
                  name: asString(item.name) ?? "",
                  description: asString(item.description) ?? "",
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
                  .filter((speaker) => speaker !== null)
              : [];

            return (
              <SpeakersSection
                key={`speakers-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title: asString(item.title) ?? "Prelegenci",
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
              .filter((consultant) => consultant !== null);

            return (
              <EventConsultantsSection
                key={`consultants-${item.id}-${index}`}
                item={{
                  id: Number(item.id),
                  title: asString(item.title) ?? "Konsultanci wydarzenia",
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
                  title: asString(item.title) ?? asString(item.name),
                  items: keyInfoItems.map((infoItem) => ({
                    id: infoItem.id,
                    key: asString(infoItem.key) ?? "",
                    value: asString(infoItem.value) ?? "",
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
                <p>Nieznany blok: {collectionName}</p>
              </section>
            );
        }
      })}
    </>
  );
}
import { readItems } from "@directus/sdk";
import { directus } from "./directus";

export type SpeakerPerson = {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  image?: string | null;
  bio?: string | null;
  position?: string | null;
  sort?: number | null;
  speakers_id?: number | null;
  agenda_id?: number | null;
};

export type SpeakerRelation = {
  id: number;
  speakers_event_id?: number | null;
  speakers_id: SpeakerPerson | number;
};

export type ConsultantPerson = {
  id: number;
  name?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  company?: string | null;
  image?: string | null;
  bio?: string | null;
  position?: string | null;
  sort?: number | null;
};

export type ConsultantRelation = {
  id: number;
  consultants_event_id?: number | null;
  consultants_id: ConsultantPerson | number;
};

export type AgendaSpeaker = SpeakerPerson;

export type AgendaItem = {
  id: number;
  sort?: number | null;
  name?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  events_create_id?: number | null;
  icon?: string | null;
  speakers?: AgendaSpeaker[];
};

export type AgendaEntry = {
  id: number;
  agenda_event_id?: number | null;
  agenda_id?: AgendaItem | number | null;
};

export type LogoItem = {
  id: number;
  logos_id?: number | null;
  directus_files_id: string;
};

export type ComponentEventItem = {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  content?: string | null;
  text_button?: string | null;
  url_button?: string | null;
  image?: string | null;
  header_type?: string | null;
  heading_styles?: string | null;
  subtitle_type?: string | null;
  subtitle_styles?: string | null;
  layout?: string | null;

  name?: string | null;
  description?: string | null;
  data?: string | null;

  logo?: LogoItem[];
  agenda?: AgendaEntry[];
  speakers?: SpeakerRelation[];

  // consultants_event aktualnie zwraca pole "collection"
  collection?: ConsultantRelation[];

  [key: string]: unknown;
};

export type ComponentEvent = {
  id: number;
  events_create_id: number;
  collection: string;
  item: ComponentEventItem | null;
};

export type EventCreateItem = {
  id: number;
  status: string;
  user_created: string | null;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  name: string;
  slug: string;
  image_email: string | null;
  image: string | null;
  image_mobile: string | null;
  ogimage: string | null;
  events_create_id: number | null;
  type: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  lead: string | null;
  speakers: unknown[];
  components_event: ComponentEvent[];
};

const eventFields = [
  "id",
  "status",
  "user_created",
  "date_created",
  "user_updated",
  "date_updated",
  "name",
  "slug",
  "image_email",
  "image",
  "image_mobile",
  "ogimage",
  "events_create_id",
  "type",
  "start_date",
  "end_date",
  "location",
  "lead",
  "speakers",
  "components_event.*",
  "components_event.item.*",
  "components_event.item.logo.*",
  "components_event.item.agenda.*",
  "components_event.item.agenda.agenda_id.*",
  "components_event.item.agenda.agenda_id.speakers.*",
  "components_event.item.speakers.*",
  "components_event.item.speakers.speakers_id.*",

  // consultants_event ma teraz pole "collection"
  "components_event.item.collection.*",
  "components_event.item.collection.consultants_id.*",
] as const;

function normalizeItems<T>(response: unknown): T[] {
  if (Array.isArray(response)) {
    return response as T[];
  }

  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    Array.isArray((response as { data?: unknown }).data)
  ) {
    return (response as { data: T[] }).data;
  }

  return [];
}

function getReadableError(error: unknown): Error {
  if (error instanceof Error) return error;

  if (typeof error === "object" && error !== null) {
    const maybeMessage =
      "message" in error && typeof error.message === "string"
        ? error.message
        : "Nieznany błąd Directusa";

    return new Error(maybeMessage);
  }

  return new Error("Nieznany błąd Directusa");
}

export async function getEventsCreate() {
  try {
    const response = await directus.request(
      readItems("events_create", {
        fields: [...eventFields],
        filter: {
          status: {
            _eq: "published",
          },
        },
        sort: ["-date_created"],
        limit: -1,
      })
    );

    return normalizeItems<EventCreateItem>(response);
  } catch (error) {
    console.error("getEventsCreate error:", error);
    throw getReadableError(error);
  }
}

export async function getEventsCreateSlugs() {
  try {
    const response = await directus.request(
      readItems("events_create", {
        fields: ["slug"],
        filter: {
          status: {
            _eq: "published",
          },
        },
        limit: -1,
      })
    );

    return normalizeItems<{ slug: string }>(response);
  } catch (error) {
    console.error("getEventsCreateSlugs error:", error);
    throw getReadableError(error);
  }
}

export async function getEventCreateBySlug(slug: string) {
  try {
    const response = await directus.request(
      readItems("events_create", {
        fields: [...eventFields],
        filter: {
          status: {
            _eq: "published",
          },
          slug: {
            _eq: slug,
          },
        },
        limit: 1,
      })
    );

    const items = normalizeItems<EventCreateItem>(response);

    return items[0] ?? null;
  } catch (error) {
    console.error("getEventCreateBySlug error:", error);
    throw getReadableError(error);
  }
}
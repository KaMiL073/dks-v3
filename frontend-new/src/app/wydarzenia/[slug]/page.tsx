import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getEventHeroTitle,
  getEventCreateBySlug,
  getEventsCreateSlugs,
} from "@/lib/eventsCreate";
import { getFields } from "@/lib/fields";

import Breadcrumb from "@/app/oferta/components/Breadcrumb";
import DirectusRenderer from "@/components/bloxs/DirectusRenderer";
import EventRegistrationForm from "./EventRegistrationForm";
import { absoluteTitle } from "@/lib/seo";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateStaticParams() {
  try {
    const items = await getEventsCreateSlugs();

    return items.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error("getEventsCreateSlugs error:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const event = await getEventCreateBySlug(slug);

    if (!event) {
      return {
        title: "Wydarzenie | DKS",
      };
    }

    const path = `/wydarzenia/${slug}`;
    const eventTitle = getEventHeroTitle(event) || event.name;
    const title = event.seo_title?.trim() || eventTitle;
    const description = event.lead || "Wydarzenie DKS";

    return {
      title: absoluteTitle(title),
      description,
      openGraph: {
        title,
        description,
        url: path,
        siteName: "DKS",
        locale: "pl_PL",
        type: "website",
      },
      twitter: {
        card: "summary",
        title,
        description,
      },
      alternates: {
        canonical: path,
      },
    };
  } catch {
    return {
      title: "Wydarzenie | DKS",
    };
  }
}

export default async function EventSinglePage({ params }: PageProps) {
  const { slug } = await params;

  let event: Awaited<ReturnType<typeof getEventCreateBySlug>> | null = null;

  try {
    event = await getEventCreateBySlug(slug);
  } catch (error) {
    console.error("getEventCreateBySlug error:", error);
    notFound();
  }

  if (!event) {
    notFound();
  }

  const components = Array.isArray(event.components_event)
    ? event.components_event
    : [];
  const eventTitle = getEventHeroTitle(event) || event.name;

  let fields: Awaited<ReturnType<typeof getFields>> = [];

  try {
    fields = await getFields("events");
  } catch (error) {
    console.error("getFields events error:", error);
  }

  return (
    <main>
      <Breadcrumb />

      {components.length > 0 ? (
        <DirectusRenderer components={components} />
      ) : event.lead ? (
        <section className="bg-white px-4 py-20 md:px-6 lg:px-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <h1 className="text-4xl font-semibold text-neutral-900">
              {eventTitle}
            </h1>
            <p>{event.lead}</p>
          </div>
        </section>
      ) : (
        <section className="bg-white px-4 py-20 md:px-6 lg:px-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">
            <h1 className="text-4xl font-semibold text-neutral-900">
              {eventTitle}
            </h1>
            <p className="text-gray-500">Brak opisu wydarzenia.</p>
          </div>
        </section>
      )}

      <EventRegistrationForm fields={fields} eventSlug={slug} />
    </main>
  );
}

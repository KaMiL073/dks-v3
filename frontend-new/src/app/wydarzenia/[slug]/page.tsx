import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getEventCreateBySlug,
  getEventsCreateSlugs,
} from "@/lib/eventsCreate";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";
import DirectusRenderer from "@/components/bloxs/DirectusRenderer";
import EventHero from "@/components/bloxs/EventHero";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

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

    return {
      title: event.name,
      description: event.lead ?? "Wydarzenie DKS",
      openGraph: {
        title: event.name,
        description: event.lead ?? "Wydarzenie DKS",
      },
    };
  } catch {
    return {
      title: "Wydarzenie | DKS",
      description: "Wydarzenie DKS",
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

  return (
    <main>
      <Breadcrumb />

      <EventHero
        title={event.name}
        subtitle={event.lead}
        image={event.image}
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
      />

      <section className="bg-white px-4 py-8 md:px-6">
        <div className="inline-flex w-full flex-col items-start justify-start gap-12 overflow-hidden bg-white px-4 py-20 lg:px-6 2xl:px-20">
          <div className="prose max-w-none leading-relaxed text-gray-700">
            {components.length > 0 ? (
              <DirectusRenderer components={components} />
            ) : event.lead ? (
              <div className="rich-content">
                <p>{event.lead}</p>
              </div>
            ) : (
              <p className="text-lg text-gray-500">
                Brak opisu dla tego wydarzenia.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
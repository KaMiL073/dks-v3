import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getEventCreateBySlug,
  getEventsCreateSlugs,
} from "@/lib/eventsCreate";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";
import DirectusRenderer from "@/components/bloxs/DirectusRenderer";

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

      {components.length > 0 ? (
        <DirectusRenderer components={components} />
      ) : event.lead ? (
        <section className="bg-white px-4 py-20 md:px-6 lg:px-28">
          <div className="rich-content mx-auto max-w-7xl">
            <p>{event.lead}</p>
          </div>
        </section>
      ) : (
        <section className="bg-white px-4 py-20 md:px-6 lg:px-28">
          <p className="mx-auto max-w-7xl text-lg text-gray-500">
            Brak opisu dla tego wydarzenia.
          </p>
        </section>
      )}
    </main>
  );
}
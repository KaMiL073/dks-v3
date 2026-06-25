import type { Metadata } from "next";
import Link from "next/link";

import HeroSection from "@/app/(marketing)/HeroSection";
import {
  getEventHeroTitle,
  getEventsCreate,
  type EventCreateItem,
} from "@/lib/eventsCreate";
import { getOfferPageDescription, mergeOfferPageDescription } from "@/lib/pages";
import { absoluteTitle } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const desc = mergeOfferPageDescription(
    await getOfferPageDescription(["wydarzenia", "/wydarzenia"]),
    {
      seoTitle: "Wydarzenia | DKS",
      seoDescription: "Sprawdź aktualne wydarzenia DKS.",
    }
  );

  const title = desc?.seoTitle || "Wydarzenia | DKS";
  const description = desc?.seoDescription || "Sprawdź aktualne wydarzenia DKS.";

  return {
    title: absoluteTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: "/wydarzenia",
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
      canonical: "/wydarzenia",
    },
  };
}

function getEventImage(image?: string | null) {
  if (!image) return null;
  return `/backend/assets/${image}`;
}

export default async function EventsPage() {
  let events: EventCreateItem[] = [];
  const desc = await getOfferPageDescription(["wydarzenia", "/wydarzenia"]);
  const heading = desc?.title || "Wydarzenia";

  try {
    events = await getEventsCreate();
  } catch (error) {
    console.error("EventsPage getEventsCreate error:", error);
  }

  return (
    <main>
      <HeroSection
        title={heading}
        backgroundImage="/static/homepage/Header.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        variant="full-height"
      />

      <section className="w-full px-6 py-12 md:px-12 lg:px-28 lg:py-20">
        <div className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const imageUrl = getEventImage(event.image);
            const eventTitle = getEventHeroTitle(event) || event.name;

            return (
              <Link
                key={event.id}
                href={`/wydarzenia/${event.slug}`}
                className="group flex h-[520px] w-full flex-col"
              >
                <div className="relative h-80 w-full overflow-hidden bg-gray-200">
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl}
                      alt={eventTitle}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-6 pt-8">
                  <h2 className="line-clamp-2 text-3xl font-semibold leading-10 text-neutral-900">
                    {eventTitle}
                  </h2>

                  {event.lead && (
                    <p className="line-clamp-3 text-xl leading-7 text-black">
                      {event.lead}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

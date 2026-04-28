import Link from "next/link";

import HeroSection from "@/app/(marketing)/HeroSection";
import { getEventsCreate, type EventCreateItem } from "@/lib/eventsCreate";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getEventImage(image?: string | null) {
  if (!image) return null;
  return `/backend/assets/${image}`;
}

export default async function EventsPage() {
  let events: EventCreateItem[] = [];

  try {
    events = await getEventsCreate();
  } catch (error) {
    console.error("EventsPage getEventsCreate error:", error);
  }

  return (
    <main>
      <HeroSection
        title="Wydarzenia"
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
                      alt={event.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-6 pt-8">
                  <h2 className="line-clamp-2 text-3xl font-semibold leading-10 text-neutral-900">
                    {event.name}
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
"use client";

import Image from "next/image";

export type ContentCardItem = {
  id?: number | string | null;
  title?: string | null;
  description?: string | null;
  image?: string | null;
};

export type ContentCardsSection = {
  id?: number | string | null;
  title?: string | null;
  items?: ContentCardItem[];
};

function getImageUrl(image?: string | null) {
  if (!image?.trim()) return null;

  const cleanImage = image.trim();

  if (cleanImage.startsWith("http")) return cleanImage;
  if (cleanImage.startsWith("/")) return cleanImage;

  return `/backend/assets/${cleanImage}`;
}

export default function ContentCards({
  item,
}: {
  item: ContentCardsSection;
}) {
  const items = Array.isArray(item.items) ? item.items : [];

  if (items.length === 0) return null;

  return (
    <section className="px-4 py-12 sm:px-6 md:py-20 lg:px-8 xl:px-28">
      <div className="flex flex-col gap-12">
        {item.title ? (
          <h2 className="text-4xl font-semibold leading-[48px] text-Text-headings">
            {item.title}
          </h2>
        ) : null}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {items.map((card, index) => {
            const imageUrl = getImageUrl(card.image);

            return (
              <div
                key={`${card.id ?? card.title ?? "card"}-${index}`}
                className="flex min-h-[520px] flex-col gap-8 bg-gray-300 p-12"
              >
                {imageUrl ? (
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={imageUrl}
                      alt={card.title || "Card image"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : null}

                {card.title ? (
                  <h3 className="text-3xl font-semibold leading-10 text-Text-headings">
                    {card.title}
                  </h3>
                ) : null}

                {card.description ? (
                  <div
                    className="text-base leading-7 text-Text-body"
                    dangerouslySetInnerHTML={{
                      __html: card.description,
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import { getPromotions, type PromotionItem } from "@/lib/promotions";

function getHeroImage(promo: PromotionItem) {
  const components = Array.isArray(promo.components_promotions)
    ? promo.components_promotions
    : [];

  const hero = components.find(
    (component) => component.collection === "hero_section"
  );

  if (!hero?.item) return null;

  const image = hero.item.image;
  const backgroundImage = hero.item.background_image;

  if (typeof image === "string" && image.trim()) return image;
  if (typeof backgroundImage === "string" && backgroundImage.trim()) {
    return backgroundImage;
  }

  return null;
}

function getImageUrl(image?: string | null) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image.replace("http://localhost/backend", "https://dks.pl/backend");
  }

  return `/backend/assets/${image}`;
}

export default async function PromotionsPage() {
  const promotions = await getPromotions();

  return (
    <main className="px-6 py-20 lg:px-28">
      <h1 className="mb-12 text-4xl font-semibold">Promocje</h1>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promo) => {
          const imageUrl = getImageUrl(getHeroImage(promo));

          return (
            <Link
              key={promo.id}
              href={`/promocje/${promo.slug}`}
              className="group flex h-[520px] flex-col bg-gray-200 transition hover:opacity-80"
            >
              <div className="h-80 w-full overflow-hidden bg-gray-300">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt={promo.name ?? "Promocja"}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-500">
                    Brak obrazka
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-4 p-6">
                <h2 className="text-2xl font-semibold">{promo.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
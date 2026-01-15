"use client";

import { setAttr } from "@/lib/visual-editor";

/** Typ dla danych bloku hero z Directusa */
interface HeroSectionItem {
  id: string | number;
  title?: string;
  [key: string]: unknown; // pozwala na dodatkowe pola
}

export default function HeroSection({ item }: { item: HeroSectionItem }) {
  return (
    <section
      className="relative flex flex-col justify-center items-center text-center py-24 bg-gray-100 rounded-2xl mb-16"
      data-directus={setAttr({
        collection: "component_hero_section",
        item: item.id,
        fields: "title",
        mode: "popover",
      })}
    >
      <h1 className="text-5xl font-bold text-gray-900">
        {item.title || "Brak tytułu"}
      </h1>
    </section>
  );
}
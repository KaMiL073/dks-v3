"use client";

import { setAttr } from "@/lib/visual-editor";

/** 🔹 Typ pojedynczego elementu Directus */
interface DirectusItem {
  id: string | number;
  title?: string;
  subtitle?: string;
  content?: string;
  text_button?: string;
  url_button?: string;
}

/** 🔹 Typ relacji M2A (many-to-any) */
interface DirectusBlock {
  collection: string;
  item: DirectusItem;
}

export default function DirectusRenderer({ components }: { components: DirectusBlock[] }) {
  if (!components || components.length === 0) return null;

  return (
    <>
      {components.map((block, index) => {
        const { collection, item } = block;
        if (!collection || !item) return null;

        console.log("🧩 Renderuję blok:", collection, item);

        // 🧱 1. HERO SECTION
        if (collection === "component_hero_section") {
          return (
            <section
              key={`hero-${item.id}-${index}`}
              className="relative flex flex-col justify-center items-center text-center py-24 bg-gray-100 rounded-2xl mb-16"
              data-directus={setAttr({
                collection,
                item: item.id,
                fields: "title",
                mode: "popover",
              })}
            >
              <h1 className="text-5xl font-bold text-gray-900 font-['Montserrat']">
                {item.title || "Brak tytułu"}
              </h1>
            </section>
          );
        }

        // 🧱 2. RICH CONTENT
        if (collection === "rich_content") {
          return (
            <section
              key={`rich-${item.id}-${index}`}
              className="my-16 p-10 bg-white rounded-xl shadow-sm border border-gray-100"
            >
              {item.title && (
                <h2
                  className="text-3xl font-semibold mb-4 text-Text-headings font-['Montserrat']"
                  data-directus={setAttr({
                    collection,
                    item: item.id,
                    fields: "title",
                    mode: "popover",
                  })}
                >
                  {item.title}
                </h2>
              )}

              {item.subtitle && (
                <h3
                  className="text-xl text-gray-600 mb-6 font-['Montserrat']"
                  data-directus={setAttr({
                    collection,
                    item: item.id,
                    fields: "subtitle",
                    mode: "popover",
                  })}
                >
                  {item.subtitle}
                </h3>
              )}

              {item.content && (
                <div
                  className="rich-content"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                  data-directus={setAttr({
                    collection,
                    item: item.id,
                    fields: "content",
                    mode: "modal",
                  })}
                />
              )}

              {item.text_button && (
                <a
                  href={item.url_button || "#"}
                  className="inline-block mt-8 px-6 py-3 bg-[#E4002B] text-white text-lg font-semibold rounded-lg hover:bg-red-600 transition"
                  data-directus={setAttr({
                    collection,
                    item: item.id,
                    fields: "text_button,url_button",
                    mode: "drawer",
                  })}
                >
                  {item.text_button}
                </a>
              )}
            </section>
          );
        }

        // 🧱 3. Fallback dla nieznanego typu
        return (
          <section
            key={`unknown-${collection}-${item.id}-${index}`}
            className="my-8 p-6 bg-yellow-50 border border-yellow-300 rounded-lg"
          >
            <p className="text-yellow-800">
              ⚠️ Nieznany blok: <strong>{collection}</strong>
            </p>
          </section>
        );
      })}
    </>
  );
}
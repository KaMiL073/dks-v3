/* frontend-new/src/components/bloxs/DirectusRenderer.tsx */
"use client";

import HeroSection from "./HeroSection";
import RichContentBlock from "./RichContent";

/** 🔹 Typ pojedynczego elementu Directus */
interface DirectusItem {
  id: string | number;
  title?: string;
  subtitle?: string;
  content?: string;
  text_button?: string;
  url_button?: string;
  image?: string;
  layout?: string; // Directus: dowolny string
  [key: string]: unknown;
}

/** 🔹 Typ komponentu M2A (many-to-any) */
interface DirectusBlock {
  collection: string;
  item: DirectusItem;
}

/** 🔹 Typ produktu — minimalny */
interface Product {
  description?: string;
}

/** ✅ zawężamy layout do tego co obsługuje RichContent */
type RichLayout = "text_left" | "text_right";
function normalizeLayout(v: unknown): RichLayout | undefined {
  return v === "text_left" || v === "text_right" ? v : undefined;
}

export default function DirectusRenderer({
  components,
  product,
}: {
  components: DirectusBlock[];
  product?: Product;
}) {
  if (!components || components.length === 0) {
    return (
      <section className="prose mx-auto my-12">
        <div dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
      </section>
    );
  }

  return (
    <>
      {components.map((block, index) => {
        const { collection, item } = block;
        if (!collection || !item) return null;

        switch (collection.trim()) {
          case "component_hero_section":
            return <HeroSection key={`hero-${item.id}-${index}`} item={item} />;

          case "rich_content": {
            // ✅ adapter: layout tylko text_left/text_right albo undefined
            const safeItem = {
              ...item,
              layout: normalizeLayout(item.layout),
            };

            return <RichContentBlock key={`rich-${item.id}-${index}`} item={safeItem} />;
          }

          default:
            return (
              <section
                key={`unknown-${index}`}
                className="p-4 bg-yellow-100 text-yellow-800 rounded-lg"
              >
                <p>Nieznany blok: {collection}</p>
              </section>
            );
        }
      })}
    </>
  );
}

// "use client";

// import HeroSection from "./HeroSection";
// import RichContent from "./RichContent";

// /** 🔹 Typ pojedynczego elementu Directus */
// interface DirectusItem {
//   id: string | number;
//   title?: string;
//   subtitle?: string;
//   content?: string;
//   text_button?: string;
//   url_button?: string;
//   image?: string;
//   layout?: string;
//   [key: string]: unknown;
// }

// /** 🔹 Typ komponentu M2A (many-to-any) */
// interface DirectusBlock {
//   collection: string;
//   item: DirectusItem;
// }

// /** 🔹 Typ produktu — minimalny */
// interface Product {
//   description?: string;
// }

// export default function DirectusRenderer({
//   components,
//   product,
// }: {
//   components: DirectusBlock[];
//   product?: Product;
// }) {
//   if (!components || components.length === 0) {
//     return (
//       <section className="prose mx-auto my-12">
//         <div dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
//       </section>
//     );
//   }

//   return (
//     <>
//       {components.map((block, index) => {
//         const { collection, item } = block;
//         if (!collection || !item) return null;

//         switch (collection.trim()) {
//           case "component_hero_section":
//             return <HeroSection key={`hero-${item.id}-${index}`} item={item} />;

//           case "rich_content":
//             return <RichContent key={`rich-${item.id}-${index}`} item={item} />;

//           default:
//             return (
//               <section
//                 key={`unknown-${index}`}
//                 className="p-4 bg-yellow-100 text-yellow-800 rounded-lg"
//               >
//                 <p>Nieznany blok: {collection}</p>
//               </section>
//             );
//         }
//       })}
//     </>
//   );
// }
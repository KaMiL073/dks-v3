"use client";

import Image from "next/image";
import { setAttr } from "@/lib/visual-editor";
import Heading, { type HeadingTag } from "@/components/ui/Typography/Heading";
import "@/styles/rich-content.scss";
import Button from "../ui/Button";

interface RichContentItem {
  id: string | number;
  title?: string;

  header_type?: string;
  heading_styles?: string;

  subtitle?: string;
  subtitle_type?: string;
  subtitle_styles?: string;

  content?: string;
  image?: string;

  layout?: "text_left" | "text_right" | string;

  text_button?: string;
  url_button?: string;

  [key: string]: unknown;
}

const HEADING_TAGS: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

function isHeadingTag(v: unknown): v is HeadingTag {
  return typeof v === "string" && (HEADING_TAGS as string[]).includes(v);
}

function toHeadingTag(v: unknown, fallback: HeadingTag): HeadingTag {
  return isHeadingTag(v) ? v : fallback;
}

export default function RichContentBlock({ item }: { item: RichContentItem }) {
  const imageUrl = item?.image
    ? `/backend/assets/${item.image}`
    : "/static/placeholder-product.svg";

  const isTextRight = item.layout === "text_right";
  const headerTag = toHeadingTag(item.header_type, "h2");
  const subtitleTag = toHeadingTag(item.subtitle_type, "h3");
  const isDirectus = imageUrl.startsWith("/backend/assets/");

  return (
    <section
      className="bg-surface-page flex flex-col justify-center items-start gap-6 py-18 px-4 sm:px-6 lg:px-8 xl:px-28"
      data-directus={setAttr({
        collection: "rich_content",
        item: String(item.id),
        fields: ["layout"],
        mode: "popover",
      })}
    >
      <div
        className={`flex flex-col md:flex-row ${
          isTextRight ? "md:flex-row" : "md:flex-row-reverse"
        } items-start md:items-center justify-between gap-8 md:gap-12 w-full`}
      >
        <div className="w-full md:w-1/2">
          <Image
            src={imageUrl}
            alt={item.title || "Obrazek"}
            width={576}
            height={629}
            className="w-full h-auto object-cover rounded-lg"
            unoptimized={isDirectus}
            data-directus={setAttr({
              collection: "rich_content",
              item: String(item.id),
              fields: ["image"],
              mode: "modal",
            })}
          />
        </div>

        <div
          className="w-full md:w-1/2 flex flex-col justify-center items-start gap-6 py-4"
          data-directus={setAttr({
            collection: "rich_content",
            item: String(item.id),
            fields: [
              "title",
              "header_type",
              "heading_styles",
              "subtitle",
              "subtitle_type",
              "subtitle_styles",
              "content",
            ],
            mode: "modal",
          })}
        >
          <div className="flex flex-col justify-start items-start gap-9 w-full">
            {item.title && (
              <div
                className="w-full"
                data-directus={setAttr({
                  collection: "rich_content",
                  item: String(item.id),
                  fields: ["title", "header_type", "heading_styles"],
                  mode: "popover",
                })}
              >
                <Heading as={headerTag} headingValue={item.heading_styles || "h2_normal"}>
                  {item.title}
                </Heading>
              </div>
            )}

            {item.subtitle && (
              <div
                className="w-full"
                data-directus={setAttr({
                  collection: "rich_content",
                  item: String(item.id),
                  fields: ["subtitle", "subtitle_type", "subtitle_styles"],
                  mode: "popover",
                })}
              >
                <Heading as={subtitleTag} headingValue={item.subtitle_styles || "h3_normal"}>
                  {item.subtitle}
                </Heading>
              </div>
            )}

            {item.content && (
              <div
                className="rich-content w-full"
                dangerouslySetInnerHTML={{ __html: item.content }}
                data-directus={setAttr({
                  collection: "rich_content",
                  item: String(item.id),
                  fields: ["content"],
                  mode: "modal",
                })}
              />
            )}
          </div>

          {item.text_button && (
            <div
              data-directus={setAttr({
                collection: "rich_content",
                item: String(item.id),
                fields: ["text_button", "url_button"],
                mode: "popover",
              })}
            >
              <Button href={item.url_button || "#"} className="mt-4">
                {item.text_button}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
// /* frontend-new/src/components/bloxs/RichContent.tsx */
// "use client";

// import Image from "next/image";
// import { setAttr } from "@/lib/visual-editor";
// import Heading, { type HeadingTag } from "@/components/ui/Typography/Heading";
// import "@/styles/rich-content.scss";
// import Button from "../ui/Button";

// interface RichContentItem {
//   id: string | number;
//   title?: string;

//   header_type?: string;
//   heading_styles?: string;

//   subtitle?: string;
//   subtitle_type?: string;
//   subtitle_styles?: string;

//   content?: string;
//   image?: string;

//   layout?: "text_left" | "text_right" | string;

//   text_button?: string;
//   url_button?: string;

//   [key: string]: unknown;
// }

// const HEADING_TAGS: HeadingTag[] = ["h1", "h2", "h3", "h4", "h5", "h6"];

// function isHeadingTag(v: unknown): v is HeadingTag {
//   return typeof v === "string" && (HEADING_TAGS as string[]).includes(v);
// }

// function toHeadingTag(v: unknown, fallback: HeadingTag): HeadingTag {
//   return isHeadingTag(v) ? v : fallback;
// }

// export default function RichContentBlock({ item }: { item: RichContentItem }) {
//   const backend =
//     process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:8055";

//   const imageUrl = item?.image ? `${backend}/assets/${item.image}` : "https://placehold.co/576x629";

//   const isTextRight = item.layout === "text_right";

//   const headerTag = toHeadingTag(item.header_type, "h2");
//   const subtitleTag = toHeadingTag(item.subtitle_type, "h3");

//   return (
//     <section
//       className="bg-surface-page flex flex-col justify-center items-start gap-6 py-18"
//       data-directus={setAttr({
//         collection: "rich_content",
//         item: String(item.id),
//         fields: ["layout"],
//         mode: "popover",
//       })}
//     >
//       <div
//         className={`flex flex-col md:flex-row ${
//           isTextRight ? "md:flex-row" : "md:flex-row-reverse"
//         } items-start md:items-center justify-between gap-8 md:gap-12 w-full`}
//       >
//         {/* 🖼️ OBRAZ */}
//         <div className="w-full md:w-1/2">
//           <Image
//             src={imageUrl}
//             alt={item.title || "Obrazek"}
//             width={576}
//             height={629}
//             className="w-full h-auto object-cover rounded-lg"
//             data-directus={setAttr({
//               collection: "rich_content",
//               item: String(item.id),
//               fields: ["image"],
//               mode: "modal",
//             })}
//           />
//         </div>

//         {/* 📄 TEKST */}
//         <div
//           className="w-full md:w-1/2 flex flex-col justify-center items-start gap-6 py-4"
//           data-directus={setAttr({
//             collection: "rich_content",
//             item: String(item.id),
//             fields: [
//               "title",
//               "header_type",
//               "heading_styles",
//               "subtitle",
//               "subtitle_type",
//               "subtitle_styles",
//               "content",
//             ],
//             mode: "modal",
//           })}
//         >
//           <div className="flex flex-col justify-start items-start gap-9 w-full">
//             {item.title && (
//               <div
//                 className="w-full"
//                 data-directus={setAttr({
//                   collection: "rich_content",
//                   item: String(item.id),
//                   fields: ["title", "header_type", "heading_styles"],
//                   mode: "popover",
//                 })}
//               >
//                 <Heading as={headerTag} headingValue={item.heading_styles || "h2_normal"}>
//                   {item.title}
//                 </Heading>
//               </div>
//             )}

//             {item.subtitle && (
//               <div
//                 className="w-full"
//                 data-directus={setAttr({
//                   collection: "rich_content",
//                   item: String(item.id),
//                   fields: ["subtitle", "subtitle_type", "subtitle_styles"],
//                   mode: "popover",
//                 })}
//               >
//                 <Heading as={subtitleTag} headingValue={item.subtitle_styles || "h3_normal"}>
//                   {item.subtitle}
//                 </Heading>
//               </div>
//             )}

//             {item.content && (
//               <div
//                 className="rich-content w-full"
//                 dangerouslySetInnerHTML={{ __html: item.content }}
//                 data-directus={setAttr({
//                   collection: "rich_content",
//                   item: String(item.id),
//                   fields: ["content"],
//                   mode: "modal",
//                 })}
//               />
//             )}
//           </div>

//           {item.text_button && (
//             <div
//               data-directus={setAttr({
//                 collection: "rich_content",
//                 item: String(item.id),
//                 fields: ["text_button", "url_button"],
//                 mode: "popover",
//               })}
//             >
//               <Button href={item.url_button || "#"} className="mt-4">
//                 {item.text_button}
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
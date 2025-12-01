"use client";

import Image from "next/image";
import { setAttr } from "@/lib/visual-editor";
import { Heading } from "@/components/ui/Typography/Heading";
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
  layout?: "text_left" | "text_right";
  text_button?: string;
  url_button?: string;
  [key: string]: unknown;
}

export default function RichContent({ item }: { item: RichContentItem }) {
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ||
    "http://localhost:8055";

  const imageUrl = item?.image
    ? `${backend}/assets/${item.image}`
    : "https://placehold.co/576x629";

  const isTextRight = item.layout === "text_right";

  return (
    <section
      className="bg-surface-page flex flex-col justify-center items-start gap-6 py-18"
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
        {/* 🖼️ OBRAZ */}
        <div className="w-full md:w-1/2">
          <Image
            src={imageUrl}
            alt={item.title || "Obrazek"}
            width={576}
            height={629}
            className="w-full h-auto object-cover rounded-lg"
            data-directus={setAttr({
              collection: "rich_content",
              item: String(item.id),
              fields: ["image"],
              mode: "modal",
            })}
          />
        </div>

        {/* 📄 TEKST */}
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
          <div className="flex flex-col justify-start items-start gap-9">
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
                <Heading
                  as={item.header_type || "h2"}
                  headingValue={item.heading_styles || "h2_normal"}
                >
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
                <Heading
                  as={item.subtitle_type || "h3"}
                  headingValue={item.subtitle_styles || "h3_normal"}
                >
                  {item.subtitle}
                </Heading>
              </div>
            )}

            {item.content && (
              <div
                className="rich-content"
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
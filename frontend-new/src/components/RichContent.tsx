"use client";

import Image from "next/image";
import { Heading } from "@/components/ui/Typography/Heading";
import "@/styles/rich-content.scss";
import Button from "@/components/ui/Button";

interface RichContentStaticProps {
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
}

/**
 * 🔹 Statyczny komponent prezentujący sekcję z obrazem, tekstem i CTA
 * - Layout "text_right" lub "text_left"
 * - Obsługuje opcjonalny opis, podtytuł i przycisk
 */
export default function RichContentStatic({
  title,
  header_type,
  heading_styles,
  subtitle,
  subtitle_type,
  subtitle_styles,
  content,
  image,
  layout = "text_left",
  text_button,
  url_button,
}: RichContentStaticProps) {
  const imageUrl = image || "https://placehold.co/576x629";
  const isTextRight = layout === "text_right";

  return (
    <section className="bg-surface-page flex flex-col justify-center items-start gap-6 py-18">
      <div
        className={`flex flex-col md:flex-row ${
          isTextRight ? "md:flex-row" : "md:flex-row-reverse"
        } items-start md:items-center justify-between gap-8 md:gap-12 w-full`}
      >
        {/* 🖼 KOLUMNA Z OBRAZEM */}
        <div className="w-full md:w-1/2">
          <Image
            src={imageUrl}
            alt={title || "Obrazek"}
            width={576}
            height={629}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* 📝 KOLUMNA Z TEKSTEM */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-6 py-4">
          <div className="flex flex-col justify-start items-start gap-9">
            {/* 🔹 Tytuł */}
            {title && (
              <div className="w-full">
                <Heading as={header_type || "h2"} headingValue={heading_styles || "h2_normal"}>
                  {title}
                </Heading>
              </div>
            )}

            {/* 🔹 Podtytuł */}
            {subtitle && (
              <div className="w-full">
                <Heading
                  as={subtitle_type || "h3"}
                  headingValue={subtitle_styles || "h3_normal"}
                >
                  {subtitle}
                </Heading>
              </div>
            )}

            {/* 🔹 Treść */}
            {content && (
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>

          {/* 🔘 Przycisk CTA */}
          {text_button && (
            <div>
              <Button href={url_button || "#"} className="mt-4">
                {text_button}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
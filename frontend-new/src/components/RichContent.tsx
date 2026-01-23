"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { Heading } from "@/components/ui/Typography/Heading";
import "@/styles/rich-content.scss";
import Button from "@/components/ui/Button";

type ColumnsMode = 1 | 2;

interface RichContentStaticProps {
  title?: string;
  header_type?: string;
  heading_styles?: string;
  subtitle?: string;
  subtitle_type?: string;
  subtitle_styles?: string;

  /** ✅ zawsze widoczne (góra) */
  content?: string; // HTML (jak było)

  image?: string;
  layout?: "text_left" | "text_right";

  text_button?: string;
  url_button?: string;

  /** ✅ dodatkowa treść pojawiająca się dopiero po kliknięciu */
  enable_read_more?: boolean;
  read_more_label?: string;
  read_less_label?: string;
  default_expanded?: boolean;

  /** ✅ wybór: 1 lub 2 kolumny po rozwinięciu */
  expanded_columns?: ColumnsMode;

  /**
   * ✅ NOWE: treść dla kolumn w stanie rozwiniętym
   * - jeśli expanded_columns=2: wyświetlamy lewą i prawą
   * - jeśli expanded_columns=1: zachowanie zależne od single_column_behavior
   */
  expand_left?: string;  // HTML
  expand_right?: string; // HTML

  /**
   * ✅ co zrobić, gdy expanded_columns=1 i masz dwie treści:
   * - "left_only": pokaż tylko lewą
   * - "merge": pokaż lewą + prawą (jedna pod drugą)
   */
  single_column_behavior?: "left_only" | "merge";
}

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

  enable_read_more,
  read_more_label = "Czytaj dalej...",
  read_less_label = "Zwiń",
  default_expanded = false,

  expanded_columns = 2,

  expand_left,
  expand_right,
  single_column_behavior = "merge",
}: RichContentStaticProps) {
  const imageUrl = image || "https://placehold.co/576x629";
  const isTextRight = layout === "text_right";

  const hasExpand = Boolean(
    (expand_left && expand_left.trim().length > 0) ||
      (expand_right && expand_right.trim().length > 0)
  );

  // domyślnie przycisk aktywny, jeśli jest jakakolwiek treść rozwijana
  const readMoreEnabled = useMemo(() => {
    if (typeof enable_read_more === "boolean") return enable_read_more;
    return hasExpand;
  }, [enable_read_more, hasExpand]);

  const [expanded, setExpanded] = useState(default_expanded);

  const mergedHtml = useMemo(() => {
    const left = expand_left?.trim() ? expand_left.trim() : "";
    const right = expand_right?.trim() ? expand_right.trim() : "";
    if (!left && !right) return "";
    if (single_column_behavior === "left_only") return left;
    // merge
    if (left && right) return `${left}<div style="height:24px"></div>${right}`;
    return left || right;
  }, [expand_left, expand_right, single_column_behavior]);

  return (
    <section className="bg-surface-page flex flex-col justify-center items-start gap-6 py-18">
      {/* GÓRA: zawsze widoczna */}
      <div
        className={`flex flex-col md:flex-row ${
          isTextRight ? "md:flex-row" : "md:flex-row-reverse"
        } items-start md:items-center justify-between gap-8 md:gap-12 w-full`}
      >
        {/* 🖼 obraz */}
        <div className="w-full md:w-1/2">
          <Image
            src={imageUrl}
            alt={title || "Obrazek"}
            width={576}
            height={629}
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>

        {/* 📝 tekst górny */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-6 py-4">
          <div className="flex flex-col justify-start items-start gap-9 w-full">
            {title && (
              <div className="w-full">
                <Heading as={header_type || "h2"} headingValue={heading_styles || "h2_normal"}>
                  {title}
                </Heading>
              </div>
            )}

            {subtitle && (
              <div className="w-full">
                <Heading as={subtitle_type || "h3"} headingValue={subtitle_styles || "h3_normal"}>
                  {subtitle}
                </Heading>
              </div>
            )}

            {content && (
              <div className="rich-content w-full" dangerouslySetInnerHTML={{ __html: content }} />
            )}
          </div>

          {/* CTA */}
          {text_button && (
            <div>
              <Button href={url_button || "#"} className="mt-4">
                {text_button}
              </Button>
            </div>
          )}

          {/* ✅ przycisk rozwijania */}
          {readMoreEnabled && hasExpand && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-2 inline-flex text-primary underline text-sm font-['Montserrat']"
              aria-expanded={expanded}
            >
              {expanded ? read_less_label : read_more_label}
            </button>
          )}
        </div>
      </div>

      {/* DÓŁ: pojawia się dopiero po kliknięciu */}
      {hasExpand && expanded && (
        <div className="w-full mt-10">
          {expanded_columns === 2 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: expand_left || "" }}
              />
              <div
                className="rich-content"
                dangerouslySetInnerHTML={{ __html: expand_right || "" }}
              />
            </div>
          ) : (
            <div
              className="rich-content w-full"
              dangerouslySetInnerHTML={{ __html: mergedHtml }}
            />
          )}
        </div>
      )}
    </section>
  );
}
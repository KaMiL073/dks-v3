"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Heading } from "@/components/ui/Typography/Heading";

type HeroLayout = "full-height" | "boxed-image";

type EventHeroProps = {
  variant?: HeroLayout;

  title?: string | null;
  subtitle?: string | null;
  buttonLabel?: string;
  image?: string | null;

  contentPosition?: "left" | "right";
  imageVerticalAlign?: "bottom" | "center";
  imageFit?: "contain" | "cover";
};

/* =========================
   🔥 DIRECTUS IMAGE
========================= */

function getDirectusImage(image?: string | null) {
  if (!image) return null;
  return `/backend/assets/${image}`;
}

// 👇 KLUCZOWE: omijamy next/image optimizer
const directusLoader = ({ src }: { src: string }) => src;

/* =========================
   COMPONENT
========================= */

export default function EventHero({
  variant = "full-height",
  title,
  subtitle,
  buttonLabel,
  image,
  contentPosition = "left",
  imageVerticalAlign = "center",
  imageFit = "contain",
}: EventHeroProps) {
  const heroImage = getDirectusImage(image);

  const isRight = contentPosition === "right";
  const isCenter = imageVerticalAlign === "center";
  const directionClass = isRight ? "lg:flex-row-reverse" : "";

  const imageClass = imageFit === "cover" ? "object-cover" : "object-contain";
  const objectPosition = isCenter ? "50% 50%" : "50% 100%";

  const containerClasses =
    "flex flex-col lg:flex-row gap-6 lg:gap-12 " +
    "px-4 sm:px-6 lg:px-8 xl:px-28 mx-auto " +
    "pt-8 lg:pt-20 " +
    "min-h-[500px] lg:h-[680px] " +
    "items-start lg:items-stretch " +
    directionClass;

  const textColClasses =
    "w-full lg:flex-1 flex flex-col gap-4 lg:gap-8 lg:justify-center";

  const imageOuterClasses =
    "w-full lg:flex-1 flex justify-center lg:h-full " +
    (isRight ? "lg:justify-end " : "lg:justify-start ") +
    (isCenter ? "lg:items-center" : "lg:items-end");

  const imageInnerClasses =
    "relative w-full " +
    "h-[240px] sm:h-[320px] md:h-[360px] " +
    "lg:h-full " +
    "sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-5xl";

  return (
    <section
      className="w-full bg-cover bg-center"
      style={{ backgroundImage: 'url("/static/homepage/Header.webp")' }}
    >
      <div className={containerClasses}>
        <div className={textColClasses}>
          {title && (
            <Heading headingValue="h1_semibold" as="h1">
              {title}
            </Heading>
          )}

          {subtitle && (
            <Heading headingValue="h5_normal" as="h5">
              <span dangerouslySetInnerHTML={{ __html: subtitle }} />
            </Heading>
          )}

          {buttonLabel && (
            <div className="mt-2">
              <Button>{buttonLabel}</Button>
            </div>
          )}
        </div>

        {heroImage && (
          <div className={imageOuterClasses}>
            <div className={imageInnerClasses}>
              <Image
                loader={directusLoader}   // 🔥 omija next/image proxy
                src={heroImage}
                alt={title || "Hero image"}
                fill
                unoptimized               // 🔥 KLUCZOWE
                priority
                sizes="(max-width: 768px) 100vw,
                       (max-width: 1200px) 50vw,
                       33vw"
                className={imageClass}
                style={{ objectPosition }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";

import Button from "@/components/ui/Button";
import { Heading } from "@/components/ui/Typography/Heading";

type HeroLayout = "full-height" | "boxed-image";

type EventHeroProps = {
  variant?: HeroLayout;

  title?: string | null;
  subtitle?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;

  image?: string | null;
  backgroundImage?: string | null;

  contentPosition?: "left" | "right";
  imageVerticalAlign?: "bottom" | "center";
  imageFit?: "contain" | "cover";
};

function getDirectusImage(image?: string | null) {
  if (!image) return null;

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image.replace("http://localhost/backend", "https://dks.pl/backend");
  }

  return `/backend/assets/${image}`;
}

const directusLoader = ({ src }: { src: string }) => src;

export default function EventHero({
  variant = "full-height",
  title,
  subtitle,
  buttonLabel,
  buttonUrl,
  image,
  backgroundImage,
  contentPosition = "left",
  imageVerticalAlign = "center",
  imageFit = "contain",
}: EventHeroProps) {
  const heroImage = getDirectusImage(image);
  const bgImage = getDirectusImage(backgroundImage);

  const isRight = contentPosition === "right";
  const isCenter = imageVerticalAlign === "center";

  const imageClass = imageFit === "cover" ? "object-cover" : "object-contain";
  const objectPosition = isCenter ? "50% 50%" : "50% 100%";

  const containerClasses =
    variant === "boxed-image"
      ? [
          "mx-auto flex min-h-[500px] flex-col gap-6 px-4 pt-8 sm:px-6 lg:h-[680px] lg:flex-row lg:items-stretch lg:gap-12 lg:px-8 lg:pt-20 xl:px-28",
          isRight ? "lg:flex-row-reverse" : "",
        ].join(" ")
      : [
          "mx-auto flex min-h-[500px] flex-col gap-6 px-4 pt-8 sm:px-6 lg:h-[680px] lg:flex-row lg:items-stretch lg:gap-12 lg:px-8 lg:pt-20 xl:px-28",
          isRight ? "lg:flex-row-reverse" : "",
        ].join(" ");

  const imageOuterClasses = [
    "flex w-full justify-center lg:h-full lg:flex-1",
    isRight ? "lg:justify-end" : "lg:justify-start",
    isCenter ? "lg:items-center" : "lg:items-end",
  ].join(" ");

  return (
    <section
      className="w-full bg-cover bg-center"
      style={{
        backgroundImage: `url("${bgImage || "/static/homepage/Header.webp"}")`,
      }}
    >
      <div className={containerClasses}>
        <div className="flex w-full flex-col gap-4 lg:flex-1 lg:justify-center lg:gap-8">
          {title && (
            <Heading headingValue="h1_semibold" as="h1">
              {title}
            </Heading>
          )}-

          {subtitle && (
            <Heading headingValue="h5_normal" as="h5">
              <span dangerouslySetInnerHTML={{ __html: subtitle }} />
            </Heading>
          )}

          {buttonLabel && (
            <div className="mt-2">
              {buttonUrl ? (
                <Link href={buttonUrl}>
                  <Button>{buttonLabel}</Button>
                </Link>
              ) : (
                <Button>{buttonLabel}</Button>
              )}
            </div>
          )}
        </div>

        {heroImage && (
          <div className={imageOuterClasses}>
            <div className="relative h-[240px] w-full sm:h-[320px] sm:max-w-sm md:h-[360px] md:max-w-md lg:h-full lg:max-w-2xl xl:max-w-5xl">
              <Image
                loader={directusLoader}
                src={heroImage}
                alt={title || "Hero image"}
                fill
                unoptimized
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
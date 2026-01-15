"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import { Heading } from "@/components/ui/Typography/Heading";

type HeroLayout = "full-height" | "boxed-image";

type HeroProps = {
  variant?: HeroLayout;

  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  backgroundImage?: string;
  heroImage?: string;

  contentPosition?: "left" | "right";
  imageVerticalAlign?: "bottom" | "center";
  imageFit?: "contain" | "cover";
};

export default function HeroSection({
  variant = "boxed-image",
  title,
  subtitle,
  buttonLabel,
  backgroundImage,
  heroImage,
  contentPosition = "left",
  imageVerticalAlign = "center",
  imageFit = "contain",
}: HeroProps) {
  const isRight = contentPosition === "right";
  const isCenter = imageVerticalAlign === "center";
  const directionClass = isRight ? "lg:flex-row-reverse" : "";

  // =========================
  // VARIANT: full-height (bez pb)
  // =========================
  if (variant === "full-height") {
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
      "h-[240px] sm:h-[320px] md:h-[360px] " + // mobile/tablet
      "lg:h-full " + // desktop: wypełnia hero
      "sm:max-w-sm md:max-w-md lg:max-w-2xl xl:max-w-3xl";

    const imageClass = imageFit === "cover" ? "object-cover" : "object-contain";

    const objectPosition = isCenter ? "50% 50%" : "50% 100%";

    return (
      <section
        className="w-full bg-cover bg-center"
        style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : undefined}
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
                  src={heroImage}
                  alt={title || "Hero image"}
                  fill
                  priority
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

  // ======================
  // VARIANT: boxed-image (z pb)
  // ======================
  const containerClasses =
    "flex flex-col gap-6 " +
    "px-4 sm:px-6 mx-auto " +
    "pt-8 pb-10 lg:pt-20 lg:pb-12 " + // ✅ TU JEST DOLNY PADDING
    "md:min-h-[420px] lg:min-h-[520px] xl:min-h-[564px] " +
    "lg:flex-row lg:gap-12 lg:px-8 xl:px-28 " +
    "items-start md:items-center " +
    directionClass;

  const textColClasses =
    "w-full flex flex-col gap-4 " +
    "lg:flex-1 lg:gap-8";

  const imageOuterClasses =
    "w-full flex justify-center order-2 " +
    "lg:order-none lg:flex-1 " +
    (isCenter ? "md:items-center" : "md:items-end");

  const imageInnerClasses =
    "relative w-full " +
    "h-[220px] sm:h-[280px] md:h-[320px] " + // ✅ poprawiona progresja
    "lg:h-[360px] xl:h-[440px] 2xl:h-[480px] " +
    "lg:max-w-2xl xl:max-w-3xl";

  const imageClass = imageFit === "cover" ? "object-cover" : "object-contain";
  const objectPosition = isCenter ? "50% 50%" : "50% 100%";

  return (
    <section
      className="w-full bg-cover bg-center"
      style={backgroundImage ? { backgroundImage: `url("${backgroundImage}")` } : undefined}
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
                src={heroImage}
                alt={title || "Hero image"}
                fill
                priority
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
// "use client";

// import Image from "next/image";
// import Button from "@/components/ui/Button";
// import { Heading } from "@/components/ui/Typography/Heading";

// type HeroProps = {
//   title?: string;
//   subtitle?: string; // ← HTML string
//   buttonLabel?: string;
//   backgroundImage?: string;
//   heroImage?: string;
// };

// export default function HeroSection({
//   title,
//   subtitle,
//   buttonLabel,
//   backgroundImage,
//   heroImage,
// }: HeroProps) {
//   return (
//     <section
//       className="w-full bg-cover bg-center"
//       style={
//         backgroundImage
//           ? { backgroundImage: `url("${backgroundImage}")` }
//           : undefined
//       }
//     >
//       <div
//         className="flex flex-col lg:flex-row items-start 2xl:items-center gap-6 lg:gap-12 
//         px-4 sm:px-6 md:px-6 lg:px-8 xl:px-28 pt-8 lg:pt-20 mx-auto"
//       >
//         {/* LEWA KOLUMNA */}
//         <div className="flex-1 flex flex-col gap-4 lg:gap-8 pb-28">
//           {title && (
//             <Heading headingValue="h1_semibold" as="h1">
//               {title}
//             </Heading>
//           )}

//           {subtitle && (
//             <Heading headingValue="h5_normal" as="h5">
//               <span
//                 dangerouslySetInnerHTML={{ __html: subtitle }}
//               />
//             </Heading>
//           )}

//           {buttonLabel && (
//             <div className="flex">
//               <Button>{buttonLabel}</Button>
//             </div>
//           )}
//         </div>

//         {/* PRAWA KOLUMNA */}
//         {heroImage && (
//           <div
//             className="flex-1 relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl 
//             xl:max-w-3xl aspect-[4/3] lg:aspect-auto lg:h-[400px] xl:h-[550px] 2xl:h-[500px] 
//             flex items-center lg:items-end"
//           >
//             <Image
//               src={heroImage}
//               alt={title || "Hero image"}
//               fill
//               style={{ objectFit: "contain", objectPosition: "bottom" }}
//             />
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
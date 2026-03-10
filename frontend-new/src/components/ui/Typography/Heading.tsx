// src/components/ui/Typography/Heading.tsx
"use client";

import React from "react";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingTag;        // jaki tag DOM wyrenderować
  headingValue?: string;  // np. "h2_semibold"
  children: React.ReactNode;
  className?: string;
};

const headingStyles: Record<string, string> = {
  h1_normal: "text-neutral-950 text-3xl lg:text-6xl font-normal leading-10 lg:leading-[64px]",
  h1_semibold:
    "text-neutral-950 text-3xl lg:text-6xl font-semibold leading-10 lg:leading-[64px]",
  h1_underline:
    "text-neutral-950 text-3xl lg:text-6xl font-normal underline leading-10 lg:leading-[64px]",

  h2_normal: "text-neutral-950 text-4xl font-normal leading-[56px]",
  h2_semibold: "text-neutral-950 text-4xl font-semibold leading-[56px]",
  h2_underline: "text-neutral-950 text-4xl font-normal underline leading-[56px]",

  h3_normal: "text-neutral-950 text-4xl font-normal leading-[48px]",
  h3_semibold: "text-neutral-950 text-4xl font-semibold leading-[48px]",
  h3_underline: "text-neutral-950 text-4xl font-normal underline leading-[48px]",

  h4_normal: "text-neutral-950 text-3xl font-normal leading-10",
  h4_semibold: "text-neutral-950 text-3xl font-semibold leading-10",
  h4_underline: "text-neutral-950 text-3xl font-normal underline leading-10",
  h4_italic: "text-neutral-950 text-3xl italic leading-10",

  h5_normal: "text-neutral-950 text-xl lg:text-2xl font-normal leading-normal lg:leading-7",
  h5_semibold:
    "text-neutral-950 text-xl lg:text-2xl font-semibold leading-normal lg:leading-7",
  h5_underline:
    "text-neutral-950 text-xl lg:text-2xl font-normal underline leading-normal lg:leading-7",
  h5_italic: "text-neutral-950 text-xl lg:text-2xl italic leading-normal lg:leading-7",

  h6_normal: "text-neutral-950 text-xl font-normal leading-none",
  h6_semibold: "text-neutral-950 text-xl font-semibold leading-none",
  h6_underline: "text-neutral-950 text-xl font-normal underline leading-none",
};

function normalizeHeadingValue(asTag: HeadingTag, value?: string): string {
  if (value && headingStyles[value]) return value;

  const fallback = `${asTag}_normal`;
  if (headingStyles[fallback]) return fallback;

  return "h2_normal";
}

export const Heading: React.FC<HeadingProps> = ({
  as = "h2",
  headingValue,
  children,
  className = "",
  ...rest
}) => {
  const key = normalizeHeadingValue(as, headingValue);
  const styles = headingStyles[key] || headingStyles["h2_normal"];

  // ✅ Tag jako element JSX (nie string union w typie komponentu)
  const Tag: React.ElementType = as;

  return (
    <Tag className={`${styles} ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export default Heading;

// // src/components/ui/Typography/Heading.tsx
// "use client";
// import React from "react";

// type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

// type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
//   as?: HeadingTag;                // jaki tag DOM wyrenderować
//   headingValue?: string;          // np. "h2_semibold"
//   children: React.ReactNode;
//   className?: string;
// };

// // mapowanie Twoich styli
// const headingStyles: Record<string, string> = {
//   h1_normal:    "text-neutral-950 text-3xl lg:text-6xl font-normal leading-10 lg:leading-[64px]",
//   h1_semibold:  "text-neutral-950 text-3xl lg:text-6xl font-semibold leading-10 lg:leading-[64px]",
//   h1_underline: "text-neutral-950 text-3xl lg:text-6xl font-normal underline leading-10 lg:leading-[64px]",

//   h2_normal:    "text-neutral-950 text-4xl font-normal leading-[56px]",
//   h2_semibold:  "text-neutral-950 text-4xl font-semibold leading-[56px]",
//   h2_underline: "text-neutral-950 text-4xl font-normal underline leading-[56px]",

//   h3_normal:    "text-neutral-950 text-4xl font-normal leading-[48px]",
//   h3_semibold:  "text-neutral-950 text-4xl font-semibold leading-[48px]",
//   h3_underline: "text-neutral-950 text-4xl font-normal underline leading-[48px]",

//   h4_normal:    "text-neutral-950 text-3xl font-normal leading-10",
//   h4_semibold:  "text-neutral-950 text-3xl font-semibold leading-10",
//   h4_underline: "text-neutral-950 text-3xl font-normal underline leading-10",
//   h4_italic:    "text-neutral-950 text-3xl italic leading-10",

//   h5_normal:    "text-neutral-950 text-xl lg:text-2xl font-normal leading-normal lg:leading-7",
//   h5_semibold:  "text-neutral-950 text-xl lg:text-2xl font-semibold leading-normal lg:leading-7",
//   h5_underline: "text-neutral-950 text-xl lg:text-2xl font-normal underline leading-normal lg:leading-7",
//   h5_italic:    "text-neutral-950 text-xl lg:text-2xl italic leading-normal lg:leading-7",

//   h6_normal:    "text-neutral-950 text-xl font-normal leading-none",
//   h6_semibold:  "text-neutral-950 text-xl font-semibold leading-none",
//   h6_underline: "text-neutral-950 text-xl font-normal underline leading-none",
// };

// // normalizacja: jeśli np. as="h1" i wybierzesz styl "h2_semibold", to użyjemy "h2_semibold"
// function normalizeHeadingValue(asTag: HeadingTag, value?: string) {
//   if (value && headingStyles[value]) return value;
//   const fallback = `${asTag}_normal`;
//   return headingStyles[fallback] ? fallback : "h2_normal";
// }

// export const Heading: React.FC<HeadingProps> = ({
//   as = "h2",
//   headingValue,
//   children,
//   className = "",
//   ...rest
// }) => {
//   const Tag = as || "h2"; // 🔒 bezpieczny fallback
//   const key = normalizeHeadingValue(Tag, headingValue);
//   const styles = headingStyles[key] || headingStyles["h2_normal"];

//   return (
//     <Tag className={`${styles} ${className}`} {...rest}>
//       {children}
//     </Tag>
//   );
// };
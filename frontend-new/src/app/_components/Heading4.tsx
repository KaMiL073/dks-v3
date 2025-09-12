import React from "react";

type Heading4Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline" | "italic";
};

const variantClasses: Record<string, string> = {
  normal: "w-[942px] h-28 text-neutral-950 text-3xl font-normal font-['Montserrat'] leading-10",
  semibold: "w-[942px] h-28 text-neutral-950 text-3xl font-semibold font-['Montserrat'] leading-10",
  underline: "w-[942px] h-28 text-neutral-950 text-3xl font-normal font-['Montserrat'] underline leading-10",
  italic: "w-[942px] h-28 justify-start text-Neutral-950 text-3xl font-normal font-['Montserrat'] leading-10"
};

export const Heading4: React.FC<Heading4Props> = ({ children, variant = "normal" }) => {
  return <h4 className={variantClasses[variant]}>{children}</h4>;
};

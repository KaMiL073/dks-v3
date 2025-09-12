import React from "react";

type Heading3Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline";
};

const variantClasses: Record<string, string> = {
  normal: "w-[942px] h-40 text-neutral-950 text-4xl font-normal font-['Montserrat'] leading-[48px]",
  semibold: "w-[942px] h-40 text-neutral-950 text-4xl font-semibold font-['Montserrat'] leading-[48px]",
  underline: "w-[942px] h-40 text-neutral-950 text-4xl font-normal font-['Montserrat'] underline leading-[48px]",
};

export const Heading3: React.FC<Heading3Props> = ({ children, variant = "normal" }) => {
  return <h3 className={variantClasses[variant]}>{children}</h3>;
};

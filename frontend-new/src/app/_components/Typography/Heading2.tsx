import React from "react";

type Heading2Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline";
};

const variantClasses: Record<string, string> = {
  normal: "text-neutral-950 text-4xl font-normal font-['Montserrat'] leading-[56px]",
  semibold: "text-neutral-950 text-4xl font-semibold font-['Montserrat'] leading-[56px]",
  underline: "text-neutral-950 text-4xl font-normal font-['Montserrat'] underline leading-[56px]",
};

export const Heading2: React.FC<Heading2Props> = ({ children, variant = "normal" }) => {
  return <h2 className={variantClasses[variant]}>{children}</h2>;
};

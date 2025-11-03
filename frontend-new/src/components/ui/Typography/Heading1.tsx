import React from "react";

type Heading1Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline";
};

const variantClasses: Record<string, string> = {
  normal: "text-neutral-950 text-3xl lg:text-6xl font-normal font-['Montserrat'] leading-10 lg:leading-[64px]",
  semibold: "text-neutral-950 text-3xl lg:text-6xl font-semibold font-['Montserrat'] leading-10 lg:leading-[64px]",
  underline: "text-neutral-950 text-3xl lg:text-6xl font-normal font-['Montserrat'] underline leading-10 lg:leading-[64px]",
};

export const Heading1: React.FC<Heading1Props> = ({ children, variant = "normal" }) => {
  return <h1 className={variantClasses[variant]}>{children}</h1>;
};

import React from "react";

type Heading5Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline";
};

const variantClasses: Record<string, string> = {
  normal: "text-neutral-950 text-xl lg:text-2xl font-normal font-['Montserrat'] leading-normal lg:leading-7",
  semibold: "text-neutral-950 text-xl lg:text-2xl font-semibold font-['Montserrat'] leading-normal lg:leading-7",
  underline: "text-neutral-950 text-xl lg:text-2xl font-normal font-['Montserrat'] underline leading-normal lg:leading-7",
};

export const Heading5: React.FC<Heading5Props> = ({ children, variant = "normal" }) => {
  return <h5 className={variantClasses[variant]}>{children}</h5>;
};

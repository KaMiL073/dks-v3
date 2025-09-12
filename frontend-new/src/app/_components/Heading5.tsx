import React from "react";

type Heading5Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline";
};

const variantClasses: Record<string, string> = {
  normal: "w-[942px] h-16 text-neutral-950 text-2xl font-normal font-['Montserrat'] leading-7",
  semibold: "w-[942px] h-16 text-neutral-950 text-2xl font-semibold font-['Montserrat'] leading-7",
  underline: "w-[942px] h-16 text-neutral-950 text-2xl font-normal font-['Montserrat'] underline leading-7",
};

export const Heading5: React.FC<Heading5Props> = ({ children, variant = "normal" }) => {
  return <h5 className={variantClasses[variant]}>{children}</h5>;
};

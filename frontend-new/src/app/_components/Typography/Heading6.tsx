import React from "react";

type Heading6Props = {
  children: React.ReactNode;
  variant?: "normal" | "semibold" | "underline";
};

const variantClasses: Record<string, string> = {
  normal: "w-[942px] h-16 text-neutral-950 text-xl font-normal font-['Montserrat'] leading-none",
  semibold: "w-[942px] h-16 text-neutral-950 text-xl font-semibold font-['Montserrat'] leading-none",
  underline: "w-[942px] h-16 text-neutral-950 text-xl font-normal font-['Montserrat'] underline leading-none",
};

export const Heading6: React.FC<Heading6Props> = ({ children, variant = "normal" }) => {
  return <h6 className={variantClasses[variant]}>{children}</h6>;
};

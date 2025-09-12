import clsx from "clsx";
import { ReactNode } from "react";

type HeadingProps = {
  children: ReactNode;
  weight?: "normal" | "semibold";
  underline?: boolean;
  className?: string;
};

export default function Heading({
  children,
  weight = "normal",
  underline = false,
  className,
}: HeadingProps) {
  return (
    <h1
      className={clsx(
        "w-[942px] text-6xl leading-[64px] text-neutral-950 font-montserrat",
        weight === "semibold" ? "font-semibold" : "font-normal",
        underline && "underline",
        className
      )}
    >
      {children}
    </h1>
  );
}

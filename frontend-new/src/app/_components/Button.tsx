import React from "react";
import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "action" | "secondary";
  className?: string;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  href,
  onClick,
  variant = "action",
  className = "",
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-4 py-4 rounded-[64px] font-montserrat font-semibold text-base leading-tight transition-colors";

  const variants: Record<string, string> = {
    action:
      "bg-red-600 text-white",
    secondary:
      "bg-gray-200 text-neutral-900 hover:bg-gray-300",
  };

  const classes = `${baseClasses} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

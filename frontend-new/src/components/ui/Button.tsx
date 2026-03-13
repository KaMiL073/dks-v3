"use client";

import React from "react";
import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  href?: string;
  variant?: "action" | "secondary";
  className?: string;
};

/**
 * 🧱 Uniwersalny przycisk z obsługą linków i akcji.
 * - Jeśli podasz `href`, renderuje <Link>
 * - Jeśli nie, renderuje <button>
 */
export default function Button({
  children,
  href,
  variant = "action",
  className = "",
  disabled = false,
  type = "button",
  ...rest
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-4 py-4 rounded-lg font-montserrat font-semibold text-base leading-tight transition-colors duration-200";

  const variants: Record<string, string> = {
    action: "bg-[#E4002B] text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-neutral-900 hover:bg-gray-300",
  };

  const disabledClasses = disabled
    ? "opacity-50 pointer-events-none cursor-not-allowed"
    : "";

  const classes = `${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`;

  // 🔗 Jeśli ma href → renderuj Link
  if (href) {
    return (
      <Link
        href={disabled ? "#" : href}
        className={classes}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      >
        {children}
      </Link>
    );
  }

  // 🧩 Klasyczny button
  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
}
// "use client";

// import React from "react";
// import Link from "next/link";

// type ButtonProps = {
//   children: React.ReactNode;
//   href?: string;
//   onClick?: () => void;
//   variant?: "action" | "secondary";
//   className?: string;
//   type?: "button" | "submit" | "reset";
// };

// /**
//  * 🧱 Uniwersalny przycisk z obsługą linków i akcji.
//  * - Jeśli podasz `href`, renderuje <Link> (czyli <a>)
//  * - Jeśli nie, renderuje <button>
//  */
// export default function Button({
//   children,
//   href,
//   onClick,
//   variant = "action",
//   className = "",
//   type = "button",
// }: ButtonProps) {
//   const baseClasses =
//     "inline-flex items-center justify-center gap-2 px-4 py-4 rounded-lg font-montserrat font-semibold text-base leading-tight transition-colors duration-200";

//   const variants: Record<string, string> = {
//     action: "bg-[#E4002B] text-white hover:bg-red-700",
//     secondary: "bg-gray-200 text-neutral-900 hover:bg-gray-300",
//   };

//   const classes = `${baseClasses} ${variants[variant]} ${className}`;

//   // 🔗 Jeśli przycisk ma link
//   if (href) {
//     return (
//       <Link href={href} className={classes}>
//         {children}
//       </Link>
//     );
//   }

//   // 🧩 Jeśli to klasyczny przycisk
//   return (
//     <button type={type} onClick={onClick} className={classes}>
//       {children}
//     </button>
//   );
// }
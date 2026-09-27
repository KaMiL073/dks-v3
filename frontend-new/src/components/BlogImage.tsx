"use client";

import type { ImgHTMLAttributes } from "react";

type BlogImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  variant?: "thumbnail" | "main";
};

export default function BlogImage({ variant = "main", ...props }: BlogImageProps) {
  let src = props.src;
  if (variant === "thumbnail" && typeof src === "string" && src.includes("/assets/")) {
    const [path, query] = src.split("?");
    const params = new URLSearchParams(query);
    params.delete("imwidth");
    params.set("width", "800");
    params.set("height", "600");
    params.set("fit", "cover");
    src = `${path}?${params}`;
  }

  return (
    // Older CMS files may still exist only on the previous asset server.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      src={src}
      width={variant === "thumbnail" ? 800 : props.width}
      height={variant === "thumbnail" ? 600 : props.height}
      alt={props.alt ?? ""}
      onError={(event) => {
        const image = event.currentTarget;
        const url = new URL(image.src);
        if (url.hostname === "www3.dks.pl" || !url.pathname.startsWith("/backend/assets/")) return;
        image.src = `https://www3.dks.pl${url.pathname}${url.search}`;
      }}
    />
  );
}

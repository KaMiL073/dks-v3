"use client";

import Image, { type ImageProps } from "next/image";
import { directusImageLoader, isDirectusAsset } from "@/lib/directusImageLoader.mjs";

export default function DirectusImage(props: ImageProps) {
  const useDirectus = typeof props.src === "string" && isDirectusAsset(props.src);
  return <Image {...props} alt={props.alt} loader={useDirectus ? directusImageLoader : props.loader} />;
}

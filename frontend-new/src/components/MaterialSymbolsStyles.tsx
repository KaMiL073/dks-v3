"use client";

import { useEffect } from "react";

const stylesheet = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";

/** Decorative icons must not block the initial render of the page. */
export default function MaterialSymbolsStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = stylesheet;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  return <noscript><link rel="stylesheet" href={stylesheet} /></noscript>;
}

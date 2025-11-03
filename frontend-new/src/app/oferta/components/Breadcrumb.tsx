"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Breadcrumb() {
  const pathname = usePathname();

  // dzielimy URL np. "/oferta/rozwiazania-dla-biura/drukarki-laserowe"
  const segments = pathname.split("/").filter(Boolean);

  // budujemy kolejne ścieżki
  const crumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = decodeURIComponent(segment)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()); // Ładniejsze wyświetlanie

    return { href, label };
  });

  return (
    <div className="self-stretch px-4 py-9 md:px-28 md:py-12 inline-flex justify-start items-center gap-2.5">
      <div className="flex-1 text-black text-xs font-normal font-['Montserrat'] leading-none">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        {crumbs.map((crumb, idx) => (
          <span key={crumb.href}>
            {" > "}
            {idx === crumbs.length - 1 ? (
              <span>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="hover:underline">
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

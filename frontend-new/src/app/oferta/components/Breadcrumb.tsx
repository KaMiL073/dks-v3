"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";

function getBaseUrl() {
  // na kliencie mamy dostęp tylko do NEXT_PUBLIC_*
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(path: string) {
  const base = getBaseUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

function prettyLabel(segment: string) {
  return decodeURIComponent(segment)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function Breadcrumb() {
  const pathname = usePathname();
  const baseUrl = getBaseUrl();

  // np. "/oferta/rozwiazania-dla-biura/drukarki-laserowe"
  const segments = pathname.split("/").filter(Boolean);

  // wizualne crumbs (bez Home, bo Home renderujesz osobno)
  const crumbs = segments.map((segment, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    const label = prettyLabel(segment);
    return { href, label };
  });

  // ✅ BreadcrumbList schema (z Home jako 1)
  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${baseUrl}/`,
    },
    ...crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: c.label,
      item: absUrl(c.href),
    })),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <>
      {/* ✅ JSON-LD dla Google */}
      <JsonLd data={breadcrumbSchema} />

      {/* ✅ Twoje breadcrumbs widoczne na stronie */}
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
    </>
  );
}
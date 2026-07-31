import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HeroSection from "@/app/(marketing)/HeroSection";
import RichContentStatic from "@/components/RichContentStatic";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";

import { branches } from "@/content/Branch";
import BranchTabs from "@/components/BranchTabs";
import BranchMap, { type BranchMapBranch, type BranchContact } from "@/components/BranchMap";

import NewsSection from "@/app/(marketing)/NewsSection";
import ContactSection from "@/app/(marketing)/ContactSection";

import JsonLd from "@/components/seo/JsonLd";

type PageParams = {
  location: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(path: string) {
  const base = getBaseUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function toStringSafe(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);

  if (Array.isArray(v)) {
    const joined = v.map((x) => toStringSafe(x)).filter(Boolean).join("\n");
    return joined || fallback;
  }

  if (isRecord(v)) {
    const candidates = [v.html, v.content, v.text, v.value, v.markdown, v.description, v.title];
    for (const c of candidates) {
      const s = toStringSafe(c);
      if (s) return s;
    }
    try {
      const s = JSON.stringify(v);
      return s === "{}" ? fallback : s;
    } catch {
      return fallback;
    }
  }

  return fallback;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { location } = await params;

  const branch = branches.find((b) => b.href === `/oddzialy/${location}`);

  if (!branch) return {};

  const title = branch.metaTitle || branch.title;
  const description =
    branch.metaDescription ||
    `Zapraszamy do oddziału DKS ${branch.fullName || branch.title}. Sprawdź ofertę sprzedaży, dzierżawy i serwisu urządzeń drukujących.`;

  const url = absUrl(branch.href);
  const ogImage = absUrl(branch.image);

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: branch.fullName || branch.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function OddzialPage({ params }: PageProps) {
  const { location } = await params;

  const branch = branches.find((b) => b.href === `/oddzialy/${location}`);

  if (!branch) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const branchUrl = absUrl(branch.href);
  const localBusinessId = `${branchUrl}#localbusiness`;

  const telephone = branch.phone;
  const email = branch.email;

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: branch.fullName,
    url: branchUrl,
    image: absUrl(branch.image) || "https://dks.pl/static/logo-dks.svg",
    parentOrganization: { "@id": `${baseUrl}/#organization` },
  };

  if (telephone) localBusinessSchema.telephone = telephone;
  if (email) localBusinessSchema.email = email;

  localBusinessSchema.address = {
    "@type": "PostalAddress",
    streetAddress: branch.streetAddress,
    postalCode: branch.postalCode,
    addressLocality: branch.addressLocality,
    addressRegion: branch.addressRegion,
    addressCountry: branch.addressCountry,
  };

  const normalizeContact = (c?: { phones?: string[]; emails?: string[] }): BranchContact => ({
    phones: c?.phones?.length ? c.phones : [telephone || "-"],
    emails: c?.emails?.length ? c.emails : [email || "-"],
  });

  const branchForMap: BranchMapBranch = {
    fullName: branch.fullName,
    address: branch.address,
    address2: branch.address2,
    phone: telephone,
    email,
    srcMap: branch.srcMap,
    salesContact: normalizeContact(branch.salesContact),
    serviceContact: normalizeContact(branch.serviceContact),
  };

  return (
    <>
      <JsonLd data={localBusinessSchema} />

      <Breadcrumb />

      <HeroSection
        title={branch.title}
        backgroundImage="/static/homepage/Header.webp"
        heroImage={branch.image}
        contentPosition="right"
        imageVerticalAlign="center"
        imageFit="contain"
        variant="boxed-image"
      />

      <main className="self-stretch px-4 lg:px-28 py-20 space-y-6 text-xl">
        <RichContentStatic image={branch.image} layout="text_left" content={branch.description} />

        <BranchTabs
          offerTab={toStringSafe(branch.offerTab)}
          leaseTab={toStringSafe(branch.leaseTab)}
          photocopiersTab={toStringSafe(branch.photocopiersTab)}
          serviceTab={toStringSafe(branch.serviceTab)}
        />
      </main>

      <BranchMap branch={branchForMap} />
      <ContactSection />
      <NewsSection />
    </>
  );
}
// import type { Metadata } from "next";
// import { notFound } from "next/navigation";

// import HeroSection from "@/app/(marketing)/HeroSection";
// import RichContentStatic from "@/components/RichContent";
// import Breadcrumb from "@/app/oferta/components/Breadcrumb";

// import { branches } from "@/content/Branch";
// import BranchTabs from "@/components/BranchTabs";
// import BranchMap from "@/components/BranchMap";
// import NewsSection from "@/app/(marketing)/NewsSection";
// import ContactSection from "@/app/(marketing)/ContactSection";

// import JsonLd from "@/components/seo/JsonLd";

// type PageProps = {
//   params: {
//     location: string;
//   };
// };

// function getBaseUrl() {
//   return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
// }

// function absUrl(path: string) {
//   const base = getBaseUrl();
//   return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
// }

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const branch = branches.find((b) => b.href === `/oddzialy/${params.location}`);

//   if (!branch) {
//     return {};
//   }

//   const title = branch.metaTitle || branch.title;
//   const description =
//     branch.metaDescription ||
//     `Zapraszamy do oddziału DKS ${branch.fullName}. Sprawdź ofertę sprzedaży, dzierżawy i serwisu urządzeń drukujących.`;

//   const url = absUrl(branch.href);
//   const ogImage = absUrl(branch.image);

//   return {
//     title,
//     description,

//     alternates: {
//       canonical: url,
//     },

//     robots: {
//       index: true,
//       follow: true,
//     },

//     openGraph: {
//       title,
//       description,
//       url,
//       siteName: "DKS",
//       locale: "pl_PL",
//       type: "website",
//       images: [
//         {
//           url: ogImage,
//           width: 1200,
//           height: 630,
//           alt: branch.fullName,
//         },
//       ],
//     },

//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: [ogImage],
//     },
//   };
// }

// export default function OddzialPage({ params }: PageProps) {
//   const branch = branches.find((b) => b.href === `/oddzialy/${params.location}`);

//   if (!branch) {
//     notFound();
//   }

//   const baseUrl = getBaseUrl();

//   // URL i @id dla tego oddziału
//   const branchUrl = absUrl(branch.href);
//   const localBusinessId = `${branchUrl}#localbusiness`;

//   // ⬇️ Poniższe pola dopasuj do struktury branches, jeśli masz inne nazwy.
//   // Robię bezpieczne fallbacki, żeby build nie padł.
//   const telephone =
//     (branch as any).telephone || (branch as any).phone || (branch as any).tel || "+48XXXXXXXXX";
//   const email = (branch as any).email || (branch as any).mail;

//   const address = (branch as any).address || {};
//   const streetAddress = address.streetAddress || address.street || (branch as any).streetAddress;
//   const addressLocality = address.addressLocality || address.locality || (branch as any).addressLocality;
//   const postalCode = address.postalCode || address.postal || (branch as any).postalCode;

//   const geo = (branch as any).geo || (branch as any).coordinates || {};
//   const latitude = geo.latitude ?? (branch as any).latitude;
//   const longitude = geo.longitude ?? (branch as any).longitude;

//   const localBusinessSchema: Record<string, unknown> = {
//     "@context": "https://schema.org",
//     "@type": "LocalBusiness",
//     "@id": localBusinessId,
//     name: branch.fullName || branch.title,
//     url: branchUrl,
//     image: absUrl(branch.image) || "https://dks.pl/static/logo-dks.svg",
//     parentOrganization: {
//       "@id": `${baseUrl}/#organization`,
//     },
//   };

//   // Dodajemy tylko, jeśli mamy dane (żeby schema nie była “pusta”)
//   if (telephone) localBusinessSchema.telephone = telephone;
//   if (email) localBusinessSchema.email = email;

//   // Address – tylko jeśli coś mamy
//   if (streetAddress || addressLocality || postalCode) {
//     localBusinessSchema.address = {
//       "@type": "PostalAddress",
//       ...(streetAddress ? { streetAddress } : {}),
//       ...(addressLocality ? { addressLocality } : {}),
//       ...(postalCode ? { postalCode } : {}),
//       addressCountry: "PL",
//     };
//   }

//   // Geo – tylko jeśli mamy obie współrzędne
//   if (typeof latitude === "number" && typeof longitude === "number") {
//     localBusinessSchema.geo = {
//       "@type": "GeoCoordinates",
//       latitude,
//       longitude,
//     };
//   }

//   return (
//     <>
//       {/* ✅ LocalBusiness schema na URL oddziału */}
//       <JsonLd data={localBusinessSchema} />

//       <Breadcrumb />

//       <HeroSection
//         title={branch.title}
//         backgroundImage="/static/homepage/Header.webp"
//         heroImage={branch.image}
//         contentPosition="right"
//         imageVerticalAlign="center"
//         imageFit="contain"
//         variant="boxed-image"
//       />

//       <main className="self-stretch px-4 lg:px-28 py-20 space-y-6 text-xl">
//         <RichContentStatic image={branch.image} layout="text_left" content={branch.description} />

//         <BranchTabs
//           offerTab={branch.offerTab}
//           leaseTab={branch.leaseTab}
//           photocopiersTab={branch.photocopiersTab}
//           serviceTab={branch.serviceTab}
//         />
//       </main>

//       <BranchMap branch={branch} />
//       <ContactSection />
//       <NewsSection />
//     </>
//   );
// }

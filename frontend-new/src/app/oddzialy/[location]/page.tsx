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

type BranchSeo = {
  href: string;
  title: string;
  fullName?: string;
  image: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;

  offerTab?: unknown;
  leaseTab?: unknown;
  photocopiersTab?: unknown;
  serviceTab?: unknown;

  telephone?: string;
  phone?: string;
  tel?: string;
  email?: string;
  mail?: string;

  streetAddress?: string;
  addressLocality?: string;
  postalCode?: string;

  address?: {
    streetAddress?: string;
    street?: string;
    addressLocality?: string;
    locality?: string;
    postalCode?: string;
    postal?: string;
  };

  geo?: { latitude?: number; longitude?: number };
  coordinates?: { latitude?: number; longitude?: number };
  latitude?: number;
  longitude?: number;

  srcMap?: string;
  salesContact?: { phones?: string[]; emails?: string[] };
  serviceContact?: { phones?: string[]; emails?: string[] };
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

  const branch = branches.find((b) => b.href === `/oddzialy/${location}`) as
    | BranchSeo
    | undefined;

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

  const branch = branches.find((b) => b.href === `/oddzialy/${location}`) as
    | BranchSeo
    | undefined;

  if (!branch) {
    notFound();
  }

  const baseUrl = getBaseUrl();
  const branchUrl = absUrl(branch.href);
  const localBusinessId = `${branchUrl}#localbusiness`;

  const telephone = branch.telephone || branch.phone || branch.tel || "";
  const email = branch.email || branch.mail || "";

  const addressObj = branch.address;
  const streetAddress =
    addressObj?.streetAddress || addressObj?.street || branch.streetAddress || "";
  const addressLocality =
    addressObj?.addressLocality || addressObj?.locality || branch.addressLocality || "";
  const postalCode = addressObj?.postalCode || addressObj?.postal || branch.postalCode || "";

  const geo = branch.geo || branch.coordinates;
  const latitude = geo?.latitude ?? branch.latitude;
  const longitude = geo?.longitude ?? branch.longitude;

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: branch.fullName || branch.title,
    url: branchUrl,
    image: absUrl(branch.image) || "https://dks.pl/static/logo-dks.svg",
    parentOrganization: { "@id": `${baseUrl}/#organization` },
  };

  if (telephone) localBusinessSchema.telephone = telephone;
  if (email) localBusinessSchema.email = email;

  if (streetAddress || addressLocality || postalCode) {
    localBusinessSchema.address = {
      "@type": "PostalAddress",
      ...(streetAddress ? { streetAddress } : {}),
      ...(addressLocality ? { addressLocality } : {}),
      ...(postalCode ? { postalCode } : {}),
      addressCountry: "PL",
    };
  }

  if (typeof latitude === "number" && typeof longitude === "number") {
    localBusinessSchema.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    };
  }

  const addressLine = [streetAddress, postalCode, addressLocality].filter(Boolean).join(", ");

  const normalizeContact = (c?: { phones?: string[]; emails?: string[] }): BranchContact => ({
    phones: c?.phones?.length ? c.phones : [telephone || "-"],
    emails: c?.emails?.length ? c.emails : [email || "-"],
  });

  const branchForMap: BranchMapBranch = {
    fullName: branch.fullName || branch.title,
    address: addressLine || branch.title,
    phone: telephone || "-",
    email: email || "-",
    srcMap: branch.srcMap || "",
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
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import HeroSection from "@/app/(marketing)/HeroSection";
import RichContentStatic from "@/components/RichContent";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";

import { branches } from "@/content/Branch";
import BranchTabs from "@/components/BranchTabs";
import BranchMap from "@/components/BranchMap";
import NewsSection from "@/app/(marketing)/NewsSection";
import ContactSection from "@/app/(marketing)/ContactSection";

import JsonLd from "@/components/seo/JsonLd";

type PageProps = {
  params: {
    location: string;
  };
};

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(path: string) {
  const base = getBaseUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const branch = branches.find((b) => b.href === `/oddzialy/${params.location}`);

  if (!branch) {
    return {};
  }

  const title = branch.metaTitle || branch.title;
  const description =
    branch.metaDescription ||
    `Zapraszamy do oddziału DKS ${branch.fullName}. Sprawdź ofertę sprzedaży, dzierżawy i serwisu urządzeń drukujących.`;

  const url = absUrl(branch.href);
  const ogImage = absUrl(branch.image);

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "DKS",
      locale: "pl_PL",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: branch.fullName,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function OddzialPage({ params }: PageProps) {
  const branch = branches.find((b) => b.href === `/oddzialy/${params.location}`);

  if (!branch) {
    notFound();
  }

  const baseUrl = getBaseUrl();

  // URL i @id dla tego oddziału
  const branchUrl = absUrl(branch.href);
  const localBusinessId = `${branchUrl}#localbusiness`;

  // ⬇️ Poniższe pola dopasuj do struktury branches, jeśli masz inne nazwy.
  // Robię bezpieczne fallbacki, żeby build nie padł.
  const telephone =
    (branch as any).telephone || (branch as any).phone || (branch as any).tel || "+48XXXXXXXXX";
  const email = (branch as any).email || (branch as any).mail;

  const address = (branch as any).address || {};
  const streetAddress = address.streetAddress || address.street || (branch as any).streetAddress;
  const addressLocality = address.addressLocality || address.locality || (branch as any).addressLocality;
  const postalCode = address.postalCode || address.postal || (branch as any).postalCode;

  const geo = (branch as any).geo || (branch as any).coordinates || {};
  const latitude = geo.latitude ?? (branch as any).latitude;
  const longitude = geo.longitude ?? (branch as any).longitude;

  const localBusinessSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localBusinessId,
    name: branch.fullName || branch.title,
    url: branchUrl,
    image: absUrl(branch.image) || "https://dks.pl/static/logo-dks.svg",
    parentOrganization: {
      "@id": `${baseUrl}/#organization`,
    },
  };

  // Dodajemy tylko, jeśli mamy dane (żeby schema nie była “pusta”)
  if (telephone) localBusinessSchema.telephone = telephone;
  if (email) localBusinessSchema.email = email;

  // Address – tylko jeśli coś mamy
  if (streetAddress || addressLocality || postalCode) {
    localBusinessSchema.address = {
      "@type": "PostalAddress",
      ...(streetAddress ? { streetAddress } : {}),
      ...(addressLocality ? { addressLocality } : {}),
      ...(postalCode ? { postalCode } : {}),
      addressCountry: "PL",
    };
  }

  // Geo – tylko jeśli mamy obie współrzędne
  if (typeof latitude === "number" && typeof longitude === "number") {
    localBusinessSchema.geo = {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    };
  }

  return (
    <>
      {/* ✅ LocalBusiness schema na URL oddziału */}
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
          offerTab={branch.offerTab}
          leaseTab={branch.leaseTab}
          photocopiersTab={branch.photocopiersTab}
          serviceTab={branch.serviceTab}
        />
      </main>

      <BranchMap branch={branch} />
      <ContactSection />
      <NewsSection />
    </>
  );
}
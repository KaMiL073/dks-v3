import { notFound } from "next/navigation";

import HeroSection from "@/app/(marketing)/HeroSection";
import RichContentStatic from "@/components/RichContent";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";


import { branches } from "@/content/Branch";
import BranchTabs from "@/components/BranchTabs";
import BranchMap from "@/components/BranchMap";
import NewsSection from "@/app/(marketing)/NewsSection";
import ContactSection from "@/app/(marketing)/ContactSection";

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


export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const branch = branches.find(
    (b) => b.href === `/oddzialy/${params.location}`
  );

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
  // ✅ DEFINICJA branch – tego brakowało
  const branch = branches.find(
    (b) => b.href === `/oddzialy/${params.location}`
  );

  if (!branch) {
    notFound();
  }

  return (
    <>
      <Breadcrumb />

      <HeroSection
        title={branch.title}
        backgroundImage="/static/homepage/Header.webp"
        heroImage={branch.image}
        contentPosition="right"
        imageVerticalAlign="center"
        imageFit="contain"   // albo cover jeśli chcesz wypełniać
        variant="boxed-image"

      />
      
      <main className="self-stretch px-4 lg:px-28 py-20 space-y-6 text-xl">
        <RichContentStatic
          image={branch.image}
          layout="text_left"
          content={branch.description}
        />
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
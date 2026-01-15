import HeroSection from "@/app/(marketing)/HeroSection";
import Breadcrumb from "../oferta/components/Breadcrumb";
import BranchCard from "@/components/BranchCard";
import { branches } from "@/content/Branch";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(pathname: string) {
  const base = getBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

const canonicalPath = "/oddzialy";

const title = "Oddziały – DKS";
const description =
  "Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.";

const url = absUrl(canonicalPath);

// wrzuć plik do: /public/og/oddzialy.jpg
const ogImage = absUrl("/og/oddzialy.jpg");

export const metadata: Metadata = {
  title,
  description,

  keywords: [
    "oddziały DKS",
    "DKS oddziały",
    "serwis drukarek Polska",
    "urządzenia drukujące DKS",
    "poligrafia",
    "rozwiązania dla biur",
    "druk cyfrowy",
  ],

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
        alt: "Oddziały DKS w Polsce",
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

export default function OfferPage() {
  return (
    <>
      <Breadcrumb />
      <HeroSection
        title="Oddziały"
        subtitle="Explore our diverse range of solutions tailored to meet your needs. Whether you're looking for cutting-edge technology or reliable support."
        backgroundImage="/static/homepage/Header.webp"
        heroImage="/static/o-firmie/Rectangle-168.webp"
        buttonLabel="Skontaktuj się z nami"
        contentPosition="right"
        imageVerticalAlign="center"
      />


      <main className="self-stretch px-4 lg:px-28 py-20">
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {branches.map((branch) => (
            <BranchCard
              key={branch.href}
              branch={branch}
            />
          ))}
        </div>
    </main>
    </>
  );
}
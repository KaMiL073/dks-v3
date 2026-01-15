import type { Metadata } from "next";

import HeroSection from "@/app/(marketing)/HeroSection";
import ServiceContactSection from "@/app/_components/ServiceContactSection";
import RichContentStatic from "@/components/RichContent";
import Breadcrumb from "../oferta/components/Breadcrumb";
import IconsSection from "../_components/IconsSection";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(pathname: string) {
  const base = getBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

const canonicalPath = "/serwis-urzadzen-produkcyjnych";

const title = "Serwis produkcyjnych urządzeń drukujących – DKS";
const description =
  "Prowadzimy serwis produkcyjnych urządzeń drukujących. Specjalizujemy się w naprawach, konserwacji i uruchomieniach maszyn produkcyjnych Konica Minolta i Canon.";

const url = absUrl(canonicalPath);

// wrzuć plik do: /public/og/serwis-urzadzen-produkcyjnych.jpg
const ogImage = absUrl("/og/serwis-urzadzen-produkcyjnych.jpg");

export const metadata: Metadata = {
  title,
  description,

  keywords: [
    "serwis produkcyjnych urządzeń drukujących",
    "serwis maszyn produkcyjnych",
    "Production Printing",
    "Konica Minolta serwis",
    "Canon serwis",
    "uruchomienie maszyn produkcyjnych",
    "konserwacja maszyn drukujących",
    "DKS serwis",
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
        alt: title,
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

export default function SerwisUrzadzenProdukcyjnychPage() {
  return (
    <>
      <Breadcrumb />

      <HeroSection
        title="Serwis produkcyjnych urządzeń drukujących"
        backgroundImage="/static/homepage/Header.webp"
        heroImage="/static/serwis/Obraz.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        variant="full-height"
      />

      <main className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">
        <RichContentStatic
          image="/static/serwis/Obraz4.webp"
          layout="text_left"
          content={`
            <p>
              Prowadzimy <strong>serwis produkcyjnych urządzeń drukujących.</strong>
              W segmencie Production Printing wyspecjalizowaliśmy się w naprawach,
              konserwacji i uruchomieniach maszyn produkcyjnych Konica Minolta i Canon.
              Zaawansowane technologicznie systemy druku wymagają eksperckiej obsługi
              i wsparcia. Dlatego ten segment urządzeń obsługiwany jest przez specjalny
              zespół wysoko wykwalifikowanych techników.
            </p>
          `}
        />

        <IconsSection
          title="Nasze usługi serwisowe obejmują:"
          items={[
            { icon: "/static/icons/Tooltip.svg", label: "doradztwo i wsparcie techniczne" },
            { icon: "/static/icons/Power.svg", label: "montaż i uruchomienie" },
            { icon: "/static/icons/Published.svg", label: "okresowe przeglądy urządzeń" },
            { icon: "/static/icons/Monitor.svg", label: "usuwanie awarii" },
            { icon: "/static/icons/Settings.svg", label: "serwis gwarancyjny i pogwarancyjny" },
          ]}
        />

        <ServiceContactSection
          title="Kontakt z serwisem"
          phone1="801 004 104"
          phone2="58 350 66 05"
        />
      </main>
    </>
  );
}
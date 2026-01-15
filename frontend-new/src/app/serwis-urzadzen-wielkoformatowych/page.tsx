// frontend-new/src/app/serwis-urzadzen-wielkoformatowych/page.tsx
import type { Metadata } from "next";

import HeroSection from "@/app/(marketing)/HeroSection";
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

const canonicalPath = "/serwis-urzadzen-wielkoformatowych";

const title = "Serwis urządzeń wielkoformatowych KIP, Contex, Es-Te, Océ";
const description =
  "Oferujemy profesjonalny serwis drukarek wielkoformatowych znanych producentów: KIP, Contex, Es-Te, Océ. Zapraszamy do punktów serwisowych w 12 miastach Polski.";

const url = absUrl(canonicalPath);

// wrzuć plik do: /public/og/serwis-urzadzen-wielkoformatowych.jpg
const ogImage = absUrl("/og/serwis-urzadzen-wielkoformatowych.jpg");

export const metadata: Metadata = {
  title,
  description,

  keywords: [
    "serwis urządzeń wielkoformatowych",
    "serwis drukarek wielkoformatowych",
    "serwis ploterów",
    "KIP serwis",
    "Contex serwis",
    "Es-Te serwis",
    "Océ serwis",
    "kalibracja urządzeń wielkoformatowych",
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

export default function SerwisUrzadzenWielkoformatowychPage() {
  return (
    <>
      <Breadcrumb />

      <HeroSection
        title="Serwis urządzeń wielkoformatowych"
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
              Zapraszamy do korzystania z naszego <strong>serwisu urządzeń wielkoformatowych</strong>.
              Posiadamy certyfikaty autoryzacyjne do serwisowania, konserwacji i naprawiania 
              wielkoformatowych maszyn produkcyjnych KIP, składarek wielkoformatowych 
              es-te oraz kolorowych skanerów wielkoformatowych Contex. 
              Naprawiamy też maszyny introligatorskie, skanery oraz laserowe i atramentowe
              <a 
                title="drukarki wielkoformatowe" 
                href="https://www.dks.pl/oferta/rozwiazania-wielkoformatowe" 
                target="_self">
                  drukarki wielkoformatowe
              </a>
              większości liczących się na rynku producentów. Możesz zgłosić się do jednego 
              z naszych 12 oddziałów w największych miastach Polski. 
              Podejmujemy się naprawy dowolnego rodzaju sprzętu wielkoformatowego.
            </p>
          `}
        />

        <IconsSection
          title="Nasze usługi serwisowe obejmują:"
          items={[
            { icon: "/static/icons/Tooltip.svg", label: "doradztwo i wsparcie techniczne" },
            { icon: "/static/icons/Power.svg", label: "montaż i uruchomienie" },
            { icon: "/static/icons/Published.svg", label: "okresowe przeglądy urządzeń" },
            { icon: "/static/icons/Monitor.svg", label: "usuwanie awarii i kalibracja" },
            { icon: "/static/icons/Settings.svg", label: "serwis gwarancyjny i pogwarancyjny" },
          ]}
        />

        {/*
        <ServiceContactSection
          title="Kontakt z serwisem"
          phone1="801 004 104"
          phone2="58 350 66 05"
        />
        */}
      </main>
    </>
  );
}
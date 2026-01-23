import type { Metadata } from "next";

import HeroSection from "@/app/(marketing)/HeroSection";
import ServiceContactSection from "@/app/_components/ServiceContactSection";
import RichContentStatic from "@/components/RichContent";
import Breadcrumb from "../oferta/components/Breadcrumb";
import IconsSection from "../_components/IconsSection";

// DEBUG: na czas testów, żeby nie było cachowania i żebyś od razu widział zmiany w <head>
export const dynamic = "force-dynamic";

function safeUrl(input: string, fallback: string) {
  try {
    return new URL(input);
  } catch {
    return new URL(fallback);
  }
}

const metadataBase = safeUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl",
  "https://dks.pl"
);

const canonicalPath = "/serwis-urzadzen-produkcyjnych";

const title = "Serwis produkcyjnych urządzeń drukujących – DKS";
const description =
  "Prowadzimy serwis produkcyjnych urządzeń drukujących. Specjalizujemy się w naprawach, konserwacji i uruchomieniach maszyn produkcyjnych Konica Minolta i Canon.";

const ogImagePath = "/og/serwis-urzadzen-produkcyjnych.jpg";

export const metadata: Metadata = {
  metadataBase,

  title,
  description,

  keywords: [
    "serwis produkcyjnych urządzeń drukujących",
    "production printing",
    "serwis maszyn poligraficznych",
    "Konica Minolta serwis",
    "Canon serwis",
    "DKS serwis",
  ],

  alternates: {
    canonical: canonicalPath,
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title,
    description,
    url: canonicalPath,
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: ogImagePath,
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
    images: [ogImagePath],
  },
};

const leftHtml = `
  <p>
    Naszym Klientom zapewniamy fachowe doradztwo i <strong>wsparcie techniczne
    na wszystkich etapacheksploatacji systemów druku produkcyjnego</strong>. 
    Planując inwestycję w 
    <a title="drukarki poligraficzne" 
       href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" 
       target="_self">
        drukarki poligraficzne
    </a>, 
    możesz liczyć na pomoc w wyborze optymalnego urządzenia. Oferujemy 
    też pomoc w instalacji urządzenia i jego rozruchu. Prowadzimy też szkolenia 
    z obsługi. W trakcie eksploatacji wykonujemy doraźne naprawy, okresowe 
    przeglądy i remonty generalne.
  </p>
  <p>
    <p>
      Naszym Klientom zapewniamy fachowe doradztwo i <strong>wsparcie 
      techniczne na wszystkich etapacheksploatacji systemów druku 
      produkcyjnego</strong>. Planując inwestycję w 
      <a 
        title="drukarki poligraficzne" 
        href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" 
        target="_self">
          drukarki poligraficzne
      </a>, 
      możesz liczyć na pomoc w wyborze optymalnego urządzenia. 
      Oferujemy też pomoc w instalacji urządzenia i jego rozruchu. 
      Prowadzimy też szkolenia z obsługi. W trakcie eksploatacji 
      wykonujemy doraźne naprawy, okresowe przeglądy i remonty generalne.
    </p>
    <p>
      Naszym Klientom zapewniamy fachowe doradztwo i <strong>wsparcie 
      techniczne na wszystkich etapacheksploatacji systemów druku 
      produkcyjnego</strong>. Planując inwestycję w 
      <a 
        title="drukarki poligraficzne" 
        href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" 
        target="_self">
          drukarki poligraficzne
      </a>, 
        możesz liczyć na pomoc w wyborze optymalnego urządzenia. Oferujemy 
        też pomoc w instalacji urządzenia i jego rozruchu. Prowadzimy też szkolenia 
        z obsługi. W trakcie eksploatacji wykonujemy doraźne naprawy, okresowe 
        przeglądy i remonty generalne.</p>  
    </p>

`;

const rightHtml = `
  <p>
    Jeżeli potrzebujesz obsługi serwisowej maszyny do druku produkcyjnego, 
    zapraszamy do telefonicznego i bezpośredniego kontaktu: prowadzimy 
    <strong>12 punktów serwisowych w największych miastach w Polsce</strong>. 
    Otrzymasz pełną informację na temat sprzętu, cen i możliwości 
    zakupu – zarówno nowych, jak i używanych (poleasingowych) drukarek 
    i systemów poligraficznych.
  </p>
  <p>Na kompleksowo prowadzoną działalność serwisową składają się:</p>
  <strong>Na kompleksowo prowadzoną działalność serwisową składają się:</strong>
    <ul>
      <li>doradztwo i wsparcie techniczne</li>
      <li>montaż i uruchomienie;</li>
      <li>okresowe przeglądy urządzeń</li>
      <li>usuwanie awarii</li>
      <li>serwis gwarancyjny i pogwarancyjny.</li>   
    </ul>
  `
;
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
              zespół wysoko wykwalifikowanych techników. Dzięki regularnym inwestycjom 
              nieustannie podnosimy jakość świadczonych usług. Budujemy swoje kompetencje 
              poprzez intensywny program szkoleniowy, wdrażany przy aktywnym udziale 
              przedstawicieli producentów sprzętu drukującego.
            </p>
          `}
          expanded_columns={2}
          expand_left={leftHtml}
          expand_right={rightHtml}
        />

        <IconsSection
          title="Nasze usługi serwisowe obejmują:"
          items={[
            { icon: "/static/icons/Tooltip.svg", label: "doradztwo i wsparcie techniczne;" },
            { icon: "/static/icons/Power.svg", label: "montaż i uruchomienie" },
            { icon: "/static/icons/Published.svg", label: "okresowe przeglądy urządzeń" },
            { icon: "/static/icons/Monitor.svg", label: "usuwanie awarii;" },
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
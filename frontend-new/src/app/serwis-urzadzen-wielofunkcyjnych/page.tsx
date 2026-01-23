// frontend-new/src/app/serwis-urzadzen-wielofunkcyjnych/page.tsx
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

const canonicalPath = "/serwis-urzadzen-wielofunkcyjnych";

const title = "Serwis urządzeń wielofunkcyjnych Konica Minolta, HP, Canon, Ricoh";
const description =
  "Oferujemy autoryzowany serwis urządzeń wielofunkcyjnych i drukarek Konica Minolta, Canon, HP, Lexmark w 12 miastach w całej Polsce. Sprawdź szczegóły oferty.";

const url = absUrl(canonicalPath);

// wrzuć plik do: /public/og/serwis-urzadzen-wielofunkcyjnych.jpg
const ogImage = absUrl("/og/serwis-urzadzen-wielofunkcyjnych.jpg");

const leftHtml = `
  <p>
    Doradzamy naszym Klientom i wspieramy ich w zakresie montażu urządzenia 
    i jego uruchomienia. Posiadając we własnych magazynach części zamienne i
    <a 
      title="materiały eksploatacyjne" 
      href="https://www.dks.pl/materialy-eksploatacyjne">
        materiały eksploatacyjne
    </a> 
    do drukarek, możemy zaoferować naszym Klientom <strong> skrócony czas 
    oczekiwania na realizację zleceń serwisowych</strong> i zamówień. 
    Za serwisowanie i naprawy urządzeń drukujących odpowiedzialni są 
    wykwalifikowani specjaliści, którzy mają do dyspozycji rozbudowane 
    zaplecze techniczne. Wymienione atuty pozwalają nam świadczyć usługi 
    zgodne z najlepszymi światowymi standardami.
  </p>
  <h2>12 oddziałów serwisowych</h2>
  <p>
    Prowadzimy <strong> 12 oddziałów serwisowych</strong> w największych
    miastach Polski: w Gdańsku, Warszawie, Katowicach, Poznaniu, Łodzi, 
    Krakowie, Szczecinie, Bydgoszczy, Olsztynie, Rzeszowie, Białymstoku 
    i Wrocławiu. Dzięki temu możemy zaoferować szybki dojazd do Klienta 
    na terenie całego kraju. Oprócz naprawy drukarek i urządzeń 
    wielofunkcyjnych prowadzimy też 
      <a 
        title="serwis urządzeń produkcyjnych" 
        href="https://www.dks.pl/serwis-urzadzen-produkcyjnych" 
        target="_self">
          serwis urządzeń produkcyjnych
      </a> 
      i drukarek wielkoformatowych. Zapraszamy do korzystania 
      z naszych usług.
  </p>
    <h2>Profesjonalny serwis kserokopiarek Canon i Konica Minolta</h2>
  <p>
    Zapewniamy profesjonalny serwis kserokopiarek <strong>Canon</strong> 
    i <strong>Konica Minolta</strong>, dbając o najwyższą jakość 
    świadczonych usług. Nasz zespół specjalistów posiada szeroką wiedzę 
    i doświadczenie w serwisowaniu urządzeń tych renomowanych marek. 
    Dzięki temu jesteśmy w stanie szybko i skutecznie diagnozować 
    oraz usuwać usterki, a także przeprowadzać okresowe przeglądy 
    i konserwacje.
  </p>
  <p>
    Ponadto oferujemy również wsparcie techniczne oraz doradztwo 
    w zakresie optymalnego wykorzystania urządzeń, aby zapewnić 
    ich długotrwałe i bezproblemowe funkcjonowanie. Współpracujemy 
    zarówno z klientami indywidualnymi, jak i przedsiębiorstwami, 
    dostosowując nasze usługi do indywidualnych potrzeb i wymagań. 
    Gwarantujemy terminowe realizacje zleceń oraz konkurencyjne ceny, 
    co sprawia, że jesteśmy godnym zaufania partnerem w dziedzinie 
    serwisowania kserokopiarek Canon i Konica Minolta.
  </p>
`;
const rightHtml = `
  <h3>Nasze usługi serwisowe obejmują:</h3>
  <ul>
    <li>Diagnostykę i naprawę usterek,</li>
    <li>Przeglądy techniczne i konserwacje,</li>
    <li>Wymianę części eksploatacyjnych,</li>
    <li>Aktualizację oprogramowania oraz sterowników,</li>
    <li>Doradztwo techniczne i pomoc w doborze odpowiednich urządzeń.</li>
  </ul>
  <p>
    Dbamy o stałe podnoszenie kwalifikacji naszych serwisantów, 
    co pozwala nam na bieżąco śledzić nowinki technologiczne 
    oraz wprowadzać innowacyjne rozwiązania. Współpracujemy również 
    z producentami, co gwarantuje dostęp do oryginalnych części z
    amiennych oraz materiałów eksploatacyjnych.
  </p>
  <p>
    Nasza oferta serwisowa jest skierowana zarówno do klientów 
    indywidualnych, jak i przedsiębiorstw, które posiadają urządzenia 
    Canon i Konica Minolta. Jesteśmy elastyczni i dostosowujemy się do 
    potrzeb naszych klientów, oferując różne formy współpracy, takie jak 
    serwis gwarancyjny, pogwarancyjny czy umowy serwisowe.
  </p>
  <p>
    Nasza oferta serwisowa jest skierowana zarówno do klientów 
    indywidualnych, jak i przedsiębiorstw, które posiadają urządzenia 
    Canon i Konica Minolta. Jesteśmy elastyczni i dostosowujemy się do 
    potrzeb naszych klientów, oferując różne formy współpracy, 
    takie jak serwis gwarancyjny, pogwarancyjny czy umowy serwisowe.
  </p>
`;
export const metadata: Metadata = {
  title,
  description,

  keywords: [
    "serwis urządzeń wielofunkcyjnych",
    "serwis kserokopiarek",
    "serwis drukarek",
    "Konica Minolta serwis",
    "Canon serwis",
    "HP serwis",
    "Lexmark serwis",
    "Ricoh serwis",
    "Kyocera serwis",
    "autoryzowany serwis",
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

export default function SerwisUrzadzenWielofunkcyjnychPage() {
  return (
    <>
      <Breadcrumb />

      <HeroSection
        title="Autoryzowany serwis urządzeń wielofunkcyjnych"
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
              Realizujemy zapotrzebowanie na serwis urządzeń wielofunkcyjnych wszystkich popularnych marek, 
              które są dostępne na polskim rynku. Podejmujemy się różnorodnych działań serwisowych – 
              od usuwania drobnych usterek po kompleksowe przeglądy i naprawy.
            </p> 
            <p>
              Oferujemy autoryzowany serwis drukarek Canon i Konica Minolta, które stanowią bardzo liczną 
              i różnorodną część naszej oferty sprzętu drukującego. Znajdziesz w niej trwałe, 
              kompaktowe urządzenia do małych biur i wysokowydajne korporacyjne kserokopiarki wielofunkcyjne.
            </p>
            <p>
              Jedną z naszych specjalizacji jest naprawa drukarek HP – posiadamy potwierdzone certyfikatami 
              kompetencje do serwisowania sprzętu tej popularnej marki. Nowoczesne, wielofunkcyjne kserokopiarki 
              HP mają opinię jednych z najlepiej chronionych sieciowych maszyn drukujących. 
              Wyróżniają się wielopoziomową kontrolą dostępu i zabezpieczeniami przed atakami 
              hakerskimi. Naszym Klientom zapewniamy też profesjonalny serwis drukarek 
              i kserokopiarek Lexmark – wysokiej jakości sprzętu drukującego, oferowanego w przystępnej cenie. 
              Ponadto obsługujemy użytkowników urządzeń drukujących Ricoh i Kyocera oraz wielu innych marek.
            </p>
          `}
          expanded_columns={2}
          expand_left={leftHtml}
          expand_right={rightHtml}
        />

        <IconsSection
          title="Nasze usługi serwisowe obejmują:"
          items={[
            { icon: "/static/icons/Monitor.svg", label: "DIAGNOSTYKA I NAPRAWA USTEREK" },
            { icon: "/static/icons/Published.svg", label: "PRZEGLĄDY TECHNICZNE I KONSERWACJE" },
            { icon: "/static/icons/Settings.svg", label: "WYMIANA CZĘŚCI EKSPLOATACYJNYCH" },
            { icon: "/static/icons/Desktop.svg", label: "AKTUALIZACJA OPROGRAMOWANIA ORAZ STEROWNIKÓW" },
            { icon: "/static/icons/Tooltip.svg", label: "DORADZTWO TECHNICZNE I POMOC W DOBORZE ODPOWIEDNICH URZĄDZEŃ" },
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
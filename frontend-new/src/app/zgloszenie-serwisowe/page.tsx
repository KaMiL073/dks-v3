import type { Metadata } from "next";

import HeroSection from "@/app/(marketing)/HeroSection";
import ServiceContactSection from "@/app/_components/ServiceContactSection";
import RichContentStatic from "@/components/RichContentStatic";
import Breadcrumb from "../oferta/components/Breadcrumb";
import IconsSection from "../_components/IconsSection";
import ServiceCallForm from "@/components/forms/ServiceCallForm";


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
        title="Zgłoszenie serwisowe"
        backgroundImage="/static/homepage/Header.webp"
        heroImage="/static/serwis/obraz.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        variant="full-height"
      />

      <main className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">
        <ServiceCallForm  />
	      <RichContentStatic
          image="/static/serwis/Obraz4.webp"
          layout="text_right"
          content={`
            <p>Najważniejszą częścią naszych usług jest<strong> naprawa kserokopiarek</strong> 
            Konica Minolta, HP, Canon, Ricoh, Kyocera i wielu innych marek.To najpowszechniej 
            stosowane 
            <a 
            title="urządzenia wielofunkcyjne do biura" 
            href="https://www.dks.pl/oferta/rozwiazania-dla-biura/" 
            target="_blank" 
            rel="noopener noreferrer">
            urządzenia wielofunkcyjne do biura
            </a>, 
            które są chętnie kupowane i dzierżawione zarówno przez małe firmy, 
            jak i korporacje.<strong> Serwis kserokopiarek</strong> obejmuje nie tylko doraźne 
            naprawy, lecz także okresowe przeglądy techniczne oraz wymianę materiałów 
            eksploatacyjnych.
            </p>
            <p>W zakresie naszych usług znajduje się <strong> naprawa drukarek laserowych</strong>,
             które są najpowszechniej wykorzystywane w biurach przedsiębiorstw i korporacji. 
             Prowadzimy działania serwisowe i naprawcze, stosując oryginalne części zamienne i 
             <a 
             title="materiały eksploatacyjne do drukarek" 
             href="https://www.dks.pl/materialy-eksploatacyjne" 
             target="_blank" rel="noopener noreferrer">materiały eksploatacyjne do drukarek
             </a> 
             oraz wysokiej jakości zamienniki. Niezależnie od tego, jaką drukarkę laserową 
             użytkujesz, w przypadku awarii możesz zgłosić się do naszego serwisu. Zajmiemy 
             się każdym problemem i każdym typem maszyny drukującej.
             </p>
             <h2>Zgłoś online awarię urządzenia drukującego!</h2>
             <p>Awarie zdarzają się dokładnie wtedy, gdy najmniej się tego spodziewasz. 
             Ta zasada dotyczy również sprzętu drukującego. Naszym priorytetem jest jak 
             najszybsza reakcja serwisowa. Dlatego uruchomiliśmy formularz zgłoszenia 
             awarii on-line. Informację można wysłać każdego dnia i o każdej godzinie.
             </p>
          `}
          expanded_columns={2}
          // expand_left={leftHtml}
          // expand_right={rightHtml}
        />

        <RichContentStatic
          image="/static/serwis/obraz5.webp"
          layout="text_left"
          content={`
            <p>Za pośrednictwem elektronicznego formularza, 
  możesz dokonać zgłoszenia w następujących sprawach:</p>
  <ul>
    <li>
      <strong>awaria sprzętu drukującego</strong> – zgłoszenie jest niezwłocznie 
      przyjmowane przez pracowników naszego serwisu i przekazywane do realizacji 
      najszybciej, jak to tylko możliwe,
    </li>
    <li>
      <strong>
        zamówienie materiałów eksploatacyjnych
      </strong> 
      – formularz jest wygodnym sposobem składania zamówień i monitorowania dostawy
      materiałów eksploatacyjnych,
    </li>
    <li>
      <strong>zgłoszenie przeglądu </strong> 
      – internetowe zgłoszenie okresowego przeglądu maszyny drukującej jest szybkie 
      i bardzo komfortowe,
    </li>
    <li>
      <strong>odczyty liczników maszyn drukujących</strong> 
      – opcja dotyczy Klientów, którzy wybrali 
      <a 
      title="wynajem urządzeń drukujących" 
      href="https://www.dks.pl/wynajem-urzadzen-wielofunkcyjnych">
      wynajem urządzeń drukujących
      </a>: 
      odczyty stanu liczników są podstawą do naliczania wysokości miesięcznych opłat.
    </li>
  </ul>
  <p>
    Jeżeli potrzebujesz szybkiej konsultacji lub chcesz zgłosić problem, który nie ma 
    przypisanej kategorii w formularzu. W bezpośredniej rozmowie ze specjalistą otrzymasz 
    odpowiedzi na wszystkie pytania związane ze sprzętem drukującym. 
    Czekamy na Twoje zgłoszenie!
  </p>
  <h2>Szybka naprawa kserokopiarek</h2>
  <p>
    Nasza firma specjalizuje się w szybkiej naprawie kserokopiarek różnych marek, m.in. 
    takich jak Konica Minolta, HP, Canon, Ricoh, Kyocera. Jesteśmy świadomi, 
    jak ważne jest dla klientów, aby ich urządzenia drukujące były sprawne i gotowe do pracy. 
    Dlatego oferujemy usługi naprawy kserokopiarek na najwyższym poziomie, gwarantując szybką 
    i efektywną reakcję serwisową.
  </p>
  <p>W ramach naszej oferty szybkiej naprawy kserokopiarek zapewniamy:</p>
  <ul>
    <li>
      <strong>diagnostykę awarii</strong> 
      i ustalenie przyczyny problemu,
    </li>
    <li>
      <strong>wymianę uszkodzonych lub zużytych części</strong> 
      na oryginalne lub wysokiej jakości zamienniki,
    </li>
    <li><strong>profesjonalne doradztwo techniczne</strong> 
      oraz pomoc w doborze odpowiednich materiałów eksploatacyjnych,
    </li>
    <li>
      <strong>regularne przeglądy techniczne</strong> 
      oraz konserwację urządzeń, aby zapobiegać przyszłym awariom.
    </li>
  </ul>
  <p>Nasza firma posiada wykwalifikowany zespół serwisantów, 
    którzy mają wieloletnie doświadczenie w naprawie kserokopiarek. 
    Dzięki temu jesteśmy w stanie szybko zdiagnozować problem 
    i przeprowadzić naprawę, 
    minimalizując czas przestoju urządzenia drukującego.
  </p>
          `}
          expanded_columns={2}
          // expand_left={leftHtml}
          // expand_right={rightHtml}
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

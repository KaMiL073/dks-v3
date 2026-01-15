import RichContentStatic from "@/components/RichContent";
import TopSectionHeader from "@/components/TopSectionHeader";
import { Heading } from "@/components/ui/Typography/Heading";
import IndustryApplications from "../components/IndustryApplications";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Drukarki biurowe, wielkoformatowe i cyfrowe maszyny poligraficzne",
  description:
    "Dostarczamy urządzenia drukujące do biur, cyfrowe maszyny poligraficzne i drukarki wielkoformatowe. Sprzedajemy i wynajmujemy urządzenia nowe i poleasingowe.",
  keywords:
    "drukarki biurowe, drukarki laserowe, kserokopiarki, urządzenia wielofunkcyjne, MFP, plotery, maszyny poligraficzne, drukarki wielkoformatowe, druk cyfrowy, urządzenia do biura, Canon, HP, Konica Minolta, Kyocera, Lexmark",
  openGraph: {
    title: "Drukarki biurowe, wielkoformatowe i cyfrowe maszyny poligraficzne",
    description:
      "Dostarczamy urządzenia drukujące do biur, cyfrowe maszyny poligraficzne i drukarki wielkoformatowe. Sprzedajemy i wynajmujemy urządzenia nowe i poleasingowe.",
    url: "https://twojadomena.pl/oferta",
    siteName: "Twoja Firma",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "https://twojadomena.pl/images/drukarki-biuro-og.jpg",
        width: 1200,
        height: 630,
        alt: "Drukarki biurowe i maszyny poligraficzne",
      },
    ],
  },
  alternates: {
    canonical: "https://twojadomena.pl/oferta",
  },
};

const applications = [
  {
      title: "Logistyka i magazyny",
      description:
        "Luxriot scala obraz z ramp, hal i bram. i-PRO z AI analizuje kolejki i zajętość doków, a MOBOTIX monitoruje temperaturę i przegrzania.",
      benefit:
        "Mniej przestojów, większa efektywność i dane KPI dla WMS.",
      icon: "/static/icons/shelves_24dp_4A5565_FILL0_wght400_GRAD0_opsz24 1.svg",

    },
  {
    title: "Produkcja",
    description:
      "Kontrola procesów i jakości w czasie rzeczywistym. Detekcja PPE, analiza zdarzeń, termowizja maszyn.",
    benefit: "Większe bezpieczeństwo i redukcja awarii.",
    icon: "/static/icons/conveyor_belt_80dp_4A5565_FILL0_wght400_GRAD0_opsz48-1.svg",
  },
  {
    title: "Retail / Handel",
    description: "Heatmapy, analiza ruchu i kolejek, integracja z POS.",
    benefit:
      "Więcej danych o klientach, mniej strat i lepsze doświadczenie zakupowe.",
    icon: "/static/icons/add_shopping_cart_80dp_4A5565_FILL0_wght400_GRAD0_opsz48-1.svg",
    },
  {
    title: "Administracja publiczna i urzędy",
    description:
      "Centralne zarządzanie, audyt dostępu, ochrona danych osobowych.",
    benefit:
      "Transparentność, zgodność z przepisami i szybsze postępowania wyjaśniające.",
    icon: "/static/icons/Frame.svg",
    },
  {
    title: "Edukacja",
    description:
      "Monitoring kampusów, wejść i korytarzy z zachowaniem prywatności. Scenariusze alarmowe i integracja z systemem ogłoszeń.",
    benefit: "Bezpieczniejsze środowisko uczniów i kadry.",
    icon: "/static/icons/Frame-edukacja.svg" 
  },
  {
    title: "Ochrona zdrowia",
    description:
      "Monitoring SOR, aptek, karetek i stref leków. Termowizja dla obszarów krytycznych.",
    benefit:
      "Bezpieczniejsze warunki pracy i szybsze dochodzenia wewnętrzne.",
    icon: "/static/icons/ochrona-zdrowia.svg",
    },
  {
    title: "Transport i miasta (Smart City)",
    description:
      "ALPR, kontrola ruchu, analiza bus-pasów, tłoków, zdarzeń.",
    benefit: "Płynniejszy ruch i wyższy poziom bezpieczeństwa miejskiego.",
    icon: "/static/icons/smart-city.svg",
  },
  {
    title: "Energetyka",
    description:
      "Monitoring rozdzielni, transformatorów, linii i obiektów krytycznych. Termowizja i integracja z DCS/SCADA.",
    benefit:
      "Predykcja awarii, krótsze przestoje i zgodność z normami branżowymi.",
    icon: "/static/icons/energetyka.svg",
    },
];

export default function OfferPage() {
  return (
    <>
      <TopSectionHeader 
        title="Rozwiązania Video" 
        img="/static/homepage/Header.webp"
      />

      <main className="w-full px-4 sm:px-10 2xl:px-28 py-20 bg-white flex flex-col justify-start items-start gap-12 overflow-hidden">
        
        {/* 🔸 Wstępny opis */}
        <RichContentStatic
          title="Kompleksowe systemy monitoringu i analityki wizyjnej dla biznesu"
          header_type="h3"
          heading_styles="h5_semibold"
          content={`
            <p>
              Dział Rozwiązania Video DKS to centrum kompetencji w obszarze monitoringu i analityki obrazu.
              Tworzymy kompletne, skalowalne systemy „end-to-end” — od kamer i oprogramowania po integrację
              z infrastrukturą IT i bezpieczeństwa. Nasze rozwiązania zwiększają bezpieczeństwo, porządkują procesy
              i dostarczają dane, które wspierają decyzje biznesowe.
            </p>
            <ul>
              <li>Projektujemy architekturę systemu (on-premise)</li>
              <li>Dobieramy sprzęt i licencje</li>
              <li>Integrujemy z systemami IT, OT, KD, POS, ERP i WMS</li>
              <li>Zapewniamy zgodność z RODO i najwyższy poziom cyberbezpieczeństwa</li>
            </ul>
            <p>Od audytu i testów POC, przez wdrożenie i szkolenia, po utrzymanie i SLA.</p>
          `}
          image="/static/oferta/Obraz.webp"
          layout="text_right"
          text_button="Skontaktuj się z nami"
          url_button="/oferta/rozwiazania-video"
        />

        {/* 🔹 Kolejne sekcje */}
        <Heading as="h2" headingValue="h2_semibold">
          Platforma VMS - Luxriot
        </Heading>

        <RichContentStatic
          title="Elastyczne zarządzanie obrazem. W jednym miejscu"
          header_type="h3"
          heading_styles="h5_semibold"
          image="/static/oferta/Obraz-1.webp"
          layout="text_left"
          content={`
            <p>
              Luxriot to nowoczesna serwerowa platforma VMS do zarządzania monitoringiem wideo — niezawodna, skalowalna i intuicyjna w obsłudze.
              Łączy kamery wielu producentów bez konieczności wymiany sprzętu, oferując pełną kontrolę nad systemem.
            </p>
            <p>Najważniejsze funkcje:</p>
            <ul>
              <li>Integracja kamer IP różnych marek</li>
              <li>Intuicyjny interfejs: oś czasu, mapy, reguły alarmowe, powiadomienia</li>
              <li>Detekcja ruchu, maski prywatności, liczenie obiektów, obsługa audio</li>
              <li>Redundancja, archiwizacja, uprawnienia</li>
              <li>Skalowalność — od jednego obiektu po rozproszone sieci</li>
            </ul>
            <p>Z Luxriot budujesz elastyczne i bezpieczne środowisko monitoringu, które rośnie razem z Twoją organizacją.</p>
          `}
        />
        
        <Heading as="h2" headingValue="h2_semibold">
          Kamery MOBOTIX
        </Heading>
        <RichContentStatic
          title="Inteligentne kamery przemysłowe klasy premium"
          header_type="h3"
          heading_styles="h5_semibold"
          image="/static/oferta/Obraz-3.webp"
          layout="text_right"
          content={`
            <p>
              MOBOTIX to system kamer IP zaprojektowanych do pracy 24/7 w najtrudniejszych warunkach.
              Ich zdecentralizowana architektura sprawia, że rejestracja, analityka i logika zdarzeń działają bezpośrednio w kamerze — szybko i niezależnie.
            </p>
            <ul>
              <li>Wersje dualne i termowizyjne — detekcja przegrzań, pożarów, intruzów</li>
              <li>Wysoka odporność (IP66/67), brak ruchomych części, długa żywotność</li>
              <li>Wbudowana analityka (liczenie obiektów, strefy, klasyfikacja)</li>
              <li>Elastyczne reguły akcji (alarm, zapis, SIP, powiadomienie)</li>
              <li>Pełne szyfrowanie i kontrola retencji</li>
            </ul>
            <p>Idealne rozwiązanie dla przemysłu, energetyki, logistyki i infrastruktury krytycznej.</p>
          `}
        />


        <Heading as="h2" headingValue="h2_semibold">
          Kamery i-PRO z Analityką AI
        </Heading>
        <RichContentStatic
          title="Precyzyjna detekcja i inteligentne decyzje"
          header_type="h3"
          heading_styles="h5_semibold"
          image="/static/oferta/Obraz-4.webp"
          layout="text_left"
          content={`
            <p>
              Kamery i-PRO nowej generacji łączą jakość obrazu z wbudowaną analityką AI.
              Rozpoznają obiekty, klasyfikują zdarzenia i reagują w czasie rzeczywistym — lokalnie, bez obciążania serwerów.
            </p>
            <ul>
              <li>Szeroka gama modeli (kopułkowe, tubowe, PTZ, multisensor)</li>
              <li>Analityka AI: liczenie i klasyfikacja obiektów, strefy, nietypowe zachowania</li>
              <li>Certyfikaty bezpieczeństwa, szyfrowanie i podpisy firmware’u</li>
              <li>Maski prywatności, kontrola retencji, zgodność z RODO</li>
              <li>Integracja z Luxriot i otwarte SDK</li>
            </ul>
            <p>System i-PRO to bezpieczne, ekonomiczne i skalowalne rozwiązanie wizyjne, które wspiera ochronę i decyzje operacyjne.</p>
          `}
        />

        {/* 🔸 Sekcja 5 - Analityka */}
        <Heading as="h2" headingValue="h2_semibold">
          Analityka wizyjna
        </Heading>
        <RichContentStatic
          title="Zobacz więcej. Zrozum więcej."
          header_type="h3"
          heading_styles="h5_semibold"
          image="/static/oferta/Obraz-5.webp"
          layout="text_right"
          content={`
            <p>
              Analityka wizyjna zamienia obraz w dane. Umożliwia nie tylko obserwację,
              ale także interpretację zachowań, pomiar wydajności i reagowanie na zagrożenia.
            </p>
            <ul>
              <li>Detekcja i klasyfikacja obiektów (ludzie, pojazdy, PPE, wózki)</li>
              <li>Analiza zachowań (strefy, linie, loitering, porzucone obiekty)</li>
              <li>Funkcje biznesowe: liczenie osób, kolejki, heatmapy, KPI</li>
              <li>Detekcja kolizji człowiek–wózek, brak PPE, przekroczenie temperatury</li>
              <li>Integracja z ERP, WMS, SCADA, VMS</li>
              <li>Mechanizmy RODO: maski, anonimizacja, retencja</li>
            </ul>
            <p>Efekt: mniej fałszywych alarmów, szybsza reakcja i konkretne dane dla menedżerów operacyjnych.</p>
          `}
        />


        {/* 🔹 Kolejne sekcje analogicznie... */}

        <Heading as="h2" headingValue="h2_semibold">
          Zastosowania branżowe
        </Heading>

        <Heading as="h5" headingValue="h5_semibold">
          Inteligentne bezpieczeństwo dopasowane do sektora
        </Heading>

        <IndustryApplications applications={applications} />

        {/* 🔹 Sekcja końcowa (CTA) */} 
        <div className="self-stretch px-28 py-20 inline-flex flex-col justify-center items-center gap-12">
            <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                <Heading as="h3" headingValue="h3_semibold" className="w-1/3 text-center">
                    Zaufaj ekspertom 
                    <br /> Rozwiązań Video DKS
                </Heading>
                <div className="flex-1 py-4 flex justify-start items-center gap-2.5 overflow-hidden">
                    <p className="text-black text-xl font-normal leading-6">
                        Każdy projekt zaczynamy od zrozumienia Twoich potrzeb. Nasi specjaliści dobiorą optymalne technologie, zaprojektują system i zapewnią jego niezawodne działanie - od instalacji po serwis.
                    </p>
                </div>
            </div>
            <div className="self-stretch inline-flex justify-start items-start gap-12">
                <Heading as="h4" headingValue="h4_semibold" className="text-center">
                    Zyskaj pełną kontrolę nad bezpieczeństwem i procesami. Umów się na audyt lub prezentację możliwości systemu.
                </Heading>

            </div>
            <Button>
                Skontaktuj się z nami
            </Button>
        </div>
      </main>
    </>
  );
}
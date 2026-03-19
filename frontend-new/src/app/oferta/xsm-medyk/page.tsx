import RichContentStatic from "@/components/RichContentStatic";
import TopSectionHeader from "@/components/TopSectionHeader";
import { Heading } from "@/components/ui/Typography/Heading";
import IndustryApplications from "../components/IndustryApplications";
import Button from "@/components/ui/Button";
import IconsSection from "@/app/_components/IconsSection";
import DocumentsBenefitsSection from "../components/DocumentsBenefitsSection";
import RecruitmentSteps from "@/components/RecruitmentSteps";
import MedykAudienceSection from "@/app/oferta/components/MedykAudienceSection";
import ContactSection from "@/app/(marketing)/ContactSection";

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

const items = [
  {
    image: "/static/oferta/xsm-medyk-03.webp",
    title: "Digitalizacja dokumentów wewnętrznych i zewnętrznych",
  },
  {
    image: "/static/oferta/xsm-medyk-04.webp",
    title: "Automatyczne przypisywanie do pacjenta",
  },
  {
    image: "/static/oferta/xsm-medyk-05.webp",
    title: "Dostęp do dokumentów w każdym miejscu placówki",
  },
];

const audienceItems = [
  {
    icon: "/static/icons/Ward.svg",
    title: "Szpitale",
  },
  {
    icon: "/static/icons/Health-Metrics.svg",
    title: "Kliniki i centra medyczne",
  },
  {
    icon: "/static/icons/Home-Health.svg",
    title: "Przychodnie",
  },
  {
    icon: "/static/icons/Docs.svg",
    title: "Placówki z dużą ilością dokumentacji papierowej",
  },
  {
    icon: "/static/icons/Shield-Lock.svg",
    title: "Jednostki wymagające wysokiego poziomu bezpieczeństwa danych",
  },
];

export default function OfferPage() {
  return (
    <>
      <TopSectionHeader 
        title="XSM Medyk" 
        img="/static/homepage/Header.webp"
      />

      <main className="w-full px-4 sm:px-10 2xl:px-28 py-20 bg-white flex flex-col justify-start items-start gap-12 overflow-hidden">
        <Heading as="h2" headingValue="h2_semibold">
          Cyfrowa dokumentacja medyczna bez papieru, chaosu i strat czasu
        </Heading>
        
        <p className="self-stretch justify-start text-2xl font-semibold font-['Montserrat'] leading-7">
          XSM Medyk to system do digitalizacji i archiwizacji dokumentacji medycznej - gotowy do pracy w Twojej placówce.
        </p> 

        <IconsSection
          items={[
            { icon: "/static/icons/insert-page-break.svg", label: "Automatyczne skanowanie i indeksowanie dokumentów" },
            { icon: "/static/icons/assignment-turned-in.svg", label: "Natychmiastowy dostęp do dokumentacji z poziomu HIS" },
            { icon: "/static/icons/encrypted.svg", label: "Wyższe bezpieczeństwo danych medycznych" },
          ]}
        />
        


        <RichContentStatic
          title="Papierowa dokumentacja nadal spowalnia Twoją placówkę?"
          header_type="h2"
          heading_styles="h2_semibold"
          image="/static/oferta/xsm-medyk-01.webp"
          layout="text_right"
          content={`
            <p>
              <strong>SM Medyk </strong>
              Xerrex Scan Manager Medyk) to system zaprojektowany specjalnie dla placówek
               ochrony zdrowia, który umożliwia digitalizację dokumentacji papierowej 
               i jej bezpieczne przechowywanie w Elektronicznej Dokumentacji Medycznej 
               (EDM) – z pełną integracją z systemem HIS.
            </p>
          `}
        />
        

        <RichContentStatic
          title="Jedno rozwiązanie do całej dokumentacji medycznej"
          header_type="h2"
          heading_styles="h2_semibold"
          image="/static/oferta/xsm-medyk-02.webp"
          layout="text_left"
          content={`
            <p>
              <strong>SM Medyk </strong>
              Xerrex Scan Manager Medyk) to system zaprojektowany specjalnie dla placówek
               ochrony zdrowia, który umożliwia digitalizację dokumentacji papierowej 
               i jej bezpieczne przechowywanie w Elektronicznej Dokumentacji Medycznej 
               (EDM) – z pełną integracją z systemem HIS.
            </p>
          `}
        />

        <DocumentsBenefitsSection items={items} />;

        <RecruitmentSteps
          heading="Jak działa XSM Medyk?"
          steps={[
            {
              description:
                "Pracownik wybiera szablon dokumentu na skanerze lub komputerze",
            },
            {
              description:
                "Kontaktujemy się z wybranymi osobami i umawiamy rozmowę (telefoniczną lub online) – krótko poznajemy Twoje doświadczenie i oczekiwania.",
            },
            {
              description:
                "Dokument zostaje zeskanowany (pojedynczo lub seryjnie)",
            },
            {
              description:
                "System automatycznie rozpoznaje dane i zapisuje je w EDM",
            },
                        {
              description:
                "Dokument jest od razu dostępny w systemie HIS",
            },
          ]}
        />
        <p className="self-stretch justify-start text-Text-body text-2xl font-semibold font-['Montserrat'] leading-7">
          W wielu przypadkach cały proces to jedno kliknięcie: „Skanuj”.
        </p>

        <MedykAudienceSection items={audienceItems} />;

        <RichContentStatic
          title="Dlaczego XSM Medyk z DKS? "
          header_type="h2"
          heading_styles="h2_semibold"
          image="/static/oferta/xsm-medyk-06.webp"
          layout="text_left"
          content={`
            <ul>
              <li>Kompleksowe wdrożenie systemu i sprzętu.</li>
              <li>Możliwość wynajmu urządzeń zamiast zakupu.</li>
              <li>Wsparcie serwisowe i opieka powdrożeniowa.</li>
              <li>Dopasowanie rozwiązania do realnych procesów placówki.</li>
              <li>Integracja oprogramowania z urządzeniami MFP i skanerami oferowanymi przez DKS.</li>
            </ul>
          `}
        />
      </main>
      <ContactSection />
    </>
  );
}
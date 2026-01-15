import SectionHeader from "@/components/SectionHeader";
import TopSectionHeader from "@/components/TopSectionHeader";
import HeroSection from "@/app/(marketing)/HeroSection";
import ServiceContactSection from "@/app/_components/ServiceContactSection";
import RichContentStatic from "@/components/RichContent";
import Breadcrumb from "../oferta/components/Breadcrumb";
import { Heading } from "@/components/ui/Typography/Heading";
import IconsSection from "../_components/IconsSection";
import RecruitmentSteps from "@/components/RecruitmentSteps";
import CaseStudy from "../(marketing)/CaseStudy";

import type { Metadata } from "next";

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

export const metadata: Metadata = {
  metadataBase: baseUrl,

  title: "Kariera – DKS",
  description:
    "Poznaj możliwości pracy w DKS. Dołącz do zespołu ekspertów w obszarze nowoczesnych technologii druku, serwisu i rozwiązań IT dla firm.",

  keywords: [
    "kariera DKS",
    "praca DKS",
    "oferty pracy DKS",
    "praca w serwisie drukarek",
    "technologie druku praca",
    "DKS praca",
  ],

  alternates: {
    canonical: "/kariera",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Kariera – DKS",
    description:
      "Poznaj możliwości pracy w DKS. Dołącz do zespołu ekspertów w obszarze nowoczesnych technologii druku, serwisu i rozwiązań IT dla firm.",
    url: "/kariera",
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/og/kariera.jpg",
        width: 1200,
        height: 630,
        alt: "Kariera w DKS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Kariera – DKS",
    description:
      "Poznaj możliwości pracy w DKS. Dołącz do zespołu ekspertów w obszarze nowoczesnych technologii druku i serwisu.",
    images: ["/og/kariera.jpg"],
  },
};

export default function OfferPage() {
  return (
    <>
      <Breadcrumb />
      <HeroSection
          title="Praca w DKS" 
        //   subtitle="Sprawdzone technologie. Profesjonalne <br /> wsparcie. Atrakcyjne ceny."
        //   buttonLabel="Zamów bezpłatny audyt"
          backgroundImage="/static/homepage/Header.webp"
          heroImage="/static/kariera/kariera.webp"
          contentPosition="left"
          imageVerticalAlign="bottom"
          imageFit="contain"
          // imageObjectOffsetY={80} 
          variant="full-height"
      />

      <main className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">

        <IconsSection
          title="Dlaczego warto pracować w DKS?"
          items={[
            {
                icon: "/static/icons/Finance_Mode.svg",
                label: "STABILNOŚĆ",
                description: "Mamy ponad 30 lat doświadczenia w prowadzeniu biznesu w kraju i za granicą, tysiące klientów i zrealizowanych kontraktów w zakresie rozwiązań związanych z technologią wydruku i zarządzaniem dokumentami w firmach.",
            },
            {
            icon: "/static/icons/Award_Star.svg",
            label: "PRESTIŻ I MOŻLIWOŚCI",
            description:
                "Współpraca z najbardziej znanymi producentami i szeroka oferta produktów i usług dają nam przewagę w pozyskiwaniu nowych klientów i budowaniu relacji biznesowych opartych na kompleksowych rozwiązaniach.",
            },
            {
            icon: "/static/icons/Handshake.svg",
            label: "ZAUFANIE",
            description:
                "Nasza filozofia opiera się na dobrych relacjach i naturalnym podejściu do klientów. Od lat cieszymy się ich zaufaniem- wspieramy ich biznesy kompleksowymi, szytymi na miarę rozwiązaniami.",
            },
            {
            icon: "/static/icons/Psychology.svg",
            label: "INTENSYWNY ROZWÓJ",
            description:
                "Dynamiczny rozwój wiąże się z ciągłym rozwojem naszych struktur- działamy na dużą skalę i cały czas się rozwijamy: ponad 180 pracowników, 12 oddziałów w największych miastach w Polsce, sprawna sieć logistyczno- magazynowa.",
            },
            {
            icon: "/static/icons/School.svg",
            label: "PROFESJONALIZM",
            description:
                "Przywiązujemy dużą wagę do ciągłego podnoszenia kwalifikacji, szkoleń i podążania za nowinkami technicznymi, by nasi pracownicy czuli się ekspertami w tym co robią i mogli awansować w strukturach firmy.",
            },
            {
            icon: "/static/icons/Work_History.svg",
            label: "KOMFORT PRACY",
            description:
                "Zatrudniamy naszych pracowników w ramach umowy o pracę, zapewniamy komfortowe narzędzia pracy i wygodny system pracy (zwykle 8:00-16:00 od poniedziałku do piątku).",
            },
            {
            icon: "/static/icons/Volunteer_Activism.svg",
            label: "DLA PRACOWNIKA",
            description:
                "Nasi Pracownicy mogą skorzystać z oferty grupowego ubezpieczenia na życie i prywatnej opieki medycznej, a także z dofinansowania do karty Multisport i udziału w różnych wydarzeniach sportowych jako Team DKS .",
            },
            {
            icon: "/static/icons/Diversity_3.svg",
            label: "ZESPÓŁ",
            description:
                "Chcemy, by DKS był przyjaznym miejscem pracy, gdzie pracownicy dobrze się czują, mają do siebie zaufanie, współpracują ze sobą, dzielą się z innymi wiedzą i mogą rozwijać swoje pasje i zainteresowania. Praca w DKS, to praca z profesjonalistami pełnymi pasji!",
            },

          ]}
        />

        <RecruitmentSteps
            steps={[
                {
                description:
                    "Analizujemy dokładnie wszystkie przesłane do nas aplikacje pod kątem tego, które z nich najbardziej pasują do wyzwań, które pojawiają się w naszej firmie.",
                },
                {
                description:
                    "Kontaktujemy się z wybranymi osobami i umawiamy rozmowę (telefoniczną lub online) – krótko poznajemy Twoje doświadczenie i oczekiwania.",
                },
                {
                description:
                    "Spotkanie rekrutacyjne / rozmowa techniczna – w zależności od roli. Sprawdzamy dopasowanie do zespołu i stanowiska.",
                },
                {
                description:
                    "Decyzja i oferta – wracamy z informacją zwrotną i kolejnymi krokami (umowa, onboarding).",
                },
            ]}
            />
        
        <CaseStudy />

        <div className="self-stretch px-28 py-20 bg-surface-page inline-flex justify-center items-center gap-6 flex-wrap content-center">
            <div className="flex-1 justify-start text-Text-body text-base font-normal font-['Montserrat'] leading-5">Kiedy w 1993r. przewoziliśmy pierwszą używaną drukarkę z Niemiec, urządzenia wielofunkcyjne były w Polsce jeszcze nowością. Idea była prosta: chcieliśmy dostarczać klientom rozwiązania, które będą usprawniać ich pracę, a przy tym będą dostosowane do ich potrzeb i możliwości. Dziś, po ponad 32 latach, współpracując z najlepszymi producentami na rynku, zmieniając standardowe podejście do sprzedaży na rzecz bycia profesjonalnym doradcą, na którym można polegać, a także sięgając po najnowsze technologie związane z drukiem cyfrowym, wielkoformatowym i software- możemy śmiało powiedzieć, że jesteśmy jednym z największych dystrybutorów i serwisów urządzeń wielofunkcyjnych w kraju, zapewniając płynną i profesjonalą obsługę w zakresie doradztwa i serwisu w 12 największych polskich miastach.</div>
            <div className="flex-1 justify-start text-Text-body text-base font-normal font-['Montserrat'] leading-5">Nasz sukces zawdzięczamy ludziom, którzy na co dzień tworzą nasz Zespół - ponad 180 pracowników, którzy tak jak my, podchodzą do klientów kompleksowo i profesjonalnie, a przy tym wciąż chcą się rozwijać w kierunku nowoczesnych technologii. Dołącz do naszego Zespołu i przekonaj się, że DKS to świetne wyzwanie i wyjątkowe miejsce pracy.<br/>Daj nam znać, że jesteś gotowy do podjęcia nowych wyzwań nawet jeśli nie prowadzimy aktualnie rekrutacji w Twoim mieście. Prześlij nam swoją aplikację na adres: rekrutacje@dks.plz dopiskiem w tytule e-maila: STRONA KARIERY. Przed nami cały czas pojawiają się nowe wyzwania- jeśli nie dziś, może będziemy potrzebowali kogoś takiego jak Ty w najbliższej przyszłości. </div>
        </div>
      </main>
    </>
  );
}
import SectionHeader from "@/components/SectionHeader";
import TopSectionHeader from "@/components/TopSectionHeader";
import HeroSection from "@/app/(marketing)/HeroSection";
import ServiceContactSection from "@/app/_components/ServiceContactSection";
import RichContentStatic from "@/components/RichContent";
import Breadcrumb from "../oferta/components/Breadcrumb";
import { Heading } from "@/components/ui/Typography/Heading";
import IconsSection from "../_components/IconsSection";
import StatsSection from "@/components/StatsSection";
import OfferSection from "../(marketing)/OfferSection";
import PartnersSection from "../(marketing)/PartnersSection";
import CaseStudy from "../(marketing)/CaseStudy";
import ContactSection from "../(marketing)/ContactSection";

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl").replace(/\/$/, "");
}

function absUrl(pathname: string) {
  const base = getBaseUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

const canonicalPath = "/o-firmie";

const title = "O firmie – DKS";
const description =
  "Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.";

const url = absUrl(canonicalPath);

// wrzuć plik do: /public/og/o-firmie.jpg
const ogImage = absUrl("/og/o-firmie.jpg");

const leftHtml = `<div>
  <strong >Jesteśmy blisko naszych Klientów</strong>
  <br/>
  <p>
    Prowadzimy 12 oddziałów w największych miastach wojewódzkich w Polsce. Jesteśmy blisko
    naszych Klientów. Dzięki temu możemy skrócić znacznie czas realizacji zamówień 
    i zagwarantować błyskawiczną reakcję serwisową. Prowadzimy serwis urządzeń 
    wielofunkcyjnych, maszyn produkcyjnych i drukarek wielkoformatowych.
    <br/> <br />
    Zapraszamy do kontaktu telefonicznego, mailowego i wizyt w oddziałach 
    DKS!ądzeń drukujących, ale nie chcą ponosić kosztów ich zakupu.
  </p>
</div>`;

const rightHtml = `<div>
  <strong>Sprzedaż i dzierżawa nowych i używanych maszyn drukujących</strong>
  <p>
    Sprzedajemy nowy i używany (poleasingowy) sprzęt drukujący. Alternatywą 
    dla zakupu jest wynajem urządzeń wielofunkcyjnych: zamieniasz kosztowną 
    inwestycję na miesięczną opłatę czynszową.
  </p>
  <br />
  <p>
    Wszystkie używane maszyny drukujące są drobiazgowo sprawdzane, naprawiane 
    i testowane. Oszczędzasz pieniądze i masz pewność długiej, niezawodnej 
    pracy. W przypadku nowych maszyn zabezpieczeniem przed kosztami awarii 
    jest gwarancja. Z myślą o użytkownikach sprzętu w okresie pogwarancyjnym 
    stworzyliśmy Kontrakt Obsługi Serwisowej. Naszym celem jest zabezpieczenie 
    komfortu i poczucia bezpieczeństwa ekonomicznego wszystkich użytkowników.
  </p>
</div>`;

export const metadata: Metadata = {
  title,
  description,

  keywords: [
    "DKS",
    "o firmie DKS",
    "sprzęt drukujący",
    "urządzenia drukujące",
    "rozwiązania dla biur",
    "poligrafia",
    "druk cyfrowy",
    "materiały eksploatacyjne",
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
        alt: "O firmie DKS",
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
        title="DKS – dostawca sprzętu do druku biurowego, poligraficznego i wielkoformatowego"
        subtitle="Explore our diverse range of solutions tailored to meet your needs. Whether you're looking for cutting-edge technology or reliable support."
        backgroundImage="/static/homepage/Header.webp"
        // heroImage="/static/serwis/Obraz.webp"
        buttonLabel="Skontaktuj się z nami"
      />

      <main>

        <StatsSection />
        <OfferSection />
        <PartnersSection />
        <CaseStudy />
        
        <div className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">
          <RichContentStatic
            image="/static/o-firmie/o-firmie.webp"
            layout="text_left"
            content={`
              <p>
                Jesteśmy czołowym polskim dostawcą sprzętu drukującego czterech renomowanych marek: 
                Canon, Lexmark, HP i Konica Minolta. Oferujemy nowe i używane urządzenia do użytku 
                biurowego, do zastosowań poligraficznych i druku wielkoformatowego. 
                Dostarczamy drukarki 
                <a 
                  title="urządzenia wielofunkcyjne do biura" 
                  href="https://www.dks.pl/oferta/rozwiazania-dla-biura"
                  target="_self">
                    urządzenia wielofunkcyjne do biura
                </a>,
                kserokopiarki, skanery i niszczarki. W naszej ofercie znajdziesz też oprogramowanie 
                do zarządzania drukiem, skanowaniem i obiegiem dokumentów..
              </p>
              <p>
                Niezwykle ważną i różnorodną częścią naszej oferty są maszyny do wysokonakładowego 
                druku produkcyjnego. Dostarczamy drukarki i 
                <a 
                  title="sprzęt poligraficzny " 
                  href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii"
                  target="_self">
                    sprzęt poligraficzny 
                </a>, 
                dla drukarń cyfrowych. Instalujemy maszyny i przeprowadzamy rozruch systemów druku 
                u naszych Klientów. Obok urządzeń drukujących wprowadziliśmy 
                do oferty maszyny introligatorskie cenionej na całym świecie marki Duplo.
              </p>
              <p>
                Ostatni z trzech głównych działów naszej oferty wypełniają wielkoformatowe 
                urządzenia drukujące, szeroko wykorzystywane w usługach i branży reklamowej. 
                Sprzedajemy m.in. skanery Contex, plotery tonerowe KIP, 
                <span class="underline decoration-1">składarki offline</span> 
                es-te, 
                plotery atramentowe Océ, OKI, Canon, Konica Minolta.
              </p>
            `}
          expanded_columns={2}
          expand_left={leftHtml}
          expand_right={rightHtml}
        />
        </div>

        <ContactSection />
        

        {/* <ServiceContactSection
          title="Kontakt z serwisem"
          phone1="801 004 104"
          phone2="58 350 66 05"
        /> */}
      </main>
    </>
  );
}




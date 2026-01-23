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

const canonicalPath = "/kontrakt-obslugi-serwisowej";

const title =
  "Kontrakt Obsługi Serwisowej: nie płać za awarie drukarek w firmie!";
const description =
  "Zachęcamy do korzystania z Kontraktu Obsługi Serwisowej (KOS). To umowa zabezpieczająca przed kosztami awarii sprzętu drukującego – również po ustaniu gwarancji.";

const url = absUrl(canonicalPath);

// wrzuć plik do: /public/og/kontrakt-obslugi-serwisowej.jpg
const ogImage = absUrl("/og/kontrakt-obslugi-serwisowej.jpg");

export const metadata: Metadata = {
  title,
  description,

  keywords: [
    "kontrakt obsługi serwisowej",
    "KOS",
    "serwis drukarek w firmie",
    "koszty druku w firmie",
    "outsourcing druku",
    "umowa serwisowa drukarki",
    "serwis kserokopiarek",
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

const leftHtml = `
  <h2>Koszty eksploatacyjne wkalkulowane w cenę pojedynczego wydruku</h2>
  <p>
    Istotą umowy KOS jest 
    <strong>zamiana trudnych do przewidzenia 
    kosztów eksploatacji sprzętu drukującego na stały koszt pojedynczego 
    wydruku</strong>. Gwarantujemy niezmienną stawkę za jedną wydrukowaną 
    stronę w całym okresie obowiązywania umowy. 
    Oznacza to, że miesięczna opłata zależy od liczby wydruków: płacisz 
    tylko za faktycznie wykonane zadania, a nie za utrzymywanie urządzenia 
    w gotowości.
  </p>
  <p>
    KOS pozwala łatwo skalkulować i zaplanować w budżecie wydatki ponoszone 
    na drukowanie i przetwarzanie dokumentów firmowych. Oznacza też wymierną 
    oszczędność czasu, który możesz przeznaczyć na podstawową działalność biznesową. 
    KOS to maksymalny komfort użytkowania foty drukującej.
  </p>
`;

const rightHtml = `
  <p>Korzyści z umowy KOS:</p>
  <ul>
    <li>równomierne rozłożenie kosztów eksploatacji;</li>
    <li>łatwa kalkulacja miesięcznych kosztów druku</li>
    <li>stała opieka i skrócony czas reakcji serwisowej</li>
    <li>uzupełnianie materiałów eksploatacyjnych zawsze na czas</li>
    <li>wydłużony okres eksploatacji maszyny</li> 
    <li>gwarancja jakości wydruków i sprzętu</li>
    <li>wygoda i oszczędność czasu)</li>
  </ul>
`;

export default function KontraktObslugiSerwisowejPage() {
  return (
    <>
      <Breadcrumb />

      <HeroSection
        title="Kontrakt Obsługi Serwisowej"
        backgroundImage="/static/homepage/Header.webp"
        heroImage="/static/serwis/Obraz.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        variant="full-height"
      />

      <main className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">
        <RichContentStatic
          image="/static/serwis/Obraz2.webp"
          layout="text_right"
          content={`
            <p>
              Opracowany przez nas <strong>Kontrakt Obsługi Serwisowej (KOS)</strong> to umowa,
              która zwalnia użytkownika sprzętu drukującego z ponoszenia kosztów usuwania awarii
              i zakupu niezbędnych materiałów eksploatacyjnych. Po jej podpisaniu nie musisz
              zajmować się zakupem tonerów, terminową wymianą zużytych podzespołów, planową
              konserwacją czy doraźnymi naprawami.
            </p>

            <strong>Koszty eksploatacyjne wkalkulowane w cenę pojedynczego wydruku</strong>

            <p>
              Istotą umowy KOS jest <strong>zamiana trudnych do przewidzenia kosztów
              eksploatacji sprzętu drukującego na stały koszt pojedynczego wydruku</strong>.
              Gwarantujemy niezmienną stawkę za jedną wydrukowaną stronę w całym okresie
              obowiązywania umowy.
            </p>

            <p>
              KOS pozwala łatwo zaplanować wydatki na drukowanie dokumentów firmowych
              oraz oszczędza czas, który możesz przeznaczyć na podstawową działalność
              biznesową. To maksymalny komfort użytkowania floty drukującej.
            </p>
          `}
          expanded_columns={2}
          expand_left={leftHtml}
          expand_right={rightHtml}
        />

        <IconsSection
          title="Korzyści z umowy KOS"
          items={[
            {
              icon: "/static/icons/Balance.svg",
              label: "RÓWNOMIERNE ROZŁOŻENIE<br/>KOSZTÓW EKSPLOATACJI",
            },
            {
              icon: "/static/icons/calculate.svg",
              label: "ŁATWA KALKULACJA<br/>MIESIĘCZNYCH<br/>KOSZTÓW DRUKU",
            },
            {
              icon: "/static/icons/handshake.svg",
              label: "STAŁA OPIEKA I SKRÓCONY CZAS<br/>REAKCJI SERWISOWEJ",
            },
            {
              icon: "/static/icons/equalizer.svg",
              label: "UZUPEŁNIANIE MATERIAŁÓW<br/>EKSPLOATACYJNYCH NA CZAS",
            },
            {
              icon: "/static/icons/Hourglass.svg",
              label: "WYDŁUŻONY OKRES EKSPLOATACJI MASZYN",
            },
            {
              icon: "/static/icons/Diamond.svg",
              label: "GWARANCJA JAKOŚCI WYDRUKÓW I SPRZĘTU",
            },
            {
              icon: "/static/icons/Clock.svg",
              label: "WYGODA I OSZCZĘDNOŚĆ CZASU",
            },
          ]}
        />
      </main>
    </>
  );
}
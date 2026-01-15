import type { Metadata } from "next";
import Image from "next/image";
import HeroSection from "@/app/(marketing)/HeroSection";
import Breadcrumb from "../oferta/components/Breadcrumb";
import FaqAccordion from "@/components/FaqAccordion";
import CustomerZoneFormsAccordion from "@/components/CustomerZoneFormsAccordion";

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

export const metadata: Metadata = {
  metadataBase: baseUrl,

  title: "Strefa klienta – DKS",
  description:
    "Strefa klienta DKS – odpowiedzi na najczęściej zadawane pytania oraz dane kontaktowe do działów obsługi.",

  alternates: {
    canonical: "/strefa-klienta",
  },

  robots: {
    index: false,
    follow: true,
  },

  openGraph: {
    title: "Strefa klienta – DKS",
    description:
      "Strefa klienta DKS – FAQ oraz dane kontaktowe do działów obsługi.",
    url: "/strefa-klienta",
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
  },
};

export default function CertyfikatyPage() {
  return (
    <>
      <Breadcrumb />

      <HeroSection
        title="Strefa klienta"
        backgroundImage="/static/homepage/Header.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        variant="full-height"
      />
<CustomerZoneFormsAccordion />

      <main className="w-full bg-white flex flex-col gap-12">
        
        
        {/* ====== HEADER FAQ ====== */}
        <section className="px-6 md:px-28 py-20 bg-gray-300">
          <h1 className="text-Text-headings text-4xl font-semibold font-['Montserrat'] leading-[56px]">
            FAQ
          </h1>
        </section>

        {/* ====== FAQ ====== */}
        <FaqAccordion />

        {/* ====== KONTAKTY ====== */}
        <section className="w-full px-6 md:px-28 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KSIĘGOWOŚĆ */}
            <div className="bg-gray-300 px-8 py-8 flex items-center gap-8 min-h-[180px]">
              <div className="w-20 h-20 flex items-center justify-center shrink-0">
                <Image
                  src="/static/icons/Difference.svg"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>

              <div>
                <div className="text-Text-headings text-2xl font-semibold font-['Montserrat']">
                  Dział Księgowości
                </div>
                <div className="mt-3 text-Text-body text-base leading-6">
                  Telefon: 532 362 392
                  <br />
                  E-mail: ksiegowosc@dks.pl
                </div>
              </div>
            </div>

            {/* WINDYKACJA */}
            <div className="bg-gray-300 px-8 py-8 flex items-center gap-8 min-h-[180px]">
              <div className="w-20 h-20 flex items-center justify-center shrink-0">
                <Image
                  src="/static/icons/Payments.svg"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>

              <div>
                <div className="text-Text-headings text-2xl font-semibold font-['Montserrat']">
                  Dział Windykacji
                </div>
                <div className="mt-3 text-Text-body text-base leading-6">
                  Telefon: 58 763 06 10
                  <br />
                  E-mail: windykacja@dks.pl
                </div>
              </div>
            </div>

            {/* EKSPORT */}
            <div className="bg-gray-300 px-8 py-8 flex items-center gap-8 min-h-[180px]">
              <div className="w-20 h-20 flex items-center justify-center shrink-0">
                <Image
                  src="/static/icons/Public.svg"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>

              <div>
                <div className="text-Text-headings text-2xl font-semibold font-['Montserrat']">
                  Dział Eksportu
                </div>
                <div className="mt-3 text-Text-body text-base leading-6">
                  Telefon: +48 664 941 146
                  <br />
                  Telefon: +48 600 338 951
                  <br />
                  E-mail: export.copiers@dks.pl
                </div>
              </div>
            </div>

            {/* BOK */}
            <div className="bg-gray-300 px-8 py-8 flex items-center gap-8 min-h-[180px]">
              <div className="w-20 h-20 flex items-center justify-center shrink-0">
                <Image
                  src="/static/icons/Support_agent.svg"
                  alt=""
                  width={80}
                  height={80}
                />
              </div>

              <div>
                <div className="text-Text-headings text-2xl font-semibold font-['Montserrat']">
                  Dział Obsługi Klienta
                </div>
                <div className="mt-3 text-Text-body text-base leading-6">
                  Telefon: 58 350 66 05
                  <br />
                  Telefon: 801 004 104
                  <br />
                  wew. 1 – zgłoszenia serwisowe
                  <br />
                  wew. 2 – zamówienia materiałów eksploatacyjnych
                  <br />
                  wew. 3 – rozliczenia dotyczące umów i faktur
                  <br />
                  E-mail: serwis@dks.pl
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
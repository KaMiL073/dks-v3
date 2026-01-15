import type { Metadata } from "next";
import HeroSection from "@/app/(marketing)/HeroSection";
import Breadcrumb from "../oferta/components/Breadcrumb";
import ContactSection from "../(marketing)/ContactSection";
import BranchCard from "@/components/BranchCard";
import { branches } from "@/content/Branch";

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");


export const metadata: Metadata = {
  metadataBase: baseUrl,

  title: "Kontakt do DKS – dane teleadresowe 12 oddziałów w Polsce",
  description:
    "Dane kontaktowe firmy DKS – oddziały w Gdańsku, Warszawie, Katowicach, Poznaniu, Łodzi, Krakowie, Szczecinie, Bydgoszczy, Olsztynie, Rzeszowie, Białymstoku i Wrocławiu.",

  keywords: [
    "kontakt DKS",
    "DKS oddziały",
    "DKS kontakt",
    "serwis drukarek kontakt",
    "drukarki DKS kontakt",
    "DKS Polska",
  ],

  alternates: {
    canonical: "/kontakt",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Kontakt do DKS – dane teleadresowe 12 oddziałów w Polsce",
    description:
      "Dane kontaktowe firmy DKS – oddziały w 12 największych miastach Polski. Skontaktuj się z centralą lub najbliższym oddziałem.",
    url: "/kontakt",
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
  },

  twitter: {
    card: "summary",
    title: "Kontakt do DKS",
    description:
      "Skontaktuj się z firmą DKS – oddziały w 12 miastach w całej Polsce.",
  },
};

export default function OfferPage() {
  return (
    <>
        <Breadcrumb />
        <HeroSection
            variant="full-height"
            title="Skontaktuj się z nami"
            // subtitle="Explore our diverse range of solutions tailored to meet your needs. Whether you're looking for cutting-edge technology or reliable support."
            backgroundImage="/static/homepage/Header.webp"
            heroImage="/static/kontakt/kontakt.webp"
            // buttonLabel="Skontaktuj się z nami"
            contentPosition="left"
            imageVerticalAlign="bottom"
            imageFit="contain"
            // imageObjectOffsetY={80} 
        />

      <main>
        
        <div className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">
            <ContactSection />
            
            <div className="self-stretch px-28 py-20 bg-gray-300  inline-flex justify-between items-center">
                <div className="flex-1 flex justify-center items-center gap-16">
                    <div className="flex-1 inline-flex flex-col justify-start items-start gap-8">
                        <div className="self-stretch justify-start text-Text-body text-4xl font-semibold font-['Montserrat'] leading-[56px]">Strefa klienta</div>
                        <div className="self-stretch justify-start text-black text-2xl font-normal font-['Montserrat'] leading-7">Discover our innovative solutions that empower your business to thrive in a competitive landscape. </div>
                    </div>
                    <div data-property-1="menu dark" className="self-stretch flex justify-center items-center gap-2.5">
                        <div className="w-9 h-16 bg-icon-primary" />
                    </div>
                </div>
            </div>

            <div className="flex justify-center items-center gap-6 flex-wrap">
            {branches.map((branch) => (
                <BranchCard
                key={branch.href}
                branch={branch}
                />
            ))}
            </div>

        </div>

        {/* <ServiceContactSection
          title="Kontakt z serwisem"
          phone1="801 004 104"
          phone2="58 350 66 05"
        /> */}
      </main>
    </>
  );
}
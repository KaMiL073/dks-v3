import React from "react";

import HeroSection from "./(marketing)/HeroSection"; 
import OfferSection from "./(marketing)/OfferSection";
import PromoSection from "./(marketing)/PromoSection";
import PartnersSection from "./(marketing)/PartnersSection";
import CaseStudy from "./(marketing)/CaseStudy";
import NewsSection from "./(marketing)/NewsSection";
import ContactSection from "./(marketing)/ContactSection";
import AboutSection from "./(marketing)/AboutSection";


export const metadata = {
  title: "Dostawca sprzętu drukującego dla biur, reklamy i poligrafii – DKS",
  description:
    "Jesteśmy wiodącym dostawcą kserokopiarek i drukarek biurowych, maszyn poligraficznych i wielkoformatowych. Mamy oddziały w 12 największych miastach w Polsce.",
  keywords: "",

  openGraph: {
    title: "Dostawca sprzętu drukującego dla biur, reklamy i poligrafii – DKS",
    description:
      "Jesteśmy wiodącym dostawcą kserokopiarek i drukarek biurowych, maszyn poligraficznych i wielkoformatowych. Mamy oddziały w 12 największych miastach w Polsce.",
    url: "https://dks.pl/",
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "",
        width: 1200,
        height: 630,
        alt: "Dostawca sprzętu drukującego dla biur, reklamy i poligrafii – DKS",
      },
    ],
  },

  alternates: {
    canonical: "https://dks.pl/",
  },
};

export default function HomePage() {
  return (
      <main className="">
        <HeroSection  
          title="Twój partner w biznesie" 
          subtitle="Sprawdzone technologie. Profesjonalne <br /> wsparcie. Atrakcyjne ceny."
          buttonLabel="Zamów bezpłatny audyt"
          backgroundImage="/static/homepage/Header.webp"
          heroImage="/static/homepage/Obraz.webp"
          contentPosition="left"
          imageVerticalAlign="bottom"
          imageFit="contain"
          // imageObjectOffsetY={80} 
          variant="full-height"

        />
        <OfferSection/>
        <PromoSection />
        <PartnersSection />
        <CaseStudy />
        <NewsSection />
        <ContactSection />
        <AboutSection />
    </main>
  );
}

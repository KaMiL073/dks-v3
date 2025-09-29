import React from "react";

import HeroSection from "./_components/HeroSection"; 
import OfferSection from "./_components/OfferSection";
import PromoSection from "./_components/PromoSection";
import PartnersSection from "./_components/PartnersSection";
// import CaseStudy from "./_components/CaseStudy";
// import NewsSection from "./_components/NewsSection";
// import ContactSection from "./_components/ContactSection";
// import AboutSection from "./_components/AboutSection";


export default function HomePage() {
  return (
      <main className="">
        <HeroSection />
        <OfferSection/>
        <PromoSection />
        <PartnersSection />
        {/* <CaseStudy /> */}
        {/* <NewsSection /> */}
        {/* <ContactSection /> */}
        {/* <AboutSection /> */}
    </main>
  );
}

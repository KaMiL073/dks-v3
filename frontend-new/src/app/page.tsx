import React from "react";

import HeroSection from "./(marketing)/HeroSection"; 
import OfferSection from "./(marketing)/OfferSection";
import PromoSection from "./(marketing)/PromoSection";
import PartnersSection from "./(marketing)/PartnersSection";
import CaseStudy from "./(marketing)/CaseStudy";
import NewsSection from "./(marketing)/NewsSection";
// import ContactSection from "./(marketing)/ContactSection";
// import AboutSection from "./(marketing)/AboutSection";


export default function HomePage() {
  return (
      <main className="">
        <HeroSection />
        <OfferSection/>
        <PromoSection />
        <PartnersSection />
        <CaseStudy />
        <NewsSection />
        {/* <ContactSection /> */}
        {/* <AboutSection /> */}
    </main>
  );
}

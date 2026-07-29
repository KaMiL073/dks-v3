import type { Metadata } from "next";
import AboutSection from "@/components/AboutSection";
import CompanyAboutSection from "@/components/CompanyAboutSection";
import NewsSection from "@/components/NewsSection";
import OfferSection from "@/components/OfferSection";
import PartnersSection from "@/components/PartnersSection";
import StatsSection from "@/components/StatsSection";
import HeroSection from "../../../frontend-new/src/app/(marketing)/HeroSection";

export const metadata: Metadata = {
  title: "Used photocopiers and printers for export",
  description:
    "Over 30 years of experience supplying tested used photocopiers and printers worldwide.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection
        variant="full-height"
        title="30 YEARS OF EXPERIENCE"
        subtitle="SUPPLYING USED PHOTOCOPIERS & PRINTERS"
        buttonLabel="Ask for the offer"
        buttonHref="/contact"
        heroImage="/images/hero-copier.png"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
      />
      <OfferSection />
      <PartnersSection />
      <StatsSection />
      <AboutSection />
      <NewsSection />
      <CompanyAboutSection />
    </>
  );
}

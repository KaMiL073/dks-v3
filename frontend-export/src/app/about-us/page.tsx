import type { Metadata } from "next";
import {
  Breadcrumbs,
} from "@/components/Sections";
import PartnersSection from "@/components/PartnersSection";
import HistorySection from "@/components/HistorySection";
import InformationSecuritySection from "@/components/InformationSecuritySection";
import HeroSection from "../../../../frontend-new/src/app/(marketing)/HeroSection";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Learn about DKS, a family-founded Polish company supplying printing equipment worldwide since 1993.",
  alternates: { canonical: "/about-us" },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs current="About us" />
      <div className="about-us-hero">
        <HeroSection
          title="About us"
          subtitle="DKS was established in 1993 in Gdańsk by 3 family members. The beginning of the business began with the service of printers and copiers in Poland. Over 30 years of development, we have managed to open 12 branches throughout Poland, where we lease machines, and we also export copiers to over 50 countries.<br/><br/>Our annual turnover is over €30 million"
          backgroundImage="/static/homepage/Header.webp"
        />
      </div>
      <PartnersSection
        title="Our partners"
        description="With over 30 years of experience we were able to establish on trust and high service a strong network with our suppliers / customers / dealers which are located in Poland, Europe, Middle East, Far East, Africa and South America."
      />
      <HistorySection />
      <InformationSecuritySection />
    </>
  );
}

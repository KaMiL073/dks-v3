import type { Metadata } from "next";
import {
  Breadcrumbs,
} from "@/components/Sections";
import PartnersSection from "@/components/PartnersSection";
import StatsSection from "@/components/StatsSection";
import BuySellSection from "@/components/BuySellSection";
import OfferInfoSections from "@/components/OfferInfoSections";
import HeroSection from "../../../../frontend-new/src/app/(marketing)/HeroSection";

export const metadata: Metadata = {
  title: "Export offer",
  description:
    "Used copiers, printers, consumables, secure packaging and international logistics from DKS.",
  alternates: { canonical: "/offer" },
};

export default function OfferPage() {
  return (
    <>
      <Breadcrumbs current="Offer" />
      <HeroSection
        variant="full-height"
        title="Export"
        subtitle="We have over 30 years of experience in copiers and consumables market. Through this time we gained trust of many customers all over the world. DKS supports you through whole process, from choosing machines/consumables till logistics. We are able to sent to you via pallets, trucks or containers."
        heroImage="/images/export-machine.png"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
      />
      <PartnersSection
        title="Our partners"
        description="DKS offer brands like Canon, Ricoh, Konica Minolta, Kyocera Mita, HP, Lexmark, Sharp, Brother, Toshiba."
      />
      <StatsSection
        stats={[
          {
            value: "40,000",
            label: "copiers sent on export per year",
          },
          {
            value: "10,000",
            label: "machines on stock",
          },
          {
            value: "7,500",
            label: "square metres of the warehouse",
          },
        ]}
      />
      <BuySellSection />
      <OfferInfoSections />
    </>
  );
}

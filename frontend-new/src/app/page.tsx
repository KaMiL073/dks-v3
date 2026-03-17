import React from "react";

import HeroSection from "./(marketing)/HeroSection";
import OfferSection from "./(marketing)/OfferSection";
import PromoSection from "./(marketing)/PromoSection";
import PartnersSection from "./(marketing)/PartnersSection";
import CaseStudy, { type Slide } from "./(marketing)/CaseStudy";
import NewsSection from "./(marketing)/NewsSection";
import ContactSection from "./(marketing)/ContactSection";
import AboutSection from "./(marketing)/AboutSection";
import { getLatestCaseStudies } from "@/lib/getNews";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function HomePage() {
  const posts = await getLatestCaseStudies(3);
    
  const slides: Slide[] = posts.map((post) => ({
    title: post.title,
    desc: post.lead,
    image: post.image ?? "/static/homepage/Obraz-a.webp",
    slug: post.slug,
    categorySlug: post.categorySlug ?? "case-study",
  }));

  return (
    <main className="">
      <HeroSection
        title="Twój partner w biznesie"
        subtitle="Sprawdzone technologie. Profesjonalne <br /> wsparcie. Atrakcyjne ceny."
        buttonLabel="Zamów bezpłatny audyt"
        backgroundImage="/static/homepage/Header.webp"
        heroImage="/static/homepage/079A2955-mini.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        variant="full-height"
      />
      <OfferSection />
      <PromoSection />
      <PartnersSection />
      <CaseStudy slides={slides} />
      <NewsSection />
      <ContactSection />
      <AboutSection />
    </main>
  );
}
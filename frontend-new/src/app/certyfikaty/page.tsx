import HeroSection from "@/app/(marketing)/HeroSection";
import Breadcrumb from "../oferta/components/Breadcrumb";
import { getCertifications } from "@/lib/certifications";
import CertificationsGrid from "@/components/CertificationsGrid";

const baseUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dks.pl");

export const metadata: Metadata = {
  metadataBase: baseUrl,

  title: "Certyfikaty – DKS",
  description:
    "Poznaj certyfikaty DKS związane ze sprzedażą i serwisem nowoczesnych urządzeń drukujących oraz wdrożeniami rozwiązań dla firm.",

  keywords: [
    "certyfikaty DKS",
    "autoryzacje DKS",
    "certyfikowany serwis drukarek",
    "urządzenia drukujące certyfikaty",
    "DKS certyfikaty",
  ],

  alternates: {
    canonical: "/certyfikaty",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Certyfikaty – DKS",
    description:
      "Poznaj certyfikaty DKS związane ze sprzedażą i serwisem nowoczesnych urządzeń drukujących oraz wdrożeniami rozwiązań dla firm.",
    url: "/certyfikaty",
    siteName: "DKS",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "/og/certyfikaty.jpg",
        width: 1200,
        height: 630,
        alt: "Certyfikaty DKS",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Certyfikaty – DKS",
    description:
      "Poznaj certyfikaty DKS związane ze sprzedażą i serwisem nowoczesnych urządzeń drukujących oraz wdrożeniami rozwiązań dla firm.",
    images: ["/og/certyfikaty.jpg"],
  },
};

export default async function CertyfikatyPage() {
  const items = await getCertifications();

  return (
    <>
      <Breadcrumb />
      <HeroSection
        title="Praca w DKS"
        subtitle={`
            Nasza firma posiada szeroką gamę certyfikatów <br />
            związanych z sprzedażą nowoczesnych urządzeń <br />
            drukujących. Dzięki naszym rozwiązaniom, możesz być <br />
            pewien, że otrzymujesz produkty najwyższej jakości, <br />
            które spełnią Twoje oczekiwania.
        `}
        backgroundImage="/static/homepage/Header.webp"
        contentPosition="left"
        imageVerticalAlign="bottom"
        imageFit="contain"
        imageObjectOffsetY={80}
        variant="full-height"
      />

      <main className="w-full px-4 lg:px-6 2xl:px-20 py-20 bg-white flex flex-col gap-12">
        <CertificationsGrid items={items} />
      </main>
    </>
  );
}
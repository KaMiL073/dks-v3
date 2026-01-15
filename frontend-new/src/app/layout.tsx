import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from "next/font/google";

import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dks.pl";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "DKS",
    template: "%s | DKS",
  },

  description:
    "DKS – dostawca sprzętu drukującego dla biur, reklamy i poligrafii.",

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl-PL">
      <body className={`${montserrat.className} antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
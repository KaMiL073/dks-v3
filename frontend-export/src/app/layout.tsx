import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReCaptchaProvider from "@/components/ReCaptchaProvider";
import { siteUrl } from "@/lib/site";
import "./globals.css";
import "@/styles/export.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "DKS Export", template: "%s | DKS Export" },
  description:
    "DKS supplies tested used photocopiers, printers and consumables to customers worldwide.",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "DKS Export",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        <ReCaptchaProvider>
          <Header />
          {children}
          <Footer />
        </ReCaptchaProvider>
      </body>
    </html>
  );
}

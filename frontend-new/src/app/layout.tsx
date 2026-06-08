import type { Metadata } from "next";
import Script from "next/script";
import { Montserrat } from "next/font/google";

import "./globals.css";
import "@/styles/rich-content.scss";

import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import JsonLd from "@/components/seo/JsonLd";
import ReCaptchaProvider from "@/components/providers/ReCaptchaProvider";

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
    "DKS - dostawca sprzetu drukujacego dla biur, reklamy i poligrafii.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            name: "DKS Sp. z o.o.",
            url: baseUrl,
            logo: "https://dks.pl/static/logo-dks.svg",
          }}
        />
      </head>

      <body className={`${montserrat.className} antialiased`}>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              (function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NB9HQRB');
            `,
          }}
        />

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NB9HQRB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <ReCaptchaProvider>
          <Header />
          {children}
          <Footer />
        </ReCaptchaProvider>

        <Script
          id="mzer"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              let _mzid = '629e55d47878';
              (function(s, o, g) {
                var a = s.createElement(o);
                var m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m);
              })(document, 'script', '//mzer.pl/mz.js');
            `,
          }}
        />
      </body>
    </html>
  );
}

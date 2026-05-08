import RichContentStatic from "@/components/RichContentStatic";
import TopSectionHeader from "@/components/TopSectionHeader";
import OfferSection from "@/app/(marketing)/OfferSection";
import PartnersSection from "@/app/(marketing)/PartnersSection";

export const metadata = {
  title: "Drukarki biurowe, wielkoformatowe i cyfrowe maszyny poligraficzne",
  description:
    "Dostarczamy urządzenia drukujące do biur, cyfrowe maszyny poligraficzne i drukarki wielkoformatowe. Sprzedajemy i wynajmujemy urządzenia nowe i poleasingowe.",
  keywords:
    "drukarki biurowe, drukarki laserowe, kserokopiarki, urządzenia wielofunkcyjne, MFP, plotery, maszyny poligraficzne, drukarki wielkoformatowe, druk cyfrowy, urządzenia do biura, Canon, HP, Konica Minolta, Kyocera, Lexmark",
  openGraph: {
    title: "Drukarki biurowe, wielkoformatowe i cyfrowe maszyny poligraficzne",
    description:
      "Dostarczamy urządzenia drukujące do biur, cyfrowe maszyny poligraficzne i drukarki wielkoformatowe. Sprzedajemy i wynajmujemy urządzenia nowe i poleasingowe.",
    url: "https://twojadomena.pl/oferta",
    siteName: "Twoja Firma",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "https://twojadomena.pl/images/drukarki-biuro-og.jpg",
        width: 1200,
        height: 630,
        alt: "Drukarki biurowe i maszyny poligraficzne",
      },
    ],
  },
  alternates: {
    canonical: "https://twojadomena.pl/oferta",
  },
};


export default function ProductsPage() {
  return (
    <>
        <TopSectionHeader 
            title="Produkty" 
            img="/static/homepage/Header.webp"
        />
        <OfferSection />
        <PartnersSection />
        <div className="px-6 md:px-28 py-12 md:py-20">
            <RichContentStatic 
                content={`
                    <p>
                        Należymy do ścisłej czołówki polskich dystrybutorów sprzętu drukującego 
                        czterech uznanych producentów: Canon, Lexmark, HP i Konica Minolta. 
                        W naszej ofercie dostępne są zarówno urządzenia nowe, 
                        jak i poleasingowe – przeznaczone do biur, 
                        drukarń oraz druku wielkoformatowego. Dostarczamy drukarki 
                        i urządzenia wielofunkcyjne, kopiarki, skanery oraz 
                        niszczarki dokumentów. Uzupełnieniem oferty sprzętowej 
                        jest oprogramowanie wspierające zarządzanie drukiem, 
                        skanowaniem i przepływem dokumentów.
                    </p>
                    <p>
                        Istotną i bogatą część naszego portfolio stanowią maszyny do wydajnego 
                        druku produkcyjnego. Obsługujemy drukarnie cyfrowe, 
                        dostarczając im drukarki i sprzęt poligraficzny dostosowany 
                        do dużych nakładów. Zajmujemy się również instalacją urządzeń 
                        i uruchamianiem systemów druku bezpośrednio u Klientów. 
                        Ponadto wprowadziliśmy do sprzedaży maszyny introligatorskie 
                        marki Duplo, cenionej przez specjalistów na całym świecie.
                    </p>
                    <p>
                        Trzeci filar naszej działalności to urządzenia wielkoformatowe, 
                        szeroko stosowane w reklamie i szeroko pojętych usługach graficznych. 
                        Oferujemy m.in. skanery Contex, plotery tonerowe KIP, 
                        składarki offline es-te, a także plotery atramentowe 
                        takich marek jak Océ, OKI, Canon i Konica Minolta.
                    </p>
                `}
                image="/static/oferta/produkty.webp"
            />
        </div>
    </>
  );
}
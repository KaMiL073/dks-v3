"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { Heading2 } from "./Typography/Heading2";
import Link from "next/link";

type Offer = {
  title: string;
  subtitle: string;
  image?: string;
  price: string;
  link: string;
  description: string;
  highlight?: boolean;
};

const offers: Offer[] = [
  {
    title: "PODSTAWOWY",
    subtitle: "Lexmark XC2326",
    image:
      "https://dks.pl/backend/assets/81c3d6c9-f1f0-4c1f-9a84-7dc5154ada3e.webp?imwidth=1920",
    price: "od 49zł netto m/c",
    link: "/oferta/rozwiazania-dla-biura/xc2326",
    description: `Idealne rozwiązanie dla małych grup roboczych!
Urządzenie MFP
Prędkość druku: Do 24 str./min (kolor)
Formaty papieru: do A4
Ekran dotykowy: 7-calowy`,
  },
  {
    title: "BIZNES",
    subtitle: "Ricoh C2010",
    image:
      "https://dks.pl/backend/assets/461fef53-31d3-47a7-bbca-1e90cdf5ad5f.webp?imwidth=1920",
    price: "od 145zł netto m/c",
    link: "/oferta/rozwiazania-dla-biura/im-c2010",
    description: `Idealne rozwiązanie do małych biur i grup roboczych!
Urządzenie MFP
Prędkość druku: 20 str./min. (kolor/mono)
Formaty papieru: A6–SRA3, niestandardowe
Ekran dotykowy: 10,1-calowy
Bezpieczeństwo: Szyfrowanie dysku i autoryzacja użytkownika
Oprogramowanie: OCR`,
    highlight: true,
  },
  {
    title: "ROZSZERZONY",
    subtitle: "Konica Minolta bizhub C301i",
    image:
      "https://dks.pl/backend/assets/67d686ec-e7d8-4175-adbf-d3402b04b61a.webp?imwidth=1920",
    price: "od 189zł netto m/c",
    link: "/oferta/rozwiazania-dla-biura/bizhub-c301i",
    description: `Idealne urządzenie dla firm ceniących efektywność i bezpieczeństwo!
Urządzenie MFP
Prędkość druku: 30 str./min. (kolor/mono)
Formaty papieru: A6–SRA3, baner do 1,2 m
Ekran dotykowy: 10,1-calowy
Ekologia: oszczędza energię i dba o środowisko
Bezpieczeństwo: Bitdefender`,
  },
];

function OfferCard({ offer }: { offer: Offer }) {
  return (
      <Link href={offer.link}
        className={`
          flex flex-col bg-gray-300
          min-w-72 max-w-96
          md:min-w-[22rem] md:max-w-[22rem]
          lg:min-w-[24rem] lg:max-w-[24rem]
          min-h-[480px]
          md:min-h-[520px]
          lg:min-h-[560px]
          xl:min-h-[600px]
        `}
      >
        {offer.highlight && (
          <div className="px-2 py-3 bg-red-600 text-white text-center text-lg font-semibold">
            NAJCZĘŚCIEJ WYBIERANY
          </div>
        )}

        <div className="flex-1 px-6 md:px-10 py-6 md:py-10 flex flex-col items-center justify-between gap-4 md:gap-6">
          {offer.image ? (
            <Image
              src={offer.image}
              alt={offer.subtitle}
              width={261}
              height={341}
              className="w-full h-60 md:h-80 object-contain"
            />
          ) : (
            <div className="w-full h-60 md:h-80 bg-surface-primary" />
          )}

          <div className="flex flex-col gap-1 text-center">
            <div className="text-xs md:text-xl font-semibold text-Text-disabled">
              {offer.title}
            </div>
            <div className="text-lg md:text-2xl font-semibold text-Text-body">
              {offer.subtitle}
            </div>
          </div>

          <div className="text-center mt-auto">
            <span className="block text-base md:text-lg font-semibold">
              {offer.price}
            </span>
            <p className="text-xs md:text-base whitespace-pre-line leading-snug">
              {offer.description}
            </p>
          </div>
        </div>
      </Link>
  );
}

export default function PromoSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const handleDotClick = (idx: number) => {
    cardRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
    setActive(idx);
  };

  return (
    <section className="px-6 md:px-6 2xl:px-28 py-12 md:py-20 flex flex-col gap-8 md:gap-16">
      <Heading2 variant="semibold">Nasze propozycje</Heading2>

      {/* Slider: xs → xl */}
      <div className="flex 2xl:hidden w-full gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide items-stretch">
        {offers.map((offer, idx) => (
          <div
            key={idx}
            ref={(el) => void (cardRefs.current[idx] = el)}
            className="snap-center flex-shrink-0 flex"
          >
            <OfferCard offer={offer} />
          </div>
        ))}
      </div>

      {/* Dots: xs → xl */}
      <div className="flex 2xl:hidden justify-center gap-2 mt-4">
        {offers.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full ${
              active === idx ? "bg-red-600" : "bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* Grid: tylko 2xl */}
      <div className="hidden 2xl:grid grid-cols-3 gap-10 items-stretch">
        {offers.map((offer, idx) => (
          <OfferCard key={idx} offer={offer} />
        ))}
      </div>
    </section>
  );
}

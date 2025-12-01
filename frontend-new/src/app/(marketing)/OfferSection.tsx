"use client";
import Image from "next/image";
import { Heading2 } from "@/components/ui/Typography/Heading2";
import Link from "next/link";

export default function OfferSection() {
  return (
    <section>
      {/* Nagłówek */}
      <div className="w-full mx-auto py-10 lg:px-28 lg:py-20 text-center">
        <Heading2 variant="semibold">
          DKS – dostawca sprzętu do druku biurowego,
          poligraficznego i wielkoformatowego
        </Heading2>
      </div>

      {/* Kafelki */}
      <div className="px-6 py-10 lg:px-28 lg:py-20">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6">
          {[
            {
              title: "Rozwiązania dla biura",
              desc: "Kolorowe i czarno-białe urządzenia wielofunkcyjne, drukarki, niszczarki",
              icon: "/static/icons/rozwiazania-dla-biura.svg",
              link: "/oferta/rozwiazania-dla-biura/"
            },
            {
              title: "Rozwiązania dla poligrafii",
              desc: "Maszyny produkcyjne, bigówki, oklejarki, foliarki, falcerki, gilotyny",
              icon: "/static/icons/rozwiazania-dla-polirafii.svg",
              link: "/oferta/rozwiazania-dla-poligrafii/"
            },
            {
              title: "Rozwiązania wielkoformatowe",
              desc: "Plotery, skanery, drukarki wielkoformatowe",
              icon: "/static/icons/rozwiazania-wielkoformatowe.svg",
              link: "/oferta/rozwiazania-wielkoformatowe/"
            },
            {
              title: "Materiały eksploatacyjne",
              desc: "Tonery, developery, bębny, tusze, części zamienne",
              icon: "/static/icons/materialy-eksploatacyjne.svg",
              link: "/oferta/materialy-eksploatacyjne/"
            },
            {
              title: "Oprogramowanie dla biur",
              desc: "Oprogramowanie do zarządzania drukiem, accountingowe, OCR",
              icon: "/static/icons/oprogramowanie.svg",
              link: "/oferta/oprogramowanie-dla-biura"
            },
            {
              title: "Oprogramowanie dla poligrafii",
              desc: "Oprogramowanie do profesjonalnych wydruków, oprogramowanie do skanowania",
              icon: "/static/icons/oprogramowanie.svg",
              link: "/oferta//oprogramowanie-dla-poligrafii-i-cad-gis"
            },
          ].map((item, i) => (
            <Link href={item.link} key={i}>
              <div
                className="h-72 bg-gray-300 p-6 flex flex-col items-center text-center shadow-sm"
              >
                <div className="w-16 h-16 mb-4 relative">
                  <Image src={item.icon} alt={item.title} fill />
                </div>
                <h3 className="text-base font-semibold">
                  {item.title}
                </h3>
                <p className="text-xs mt-2">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
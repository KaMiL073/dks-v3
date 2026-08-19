"use client";
import Image from "next/image";
import { Heading2 } from "../../../frontend-new/src/components/ui/Typography/Heading2";
import Link from "next/link";

export default function OfferSection() {
  return (
    <section>
      {/* Nagłówek */}
      <div className="w-full mx-auto py-10 lg:px-28 lg:py-20 text-center">
        <Heading2 variant="semibold">
          DKS – official broker of used photocopiers
          and consumables
        </Heading2>
      </div>

      {/* Kafelki */}
      <div className="px-6 py-10 lg:px-28 lg:py-20">
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 lg:[&>a:last-child]:col-start-2 xl:grid-cols-6 xl:[&>a:first-child]:col-start-2 xl:[&>a:last-child]:col-start-auto 2xl:grid-cols-6">
          {[
            {
              title: "Office solutions",
              desc: "Colour and black-and-white multifunction devices, copiers and printers",
              icon: "/static/icons/rozwiazania-dla-biura.svg",
              link: "/offer"
            },
            {
              title: "Solutions for printing",
              desc: "Production machines, finishing and professional printing equipment",
              icon: "/static/icons/rozwiazania-dla-polirafii.svg",
              link: "/offer"
            },
            {
              title: "Large format solutions",
              desc: "Plotters, scanners and wide-format printers",
              icon: "/static/icons/rozwiazania-wielkoformatowe.svg",
              link: "/offer"
            },
            {
              title: "Consumables",
              desc: "Toners, developers, drums, inks and spare parts",
              icon: "/static/icons/materialy-eksploatacyjne.svg",
              link: "/offer"
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

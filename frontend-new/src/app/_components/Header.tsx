import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./Button";

const navItems = [
  { label: "Oferta", href: "/oferta", submenu: [
      { label: "Rozwiązania dla biura", href: "/oferta/biuro" },
      { label: "Rozwiązania dla poligrafii", href: "/oferta/poligrafia" },
      { label: "Rozwiązania wielkoformatowe", href: "/oferta/wielkoformatowe" },
      { label: "Strefa marek", href: "/oferta/strefa-marek" },
      { label: "Kamery termowizyjne", href: "/oferta/kamery-termowizyjne" },
      { label: "Materiały eksploatacyjne", href: "/oferta/materialy" },
    ] 
  },
  { label: "Serwis", href: "/serwis" },
  { label: "O nas", href: "/o-nas" },
  { label: "Blog", href: "/blog" },
  { label: "Strefa Klienta", href: "/strefa-klienta" },
  { label: "Eksport", href: "/eksport" },
];

export const Header: React.FC = () => {
  return (
    <header
      className="self-stretch px-28 bg-surface-page shadow-[0px_16px_24px_0px_rgba(3,7,18,0.05)] justify-between items-center"
    >
      <div className="flex-1 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
            <Image
                src="https://dks.pl/static/logo-dks.svg"
                alt="DKS Logo"
                width={120}
                height={36}
                priority
            />
      </Link>

        {/* Nawigacja */}
<nav className="flex-1 max-w-[868px] flex justify-between items-center ml-12">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <Link
                href={item.href}
                className="h-[43px] flex items-center text-Text-headings text-base font-normal font-['Montserrat'] leading-tight hover:text-red-600 transition-colors px-2"
              >
                {item.label}
              </Link>

              {/* Dropdown */}
              {item.submenu && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-gray-100 shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                  <ul className="flex flex-col">
                    {item.submenu.map((sub) => (
                      <li key={sub.label}>
                        <Link
                          href={sub.href}
                          className="flex justify-between items-center px-4 py-3 text-sm text-neutral-900 hover:bg-gray-200"
                        >
                          {sub.label}
                          <span className="text-neutral-500">›</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* CTA Kontakt */}
          <Button href="/kontakt" className="h-[43px]">
            Kontakt
          </Button>
        </nav>
      </div>
    </header>
  );
};

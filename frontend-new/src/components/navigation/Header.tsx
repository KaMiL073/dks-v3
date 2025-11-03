"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button"; // ✅ poprawione — default import

type NavItem = {
  label: string;
  href?: string;
  submenu?: NavItem[];
};

const navItems: NavItem[] = [
  {
    label: "Oferta",
    href: "/oferta",
    submenu: [
      {
        label: "Rozwiązania dla biura",
        href: "/oferta/rozwiazania-dla-biura",
        submenu: [
          {
            label: "Drukarki i urządzenia wielofunkcyjne",
            href: "/oferta/rozwiazania-dla-biura/drukarki-i-urzadzenia-wielofunkcyjne",
          },
          { label: "Oprogramowanie dla biura", href: "/oferta/rozwiazania-dla-biura/oprogramowanie-dla-biura" },
          { label: "Laptopy", href: "/oferta/rozwiazania-dla-biura/laptopy" },
        ],
      },
      {
        label: "Rozwiązania dla poligrafii",
        href: "/oferta/rozwiazania-dla-poligrafii",
        submenu: [
          { label: "Maszyny produkcyjne kolorowe", href: "/oferta/rozwiazania-dla-poligrafii/maszyny-produkcyjne-kolorowe" },
          { label: "Maszyny produkcyjne b&w", href: "/oferta/rozwiazania-dla-poligrafii/maszyny-produkcyjne-bw" },
          { label: "Maszyny rolowe do etykiet", href: "/oferta/rozwiazania-dla-poligrafii/maszyny-rolowe-etykiety" },
          { label: "Software dla poligrafii", href: "/oferta/rozwiazania-dla-poligrafii/software" },
          { label: "Uszlachetnianie druku", href: "/oferta/rozwiazania-dla-poligrafii/uszlachetnianie" },
          { label: "Rozwiązania introligatorskie", href: "/oferta/rozwiazania-dla-poligrafii/introligatornia" },
        ],
      },
      {
        label: "Rozwiązania wielkoformatowe",
        href: "/oferta/rozwiazania-wielkoformatowe",
        submenu: [
          { label: "Plotery", href: "/oferta/rozwiazania-wielkoformatowe/plotery" },
          { label: "Skanery", href: "/oferta/rozwiazania-wielkoformatowe/skanery" },
          { label: "Systemy wielofunkcyjne", href: "/oferta/rozwiazania-wielkoformatowe/systemy-wielofunkcyjne" },
          { label: "Składarki", href: "/oferta/rozwiazania-wielkoformatowe/skladarki" },
        ],
      },
      {
        label: "Strefa marek",
        submenu: [
          { label: "Canon", href: "/oferta/canon" },
          { label: "Konica Minolta", href: "/oferta/konica-minolta" },
          { label: "Lexmark", href: "/oferta/lexmark" },
          { label: "HP", href: "/oferta/hp" },
          { label: "Ricoh", href: "/oferta/ricoh" },
          { label: "Asus", href: "/oferta/asus" },
          { label: "Lenovo", href: "/oferta/lenovo" },
          { label: "Oce", href: "/oferta/oce" },
        ],
      },
      { label: "Kamery termowizyjne", href: "/oferta/kamery-termowizyjne" },
      { label: "Materiały eksploatacyjne", href: "/oferta/materialy-eksploatacyjne" },
    ],
  },
  {
    label: "Serwis",
    href: "/serwis",
    submenu: [
      { label: "Zgłoszenie serwisowe", href: "/oferta/zgloszenie-serwisowe" },
      { label: "Serwis urządzeń wielofunkcyjnych", href: "/oferta/serwis-urzadzen-wielofunkcyjnych" },
      { label: "Serwis urządzeń produkcyjnych", href: "/oferta/serwis-urzadzen-produkcyjnych" },
      { label: "Serwis urządzeń wielkoformatowych", href: "/oferta/serwis-urzadzen-wielkoformatowych" },
      { label: "Kontrakt Obsługi Serwisowej", href: "/oferta/kontrakt-obslugi-serwisowej" },
    ],
  },
  { label: "O nas", href: "/o-nas" },
  { label: "Blog", href: "/blog" },
  { label: "Strefa Klienta", href: "/strefa-klienta" },
  { label: "Eksport", href: "/eksport" },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<NavItem[][]>([navItems]);
  const [activeSubIndex, setActiveSubIndex] = useState<number | null>(null);

  const currentMenu = menuStack[menuStack.length - 1];
  const currentTitle =
    menuStack.length > 1
      ? menuStack[menuStack.length - 2].find((item) => item.submenu === currentMenu)?.label
      : "Menu";

  const openSubmenu = (item: NavItem) => {
    if (item.submenu) setMenuStack([...menuStack, item.submenu]);
  };

  const goBack = () => {
    if (menuStack.length > 1) setMenuStack(menuStack.slice(0, -1));
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setMenuStack([navItems]);
  };

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* 🧭 Desktop Header */}
      <header className="sticky top-0 z-50 w-full bg-white shadow-md">
        <div className="flex items-center justify-between px-4 lg:px-8 xl:px-28 h-[72px]">
          <Link href="/" className="flex items-center">
            <Image
              src="https://dks.pl/static/logo-dks.svg"
              alt="DKS Logo"
              width={120}
              height={36}
              priority
            />
          </Link>

          {/* 🧭 Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 items-center ml-12">
            {navItems.map((item) => (
              <div key={item.label} className="relative group">
                <Link
                  href={item.href ?? "#"}
                  className="px-2 h-[43px] flex items-center hover:underline"
                >
                  {item.label}
                </Link>

                {/* 🧱 Submenu */}
                {item.submenu && (
                  <div className="absolute left-0 top-full bg-white shadow-lg w-auto flex opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="w-72 flex flex-col border-r border-gray-200">
                      {item.submenu.map((sub, subIndex) => (
                        <div
                          key={sub.label}
                          className="flex justify-between items-center px-6 py-4 bg-gray-300 hover:bg-white cursor-pointer"
                          onMouseEnter={() => setActiveSubIndex(subIndex)}
                        >
                          <Link href={sub.href ?? "#"}>{sub.label}</Link>
                          {sub.submenu && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 🧩 Głębsze submenu */}
                    {activeSubIndex !== null &&
                      item.submenu[activeSubIndex]?.submenu && (
                        <div className="w-64 flex flex-col py-2">
                          {item.submenu[activeSubIndex].submenu!.map((deep) => (
                            <Link
                              key={deep.label}
                              href={deep.href ?? "#"}
                              className="px-6 py-3 text-sm hover:bg-gray-100"
                            >
                              {deep.label}
                            </Link>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
            <Button href="/kontakt" className="h-[43px]">
              Kontakt
            </Button>
          </nav>

          {/* 📱 Mobile Toggle */}
          <div className="lg:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 📱 Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-screen bg-white z-[150] overflow-y-auto lg:hidden">
          <div className="px-6 py-4 flex justify-between items-center shadow-md">
            {menuStack.length > 1 ? (
              <button onClick={goBack} className="w-8 h-8 flex items-center justify-center">←</button>
            ) : <span className="w-8 h-8" />}
            <span className="text-lg font-semibold">{currentTitle}</span>
            <button onClick={closeMenu} className="w-8 h-8 flex items-center justify-center">✕</button>
          </div>

          <div>
            {currentMenu.map((item) => {
              const hasSubmenu = !!item.submenu;
              return (
                <div key={item.label} className="w-full">
                  {item.href && !hasSubmenu ? (
                    <Link href={item.href} onClick={closeMenu} className="flex justify-between items-center w-full px-6 py-4 text-lg hover:bg-gray-100">
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => hasSubmenu && openSubmenu(item)}
                      className="w-full flex justify-between items-center px-6 py-4 text-lg text-left hover:bg-gray-100"
                    >
                      <span>{item.label}</span>
                      {hasSubmenu && <span>›</span>}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
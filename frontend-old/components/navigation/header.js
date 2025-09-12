import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

import PhoneIcon from '@mui/icons-material/Phone';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import BuildIcon from '@mui/icons-material/Settings';
import styles from '../../styles/Header.module.scss';

import SocialButtons from './common/socialButtons';
import DropdownDepartments from './header/dropdownDepartments';
import DropdownSubmenu, { DropdownSubmenuWide } from './header/dropdownSubmenu';

export default function Header() {
  const submenuGenericClasses = 'uppercase font-bold text-sm invisible absolute -left-full xl:visible xl:relative xl:left-auto xl:flex xl:flex-grow xl:flex-row xl:space-x-10 xl:justify-end';
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const [submenuClasses, setSubmenuClasses] = useState(submenuGenericClasses);
  const mobileMenuToggle = () => {
    setIsMobileMenuActive(!isMobileMenuActive);
    const mobileMenuClasses = 'absolute bg-white top-20 w-3/4 h-screen uppercase font-bold';
    if (!isMobileMenuActive) {
      setSubmenuClasses(`${styles.submenu} ${mobileMenuClasses} left-0 opacity-100`);
    } else {
      setSubmenuClasses(`${styles.submenu} ${mobileMenuClasses} -left-full opacity-0 invisible`);
    }
  };

  const dksSubmenu = [
    { href: '/o-firmie', title: 'O firmie' },
    { href: '/oddzialy', title: 'Oddziały' },
    { href: '/kariera', title: 'Kariera' },
    { href: '/certyfikaty', title: 'Certyfikaty i wyróżnienia' },
    { href: '/baza-wiedzy', title: 'Baza wiedzy' },
    { href: '/klauzula-ochrony-danych-data-protection', title: 'Klauzula Ochrony Danych / Data Protection' },
    { href: '/regulamin-platnosci-online', title: 'Regulamin płatności online' },
    { href: '/ochrona-sygnalistow', title: 'Ochrona sygnalistów' },
  ];

  const serviceSubmenu = [
    { href: '/serwis-urzadzen-wielofunkcyjnych', title: 'Serwis urządzeń wielofunkcyjnych' },
    { href: '/serwis-urzadzen-produkcyjnych', title: 'Serwis urządzeń produkcyjnych' },
    { href: '/serwis-urzadzen-wielkoformatowych', title: 'Serwis urządzeń wielkoformatowych' },
    { href: '/kontrakt-obslugi-serwisowej', title: 'Kontrakt obsługi serwisowej' },
    { href: '/zgloszenie-serwisowe', title: 'Zgłoszenie serwisowe' },
  ];

  const offerSubmenu = [
    {
      label: 'rozwiazania-dla-biura',
      items: [
        { href: '/oferta/rozwiazania-dla-biura', title: 'Rozwiązania dla biura', bolded: true },
        { href: '/oferta/rozwiazania-dla-biura/canon', title: 'Canon' },
        { href: '/oferta/rozwiazania-dla-biura/lexmark', title: 'Lexmark' },
        { href: '/oferta/rozwiazania-dla-biura/konica-minolta', title: 'Konica Minolta' },
        { href: '/oferta/rozwiazania-dla-biura/hp', title: 'HP' },
        { href: '/oferta/rozwiazania-dla-biura/ricoh', title: 'Ricoh' },
      ],
    },
    {
      label: 'rozwiazania-dla-poligrafii',
      items: [
        { href: '/oferta/rozwiazania-dla-poligrafii', title: 'Rozwiązania dla poligrafii', bolded: true },
        { href: '/oferta/rozwiazania-dla-poligrafii/konica-minolta', title: 'Konica Minolta' },
        { href: '/oferta/rozwiazania-dla-poligrafii/canon', title: 'Canon' },
        { href: '/oferta/rozwiazania-dla-poligrafii/duplo', title: 'Duplo' },
        { href: '/oferta/rozwiazania-dla-poligrafii/fujifilm', title: 'Fujifilm' },
      ],
    },
    {
      label: 'rozwiazania-wielkoformatowe',
      items: [
        { href: '/oferta/rozwiazania-wielkoformatowe', title: 'Rozwiązania wielkoformatowe', bolded: true },
        { href: '/oferta/rozwiazania-wielkoformatowe/contex', title: 'Contex' },
        { href: '/oferta/rozwiazania-wielkoformatowe/kip', title: 'KIP' },
        { href: '/oferta/rozwiazania-wielkoformatowe/es-te', title: 'es-te' },
        { href: '/oferta/rozwiazania-wielkoformatowe/oce', title: 'Océ' },
        // { href: '/oferta/rozwiazania-wielkoformatowe/oki', title: 'Oki' },
        { href: '/oferta/rozwiazania-wielkoformatowe/canon', title: 'Canon' },
        { href: '/oferta/rozwiazania-wielkoformatowe/konica-minolta', title: 'Konica Minolta' },
      ],
    },
    {
      label: 'Laptopy',
      items: [
        { href: '/oferta/laptopy', title: 'Laptopy', bolded: true },
        { href: '/oferta/laptopy/asus', title: 'Asus' },
        { href: '/oferta/laptopy/hp', title: 'HP' },
        { href: '/oferta/laptopy/lenovo', title: 'Lenovo' },
      ],
    },
    {
      label: 'inne',
      items: [
        { href: '/oferta/komputery', title: 'Komputery', bolded: true },
        { href: '/oferta/tablice-interaktywne', title: 'Tablice interaktywne', bolded: true },
        { href: '/oferta/kamery-termowizyjne', title: 'Kamery termowizyjne', bolded: true },
        { href: '/oferta/materialy-eksploatacyjne', title: 'Materiały eksploatacyjne', bolded: true },
        { href: '/oferta/oprogramowanie-dla-biura', title: 'Oprogramowanie dla biura', bolded: true },
        { href: '/oferta/oprogramowanie-dla-poligrafii-i-cad-gis', title: 'Oprogramowanie dla poligrafii i CAD/GIS', bolded: true },
      ],
    },
  ];

  return (
    <>
      <nav className="w-full hidden lg:block">
        <div className={styles.topMenu}>
          <div className="max-w-screen-xl px-4 xl:px-0 h-full mx-auto flex items-center justify-center space-x-6 text-tiny xl:text-sm">
            <div className="flex-auto">
              <Link href="tel:583090307">
                <>
                  <PhoneIcon className={styles.sizeIcon} />
                  <a href="tel:583090307">
                    Centrala: 58 309 03 07
                  </a>
                </>
              </Link>
            </div>

            <div className="flex-auto">
              <Link href="tel:583090307">
                <>
                  <PhoneIcon className={styles.sizeIcon} />
                  <a href="tel:583506605">
                    Serwis: 58 350 66 05
                  </a>
                </>
              </Link>
            </div>
            <div className="flex-auto">
              <Link href="mailto:583090307">
                <>
                  <LocalPostOfficeIcon className={styles.sizeIcon} />
                  <a href="mailto:kontakt@dks.pl">
                    E-mail: kontakt@dks.pl
                  </a>
                </>
              </Link>
            </div>
            <div>
              <Link href="mailto:583090307" className="flex-auto">
                <>
                  <BuildIcon className={styles.sizeIcon} />
                  <a href="/zgloszenie-serwisowe">
                    Zgłoszenie serwisowe
                  </a>
                </>
              </Link>
            </div>

            <DropdownDepartments />

            <div className="flex space-x-2">
              <SocialButtons className="mt-2" />
            </div>
          </div>
        </div>
      </nav>
      <nav className="w-full sticky top-0 z-40 bg-white">
        <div className={`${styles.navigation} px-4 xl:px-0`}>
          <div className="flex max-w-screen-xl h-full mx-2 items-center justify-between xl:mx-auto xl:justify-center">
            <button
              type="button"
              className={`xl:hidden ${styles.hamburger} ${isMobileMenuActive ? styles.active : ''}`}
              onClick={mobileMenuToggle}
              onKeyPress={mobileMenuToggle}
              aria-label="navigation"
            >
              <span />
            </button>
            <Link href="/">
              <a href="/" className={`flex-none ${styles.logoDks}`}>
                <Image src="//static/logo-dks.svg" alt="DKS" layout="fill" objectFit="contain" />
              </a>
            </Link>
            <Link href="/">
              <a href="/" className={`flex-none ml-5 ${styles.logoUE}`}>
                <Image src="//static/logo_UE.webp" alt="logo_UE" layout="fill" objectFit="contain" />
              </a>
            </Link>
            <ul className={submenuClasses}>
              <li><Link href="/"><a href="/">home</a></Link></li>
              <DropdownSubmenu elements={dksSubmenu} label="dks" />
              <li><Link href="/blog"><a href="/blog">blog</a></Link></li>

              <DropdownSubmenuWide elements={offerSubmenu} label="oferta" link="/oferta" />
              <DropdownSubmenu elements={serviceSubmenu} label="serwis" link="/zgloszenie-serwisowe" />

              <li><Link href="/export"><a href="/export">export</a></Link></li>
              <li><Link href="/kontakt"><a href="/kontakt">kontakt</a></Link></li>
              <li><Link href="/strefa-klienta"><a href="/strefa-klienta">Strefa klienta</a></Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

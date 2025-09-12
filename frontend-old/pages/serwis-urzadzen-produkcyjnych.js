import Link from 'next/link';
import SupportAgentSharpIcon from '@mui/icons-material/SupportAgentSharp';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
import styles from '../styles/pages.module.scss';
import UnorderedList from '../components/elements/unorderedList';

const TITLE = 'Serwis produkcyjnych urządzeń drukujących Konica Minolta i Canon';
const DESCRIPTION = 'Prowadzimy serwis gwarancyjny i pogwarancyjny produkcyjnych urządzeń drukujących. Posiadamy certyfikaty firm Konica Minolta i Canon. Sprawdź szczegóły oferty. ';
export default function ServiceProductionDevices() {
  const ulElements = [
    { text: 'doradztwo i wsparcie techniczne;' },
    { text: 'montaż i uruchomienie;' },
    { text: 'okresowe przeglądy urządzeń;' },
    { text: 'usuwanie awarii;' },
    { text: 'serwis gwarancyjny i pogwarancyjny.' },
  ];

  const sideMenuElements = [
    { href: '/serwis-urzadzen-wielofunkcyjnych', text: 'Serwis urządzeń wielofunkcyjnych' },
    { href: '/serwis-urzadzen-produkcyjnych', text: 'Serwis urządzeń produkcyjnych' },
    { href: '/serwis-urzadzen-wielkoformatowych', text: 'Serwis urządzeń wielkoformatowych' },
  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Serwis produkcyjnych urządzeń drukujących" imgSrc="/static/header_serwis.webp" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8">
          <div className="md:w-1/4">
            <SideMenu elements={sideMenuElements} title="SERWIS" />
          </div>
          <div className="md:w-3/4">
            <div className="w-full mb-16 p-10 bg-dks-medium-gray flex">
              <SupportAgentSharpIcon className="text-dks-red h-24 w-24" />
              <div className="ml-16 text-sm">
                <span className="font-bold text-lg">Kontakt z serwisem:</span>
                <br />
                <br />
                <span className="font-bold">Telefon:</span>
                <br />
                <Link href="tel:801004104">
                  <a href="tel:801004104" className="text-dks-sea-blue hover:text-dks-red">
                    801 004 104
                  </a>
                </Link>
                <br />
                <Link href="tel:583506605">
                  <a href="tel:583506605" className="text-dks-sea-blue hover:text-dks-red">
                    58 350 66 05
                  </a>
                </Link>
              </div>
            </div>
            <div className="flex sm:flex-col gap-6">
              <div className={`md:w-1/2 ${styles.htmlContent}`}>
                <p>
                  Prowadzimy
                  {' '}
                  <strong>serwis produkcyjnych urządzeń drukujących</strong>
                  . W
                  segmencie Production Printing wyspecjalizowaliśmy się w naprawach,
                  konserwacji i uruchomieniach maszyn produkcyjnych Konica Minolta i Canon.
                  Zaawansowane technologicznie systemy druku wymagają eksperckiej obsługi
                  i wsparcia.
                  Dlatego ten segment urządzeń obsługiwany
                  jest przez specjalny zespół wysoko wykwalifikowanych techników.
                  Dzięki regularnym inwestycjom nieustannie podnosimy
                  jakość świadczonych usług. Budujemy swoje kompetencje
                  poprzez intensywny program szkoleniowy,
                  wdrażany przy aktywnym udziale przedstawicieli producentów
                  sprzętu drukującego.
                  {' '}
                </p>
                <p>
                  Naszym Klientom zapewniamy fachowe doradztwo i
                  {' '}
                  <strong>
                    wsparcie
                    techniczne na wszystkich etapacheksploatacji
                    systemów druku produkcyjnego
                  </strong>
                  . Planując
                  inwestycję w
                  {' '}
                  <a
                    title="drukarki poligraficzne"
                    href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii"
                    target="_self"
                  >
                    drukarki poligraficzne
                  </a>
                  , możesz liczyć
                  na pomoc w wyborze optymalnego urządzenia.
                  Oferujemy też pomoc w instalacji urządzenia
                  i jego rozruchu. Prowadzimy też szkolenia z obsługi.
                  W trakcie eksploatacji wykonujemy doraźne naprawy, okresowe przeglądy
                  i remonty generalne.
                </p>
                <p>
                  Jeżeli potrzebujesz obsługi serwisowej maszyny do druku produkcyjnego,
                  zapraszamy do telefonicznego i bezpośredniego kontaktu: prowadzimy
                  {' '}
                  <strong>
                    12
                    punktów serwisowych
                    w największych miastach w Polsce
                  </strong>
                  . Otrzymasz
                  pełną informację na temat sprzętu, cen
                  i możliwości zakupu – zarówno nowych,
                  jak i używanych (poleasingowych) drukarek i systemów poligraficznych.
                </p>
                <p>Na kompleksowo prowadzoną działalność serwisową składają się:</p>
              </div>
              <div className="md:w-1/2">
                <p className="text-dks-font text-base pt-4 pb-4">Na kompleksowo prowadzoną działalność serwisową składają się:</p>
                <UnorderedList items={ulElements} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

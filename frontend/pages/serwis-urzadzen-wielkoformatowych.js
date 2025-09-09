import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
import UnorderedList from '../components/elements/unorderedList';
import styles from '../styles/pages.module.scss';

const TITLE = 'Serwis urządzeń wielkoformatowych KIP, Contex, Es-Te, Océ ';
const DESCRIPTION = 'Oferujemy profesjonalny serwis drukarek wielkoformatowych znanych producentów: KIP, Contex, Es-Te, Océ. Zapraszamy do punktów serwisowych w 12 miastach Polski.';

export default function ServiceLargeFormatDevices() {
  const ulElements = [
    { text: 'doradztwo i wsparcie techniczne;' },
    { text: 'montaż i uruchomienie;' },
    { text: 'okresowe przeglądy urządzeń;' },
    { text: 'usuwanie awarii i kalibracja;' },
    { text: 'serwis gwarancyjny i pogwarancyjny.' },
  ];

  const sideMenuElements = [
    { href: '/serwis-urzadzen-wielofunkcyjnych', text: 'Serwis urządzeń wielofunkcyjnych' },
    { href: '/serwis-urzadzen-produkcyjnych', text: 'Serwis urządzeń produkcyjnych' },
    { href: '/serwis-urzadzen-wielkoformatowych', text: 'Serwis urządzeń wielkoformatowych' },
  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Serwis urządzeń wielkoformatowych" imgSrc="/static/header_serwis.webp" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8">
          <div className="md:w-1/4">
            <SideMenu elements={sideMenuElements} title="SERWIS" />
          </div>
          <div className="md:w-3/4">
            <div className="flex sm:flex-col gap-6">
              <div className={`md:w-1/2 ${styles.htmlContent}`}>
                <p>
                  Zapraszamy do korzystania z naszego
                  {' '}
                  <strong>
                    serwisu urządzeń
                    wielkoformatowych
                  </strong>
                  . Posiadamy certyfikaty autoryzacyjne
                  do serwisowania, konserwacji
                  i naprawiania wielkoformatowych maszyn produkcyjnych KIP,
                  składarek wielkoformatowych es-te
                  oraz kolorowych skanerów wielkoformatowych Contex.
                  Naprawiamy też maszyny introligatorskie, skanery oraz laserowe
                  i atramentowe
                  {' '}
                  <a
                    title="drukarki wielkoformatowe"
                    href="https://www.dks.pl/oferta/rozwiazania-wielkoformatowe"
                    target="_self"
                  >
                    drukarki wielkoformatowe
                  </a>
                  {' '}
                  większości liczących się na rynku producentów.
                  Możesz zgłosić się do jednego z naszych 12 oddziałów
                  w największych miastach Polski.
                  Podejmujemy się naprawy dowolnego rodzaju sprzętu wielkoformatowego.
                </p>
                <h2>Podążamy za rozwojem technologii druku wielkoformatowego</h2>
                <p>
                  Rozwój rynku zaawansowanych i innowacyjnych technologii kopiowania,
                  drukowania, skanowania jest niezwykle dynamiczny.
                  Każdego roku odbywają się premiery nowych serii maszyn,
                  nowych rozwiązań w technice druku i obróbki poligraficznej.
                  Zdajemy sobie sprawę, że
                  {' '}
                  <strong>
                    serwis sprzętu drukującego
                    na najwyższym poziomie
                  </strong>
                  {' '}
                  wymaga licznych szkoleń,
                  poszerzania wiedzy technicznej
                  i poznawania nowych urządzeń.
                  Dlatego jesteśmy obecni na najważniejszych imprezach branżowych,
                  korzystamy z wiedzy przekazywanej przez producentów sprzętu.
                  Wymieniamy się doświadczeniami z innymi dostawcami
                  i serwisantami sprzętu wielkoformatowego.
                </p>
              </div>
              <div className="md:w-1/2">
                <p>
                  Dbałość o stały rozwój sprawia,
                  że możemy swoim Klientom oferować skuteczne wsparcie techniczne
                  i merytoryczne. Dokonujemy napraw i przeglądów w miejscu pracy maszyn,
                  udzielamy też licznych konsultacji telefonicznych.
                  Zawsze możesz też odwiedzić jeden
                  z naszych oddziałów zlokalizowanych w 12 miastach wojewódzkich
                </p>
                <p className="text-dks-font text-base pt-4 pb-4">Na kompleksowo prowadzony serwis urządzeń wielkoformatowych składają się:</p>
                <UnorderedList items={ulElements} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

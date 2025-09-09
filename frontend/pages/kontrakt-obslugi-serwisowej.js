import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
import UnorderedList from '../components/elements/unorderedList';
import styles from '../styles/pages.module.scss';

const TITLE = 'Kontakt Obsługi Serwisowej: nie płać za awarie drukarek w firmie!';
const DESCRIPTION = 'Zachęcamy do korzystania z Kontaktu Obsługi Serwisowej (KOS). To umowa zabezpieczająca przed kosztami awarii sprzętu drukującego – również po ustaniu gwarancji ';

export default function ServiceContract() {
  const ulElements = [
    { text: 'równomierne rozłożenie kosztów eksploatacji;' },
    { text: 'łatwa kalkulacja miesięcznych kosztów druku;' },
    { text: 'stała opieka i skrócony czas reakcji serwisowej;' },
    { text: 'uzupełnianie materiałów eksploatacyjnych zawsze na czas;' },
    { text: 'wydłużony okres eksploatacji maszyny;' },
    { text: 'gwarancja jakości wydruków i sprzętu;' },
    { text: 'wygoda i oszczędność czasu);' },
  ];

  const sideMenuElements = [
    { href: '/serwis-urzadzen-wielofunkcyjnych', text: 'Serwis urządzeń wielofunkcyjnych' },
    { href: '/serwis-urzadzen-produkcyjnych', text: 'Serwis urządzeń produkcyjnych' },
    { href: '/serwis-urzadzen-wielkoformatowych', text: 'Serwis urządzeń wielkoformatowych' },
  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Kontrakt obsługi serwisowej" imgSrc="/static/header_serwis.webp" />
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
                  Opracowany przez nas
                  {' '}
                  <strong>
                    Kontrakt
                    Obsługi Serwisowej (KOS)
                  </strong>
                  {' '}
                  to umowa,
                  która zwalnia użytkownika sprzętu drukującego
                  z ponoszenia kosztów usuwania awarii
                  i zakupu niezbędnych materiałów eksploatacyjnych.
                  Po jej podpisaniu nie musisz zajmować się zakupem tonerów,
                  terminową wymianą zużytych podzespołów, planową konserwacją
                  czy doraźnymi naprawami. Bierzemy na siebie wszystkie koszty,
                  które generują kserokopiarki i
                  {' '}
                  <a
                    title="drukarki do firmy"
                    href="https://www.dks.pl/oferta/rozwiazania-dla-biura/"
                    target="_self"
                  >
                    drukarki do firmy
                  </a>
                  {' '}
                  oraz inne maszyny drukujące. Zajmujemy się każdym aspektem technicznym druku.
                  Korzystając z naszych usług, masz gwarancję niezawodnego działania sprzętu.
                </p>
                <h2>Koszty eksploatacyjne wkalkulowane w cenę pojedynczego wydruku</h2>
                <p>
                  Istotą umowy KOS jest
                  {' '}
                  <strong>
                    zamiana trudnych
                    do przewidzenia kosztów eksploatacji
                    sprzętu drukującego na stały koszt pojedynczego wydruku
                  </strong>
                  . Gwarantujemy
                  niezmienną stawkę za jedną wydrukowaną stronę
                  w całym okresie obowiązywania umowy. Oznacza to,
                  że miesięczna opłata zależy od liczby wydruków: płacisz tylko
                  za faktycznie wykonane zadania, a nie za utrzymywanie urządzenia w gotowości.
                </p>
                <p>
                  KOS pozwala łatwo skalkulować i zaplanować w budżecie wydatki ponoszone
                  na drukowanie i przetwarzanie dokumentów firmowych.
                  Oznacza też wymierną oszczędność czasu, który możesz przeznaczyć
                  na podstawową działalność biznesową.
                  KOS to maksymalny komfort użytkowania foty drukującej.
                </p>
              </div>
              <div className="md:w-1/2">
                <p className="text-dks-font text-base pt-4 pb-4">Korzyści z umowy KOS:</p>
                <UnorderedList items={ulElements} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

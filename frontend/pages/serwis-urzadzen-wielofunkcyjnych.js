import Link from 'next/link';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
import styles from '../styles/pages.module.scss';

const TITLE = 'Serwis urządzeń wielofunkcyjnych Konica Minolta, HP, Canon, Ricoh';
const DESCRIPTION = 'Oferujemy autoryzowany serwis urządzeń wielofunkcyjnych i drukarek Konica Minolta, Canon, HP, Lexmark w 12 miastach w całej Polsce. Sprawdź szczegóły oferty.';

export default function ServiceMultifunctionalDevices() {
  const sideMenuElements = [
    { href: '/serwis-urzadzen-wielofunkcyjnych', text: 'Serwis urządzeń wielofunkcyjnych' },
    { href: '/serwis-urzadzen-produkcyjnych', text: 'Serwis urządzeń produkcyjnych' },
    { href: '/serwis-urzadzen-wielkoformatowych', text: 'Serwis urządzeń wielkoformatowych' },
  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Autoryzowany serwis urządzeń wielofunkcyjnych" imgSrc="/static/header_serwis.webp" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8">
          <div className="md:w-1/4">
            <SideMenu elements={sideMenuElements} title="SERWIS" />
          </div>
          <div className="md:w-3/4">
            <div className="w-full mb-16 p-10 bg-dks-medium-gray flex">
              <SettingsOutlinedIcon className="text-dks-red h-24 w-24" />
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
            <div className={styles.htmlContent}>
              <p>
                Realizujemy zapotrzebowanie na serwis urządzeń wielofunkcyjnych
                wszystkich popularnych marek,
                które są dostępne na polskim rynku.
                Podejmujemy się różnorodnych działań serwisowych –
                od usuwania drobnych usterek po kompleksowe przeglądy i naprawy.
              </p>
              <p>
                {' '}
                Oferujemy autoryzowany
                {' '}
                <strong>
                  serwis drukarek Canon
                  i Konica Minolta
                </strong>
                , które stanowią bardzo liczną
                i różnorodną część naszej oferty
                sprzętu drukującego. Znajdziesz w niej trwałe,
                kompaktowe urządzenia do małych biur
                i wysokowydajne korporacyjne kserokopiarki wielofunkcyjne.
              </p>
              <p>
                Jedną z naszych specjalizacji
                jest
                {' '}
                <strong> naprawa drukarek HP</strong>
                – posiadamy potwierdzone
                certyfikatami kompetencje
                do serwisowania sprzętu tej popularnej marki.
                Nowoczesne, wielofunkcyjne
                {' '}
                <a
                  title="kserokopiarki HP"
                  href="https://www.dks.pl/oferta/rozwiazania-dla-biura/hp"
                >
                  kserokopiarki HP
                </a>
                {' '}
                mają opinię jednych
                z najlepiej chronionych sieciowych maszyn drukujących.
                Wyróżniają się wielopoziomową kontrolą dostępu
                i zabezpieczeniami przed atakami hakerskimi.
                Naszym Klientom zapewniamy też profesjonalny serwis drukarek
                i kserokopiarek Lexmark – wysokiej jakości sprzętu drukującego,
                oferowanego w przystępnej cenie.
                Ponadto obsługujemy użytkowników urządzeń drukujących Ricoh
                i Kyocera oraz wielu innych marek.
              </p>
              <p>
                Doradzamy naszym Klientom i wspieramy ich w zakresie montażu urządzenia
                i jego uruchomienia. Posiadając we własnych magazynach
                części zamienne i
                {' '}
                <a
                  title="materiały eksploatacyjne"
                  href="https://www.dks.pl/materialy-eksploatacyjne"
                >
                  materiały eksploatacyjne
                </a>
                {' '}
                do drukarek,
                możemy zaoferować naszym Klientom
                {' '}
                <strong>
                  {' '}
                  skrócony czas oczekiwania
                  na realizację zleceń serwisowych
                </strong>
                {' '}
                i zamówień.
                Za serwisowanie i naprawy urządzeń drukujących odpowiedzialni
                są wykwalifikowani specjaliści,
                którzy mają do dyspozycji rozbudowane zaplecze techniczne.
                Wymienione atuty pozwalają nam świadczyć usługi zgodne
                z najlepszymi światowymi standardami.
              </p>
              <h2>12 oddziałów serwisowych</h2>
              <p>
                Prowadzimy
                {' '}
                <strong> 12 oddziałów serwisowych</strong>
                {' '}
                w największych
                miastach Polski:
                w Gdańsku, Warszawie, Katowicach, Poznaniu, Łodzi, Krakowie, Szczecinie,
                Bydgoszczy, Olsztynie, Rzeszowie, Białymstoku i Wrocławiu.
                Dzięki temu możemy zaoferować szybki dojazd
                do Klienta na terenie całego kraju.
                Oprócz naprawy drukarek i urządzeń wielofunkcyjnych prowadzimy też
                {' '}
                <a
                  title="serwis urządzeń produkcyjnych"
                  href="https://www.dks.pl/serwis-urzadzen-produkcyjnych"
                  target="_self"
                >
                  serwis urządzeń produkcyjnych
                </a>
                {' '}
                i drukarek
                wielkoformatowych. Zapraszamy do korzystania z naszych usług.
              </p>
              <h2>Profesjonalny serwis kserokopiarek Canon i Konica Minolta</h2>
              <p>
                  Zapewniamy profesjonalny serwis kserokopiarek <strong>Canon</strong> i <strong>Konica Minolta</strong>, dbając o najwyższą jakość świadczonych usług. Nasz zespół specjalistów posiada szeroką wiedzę i doświadczenie w serwisowaniu urządzeń tych renomowanych marek. Dzięki temu jesteśmy w stanie szybko i skutecznie diagnozować oraz usuwać usterki, a także przeprowadzać okresowe przeglądy i konserwacje.
              </p>
              <p>
                  Ponadto oferujemy również wsparcie techniczne oraz doradztwo w zakresie optymalnego wykorzystania urządzeń, aby zapewnić ich długotrwałe i bezproblemowe funkcjonowanie. Współpracujemy zarówno z klientami indywidualnymi, jak i przedsiębiorstwami, dostosowując nasze usługi do indywidualnych potrzeb i wymagań. Gwarantujemy terminowe realizacje zleceń oraz konkurencyjne ceny, co sprawia, że jesteśmy godnym zaufania partnerem w dziedzinie serwisowania kserokopiarek Canon i Konica Minolta.
              </p>
              <h3>Nasze usługi serwisowe obejmują:</h3>
              <ul>
                  <li>Diagnostykę i naprawę usterek,</li>
                  <li>Przeglądy techniczne i konserwacje,</li>
                  <li>Wymianę części eksploatacyjnych,</li>
                  <li>Aktualizację oprogramowania oraz sterowników,</li>
                  <li>Doradztwo techniczne i pomoc w doborze odpowiednich urządzeń.</li>
              </ul>
              <p>
                  Dbamy o stałe podnoszenie kwalifikacji naszych serwisantów, co pozwala nam na bieżąco śledzić nowinki technologiczne oraz wprowadzać innowacyjne rozwiązania. Współpracujemy również z producentami, co gwarantuje dostęp do oryginalnych części zamiennych oraz materiałów eksploatacyjnych.
              </p>
              <p>
                  Nasza oferta serwisowa jest skierowana zarówno do klientów indywidualnych, jak i przedsiębiorstw, które posiadają urządzenia Canon i Konica Minolta. Jesteśmy elastyczni i dostosowujemy się do potrzeb naszych klientów, oferując różne formy współpracy, takie jak serwis gwarancyjny, pogwarancyjny czy umowy serwisowe.
              </p>
              <p>
                  Wybierając nasz serwis kserokopiarek Canon i Konica Minolta, zyskujesz pewność profesjonalnego podejścia, szybkiego czasu reakcji oraz gwarancję zadowolenia z wykonanych usług. Skontaktuj się z nami, aby uzyskać więcej informacji lub umówić się na wizytę serwisanta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

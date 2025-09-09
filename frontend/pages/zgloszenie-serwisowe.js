import Link from 'next/link';
import SupportAgentSharpIcon from '@mui/icons-material/SupportAgentSharp';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
// import UnorderedList from '../components/elements/unorderedList';
import ServiceCallFormAlternative from '../components/elements/serviceCallFormAlternative';
import styles from '../styles/pages.module.scss';

const TITLE = 'Naprawa drukarek laserowych i kserokopiarek: zgłoszenia serwisowe';
const DESCRIPTION = 'Jeżeli twoja maszyna przestała działać, skorzystaj z elektronicznego formularza i zgłoś awarię. Naprawiamy drukarki laserowe i kserokopiarki wszystkich marek. ';

export default function ServiceCall() {
  // const ulElements = [
  //   { text: `szybkie zgłoszenie awarii, które zostanie natychmiast przyjęte przez pracowników
  //            serwisu DKS;` },
  //   { text: 'możliwość zamawiania i monitorowania dostawy materiałów eksploatacyjnych;' },
  //   { text: 'okresowe przeglądy urządzeń;' },
  //   { text: 'możliwość zgłaszania odczytów liczników urządzeń;' },
  // ];

  const sideMenuElements = [
    { href: '/serwis-urzadzen-wielofunkcyjnych', text: 'Serwis urządzeń wielofunkcyjnych' },
    { href: '/serwis-urzadzen-produkcyjnych', text: 'Serwis urządzeń produkcyjnych' },
    { href: '/serwis-urzadzen-wielkoformatowych', text: 'Serwis urządzeń wielkoformatowych' },
  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION} useRecaptcha>
      <HeaderTop title="Zgłoszenie serwisowe" imgSrc="/static/header_serwis.webp" />
      <div className="md:max-w-screen-xl sm:px-3">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8 px-4 xl:px-0">
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
            <div className={styles.htmlContent}>
              <p>
                Najważniejszą częścią naszych usług jest
                <strong>
                  {' '}
                  naprawa
                  kserokopiarek
                </strong>
                {' '}
                Konica Minolta, HP, Canon, Ricoh, Kyocera
                i wielu innych marek.To najpowszechniej stosowane
                {' '}
                <a
                  title="urządzenia wielofunkcyjne do biura"
                  href="https://www.dks.pl/oferta/rozwiazania-dla-biura/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  urządzenia wielofunkcyjne do biura
                </a>
                , które są chętnie kupowane i dzierżawione zarówno przez małe firmy,
                jak i korporacje.
                <strong> Serwis kserokopiarek</strong>
                {' '}
                obejmuje
                nie tylko doraźne naprawy,
                lecz także okresowe przeglądy techniczne
                oraz wymianę materiałów eksploatacyjnych.
              </p>
              <p>
                W zakresie naszych usług znajduje się
                {' '}
                <strong>
                  {' '}
                  naprawa drukarek
                  laserowych
                </strong>
                , które są najpowszechniej wykorzystywane w biurach przedsiębiorstw i korporacji.
                Prowadzimy działania serwisowe i naprawcze,
                stosując oryginalne części zamienne i
                {' '}
                <a
                  title="materiały eksploatacyjne do drukarek"
                  href="https://www.dks.pl/materialy-eksploatacyjne"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  materiały eksploatacyjne do drukarek
                </a>
                {' '}
                oraz wysokiej jakości zamienniki. Niezależnie od tego,
                jaką drukarkę laserową użytkujesz,
                w przypadku awarii możesz zgłosić się do naszego serwisu.
                Zajmiemy się każdym problemem i każdym typem maszyny drukującej.
              </p>
              <h2>Zgłoś online awarię urządzenia drukującego!</h2>
              <p>
                Awarie zdarzają się dokładnie wtedy, gdy najmniej się tego spodziewasz.
                Ta zasada dotyczy również sprzętu drukującego.
                Naszym priorytetem jest jak najszybsza reakcja serwisowa.
                Dlatego uruchomiliśmy formularz zgłoszenia awarii on-line.
                Informację można wysłać każdego dnia i o każdej godzinie.
              </p>
              <p>
                Za pośrednictwem elektronicznego formularza,
                możesz dokonać zgłoszenia w następujących sprawach:
              </p>
              <ul>
                <li>
                  <strong>awaria sprzętu drukującego</strong>
                  {' '}
                  – zgłoszenie
                  jest niezwłocznie przyjmowane przez pracowników naszego serwisu
                  i przekazywane do realizacji najszybciej, jak to tylko możliwe,
                </li>
                <li>
                  <strong>zamówienie materiałów eksploatacyjnych</strong>
                  {' '}
                  – formularz
                  jest wygodnym sposobem składania zamówień
                  i monitorowania dostawy materiałów eksploatacyjnych,
                </li>
                <li>
                  <strong>zgłoszenie przeglądu </strong>
                  {' '}
                  – internetowe zgłoszenie
                  okresowego przeglądu maszyny drukującej jest szybkie
                  i bardzo komfortowe,
                </li>
                <li>
                  <strong>odczyty liczników maszyn drukujących</strong>
                  {' '}
                  – opcja dotyczy Klientów,
                  którzy wybrali
                  {' '}
                  <a
                    title="wynajem urządzeń drukujących"
                    href="https://www.dks.pl/wynajem-urzadzen-wielofunkcyjnych"
                  >
                    wynajem urządzeń drukujących
                  </a>
                  : odczyty stanu
                  liczników są podstawą do naliczania wysokości
                  miesięcznych opłat.
                </li>
              </ul>
              <p>
                Jeżeli potrzebujesz szybkiej konsultacji lub chcesz zgłosić problem,
                który nie ma przypisanej kategorii w formularzu.
                W bezpośredniej rozmowie ze specjalistą otrzymasz odpowiedzi
                na wszystkie pytania związane ze sprzętem drukującym.
                Czekamy na Twoje zgłoszenie!
              </p>
              <h2>Szybka naprawa kserokopiarek</h2>
              <p>
                  Nasza firma specjalizuje się w szybkiej naprawie kserokopiarek różnych marek, m.in. takich jak Konica Minolta, HP, Canon, Ricoh, Kyocera. Jesteśmy świadomi, jak ważne jest dla klientów, aby ich urządzenia drukujące były sprawne i gotowe do pracy. Dlatego oferujemy usługi naprawy kserokopiarek na najwyższym poziomie, gwarantując szybką i efektywną reakcję serwisową.
              </p>
              <p>W ramach naszej oferty szybkiej naprawy kserokopiarek zapewniamy:</p>
              <ul>
                  <li><strong>diagnostykę awarii</strong> i ustalenie przyczyny problemu,</li>
                  <li><strong>wymianę uszkodzonych lub zużytych części</strong> na oryginalne lub wysokiej jakości zamienniki,</li>
                  <li><strong>profesjonalne doradztwo techniczne</strong> oraz pomoc w doborze odpowiednich materiałów eksploatacyjnych,</li>
                  <li><strong>regularne przeglądy techniczne</strong> oraz konserwację urządzeń, aby zapobiegać przyszłym awariom.</li>
              </ul>
              <p>
                  Nasza firma posiada wykwalifikowany zespół serwisantów, którzy mają wieloletnie doświadczenie w naprawie kserokopiarek. Dzięki temu jesteśmy w stanie szybko zdiagnozować problem i przeprowadzić naprawę, minimalizując czas przestoju urządzenia drukującego.
              </p>
            </div>

            {/* <h6 className="font-bold text-lg mb-4">
              Zgłoszenie serwisowe on-line to:
            </h6> */}

            {/* <UnorderedList items={ulElements} />  */}

            <h4 className="font-bold text-2xl py-10">Formularz zgłoszeniowy</h4>
            <ServiceCallFormAlternative />
          </div>
        </div>
      </div>
    </Layout>
  );
}

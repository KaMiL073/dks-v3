import PropTypes from 'prop-types';
import { useState } from 'react';
import Image from 'next/image';
import Layout from '../components/layouts/layout';
import HeroSection from '../components/career/heroSection';
import IconElementsSection from '../components/career/iconElementsSection';
import UnorderedList from '../components/elements/unorderedList';
import Modal from '../components/elements/modal';
import getJobs from '../lib/models/jobs';

const TITLE = 'Kariera - DKS';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function Career({ jobs }) {
  const [modalClassic, setModal] = useState(null);

  // job offers
  const work = jobs.map(({
    position, description, city, region, id,
  }) => (
    <div
      className="bg-dks-medium-gray p-10 m-3 w-96 hover:border-b hover:border-dks-red"
      // eslint-disable-next-line react/no-array-index-key
      key={`cert_${id}`}
      role="button"
      onClick={() => {
        setModal({
          position, description,
        });
      }}
      onKeyPress={() => {
        setModal({
          position,
          description,
        });
      }}
      tabIndex={0}
    >
      <h5 className="font-bold text-lg">{position}</h5>
      <br />
      <p>
        <strong>Miejsce pracy: </strong>
        {' '}
        {city}
      </p>
      <p>
        <strong>Region: </strong>
        {' '}
        {region}
      </p>
    </div>
  ));

  // IconElementsSection - Dlaczego warto pracować w DKS?
  const iconElements = [
    {
      icon: 'static/pages/chart-line.svg',
      name: 'STABILNOŚĆ',
      subtitle: 'Mamy ponad 30 lat doświadczenia w prowadzeniu biznesu w kraju i za granicą, tysiące klientów i zrealizowanych kontraktów w zakresie rozwiązań związanych z technologią wydruku i zarządzaniem dokumentami w firmach.',
    },
    {
      icon: 'static/pages/award-solid.svg',
      name: 'PRESTIŻ I MOŻLIWOŚCI',
      subtitle: 'Współpraca z najbardziej znanymi producentami i szeroka oferta produktów i usług dają nam przewagę w pozyskiwaniu nowych klientów i budowaniu relacji biznesowych opartych na kompleksowych rozwiązaniach.',
    },

    {
      icon: 'static/pages/handshake-regular.svg',
      name: 'ZAUFANIE',
      subtitle: 'Nasza filozofia opiera się na dobrych relacjach i naturalnym podejściu do klientów. Od lat cieszymy się ich zaufaniem- wspieramy ich biznesy kompleksowymi, szytymi na miarę rozwiązaniami.',
    },
    {
      icon: 'static/pages/hubspot-brands.svg',
      name: 'INTENSYWNY ROZWÓJ',
      subtitle: 'Dynamiczny rozwój wiąże się z ciągłym rozwojem naszych struktur- działamy na dużą skalę i cały czas się rozwijamy: ponad 180 pracowników, 12 oddziałów w największych miastach w Polsce, sprawna sieć logistyczno- magazynowa.',
    },
    {
      icon: 'static/pages/graduation-cap-solid.svg',
      name: 'PROFESJONALIZM',
      subtitle: 'Przywiązujemy dużą wagę do ciągłego podnoszenia kwalifikacji, szkoleń i podążania za nowinkami technicznymi, by nasi pracownicy czuli się ekspertami w tym co robią i mogli awansować w strukturach firmy.',
    },
    {
      icon: 'static/pages/business-time-solid.svg',
      name: 'KOMFORT PRACY',
      subtitle: 'Zatrudniamy naszych pracowników w ramach umowy o pracę, zapewniamy komfortowe narzędzia pracy i wygodny system pracy (zwykle 8:00-16:00 od poniedziałku do piątku).',
    },
    {
      icon: 'static/pages/hand-holding-heart-solid.svg',
      name: 'DLA PRACOWNIKA',
      subtitle: 'Nasi Pracownicy mogą skorzystać z oferty grupowego ubezpieczenia na  życie i prywatnej opieki medycznej, a także z dofinansowania do karty Multisport i udziału w różnych wydarzeniach sportowych jako Team DKS .',
    },
    {
      icon: 'static/pages/people-carry-solid.svg',
      name: 'ZESPÓŁ',
      subtitle: 'Chcemy, by DKS był przyjaznym miejscem pracy, gdzie pracownicy dobrze się czują, mają do siebie zaufanie, współpracują ze sobą, dzielą się z innymi wiedzą i mogą rozwijać swoje pasje i zainteresowania. Praca w DKS, to praca z profesjonalistami pełnymi pasji!',
    },
  ];

  // IconElementsSection - Rekrutacja krok po kroku
  const title2 = 'Rekrutacja krok po kroku';
  const iconElements2 = [
    {
      icon: 'static/pages/address-card-regular.svg',
      name: 'Etap 1: Aplikacja i analiza CV',
      subtitle: 'Analizujemy dokładnie wszystkie przesłane do nas aplikacje pod kątem tego, które z nich najbardziej pasują do wyzwań, które pojawiają się w naszej firmie.mają do siebie zaufanie, współpracują ze sobą, dzielą się z innymi wiedzą i mogą rozwijać swoje pasje i zainteresowania. Praca w DKS, to praca z profesjonalistami pełnymi pasji!',
    },
    {
      icon: 'static/pages/comments-regular.svg',
      name: 'Etap 2: Rozmowa telefoniczna',
      subtitle: 'W celu doprecyzowania danych zawartych w CV oraz oczekiwań Kandydatów kontaktujemy się telefonicznie z wybranymi osobami i przedstawiamy wstępne informacje na temat oferty.',
    },
    {
      icon: 'static/pages/handshake-regular.svg',
      name: 'Etap 3: Spotkanie rekrutacyjne',
      subtitle: 'Wybrane osoby są zapraszamy na jedną lub dwie rozmowy kwalifikacyjne: ze specjalistą z działu HR i/lub z Managerem lub Dyrektorem oddziału. W przypadku niektórych stanowisk specjalistycznych zapraszamy dodatkowo kandydatów do wykonania testów lub zadań, weryfikujących umiejętności i predyzpocyje zawodowe.',
    },
    {
      icon: 'static/pages/thumbs-up-regular.svg',
      name: 'Etap 4: Zakończenie rekrutacji',
      subtitle: 'Kandydaci, którzy biorą udział w spotkaniu, otrzymują od nas informację zwrotną o wyniku procesu rekrutacyjnego- drogą telefoniczną bądź e-mailową. Jeśli nie zaproponujemy Ci pracy w danym momencie, zachęcamy do tego, by regularnie śledzić nasze oferty i aplikować ponownie w przypadku przyszłych rekrutacji!',
    },
  ];
  // list to section "Dołącz do ludzi z pasją w Twoim mieście"
  const items = [
    { text: 'sprzedaż urządzeń, części i materiałów eksploatacyjnych,' },
    { text: 'obsługa telefoniczna klientów biznesowych,' },
    { text: 'wsparcie techniczne i software,' },
    { text: 'finanse i księgowość,' },
    { text: 'logistyka magazynowa i transport,' },
    { text: 'zakupy i negocjacje cenowe z dostawcami,' },
    { text: 'handel zagraniczny w kilku językach,' },
    { text: 'marketing, IT,' },
    { text: 'flota i zaopatrzenie,' },
    { text: 'kadry i administracja.' },
  ];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeroSection bgImg="/static/pages/Fotolia_223246236_S.webp" />

      <section className="w-full">
        <div className="mx-2 md:max-w-screen-xl md:m-auto py-28">
          <h1 className="text-center text-5xl font-bold mb-6">Sprawdź nasze oferty pracy</h1>
          <div className="flex flex-wrap">

            {work}
            {modalClassic && <Modal imgSrc={modalClassic} onClose={() => setModal(null)} />}

          </div>
        </div>
      </section>

      <section className="mx-2 md:max-w-screen-xl m-auto py-28 text-center">
        <h3 className="text-5xl font-bold">Nie znalazłeś interesującej Cię oferty pracy?</h3>
        <p className="mt-10">
          Daj nam znać, że jesteś gotowy do podjęcia nowych wyzwań nawet jeśli
          nie prowadzimy aktualnie rekrutacji w Twoim mieście.
          Prześlij nam swoją aplikację na adres:
          {' '}
          <strong>rekrutacje@dks.pl</strong>
          z dopiskiem w tytule e-maila:
          {' '}
          <strong>STRONA KARIERY</strong>
          .
          Przed nami cały czas pojawiają się nowe wyzwania- jeśli nie dziś,
          może będziemy potrzebowali kogoś takiego jak Ty w najbliższej przyszłości.
          Skontaktujemy się z Tobą w przypadku pojawienia się odpowiedniej oferty pracy.
          Umieść w CV dodatkowo następującą klauzulę:
          Wyrażam zgodę na przetwarzanie moich danych osobowych
          dla potrzeb przyszłych procesów rekrutacji,
          prowadzonych przez DKS spółka z o.o.
        </p>
      </section>

      <IconElementsSection title="Dlaczego warto pracować w DKS?" titleClass="text-center" elements={iconElements} />

      <section className="bg-dks-medium-gray w-full">
        <div className="md:max-w-screen-xl mx-2 md:m-auto py-28">
          <h3 className="text-5xl font-bold">Dołącz do ludzi z pasją w Twoim mieście</h3>
          <div className="md:grid grid-cols-2 gap-8 mt-10 ">
            <div>
              <Image
                src="static/pages/Budynek_new_2.webp"
                objectFit="contain"
                width="800px"
                height="600px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
            </div>
            <div>
              <h4 className="text-2xl font-bold">Praca w Centrali w Trójmieście</h4>
              <p className="mt-3.5">
                Centrala naszej firmy znajduje się w Kowalach niedaleko Gdańska.
                Nowoczesna przestrzeń biurowa zaaranżowana
                pod potrzeby konkretnych zespołów,
                stanowi nie tylko komfortowe miejsce pracy
                dla działów administracyjnych wspierających biznes,
                lecz także idealne miejsce do prowadzenia szkoleń
                oraz spotkań biznesowych z naszymi klientami
                oraz partnerami biznesowymi.
                W związku z dynamicznym rozwojem,
                co jakiś czas prowadzimy rekrutacje do działów takich jak:
              </p>
              <br />
              <UnorderedList items={items} />

            </div>
          </div>
        </div>
      </section>

      <section className="w-full">
        <div className="mx-2 md:max-w-screen-xl md:m-auto py-28">
          <div className="md:grid grid-cols-2 gap-8 mt-10 ">
            <div>
              <h4 className="text-2xl font-bold">Praca w Oddziale</h4>
              <p className="mt-3.5">
                Poszerzając nasze struktury serwisowe i sprzedażowe,
                co jakiś czas prowadzimy rekrutacje
                w naszych
                {' '}
                <strong>12 oddziałach w całej Polsce:</strong>
              </p>
              <p className="mt-3.5">
                <strong>
                  Białystok, Bydgoszcz, Gdańsk, Katowice, Kraków, Łódź, Olsztyn,
                  Poznań, Warszawa, Wrocław, Rzeszów, Szczecin.
                </strong>
              </p>
              <p className="mt-3.5">
                <strong>JEŚLI TWOJĄ MOCNĄ STRONĄ SĄ ZDOLNOŚCI TECHNICZNE</strong>
                ... lubisz zgłębiać wiedzę techniczną, diagnozować i rozwiązywać tego
                typu problemy, a przy tym bardzo dobrze radzisz sobie w kontaktach
                z ludźmi i jesteś osobą potrafiącą sprawnie ogranizować swój czas
                pracy- doskonale odnajdziesz się
                {' '}
                <strong>
                  w naszych strukturach Autoryzowanego
                  Serwisu.
                </strong>
                {' '}
                Twoja praca będzie polegała na:
              </p>
              <ul>
                <li>diagnozowaniu przyczyn i usuwaniu awarii urządzeń w siedzibach u klienta,</li>
                <li>instalacji urządzeń i konfiguracji oprogramowania software,</li>
                <li>
                  przeglądach, konserwacji urządzeń, wymianie części
                  i materiałów eksploatacyjcnych,
                </li>
                <li>fachowym doradztwie w zakresie eksploatacji urządzeń.</li>
              </ul>
              <p className="mt-3.5">
                Zatrudniamy zarówno osoby z doświadczeniem w branży, jak i osoby,
                które dopiero chcą je zdobyć, zapewniając naszym pracownikom
                specjalistyczne narzędzia, dostęp do bazy wiedzy i profesjonalnej
                dokumentacji oraz szkoleń o różnym poziomie zaawansowania.
              </p>
              <p className="mt-3.5">
                Najczęściej rekrutujemy na stanowiska:
                <strong> Technik Serwisu, Inżynier Serwisu.</strong>
              </p>
            </div>
            <div>
              <Image
                src="static/pages/2CN0aTSSaZEEtBVa6iXMgSxv6diEBzXDbm4r5gB1.webp"
                objectFit="contain"
                width="800px"
                height="600px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="bg-dks-medium-gray w-full">
        <div className="md:max-w-screen-xl mx-2 md:m-auto py-28">
          <div className="md:grid grid-cols-2 gap-8 mt-10 ">
            <div>
              <Image
                src="static/pages/JtkaAjxPL4rL9aAxMx6MG21ZD7x8niiy0Ey5hm4f.webp"
                objectFit="contain"
                width="800px"
                height="600px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
            </div>
            <div>
              <p className="mt-10">
                <strong>JEŚLI TWOJĄ MOCNĄ STRONĄ JEST BUDOWANIE RELACJI Z INNYMI</strong>
              </p>
              <p className="mt-10">
                ... potrafisz świetnie rozpoznawać potrzeby klientów B2B wychodząc
                poza sztywne ramy, a przy tym wyróżniasz się wytrwałością,
                umiejętnością przekonywania do swoich pomysłów i nastawieniem
                na zdobywanie nowej wiedzy - doskonale odnajdziesz się
                <strong> w naszych strukturach sprzedażowych</strong>
                .
                W każdym oddziale zatudniamy kilku doradców biznesowych,
                którzy w zależności od specjalizacji, doradzają klientom
                w zakresie komplesowych rozwiązań związanych z:
              </p>
              <ul>
                <li>
                  <strong> urządzeniami biurowymi </strong>
                  {' '}
                  dla firm,
                  biur i instytucji wszystkich sektorów gospodarki - zarówno
                  w kwestii urządzeń wielofunkcyjnych, drukarek,
                  specjalistycznych niszczarek,
                  a także
                  {' '}
                  <strong>oprogramowania </strong>
                  optymalizującego
                  proces wydruków i obieg dokumentów w firmach
                </li>
                <li>
                  <strong>częściami i materiałami eksploatacyjnymi do urządzeń.</strong>
                </li>
              </ul>
              <p className="mt-10">
                Najczęściej rekrutujemy na stanowiska:
                <strong>Doradca biznesowy, Przedstawiciel Handlowy, Key Account Manager.</strong>
              </p>

              <p className="mt-10">
                <strong>JEŚLI TWOJĄ MOCNĄ STRONĄ JEST ZNAJOMOŚĆ BRANŻY</strong>
              </p>
              <p className="mt-10">
                ... poligraficznej, reklamowej, projektowej (CAD&amp;GIS),
                druku cyfrowego lub Grafic Arts- z pewnością wykorzystasz ją w naszej firmie.
                Wychodząc naprzeciw potrzebom klientów takich jak: drukarnie, wydawnictwa,
                biura projektowe, punkty usługowe stworzyliśmy specjalny zespół dedykowany
                współpracy właśnie z tymi klientami w zakresie rozwiązań zwiazanych z
                <strong>
                  &nbsp;urządzeniami do wydruków profesjonalnych,
                  produkcyjnych i wielkoformatowych &nbsp;
                </strong>
                oraz
                {' '}
                <strong>urządzeniami do obróbki po druku -&nbsp;</strong>
                zarówno wykończenie introligatorskie,
                jak również uszlachetnianie podłoży
                <strong>
                  &nbsp;oprogramowaniem do zarządzania drukiem, systemami WebToPrint,
                  oprogramowaniem do fotoksiążek i kalendarzy,
                  zarządzania kolorem i impozycji.
                </strong>
              </p>
              <p className="mt-10">
                <strong>APLIKACJA SPONTANICZNA!</strong>
              </p>
              <p className="mt-10">
                Nie znalazłeś interesującego Cię ogłoszenia?
                Nasza firma nieustannie się rozwija-
                jeśli chcesz do nas dołączyć wyślij nam swoje CV na adres e-mail: rekrutacje@dks.pl
              </p>
            </div>
          </div>
        </div>
      </section>

      <IconElementsSection title={title2} titleClass="text-left" elements={iconElements2} />

      <section className="bg-dks-medium-gray w-full">
        <div className="md:max-w-screen-xl m-auto py-28">
          <h3 className="text-5xl font-bold pb-10">Kilka porad dla kandydata</h3>
          <h4 className="text-2xl font-bold">Przed spotkaniem zachęcamy:</h4>

          <div className="grid md:grid-rows-3 md:grid-flow-col md:gap-8">
            <div className="flex">

              <Image
                className="h-24 w-48 h-auto"
                src="static/pages/laptop-solid.svg"
                objectFit="contain"
                width="148px"
                height="148px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
              <p className="p-6">
                dowiedz się jak najwięcej na temat DKS: czym się zajmujemy,
                jakie świadczymy usługi, z kim współpracujemy,
                jakie mamy cele oraz pozycję w branży,
                zastanów się kto jest naszym klientem i jakie ma potrzeby,
              </p>
            </div>
            <div className="flex">
              <Image
                src="static/pages/book-reader-solid.svg"
                objectFit="contain"
                width="148px"
                height="148px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
              <p className="p-6">
                przypomnij sobie zadania związane ze stanowiskiem,
                na które aplikujesz. Zastanów się w jaki sposób
                nasze oczekiwania wobec kandydata są zbieżne
                z Twoim doświadczeniem. Przypomnij sobie
                konkretne sytuacje i przykłady,
                które mógłbyś przytoczyć podczas spotkania,
              </p>
            </div>
            <div className="flex">
              <Image
                src="static/pages/question-circle-regular.svg"
                objectFit="contain"
                width="148px"
                height="148px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
              <p className="p-6">
                przygotuj pytania, które pozwolą Ci ocenić czy nasza
                Firma jest miejscem w którym chciałbyś się rozwijać.
                Podczas spotkań staramy się opowiedzieć jak najdokładniej
                kogo szukamy i na czym będzie polegała Twoja przyszła praca,
                a także jaką rolę będziesz pełnił w organizacji,
              </p>
            </div>

            <div className="flex">
              <Image
                src="static/pages/comment-dots-regular.svg"
                objectFit="contain"
                width="148px"
                height="148px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
              <p className="p-6">
                korzystaj z okazji, żeby nas poznać - bierzemy udział
                w różnych wydarzeniach organizowanych na terenie całej Polski:
                znajdź nas na Targach Pracy bądź na Targach branżowych,
                spotkaj się z naszymi pracownikami i poznaj specyfikę pracy
                w naszej firmie z pierwszej ręki,
              </p>
            </div>
            <div className="flex ">
              <Image
                src="static/pages/thumbs-up-regular.svg"
                objectFit="contain"
                width="148px"
                height="148px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
              <p className="p-6">
                daj nam znać, że jesteś gotowy do podjęcia nowych wyzwań
                nawet jeśli nie prowadzimy aktualnie rekrutacji w Twoim mieście.
                <br />
                Prześlij nam swoją aplikację na adres: rekrutacje@dks.pl
                z dopiskiem w tytule e-maila: „ STRONA KARIERY ”.
                W przypadku zainteresowania Twoją kandydaturą umówimy się na spotkanie,
              </p>
            </div>
            <div className="flex">
              <Image
                src="static/pages/facebook-square-brands.svg"
                objectFit="contain"
                width="148px"
                height="148px"
                alt="Dołącz do ludzi z pasją w Twoim mieście"
              />
              <p className="p-6">
                dołącz do nas na Facebooku! Śledź nasze aktualne wydarzenia,
                bierz udział w konkursach, a przede wszystkim poznaj naszych
                Pracowników i atmosferę panującą w firmie.
              </p>
            </div>

          </div>

        </div>
      </section>

    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      jobs: await getJobs() || [],
    },
    revalidate: 1, // 60,
  };
}

Career.propTypes = {
  // eslint-disable-next-line react/require-default-props
  jobs: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    position: PropTypes.string,
    region: PropTypes.string,
    description: PropTypes.string,
  }).isRequired),
};

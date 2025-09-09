import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
// import styles from '../styles/DataProtection.module.scss';
import styles from '../styles/pages.module.scss';

const TITLE = 'Klauzula Ochrony Danych / Data Protection';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';
const METAROBOTS = 'noindex';
/* eslint-disable max-len, no-console */
export default function Klauzula() {
  return (
    <Layout title={TITLE} metaRobots={METAROBOTS} description={DESCRIPTION}>
      <HeaderTop title={TITLE} imgSrc="/static/header_kopiowanko.webp" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <h2 className="text-2xl uppercase font-bold pt-10 pb-4">KLAUZULA OCHRONY DANYCH / DATA PROTECTION</h2>
        <div className={styles.htmlContent}>
          <p className="text-dks-gray"><strong> Klauzula Ochrony Danych / Data Protection (English version of this declaration begins after Polish version)</strong></p>
          <p className="text-dks-gray"><strong>Obowiązek informacyjny do aktualnych i nowych klientów:</strong></p>
          <p className="text-dks-gray">Zgodnie z art. 13 ust. 1 i ust. 2 Ogólnego rozporządzenia o ochronie danych z dnia 27 kwietnia 2016 r. (Dz.U.UE.L.2016.119.1) (dalej „RODO”) informuję, iż:</p>
          <br />
          <ol className="list-decimal pl-5">
            <li>Administratorem Pani/Pana danych osobowych jest DKS spółka z ograniczoną odpowiedzialnością z siedzibą w Kowalach, adres: ul. Energetyczna 15, 80-180 Kowale, KRS 0000099557, REGON 190917946, NIP: 5832790417 (dalej „Administrator”);</li>
            <li>
              Pani/Pana dane osobowe przetwarzane będą w celu:
              <ol className="list-decimal pl-5">
                <li>realizacji usług świadczonych przez Administratora na podstawie art. 6 ust. 1 pkt b) RODO (w celu wykonania umowy),</li>
                <li>przesyłania wiadomości marketingowych produktów i usług własnych przez Administratora na podstawie art. 6 ust. 1 pkt f) RODO (prawny interes Administratora),</li>
                <li>wysyłania informacji handlowych przez Administratora na podstawie art. 6 ust. 1 pkt a) RODO (zgoda udzielona Administratorowi przez osobę, której dane dotyczą),(jeżeli zgoda została wyrażona przez Panią/Pana).</li>
              </ol>
            </li>
            <li>Administrator za pośrednictwem strony internetowej zbiera i przetwarza poniżej wyszczególnione dane osobowe Użytkowników przekazywane przez formularz kontaktowy: imię i nazwisko, adres e-mail, numer telefonu, nr NIP.</li>
            <li>Odbiorcą Pani/Pana danych osobowych będą podmioty zewnętrzne przetwarzające dane w imieniu Administratora.</li>
            <li>Pani/Pana dane osobowe mogą być przekazywane do innych podmiotów współpracujących z DKS w celu realizacji zapytań/ zamówień biznesowych.</li>
            <li>Pani/Pana dane osobowe będą przechowywane przez okres realizacji usług świadczonych przez Administratora oraz przez okres wynikający z przedawnienia roszczeń, praw konsumenta, prowadzenia księgowości czy innych uprawnień w tym zakresie;</li>
            <li>
              W związku z przetwarzaniem Pani/Pana danych osobowych przez Administratora, przysługują Pani/Panu określone uprawnienia:
              <ol className="list-decimal pl-5">
                <li>ma Pani/Pan prawo do informacji, jakie dane osobowe dotyczące Pani/Pana przetwarzane są przez Administratora oraz do otrzymania kopii tych danych (tzw. prawo dostępu).</li>
                <li>jeżeli przetwarzane dane staną się nieaktualne lub niekompletne (lub w inny sposób niepoprawne) ma Pani/Pan prawo zażądać ich sprostowania;</li>
                <li>w pewnych sytuacjach może Pani/Pan zwrócić się do Administratora o usunięcie swoich danych osobowych, tj. kiedy dane przestaną być potrzebne Administratorowi do celów, o których Panią/Pana informował; kiedy cofnie Pani/Pan zgodę na przetwarzanie danych (o ile Administrator nie ma prawa przetwarzać danych na innej podstawie prawnej); jeżeli do przetwarzania doszłoby niezgodnie z prawem; albo jeśli konieczność usunięcia danych wynika z obowiązku prawnego Administratora;</li>
                <li>w przypadku, gdy Pani/Pana dane osobowe przetwarzane są przez Administratora na podstawie udzielonej zgody na przetwarzanie albo w celu wykonania umowy zawartej z Administratorem, ma Pani/Pan prawo przenieść swoje dane do innego administratora;</li>
                <li>Administrator przetwarza Pani/Pana dane osobowe m.in. w celu prowadzenia działań marketingowych dotyczących jego produktów i usług. Podstawą takiego przetwarzania jest tzw. „prawnie uzasadniony interes administratora”. W przypadku takiego przetwarzania ma Pani/Pan możliwość wyrażenia sprzeciwu. W konsekwencji Administrator przestanie przetwarzać Pani/Pana dane osobowe w opisanym wyżej celu;</li>
                <li>aby przetwarzać dane w niektórych celach związanych ze swoją działalnością Administrator poprosił Pani/Pana o zgodę. Zgoda ta może być w dowolnym momencie cofnięta w wiadomości mailowej wysłanej do Administratora. Będzie to miało ten skutek, że przetwarzanie, które dokonane zostało przed cofnięciem zgody nie przestanie być zgodne z prawem, natomiast po cofnięciu zgody Administrator nie będzie przetwarzał danych w celach, dla których zgoda była wyrażona;</li>
                <li>jeśli uzna Pani/Pan, że przetwarzane dane osobowe są nieprawidłowe, przetwarzanie jest niezgodne z prawem lub Administrator nie potrzebuje już określonych danych albo kiedy wniesie Pani/Pan sprzeciw wobec przetwarzania, może Pani/Pan także zażądać, aby przez określony, potrzebny czas (np. sprawdzenia poprawności danych lub dochodzenia roszczeń) Administrator nie dokonywał na danych żadnych operacji, a jedynie je przechowywał;</li>
              </ol>
            </li>
            <li>Ma Pani/Pan prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych, gdy uzna Pani/Pan, iż przetwarzanie danych osobowych Pani/Pana dotyczących narusza przepisy RODO;</li>
            <li>Zbieramy danych osobowych oraz mierzymy zachowań naszych użytkowników, żeby wysyłać zindywidualizowane oferty. Zbieramy m.in. informacje odnośnie daty utworzenia konta oraz daty ostatniego logowania, śledzenia użytkowników na stronie.</li>
            <li>Podanie przez Panią/Pana danych osobowych jest warunkiem zawarcia umowy z Administratorem. Jest Pani/Pan zobowiązana do ich podania a konsekwencją niepodania danych osobowych będzie brak możliwości świadczenia usług przez Administratora.</li>
            <li>We wszystkich sprawach dotyczących przetwarzania danych osobowych i przysługujących praw z tym związanych można się kontaktować z Administratorem poprzez adres email: rodo@dks.pl, lub pisemnie na adres siedziby Administratora wskazany w punkcie 1 powyżej.</li>
          </ol>
          <p className="text-dks-gray"><strong>Data Protection - English version</strong></p>
          <p className="text-dks-gray"><strong>Information obligation for current and new customers:</strong></p>
          <p className="text-dks-gray">In accordance with Article 13(1,2) of the General Data Protection Regulation of 24 April 2016 (Dz.U.UE.L.2016.119.1), hereinafter referred to as “the GDPR”, I hereby inform that:</p>
          <br />
          <ol className="list-decimal pl-5">
            <li>The Controller of your personal data is DKS spółka z ograniczoną odpowiedzialnością with the registered office in Kowale, Poland, Energetyczna 15, 80-180 Kowale, KRS (National Court Register Number) 0000099557, REGON (Business Registration Number) 190917946, NIP (Tax Identification Number): 5832790417 (hereinafter referred to as “the Controller”);</li>
            <li>
              Your data will be processed for the following purposes:
              <ol className="list-decimal pl-5">
                <li>provision of the services provided by the Controller under Art. 6(1)(b) of the GDPR (in order to perform the agreement);</li>
                <li>sending marketing communication about the Controller’s own products and services by the Controller under Art. 6(1)(f) of the GDPR (the legitimate interest of the Controller);</li>
                <li>sending commercial information by the Controller under Art. 6(1)(a) of the GDPR (consent given to the Controller by the data subject; if you gave your consent).</li>
              </ol>
            </li>
            <li>The Administrator, through the website, collects and processes the following personal data of Users provided by them via the contact form: name and surname, e-mail address, telephone number, tax identification number (NIP).</li>
            <li>The receiver of your personal data will not be third party entities which process data on behalf of the Controller.</li>
            <li>Your personal data may be transferred to other entities cooperating with DKS in order to carry out business inquaires/orders.</li>
            <li>Your personal data will be stored for the period of performance of the services provided by the Controller and for the period resulting from the statute of limitations of claims, consumer rights, bookkeeping or other rights in this respect.</li>
            <li>
              You have certain rights in connection with the Controller’s processing of your personal data:
              <ol className="list-decimal pl-5">
                <li>you have the right to be informed what personal data concerning you are processed by the Controller and to receive a copy of such data (the right of access)</li>
                <li>if the data processed become outdated or incomplete (or otherwise incorrect), you have the right to request a rectification;</li>
                <li>in certain situations, you may request the Controller to delete your personal data, i.e. when the data are no longer necessary for the purposes of the Controller’s communication; when you withdraw your consent to the processing of the data (unless the Controller has the right to process the data on another legitimate basis); if the processing is unlawful; or if the need to delete the data arises from the legal obligation of the Controller;</li>
                <li>in case when your personal data are processed by the Controller on the basis of the given consent for processing or in order to perform the agreement concluded with the Controller, you have the right to transfer your data to another Controller;</li>
                <li>the Controller processes your personal data in order to, among others, conduct marketing activities relating to Controller’s products and services. “A legitimate interest of the Controller” constitutes the basis for such processing. In the case of such processing, you have the right to object. As a consequence, the Controller will stop processing your personal data for the aforementioned purpose;</li>
                <li>in order to process the data for certain purposes related to the Controller’s business, the Controller has requested your consent. You may withdraw your consent at any time via an e-mail sent to the Controller. This will result in the fact that the processing, which was performed before the withdrawal of the consent, will not cease to be lawful, but after the withdrawal of your consent, the Controller will not process the data for the purposes for which the consent was given;</li>
                <li>if you believe that the personal data processed are incorrect, the processing is unlawful or that the Controller no longer needs specific data or that you object to the processing, you may also request the Controller not to carry out any operations on the data, but only to store it, for a specified period of time (e.g. to verify the correctness of the data or to pursue claims).</li>
              </ol>
            </li>
            <li>You have the right to lodge a complaint with the Head of the Office for Personal Data Protection if you believe that the processing of the personal data relating to you violates the provisions of the GDPR.</li>
            <li>We do not collect personal data and we do not measure the behaviour of our users in order to send individual offers. Among other things, we collect information about the account creation date and the last login date.</li>
            <li>Your provision of your personal data constitutes a condition of concluding an agreement with the Controller. You are obliged to provide the aforementioned data and should you fail to do that, the Controller will not be able to provide the services.</li>
            <li>In all matters regarding the processing of personal data and the rights related to it, you can contact the Administrator by email: rodo@dks.pl, or in writing to the address of the Administrator’s office indicated in item 1 above.</li>
          </ol>

          <h2 className="text-2xl uppercase font-bold pt-10 pb-4">Polityka plików cookies</h2>

          <h2>1. Informacje ogólne</h2>
          <p>DKS Spółka z ograniczoną odpowiedzialnością z siedzibą w Kowalach, adres: ul. Energetyczna 15, 80-180 Kowale, zarejestrowana w rejestrze przedsiębiorców Krajowego Rejestru Sądowego, prowadzonego przez Sąd Rejonowy Gdańsk-Północ w Gdańsku, VII Wydział Gospodarczy Krajowego Rejestru Sądowego, pod numerem KRS: 0000099557, posiadająca nr REGON: 190917946 i nr NIP: 5832790417, jako administrator strony www.dks.pl, wykorzystuje pliki cookies (ciasteczka), czyli niewielkie informacje tekstowe, przechowywane na urządzeniu końcowym Użytkownika (np. komputerze, tablecie, smartfonie).</p>
          <p>Cookies mogą być odczytywane przez system teleinformatyczny Administratora.</p>
          <p>Informacje o tym, jak korzystasz z naszej witryny, udostępniamy partnerom społecznościowym, reklamowym i analitycznym. Partnerzy mogą połączyć te informacje z innymi danymi otrzymanymi od Ciebie lub uzyskanymi podczas korzystania z ich usług.</p>

          <h2>2. Zgoda na pliki cookies</h2>
          <p>Administrator jest uprawniony do przechowywania plików cookies na urządzeniu Użytkownika, jeśli jest to niezbędne do funkcjonowania niniejszej strony. Do wszystkich innych rodzajów plików cookies potrzebuje zezwolenia Użytkownika.</p>
          <p>W dowolnej chwili możesz wycofać swoją zgodę w Deklaracji dot. plików cookies na naszej witrynie.</p>

          <h2>3. Rodzaje plików cookies</h2>
          <ul>
              <li><strong>Niezbędne pliki cookies</strong> – umożliwiają podstawowe funkcje takie jak nawigacja na stronie i dostęp do bezpiecznych obszarów strony internetowej. Strona internetowa nie może funkcjonować poprawnie bez tych ciasteczek.</li>
              <li><strong>Pliki cookies dotyczące preferencji</strong> – umożliwiają stronie zapamiętanie informacji, które zmieniają wygląd lub funkcjonowanie strony, np. preferowany język lub region, w którym znajduje się Użytkownik.</li>
              <li><strong>Statystyczne pliki cookies</strong> – pomagają właścicielom stron internetowych zrozumieć, w jaki sposób różni Użytkownicy zachowują się na stronie, gromadząc i zgłaszając anonimowe informacje.</li>
              <li><strong>Marketingowe pliki cookies</strong> – stosowane są w celu śledzenia Użytkowników na stronach internetowych. Celem jest wyświetlanie reklam, które są istotne i interesujące dla poszczególnych Użytkowników i tym samym bardziej cenne dla wydawców i reklamodawców strony trzeciej.</li>
          </ul>

          <h2>4. Cele wykorzystywania plików cookies</h2>
          <p>Administrator przechowuje pliki cookies na urządzeniu końcowym Użytkownika, a następnie uzyskuje dostęp do informacji w nich zawartych w celach:</p>
          <ul>
              <li>tworzenia statystyk, które pomagają zrozumieć, w jaki sposób Użytkownicy korzystają ze strony internetowej, co umożliwia ulepszanie ich struktury i zawartości;</li>
              <li>marketingowych (remarketing);</li>
              <li>określania profilu Użytkownika w celu wyświetlania mu dopasowanych materiałów w sieciach reklamowych, w szczególności sieci Google.</li>
          </ul>

          <h2>5. Konfiguracja przeglądarki</h2>
          <p>Istnieje możliwość takiej konfiguracji przeglądarki internetowej przez Użytkownika, która uniemożliwia przechowywanie plików cookies na urządzeniu końcowym. Jednak w takiej sytuacji korzystanie ze strony internetowej przez Użytkownika może być utrudnione.</p>

          <h2>6. Usuwanie plików cookies</h2>
          <p>Pliki cookies mogą być przez Użytkownika usunięte po ich zapisaniu poprzez odpowiednie funkcje przeglądarki internetowej, programy służące w tym celu lub skorzystanie z odpowiednich narzędzi dostępnych w ramach systemu operacyjnego, z którego korzysta Użytkownik.</p>

          <h2>7. Linki do instrukcji usuwania plików cookies</h2>
          <p>Pod tymi linkami zamieszczone są informacje o sposobach usunięcia plików cookies w najpopularniejszych przeglądarkach internetowych:</p>
          <ul>
              <li><a href="http://support.mozilla.org/pl/kb/usuwanie-ciasteczek">Firefox</a></li>
              <li><a href="http://help.opera.com/Linux/9.60/pl/cookies.html">Opera</a></li>
              <li><a href="http://support.microsoft.com/kb/278835/pl">Internet Explorer</a></li>
              <li><a href="http://support.google.com/chrome/bin/answer.py?hl=pl&answer=95647">Chrome</a></li>
              <li><a href="http://support.apple.com/kb/HT1677?viewlocale=pl_PL">Safari</a></li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

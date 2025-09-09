import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import SideMenu from '../components/navigation/common/sideMenu';
import UnorderedList from '../components/elements/unorderedList';
import styles from '../styles/pages.module.scss';

const TITLE = 'Ochrona sygnalistów';
const DESCRIPTION = '';

export default function ServiceContract() {
  const attachments = [
    { href: `${process.env.assetsPath}c0bb826a-8774-4d2e-8eba-3920580ea415.pdf`, text: 'Formularz zgłoszenia nieprawidłowości w DKS sp. z o.o.' },
  
];

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Ochrona sygnalistów" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col gap-x-6 my-8">
          <div className="md:w-1/4">
            <SideMenu elements={attachments} title="Załączniki do pobrania" />
          </div>
          <div className="md:w-3/4">
            <div className="flex sm:flex-col gap-6">
                <div className={`${styles.htmlContent}`}>
                    <p className="text-center">
                        <strong>
                        <span>Regulamin ochrony osób zgłaszających naruszenia prawa,</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>
                            a także zasad przyjmowania zgłoszeń wewnętrznych oraz podejmowania
                            działań
                        </span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>następczych w tym zakresie</span>
                        </strong>
                    </p>
                    <br /><br />
                    <p className="text-center">
                        <strong>
                        <span>§ 1</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Postanowienia Ogólne</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <span>&nbsp;</span>
                    </p>
                    <p>
                        <span>Niniejszy Regulamin określa zasady:&nbsp;</span>
                    </p>
                    <p>
                        <span>1) Dokonywania zgłoszeń wewnętrznych naruszeń prawa;&nbsp;</span>
                    </p>
                    <p>
                        <span>
                        2) Zapewnienie ochrony osobom dokonującym zgłoszenia, o którym mowa w pkt.
                        1;&nbsp;
                        </span>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>§ 2</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <span>
                        &nbsp;<strong>Definicje</strong>
                        </span>
                    </p>
                    <p>
                        <span>Ilekroć w Regulaminie jest mowa o:</span>
                    </p>
                    <p>
                        <span>
                        1. Pracodawcy – rozumie się przez to DKS spółkę z ograniczoną
                        odpowiedzialnością;
                        </span>
                    </p>
                    <p>
                        <span>
                        2. Regulaminie – rozumie się przez to niniejszy regulamin dotyczący
                        przyjmowania zgłoszeń wewnętrznych oraz podejmowania działań następczych;
                        </span>
                    </p>
                    <p>
                        <span>
                        3. Sygnaliście (lub podmiocie dokonującym zgłoszenia) – rozumie się przez
                        to osobę fizyczną, która dokonuje zgłoszenia o naruszeniu prawa w
                        kontekście związanym z pracą, niezależnie od zajmowanego stanowiska, formy
                        zatrudnienia czy współpracy;
                        </span>
                    </p>
                    <p>
                        <span>
                        4. Pracowniku – należy przez to rozumieć pracownika w rozumieniu art. 2
                        ustawy z dnia 26 czerwca 1974 r. – Kodeks pracy oraz pracownika
                        tymczasowego w rozumieniu art. 2 pkt 2 ustawy z dnia z dnia 9 lipca 2003
                        r. o zatrudnianiu pracowników tymczasowych (Dz. U. z 2019 r. poz.
                        1563);&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        5. Zgłoszeniu – rozumie się przez to informacje o naruszeniu prawa
                        dokonane za pośrednictwem przeznaczonych do tego kanałów komunikacji
                        według wzoru stanowiącego Załącznik numer 1 do niniejszego&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>Regulaminu;</span>
                    </p>
                    <p>
                        <span>
                        6. Informacji o naruszeniu prawa – należy przez to rozumieć informację, w
                        tym uzasadnione podejrzenie, dotyczące zaistniałego lub potencjalnego
                        naruszenia prawa, do którego doszło lub prawdopodobnie dojdzie w
                        organizacji, w której zgłaszający pracuje lub pracował, lub w innej
                        organizacji, z którą zgłaszający utrzymuje lub utrzymywał kontakt w
                        kontekście związanym z pracą, lub dotyczącą próby ukrycia takiego
                        naruszenia prawa;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        7. Naruszeniu – należy przez to rozumieć działanie bezprawne lub
                        nieetyczne zachowanie, naruszające przepisy prawa, akty wewnętrzne
                        Pracodawcy oraz zasady współżycia społecznego, jak również wszelkie
                        zachowania godzące w prawa człowieka lub prawa pracownika oraz interesy i
                        wizerunek Pracodawcy;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        8. Działaniu następczym – należy przez to rozumieć działanie podjęte przez
                        pracodawcę lub organ publiczny w celu oceny prawdziwości zarzutów
                        zawartych w zgłoszeniu oraz, w stosownych przypadkach, w celu
                        przeciwdziałania naruszeniu prawa będącemu przedmiotem zgłoszenia, w tym
                        przez dochodzenie wewnętrzne, postępowanie wyjaśniające, wniesienie
                        oskarżenia, działanie podjęte w celu odzyskania środków finansowych lub
                        zamknięcie procedury przyjmowania i weryfikacji zgłoszeń;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        9. Działaniu odwetowym – należy przez to rozumieć bezpośrednie lub
                        pośrednie działanie lub zaniechanie, które jest spowodowane zgłoszeniem
                        lub ujawnieniem publicznym i które narusza lub może naruszyć prawa
                        zgłaszającego lub wyrządza lub może wyrządzić szkodę zgłaszającemu;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        10. Osobie, której dotyczy zgłoszenie – należy przez to rozumieć osobę
                        fizyczną, osobę prawną lub jednostkę organizacyjną nieposiadającą
                        osobowości prawnej, której ustawa przyznaje zdolność prawną, wskazaną w
                        zgłoszeniu lub ujawnieniu publicznym jako osoba, która dopuściła się
                        naruszenia prawa lub z którą osoba ta jest powiązana;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        11. Osobie powiązanej ze zgłaszającym – należy przez to rozumieć osobę
                        fizyczną, która może doświadczyć działań odwetowych, w tym współpracownika
                        lub członka rodziny zgłaszającego;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        12. Komisji – należy przez to rozumieć podmiot odpowiedzialny za
                        rozpatrywanie Zgłoszeń i prowadzenie postępowań wyjaśniających;&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        13. Koordynator ds. Zgłoszeń wewnętrznych – należy przez to rozumieć osobę
                        powołaną i odpowiedzialną za wdrożenie i stosowanie Regulaminu,
                        podlegającą bezpośrednio Członkowi Zarządu. &nbsp;
                        </span>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>§ 3</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Przedmiot Zgłoszenia</span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Regulamin określa zasady i tryb zgłaszania przez Sygnalistów naruszeń
                        prawa (działań lub zaniechań niezgodnych z obowiązującym prawem lub
                        mających na celu obejście tego prawa) dotyczące zagadnień wskazanych w
                        Dyrektywie w szczególności:
                        </span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>zamówień publicznych;</span>
                        </li>
                        <li>
                        <span>zapobiegania praniu pieniędzy i finansowaniu terroryzmu;</span>
                        </li>
                        <li>
                        <span>bezpieczeństwa produktów i ich zgodności z wymogami;</span>
                        </li>
                        <li>
                        <span>bezpieczeństwa transportu;</span>
                        </li>
                        <li>
                        <span>ochrony środowiska;</span>
                        </li>
                        <li>
                        <span>ochrony konsumentów;</span>
                        </li>
                        <li>
                        <span>ochrony prywatności i danych osobowych;</span>
                        </li>
                        <li>
                        <span>bezpieczeństwa sieci i systemów teleinformatycznych;</span>
                        </li>
                        <li>
                        <span>interesów finansowych Unii Europejskiej;</span>
                        </li>
                        <li>
                        <span>
                            rynku wewnętrznego Unii Europejskiej, w tym zasad konkurencji i pomocy
                            państwa oraz opodatkowania osób prawnych.
                        </span>
                        </li>
                    </ol>
                    <p>
                        <span>
                        2. Postanowienia niniejszej procedury mają zastosowanie wyłącznie do osoby
                        fizycznej, która zgłasza informację o naruszeniu prawa uzyskaną w
                        kontekście związanym z pracą w tym do:
                        </span>
                    </p>
                    <ol className="pl-12" style={{ listStyleType: "lower-alpha" }}>
                        <li>
                        <span>pracownika, lub byłego pracownika DKS,</span>
                        </li>
                        <li>
                        <span>
                            osoby ubiegającej się o zatrudnienie, która uzyskała informację o
                            naruszeniu prawa w procesie rekrutacji lub negocjacji poprzedzających
                            zawarcie umowy,
                        </span>
                        </li>
                        <li>
                        <span>
                            osoby świadczącej pracę na innej podstawie niż stosunek pracy, w tym na
                            podstawie umowy cywilnoprawnej,
                        </span>
                        </li>
                        <li>
                        <span>stażysty,</span>
                        </li>
                        <li>
                        <span>wolontariusza,</span>
                        </li>
                        <li>
                        <span>praktykanta,</span>
                        </li>
                    </ol>
                    <ol className="pl-12" start={7} style={{ listStyleType: "lower-alpha" }}>
                        <li>
                        <span style={{ fontSize: 15 }}>
                            osoby świadczącej pracę pod nadzorem i kierownictwem wykonawcy,
                            podwykonawcy lub dostawcy, w tym na podstawie umowy
                            cywilnoprawnej,&nbsp;
                        </span>
                        </li>
                    </ol>
                    <ol className="pl-12" start={8} style={{ listStyleType: "lower-alpha" }}>
                        <li>
                        <span>
                            innych osób fizycznych mających związek z Pracodawcą w kontekście
                            związanym z pracą.
                        </span>
                        </li>
                    </ol>
                    <p>
                        <span>
                        3. Przyjmowanie Zgłoszeń naruszeń prawa jest podstawowym elementem
                        prawidłowego oraz bezpiecznego zarządzania Spółką, a także służy
                        zwiększeniu efektywności wykrywania nieprawidłowości i podejmowania
                        skutecznych działań dla ich bezzwłocznego eliminowania oraz ograniczania
                        ryzyka na wszystkich poziomach struktury organizacyjnej DKS sp. z o.o.
                        </span>
                    </p>
                    <p>
                        <span>
                        4. Wdrożony niniejszym regulaminem system przyjmowania Zgłoszeń umożliwia
                        przekazywanie informacji o nieprawidłowościach za pośrednictwem łatwo
                        dostępnych kanałów w sposób zapewniający rzetelne i niezależne rozpoznanie
                        Zgłoszenia, a równocześnie zapewniający ochronę przed skierowanymi
                        przeciwko Sygnaliście działaniami o charakterze odwetowym, represyjnym,
                        dyskryminacyjnym lub innym rodzajem niesprawiedliwego traktowania w
                        związku z dokonanym Zgłoszeniem.
                        </span>
                    </p>
                    <p>
                        <span>
                        5. Każdy z Pracowników zobowiązany jest do zapoznania się z treścią
                        niniejszego regulaminu, a nowy pracownik zobowiązany jest zapoznać się z
                        treścią niniejszego regulaminu przed dopuszczeniem do pracy. Wzór
                        oświadczenia stanowi załącznik nr 2 do Regulaminu.
                        </span>
                    </p>

                    <p className="text-center">
                        <strong>
                        <span>§ 4</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>
                            Podmioty (osoby) upoważnione do przyjmowania
                            <br />
                            &nbsp;zgłoszeń wewnętrznych i działań następczych
                        </span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Podmiotem upoważnionym przez pracodawcę do przyjmowania zgłoszeń
                        wewnętrznych jest :<br />
                        &nbsp;1) Anna Szyca - Koordynator ds. Zgłoszeń wewnętrznych
                        <br />
                        &nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        2. Podmiotem uprawnionym do rozpatrywania zgłoszeń oraz do podejmowania
                        działań następczych, włączając w to weryfikację zgłoszenia i dalszą
                        komunikację ze zgłaszającym, w tym występowanie o dodatkowe informacje i
                        przekazywanie zgłaszającemu informacji zwrotnej jest Komisja.
                        </span>
                    </p>
                    <p>
                        <span>
                        3. Komisja składa się z trzech członków wskazanych w Zarządzeniu
                        Wewnętrznym.
                        </span>
                    </p>
                    <p>
                        <span>
                        4. Członkiem Komisji może być wyłącznie Pracownik DKS sp. z o.o.
                        </span>
                    </p>
                    <p>
                        <span>
                        5. Członkiem Komisji nie może być osoba, której dotyczy Zgłoszenie, osoba
                        będąca bezpośrednim przełożonym Sygnalisty, który dokonał Zgłoszenia, ani
                        osoba bezpośrednio mu podlegająca.
                        </span>
                    </p>
                    <p>
                        <span>
                        6.{" "}
                        <span>
                            Członkowie Komisji, co do których z treści Zgłoszenia wynika, że mogą
                            być w jakikolwiek sposób negatywnie zaangażowane w działanie lub
                            zaniechanie stanowiące przedmiot Zgłoszenia nie mogą analizować takiego
                            Zgłoszenia.
                        </span>
                        </span>
                    </p>
                    <p>
                        7. Każdy z członków Komisji, w sytuacji zaistnienia okoliczności mogących
                        rzutować na jego bezstronność i obiektywność w postępowaniu wyjaśniającym do
                        prowadzenia którego został wyznaczony, może wnioskować do&nbsp;
                        <span>
                        Koordynatora ds. Zgłoszeń wewnętrznych o wyłączenie. W przypadku
                        uwzględnienia wniosku, Zarząd wyznaczy w drodze Zarządzenia Wewnętrznego
                        inną osobę w miejsce osoby wyłączonej.&nbsp;
                        </span>
                    </p>
                    <p>
                        <span>
                        8. W związku z realizowanymi zadaniami w ww. zakresie upoważnione osoby są
                        zobowiązane do traktowania wszystkich zgłoszeń z należytą powagą i
                        starannością w sposób poufny, a przy ich rozpatrywaniu koniecznością
                        kierowania się zasadą bezstronności i obiektywizmu.
                        </span>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>§ 5</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Zgłaszanie Naruszeń</span>
                        </strong>
                    </p>
                    <p>
                        <span>1. Jednostką odpowiedzialną za przyjmowanie Zgłoszeń jest&nbsp;</span>
                        <span>Koordynator ds. Zgłoszeń wewnętrznych.</span>
                    </p>
                    <p>
                        <span>
                        2. Zgłoszenia rozpoznawane są wyłącznie przez Komisję opisaną w § 4 ust.
                        2, w trybie określonym niniejszym regulaminem.
                        </span>
                    </p>
                    <p>
                        3. Sygnalista może dokonywać zgłoszeń za pośrednictwem następujących
                        kanałów:
                    </p>
                    <div>
                        <ol className="pl-12" style={{listStyleType: "lower-alpha" }}>
                        <li>
                            <span>adresu&nbsp;</span>
                            <span>e-mail:&nbsp;</span>
                            <a href="mailto:sygnalista@dks.pl">
                            <span>sygnalista@dks.pl</span>
                            </a>
                        </li>
                        </ol>
                    </div>
                    <p>
                        4. Składane Zgłoszenie powinno zawierać przejrzyste i pełne wyjaśnienie
                        przedmiotu Zgłoszenia, oraz powinno zawierać co najmniej następujące
                        informacje:
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>
                            datę oraz miejsce zaistnienia naruszenia prawa lub datę i miejsce
                            pozyskania informacji o naruszeniu prawa,
                        </span>
                        </li>
                        <li>
                        <span>
                            opis konkretnej sytuacji lub okoliczności stwarzających możliwość
                            wystąpienia naruszenia prawa,
                        </span>
                        </li>
                        <li>
                        <span>wskazanie podmiotu, którego dotyczy Zgłoszenie,</span>
                        </li>
                        <li>
                        <span>wskazanie ewentualnych świadków naruszenia prawa,</span>
                        </li>
                        <li>
                        <span>
                            wskazanie wszystkich dowodów i informacji, jakimi dysponuje Sygnalista,
                            które mogą okazać się pomocne w procesie rozpatrywania Zgłoszenia,
                        </span>
                        </li>
                        <li>
                        <span>wskazanie preferowanego sposobu kontaktu zwrotnego.</span>
                        </li>
                    </ol>
                    <p>5. Pracodawca nie będzie rozpoznawał Zgłoszeń anonimowych.</p>
                    <p>
                        6. W przypadku ustalenia w wyniku analizy Zgłoszenia albo w toku
                        postępowania wyjaśniającego, iż w Zgłoszeniu świadomie podano nieprawdę lub
                        zatajono prawdę dokonujący Zgłoszenia może zostać pociągnięty do
                        odpowiedzialności porządkowej określonej w przepisach Kodeksu Pracy.
                    </p>
                    <p>
                        7. Przepisów Dyrektywy Parlamentu Europejskiego i Rady (UE) 2019/1937 z dnia
                        23 października 2019 r. (oraz ewentualnych przepisów prawa polskiego) nie
                        stosuje się, jeżeli naruszenie prawa godzi wyłącznie w prawa zgłaszającego
                        lub zgłoszenie naruszenia prawa następuje wyłącznie w indywidualnym
                        interesie zgłaszającego.
                    </p>
                    <p className="text-center">
                        <strong>§ 6</strong>
                    </p>
                    <p className="text-center">
                        <strong>Rozpatrywanie Zgłoszeń</strong>
                    </p>
                    <p className="text-center">
                        <strong>&nbsp;</strong>
                    </p>
                    <p>
                        1. Dostęp do kanałów zgłaszania posiada osoba odpowiedzialna za przyjmowanie
                        Zgłoszeń.
                    </p>
                    <p>
                        2. Komisja może podjąć decyzję o odstąpieniu od przeprowadzenia postępowania
                        wyjaśniającego w sytuacji, gdy Zgłoszenie jest w oczywisty sposób
                        nieprawdziwe lub niemożliwe jest uzyskanie informacji niezbędnych do
                        prowadzenia postępowania wyjaśniającego.
                    </p>
                    <p>
                        3. Jeżeli Zgłoszenie pozwala na przeprowadzenie postępowania wyjaśniającego
                        następuje jego niezwłoczne wszczęcie.
                    </p>
                    <p>
                        4. Komisja może zaangażować, o ile uzna to za zasadne, przedstawicieli
                        komórek organizacyjnych Pracodawcy lub niezależnych konsultantów do udziału
                        w prowadzonym postępowaniu wyjaśniającym.
                    </p>
                    <p>
                        <span>
                        5. Komisja rozpoznaje Zgłoszenie, podejmuje działania następcze,
                        przekazuje informacje zwrotne bez zbędnej zwłoki, nie później niż w
                        terminie 3 miesięcy od potwierdzenia przyjęcia Zgłoszenia lub w przypadku
                        nieprzekazania potwierdzenia przyjęcia Zgłoszenia, w terminie 3 miesięcy
                        od upływu 7 dni od dokonania Zgłoszenia.
                        </span>
                    </p>
                    <p>
                        <span>
                        6. Po przeprowadzeniu postępowania wyjaśniającego Komisja podejmuje
                        decyzję co do zasadności Zgłoszenia.
                        </span>
                    </p>
                    <p>
                        <span>
                        7. W przypadku Zgłoszenia zasadnego Komisja wydaje następującego rodzaju
                        rekomendacje:
                        </span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>
                            rekomendacje krótkofalowe o stosownych działaniach naprawczych lub
                            dyscyplinujących w stosunku do osoby, która dokonała naruszenia prawa,
                        </span>
                        </li>
                        <li>
                        <span>
                            rekomendacje długofalowe, których celem jest wyeliminowanie i
                            zapobieganie tożsamym lub podobnym naruszeniom co opisane w Zgłoszeniu,
                            w przyszłości. W przypadku negatywnej weryfikacji zgłoszenia, Komisja
                            przekazuje niezwłocznie Sygnaliście oraz osobie, której zgłoszenie
                            dotyczy informacje o dokonanym Zgłoszeniu oraz przeprowadzonej
                            weryfikacji.
                        </span>
                        </li>
                    </ol>
                    <p className="text-center">
                        <strong>
                        <span>§ 7</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Ochrona Sygnalisty</span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Wprowadza się bezwzględny zakaz podejmowania działań odwetowych wobec
                        Sygnalisty, który dokonał Zgłoszenia, a także ujawnienia publicznego
                        zgodnie z treścią Dyrektywy lub przepisów krajowych.
                        </span>
                    </p>
                    <p>
                        <span>
                        2. Podejmowanie jakichkolwiek działań o charakterze represyjnym,
                        dyskryminacyjnym lub innego rodzaju niesprawiedliwe traktowanie wobec
                        Sygnalisty, będą traktowane jako naruszenie niniejszego Regulaminu i mogą
                        skutkować odpowiedzialnością porządkową lub rozwiązaniem umowy łączącej
                        dokonującego działań odwetowych z Pracodawcą.
                        </span>
                    </p>
                    <p>
                        <span>
                        3. Niedopuszczalnym w stosunku do Sygnalisty jest zastosowanie
                        następujących środków, w szczególności:
                        </span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>odmowę nawiązania stosunku pracy,</span>
                        </li>
                        <li>
                        <span>
                            wypowiedzenie lub rozwiązanie bez wypowiedzenia stosunku pracy,
                        </span>
                        </li>
                        <li>
                        <span>
                            nie zawarcie umowy o pracę na czas określony po rozwiązaniu umowy o
                            pracę na okres próbny, nie zawarcie kolejnej umowy o pracę na czas
                            określony lub nie zawarcie umowy o pracę na czas nieokreślony, po
                            rozwiązaniu umowy o pracę na czas określony – w sytuacji gdy pracownik
                            miał uzasadnione oczekiwanie, że zostanie z nim zawarta taka umowa,
                        </span>
                        </li>
                        <li>
                        <span>obniżenie wynagrodzenia za pracę,</span>
                        </li>
                        <li>
                        <span>wstrzymanie awansu albo pominięcie przy awansowaniu,</span>
                        </li>
                        <li>
                        <span>
                            pominięcie przy przyznawaniu innych niż wynagrodzenie świadczeń
                            związanych z pracą,
                        </span>
                        </li>
                        <li>
                        <span>przeniesienie pracownika na niższe stanowisko pracy,</span>
                        </li>
                        <li>
                        <span>
                            zawieszenie w wykonywaniu obowiązków pracowniczych lub służbowych,
                        </span>
                        </li>
                        <li>
                        <span>
                            przekazanie innemu pracownikowi dotychczasowych obowiązków
                            pracowniczych,
                        </span>
                        </li>
                        <li>
                        <span>
                            niekorzystną zmianę miejsca wykonywania pracy lub rozkładu czasu pracy,
                        </span>
                        </li>
                        <li>
                        <span>negatywną ocenę wyników pracy lub negatywną opinię o pracy,</span>
                        </li>
                        <li>
                        <span>
                            nałożenie lub zastosowanie środka dyscyplinarnego, w tym kary finansowej
                            lub środka o podobnym charakterze,
                        </span>
                        </li>
                        <li>
                        <span>
                            wstrzymanie udziału lub pominięcie przy typowaniu do udziału w
                            szkoleniach podnoszących kwalifikacje zawodowe,
                        </span>
                        </li>
                        <li>
                        <span>
                            nieuzasadnione skierowanie na badanie lekarskie, w tym badania
                            psychiatryczne, o ile przepisy odrębne przewidują możliwość skierowania
                            pracownika na takie badanie,
                        </span>
                        </li>
                        <li>
                        <span>
                            działanie zmierzające do utrudnienia znalezienia w przyszłości
                            zatrudnienia w danej branży na podstawie nieformalnego lub formalnego
                            porozumienia branżowego – chyba że pracodawca udowodni, że kierował się
                            obiektywnymi powodami.
                        </span>
                        </li>
                    </ol>
                    <p>
                        <span>
                        4. Za niekorzystne traktowanie z powodu dokonania zgłoszenia, lub
                        ujawnienia publicznego uważa się także groźbę lub próbę zastosowania
                        środka określonego w § 7 ust. 3 niniejszego regulaminu, chyba że
                        Pracodawca udowodni, że kierował się obiektywnymi przesłankami.
                        </span>
                    </p>
                    <p>
                        <span>
                        5. Przepisy § 7 stosuje się także do osoby pomagającej w dokonaniu
                        Zgłoszenia oraz osoby powiązanej ze zgłaszającym, jeżeli również pozostają
                        w stosunku pracy z Pracodawcą zatrudniającym zgłaszającego.
                        </span>
                    </p>
                    <p>
                        <span>
                        6. Jeżeli praca jest lub ma być świadczona na podstawie stosunku prawnego
                        innego niż stosunek pracy, zgłaszający nie może być niekorzystnie
                        traktowany z powodu dokonania Zgłoszenia lub ujawnienia publicznego.
                        </span>
                    </p>
                    <p>
                        <span>
                        7. Za niekorzystne traktowanie, uważa się w szczególności rozwiązanie,
                        wypowiedzenie lub odmowę nawiązania stosunku prawnego, na podstawie
                        którego jest lub ma być świadczona praca przez zgłaszającego, chyba że
                        druga strona stosunku prawnego udowodni, że kierowała się obiektywnymi
                        powodami.
                        </span>
                    </p>

                    <p className="text-center">
                        <strong>
                        <span>§ 8</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Ochrona Tożsamości Sygnalisty</span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Zachowanie poufności ma na celu zagwarantowanie poczucia bezpieczeństwa
                        Sygnaliście oraz minimalizację ryzyka wystąpienia działań odwetowych lub
                        represyjnych. Sygnalista, który dokonał Zgłoszenia, a którego dane osobowe
                        zostały w sposób nieuprawniony ujawnione, powinien niezwłocznie o
                        zaistniałej sytuacji powiadomić Komisję. Jest ona zobowiązana wówczas
                        podjąć bezzwłoczne działania mające na celu ochronę Sygnalisty.
                        </span>
                    </p>
                    <p>
                        <span>
                        2. Tożsamość Sygnalisty, jak również wszystkie informacje umożliwiające
                        jego identyfikację, nie będzie ujawniana podmiotom, których dotyczy
                        Zgłoszenie, osobom trzecim ani innym pracownikom i współpracownikom
                        podmiotu innym niż upoważnieni członkowie personelu właściwi do
                        przyjmowania Zgłoszeń i podejmowania w związku z nimi działań następczych.
                        </span>
                    </p>
                    <p>
                        <span>
                        3. Tożsamość Sygnalisty, jak również inne informacje umożliwiające jego
                        identyfikację mogą zostać ujawnione jedynie wtedy, gdy takie ujawnienie
                        jest koniecznym i proporcjonalnym obowiązkiem wynikającym z powszechnie
                        obowiązujących przepisów prawa w kontekście prowadzonych przez organy
                        krajowe postępowań.
                        </span>
                    </p>
                    <p>
                        <span>
                        4. Organizacja przyjmowania i weryfikacji Zgłoszeń, podejmowania działań
                        następczych oraz związanego z tym przetwarzania danych osobowych
                        uniemożliwia uzyskanie dostępu do informacji objętej Zgłoszeniem
                        nieupoważnionym osobom oraz zapewnia ochronę poufności tożsamości osoby
                        dokonującej Zgłoszenia i osoby, której dotyczy zgłoszenie. Ochrona
                        poufności dotyczy informacji, na podstawie których można bezpośrednio lub
                        pośrednio zidentyfikować tożsamość takich osób.
                        </span>
                    </p>

                    <p className="text-center">
                        <strong>
                        <span>§ 9</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Podstawa Ochrony Sygnalisty</span>
                        </strong>
                    </p>
                    <p>
                        <span>1. Sygnaliście przysługuje ochrona, o ile:</span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>
                            działał w dobrej wierze, czyli w oparciu o fakty i inne obiektywne
                            motywacje (w przeciwieństwie do względów osobistych, np. poczucia
                            niesprawiedliwości, chęci odwetu czy osobistych interesów),
                        </span>
                        </li>
                        <li>
                        <span>
                            posiadał uzasadnione przekonanie, że ujawniana informacja, a także każdy
                            zawarty w niej zarzut, są w zasadniczej mierze prawdziwe,
                        </span>
                        </li>
                        <li>
                        <span>nie dokonuje ujawnienia w celu osiągnięcia własnych korzyści,</span>
                        </li>
                        <li>
                        <span>
                            co do wszystkich okoliczności sprawy dokonane ujawnienie jest
                            uzasadnione.
                        </span>
                        </li>
                    </ol>
                    <p>
                        <span>2. Ochrona Sygnalisty obejmuje w szczególności strefy:</span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>praw i obowiązków wynikające ze stosunku pracy,</span>
                        </li>
                        <li>
                        <span>kształcenia zawodowego,</span>
                        </li>
                        <li>
                        <span>warunków pracy, wymagań dotyczące efektywności zawodowej,</span>
                        </li>
                        <li>
                        <span>wynagrodzenia oraz świadczeń dodatkowych,</span>
                        </li>
                        <li>
                        <span>oceny zawodowej oraz systemu awansowania,</span>
                        </li>
                        <li>
                        <span>odpowiedzialności dyscyplinarnej i odszkodowawczej,</span>
                        </li>
                        <li>
                        <span>zmiana warunków pracy i płacy,</span>
                        </li>
                        <li>
                        <span>rozwiązania stosunku pracy.</span>
                        </li>
                    </ol>
                    <p>
                        <span>
                        3. Ochrona Sygnalisty w rozumieniu niniejszej procedury nie zastępuje
                        ochrony wynikającej z obowiązujących przepisów prawa.
                        </span>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>§ 10</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Rejestr Zgłoszeń</span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Każde Zgłoszenie podlega zarejestrowaniu w Rejestrze Zgłoszeń
                        Wewnętrznych niezależnie od dalszego przebiegu Postępowania
                        Wyjaśniającego. Wzór Rejestru Zgłoszeń Wewnętrznych określa Załącznik
                        numer 3 do niniejszego Regulaminu.
                        </span>
                    </p>
                    <p>
                        <span>2. Za prowadzenie Rejestru Zgłoszeń odpowiada&nbsp;</span>
                        <span>Koordynator ds. Zgłoszeń wewnętrznych</span>
                        <span>&nbsp;</span>
                        <span>w DKS sp. z o.o.</span>
                    </p>
                    <p>
                        <span>
                        3. W rejestrze Zgłoszeń Wewnętrznych gromadzi się następujące dane:
                        </span>
                    </p>
                    <ol className="pl-12" style={{ listStyleType: "lower-alpha",}}>
                        <li>
                        <span>numer sprawy;</span>
                        </li>
                        <li>
                        <span>przedmiot naruszenia;</span>
                        </li>
                        <li>
                        <span>datę dokonania zgłoszenia wewnętrznego;</span>
                        </li>
                        <li>
                        <span>informację o podjętych działaniach następczych;</span>
                        </li>
                        <li>
                        <span>datę zakończenia sprawy.</span>
                        </li>
                    </ol>

                    <p>
                        <span>
                        4. Rejestr Zgłoszeń Wewnętrznych prowadzony jest z zachowaniem zasad
                        poufności, a dokumenty i informacje zebrane w toku analizy oraz informacji
                        dotyczących rozpatrzenia Zgłoszenia przechowywane są przez okres co
                        najmniej 5 lat od dnia zakończenia postępowania wyjaśniającego.
                        </span>
                    </p>

                    <p className="text-center">
                        <strong>
                        <span>§ 11</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Zgłoszenie Zewnętrzne</span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Zgłoszenie może w każdym przypadku nastąpić również do organu
                        publicznego lub organu centralnego z pominięciem procedury przewidzianej w
                        niniejszym Regulaminie, w szczególności, gdy zachodzi jedna z poniższych
                        okoliczności:
                        </span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>
                            w terminie na przekazanie informacji zwrotnej ustalonym w niniejszym
                            Regulaminie Pracodawca nie podejmie działań następczych lub nie przekaże
                            zgłaszającemu informacji zwrotnej,
                        </span>
                        </li>
                        <li>
                        <span>
                            zgłaszający ma uzasadnione podstawy by sądzić, że naruszenie prawa może
                            stanowić bezpośrednie lub oczywiste zagrożenie dla interesu publicznego,
                            w szczególności istnieje ryzyko nieodwracalnej szkody,
                        </span>
                        </li>
                        <li>
                        <span>
                            dokonanie Zgłoszenia wewnętrznego narazi zgłaszającego na działania
                            odwetowe,
                        </span>
                        </li>
                        <li>
                        <span>
                            w przypadku dokonania Zgłoszenia wewnętrznego istnieje niewielkie
                            prawdopodobieństwo skutecznego przeciwdziałania naruszeniu prawa przez
                            Pracodawcę z uwagi na szczególne okoliczności sprawy, takie jak
                            możliwość ukrycia lub zniszczenia dowodów lub możliwość istnienia zmowy
                            między Pracodawcą a sprawcą naruszenia prawa lub udziału Pracodawcy w
                            naruszeniu prawa.
                        </span>
                        </li>
                    </ol>

                    <p>
                        <span>
                        2. Zgłoszenie dokonane do organu publicznego lub organu centralnego z
                        pominięciem zgłoszenia wewnętrznego nie skutkuje pozbawieniem Sygnalisty
                        ochrony gwarantowanej przepisami prawa.
                        </span>
                    </p>

                    <p className="text-center">
                        <strong>
                        <span>§ 12</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Ochrona i Przetwarzanie Danych Osobowych</span>
                        </strong>
                    </p>
                    <p>
                        <span>
                        1. Dane osobowe zgłaszającego oraz inne dane pozwalające na ustalenie jego
                        tożsamości nie podlegają ujawnieniu, chyba że za wyraźną zgodą
                        zgłaszającego.
                        </span>
                    </p>
                    <p>
                        <span>
                        Pracodawca, po otrzymaniu zgłoszenia, może w celu weryfikacji Zgłoszenia
                        oraz podjęcia działań następczych zbierać i przetwarzać dane osobowe
                        osoby, której dotyczy Zgłoszenie, nawet bez jej zgody. Przepisu art. 14
                        ust. 2 lit. f rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679
                        z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z
                        przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich
                        danych oraz uchylenia dyrektywy 95/46/WE (ogólnego rozporządzenia o
                        ochronie danych)
                        </span>
                    </p>
                    <p>
                        <span>
                        (Dz. Urz. UE L 119 z 04.05.2016, str. 1, z późn. zm.) nie stosuje się,
                        chyba że zgłaszający działał z naruszeniem art. 8.
                        </span>
                    </p>

                    <p className="text-center">
                        <strong>
                        <span>§ 13</span>
                        </strong>
                    </p>
                    <p className="text-center">
                        <strong>
                        <span>Postanowienia Końcowe</span>
                        </strong>
                    </p>
                    <p>
                        <span>1. Integralną część Regulaminu stanowią załączniki:</span>
                    </p>
                    <ol className="pl-12">
                        <li>
                        <span>Załącznik nr 1 – Wzór karty zgłoszenia wewnętrznego</span>
                        </li>
                        <li>
                        <span>Załącznik nr 2 – Wzór oświadczenia o zapoznaniu z Regulaminem</span>
                        </li>
                        <li>
                        <span>Załącznik nr 3 – Rejestr zgłoszeń wewnętrznych</span>
                        </li>
                    </ol>
                    <p>
                        <span>
                        2. Kierownicy wszystkich komórek organizacyjnych DKS sp. z o.o. są
                        odpowiedzialni za zapoznanie wszystkich podległych im pracowników z
                        postanowieniami niniejszego Regulaminu.
                        </span>
                    </p>
                    <p>
                        <span>
                        3. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają
                        przepisy kodeksu pracy, Dyrektywy Parlamentu Europejskiego i Rady (UE)
                        2019/1937 z dnia 23 października 2019 r. w sprawie ochrony osób
                        zgłaszających naruszenia prawa Unii (Dz.U.UE.L.2019.305.17) oraz przepisy
                        w zakresie ochrony danych osobowych.
                        </span>
                    </p>
                    <p>
                        <span>
                        4. Niniejszy regulamin podlega publikacji na stronie internetowej i
                        Intranecie Pracodawcy.
                        </span>
                    </p>
                    <p>
                        <span>
                        5. Regulamin wchodzi w życie w terminie 7 dni od podania do wiadomości
                        pracowników poprzez publikację na Platformie Intranet i wysyłkę na
                        wszystkie adresy email pracowników.&nbsp;
                        </span>
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import type { Metadata } from "next";
import HeroSection from "../(marketing)/HeroSection";
import Breadcrumb from "../oferta/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Ochrona sygnalistów – DKS",
  description:
    "Regulamin ochrony osób zgłaszających naruszenia prawa oraz zasady przyjmowania zgłoszeń wewnętrznych w DKS.",
  alternates: { canonical: "/ochrona-sygnalistow" },
};

function Section({
  left,
  children,
}: {
  left: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="self-stretch flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-12">
      <div className="w-full lg:w-80">{left}</div>
      <div className="flex-1 text-black text-base font-normal leading-5">
        {children}
      </div>
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-black text-base font-normal leading-5">{children}</p>;
}

function H({ children }: { children: React.ReactNode }) {
  return <p className="text-black text-base font-semibold leading-5">{children}</p>;
}

function LinkA({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="text-black text-base font-normal underline leading-5 break-words"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function OchronaSygnalistowPage() {
  // jeśli macie realny plik do pobrania – podmień href na właściwy URL (np. /files/...)
  const downloadHref = "backend/assets/c0bb826a-8774-4d2e-8eba-3920580ea415.pdf";

  return (
    <>
        <Breadcrumb />

        <HeroSection
           title="Ochrona sygnalistów"
            backgroundImage="/static/homepage/Header.webp"
            contentPosition="left"
        />
        <div className="w-full px-6 md:px-12 xl:px-28 py-20 bg-white flex flex-col justify-start items-start gap-12 overflow-hidden">
        <Section
            left={
            <div className="w-full lg:w-80 px-3 py-6 bg-gray-300 flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch flex justify-start items-center gap-2.5">
                <div className="flex-1">
                    <span className="text-black text-2xl font-semibold leading-7">
                    Pobierz{" "}
                    </span>
                    <LinkA href={downloadHref}>
                    <span className="text-black text-2xl font-semibold underline leading-7">
                        Formularz zgłoszenia nieprawidłowości w DKS sp. z o.o.
                    </span>
                    </LinkA>
                </div>
                </div>
            </div>
            }
        >
            <div className="flex flex-col gap-4">
            <P>
                Regulamin ochrony osób zgłaszających naruszenia prawa,
                <br />a także zasad przyjmowania zgłoszeń wewnętrznych oraz
                podejmowania działań
                <br />
                następczych w tym zakresie
            </P>

            <H>
                § 1
                <br />
                Postanowienia Ogólne
            </H>

            <P>
                Niniejszy Regulamin określa zasady:
                <br />
                1) Dokonywania zgłoszeń wewnętrznych naruszeń prawa;
                <br />
                2) Zapewnienie ochrony osobom dokonującym zgłoszenia, o którym mowa w
                pkt. 1;
                <br />
                § 2
                <br />
                Definicje
                <br />
                Ilekroć w Regulaminie jest mowa o:
                <br />
                1. Pracodawcy – rozumie się przez to DKS spółkę z ograniczoną
                odpowiedzialnością;
                <br />
                2. Regulaminie – rozumie się przez to niniejszy regulamin dotyczący
                przyjmowania zgłoszeń wewnętrznych oraz podejmowania działań
                następczych;
                <br />
                3. Sygnaliście (lub podmiocie dokonującym zgłoszenia) – rozumie się
                przez to osobę fizyczną, która dokonuje zgłoszenia o naruszeniu
                prawa w kontekście związanym z pracą, niezależnie od zajmowanego
                stanowiska, formy zatrudnienia czy współpracy;
                <br />
                4. Pracowniku – należy przez to rozumieć pracownika w rozumieniu art.
                2 ustawy z dnia 26 czerwca 1974 r. – Kodeks pracy oraz pracownika
                tymczasowego w rozumieniu art. 2 pkt 2 ustawy z dnia z dnia 9 lipca
                2003 r. o zatrudnianiu pracowników tymczasowych (Dz. U. z 2019 r.
                poz. 1563);
                <br />
                5. Zgłoszeniu – rozumie się przez to informacje o naruszeniu prawa
                dokonane za pośrednictwem przeznaczonych do tego kanałów komunikacji
                według wzoru stanowiącego Załącznik numer 1 do niniejszego
                Regulaminu;
                <br />
                6. Informacji o naruszeniu prawa – należy przez to rozumieć
                informację, w tym uzasadnione podejrzenie, dotyczące zaistniałego
                lub potencjalnego naruszenia prawa, do którego doszło lub
                prawdopodobnie dojdzie w organizacji, w której zgłaszający pracuje
                lub pracował, lub w innej organizacji, z którą zgłaszający utrzymuje
                lub utrzymywał kontakt w kontekście związanym z pracą, lub dotyczącą
                próby ukrycia takiego naruszenia prawa;
                <br />
                7. Naruszeniu – należy przez to rozumieć działanie bezprawne lub
                nieetyczne zachowanie, naruszające przepisy prawa, akty wewnętrzne
                Pracodawcy oraz zasady współżycia społecznego, jak również wszelkie
                zachowania godzące w prawa człowieka lub prawa pracownika oraz
                interesy i wizerunek Pracodawcy;
                <br />
                8. Działaniu następczym – należy przez to rozumieć działanie podjęte
                przez pracodawcę lub organ publiczny w celu oceny prawdziwości
                zarzutów zawartych w zgłoszeniu oraz, w stosownych przypadkach, w
                celu przeciwdziałania naruszeniu prawa będącemu przedmiotem
                zgłoszenia, w tym przez dochodzenie wewnętrzne, postępowanie
                wyjaśniające, wniesienie oskarżenia, działanie podjęte w celu
                odzyskania środków finansowych lub zamknięcie procedury przyjmowania
                i weryfikacji zgłoszeń;
                <br />
                9. Działaniu odwetowym – należy przez to rozumieć bezpośrednie lub
                pośrednie działanie lub zaniechanie, które jest spowodowane
                zgłoszeniem lub ujawnieniem publicznym i które narusza lub może
                naruszyć prawa zgłaszającego lub wyrządza lub może wyrządzić szkodę
                zgłaszającemu;
                <br />
                10. Osobie, której dotyczy zgłoszenie – należy przez to rozumieć
                osobę fizyczną, osobę prawną lub jednostkę organizacyjną
                nieposiadającą osobowości prawnej, której ustawa przyznaje zdolność
                prawną, wskazaną w zgłoszeniu lub ujawnieniu publicznym jako osoba,
                która dopuściła się naruszenia prawa lub z którą osoba ta jest
                powiązana;
                <br />
                11. Osobie powiązanej ze zgłaszającym – należy przez to rozumieć
                osobę fizyczną, która może doświadczyć działań odwetowych, w tym
                współpracownika lub członka rodziny zgłaszającego;
                <br />
                12. Komisji – należy przez to rozumieć podmiot odpowiedzialny za
                rozpatrywanie Zgłoszeń i prowadzenie postępowań wyjaśniających;
                <br />
                13. Koordynator ds. Zgłoszeń wewnętrznych – należy przez to rozumieć
                osobę powołaną i odpowiedzialną za wdrożenie i stosowanie Regulaminu,
                podlegającą bezpośrednio Członkowi Zarządu.
            </P>

            <P>
                § 3
                <br />
                Przedmiot Zgłoszenia
                <br />
                1. Regulamin określa zasady i tryb zgłaszania przez Sygnalistów
                naruszeń prawa (działań lub zaniechań niezgodnych z obowiązującym
                prawem lub mających na celu obejście tego prawa) dotyczące zagadnień
                wskazanych w Dyrektywie w szczególności:
            </P>

            <P>
                zamówień publicznych;
                <br />
                zapobiegania praniu pieniędzy i finansowaniu terroryzmu;
                <br />
                bezpieczeństwa produktów i ich zgodności z wymogami;
                <br />
                bezpieczeństwa transportu;
                <br />
                ochrony środowiska;
                <br />
                ochrony konsumentów;
                <br />
                ochrony prywatności i danych osobowych;
                <br />
                bezpieczeństwa sieci i systemów teleinformatycznych;
                <br />
                interesów finansowych Unii Europejskiej;
                <br />
                rynku wewnętrznego Unii Europejskiej, w tym zasad konkurencji i
                pomocy państwa oraz opodatkowania osób prawnych.
            </P>

            <P>
                2. Postanowienia niniejszej procedury mają zastosowanie wyłącznie do
                osoby fizycznej, która zgłasza informację o naruszeniu prawa uzyskaną
                w kontekście związanym z pracą w tym do:
            </P>

            <P>
                pracownika, lub byłego pracownika DKS,
                <br />
                osoby ubiegającej się o zatrudnienie, która uzyskała informację o
                naruszeniu prawa w procesie rekrutacji lub negocjacji poprzedzających
                zawarcie umowy,
                <br />
                osoby świadczącej pracę na innej podstawie niż stosunek pracy, w tym
                na podstawie umowy cywilnoprawnej,
                <br />
                stażysty,
                <br />
                wolontariusza,
                <br />
                praktykanta,
                <br />
                osoby świadczącej pracę pod nadzorem i kierownictwem wykonawcy,
                podwykonawcy lub dostawcy, w tym na podstawie umowy cywilnoprawnej,
                <br />
                innych osób fizycznych mających związek z Pracodawcą w kontekście
                związanym z pracą.
            </P>

            <P>
                3. Przyjmowanie Zgłoszeń naruszeń prawa jest podstawowym elementem
                prawidłowego oraz bezpiecznego zarządzania Spółką, a także służy
                zwiększeniu efektywności wykrywania nieprawidłowości i podejmowania
                skutecznych działań dla ich bezzwłocznego eliminowania oraz
                ograniczania ryzyka na wszystkich poziomach struktury organizacyjnej
                DKS sp. z o.o.
                <br />
                4. Wdrożony niniejszym regulaminem system przyjmowania Zgłoszeń
                umożliwia przekazywanie informacji o nieprawidłowościach za
                pośrednictwem łatwo dostępnych kanałów w sposób zapewniający rzetelne
                i niezależne rozpoznanie Zgłoszenia, a równocześnie zapewniający
                ochronę przed skierowanymi przeciwko Sygnaliście działaniami o
                charakterze odwetowym, represyjnym, dyskryminacyjnym lub innym
                rodzajem niesprawiedliwego traktowania w związku z dokonanym
                Zgłoszeniem.
                <br />
                5. Każdy z Pracowników zobowiązany jest do zapoznania się z treścią
                niniejszego regulaminu, a nowy pracownik zobowiązany jest zapoznać
                się z treścią niniejszego regulaminu przed dopuszczeniem do pracy.
                Wzór oświadczenia stanowi załącznik nr 2 do Regulaminu.
            </P>

            <P>
                § 4
                <br />
                Podmioty (osoby) upoważnione do przyjmowania zgłoszeń wewnętrznych i
                działań następczych
                <br />
                1. Podmiotem upoważnionym przez pracodawcę do przyjmowania zgłoszeń
                wewnętrznych jest:
                <br />
                1) Anna Szyca - Koordynator ds. Zgłoszeń wewnętrznych
                <br />
                2. Podmiotem uprawnionym do rozpatrywania zgłoszeń oraz do
                podejmowania działań następczych, włączając w to weryfikację
                zgłoszenia i dalszą komunikację ze zgłaszającym, w tym występowanie o
                dodatkowe informacje i przekazywanie zgłaszającemu informacji
                zwrotnej jest Komisja.
                <br />
                3. Komisja składa się z trzech członków wskazanych w Zarządzeniu
                Wewnętrznym.
                <br />
                4. Członkiem Komisji może być wyłącznie Pracownik DKS sp. z o.o.
                <br />
                5. Członkiem Komisji nie może być osoba, której dotyczy Zgłoszenie,
                osoba będąca bezpośrednim przełożonym Sygnalisty, który dokonał
                Zgłoszenia, ani osoba bezpośrednio mu podlegająca.
                <br />
                6. Członkowie Komisji, co do których z treści Zgłoszenia wynika, że
                mogą być w jakikolwiek sposób negatywnie zaangażowane w działanie lub
                zaniechanie stanowiące przedmiot Zgłoszenia nie mogą analizować
                takiego Zgłoszenia.
                <br />
                7. Każdy z członków Komisji, w sytuacji zaistnienia okoliczności
                mogących rzutować na jego bezstronność i obiektywność w postępowaniu
                wyjaśniającym do prowadzenia którego został wyznaczony, może
                wnioskować do Koordynatora ds. Zgłoszeń wewnętrznych o wyłączenie. W
                przypadku uwzględnienia wniosku, Zarząd wyznaczy w drodze Zarządzenia
                Wewnętrznego inną osobę w miejsce osoby wyłączonej.
                <br />
                8. W związku z realizowanymi zadaniami w ww. zakresie upoważnione
                osoby są zobowiązane do traktowania wszystkich zgłoszeń z należytą
                powagą i starannością w sposób poufny, a przy ich rozpatrywaniu
                koniecznością kierowania się zasadą bezstronności i obiektywizmu.
            </P>

            <P>
                § 5
                <br />
                Zgłaszanie Naruszeń
                <br />
                1. Jednostką odpowiedzialną za przyjmowanie Zgłoszeń jest Koordynator
                ds. Zgłoszeń wewnętrznych.
                <br />
                2. Zgłoszenia rozpoznawane są wyłącznie przez Komisję opisaną w § 4
                ust. 2, w trybie określonym niniejszym regulaminem.
                <br />
                3. Sygnalista może dokonywać zgłoszeń za pośrednictwem następujących
                kanałów:
                <br />
                adresu e-mail:{" "}
                <a
                className="text-black text-base font-normal underline leading-5"
                href="mailto:sygnalista@dks.pl"
                >
                sygnalista@dks.pl
                </a>
                <br />
                4. Składane Zgłoszenie powinno zawierać przejrzyste i pełne
                wyjaśnienie przedmiotu Zgłoszenia, oraz powinno zawierać co najmniej
                następujące informacje:
            </P>

            <P>
                datę oraz miejsce zaistnienia naruszenia prawa lub datę i miejsce
                pozyskania informacji o naruszeniu prawa,
                <br />
                opis konkretnej sytuacji lub okoliczności stwarzających możliwość
                wystąpienia naruszenia prawa,
                <br />
                wskazanie podmiotu, którego dotyczy Zgłoszenie,
                <br />
                wskazanie ewentualnych świadków naruszenia prawa,
                <br />
                wskazanie wszystkich dowodów i informacji, jakimi dysponuje
                Sygnalista, które mogą okazać się pomocne w procesie rozpatrywania
                Zgłoszenia,
                <br />
                wskazanie preferowanego sposobu kontaktu zwrotnego.
            </P>

            <P>
                5. Pracodawca nie będzie rozpoznawał Zgłoszeń anonimowych.
                <br />
                6. W przypadku ustalenia w wyniku analizy Zgłoszenia albo w toku
                postępowania wyjaśniającego, iż w Zgłoszeniu świadomie podano
                nieprawdę lub zatajono prawdę dokonujący Zgłoszenia może zostać
                pociągnięty do odpowiedzialności porządkowej określonej w przepisach
                Kodeksu Pracy.
                <br />
                7. Przepisów Dyrektywy Parlamentu Europejskiego i Rady (UE)
                2019/1937 z dnia 23 października 2019 r. (oraz ewentualnych przepisów
                prawa polskiego) nie stosuje się, jeżeli naruszenie prawa godzi
                wyłącznie w prawa zgłaszającego lub zgłoszenie naruszenia prawa
                następuje wyłącznie w indywidualnym interesie zgłaszającego.
            </P>

            {/* Dalsza część regulaminu jest bardzo długa – zostawiłem w tej samej formie,
                dokładnie jak z Figmy: jako ciąg paragrafów z <br/>. Jeśli chcesz, mogę
                przepisać resztę 1:1 (od §6 do §13) do tego samego bloku, tylko wklej
                proszę kontynuację, bo tu w wiadomości jest już na granicy długości. */}
            <P>
                § 6<br />
                Rozpatrywanie Zgłoszeń
                <br />
                1. Dostęp do kanałów zgłaszania posiada osoba odpowiedzialna za
                przyjmowanie Zgłoszeń.
                <br />
                2. Komisja może podjąć decyzję o odstąpieniu od przeprowadzenia
                postępowania wyjaśniającego w sytuacji, gdy Zgłoszenie jest w
                oczywisty sposób nieprawdziwe lub niemożliwe jest uzyskanie informacji
                niezbędnych do prowadzenia postępowania wyjaśniającego.
                <br />
                3. Jeżeli Zgłoszenie pozwala na przeprowadzenie postępowania
                wyjaśniającego następuje jego niezwłoczne wszczęcie.
                <br />
                4. Komisja może zaangażować, o ile uzna to za zasadne, przedstawicieli
                komórek organizacyjnych Pracodawcy lub niezależnych konsultantów do
                udziału w prowadzonym postępowaniu wyjaśniającym.
                <br />
                5. Komisja rozpoznaje Zgłoszenie, podejmuje działania następcze,
                przekazuje informacje zwrotne bez zbędnej zwłoki, nie później niż w
                terminie 3 miesięcy od potwierdzenia przyjęcia Zgłoszenia lub w
                przypadku nieprzekazania potwierdzenia przyjęcia Zgłoszenia, w
                terminie 3 miesięcy od upływu 7 dni od dokonania Zgłoszenia.
                <br />
                6. Po przeprowadzeniu postępowania wyjaśniającego Komisja podejmuje
                decyzję co do zasadności Zgłoszenia.
                <br />
                7. W przypadku Zgłoszenia zasadnego Komisja wydaje następującego
                rodzaju rekomendacje: rekomendacje krótkofalowe oraz długofalowe.
            </P>

            <P>
                § 7<br />
                Ochrona Sygnalisty
                <br />
                1. Wprowadza się bezwzględny zakaz podejmowania działań odwetowych
                wobec Sygnalisty, który dokonał Zgłoszenia, a także ujawnienia
                publicznego zgodnie z treścią Dyrektywy lub przepisów krajowych.
            </P>

            <P>
                § 8<br />
                Ochrona Tożsamości Sygnalisty
                <br />
                (…)
            </P>

            <P>
                § 9<br />
                Podstawa Ochrony Sygnalisty
                <br />
                (…)
            </P>

            <P>
                § 10<br />
                Rejestr Zgłoszeń
                <br />
                (…)
            </P>

            <P>
                § 11<br />
                Zgłoszenie Zewnętrzne
                <br />
                (…)
            </P>

            <P>
                § 12<br />
                Ochrona i Przetwarzanie Danych Osobowych
                <br />
                (…)
            </P>

            <P>
                § 13<br />
                Postanowienia Końcowe
                <br />
                (…)
            </P>
            </div>
        </Section>
        </div>
    </>

  );
}
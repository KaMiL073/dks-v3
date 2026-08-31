import type { Metadata } from "next";
import Link from "next/link";

import HeroSection from "@/app/(marketing)/HeroSection";
import Breadcrumb from "@/app/oferta/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Regulamin konkursu Lenovo – DKS Warsaw Innovation Days",
  description:
    "Regulamin konkursu „Wypełnij ankietę po evencie i wygraj nagrody Lenovo” organizowanego podczas DKS Warsaw Innovation Days.",
  alternates: {
    canonical: "/wydarzenia/warsaw-innovation-days/regulamin",
  },
};

type RegulationSection = {
  title: string;
  paragraphs: string[];
  points?: string[];
  trailingParagraphs?: string[];
};

const sections: RegulationSection[] = [
  {
    title: "1. Postanowienia ogólne",
    paragraphs: [
      "1.1. Organizatorem Konkursu jest DKS Sp. z o.o. z siedzibą w Kowalach przy ulicy Energetycznej 15, 80-180 Kowale, wpisana do Rejestru Przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy Gdańsk-Północ w Gdańsku, pod numerem KRS: 0000099557, NIP: 5832790417, REGON: 190917946, zwana dalej „Organizatorem”.",
      "1.2. Niniejszy Regulamin określa zasady i sposób prowadzenia Konkursu oraz reguluje zasady i warunki uczestnictwa w Konkursie, prawa i obowiązki Organizatora oraz Uczestników.",
      "1.3. Konkurs jest organizowany na terytorium Rzeczypospolitej Polskiej w związku z wydarzeniem „DKS Warsaw Innovation Days” odbywającym się w dniach od 20 do 21 października 2026 r. w Hotelu Lord przy Al. Krakowskiej 218 w Warszawie (zwanym dalej „Wydarzeniem”).",
      "1.4. Organizator oświadcza, że Konkurs nie jest grą losową, loterią fantową, zakładem wzajemnym, loterią promocyjną, grą której wynik zależy od przypadku, ani żadną inną formą przewidzianą w ustawie z dnia 19 listopada 2009 r. o grach hazardowych (t.j. Dz. U. z 2025 r. poz. 595, z 2026 r. poz. 176, 1040.).",
      "1.5. Organizator jest przyrzekającym nagrodę w rozumieniu art. 921 Kodeksu cywilnego.",
      "1.6. Uczestnikami Konkursu mogą być wyłącznie osoby fizyczne, pełnoletnie, posiadające pełną zdolność do czynności prawnych, będące konsumentami w rozumieniu art. 22[1] Kodeksu Cywilnego, które zarejestrowały się i wzięły udział w Wydarzeniu (zwanymi dalej: „Uczestnikami” lub osobno „Uczestnikiem”).",
    ],
  },
  {
    title: "2. Warunki uczestnictwa i przebieg konkursu",
    paragraphs: [
      "2.1 Konkurs rozpoczyna się w momencie udostępnienia Uczestnikom przez Organizatora ankiety podsumowującej Wydarzenie i trwa do momentu zamknięcia przyjmowania zgłoszeń tj. do dnia 24.10.2026 r. do godz. 23.59.",
      "2.2. Uczestnictwo w Konkursie jest dobrowolne i nieodpłatne.",
      "2.3. W celu wzięcia udziału w Konkursie, Uczestnik musi spełnić łącznie następujące warunki:",
    ],
    points: [
      "a) Zarejestrować się na Wydarzenie „DKS Warsaw Innovation Days” na stronie internetowej: https://dks.pl/wydarzenia/warsaw-innovation-days#rejestracja, poprzez podanie: imienia, nazwiska, nazwy firmy, adresu e-mail, numeru telefonu oraz miasta/miejscowości swojego zamieszkania,",
      "b) Uczestniczyć w Wydarzeniu;",
      "c) Wypełnić w całości elektroniczną ankietę podsumowującą Wydarzenie, przekazaną przez Organizatora;",
      "d) Odpowiedzieć na zawarte w ankiecie otwarte pytanie konkursowe.",
    ],
    trailingParagraphs: [
      "2.4. Każdy Uczestnik może przesłać tylko jedno zgłoszenie konkursowe (jedno wypełnienie ankiety).",
      "2.5. W Konkursie nie mogą uczestniczyć pracownicy Organizatora, członkowie jego organów zarządzających, podmioty i ich pracownicy współpracujący z nim przy organizowaniu Konkursu, jak również członkowie najbliższych rodzin wymienionych osób, to jest małżonkowie, krewni i powinowaci w linii prostej (np. rodzice, dzieci, dziadkowie, wnuki), ich przysposobieni lub przysposabiający, a także rodzeństwo. Dla celów niniejszego Regulaminu przez pracownika rozumie się każdą osobę świadczącą na rzecz Organizatora pracę w ramach stosunku pracy, jak również każdą osobę pozostającą z Organizatorem w stosunku cywilnoprawnym.",
      "2.6. Wypełnienie ankiety, o której mowa w pkt. 2.3 lit. c jest równoznaczne z zaakceptowaniem przez Uczestnika postanowień niniejszego Regulaminu.",
      "2.7. W przypadku, gdy Uczestnik podjął jakiekolwiek działania mające wpływ na fałszowanie danych, narusza postanowienia niniejszego Regulaminu, prezentuje treści niezgodne z obowiązującymi przepisami prawa lub w inny sposób narusza przepisy prawa w związku z Konkursem, Organizator może, po uprzednim powiadomieniu, wykluczyć Uczestnika z udziału w Konkursie.",
    ],
  },
  {
    title: "3. Zasady wyłaniania laureatów",
    paragraphs: [
      "3.1. Nad prawidłowym przebiegiem Konkursu czuwać będzie powołana przez Organizatora 3-osobowa Komisja Konkursowa (Jury) w skład, której wchodzą przedstawiciele Organizatora. Komisja Konkursowa dokonuje również wyboru nagrodzonych Uczestników (dalej zwanych „Laureatami”).",
      "3.2. Komisja Konkursowa oceniać będzie nadesłane odpowiedzi na pytanie otwarte zawarte w przesłanej przez Organizatora ankiecie pod kątem ich kreatywności, oryginalności, wartości merytorycznej oraz powiązania z tematyką Wydarzenia.",
      "3.3. Komisja wyłoni 1 (jednego) Laureata Nagrody Głównej oraz 5 (pięciu) Laureatów Nagród Dodatkowych w terminie 5 dni roboczych od zakończenia przyjmowania zgłoszeń konkursowych. Laureaci zostaną powiadomieni o wygranej drogą mailową w ciągu 5 dni roboczych od dnia rozstrzygnięcia Konkursu.",
      "3.4. Nagrody zostaną przekazane Laureatom w siedzibie Organizatora lub przesłane na wskazany przez nich adres wysyłki.",
      "3.5. Organizator nie ponosi odpowiedzialności za nieprawidłowości wynikające z błędnego podania przez Laureata adresu e-mail lub innych danych kontaktowych koniecznych do przekazania nagrody.",
      "3.6. W przypadku ustalenia przez Organizatora, że dany Laureat posłużył się danymi kontaktowymi innego Uczestnika, któremu przyznana została wcześniej nagroda, Laureat taki traci prawo do nagrody.",
    ],
  },
  {
    title: "4. Nagrody i podatek",
    paragraphs: [
      "4.1. W Konkursie przewidziano następujące nagrody:",
    ],
    points: [
      "a) Nagroda Główna: Monitor przenośny Lenovo o wartości 1.000,00 zł brutto oraz dodatkowa nagroda pieniężna w wysokości 111,11 zł, przeznaczona na pokrycie należnego zryczałtowanego podatku dochodowego (łączna wartość Nagrody Głównej wynosi 1.111,11 zł).",
      "b) 5 Nagród Dodatkowych: Myszka bezprzewodowa Lenovo o wartości poniżej 200,00 zł brutto każda.",
    ],
    trailingParagraphs: [
      "4.2. Zgodnie z art. 30 ust. 1 pkt 2 ustawy z dnia 26 lipca 1991 r. o podatku dochodowym od osób fizycznych (PIT) (t.j. Dz. U. z 2026 r. poz. 592, 779, 846) od wygranych w konkursach pobiera się zryczałtowany podatek dochodowy w wysokości 10% wartości nagrody z zastrzeżeniem art. 21 ust. 1 pkt. 68a ustawy.",
      "4.3. Dodatkowa nagroda pieniężna, o której mowa w ust. 1 lit. a, nie podlega wypłacie na rzecz Laureata Nagrody Głównej, lecz zostanie potrącona przez Organizatora (jako płatnika) i odprowadzona na rachunek właściwego Urzędu Skarbowego na pokrycie podatku dochodowego od wygranej.",
      "4.4. Organizator nie ponosi odpowiedzialności za niemożność odbioru nagrody z przyczyn leżących po stronie Laureata.",
    ],
  },
  {
    title: "5. Postępowanie reklamacyjne",
    paragraphs: [
      "5.1. Reklamacje mogą być zgłaszane w trakcie trwania Konkursu oraz w terminie 14 dni od dnia zakończenia Konkursu.",
      "5.2. Reklamacje dotyczące Konkursu można składać drogą elektroniczną na adres e-mail Organizatora: kontakt@dks.pl z dopiskiem „Konkurs wypełnij ankietę po evencie i wygraj nagrody Lenovo”.",
      "5.3. Reklamacje wpływające po terminie określonym w ust. 1 powyżej nie będą rozpatrywane.",
      "5.4. Reklamacja powinna określać: imię i nazwisko oraz adres e-mail Uczestnika, a także opis i powód reklamacji.",
    ],
  },
  {
    title: "6. Przetwarzanie danych osobowych",
    paragraphs: [
      "6.1. Administratorem danych osobowych Uczestników jest DKS Sp. z o.o. z siedzibą w Kowalach przy ulicy Energetycznej 15, 80-180 Kowale, wpisana do Rejestru Przedsiębiorców Krajowego Rejestru Sądowego prowadzonego przez Sąd Rejonowy Gdańsk-Północ w Gdańsku, pod numerem KRS: 0000099557, NIP: 5832790417, REGON: 190917946, zwana dalej: „Administratorem”.",
      "6.2. Dane osobowe Uczestników będą przetwarzane w następującym zakresie: imienia, nazwiska, adresu e-mail, numeru telefonu oraz miasta/miejscowości zamieszkania.",
      "6.3. Dane osobowe Uczestników są przetwarzane zgodnie z prawem, w tym zgodnie z ogólnym rozporządzeniem o ochronie danych (Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE), zwanym dalej: „RODO”, ustawą z dnia 18 lipca 2002 r. o świadczeniu usług drogą elektroniczną oraz ustawą z dnia 10 maja 2018 r. o ochronie danych osobowych wyłącznie w celu prawidłowej realizacji Konkursu, ustalenia laureatów Konkursu, realizacji praw do Nagród, w związku ze sprawozdawczością podatkową i księgową.",
      "6.4. Podanie danych osobowych przez Uczestników Konkursu jest dobrowolne, ale niezbędne do wzięcia udziału w Konkursie, wyłonienia i ogłoszenia listy Laureatów i przekazania nagród. Zgoda ta może być w dowolnym momencie cofnięta w wiadomości mailowej wysłanej do Administratora. Będzie to miało ten skutek, że przetwarzanie, które dokonane zostało przed cofnięciem zgody nie przestanie być zgodne z prawem, natomiast po cofnięciu zgody Administrator nie będzie przetwarzał danych w celach, dla których zgoda była wyrażona.",
      "6.5. Dane osobowe będą przetwarzane przez okres:",
    ],
    points: [
      "a) trwania Konkursu i wyłonienia jego Laureatów – do momentu jego rozstrzygnięcia, wręczenia nagród lub rozstrzygnięcia zgłoszenia reklamacyjnego,",
      "b) ustalenia, dochodzenia lub obrony przed roszczeniami – do momentu przedawnienia roszczeń z tytułu Konkursu lub roszczeń związanych z przetwarzaniem danych osobowych;",
      "c) do czasu zwolnienia z obowiązku ich przechowywania na podstawie przepisów podatkowych.",
    ],
    trailingParagraphs: [
      "6.6. Dane osobowe nie będą podlegały zautomatyzowanemu przetwarzaniu w tym profilowaniu, o którym mowa w art. 22 RODO.",
      "6.7 Osoby, których dane są przetwarzane przez Administratora danych w związku z realizacją Konkursu mają prawo dostępu do treści swoich danych osobowych, a także prawo ich sprostowania, prawo żądania ich usunięcia lub ograniczenia ich przetwarzania oraz prawo do wniesienia sprzeciwu wobec dalszego przetwarzania danych osobowych, o ile będą miały zastosowanie. W celu realizacji wymienionych wyżej praw podmiotowych należy wysłać korespondencję elektroniczną na adres poczty elektronicznej Administratora: rodo@dks.pl.",
      "6.8. Osoby, których dane są przetwarzane przez Administratora danych mogą również wnieść skargę w związku z przetwarzaniem ich danych osobowych przez Administratora danych do Prezesa Urzędu Ochrony Danych Osobowych jeśli uznają, że przetwarzanie ich danych osobowych jest niezgodne z przepisami prawa.",
    ],
  },
  {
    title: "7. Postanowienia końcowe",
    paragraphs: [
      "7.1. Przed przystąpieniem do Konkursu Uczestnik zobowiązany jest zapoznać się z treścią Regulaminu Konkursu.",
      "7.2. Organizator zastrzega sobie prawo zmiany Regulaminu, jeżeli nie wpłynie to na pogorszenie warunków uczestnictwa w Konkursie. W szczególności Organizator zastrzega sobie prawo zmiany czasu trwania Konkursu. Zmiany wchodzą w życie w dniu ich ogłoszenia",
      "7.3. W sprawach nieuregulowanych w Regulaminie zastosowanie mają powszechnie obowiązujące przepisy prawa polskiego, w tym w szczególności Kodeksu Cywilnego.",
    ],
  },
];

export default function WarsawInnovationDaysRegulationPage() {
  return (
    <main>
      <Breadcrumb />

      <HeroSection
        title="Regulamin konkursu „Wypełnij ankietę po evencie i wygraj nagrody Lenovo”"
        subtitle="DKS Warsaw Innovation Days"
        backgroundImage="/static/homepage/Header.webp"
        contentPosition="left"
      />

      <article className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-20 xl:px-28">
        <div className="mx-auto max-w-5xl space-y-12">
          <Link
            href="/wydarzenia/warsaw-innovation-days"
            className="inline-flex text-sm font-semibold text-red-600 underline underline-offset-4"
          >
            Wróć do strony wydarzenia
          </Link>

          {sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-2xl font-semibold leading-tight text-neutral-950">
                {section.title}
              </h2>

              <div className="space-y-4 text-base leading-7 text-neutral-800">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {section.points && (
                  <div className="space-y-3 pl-4 md:pl-8">
                    {section.points.map((point) => (
                      <p key={point}>{point}</p>
                    ))}
                  </div>
                )}

                {section.trailingParagraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}

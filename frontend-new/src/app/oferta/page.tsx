import SectionHeader from "@/components/SectionHeader";
import TopSectionHeader from "@/components/TopSectionHeader";

export const metadata = {
  title: "Drukarki biurowe, wielkoformatowe i cyfrowe maszyny poligraficzne",
  description:
    "Dostarczamy urządzenia drukujące do biur, cyfrowe maszyny poligraficzne i drukarki wielkoformatowe. Sprzedajemy i wynajmujemy urządzenia nowe i poleasingowe.",
  keywords:
    "drukarki biurowe, drukarki laserowe, kserokopiarki, urządzenia wielofunkcyjne, MFP, plotery, maszyny poligraficzne, drukarki wielkoformatowe, druk cyfrowy, urządzenia do biura, Canon, HP, Konica Minolta, Kyocera, Lexmark",
  openGraph: {
    title: "Drukarki biurowe, wielkoformatowe i cyfrowe maszyny poligraficzne",
    description:
      "Dostarczamy urządzenia drukujące do biur, cyfrowe maszyny poligraficzne i drukarki wielkoformatowe. Sprzedajemy i wynajmujemy urządzenia nowe i poleasingowe.",
    url: "https://twojadomena.pl/oferta",
    siteName: "Twoja Firma",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "https://twojadomena.pl/images/drukarki-biuro-og.jpg",
        width: 1200,
        height: 630,
        alt: "Drukarki biurowe i maszyny poligraficzne",
      },
    ],
  },
  alternates: {
    canonical: "https://twojadomena.pl/oferta",
  },
};

export default function OfferPage() {
  return (
    <>
      <TopSectionHeader 
        title="Kserokopiarki wielofunkcyjne, maszyny poligraficzne i wielkoformatowe" 
        img="/static/homepage/Header.webp" 
      />
        <main className="w-full px-28 py-20 bg-white inline-flex flex-col justify-start items-start gap-12 overflow-hidden">
      {/* 1 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 h-4" />
        <div className="flex-1 justify-start">
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            Dostarczamy{" "}
          </span>
          <span className="text-black text-base font-semibold font-['Montserrat'] leading-tight">
            cyfrowe kserokopiarki wielofunkcyjne, maszyny poligraficzne
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            {" "}
            i wielkoformatowe. W naszej ofercie znajdują się drukarki, MFP (Multi
            Function Printer), plotery, skanery. Współpracujemy z czołowymi
            producentami: Canon, Konica Minolta, HP, Lexmark, Contex, Oce, KIP.
            Oferujemy sprzedaż, wynajem oraz serwis urządzeń drukujących.
            Posiadamy własne magazyny urządzeń drukujących i materiałów
            eksploatacyjnych. Dzięki temu możemy znacząco skrócić czas
            oczekiwania na zamówiony produkt.
            <br />
            Oprócz sprzętu proponujemy inteligentne rozwiązania biurowe do
            zarządzania flotą drukarek. Stosując dostarczone przez nas{" "}
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] underline leading-tight">
            oprogramowanie do obiegu dokumentów
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            {" "}
            zyskasz pełną kontrolę nad środowiskiem druku w firmie. Ponadto
            zredukujesz koszty i podniesiesz jakość techniczną druku.
          </span>
        </div>
      </div>

      {/* 2 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Drukarki laserowe czarno-białe i kolorowe
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            W zastosowaniach biurowych dominują{" "}
          </span>
          <span className="text-black text-base font-semibold font-['Montserrat'] leading-tight">
            kolorowe drukarki laserowe
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            . Są najbardziej uniwersalne, wyróżniają się wysoką jakością druku i
            szybkością pracy. Dostarczamy{" "}
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] underline leading-tight">
            drukarki Lexmark
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            , Konica Minolta, HP, Canon. Zastosowanie koloru jest niezbędne
            wszędzie tam, gdzie powstają materiały prezentacyjne, reklamowe i
            inne druki, których wartość zależy od efektownego wyglądu.
            <br />
            Druk w kolorze jest bezdyskusyjnie atrakcyjny, lecz droższy od
            monochromatycznego. Dlatego w przypadku tworzenia dokumentów,
            formularzy, instrukcji obsługi czy zestawień tabelarycznych
            optymalne są{" "}
          </span>
          <span className="text-black text-base font-semibold font-['Montserrat'] leading-tight">
            czarno-białe drukarki laserowe
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            . Dzięki nim możliwa jest znaczna redukcja kosztów, bez utraty
            funkcjonalności tworzonych dokumentów.
            <br />
            Standardem w warunkach biurowych są urządzenia drukujące w formacie
            A4. Jednak firmy, które zajmują się projektowaniem, grafiką,
            przygotowują większą liczbę ogłoszeń, cenników i ulotek preferują{" "}
          </span>
          <span className="text-black text-base font-semibold font-['Montserrat'] leading-tight">
            drukarki A3
          </span>
          <span className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            . Większy format pozwala stworzyć atrakcyjniejsze wizualnie wydruki,
            np. zastosować większą czcionkę i detale graficzne, aby poprawić
            widoczność komunikatów marketingowych czy ogłoszeń.
          </span>
        </div>
      </div>

      {/* 3 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Kserokopiarki i drukarki wielofunkcyjne A3
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            <span className="font-semibold">Kserokopiarki wielofunkcyjne</span>{" "}
            są obecnie standardowym wyposażeniem biur – niezależnie od ich
            wielkości czy branży. To maszyny, które pozwalają drukować,
            kopiować, skanować i faksować. Doskonale nadają się do wytwarzania i
            digitalizacji dokumentów. Są wyposażone w dyski twarde, które
            doskonale nadają się do zapisywania i przechowywania często
            wykorzystywanych plików. Ponadto MFP oferują różne możliwości
            wykańczania dokumentów poprzez dziurkowanie, zszywanie czy układanie
            wydruków. Większość producentów wyposaża swoje urządzenia w
            aplikacje OCR, które są niezbędne w procesie digitalizacji
            dokumentów papierowych. Dzięki nim możesz przekształcać skany do
            postaci edytowalnej, pozwalającej na łatwe wyszukiwanie i
            wprowadzanie danych.
            <br />
            Cyfrowe{" "}
            <span className="font-semibold">kserokopiarki laserowe</span>{" "}
            zastąpiły klasyczne, analogowe maszyny kopiujące. Ich możliwości
            kończyły się na powielaniu dokumentów papierowych: kopie były niskiej
            jakości i brudziły palce. Z aktualnie stosowanymi maszynami łączy je
            już tylko nazewnictwo, np. miano{" "}
            <span className="font-semibold">kopiarki kserograficzne</span> jest
            niekiedy używane w odniesieniu do urządzeń wielofunkcyjnych.
            <br />
            <span className="font-semibold">Kserokopiarki cyfrowe</span> należą
            do kategorii maszyn określanych jako MFP (Multi Function Printer).
            Nazewnictwo to jest stosowane również wobec drukarek
            wielofunkcyjnych, które pod względem oferowanych możliwości tworzenia
            i obsługi dokumentów często nie różnią się niczym od kserokopiarek.
            Kopiarki i <span className="font-semibold">drukarki wielofunkcyjne A3</span> i
            A4 to w istocie urządzenia MFP o różnym zakresie realizowanych
            zadań. Biurowe maszyny wielofunkcyjne są odpowiedzią na potrzebę
            integracji środowiska druku.{" "}
            <span className="font-semibold">Profesjonalne kserokopiarki</span>{" "}
            klasy biznesowej coraz częściej zastępują autonomiczne, faksy,
            skanery i{" "}
            <span className="underline">drukarki do firmy</span>. Przejmują
            zadania wielu rozproszonych urządzeń, co przekłada się na znaczne
            obniżenie kosztów materiałów eksploatacyjnych i obsługi serwisowej.
          </p>
        </div>
      </div>

      {/* 4 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Kserokopiarki Kyocera
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            Jeżeli szukasz wydajnej i atrakcyjnej cenowo maszyny MFP, sięgnij po
            japońskie <span className="font-semibold">kserokopiarki Kyocera</span>. To
            urządzenia, które świetnie sprawdzą się w różnej wielkości biurach
            przy realizacji podstawowych zadań związanych z przetwarzaniem
            dokumentów. Pracują w formacie A4 i A3, drukują z prędkością od 20
            do 90 str./min na papierach o gramaturze z przedziału 60–300 g/m².
            <br />
            Wielkim <span className="font-semibold">atutem urządzeń wielofunkcyjnych Kyocera jest ekonomiczna praca</span>.
            Zarówno najprostsze MFP dla małych firm, jak i wysokowydajne
            kserokopiarki korporacyjne wyposażone są w mechanizmy umożliwiające
            maksymalne obniżenie zużycia tonerów. Najbardziej zaawansowane modele
            posiadają szybkie skanery jednoprzebiegowe, które są w stanie zapisać
            do 220 obrazów na minutę. Wydajność urządzeń podnoszą zasobniki
            papieru – wyjściowe są w stanie pomieścić nawet ponad 7 tys. arkuszy,
            a wyjściowe maksymalnie około 4 tys. arkuszy.
          </p>
        </div>
      </div>

      {/* 5 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Cyfrowe maszyny drukarskie
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            <span className="font-semibold">Cyfrowe maszyny drukarskie</span> są
            rozwinięciem możliwości urządzeń wielofunkcyjnych. Od biurowych MFP
            różnią się wydajnością – szybkością skanowania i druku. Posiadają
            też znacznie bardziej rozbudowane systemy zarządzania kolorem,
            wyższą rozdzielczość druku i skanowania, specjalistyczne
            oprogramowanie do impozycji oraz znacznie rozszerzone możliwości
            wykańczania wydruków on-line. W naszej ofercie znajduje się też{" "}
            <span className="underline">sprzęt poligraficzny</span> do obróbki
            off-line po druku, m.in. gilotyny, foliarki czy laminatory. Maszyny
            poligraficzne pozwalają na druk na różnych odmianach i gramaturach
            papieru, na folii i podłożach sztywnych. W naszej ofercie znajdziesz
            wysokowydajne czarno-białe prasy drukarskie oraz{" "}
            <span className="font-semibold">maszyny produkcyjne kolorowe</span>{" "}
            takich marek, jak Konica Minolta i Canon.
          </p>
        </div>
      </div>

      {/* 6 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Urządzenia do druku wielkoformatowego i systemy skanujące
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            <span className="font-semibold">Urządzenia do druku wielkoformatowego</span> są jednym z głównych składników naszej oferty. Plotery i{" "}
            <span className="underline">drukarki wielkoformatowe</span> znajdują
            wiele zastosowań w branży reklamowej. Są używane do druku plakatów,
            banerów, flag. Umożliwiają druk m.in. na papierze, folii, frontlicie,
            siatce mesh i podłożach tekstylnych.
            <br />
            Wielki format to nie tylko drukarki, lecz także skanery. Po dodaniu
            odpowiedniego oprogramowania zmieniają się w wydajne systemy
            skanujące i kopiujące. Stosując{" "}
            <span className="underline">oprogramowanie OCR</span> oraz CAD/GIS,
            można wykorzystać te urządzenia do digitalizacji i druku projektów
            architektonicznych i inżynierskich.
          </p>
        </div>
      </div>

      {/* 7 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Cyfrowe drukarki do etykiet
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            Cyfrowe <span className="font-semibold">drukarki do etykiet</span>{" "}
            są przeznaczone do druku małych i średnich nakładów. Sprawdzają się
            przy personalizacji druku – wprowadzanie zmian i korekt jest szybkie
            dzięki braku form drukowych. Technologia cyfrowa pozwala także na{" "}
            <span className="font-semibold">uszlachetnianie papieru</span>, np.
            poprzez pokrywanie całości wydruku lakierem lub tylko wybranych
            elementów, co daje efekt 3D.
          </p>
        </div>
      </div>
         {/* 8 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Sprzedaż drukarek i kserokopiarek poleasingowych
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            Prowadzimy{" "}
            <span className="font-semibold">
              sprzedaż drukarek i kserokopiarek poleasingowych
            </span>{" "}
            renomowanych marek. To atrakcyjna alternatywa dla zakupu nowego
            sprzętu. Oferujemy maszyny klasy premium w cenie średniej jakości
            nowych urządzeń drukujących. Dzięki temu możesz korzystać z
            zaawansowanych technologicznie rozwiązań i pozostawić znaczne kwoty
            w budżecie. Możesz też kupić więcej urządzeń, co nie byłoby możliwe
            w przypadku nowego sprzętu.
            <br />
            Kupując u nas{" "}
            <span className="font-semibold">kopiarki poleasingowe</span>, nie
            musisz obawiać się przykrych niespodzianek: nasz{" "}
            <span className="underline">serwis urządzeń wielofunkcyjnych</span>{" "}
            wykrywa i usuwa usterki przed przekazaniem maszyny nowemu
            użytkownikowi. Kserokopiarki poleasingowe są starannie sprawdzone,
            dzięki czemu wykonują swoje zadania wydajnie i z zachowaniem wysokiej
            jakości skanowania i druku.
          </p>
        </div>
      </div>

      {/* 9 */}
      <div className="self-stretch inline-flex justify-start items-start gap-12">
        <div className="w-80 flex justify-start items-center gap-2.5">
          <h2 className="w-80 text-black text-2xl font-semibold font-['Montserrat'] leading-7">
            Oferta kserokopiarek czarno-białych
          </h2>
        </div>
        <div className="flex-1 justify-start">
          <p className="text-black text-base font-normal font-['Montserrat'] leading-tight">
            W naszej ofercie znajdziesz szeroki wybór{" "}
            <span className="font-semibold">kserokopiarek czarno-białych</span>,
            które doskonale sprawdzą się w biurach, gdzie nie jest wymagany druk
            kolorowy. To ekonomiczne rozwiązanie, które pozwala na obniżenie
            kosztów eksploatacji, nie tracąc przy tym na jakości wydruków.
            <br />
            Nasza oferta obejmuje zarówno nowe, jak i poleasingowe kserokopiarki
            czarno-białe od renomowanych producentów, takich jak{" "}
            <span className="font-semibold">
              Canon, Konica Minolta, HP czy Kyocera
            </span>
            . W zależności od potrzeb, możemy zaproponować urządzenia o różnych
            prędkościach druku oraz funkcjonalnościach, takich jak kopiowanie,
            skanowanie czy faksowanie.
            <br />
            Dla firm poszukujących ekonomicznych rozwiązań oferujemy również{" "}
            <span className="font-semibold">drukarki laserowe czarno-białe</span>,
            które łączą w sobie zalety kserokopiarek i drukarek. To doskonałe
            urządzenia dla biur, które potrzebują szybkiego i wydajnego druku
            dokumentów tekstowych czy tabelarycznych.
            <br />
            Każde z naszych urządzeń jest starannie sprawdzone i serwisowane
            przed sprzedażą, dzięki czemu masz pewność, że zakupione u nas
            kserokopiarki czarno-białe będą służyć Ci przez długi czas.
            Zapewniamy również profesjonalną obsługę oraz serwis, który pomoże w
            razie jakichkolwiek problemów związanych z użytkowaniem urządzeń.
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
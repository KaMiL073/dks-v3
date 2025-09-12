import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import Layout from '../../components/layouts/layout';
import HeaderTop from '../../components/elements/headerTop';
import Breadcrumb from '../../components/elements/breadcrumb';
import PromoSection from '../../components/homepage/promoSection';
import NewsSection from '../../components/homepage/newsSection';
import ContactForm from '../../components/elements/contactForm';
import getSettings from '../../lib/models/generalSettings';

import getNews from '../../lib/models/news';
import getPageData from '../../lib/models/pages';

// import getTextField from '../../lib/helpers/textFieldsHelper';

import styles from '../../styles/Oddzialy.module.scss';

// const TITLE = 'Oddziały';
const departments = [
  {
    name: 'gdansk',
    fullName: 'DKS Sp. z o.o. Oddział Gdańsk',
    img: '//static/departments/gdansk.webp',
    href: '/oddzialy/gdansk',
    title: 'Sprzedaż i dzierżawa kserokopiarek w Gdańsku',
    description: `<p>Najdłużej sprzedajemy i dzierżawimy <strong>kserokopiarki w Gdańsku</strong>. To pierwszy oddział i jednocześnie główna siedziba DKS. Znajduje się w niewielkiej odległości od centrum miasta. Oprócz sprzętu biurowego oferujemy maszyny poligraficzne oraz plotery i <a title="drukarki wielkoformatowe" href="https://www.dks.pl/oferta/rozwiazania-wielkoformatowe" target="_blank" rel="noopener">drukarki wielkoformatowe</a> renomowanych producentów.</p>
                  <p>Świadczymy <strong>usługi serwisowe</strong> na terenie województwa pomorskiego. Prowadzimy sprzedaż detaliczną, a także hurtową. W naszej ofercie znajdują się również materiały eksploatacyjne oraz oprogramowanie do zarządzania drukiem, <a title="oprogramowanie do obiegu dokumentów" href="https://www.dks.pl/oferta/oprogramowanie-dla-biura" target="_blank" rel="noopener">oprogramowanie do obiegu dokumentów</a> oraz systemy OCR, GIS i CAD.</p>
                  <p>Obsługujemy Klientów m.in. z Sopotu, Gdyni, Słupska, Malborka i Chojnic. Oddział ma własny magazyn, dzięki czemu czas oczekiwania na części i materiały eksploatacyjne możemy skrócić do niezbędnego minimum. </p>
                  <h2>Nowe i używane biurowe urządzenia drukujące</h2>
                  <p>Urządzenia do druku są nieodzowną częścią biura. Przyspieszają codzienną pracę, pozwalają na szybkie powielanie i przesyłanie dokumentów. Kupując <strong>urządzenia biurowe w DKS</strong>, masz pewność, że otrzymasz sprzęt starannie sprawdzony i w pełni sprawny. To maszyny klasy biznesowej, które usprawnią wszystkie procesy związane z przetwarzaniem dokumentów w Twojej firmie. Mają m.in. możliwość przechowywania plików w chmurze, do których dostęp jest możliwy z każdego miejsca na świecie.</p>
                  <p>Digitalizacja dokumentów z użyciem wielofunkcyjnych drukarek i kopiarek klasy biznesowej staje się jeszcze wydajniejsza. Dostarczane przez nas maszyny mają niskie zużycie energii, cechuje je cicha praca oraz bardzo wysoka jakość techniczna wydruków. </p>
                  <h2>Dzierżawa kserokopiarek w Gdańsku</h2>
    <p>
        Dzierżawa kserokopiarek to doskonałe rozwiązanie dla firm i instytucji, które chcą korzystać z nowoczesnych urządzeń drukujących, ale nie chcą ponosić kosztów ich zakupu. 
        W Gdańsku oferujemy szeroką gamę kserokopiarek do dzierżawy, zarówno nowych, jak i używanych, które spełniają różnorodne potrzeby naszych klientów.
    </p>
    <p>
        Nasza oferta dzierżawy kserokopiarek obejmuje krótko- i długoterminowe umowy, dzięki czemu możemy dostosować się do indywidualnych potrzeb każdej firmy. 
        Oferujemy atrakcyjne warunki finansowe oraz elastyczność w zmianie wybranego urządzenia w przypadku zmieniających się potrzeb. 
        Dzierżawione kserokopiarki są objęte pełnym serwisem technicznym, co gwarantuje ich sprawne funkcjonowanie przez cały okres umowy.
    </p>
    <p>
        Korzystając z naszej oferty dzierżawy kserokopiarek w Gdańsku, zyskujesz nie tylko dostęp do nowoczesnych urządzeń drukujących, ale także wsparcie naszych specjalistów, 
        którzy pomogą w dobraniu odpowiedniego sprzętu oraz zapewnią profesjonalne doradztwo w zakresie optymalizacji procesów druku. 
        Dzięki temu możesz skupić się na rozwijaniu swojej firmy, a my zajmiemy się sprawami związanymi z drukowaniem i zarządzaniem dokumentami.
    </p>
                  `,
    metaTitle: 'Kserokopiarki do biura: sprzedaż i dzierżawa – DKS Gdańsk',
    metaDescription: 'Oferujemy sprzedaż i dzierżawę drukarek i kserokopiarek wielofunkcyjnych do biura. Dostarczamy drukarki wielkoformatowe i poligraficzne. Oferta na stronie.',
    address: 'ul. Energetyczna 15, 80-180 Kowale',
    phone: '58 309 03 07',
    email: 'info.gdansk@dks.pl',
    offerTab: 'Urządzenia do druku są nieodzowną częścią biura, przyśpieszają one standardową pracę, pozwalają na szybkie powielanie i przesyłanie dokumentów. Dostęp do dokumentów w chmurze jest możliwy z każdego miejsca, dla każdej uprawnionej osoby. Digitalizacja dokumentów staje się jeszcze bardziej wydajniejsza dzięki zautomatyzowanym przepływom pracy skanowania, wyszukiwania i przechowywania. Dodatkowo oferowane przez nas produkty mają niskie zużycie energii, cechuje je cicha praca, a jakość wydruków jest na wysokim poziomie. W naszej ofercie znajdziesz rozwiązania drukujące od biurowych drukarek, po produkcyjne urządzenia mało i wielkoformatowe. Zapewniamy również materiały eksploatacyjne i oprogramowanie do zarządzania wydrukami.',
    leaseTab: 'Ciężko wyobrazić sobie dzisiejsze biuro bez urządzeń, które w znacznym stopniu upraszczają i przyspieszają wykonywane obowiązki. Jednym z nich jest urządzenie wielofunkcyjne, które drukuje, kopiuje, kseruje, a także przy doborze kolejnych opcji zszywa, dziurkuje, składa itd. Niemniej jednak również wiemy, że zakup takiego sprzętu nie należy do tanich wydatków, dlatego bardzo dobrym rozwiązaniem jest najem maszyny. Decydując się na umowę najmu, płacisz jedynie za wykonane wydruki/kopie. Jeżeli będzie się coś działo z kserokopiarką zapewniamy szybką reakcję serwisu, wymianę części, materiałów eksploatacyjnych. Chciałbyś dowiedzieć się więcej? Zapraszamy do kontaktu.',
    photocopiersTab: 'W naszej ofercie znajdują się takie marki rozwiązań do druku jak: Canon, Konica Minolta, HP, Lexmark, Contex, es-te, Oce, Oki. Każdy model dostępny jest w sprzedaży, ale może być również wynajęty na określony czas. Interesuje Cię leasing, taka forma również jest możliwa. Posiadamy maszyny nowe, ale także używane, poleasingowe. U nas kupisz również materiały eksploatacyjne a także części zamienne. Oferujemy także oprogramowanie do zarządzania drukiem, które przyczyni się do redukcji ponoszonych kosztów, a co ważniejsze będziesz mieć kontrolę nad wszystkimi wydrukami, którym zapewnisz bezpieczeństwo. Do tego zapewniamy specjalistyczny serwis. Nasi serwisanci odbywają regularne szkolenia, dzięki czemu są na bieżąco z nowościami. Przedstaw nam swoje potrzeby, a my dobierzemy najlepsze rozwiązanie dla Ciebie i Twojej firmy.',
    serviceTab: 'Każde urządzenie, aby sprawnie działało musi co jakiś czas przejść kontrolne badanie, więc warto powierzyć swoje urządzenia w ręce wykwalifikowanych specjalistów. Mamy rozwinięty dział serwisu i logistyki oraz 12 punktów wraz z magazynami w największych miastach w Polsce, dzięki czemu jesteśmy w stanie w szybkim czasie dotrzeć do zgłoszonej awarii. W ramach usługi serwisowej gwarantujemy: cykliczne przeglądy urządzeń, usunięcie awarii, wymianę zużytych podzespołów. Po stronie użytkownika pozostaje jedynie dbanie o zapas papieru, a my zajmiemy się całą resztą. Zapraszamy do naszego oddziału w Gdańsku, gdzie znajduje się showroom z urządzeniami, Nie kupuj kota w worku, przyjdź, przetestuj z nami urządzenie i sprawdź czy odpowiada Twoim potrzebom.',
    salesContact: {
      phones: ['58 309 03 07'],
      emails: ['info.gdansk@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104'],
      emails: ['serwis.gdansk@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2327.275768615877!2d18.549036715875324!3d54.31675598019384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd7698e9e3af7f%3A0xfc429fd54aa89ec3!2sEnergetyczna%2015%2C%2080-180%20Kowale!5e0!3m2!1spl!2spl!4v1625664627445!5m2!1spl!2spl',
  },
  {
    name: 'warszawa',
    href: '/oddzialy/warszawa',
    title: 'Urządzenia biurowe klasy premium w Warszawie',
    fullName: 'DKS Sp. z o.o. Oddział Warszawa',
    img: '//static/departments/warszawa.webp',
    description: `<p>Specjalizujemy się w sprzedaży, dzierżawie oraz serwisie urządzeń drukujących do biur, a także maszyn poligraficznych i wielkoformatowych. Nabywając <strong>urządzenia biurowe</strong>, masz dostęp do bardzo bogatego asortymentu maszyn klasy premium. Starannie dobieramy drukarki, <strong>kserokopiarki</strong>, skanery oraz <a title="urządzenia wielofunkcyjne do biura" href="https://www.dks.pl/oferta/rozwiazania-dla-biura/" target="_self">urządzenia wielofunkcyjne do biura</a> pod kątem oferowanych funkcji, trwałości i niezawodności.</p>
                  <p>Dostarczamy urządzenia takich marek, jak HP, Canon, Konica Minolta, Lexmark, KIP, Es-Te, OKI, Ricoh, Kyocera. W skład naszego portfolio wchodzą kserokopiarki, drukarki laserowe i skanery, a także różnorodny <a title="sprzęt poligraficzny" href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" target="_self"> sprzęt poligraficzny</a>. Dzięki temu możemy tworzyć spersonalizowane oferty i zaspokajać bardzo specyficzne oczekiwania naszych Klientów. Jeżeli zamierzasz kupić lub wynająć kserokopiarkę, to wizyta w naszym oddziale pozwoli Ci szybko przeprowadzić niezbędne formalności.</p>
                  <h2>Kserokopiarki renomowanych marek na sprzedaż i na wynajem</h2>
                  <p>Dostarczamy <strong>maszyny biurowe i poligraficzne nowe i używane</strong> (poleasingowe). Możesz je kupić lub wynająć: <a title="dzierżawa kserokopiarek" href="https://www.dks.pl/wynajem-urzadzen-wielofunkcyjnych" target="_self">dzierżawa kserokopiarek</a> i drukarek jest ważną częścią naszej działalności. Zamiana dużej inwestycji w zakup sprzętu na relatywnie niski miesięczny czynsz jest szczególnie atrakcyjna dla młodych firm. Wynajem jest też optymalny w sytuacji, w której potrzebujesz większej liczby maszyn drukujących do realizacji projektu o ściśle określonych ramach czasowych. </p>
                  <p>Zachęcamy do kontaktu, sprawdź, jak bardzo korzystne są nasze warunki dzierżawy. Chętnie pomożemy dobrać urządzenia spełniające Twoje wymagania. W czasie trwania kontraktu będziemy dbali o to, aby każdego dnia działały wydajnie i bezawaryjne.</p>
                  <p>Zatrudniani przez nas handlowcy obsługują Klientów z Warszawy i całego województwa mazowieckiego. Realizujemy umowy z podmiotami z Pruszkowa, Piaseczna, Łomianek, Legionowa, Marek. Zachęcamy do kontaktu telefonicznego lub do odwiedzenia naszego biura przy ul. Kolumba 36.</p>
                      <h2>Oferta sprzedaży i dzierżawy kserokopiarek w Warszawie</h2>
                  <p>
                      Specjalizujemy się w sprzedaży, dzierżawie oraz serwisie urządzeń drukujących do biur, a także do poligrafii. 
                      W skład naszego portfolio wchodzą kserokopiarki, drukarki cyfrowe czy skanery wielkoformatowe. 
                      Dzięki szerokiemu wachlarzowi asortymentu, oferowane przez nas produkty, rozwiązania jak i usługi mają na celu efektywne zaspokojenie indywidualnych potrzeb naszych Klientów.
                  </p>
                  <p>
                      Dzierżawa kserokopiarek, którą oferujemy, łączy się z wieloma zaletami. Dzięki tej usłudze zapewniamy:
                  </p>
                  <ul>
                      <li>Wysokiej jakości druk monochromatyczny oraz kolorowy,</li>
                      <li>Cykliczne przeglądy urządzeń,</li>
                      <li>Fachowy serwis,</li>
                      <li>Niskie ceny wykonanych kopii.</li>
                  </ul>
                  <p>
                      Fundamentem naszej firmy jest długoletnie doświadczenie, profesjonalizm, szybkość działania i elastyczne podejście do każdego klienta indywidualnie. 
                      Zachęcamy do kontaktu z naszym warszawskim oddziałem – zaoferujemy korzystne warunki wynajmu i pomożemy dobrać urządzenie spełniające Twoje wymagania. 
                      W czasie trwania kontraktu będziemy dbali, aby urządzenia każdego dnia sprawnie działały.
                  </p>

                  <h2>Zalety dzierżawy kserokopiarek</h2>
                  <p>
                      Dzierżawa kserokopiarek to rozwiązanie, które przynosi wiele korzyści dla przedsiębiorstw i instytucji. Oto najważniejsze zalety tej usługi:
                  </p>
                  <ul>
                      <li><strong>Oszczędność finansowa:</strong> Dzierżawa kserokopiarek pozwala na uniknięcie dużego wydatku związanego z zakupem urządzenia. 
                          Zamiast tego, płacisz niższy, stały miesięczny czynsz, co pozwala lepiej kontrolować koszty i optymalizować budżet.</li>
                      <li><strong>Serwis i wsparcie techniczne:</strong> Dzierżawione kserokopiarki są objęte pełnym wsparciem technicznym, 
                          co obejmuje regularne przeglądy, naprawy oraz dostarczanie niezbędnych materiałów eksploatacyjnych. Dzięki temu nie musisz martwić się o utrzymanie sprzętu w dobrym stanie.</li>
                      <li><strong>Prognozowanie kosztów:</strong> Dzierżawa kserokopiarek pozwala na łatwe prognozowanie kosztów związanych z drukiem i kopiowaniem, co ułatwia planowanie budżetu.</li>
                  </ul>
                  <p>
                      W naszej ofercie znajdziesz szeroki wybór kserokopiarek do wynajęcia, zarówno monochromatycznych, jak i kolorowych, dostosowanych do różnych potrzeb i wymagań. 
                      Zapraszamy do kontaktu z naszym oddziałem w Warszawie, aby uzyskać więcej informacji na temat warunków dzierżawy oraz doboru odpowiedniego urządzenia.
                  </p>
                  `,
    metaTitle: 'Kserokopiarki i urządzenia biurowe klasy premium – DKS Warszawa',
    metaDescription: 'Dostarczamy wydajne urządzenia biurowe, drukarki i kserokopiarki klasy premium. Oferujemy drukarki poligraficzne i wielkoformatowe. Sprawdź szczegóły oferty.',
    address: ' Oddział w Warszawie: ul. Muszkieterów 15, 02-273 Warszawa',
    address2: 'Magazyn: Park Magazynowy BOXZONE Puchały, ul. Żwirowa 68, 05-090 Puchały',
    phone: '22 632 12 09',
    email: 'info.warszawa@dks.pl',
    offerTab: 'Specjalizujemy się w sprzedaży, dzierżawie oraz serwisie urządzeń drukujących do biur, a także do poligrafii. W skład naszego portfolio wchodzą kserokopiarki, drukarki cyfrowe czy skanery wielkoformatowe. Dzięki szerokiemu wachlarzowi asortymentu, oferowane przez nas produkty, rozwiązania jak i usługi mają na celu efektywne zaspokojenie indywidualnych potrzeb naszych Klientów. Dzierżawa kserokopiarek, którą oferujemy łączy się z wieloma zaletami, dzięki tej usłudze zapewniamy wysokiej jakości druk monochromatyczny oraz kolorowy, cykliczne przeglądy urządzeń, fachowy serwis oraz niskie ceny wykonanych kopii. Fundamentem naszej firmy jest długoletnie doświadczenie, profesjonalizm, szybkość działania i elastyczne podejście do każdego klienta indywidualnie. Zachęcamy do kontaktu z naszym warszawskim oddziałem – zaoferujemy korzystne warunki wynajmu i pomożemy dobrać urządzenie spełniające Twoje wymagania, a w czasie trwania kontraktu będziemy dbali, aby urządzenia każdego dnia sprawnie działały.',
    leaseTab: 'Działamy na rynku już prawie trzy dekady, dlatego pozwalamy sobie oferować naszym Klientom naszym zdaniem najwygodniejszą opcję użytkowania sprzętu drukującego jaką jest dzierżawa. Klient płaci jedynie za pojedyncze kopie, a my dbamy o całą resztę. Zapewniamy wymianę urządzeń po upływie okresu umowy lub w czasie jej trwania, jeżeli zajdzie potrzeba wymiany urządzenia na bardziej wydajnego, jak najbardziej jesteśmy w stanie zrobić taką wymianę. Dzięki takiemu rozwiązaniu jesteśmy w stanie idealnie dopasować urządzenia drukujące do aktualnych potrzeb Klienta. Nasz zespół Doradców Handlowych obsługuje klientów z całego województwa mazowieckiego. Mamy podpisane umowy z podmiotami z takich miast jak Pruszków, Piaseczno, Łomianki, Legionowo, Marki. Zachęcamy do podjęcia współpracy z naszym oddziałem w Warszawie. Możesz skontaktować się z nami w łatwy sposób poprzez wypełnienie formularza zgłoszeniowego na stronie „szybki kontakt”. Zapraszamy do kontaktu.',
    photocopiersTab: 'Jesteśmy Autoryzowanym Dystrybutorem i Serwisem Canon, Konica Minolta, Lexmark, HP. Prezentujemy bardzo szeroką ofertę produktów związanych z drukiem cyfrowym i przetwarzaniem obrazu, które można kupić lub wynająć. W naszej ofercie znajdują się nowe i poleasingowe urządzenia do drukowania, skanowania, kopiowania i przesyłania dokumentów. Proponujemy również materiały eksploatacyjne oraz części zamienne takich marek jak: Canon, Konica Minolta, Ricoh, OKI, Toshiba, HP i wielu innych. Naszą bogatą ofertę dopełnia oprogramowanie. Wdrażamy i szkolimy z systemów druku, które świetnie się sprawdzają w organizacjach biznesowych, które realnie wpływają na zmniejszenie kosztów druku, monitorują wydruki, a także przyczyniają się do zwiększenia wydajności pracy na urządzeniach.',
    serviceTab: 'Proponujemy podpisanie umowy dzierżawy lub samej umowy serwisowej, dlaczego? Ponieważ to na nas spada cała opieka nad urządzeniem. Zapewniamy pełen serwis w zamian za rozliczenie za każdą kopię. Dzięki takiemu rozwiązaniu masz pełną kontrolę nad wydatkami. Długoletnia współpraca ze światowymi liderami takimi jak Canon, Konica Minolta, Lexmark, HP procentuje bardzo dobrze wykwalifikowaną kadrą Serwisantów, którzy na bieżąco odbywają szkolenia i kursy. Wychodząc na przeciw oczekiwaniom Klienta, aby możliwie usprawnić i przyśpieszyć szybkość przyjmowania zleceń, rozbudowaliśmy nasz dział Obsługi Klienta, w którym od poniedziałku do piątku, w godzinach 8:00 - 16:00 rozwiązywane są wszelkie tematy.',
    salesContact: {
      phones: ['22 632 12 09'],
      emails: ['info.warszawa@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.warszawa@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d865.6026181699023!2d20.887402856407853!3d52.147164218437894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47193557e520853b%3A0x12a7f494ac883186!2sBOXZONE%20Pucha%C5%82y%20I!5e0!3m2!1spl!2spl!4v1736406944470!5m2!1spl!2spl',
  },
  {
    name: 'katowice',
    href: '/oddzialy/katowice',
    title: 'Kserokopiarki i urządzenia biurowe w Katowicach',
    fullName: 'DKS Sp. z o.o. Oddział Katowice',
    img: '//static/departments/katowice.webp',
    description: `<p>Świadczymy od wielu lat usługi związane z zaopatrywaniem w sprzęt drukujący biur, drukarń, agencji reklamowych i zakładów usługowych. Planując kupić lub wynająć drukarki poligraficzne, plotery wielkoformatowe czy <strong>urządzenia biurowe w Katowicach</strong>, skontaktuj się z oddziałem DKS. Nasza oferta jest atrakcyjna i możemy ją elastycznie dopasować do Twoich oczekiwań.</p>
                  <p>Zaopatrujemy firmy i przedsiębiorstwa w <strong>profesjonalne urządzenia drukujące</strong> znanych marek: Konica Minolta, Lexmark, Canon, KIP, Contex, HP, Ricoh, Kyocera i wielu innych. Katowicki oddział firmy umożliwia łatwe korzystanie z naszej oferty interesantom z województwa śląskiego. Mamy podpisane umowy z podmiotami z Będzina, Sosnowca, Częstochowy, Mysłowic, Bytomia. Poza sprzedażą proponujemy także wynajem oraz dzierżawę kserokopiarek na indywidualnie ustalonych warunkach współpracy i finansowania.</p>
                  <h2>Nowe i używane kserokopiarki do zakupu i dzierżawy</h2>
                  <p>Jeżeli szukasz urządzeń, które drukują i skanują w bardzo dobrej jakości, a przy tym są tanie w eksploatacji, znajdziesz je u nas. Proponujemy zarówno urządzenia nowe, jak i poleasingowe. Jeżeli nie masz pewności, który sprzęt będzie dla Ciebie najlepszy, zachęcamy do kontaktu. Nasi specjaliści przedstawią oferty przygotowane specjalnie dla Ciebie. </p>
                  <p>Nabywając lub wynajmując <strong>kserokopiarki w DKS</strong>, minimalizujesz ryzyko wybrania niewłaściwego urządzenia. Gdy stwierdzisz, że potrzebujesz, szybszej i wydajniejszej kserokopiarki, wymienimy ją na nowszą. Na identyczne warunki współpracy mogą liczyć Klienci wszystkich oddziałów DKS, które są zlokalizowane w 12 największych miastach wojewódzkich w Polsce.</p>
                  <h2>Oferta kserokopiarek w Katowicach</h2>
                  <p>
                      Jeżeli szukasz urządzeń, które drukują i skanują w bardzo dobrej jakości, a przy tym są tanie w eksploatacji to dobrze trafiłeś. 
                      W naszej ofercie znajdziesz zarówno drukarki i kserokopiarki do biura jak i urządzenia produkcyjne mało i wielkoformatowe. 
                      Urządzenia mamy nowe jak i poleasingowe, kolorowe i czarnobiałe, jest w czym wybierać. A gdy nie jesteś pewien, który sprzęt będzie dla Ciebie najlepszy, zachęcamy do kontaktu. 
                      Nasi specjaliści przedstawią najlepsze oferty właśnie dla Ciebie. 
                  </p>
                  <p>
                      Możesz kupić lub wynająć urządzenia na jakiś czas, a gdy stwierdzisz, że potrzebujesz szybszej i wydajniejszej kserokopiarki, wymienimy ją na nowszą. 
                      Oddziały (i magazyny) mamy w największych miastach Polski, co jest dodatkowym atutem, gdy tak jak my masz filie w różnych zakątkach Polski.
                  </p>
                  <h2>Dlaczego warto wynająć kserokopiarkę?</h2>
                  <p>
                      Wynajem kserokopiarki to doskonałe rozwiązanie dla wielu firm i przedsiębiorstw, które chcą zoptymalizować koszty związane z drukowaniem i skanowaniem dokumentów. 
                      Oto kilka powodów, dla których warto rozważyć wynajem kserokopiarki w Katowicach:
                  </p>
                  <ul>
                      <li>
                          <strong>Elastyczność</strong>: Dzierżawa kserokopiarki pozwala na dostosowanie umowy do indywidualnych potrzeb firmy. 
                          Można wybrać okres wynajmu, rodzaj urządzenia oraz dodatkowe usługi, takie jak serwis czy dostawa materiałów eksploatacyjnych.
                      </li>
                      <li>
                          <strong>Oszczędność</strong>: Wynajem kserokopiarek to sposób na uniknięcie dużego wydatku na zakup urządzenia, co jest szczególnie korzystne dla małych i średnich firm.
                      </li>
                      <li>
                          <strong>Aktualność technologiczna</strong>: Dzierżawione urządzenia są nowoczesne i wyposażone w najnowsze technologie, co przekłada się na szybsze i wydajniejsze drukowanie oraz skanowanie.
                      </li>
                      <li>
                          <strong>Serwis i wsparcie</strong>: Wynajmując kserokopiarkę, otrzymujesz wsparcie techniczne oraz serwis gwarancyjny, co pozwala na szybkie rozwiązanie ewentualnych problemów związanych z urządzeniem.
                      </li>
                  </ul>
                  <p>
                      Wynajem kserokopiarek w Katowicach to wygodne i ekonomiczne rozwiązanie dla firm, które chcą korzystać z nowoczesnych urządzeń drukujących i skanujących bez konieczności ponoszenia dużych kosztów związanych z zakupem i utrzymaniem własnej kserokopiarki.
                  </p>
                  `,
    metaTitle: 'Urządzenia biurowe: nowe i używane kserokopiarki – DKS Katowice',
    metaDescription: 'Nowe i używane urządzenia biurowe oraz biznesowe kserokopiarki wielofunkcyjne najłatwiej kupisz lub wynajmiesz w DKS w Katowicach. Sprawdź szczegóły oferty.',
    address: 'ul. Ks. Bp. Bednorza 2a-6, 40-384 Katowice',
    phone: '32 730 01 11',
    email: 'info.katowice@dks.pl',
    offerTab: 'Jeżeli szukasz urządzeń, które drukują i skanują w bardzo dobrej jakości, a przy tym są tanie w eksploatacji to dobrze trafiłeś. W naszej ofercie znajdziesz zarówno drukarki i kserokopiarki do biura jak i urządzenia produkcyjne mało i wielkoformatowe. Urządzenia mamy nowe jak i poleasingowe, kolorowe i czarnobiałe, jest w czym wybierać. A gdy nie jesteś pewien, który sprzęt będzie dla Ciebie najlepszy, zachęcamy do kontaktu. Nasi specjaliści przedstawią najlepsze oferty właśnie dla Ciebie. Możesz kupić lub wynająć urządzenia na jakiś czas, a gdy stwierdzisz, że potrzebujesz, szybszej wydajniejszej kserokopiarki, wymienimy ją na nowszą. Oddziały (i magazyny) mamy w największych miastach Polski, co jest dodatkowym autem, gdy tak jak my masz filie w różnych zakątkach Polski.',
    leaseTab: 'Od wielu lat wynajmujemy (dzierżawimy) nasze drukarki, kserokopiarki, a także maszyny produkcyjne mało i wielkoformatowe. Jest to świetny i sprawdzony system. Dzięki takiej opcji, nie musisz wydawać jednorazowo dużej kwoty, nie musisz brać także urządzeń w leasing. To Ty decydujesz na jaki czas chcesz wynająć maszynę. I co ważne, dzierżawiąc naszą maszynę, zapewniamy jej serwis. Na czym właściwie polega wynajem? Co miesiąc płacisz za wykonane wydruki według stawki objętej w umowie, a my zapewniamy tonery, materiały eksploatacyjne i serwis bezpłatnie. Potrzebujesz więcej informacji? Zapraszamy do kontaktu lub naszego oddziału w Katowicach (ul. Ks. Bp. Bednorza 2a/6).',
    photocopiersTab: 'Szukasz urządzenia, które ma tylko drukować czarno-białe dokumenty, a może chcesz drukować ulotki, wizytówki, a może banery? Dzięki współpracy ze światowymi liderami w obszarze druku, m.in.: Konica Minolta, Canon, Lexmark, Hp. Jesteśmy w stanie dobrać urządzenie, które będzie spełniało Twoje wszystkie oczekiwania. Posiadamy kserokopiarki nowe, a także poleasingowe, czarno-białe i kolorowe, nabiurkowe, a także wolnostojące. Urządzenie możesz kupić, ale równie dobrze możesz wynająć na określony czas. Zachęcamy do kontaktu z naszymi Specjalistami, którzy odpowiedzą na każde pytanie i doradzą i dobiorą najbardziej optymalne urządzenie czy całą flotę',
    serviceTab: 'Twoje urządzenie zaczęło brudzić wydruki, zacina często papier, potrzebujesz szybkiej fachowej pomocy? Świetnie trafiłeś! Serwisujemy drukarki i kserokopiarki takich marek jak: Konica Minolta, Canon, Lexmark, Hp., a także urządzenia produkcyjne oraz mało i wielkoformatowe (plotery, skanery, systemy wielofunkcyjne, składarki). Wygodnym rozwiązaniem jest podpisanie Kontraktu Obsługi Serwisowej, dzięki, której Twoje urządzenia będą pod stałą opieką. Wynajmując u nas urządzenie, serwis jest zapewniony w standardzie. Nie trać czasu na szukanie serwisu na cito, zajmij się tym co robisz najlepiej, a my zajmiemy się twoimi urządzeniami do druku.',
    salesContact: {
      phones: ['32 730 01 11'],
      emails: ['info.katowice@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.katowice@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2550.522292645458!2d19.091136515724646!3d50.26350577944996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4716cffc153456b5%3A0x5b04c908385b7e9!2sKsi%C4%99dza%20Biskupa%20Herberta%20Bednorza%202A%2C%2040-336%20Katowice!5e0!3m2!1spl!2spl!4v1651134513600!5m2!1spl!2spl',
  },
  {
    name: 'poznan',
    fullName: 'DKS Sp. z o.o. Oddział Poznań',
    href: '/oddzialy/poznan',
    img: '//static/departments/poznan.webp',
    title: 'Urządzenia biurowe i poligraficzne w Poznaniu',
    description: `<p>Niezależnie od tego, jakie urządzenie drukujące użytkujesz, planujesz kupić, wynająć lub naprawić, w DKS otrzymasz profesjonalne wsparcie. Nasza siedziba przy ul. Chlebowej 4/8 to najlepsze miejsce, aby kupić biznesowe <strong>urządzenia biurowe</strong>. W naszej ofercie dla biur znajdziesz drukarki, kserokopiarki wielofunkcyjne i skanery, a także niszczarki dokumentów.</p>
                  <p><strong>Zaopatrujemy też drukarnie cyfrowe</strong>: dostarczamy, montujemy i uruchamiamy pojedyncze urządzenia poligraficzne[https://www.dks.pl/oferta/rozwiazania-dla-poligrafii] i całe systemy druku produkcyjnego. Dostarczamy też maszyny do introligatorskiej obróbki wydruków: falcerki, finiszery, gilotyny, foliarki.</p>
                  <p>W gronie naszych Klientów znajdują się agencje reklamowe, biura projektowe, punkty świadczące usługi druku i inne przedsiębiorstwa z branży kreatywnej. Do nich adresujemy bogatą ofertę drukarek i ploterów wielkoformatowych, pracujących w technologii tonerowej lub atramentowej.</p>
                  <h2>Najlepsze marki i profesjonalny serwis kserokopiarek </h2>
                  <p>Jesteśmy <strong>autoryzowanym dystrybutorem prestiżowych marek: Konica Minolta, Lexmark, HP, Canon, KIP, Contex</strong>. Dostarczamy urządzenia nowe, ale prowadzimy też <a title="sprzedaż drukarek poleasingowych" href="https://www.dks.pl/oferta" target="_self">sprzedaż drukarek poleasingowych</a>, używanego sprzętu poligraficznego i wielkoformatowego. Oferujemy także dzierżawę kserokopiarek. Prowadzimy serwis, który wyróżnia się profesjonalizmem i krótkim czasem reakcji na zgłoszenia. Przeprowadzamy przeglądy techniczne, świadczymy usługi montażu oraz rozruchu maszyn i systemów. Realizujemy dostawy dowolnie wybranych materiałów eksploatacyjnych.</p>
                  <p>Jesteśmy przedsiębiorstwem z długim stażem w branży biurowej i poligraficznej. Chętnie udzielamy porad i konsultujemy plany zakupowe naszych Klientów dotyczące maszyn i urządzeń z naszej oferty. Nasz zespół handlowców obsługuje Klientów z całego województwa poznańskiego. Świadczymy różnorodne usługi w Środzie Wielkopolskiej, Wrześni, Gnieźnie, Obornikach, Wronkach. Jeżeli chcesz nabyć urządzenie drukujące lub szukasz serwisu dla swojej kopiarki, zapraszamy do bezpośredniego kontaktu z naszym oddziałem.</p>
                  <h2>Oferta kserokopiarek</h2>
                  <p>
                      Jesteśmy doświadczonymi specjalistami w dziedzinie urządzeń przeznaczonych do kopiowania, skanowania i drukowania. 
                      Poznański oddział DKS Sp. z o.o. to autoryzowany dystrybutor urządzeń Konica Minolta, Lexmark, HP, Canon, KIP, Triupmh-Adler i CONTEX. 
                      Oprócz sprzedaży oferujemy także wynajem i dzierżawę kserokopiarek. 
                  </p>
                  <p>
                      Do Państwa usług dostępny jest również serwis z gwarancją szybkiego czasu reakcji, gdzie dokonujemy napraw, a także dostarczamy materiały eksploatacyjne, 
                      przeprowadzamy przeglądy techniczne sprzętów i świadczymy usługi montażu oraz instalacji. 
                      Nasz zespół handlowców obsługuje klientów z całego województwa wielkopolskiego. 
                      Mamy podpisane umowy z podmiotami z takich miast jak Środa Wielkopolska, Września, Gniezno, Oborniki, Wronki.
                  </p>
                  <h2>Jak wybrać odpowiednią kserokopiarkę?</h2>
                  <p>
                      Wybór odpowiedniej kserokopiarki może być kluczowy dla efektywności pracy biura czy drukarni. Aby dokonać właściwego wyboru, warto wziąć pod uwagę kilka istotnych czynników:
                  </p>
                  <ul>
                      <li>
                          <strong>Funkcjonalność</strong>: Zastanów się, jakie funkcje będą potrzebne w Twoim biurze. Czy oprócz kopiowania potrzebujesz również drukowania, skanowania czy faksowania? 
                          Kserokopiarki wielofunkcyjne oferują te dodatkowe opcje, co może przyczynić się do oszczędności miejsca i zwiększenia wydajności.
                      </li>
                      <li>
                          <strong>Wydajność</strong>: Przed zakupem kserokopiarki warto ocenić, jak dużo kopii będzie potrzebnych na co dzień. 
                          Wybierz urządzenie o odpowiedniej prędkości druku i pojemności podajników papieru.
                      </li>
                      <li>
                          <strong>Jakość druku</strong>: W zależności od potrzeb, warto zwrócić uwagę na jakość druku oferowaną przez kserokopiarkę. 
                          Jeśli planujesz drukować głównie tekst, urządzenie o niższej rozdzielczości może być wystarczające. 
                          Natomiast jeśli zależy Ci na drukowaniu grafik czy zdjęć, warto rozważyć kserokopiarkę o wyższej rozdzielczości.
                      </li>
                  </ul>
                  <p>
                      Mając na uwadze powyższe kryteria, warto skonsultować się ze specjalistami oferującymi kserokopiarki w Poznaniu, 
                      którzy pomogą dobrać odpowiednie urządzenie do indywidualnych potrzeb Twojego biura.
                  </p>
                  `,
    metaTitle: 'Kserokopiarki, urządzenia biurowe i poligraficzne – DKS Poznań',
    metaDescription: 'Proponujemy nowe i poleasingowe urządzenia biurowe: kserokopiarki, drukarki, skanery. Dostarczamy drukarki poligraficzne i wielkoformatowe. Sprawdź ofertę!',
    address: 'ul. Chlebowa 4/8, 61-003 Poznań',
    phone: '61 842 58 84',
    email: 'info.poznan@dks.pl',
    offerTab: 'Jesteśmy doświadczonymi specjalistami w dziedzinie urządzeń przeznaczonych do kopiowania, skanowania i drukowania. Poznański oddział DKS Sp. z o.o. to autoryzowany dystrybutor urządzeń Konica Minolta, Lexmark, HP, Canon, KIP, Triupmh-Adler i CONTEX. Oprócz sprzedaży oferujemy także wynajem i dzierżawę kserokopiarek. Do Państwa usług dostępny jest również serwis z gwarancją szybkiego czasu reakcji, gdzie dokonujemy napraw, a także dostarczamy materiałów eksploatacyjnych, przeprowadzamy przeglądy techniczne sprzętów i świadczymy usługi montażu oraz instalacji. Nasz zespół handlowców obsługuje klientów z całego województwa wielkopolskiego. Mamy podpisane umowy z podmiotami z takich miast jak Środa Wielkopolska, Września, Gniezno, Oborniki, Wronki.',
    leaseTab: 'Dzierżawa kserokopiarek staje się coraz bardziej popularna. Tak się dzieje, ponieważ wynajem urządzenia do druku daje bardzo wiele korzyści, najważniejsza z nich to fakt, że odchodzi nam koszt zakupu. Po 36 miesiącach, taki jest najczęstszy okres trwania umowy, możemy wymienić urządzenie na nowe, szybsze, odpowiadające aktualnemu zapotrzebowaniu. Nie musisz się przejmować, że zostaniesz ze starą, wyeksploatowaną kopiarką. W standardzie jest utrzymanie wysokiej jakości wydruków, reakcja serwisu w ciągu kilku godzin, brak długich przestojów urządzenia, a także przewidywalne koszty, płacisz za jedynie za wykonane wydruki, a cokolwiek będzie się działo odbiegającego od normy z maszyną będzie przez nas naprawiane. Chcesz dowiedzieć się więcej? Zapraszamy do kontaktu z naszym oddziałem w Poznaniu.',
    photocopiersTab: 'W DKS znajdziesz szeroką ofertę nowych jak i poleasingowych urządzeń do druku. Dzięki temu, że jesteśmy Autoryzowanym Dystrybutorem i Serwisem światowych marek takich jak Canon, Konica Minolta, HP, Lexmark, dobieramy urządzenia, które najlepiej sprawdzą się w Twoim środowisku pracy. Kupić czy wynająć, a może zamówić sam serwis? Ty decydujesz, a my przedstawimy najlepsze dla Ciebie propozycje. Dodatkowo znajdziesz u nas również materiały eksploatacyjne oraz części zamienne takich marek jak: Canon, Konica Minolta, Ricoh, OKI, Toshiba, HP i wielu innych. Chcesz mieć pełną kontrolę nad środowiskiem druku, aby minimalizować koszty? Jeżeli Twoja odpowiedź jest twierdząca, to zachęcamy do zastanowienia się również nad oprogramowaniem, które oprócz zmniejszenia kosztów, będzie m.in.: koordynować przepływ dokumentów, zliczać aktywność użytkowników, zapewni bezpieczeństwo przesyłanych danych.',
    serviceTab: 'Jak często zdarza się, że trzeba wydrukować pilnie jakiś dokument, a drukarka odmawia posłuszeństwa? My to znamy, dlatego zapewniamy reakcję serwisu jeszcze tego samego dnia. Większość usterek można naprawić od ręki. Zachęcamy do podpisania umowy najmu lub kontraktu serwisowego- dlaczego? Zastanówmy się ile nas kosztuje czas, który byłby przeznaczony na szukanie w różnych źródłach serwisu, do tego koszt poniesiony z dojazdem serwisanta czy strach, że jednorazowa usługa może nie przynieść rozwiązania? A teraz pomyślmy, że można to wszystko załatwić poprzez jeden telefon, mail, czy zgłoszenie usterki przez formularz na naszej stronie. Staramy wychodzić na przeciw oczekiwaniom Klienta i możliwie jak to jest w naszej mocy upraszczać do minimum wszelkie kwestie związane ze zgłoszeniem awarii urządzenia, czy zamówieniem materiałów eksploatacyjnych lub części zamiennych.',
    salesContact: {
      phones: ['882 340 466', '61 842 58 84'],
      emails: ['info.poznan@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.poznan@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2433.506706211274!2d16.95879931580361!3d52.41561597979459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47045b655dea45b1%3A0xd0e573509894a828!2sChlebowa%204%2F8%2C%2061-003%20Pozna%C5%84!5e0!3m2!1spl!2spl!4v1651134647388!5m2!1spl!2spl',
  },
  {
    name: 'lodz',
    fullName: 'DKS Sp. z o.o. Oddział Łódź',
    img: '//static/departments/lodz.webp',
    href: '/oddzialy/lodz',
    title: 'Markowe kserokopiarki i urządzenia biurowe w Łodzi',
    description: `<p>Specjalizujemy się w sprzedaży markowych urządzeń do drukowania, kopiowania oraz skanowania. Rozwijamy swoją działalność w branży drukującego sprzętu biurowego, poligraficznego i wielkoformatowego. Jeżeli chcesz kupić <strong>urządzenia biurowe w Łodzi</strong>, zapraszamy do oddziału DKS. Pomagamy dobrać odpowiedni sprzęt z naszego asortymentu, spośród urządzeń takich marek jak: Konica Minolta, OKI, Canon, HP, Lexmark, Duplo, KIP, Contex, Es-Te, Kyocera, Ricoh. Jesteśmy oficjalnym partnerem w zakresie sprzedaży, wynajmu i serwisu światowych liderów w branży druku. Dostarczamy markowe skanery drukarki i <a title="urządzenia wielofunkcyjne do biura" href="https://www.dks.pl/oferta/rozwiazania-dla-biura/" target="_self">urządzenia wielofunkcyjne do biura</a>, drukarki poligraficzne i wielkoformatowe plotery drukujące. Działamy na terenie całej Polski: mamy oddziały mamy w 12 największych miastach wojewódzkich.</p>
                  <h2>Serwis maszyn drukujących wszystkich marek</h2>
                  <p>Jeżeli chcesz zapewnić swojej flocie drukującej długie i bezawaryjne działanie, zadbaj o terminową wymianę materiałów eksploatacyjnych i okresowe przeglądy techniczne. Skorzystaj z możliwości serwisowania <strong>kserokopiarki w jednym z naszych oddziałów</strong>. Możesz podpisać umowę na <a title="serwis kserokopiarek" href="https://www.dks.pl/zgloszenie-serwisowe" target="_self">serwis kserokopiarek</a>, drukarek, skanerów i innych maszyn związanych z drukiem i przetwarzaniem dokumentów. Serwisujemy wszystkie urządzenia z naszej oferty. Podejmujemy się napraw sprzętu drukującego większości popularnych marek. Zapewniamy szybką reakcję na zgłoszone awarie i usterki.</p>
                  <p>Nasz zespół handlowców obsługuje Klientów z całego województwa łódzkiego. Mamy podpisane umowy z podmiotami z Kutna, Bełchatowa, Sieradza, Tomaszowa Mazowieckiego, Skierniewic. Zachęcamy do przejrzenia asortymentu i zakresu usług naszego oddziału!</p>
                  <h2>Oferta kserokopiarek w Łodzi</h2>
                  <p>
                      Firma DKS jest oficjalnym partnerem w zakresie sprzedaży, wynajmu i serwisu, światowych liderów w branży druku jakimi są: Canon, Konica Minolta, HP, Lexmark, Oki, Contex, es-te. Działamy na terenie całej Polski, posiadając dwanaście oddziałów w największych miastach Polski.
                  </p>
                  <p>
                      Nasza działalność rozpoczęła się w 1993 roku, od tego czasu nieustannie się rozwijamy i wzbogacamy naszą ofertę. Wychodząc naprzeciw oczekiwaniom klientów stworzyliśmy centralę Biura Obsługi Klienta, a także dział koordynacji serwisu, aby wszelkie zgłoszenia serwisowe były jak najszybciej i jak najowocniej wykonywane, gwarantując specjalistyczną obsługę.
                  </p>

                  <h2>Zalety wynajmu kserokopiarek</h2>
                  <p>
                      Wynajem kserokopiarek to coraz bardziej popularne rozwiązanie, szczególnie wśród małych i średnich przedsiębiorstw. Przyjrzyjmy się najważniejszym zaletom wynajmu kserokopiarek:
                  </p>
                  <ul>
                      <li><strong>Zmniejszenie kosztów:</strong> Wynajem kserokopiarek pozwala na uniknięcie dużych wydatków związanych z zakupem urządzeń. Dzięki temu można zainwestować te środki w rozwój firmy.</li>
                      <li><strong>Elastyczność:</strong> Wynajem daje możliwość korzystania z różnych modeli kserokopiarek, dostosowując się do zmieniających się potrzeb firmy. W razie potrzeby można łatwo zmienić urządzenie na nowsze lub bardziej zaawansowane.</li>
                      <li><strong>Aktualizacja technologiczna:</strong> Wynajmując kserokopiarki, masz pewność, że korzystasz z nowoczesnych urządzeń. Dostawcy często oferują wymianę na nowsze modele, co pozwala na korzystanie z najnowszych technologii.</li>
                      <li><strong>Profesjonalny serwis:</strong> Wynajmując kserokopiarki, możesz liczyć na wsparcie profesjonalnego serwisu, który szybko i sprawnie rozwiąże ewentualne problemy.</li>
                  </ul>
                  <p>
                      Wynajem kserokopiarek to praktyczne i korzystne rozwiązanie dla przedsiębiorstw, które chcą oszczędzać na kosztach związanych z zakupem i utrzymaniem urządzeń biurowych. Jeśli poszukujesz kserokopiarek w Łodzi, skorzystaj z oferty wynajmu i ciesz się zaletami tego rozwiązania.
                  </p>
                  `,
    metaTitle: 'Kserokopiarki, drukarki, markowe urządzenia biurowe – DKS Łódź',
    metaDescription: 'Poszukujesz markowych urządzeń biurowych? Zapraszamy do oddziału DKS! Dostarczamy nowe i używane kserokopiarki na sprzedaż i wynajem. Sprawdź warunki.',
    address: 'ul. Ogrodowa 76, 91-071 Łódź',
    phone: '42 637 04 71',
    email: 'info.lodz@dks.pl',
    offerTab: 'Firma DKS jest oficjalnym partnerem w zakresie sprzedaży, wynajmu i serwisu, światowych liderów w branży druku jakimi są: Canon, Konica Minolta, HP, Lexmark, Oki, Contex, es-te. Działamy od na terenie całej Polski, swoje oddziały, których jest dwanaście, mamy w największych miastach Polski. Nasza działalność rozpoczęła się w 1993 roku, od tego czasu nieustannie się rozwijamy i wzbogacamy naszą ofertę. Wychodząc naprzeciw oczekiwaniom klientów stworzyliśmy centrale Biuro Obsługi Klienta, a także dział koordynacji serwisu, aby wszelkie zgłoszenia serwisowe były jak najszybciej i jak najowocniej wykonywane, gwarantując specjalistyczną obsługę.',
    leaseTab: 'Wybierając usługę dzierżawy (najmu) nie ponosisz kosztów zakupu urządzenia, ani kosztów związanych z naprawą czy wymianą części zamiennych i eksploatacyjnych. Zyskujesz bezpłatną obsługę serwisową – naprawy, przeglądy techniczne, konserwacje itp. Dostawa jak i instalacja urządzenia urządzenia jest bezpłatna. Po zainstalowaniu organizujemy również szkolenie z obsługi sprzętu, które również jest bezpłatne. Podczas trwania umowy zyskujesz naszą obsługę urządzenia, szybką reakcje serwisu, a także porady techniczne. Nie wiesz jakie urządzenie będzie dla Ciebie optymalne, masz pytania? Chętnie na nie odpowiemy i pomożemy w doborze najlepszej maszyny. Zapraszamy do kontaktu telefonicznie, mailowo lub bezpośrednio do naszego oddziału w Łodzi.',
    photocopiersTab: 'W naszej ofercie znajdą Państwo urządzenia do druku takie jak: drukarki, kserokopiarki, plotery, skanery, składarki, drukarki produkcyjne i urządzenia wielkoformatowe. Posiadamy urządzenia czarno-białe oraz kolorowe. Do wyboru mamy urządzenia nowe oraz używane czy poleasingowe. Dopełnieniem oferty są materiały eksploatacyjne i części zamienne, a także oprogramowanie do zarządzania drukiem. Urządzenie możesz kupić, a jeżeli potrzebujesz urządzenie tylko na określony czas lub nie chcesz wydawać jednorazowo dużej kwoty na zakup urządzenia to najlepszą alternatywą będzie wynajem. Oprócz sprzedaży i dzierżawy oferujemy również serwis.',
    serviceTab: 'Oferujemy naprawę drukarek, urządzeń wielofunkcyjnych, a także serwis urządzeń mało i wielkoformatowych. Posiadamy wieloletnie doświadczenie w środowisku do zarządzania danymi drukowanymi dzięki czemu gwarantujemy wysoką jakość obsługi. Nasi Serwisanci przechodzą regularne szkolenia, więc są na bieżąco z nowinkami technicznymi. Nasze oddziały znajdują się w największych miastach Polski. Każdy oddział posiada swój magazyn dzięki czemu standardowe materiały eksploatacyjne czy części zamienne są dostępne od ręki. Staramy się, aby czas naprawy był jak najkrótszy. Jeżeli zdecydujesz się na wynajem naszych maszyn, serwis zapewniamy w ramach opłat za kopie. Dzięki czemu przez czas trwania umowy nie będziesz musiał się martwić, że pojawi się jakiś niespodziewany dodatkowy wydatek, np. wymiana takiej części jak bęben.',
    salesContact: {
      phones: ['42 637 04 71'],
      emails: ['info.lodz@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.lodz@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2468.6950757777927!2d19.43295821577984!3d51.77518137968003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471bcac974706233%3A0xf0cac99026e05914!2zT2dyb2Rvd2EgNzYsIDkxLTA3MSDFgcOzZMW6!5e0!3m2!1spl!2spl!4v1651134784497!5m2!1spl!2spl',
  },
  {
    name: 'krakow',
    fullName: 'DKS Sp. z o.o. Oddział Kraków',
    img: '//static/departments/krakow.webp',
    href: '/oddzialy/krakow',
    title: 'Kserokopiarki i urządzenia poligraficzne Kraków',
    description: `
        <p>
            Nasza firma posiada wieloletnie doświadczenie na rynku urządzeń do druku. Zapewniamy wysoki standard oferty dzięki współpracy z wiodącymi producentami sprzętu kserująco-kopiującego. 
            Jednocześnie oferujemy fachowe doradztwo w doborze urządzeń z naszego asortymentu sprzedażowego. 
            W krakowskim oddziale mogą Państwo również skorzystać z opcji wynajmu bądź dzierżawy kserokopiarki, a także złożyć zlecenie do naszego serwisu kopiarek.
        </p>
        <p>
            Nasz zespół handlowców z oddziału Kraków obsługuje klientów z całego województwa małopolskiego. Mamy podpisane umowy z podmiotami z takich miast jak Nowy Targ, Tarnów, Nowy Sącz, Kielce, Olkusz. 
            Zapraszamy do zapoznania się z zakresem świadczeń oddziału Kraków!
        </p>

        <h2>Oferta kserokopiarek w Krakowie</h2>
        <p>
            W naszej ofercie znajdziesz urządzenia do druku w biurze A4 i A3, urządzenia do druku produkcyjnego, urządzenia introligatorskie, a także niszczarki. 
            W skład naszego portfolio wchodzą kserokopiarki, drukarki cyfrowe czy skanery wielkoformatowe. 
            Dzięki szerokiemu wachlarzowi asortymentu, oferowane przez nas produkty, rozwiązania jak i usługi mają na celu efektywne zaspokojenie indywidualnych potrzeb naszych Klientów.
        </p>
        <p>
            Dzierżawa kserokopiarek, którą oferujemy, łączy się z wieloma zaletami. Dzięki tej usłudze zapewniamy:
        </p>
        <ul>
            <li>Wysokiej jakości druk monochromatyczny oraz kolorowy,</li>
            <li>Cykliczne przeglądy urządzeń,</li>
            <li>Fachowy serwis,</li>
            <li>Niskie ceny wykonanych kopii.</li>
        </ul>
        <p>
            Fundamentem naszej firmy jest długoletnie doświadczenie, profesjonalizm, szybkość działania i elastyczne podejście do każdego klienta indywidualnie. 
            Zachęcamy do kontaktu z naszym krakowskim oddziałem – zaoferujemy korzystne warunki wynajmu i pomożemy dobrać urządzenie spełniające Twoje wymagania. 
            W czasie trwania kontraktu będziemy dbali, aby urządzenia każdego dnia sprawnie działały.
        </p>

        <h2>Usługi dzierżawy kserokopiarek w Krakowie</h2>
        <p>
            W naszym krakowskim oddziale oferujemy kompleksowe usługi dzierżawy kserokopiarek. Jest to doskonałe rozwiązanie dla firm i instytucji, które chcą zoptymalizować koszty związane z drukiem oraz cieszyć się niezawodnym i profesjonalnym wsparciem serwisowym. 
            Dzierżawa kserokopiarek pozwala na korzystanie z nowoczesnych urządzeń bez konieczności ponoszenia dużych nakładów finansowych na ich zakup.
        </p>
        <p>
            Nasi eksperci pomogą dobrać odpowiednią kserokopiarkę do potrzeb Twojej firmy, a także zapewnią fachowe doradztwo w zakresie optymalizacji procesów drukowania. 
            Dzierżawa kserokopiarki w Krakowie to gwarancja stałego dostępu do najnowszych technologii, a także możliwość elastycznej zmiany parametrów umowy w razie potrzeby.
        </p>
        <p>
            W ramach usług dzierżawy kserokopiarek w Krakowie oferujemy również pełne wsparcie serwisowe, które obejmuje cykliczne przeglądy techniczne, naprawy oraz wymianę części eksploatacyjnych. 
            Dzięki temu masz pewność, że wynajmowane urządzenie będzie działało sprawnie przez cały okres dzierżawy.
        </p>
        <p>
            Zapraszamy do skorzystania z naszej oferty dzierżawy kserokopiarek w Krakowie! Gwarantujemy atrakcyjne warunki finansowe oraz profesjonalne wsparcie na każdym etapie współpracy.
        </p>
    `,
    metaTitle: 'Kserokopiarki Kraków - Serwis i dzierżawa - DKS',
    metaDescription: '',
    address: 'ul. Bursztynowa 2, 31-213 Kraków',
    phone: '12 357 25 25',
    email: 'info.krakow@dks.pl',
    offerTab: 'W naszej ofercie znajdziesz urzuądzenia do druku w biurze A4 i A3, urządzenia do druku produkcyjnego, urządzenia introligatorskie, a także niszczarki. W skład naszego portfolio wchodzą kserokopiarki, drukarki cyfrowe czy skanery wielkoformatowe. Dzięki szerokiemu wachlarzowi asortymentu, oferowane przez nas produkty, rozwiązania jak i usługi mają na celu efektywne zaspokojenie indywidualnych potrzeb naszych Klientów. Dzierżawa kserokopiarek, którą oferujemy łączy się z wieloma zaletami, dzięki tej usłudze zapewniamy wysokiej jakości druk monochromatyczny oraz kolorowy, cykliczne przeglądy urządzeń, fachowy serwis oraz niskie ceny wykonanych kopii. Fundamentem naszej firmy jest długoletnie doświadczenie, profesjonalizm, szybkość działania i elastyczne podejście do każdego klienta indywidualnie. Zachęcamy do kontaktu z naszym warszawskim oddziałem – zaoferujemy korzystne warunki wynajmu i pomożemy dobrać urządzenie spełniające Twoje wymagania, a w czasie trwania kontraktu będziemy dbali, aby urządzenia każdego dnia sprawnie działały.',
    leaseTab: 'Działamy na rynku już prawie trzy dekady, dlatego pozwalamy sobie oferować naszym Klientom naszym zdaniem najwygodniejszą opcję użytkowania sprzętu drukującego jaką jest dzierżawa. Klient płaci jedynie za pojedyncze kopie, a my dbamy o całą resztę. Zapewniamy wymianę urządzeń po upływie okresu umowy lub w czasie jej trwania, jeżeli zajdzie potrzeba wymiany urządzenia na bardziej wydajnego, jak najbardziej jesteśmy w stanie zrobić taką wymianę. Dzięki takiemu rozwiązaniu jesteśmy w stanie idealnie dopasować urządzenia drukujące do aktualnych potrzeb Klienta. Nasz zespół Doradców Handlowych obsługuje klientów z całego województwa mazowieckiego. Mamy podpisane umowy z podmiotami z takich miast jak Pruszków, Piaseczno, Łomianki, Legionowo, Marki. Zachęcamy do podjęcia współpracy z naszym oddziałem w Warszawie. Możesz skontaktować się z nami w łatwy sposób poprzez wypełnienie formularza zgłoszeniowego na stronie „szybki kontakt”. Zapraszamy do kontaktu.',
    photocopiersTab: 'Jesteśmy Autoryzowanym Dystrybutorem i Serwisem Canon, Konica Minolta, Lexmark, HP. Prezentujemy bardzo szeroką ofertę produktów związanych z drukiem cyfrowym i przetwarzaniem obrazu, które można kupić lub wynająć. W naszej ofercie znajdują się nowe i poleasingowe urządzenia do drukowania, skanowania, kopiowania i przesyłania dokumentów. Proponujemy również materiały eksploatacyjne oraz części zamienne takich marek jak: Canon, Konica Minolta, Ricoh, OKI, Toshiba, HP i wielu innych. Naszą bogatą ofertę dopełnia oprogramowanie. Wdrażamy i szkolimy z systemów druku, które świetnie się sprawdzają w organizacjach biznesowych, które realnie wpływają na zmniejszenie kosztów druku, monitorują wydruki, a także przyczyniają się do zwiększenia wydajności pracy na urządzeniach.',
    serviceTab: 'Proponujemy podpisanie umowy dzierżawy lub samej umowy serwisowej, dlaczego? Ponieważ to na nas spada cała opieka nad urządzeniem. Zapewniamy pełen serwis w zamian za rozliczenie za każdą kopię. Dzięki takiemu rozwiązaniu masz pełną kontrolę nad wydatkami. Długoletnia współpraca ze światowymi liderami takimi jak Canon, Konica Minolta, Lexmark, HP procentuje bardzo dobrze wykwalifikowaną kadrą Serwisantów, którzy na bieżąco odbywają szkolenia i kursy. Wychodząc na przeciw oczekiwaniom Klienta, aby możliwie usprawnić i przyśpieszyć szybkość przyjmowania zleceń, rozbudowaliśmy nasz dział Obsługi Klienta, w którym od poniedziałku do piątku, w godzinach 8:00 - 16:00 rozwiązywane są wszelkie tematy.',
    salesContact: {
      phones: ['12 357 25 25'],
      emails: ['info.krakow@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.krakow@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2559.725711769673!2d19.9445147157184!3d50.09142207942742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47165af671d23ef9%3A0xb94178b70baf2f0!2sBursztynowa%202%2C%2031-213%20Krak%C3%B3w!5e0!3m2!1spl!2spl!4v1651134885838!5m2!1spl!2spl',
  },
  {
    name: 'szczecin',
    fullName: 'DKS Sp. z o.o. Oddział Szczecin',
    img: '//static/departments/szczecin.webp',
    href: '/oddzialy/szczecin',
    title: 'Kserokopiarki premium i urządzenia biurowe w Szczecinie',
    description: `<p>Nasz oddział przy ul. Lelewela 8a oferuje największy wybór <strong> kserokopiarek</strong>. Zajmujemy się sprzedażą, serwisem i wynajmem nowych i używanych kserokopiarek, drukarek, ploterów, skanerów, urządzeń wielofunkcyjnych. Sprzedajemy też materiały eksploatacyjne. Dostarczamy nowe i <a title="używane kserokopiarki" href="https://www.dks.pl/oferta/rozwiazania-dla-biura/" target="_self">używane kserokopiarki</a> wielofunkcyjne o potwierdzonym w trakcie szczegółowego przeglądu stanie technicznym. Niezależnie od tego, czy wybierzesz maszynę nową czy poleasingową, możesz zdecydować się na zakup lub dzierżawę. </p>
                  <p>Wybierając dowolne <strong>urządzenia biurowe w DKS</strong>, masz zapewniony serwis. Gwarantujemy szybką reakcję na zgłoszenie i krótkie terminy wykonania napraw. Nasz zespół handlowców obsługuje zgłoszenia z całego województwa zachodniopomorskiego. Realizujemy usługi na rzecz Klientów z Koszalina, Kołobrzegu, Kostrzyna nad Odrą, Gorzowa, Stargardu.</p>
                  <h2>Plotery wielkoformatowe i drukarki produkcyjne </h2>
                  <p>Od trzech dekad dostarczamy profesjonalne urządzenia kopiujące, drukujące i skanujące. <strong>Oprócz maszyn biurowych oferujemy także drukarki produkcyjne i plotery do szerokiego formatu</strong> oraz <a title="sprzęt poligraficzny" href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" target="_self">sprzęt poligraficzny</a> dla drukarń, zakładów usługowych i agencji kreatywnych. Dzięki współpracy ze światowymi liderami w produkcji urządzeń drukujących, w tym z markami Canon, Konica Minolta, HP, Lexmark, Contex czy OKI, stwarzamy możliwość wyboru floty drukującej, która będzie optymalnie dopasowana do Twoich potrzeb.</p>
                  <p>Możesz zgłosić się z pytaniem dotyczącym każdego produktu znajdującego się w naszej ofercie. Serwisujemy wszystkie sprzedawane drukarki i kserokopiarki. Przyjmujemy też zgłoszenia dotyczące dowolnej cyfrowej maszyny drukującej.</p>
                  <h2>Dlaczego warto skorzystać z wynajmu kserokopiarek w Szczecinie?</h2>
                  <p>
                      Korzystanie z wynajmu kserokopiarek w Szczecinie przynosi wiele korzyści dla przedsiębiorców i osób prywatnych. Oto kilka powodów, dla których warto rozważyć takie rozwiązanie:
                  </p>
                  <ul>
                      <li><strong>Oszczędność kosztów:</strong> Wynajem kserokopiarek pozwala na uniknięcie dużych wydatków związanych z zakupem nowego urządzenia. Płacąc niewielką opłatę miesięczną, można korzystać z wysokiej jakości sprzętu bez konieczności ponoszenia dużych kosztów na początek.</li>
                      <li><strong>Elastyczność:</strong> Wynajem kserokopiarek w Szczecinie umożliwia dostosowanie umowy do indywidualnych potrzeb klienta. Można wynająć urządzenie na krótki lub na dłuższy okres czasu, w zależności od potrzeb.</li>
                      <li><strong>Szybki serwis:</strong> W przypadku awarii wynajętej kserokopiarki, firma oferująca wynajem drukarek w Szczecinie zapewnia szybką pomoc serwisową, co pozwala na minimalizację przestojów w pracy.</li>
                      <li><strong>Aktualizacja sprzętu:</strong> Korzystając z wynajmu kserokopiarek, można regularnie wymieniać urządzenia na nowsze modele, co pozwala na korzystanie z najnowszych technologii i funkcji.</li>
                      <li><strong>Brak obciążenia kapitału:</strong> Wynajem kserokopiarek pozwala na uniknięcie związania dużych sum pieniędzy w sprzęt, co pozwala na lepsze zarządzanie kapitałem.</li>
                  </ul>
                  <p>
                      Wynajem kserokopiarek w Szczecinie to doskonałe rozwiązanie dla tych, którzy chcą skorzystać z zaawansowanych urządzeń biurowych bez konieczności ponoszenia dużych wydatków. Dzięki elastycznym warunkom umowy, szybkiemu serwisowi i możliwości korzystania z najnowszych technologii, wynajem drukarek w Szczecinie staje się coraz bardziej popularny wśród przedsiębiorców i osób prywatnych.
                  </p>
                  `,
    metaTitle: 'Urządzenia biurowe, kserokopiarki premium, plotery – DKS Szczecin',
    metaDescription: 'W DKS w zaopatrzysz się w urządzenia biurowe, kserokopiarki premium i skanery. Dostarczamy plotery wielkoformatowe i maszyny poligraficzne. Oferta na stronie.',
    address: 'ul. Lelewela 8a, 71-154 Szczecin',
    phone: '91 887 60 33',
    email: 'info.szczecin@dks.pl',
    offerTab: 'Zajmujemy się sprzedażą, serwisem i wynajmem nowych, używanych, poleasingowych: kserokopiarek, drukarek, urządzeń wielofunkcyjnych, ploterów, skanerów, systemów wielofunkcyjnych. Sprzedajemy materiały eksploatacyjne. Oferujemy również oprogramowanie do zarządzania środowiskiem wydruku. Dzięki współpracy ze światowymi liderami w branży druku: Canon, Konica Minolta, Hp, Lexmark, Contex, Oki dajemy możliwość wyboru urządzenia, które będzie dopasowane optymalnie do wszystkich potrzeb. Cenimy sobie dobrą współpracę, najważniejsza jest satysfakcja klienta. Potrzebujesz urządzenia drukującego, ale nie wiesz od czego zacząć? Skontaktuj się z nami, chętnie pokażemy Ci czego można się spodziewać, jak wyglądają nasze usługi i ile możesz zaoszczędzić dzięki naszym sprawdzonym wdrożeniom.',
    leaseTab: 'Dzierżawa (wynajem) jest coraz chętniej wybieraną formą korzystania z urządzeń do druku, ponieważ niesie ona wiele korzyści względem tradycyjnego zakupu. Po pierwsze płacisz tylko za wykonanie kopie lub wydruki. Po drugie nie trzeba inwestować jakichkolwiek środków. Po trzecie nie musisz martwic się o nieprzewidziane wydatki powiązane z zakupem tonerów, czy bębnów, ponieważ dostajesz kompletną maszynę. I po czwarte w razie jakiejkolwiek usterki gwarantujemy szybką reakcję serwisu, za którą nic nie płacisz. Po instalacji urządzenia przeszkolimy również wybrane osoby i w razie potrzeby pozostajemy do dyspozycji. Jeżeli chcesz poznać szczegóły, zapraszamy do naszego oddziału w Szczecinie, nasi Doradcy Handlowi wszystko jasno przedstawią.',
    photocopiersTab: 'Posiadamy autoryzację takich marek jak: Canon, Konica Minolta, HP, Lexmark, Contex, KIP. W naszej ofercie znajdują się kserokopiarki, drukarki, urządzenia wielofunkcyjne, niszczarki, plotery, skanery, drukarki wielkoformatowe. Sprzedajemy materiały eksploatacyjne m.in.: tonery, tusze, developery, bębny, części zamienne. Proponujemy również oprogramowanie, aby w pełni zarządzać wydrukiem, minimalizować koszty i zapewnić bezpieczeństwo. Maszyny są nowe, używane, poleasingowe, monochromatyczne lub drukujące w kolorze. W celu uzyskania najlepszej oferty zapraszamy do kontaktu z naszym oddziałem w Szczecinie.',
    serviceTab: 'Świadczymy profesjonalny serwis kserokopiarek, drukarek, urządzeń wielofunkcyjnych do drukowania, kopiowania i skanowania. Jesteśmy autoryzowanym partnerem m.in.: Canon, Konica Minolta, HP, Lexmark, dzięki czemu nasi inżynierowie serwisu odbywają regularne szkolenia, co owocuje tym, iż są oni specjalistami w dziedzinie naprawy sprzętu drukującego. Gwarantujemy wieloletnie bezpieczeństwo pracy urządzeń za czym idzie wysoka jakość wydruków, a to wszystko zyskujesz płacąc jedynie za wykonane wydruki i kopie. Oczekujesz szybkiej i bezproblemowej naprawy swojego urządzenia? Jesteśmy do Twojej dyspozycji, wystarczy się z nami skontaktować, a my zadbamy o resztę.',
    salesContact: {
      phones: ['91 887 60 33'],
      emails: ['info.szczecin@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.szczecin@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2378.527633283127!2d14.539864115840647!3d53.40538927999142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47aa08e50f2fc87d%3A0xf049838cbaffe539!2sTama%20Pomorza%C5%84ska%2014E%2C%2071-899%20Szczecin!5e0!3m2!1spl!2spl!4v1651135008927!5m2!1spl!2spl',
  },
  {
    name: 'bydgoszcz',
    fullName: 'DKS Sp. z o.o. Oddział Bydgoszcz',
    img: '//static/departments/bydgoszcz.webp',
    href: '/oddzialy/bydgoszcz',
    title: 'Kserokopiarki i urządzenia biurowe w Bydgoszczy ',
    description: `<p>Staramy się być jak najbliżej Klienta, dbamy o łatwy dostęp do oferowanych usług. Stworzona przez nas sieć oddziałów pozwala na szybką reakcję na zapytania i zgłoszenia. Jeżeli potrzebujesz szybko kupić lub wynająć <strong>kserokopiarki</strong>, udaj się do naszego oddziału. Oferujemy <a title="urządzenia wielofunkcyjne A3" href="https://www.dks.pl/oferta/rozwiazania-dla-biura/" target="_blank" rel="noopener">urządzenia wielofunkcyjne A3</a> i A4, kolorowe i monochromatyczne drukarki renomowanych marek – Konica Minolta, Canon, Lexmark, HP, Ricoh, Kyocera i innych. Chętnie doradzamy przy doborze maszyn drukujących, uwzględniając indywidualne preferencje każdego kontrahenta.</p>
                  <p>Nasz zespół handlowców obsługuje Klientów z całego województwa kujawsko-pomorskiego. Mamy podpisane umowy z podmiotami z takich miast jak Toruń, Włocławek, Grudziądz, Inowrocław, Świecie. Kupując lub wynajmując u nas wielofunkcyjne <strong>urządzenia biurowe</strong>, otrzymasz pełne wsparcie merytoryczne i techniczne. W zakresie naszych usług znajduje się sprzedaż, wynajem i <a title="serwis kserokopiarek" href="https://www.dks.pl/zgloszenie-serwisowe" target="_blank" rel="noopener">serwis kserokopiarek</a> oraz naprawa innych maszyn drukujących.</p>
                  <h2>Nowy i używany sprzęt drukujący dopasowany do potrzeb</h2>
                  <p>Współpracujemy ze światowymi liderami w dziedzinie druku. Dzięki temu jesteśmy w stanie precyzyjnie dobrać urządzenia odpowiadające konkretnym potrzebom. Innej maszyny potrzebujesz do druku faktur i instrukcji, a innej do ulotek, broszur czy plakatów. Często do druku nie potrzebujesz koloru: do tworzenia większości dokumentów firmowych idealne będą <a title="drukarki laserowe czarno-białe" href="https://www.dks.pl/oferta" target="_blank" rel="noopener">drukarki laserowe czarno-białe</a>. Dzięki nim obniżysz znacząco koszty, a jednocześnie zachowasz wysoką jakość i wartość biznesową dokumentów.</p>
                  <p>Istnieje bardzo wiele specyficznych wymagań, które zaspokajają bardzo różne urządzenia drukujące. Jednak wystarczy, że powiesz nam, co chcesz zrobić i jaki masz budżet, a my zajmiemy się całą resztą. <strong>Dobierzemy optymalny model nowego lub używanego urządzenia drukującego</strong>, uwzględniając Twoje potrzeby odnośnie do ilości i jakości tworzonych dokumentów. Kluczowe znaczenie ma wysokość nakładu i format dokumentów. Przy druku setek tysięcy stron miesięcznie najlepiej sprawdzą się <a title="drukarki poligraficzne" href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" target="_blank" rel="noopener">drukarki poligraficzne</a>. Jeżeli natomiast drukujesz duże ilości plakatów w krótkich seriach, to ekonomicznym wyborem będzie ploter wielkoformatowy.</p>
                  <p>Gdy nie masz pewności, jakie urządzenia wybrać, skorzystaj z naszej oferty audytorskiej. Przeanalizujemy środowisko druku w Twojej firmie i dobierzemy najlepszą flotę urządzeń do druku. Pomożemy podnieść wydajność Twojego biura – praca stanie się wygodniejsza i wydajniejsza.</p>
                  <h2>Oferta kserokopiarek w Bydgoszczy</h2>
                  <p>
                      Potrzebujesz jednej kserokopiarki, a może całego parku maszyn? Nasza oferta jest bardzo szeroka. 
                      Współpracujemy ze światowymi liderami w dziedzinie druku: Canon, Konica Minolta, HP, Lexmark, dzięki czemu jesteśmy w stanie dobrać urządzenia odpowiadające konkretnym potrzebom. 
                      Powiedz nam, do czego chcesz wykorzystywać urządzenia drukujące – czy do druku faktur, instrukcji, a może ulotek, broszur lub plakatów? 
                      Czy będą przeważały wydruki w kolorze, czy raczej czarno-białe? Jakie opcje są dla Ciebie istotne – tylko drukowanie czy również skanowanie? 
                  </p>
                  <p>
                      Dzięki precyzyjnemu audytowi dobierzemy najlepszą flotę urządzeń do druku, co podniesie wydajność Twojego biura. Praca stanie się wygodniejsza i bardziej efektywna.
                  </p>
                  <h2>Jakie są rodzaje kserokopiarek?</h2>
                  <p>
                      Rodzaje kserokopiarek można podzielić ze względu na różne kryteria, takie jak wielkość, funkcje, technologia druku czy prędkość drukowania. Oto kilka podstawowych rodzajów kserokopiarek:
                  </p>
                  <ul>
                      <li>
                          <strong>Kserokopiarki monochromatyczne i kolorowe:</strong> Monochromatyczne kserokopiarki drukują tylko w odcieniach szarości, natomiast kolorowe pozwalają na drukowanie pełnej gamy kolorów.
                      </li>
                      <li>
                          <strong>Kserokopiarki wielofunkcyjne:</strong> Wielofunkcyjne urządzenia łączą w sobie funkcje drukowania, skanowania, kopiowania i faksowania.
                      </li>
                      <li>
                          <strong>Kserokopiarki A3 i A4:</strong> Te kserokopiarki różnią się przede wszystkim obsługiwaniem formatów papieru. 
                          Kserokopiarki A4 obsługują standardowy format papieru (210x297 mm), natomiast kserokopiarki A3 pozwalają na drukowanie na większych arkuszach (297x420 mm).
                      </li>
                      <li>
                          <strong>Kserokopiarki o różnej prędkości drukowania:</strong> Prędkość drukowania mierzy się w stronach na minutę (ppm) i może się różnić w zależności od modelu kserokopiarki.
                      </li>
                  </ul>
                  <p>
                      Przy wyborze odpowiedniej kserokopiarki warto uwzględnić indywidualne potrzeby firmy oraz rodzaj i ilość dokumentów, które będą drukowane. 
                      Dobrze dobrana kserokopiarka pozwoli na oszczędność czasu i zasobów, a także zapewni wysoką jakość wydruków.
                  </p>
                  `,
    metaTitle: 'Kserokopiarki i urządzenia biurowe nowe i używane – DKS Bydgoszcz',
    metaDescription: 'Jeżeli chcesz kupić lub wynająć sprzęt biurowy, zapraszamy do oddziału DKS. Oferujemy nowe i używane drukarki i kserokopiarki wielofunkcyjne. Sprawdź ofertę.',
    phone: '52 515 41 00',
    email: 'info.bydgoszcz@dks.pl',
    offerTab: 'Potrzebujesz jedną kserokopiarkę, a może cały park maszyn? Nasza oferta jest bardzo szeroka, współpracujemy ze światowymi liderami w dziedzinie druku: Canon, Konica Minolta, Hp, Lexmark, dzięki czemu jesteśmy w stanie dobrać urządzenia odpowiadające konkretnym potrzebnym. Powiedz nam do czego chcesz wykorzystywać urządzenia drukujące, czy do druku faktur, instrukcji, może do druku ulotek, broszur, plakatów? Czy będą przeważały wydruki w kolorze czy raczej czarno-białe. Jakie opcje są dla Ciebie istotne, czy tylko drukowanie, czy również skanowanie. Dzięki precyzyjnemu audytowi dobierzemy najlepszą flotę urządzeń do druku, co podniesie wydajność Twojego biura, praca stanie się wygodniejsza i wydajniejsza.',
    leaseTab: 'Zakup kserokopiarek, drukarek czy urządzeń wielofunkcyjnych do druku wiąże się z niemałym wydatkiem, więc aby nie nadwyrężać budżetu proponujemy dzierżawę tych produktów. Nie kupujesz urządzenia na stałe, a jedynie użytkujesz przez jakiś czas, dzięki temu, gdy poczujesz, że brakuje Ci jakichś funkcji, lub jest ich za dużo, ponieważ z nich nie korzystasz, możesz wymienić urządzenie na najbardziej odpowiadające twoim wymaganiom. Możesz być również spokojny o wydatki, ponieważ jedynym i przewidzianym kosztem jest opłata za kopie i wydruki. W razie awarii zapewniamy szybką reakcję serwisu. Nasz technik podczas instalacji maszyny wdraża zawsze wybrane osoby, które mogą liczyć na wsparcie także podczas trwania umowy. Więcej informacji uzyskasz kontaktując się z naszym oddziałem w Bydgoszczy, Doradcy Handlowi chętnie odpowiedzą na wszelkie pytania.',
    photocopiersTab: 'Różne marki, różne wielkości i formaty maszyn – dzięki różnorodności marek i modeli u nas znajdziesz idealne urządzenie dla siebie i swojego biznesu. W skład oferty wchodzą urządzenia do druku takich producentów jak: Canon, Konica Minolta, HP, Lexmark, Contex, Oki, KIP, es-te. Czarno białe i kolorowe drukarki i kserokopiarki, plotery oraz skanery, a także składarki. Urządzenia posiadamy zarówno nowe jak i używane, poleasingowe. Kserokopiarki, jak i maszyny produkcyjne można kupić lub wynająć. W trakcie trwania umowy najmu lub umowy serwisowej zapewniamy regularne przeglądy oraz działania konserwacyjne urządzeń, dostarczamy materiały eksploatacyjne, a także zapewniamy wsparcie naszych specjalistów. W celu uzyskania najlepszej oferty zapraszamy do kontaktu z naszym oddziałem w Bydgoszczy.',
    serviceTab: 'Posiadamy oddziały w 12 miejscach w Polsce, a w każdym oddziale znajduje się magazyn z częściami, dzięki czemu zapewniamy profesjonalny serwis kserokopiarek, drukarek, urządzeń wielofunkcyjnych do drukowania, skanowania i kopiowania. Jesteśmy autoryzowanym partnerem m.in.: Canon, Konica Minolta, HP, Lexmark. Współpraca ta pozwala na regularne szkolenia naszych Inżynierów serwisu, dzięki czemu są oni wyspecjalizowani w temacie naprawy urządzeń drukujących. Wchodząc z nami w współpracę, przekazujesz nam opiekę nad swoimi urządzeniami. Po instalacji oprogramowania, przychodzą do nas alerty o wymianie tonera, przykładowo zostało mniej niż 15%, dzięki czemu nie tworzą się przestoje w oczekiwaniu na nowy toner, a praca kserokopiarki czy drukarki jest płynna.',
    salesContact: {
      phones: ['52 515 41 00'],
      emails: ['info.bydgoszcz@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.bydgoszcz@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2394.4129127901697!2d18.029707115829943!3d53.12073297993238!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4703138c6aa27137%3A0xa3e7e9196d666123!2sJagiello%C5%84ska%2094c%2C%2085-097%20Bydgoszcz!5e0!3m2!1spl!2spl!4v1651135175999!5m2!1spl!2spl',
  },
  {
    name: 'olsztyn',
    fullName: 'DKS Sp. z o.o. Oddział Olsztyn',
    img: '//static/departments/olsztyn.webp',
    href: '/oddzialy/olsztyn',
    title: 'Urządzenia biurowe i kserokopiarki klasy premium w Olsztynie',
    description: `<p>Jeżeli interesuje Cię zakup lub dzierżawa <strong>kserokopiarki</strong>, skorzystaj z oferty naszego oddziału. Na tle konkurencji wyróżniamy się doświadczeniem i zasięgiem. Rozwijamy się dynamicznie od trzech dekad. Mamy 12 oddziałów w całej Polsce. Dostarczamy kserokopiarki i urządzenia biurowe klasy premium wyłącznie od renomowanych producentów. W naszej ofercie znajdziesz urządzenia biurowe, <a title="sprzęt poligraficzny" href="https://www.dks.pl/oferta/rozwiazania-dla-poligrafii" target="_self">sprzęt poligraficzny</a> i drukarki wielkoformatowe. Oferowane przez nas marki to HP, Lexmark, Konica Minolta, Canon, KIP, Contex, OKI, Es-Te, Ricoh, Kyocera.</p>
                  <p>Uzupełnieniem naszej oferty są materiały eksploatacyjne, a także oprogramowanie do zarządzania drukiem. Szeroki asortyment produktów pozwala na dobór najlepszego sprzętu dla Twojej firmy. Otrzymasz fachową poradę w kwestii wyboru i eksploatacji. Zatrudniani przez nas specjaliści odbywają regularne szkolenia, co czyni ich ekspertami w dziedzinie druku. Wystarczy krótka rozmowa i opis oczekiwań, abyśmy mogli zaproponować optymalne urządzenie dla Twojej firmy.</p>
                  <h2>Dzierżawa urządzeń drukujących</h2>
                  <p>Nie tylko zakup, ale także <strong>dzierżawę urządzeń biurowych</strong>, warto zrealizować we współpracy z naszym oddziałem. Oferujemy klarowne umowy, a warunki wynajmu dopasowujemy do indywidualnych potrzeb Klienta. Znajdziesz u nas maszyny nowe oraz używane, które zostały starannie sprawdzone i są w pełni sprawne technicznie. </p>
                  <p>Niezależnie od tego, czy zdecydujesz się na nowe czy używane urządzenie, możesz korzystać z naszych usług serwisowych. Obejmują one zarówno drukarki nowe, w okresie gwarancji, jak i używane, których gwarancja już nie dotyczy. Nasz zespół handlowców obsługuje Klientów z całego województwa warmińsko-mazurskiego. Mamy podpisane umowy z Klientami w Elblągu, Ostródzie, Iławie, Ełku, Nowym Mieście Lubawskim.</p>
                  <h2>Oferta kserokopiarek</h2>
                  <p>
                      Nasza oferta obejmuje sprzedaż, najem oraz serwis urządzeń do druku takich jak: drukarki, kserokopiarki, plotery, skanery, urządzenia produkcyjne i wielkoformatowe. Uzupełnieniem są materiały eksploatacyjne, a także oprogramowanie do zarządzania drukiem. 
                  </p>
                  <p>
                      Szeroki asortyment produktów pozwala na dobór najlepszego sprzętu dla Twojej firmy. Współpracujemy ze światowymi liderami w tej dziedzinie, dzięki czemu nasi serwisanci jaki i handlowcy odbywają regularne szkolenia, co czyni ich specjalistami w dziedzinie druku. Znajdziesz u nas maszyny nowe oraz używane. 
                  </p>
                  <p>
                      Powiedz nam czego potrzebujesz, a my chętnie podpowiemy, który model będzie najlepszy dla Twojego biura.
                  </p>

                  <h2>Jakie są zalety kserokopiarek?</h2>
                  <p>
                      Kserokopiarki to niezbędne urządzenia w wielu biurach, które przynoszą wiele korzyści. Oto kilka zalet korzystania z kserokopiarek:
                  </p>
                  <ul>
                      <li><strong>Szybkość i wydajność:</strong> Kserokopiarki potrafią wykonać wiele kopii dokumentów w krótkim czasie, co przekłada się na większą wydajność pracy biurowej.</li>
                      <li><strong>Oszczędność czasu:</strong> Dzięki kserokopiarkom można szybko i łatwo wykonać kopie dokumentów, co pozwala pracownikom skupić się na innych zadaniach.</li>
                      <li><strong>Jakość kopii:</strong> Nowoczesne kserokopiarki oferują wysoką jakość kopii, co sprawia, że trudno odróżnić oryginał od kopii.</li>
                      <li><strong>Wielofunkcyjność:</strong> Wiele kserokopiarek posiada dodatkowe funkcje, takie jak skanowanie, drukowanie oraz faksowanie, co sprawia, że są one praktycznym rozwiązaniem dla biur.</li>
                      <li><strong>Łatwość obsługi:</strong> Kserokopiarki są zazwyczaj proste w obsłudze, co pozwala pracownikom szybko nauczyć się korzystać z urządzenia.</li>
                  </ul>
                  <p>
                      Korzystając z naszej oferty kserokopiarek w Olsztynie, masz pewność, że otrzymasz urządzenia najwyższej jakości, które przyczynią się do zwiększenia wydajności pracy w Twoim biurze.
                  </p>
                  `,
    metaTitle: 'Urządzenia biurowe premium: nowe i poleasingowe – DKS Olsztyn',
    metaDescription: 'Oferujemy nowe i poleasingowe urządzenia biurowe klasy premium, kserokopiarki i laserowe drukarki wielofunkcyjne cenionych marek. Szczegóły oferty na stronie.',
    address: 'ul. Herberta 18/16, 10-686 Olsztyn',
    phone: '89 652 16 00',
    email: 'info.olsztyn@dks.pl',
    offerTab: 'Nasza oferta obejmuje sprzedaż, najem oraz serwis urządzeń do druku takich jak: drukarki, kserokopiarki, plotery, skanery, urządzenia produkcyjne i wielkoformatowe. Uzupełnieniem są materiały eksploatacyjne, a także oprogramowanie do zarządzania drukiem. Szeroki asortyment produktów pozwala na dobór najlepszego sprzętu dla Twojej firmy. Współpracujemy ze światowymi liderami w tej dziedzinie, dzięki czemu nasi serwisanci jaki i handlowcy odbywają regularne szkolenia, co czyni ich specjalistami w dziedzinie druku. Znajdziesz u nas maszyny nowe oraz używane. Powiedź nam czego potrzebujesz, a my chętnie podpowiemy, który model będzie najlepszy dla Twojego biura.',
    leaseTab: 'Zazwyczaj dzierżawa kserokopiarek jest tańszym rozwiązaniem niż jej zakup. Nie musisz inwestować środków własnych na zakup. Jedynym wydatkiem będą comiesięczne opłaty za wydruki. W zamian otrzymujesz opiekę serwisu, wymianę części i materiałów eksploatacyjnych. Jedyną rzeczą o którą musisz się sam zatroszczyć, to uzupełnianie stanu papieru, a cała reszta spoczywa na naszych barkach. Dzięki rozbudowanej sieci oddziałów i magazynów (12 w całym kraju) posiadamy podstawowe materiały eksploatacyjne i części na miejscu, dzięki czemu większość usterek, awarii można usunąć w bardzo krótki czasie. Nasz Dział Obsługi Klienta otwarty jest dla Państwa w godz. 8:00-16:00, a koordynatorzy serwisu czuwają, aby każda zgłoszona usterka była jak najszybciej naprawiona. Serdecznie zapraszamy do naszego oddziału w Olsztynie, gdzie nasi specjaliści pomogą w doborze najlepszego sprzętu, które spełni wszystkie oczekiwania, a przy tym będzie ekonomiczny.',
    photocopiersTab: 'Multibrandowa, tak można określić naszą ofertę, posiadamy produkty takich marek jak Canon, Konica Minolta, HP, Lexmark, es-te, Oki, Contex i inne. U nas kupisz lub wynajmiesz maszyny nowe lub używane, poleasingowe. Posiadamy zarówno urządzenia kolorowe jak i czarno-białe. W asortymencie posiadamy drukarki, urządzenia wielofunkcyjne do druku, potocznie nazywane kserokopiarkami, plotery, skanery, składarki, urządzenia do druku mało i wielkoformatowe. Obsługujemy biura, a także drukarnie, agencje reklamowe, urzędy, firmy geodezyjne i inne. Oprócz zakupu lub wynajmu urządzenia, możliwy jest również wzięcie urządzenia w leasing. Po więcej informacji, zapraszamy do kontaktu.',
    serviceTab: 'Każde urządzenie, aby jak najdłużej sprawnie działało co jakiś czas powinno przejść przegląd serwisowy. Proponujemy podpisanie umowy serwisowej, w której tak samo jak przy wynajmie od nas maszyny, całościowy pakiet serwisowy jest objęty umową, płacisz jedynie za wydruki, kopie, nie dopłacając nic za serwis, wymianę części czy materiałów eksploatacyjnych. Dzięki takiemu rozwiązaniu nie zaskoczy Cię nieprzewidywany wydatek, który, im maszyna będzie starsza, tym może być wyższy. Kolejny ważny aspekt, to szybka reakcja serwisu, wystarczy wysłać zgłoszenie serwisowe za pomocą maila lub poprzez formularz zgłoszeniowy znajdujący się na naszej stronie, nie tracąc czasu na szukanie pomocy w sieci. Korzystamy z rozwiązań zapewniających zdalne monitorowanie urządzeń, które informują nas np. o potrzebie wymiany tonera, ponieważ ten, który jest w trakcie używania za pewien czas się skończy. Nasi technicy to wykwalifikowani, doświadczeni odbywający regularne szkolenia specjaliści.',
    salesContact: {
      phones: ['89 652 16 00'],
      emails: ['info.olsztyn@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.olsztyn@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2359.5695201945578!2d20.48800591585345!3d53.743741380064144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46e278bf1e884bb5%3A0xbc124e382176d90b!2sJarocka%2041B%2C%2011-041%20Olsztyn!5e0!3m2!1spl!2spl!4v1651135289295!5m2!1spl!2spl',
  },
  {
    name: 'rzeszow',
    fullName: 'DKS Sp. z o.o. Oddział Rzeszów',
    img: '//static/departments/rzeszow.webp',
    href: '/oddzialy/rzeszow',
    title: 'Kserokopiarki i urządzenia biurowe A4 i A3 w Rzeszowie ',
    description: `<p>Chcesz kupić lub wynająć <strong>urządzenia biurowe</strong>? Potrzebujesz fachowego doradztwa? Zależy Ci na tym, aby jak najszybciej zacząć użytkować sprzęt drukujący? A może zdarzyła się awaria i potrzebujesz natychmiastowej interwencji serwisowej? Niezależnie od tego, jaki sprzęt biurowy, poligraficzny czy wielkoformatowy użytkujesz lub zamierzasz użyć w swojej działalności biznesowej, zawsze możesz liczyć na nasze wsparcie merytoryczne i techniczne. Sprzedajemy, wynajmujemy i serwisujemy drukarki, <a title="urządzenia wielofunkcyjne A3" href="https://www.dks.pl/oferta/rozwiazania-dla-biura/" target="_self">urządzenia wielofunkcyjne A3</a> i A4, plotery wielkoformatowe i maszyny do druku produkcyjnego.</p>
                  <p>Dostarczamy <strong>nowe i używane urządzenia drukujące w formacie A4, A3, SRA3</strong>, które możesz kupić lub wziąć w dzierżawę na korzystnych warunkach. Oddział w Rzeszowie obsługuje interesantów z terenu całego województwa podkarpackiego. Świadczymy usługi na rzecz Klientów z Krosna, Mielca, Tarnobrzega, Stalowej Woli, Przemyśla. Zapewniamy bezzwłoczną odpowiedź na zgłoszenia serwisowe. Gwarantujemy fachowe i kompleksowe usługi, dostosowane do indywidualnych potrzeb każdego Klienta. Nasi pracownicy mają odpowiednie kwalifikacje, aby przyjąć najbardziej skomplikowane zlecenie.</p>
                  <h2>Kserokopiarka dopasowana do potrzeb Klienta</h2>
                  <p>Nabywając maszyny poligraficzne, drukarki wielkoformatowe czy biurowe <strong>kserokopiarki w DKS w Rzeszowie</strong> masz bardzo szeroki wybór marek i modeli. Oferujemy urządzenia takich firm, jak Canon, Konica Minolta, HP, Lexmark, Ricoh, KIP, Es-Te, OKI, Océ. Korzystając z naszych usług, nie musisz ograniczać swoich oczekiwań. Wspólnie znajdziemy urządzenie idealnie dopasowane do Twoich potrzeb. Możesz zaufać naszym handlowcom i serwisantom: odbywają regularne szkolenia u producentów, aby na bieżąco pogłębiać swoją wiedzę. Korzystając z ich rad i podpowiedzi, wykorzystasz maksymalnie posiadane fundusze i podniesiesz konkurencyjność usług i produktów.</p>
                  <h2>Rodzaje dostępnych w ofercie kserokopiarek</h2>
                  <p>
                      W naszej ofercie kserokopiarek w Rzeszowie znajdziesz szeroką gamę urządzeń, które zaspokoją potrzeby każdego klienta. 
                      Oferujemy zarówno kserokopiarki czarno-białe, jak i kolorowe, o różnych prędkościach druku oraz funkcjach dodatkowych. Wyróżniamy m.in. następujące rodzaje kserokopiarek:
                  </p>
                  <ul>
                      <li>
                          <strong>Kserokopiarki monochromatyczne</strong> - idealne do codziennego użytku w biurze, gdzie nie jest wymagane drukowanie w kolorze. 
                          Charakteryzują się szybkim drukiem i niższymi kosztami eksploatacji.
                      </li>
                      <li>
                          <strong>Kserokopiarki kolorowe</strong> - doskonałe dla firm, które potrzebują drukować materiały reklamowe, prezentacje czy dokumenty w wysokiej jakości kolorze.
                      </li>
                      <li>
                          <strong>Kserokopiarki wielofunkcyjne</strong> - łączą w sobie funkcje drukarki, skanera i faksu. Dostępne są zarówno w wersji czarno-białej, jak i kolorowej.
                      </li>
                      <li>
                          <strong>Kserokopiarki produkcyjne</strong> - dedykowane dla drukarni i firm zajmujących się profesjonalnym drukiem. 
                          Charakteryzują się dużą wydajnością, wysoką jakością druku oraz możliwością obsługi różnych formatów i gramatur papieru.
                      </li>
                      <li>
                          <strong>Kserokopiarki do dużych formatów</strong> - przeznaczone dla firm zajmujących się drukiem wielkoformatowym, np. plakatów, banerów czy map.
                      </li>
                  </ul>
                  <p>
                      Niezależnie od rodzaju kserokopiarki, w naszej ofercie znajdziesz urządzenia renomowanych producentów, które gwarantują niezawodność i wysoką jakość druku.
                  </p>
                  `,
    metaTitle: 'Kserokopiarki, urządzenia biurowe formatu A4 i A3 – DKS Rzeszów',
    metaDescription: 'Skorzystaj z oferty oddziału DKS Rzeszów i wyposaż swoją firmę w urządzenia biurowe, drukarki, kserokopiarki i skanery formatu A4 i A3. Szczegóły na stronie.',
    address: 'ul. Staromiejska 69, 35-231 Rzeszów',
    phone: '17 741 24 00',
    email: 'info.rzeszow@dks.pl',
    offerTab: 'Od drukarek, przez kserokopiarki A4 i A3, po maszyny produkcyjne, aż do wielkiego formatu- tak szeroka jest nasza oferta. Do wyboru mamy urządzenia światowej klasy producentów m.in.: Canon, Konica Minolta, Hp, Lexmark, Kip, es-te, Oki. Powiedź nam czego oczekujesz, a my przedstawimy najbardziej optymalne rozwiązania, tak, aby zminimalizować koszty i przyspieszyć wykonywanie czynności biurowych. W ofercie posiadamy maszyny nowe jak i poleasingowe. Nasi Handlowcy i serwisanci odbywają regularne szkolenia u naszych Partnerów, aby na bieżąco pogłębiać swoją wiedzę, by dobierać jak najlepsze urządzenia, które przyczynia się do rozwoju Twojego biznesu.',
    leaseTab: 'Drukowanie, kopiowanie, skanowanie, są to czynności, które na co dzień są wykonywane niemal wszędzie. Wiele wydruków jest zlecanych i drukowanych poza naszą firmą. Jeżeli jednak policzymy ile kosztuje nas drukowanie na zewnątrz, chociażby zlecenie wydruku instrukcji, to szybko dojdziemy do wniosku, że lepiej byłoby to robić u siebie. Co nas powstrzymuje? Zapewne wydanie jednorazowo dużej kwoty na urządzenie wielofunkcyjne. Dlatego wychodzimy z propozycją wynajmu maszyn, od drukarek, kserokopiarek, po duże maszyny wielkoformatowe. Dzięki tej opcji nie musisz nabywać urządzenia na stałe, nie musisz przejmować się nieprzewidzianymi kosztami, które mogą się pojawić przy awarii urządzenia, ponieważ płacisz jedynie za wykonane wydruki i uzupełniasz papier, a my zajmujemy się resztą. Zapraszamy do kontaktu.',
    photocopiersTab: 'Jeżeli szukasz sprawdzonych rozwiązań, które przyśpieszą i ułatwią szereg prac wykonywanych w biurach , to bardzo dobrze trafiłeś. Możemy zaproponować urządzenia drukujące dające wydruk czarno-biały jak i w kolorze, pozwalające na pracę w różnych formatach, czy różnych konfiguracjach. Oferujemy maszyny nowe, a także używane, poleasingowe. U nas znajdziesz urządzenia takie jak: drukarka, kserokopiarka A3 i A4, ale również plotery, skanery, urządzenia produkcyjne oraz wielkoformatowe. Zastanawiasz się, które urządzenie będzie najlepiej pasowało w Twoim biurze, jakie opcje powinno posiadać i jaką wielkość? Napisz, zadzwoń lub odwiedź nas w oddziale w Rzeszowie, a my przedstawimy najlepszą ofertę.',
    serviceTab: 'Dzięki sprawnie działające logistyce oraz koordynatorom nasz dział serwisu jest w stanie zjawić się do każdego wezwania najszybciej jak to możliwe. Kolejnym atutem, jest fakt, iż posiadamy 12 oddziałów w największych miastach Polski, a tym samym 12 magazynów, gdzie przechowywane są części zamienne do urządzeń, a także materiały eksploatacyjne, a to wszystko po to, aby jak najbardziej skrócić czas naprawy urządzenia. Dzięki temu, że jesteśmy autoryzowanym Dystrybutorem m.in.: Konica Minolta, Canon, Hp, Lexmark, nasi Serwisanci przechodzą regularne szkolenia, czerpiąc wiedzę od Specjalistów w swojej dziedzinie. Nie trać więcej czasu na dzwonienie i szukanie na cito serwisu, sprawdź nas i zapisz nasz numer na stałe. Zajmij się tym co robisz najlepiej, a my zajmiemy się Twoimi urządzeniami.',
    salesContact: {
      phones: ['17 741 24 00'],
      emails: ['info.rzeszow@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.rzeszow@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.340935613885!2d21.992884615717294!3d50.06117637942357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473cfb38c371ed67%3A0x3fa99c22abd5715b!2sStaromiejska%2069%2C%2035-231%20Rzesz%C3%B3w!5e0!3m2!1spl!2spl!4v1651135416372!5m2!1spl!2spl',
  },
  {
    name: 'bialystok',
    fullName: 'DKS Sp. z o.o. Oddział Białystok',
    img: '//static/departments/bialystok.webp',
    href: '/oddzialy/bialystok',
    title: 'Kserokopiarki biznesowe i urządzenia biurowe w Białymstoku',
    description: `<p>Planując zakupić lub wydzierżawić <strong>urządzenia biurowe</strong>, postaw na współpracę z doświadczonym dostawcą. Działamy w branży poligraficznej i kserograficznej od trzech dekad, świadcząc usługi na światowym poziomie. Dostarczamy nowe i używane urządzenia biurowe, drukujące w kolorze i monochromatyczne, pracujące w formacie A4, A3 i SRA3. </p>
                  <p>Zaopatrujemy naszych Klientów w <strong>sprzęt drukujący</strong> najwyżej cenionych marek: Canon, Konica Minolta, HP, Lexmark, Kyocera, Ricoh. Posiadając w ofercie dziesiątki modeli <a title="urządzeń wielofunkcyjnych do biura" href="https://www.dks.pl/oferta/rozwiazania-dla-biura/">urządzeń wielofunkcyjnych do biura</a>, możemy stworzyć dla Ciebie bardzo wydajną flotę maszyn drukujących. Nasi Klienci są bardzo zróżnicowani: obsługujemy punkty usługowe, urzędy, szkoły, drukarnie, agencje reklamowe. Jesteśmy w stanie dobrać kserokopiarkę do pracy w domu, do małego biura, do średniej firmy i dużego przedsiębiorstwa.</p>
                  <h2>Wynajem kserokopiarek</h2>
                  <p>W białostockim oddziale DKS sprzedajemy i wynajmujemy <strong>kserokopiarki</strong> i <a title="maszyny poligraficzne" href="https://www.dks.pl/oferta" target="_blank" rel="noopener">maszyny poligraficzne</a>. Proponowana przez nas usługa dzierżawy urządzeń jest bardzo atrakcyjna dla firm, które nie chcą ponosić dużych kosztów zakupu maszyn. Nasze umowy wynajmu są proste i przejrzyste, co skraca proces podejmowania decyzji i czas dostawy urządzeń drukujących.</p>
                  <p>Prowadzimy także profesjonalny serwis sprzętu gwarancyjnego i pogwarancyjnego. Nasz zespół handlowców obsługuje Klientów z całego woj. podlaskiego. Realizujemy nasze usługi dla Klientów w takich miastach jak Grajewo, Augustów, Łomża, Zambrów, Bielsk Podlaski. </p>
                  <h2>Oferta kserokopiarek w Białymstoku</h2>
                  <p>
                      W naszej ofercie znajdziesz kserokopiarki znanych i cenionych na całym świecie producentów, takich jak Canon, Konica Minolta, HP czy Lexmark. 
                      Jesteśmy w stanie dobrać kserokopiarkę do pracy w domu, małego biura, średniej firmy czy dużego przedsiębiorstwa. 
                      Zawsze chętnie pomożemy w doborze sprzętu i podpowiemy, jakie urządzenie sprawdzi się u Ciebie najlepiej. 
                  </p>
                  <p>
                      Oferujemy urządzenia nowe oraz używane, poleasingowe, drukujące w kolorze lub czarno-białe, w formacie A4, A3, a także wielkoformatowe. 
                      Dzięki szerokiemu wyborowi brandów możemy stworzyć dla Ciebie bardzo wydajną flotę urządzeń drukujących. 
                      Obsługujemy różnorodnych klientów: pojedyncze punkty, urzędy, szkoły, drukarnie oraz agencje reklamowe.
                  </p>
                  <p>
                      Urządzenia można kupić lub wynająć na określony czas. Posiadamy 12 oddziałów w Polsce, a w każdym z nich znajduje się serwis oraz magazyn z materiałami eksploatacyjnymi, 
                      co umożliwia szybkie i sprawne przeprowadzenie serwisu urządzeń. 
                  </p>
                  <p>
                      Jeżeli masz pytania, szukasz drukarki, kserokopiarki, a może maszyny produkcyjnej czy wielkoformatowej, zapraszamy do naszego oddziału w Białymstoku. 
                      Odpowiemy na wszystkie Twoje pytania i pomożemy znaleźć najlepsze rozwiązanie.
                  </p>

                  <h2>Jak wybrać odpowiednią kserokopiarkę?</h2>
                  <p>
                      Wybór odpowiedniej kserokopiarki może być kluczowy dla efektywności pracy biura. Aby dokonać właściwego wyboru, warto wziąć pod uwagę kilka istotnych czynników:
                  </p>
                  <ul>
                      <li>
                          <strong>Rozważ swoje potrzeby:</strong> Zastanów się, jakie zadania będzie wykonywać kserokopiarka. Czy potrzebujesz jedynie kopiowania dokumentów, czy także drukowania, skanowania i faksowania?
                      </li>
                      <li>
                          <strong>Określ wymagany format:</strong> Jeśli potrzebujesz drukować na różnych formatach, takich jak A4, A3 czy SRA3, wybierz urządzenie z odpowiednimi funkcjami.
                      </li>
                      <li>
                          <strong>Sprawdź prędkość druku:</strong> Prędkość druku jest istotna, zwłaszcza w przypadku dużego biura z dużą ilością dokumentów do przetworzenia.
                      </li>
                      <li>
                          <strong>Kolor czy monochromatyczne:</strong> Zastanów się, czy potrzebujesz drukować w kolorze, czy wystarczy Ci druk monochromatyczny.
                      </li>
                      <li>
                          <strong>Koszty eksploatacji:</strong> Przed zakupem kserokopiarki warto sprawdzić koszty eksploatacji, takie jak cena tonerów czy części zamiennych.
                      </li>
                  </ul>
                  <p>
                      Zachęcamy do skorzystania z naszej oferty kserokopiarek w Białymstoku oraz do kontaktu z naszymi specjalistami, którzy pomogą dobrać odpowiednie urządzenie dla Twoich potrzeb.
                  </p>
                  `,
    metaTitle: 'Urządzenia biurowe i kserokopiarki biznesowe – DKS Białystok',
    metaDescription: 'Oferujemy biznesowe urządzenia biurowe i kserokopiarki. Trwałe, wydajne i ekonomiczne maszyny możesz kupić lub wydzierżawić w jednym z naszych oddziałów. ',
    address: ' ul. Wysockiego 68a, 15-167 Białystok',
    phone: '85 671 20 28',
    email: 'info.bialystok@dks.pl',
    offerTab: 'W naszej ofercie znajdziesz kserokopiarki znanych i cenionych na całym świecie producentów, między innymi Canon, Konica Minolta, HP czy Lexmark. Jesteśmy w stanie dobrać kserokopiarkę do pracy w domu, do małego biura, ale także do średniej firmy, czy dużego przedsiębiorstwa. Zawsze chętnie pomożemy w doborze, podpowiemy, jaki sprzęt będzie się sprawował u Ciebie najlepiej. Posiadamy urządzenia nowe, a także używane, poleasingowe, drukujące w kolorze lub czarno białe, w formacie A4, A3, po wielkoformatowe. Posiadając wiele brandów w swojej ofercie możemy stworzyć dla Ciebie bardzo wydajną flotę urządzeń drukujących. Nasi klienci są bardzo zróżnicowani, obsługujemy pojedyncze punkty, urzędy, szkoły, drukarnie, agencje reklamowe. Urządzenie można kupić, ale można również wynająć na określony czas. Posiadamy 12 oddziałów w Polsce i w każdym z oddziałów znajduje się serwis, a także magazyn z materiałami eksploatacyjnymi, aby serwis urządzenia został przeprowadzona w jak najkrótszym czasie. Jeżeli masz pytania, szukasz drukarki, kserokopiarki, może maszyny produkcyjnej czy wielkoformatowej- zapraszamy do naszego oddziału w Białymstoku, gdzie odpowiemy na Twoje wszystkie pytania.',
    leaseTab: 'Chciałbyś rozwinąć środowisko druku w swojej firmie, ale nie chcesz wydawać jednorazowo dużej kwoty? Jeżeli tak to najlepszym rozwiązaniem będzie dzierżawa urządzeń do druku. W swojej ofercie posiadamy nowe urządzenia, a także używane, kolorowe i czarnobiałe, drukarki jednofunkcyjne i wielofunkcyjne, systemy produkcyjne do druku cyfrowego arkuszowego i rolowego, uszlachetniania UV 3D i obróbki introligatorskiej. Dzierżawy są podpisywane na określony czas, nie musisz martwić się o nieprzewidziane koszty, gdy zdarzy się awaria urządzenia, nie musisz szukać na cito serwisu, my się wszystkim zajmiemy. Jedyne o co musisz się sam/a zatroszczyć to uzupełnianie papieru. Zapraszamy do naszego oddziału w Białymstoku, bądź kontaktu telefonicznego/mailowego, gdzie pomożemy Tobie wybrać najlepsze rozwiązanie.',
    photocopiersTab: 'Wychodząc naprzeciw oczekiwaniom klienta, posiadamy szeroką ofertę produktów, w której znajdziesz między innymi: drukarki laserowe, kserokopiarki, plotery, skanery, składarki, znanych światowych producentów takich jak: Canon, Konica Minolta, HP, Lexmark, Kip, Oce, Contex, es-te. Na co dzień drukujesz dokumenty czarno białe w formacie A4, faktury, instrukcje, a może ulotki, broszury czy nawet mapy geodezyjne? Pod każdy model biznesu jesteśmy w stanie dobrać optymalne urządzenia. Posiadamy drukarki w formacie A4, urządzenia wielofunkcyjne w formacie A3, maszyny produkcyjne, wielkoformatowe, sprzęt introligatorski, a także do wydruku etykiet. Urządzenia są mono i kolorowe, nowe i używane. Prowadzimy również sprzedaż materiałów eksploatacyjnych, a także oprogramowania do druku. Jest opcja zakupu, a także najmu. Oferujemy serwis w całej Polsce.',
    serviceTab: 'Już blisko 30 lat świadczymy usługi serwisowe i doradcze na terenie całej Polski. Nasz dział serwisu tworzą inżynierzy i technicy, którzy przechodzą regularne szkolenia i są na bieżąco z informacjami o nowościach i rozwiązaniach stosowanych w urządzeniach dukujących, dzięki czemu zapewniamy niskie koszty przy wysokiej jakości wydruku. Podejmując z nami współpracę nie musisz tracić czasu na szukanie przyczyn awarii urządzenia w internecie, szukać kolejnego serwisanta, poszukiwać części eksploatacyjnych i zastanawiać się czy będą pasowały, czy to jest przyczyną awarii maszyny. Usuwamy nagłe awarii w jak najkrótszym czasie, dzięki sprawnie działającej logistyce oraz ilości posiadanych magazynów wyposażonych w materiały i części eksploatacyjne, których mamy 12 w największych miastach Polski. Po montażu przeprowadzamy zawsze szkolenie z obsługi i eksploatacji wybranym osobom. Gwarantujemy okresowe przeglądy serwisowe w trakcie trwania gwarancji producenta, a także przeglądy pogwarancyjne. Oferujemy umowę serwisową , w której gwarantujemy naprawy, przeglądy urządzenia, a także uzupełnienie materiałów eksploatacyjnych w ramach umowy, płacąc jedynie za wydruki.',
    salesContact: {
      phones: ['85 671 20 28'],
      emails: ['info.bialystok@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.bialystok@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2392.3287918483884!2d23.184185415831315!3d53.15813967994001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffc2b9c8745e9%3A0xf5e2550770537a5d!2sW%C5%82adys%C5%82awa%20Wysockiego%2068a%2C%2015-126%20Bia%C5%82ystok!5e0!3m2!1spl!2spl!4v1651135532537!5m2!1spl!2spl',
  },
  {
    name: 'wroclaw',
    fullName: 'DKS Sp. z o.o. Oddział Wrocław',
    img: '//static/departments/wroclaw.webp',
    href: '/oddzialy/wroclaw',
    title: 'Kserokopiarki i wielofunkcyjne urządzenia biurowe we Wrocławiu',
    description: `<p>Stale rozbudowujemy sieć oddziałów, zapewniając Klientom coraz łatwiejszy dostęp do usług DKS we wszystkich województwach. Mieszkańcy z woj. dolnośląskiego mogą kupić lub wydzierżawić u nas <strong>kserokopiarki</strong> klasy biznesowej. Zapraszamy do zapoznania się z pełną ofertą, w której znajdują się nie tylko urządzenia drukujące do biura, lecz także monochromatyczne i <a title="kolorowe maszyny produkcyjne" href="https://www.dks.pl/oferta" target="_self">kolorowe maszyny produkcyjne</a> oraz drukarki wielkoformatowe.</p>
                  <p>Niezależnie od tego, w której części województwa dolnośląskiego mieszkasz, możesz zamówić <strong>urządzenia biurowe</strong> we wrocławskim oddziale DKS. Nasz zespół handlowców obsługuje Klientów z Wałbrzycha, Legnicy, Oleśnicy, Oławy, Świdnicy. </p>
                  <h2>Sprzedaż i dzierżawa nowych i używanych kserokopiarek</h2>
                  <p>Prowadzimy <strong>sprzedaż i wynajem kserokopiarek</strong>, dostarczamy materiały eksploatacyjne i prowadzimy serwis urządzeń kopiujących i drukujących. W naszej placówce otrzymasz również wsparcie doradcze: eksperci DKS wybiorą urządzenie, które będzie dla Ciebie optymalne i pozwoli z największą efektywnością realizować zlecenia zewnętrzne i zaspokajać zapotrzebowanie na druk dokumentów firmowych.</p>
                  <p><strong>Dzierżawa kserokopiarek</strong> pozwala użytkować maszynę o dowolnych parametrach bez kosztownej inwestycji. W zamian za niewielki miesięczny czynsz możesz realnie podnieść jakość i optymalizować koszty druku. Nasi przedstawiciele handlowi udzielą Ci merytorycznego wsparcia przy wyborze odpowiedniego sprzętu. Jeżeli w trakcie eksploatacji zapotrzebowanie na druk w Twojej firmie wzrośnie lub zmaleje, przewidujemy możliwość wymiany maszyny na precyzyjniej dopasowaną do nowych okoliczności.</p>
                  <p>Fundamentami naszej działalności są: doświadczenie, profesjonalizm, szybkość działania i elastyczne podejście do każdego Klienta. Zapraszamy do bliższego zapoznania się z naszą ofertą i kontaktu telefonicznego, mailowego lub wizyty w naszym wrocławskim oddziale.</p>
                  <h2>Usługi wynajmu kserokopiarek we Wrocławiu</h2>
                  <p>
                  <strong>Wynajem kserokopiarek we Wrocławiu to doskonałe rozwiązanie dla firm i instytucji, które chcą korzystać z nowoczesnych urządzeń biurowych bez konieczności ponoszenia wysokich kosztów zakupu.</strong>
                  <h2>Usługi wynajmu kserokopiarek we Wrocławiu</h2>
                  <p>
                      <strong>Wynajem kserokopiarek we Wrocławiu to doskonałe rozwiązanie dla firm i instytucji, które chcą korzystać z nowoczesnych urządzeń biurowych bez konieczności ponoszenia wysokich kosztów zakupu.</strong> 
                      Oferujemy szeroki wybór kserokopiarek, zarówno nowych, jak i używanych, które można wynająć na dogodnych warunkach. Nasza oferta wynajmu kserokopiarek we Wrocławiu obejmuje również 
                      <strong>profesjonalny serwis techniczny oraz dostarczanie materiałów eksploatacyjnych</strong>.
                  </p>
                  <p>
                      <strong>Dzierżawa kserokopiarek we Wrocławiu</strong> pozwala na elastyczne dopasowanie oferty do potrzeb każdego klienta. W zależności od wymagań i oczekiwań, nasi eksperci doradzą, jaki model kserokopiarki będzie najbardziej odpowiedni dla Twojej firmy. Współpracując z nami, masz pewność, że wynajmowane urządzenie będzie niezawodne i wydajne, a także spełni wszystkie Twoje oczekiwania.
                  </p>
                  <p>
                      Wynajem kserokopiarek we Wrocławiu to także możliwość korzystania z nowoczesnych technologii druku, takich jak druk wielkoformatowy czy druk cyfrowy. Dzięki temu Twoja firma będzie mogła oferować swoim klientom usługi na najwyższym poziomie, a Ty zyskasz przewagę konkurencyjną na rynku.
                  </p>
                  <p>
                      <strong>Zapraszamy do skorzystania z naszej oferty wynajmu kserokopiarek we Wrocławiu.</strong> Jesteśmy przekonani, że dzięki naszemu doświadczeniu, profesjonalizmowi i elastycznemu podejściu do każdego klienta, znajdziemy dla Ciebie optymalne rozwiązanie, które pozwoli Ci skupić się na rozwijaniu swojego biznesu.
                  </p>
                  </p> 
                  `,
    metaTitle: 'Wielofunkcyjne kserokopiarki i urządzenia biurowe – DKS Wrocław',
    metaDescription: 'Zaopatrujemy naszych Klientów w wielofunkcyjne kserokopiarki i urządzenia biurowe. Proponujemy zakup i dzierżawę sprzętu drukującego. Zapoznaj się z ofertą.',
    address: 'ul. Północna 15-19, 54-105 Wrocław budynek 2.2, wejście B, piętro 2, pok. nr 213-214',
    phone: '71 725 42 54',
    email: 'info.wroclaw@dks.pl',
    offerTab: 'Specjalizujemy się w sprzedaży, dzierżawie oraz serwisie urządzeń drukujących do biur, a także do poligrafii. W skład naszego portfolio wchodzą kserokopiarki, drukarki cyfrowe czy skanery wielkoformatowe. Dzięki szerokiemu wachlarzowi asortymentu, oferowane przez nas produkty, rozwiązania jak i usługi mają na celu efektywne zaspokojenie indywidualnych potrzeb naszych Klientów. Dzierżawa kserokopiarek, którą oferujemy łączy się z wieloma zaletami, dzięki tej usłudze zapewniamy wysokiej jakości druk monochromatyczny oraz kolorowy, cykliczne przeglądy urządzeń, fachowy serwis oraz niskie ceny wykonanych kopii. Fundamentem naszej firmy jest długoletnie doświadczenie, profesjonalizm, szybkość działania i elastyczne podejście do każdego klienta indywidualnie. Zachęcamy do kontaktu z naszym warszawskim oddziałem – zaoferujemy korzystne warunki wynajmu i pomożemy dobrać urządzenie spełniające Twoje wymagania, a w czasie trwania kontraktu będziemy dbali, aby urządzenia każdego dnia sprawnie działały.',
    leaseTab: 'Potrzebujesz nową kserokopiarkę do biura, ale martwisz się, że będziesz musiał wydać na dzień dobry sporą kwotę… Dzięki opcji wynajmu nie musisz już przeglądać i szukać kserokopiarek w najniższej cenie. Jedyny koszt jaki ponosisz to koszt za wydrukowaną / zeskanowaną kopię. Drukujesz ile chcesz, a my zajmujemy się całą resztą. Po naszej stronie jest wymiana materiałów eksploatacyjnych czy usunięcie usterek. Wystarczy wysłać maila na serwis.wroclaw@dks.pl lub zadzwonić do Biura Obsługi Klienta. Nasz oddział we Wrocławiu obsługuje przedsiębiorstwa, biura zlokalizowane w okolicach Dolnego Śląska. Zapraszamy do zapoznania się z ofertą i do kontaktu.',
    photocopiersTab: 'W naszej ofercie znajdują się światowej klasy maszyny do druku, nowe jak i używane, poleasingowe. Dzięki autoryzacji takich marek jak: Canon, Konica Minolta, HP, Lexmark jesteśmy w stanie dobrać najlepsze rozwiązanie dla każdego. Zastanawiasz się nad kupnem kserokopiarki? Zapraszamy do kontaktu. A może lepiej byłoby wynająć? Każda opcja ma swoje zalety. Chętnie porównamy, podpowiemy i pomożemy podjąć właściwą decyzję. Posiadamy również materiały eksploatacyjne takich marek jak: Canon, Konica Minolta, Ricoh, OKI, Toshiba, HP i inne. Jeżeli posiadasz kilka kserokopiarek, lub wiele osób korzysta z urządzeń drukujących, sprawdzonym rozwiązaniem jest zainstalowanie oprogramowania, dzięki któremu będziesz mieć pełną kontrolę nad przepływem wydruków, zliczać aktywność użytkowników, do tego zapewni bezpieczeństwo, a zdecydowanie największym plusem jest zmniejszenie kosztów związanych z drukiem. Jeżeli masz pytania zapraszamy do oddziału we Wrocławiu osobiście lub skontaktuj się z nami telefonicznie lub mailowo.',
    serviceTab: 'Każde urządzenie, aby sprawnie działało i służyło nam jak najdłużej, musi mieć co jakiś czas zrobiony przegląd. Części się zużywają, trzeba je wymieniać. Dlatego wygodnie jest zlecić te czynności fachowcom, a samemu wykorzystać ten czas na ważniejsze sprawy. Czas umowy jest bardzo elastyczny, dobierany indywidualnie. Oferujemy serwis dla maszyn, które są Twoją własnością, ale również może to być na zasadzie całościowej usługi, czyli wynajem urządzenia plus serwis. Gwarantujemy szybką reakcję serwisu, wiele części posiadamy w naszych magazynach, dzięki czemu czas naprawy jest możliwie minimalizowany. Każdą usterkę czy awarię można zgłosić na kilka sposobów: poprzez formularz zgłoszeniowy na naszej stronie www, przez szybki kontakt również na stronie www, przez maila serwis@dks.pl, czy dzwoniąc do Biura Obsługi Klienta. Dążymy do tego, aby proces zamawiania serwisu, czy części eksploatacyjnych był jak najbardziej uproszczony dla Klienta.',
    salesContact: {
      phones: ['71 725 42 54'],
      emails: ['info.wroclaw@dks.pl'],
    },
    serviceContact: {
      phones: ['801 004 104', '58 350 66 05'],
      emails: ['serwis.wroclaw@dks.pl'],
    },
    srcMap: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2502.0227774376854!2d16.932944415757365!3d51.16336947958007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470feb6f299a8241%3A0x4054dec8b6507125!2zUMOzxYJub2NuYSAxNS8xOSwgNTQtMTA1IFdyb2PFgmF3!5e0!3m2!1spl!2spl!4v1651135614544!5m2!1spl!2spl',
  },
];

function Tabs({ department }) {
  const [offerTabActive, setOfferTabActive] = useState(true);
  const [leaseTabActive, setLeaseTabActive] = useState(false);
  const [photocopiersTabActive, setPhotocopiersTabActive] = useState(false);
  const [serviceTabActive, setServiceTabActive] = useState(false);

  function resetActiveTabs() {
    setOfferTabActive(false);
    setLeaseTabActive(false);
    setPhotocopiersTabActive(false);
    setServiceTabActive(false);
  }

  return (
    <div className="flex sm:flex-col">
      <div className="md:w-1/4 sm:mb-6">
        <ul className={styles.tabs}>
          <li className={`${offerTabActive && styles.tabActive}`}>
            <div
              role="button"
              tabIndex="0"
              onClick={() => {
                resetActiveTabs();
                setOfferTabActive(true);
              }}
              onKeyPress={() => {
                resetActiveTabs();
                setOfferTabActive(true);
              }}
            >
              Oferta
              {' '}
              <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
            </div>
          </li>
          <li className={`${leaseTabActive && styles.tabActive}`}>
            <div
              role="button"
              tabIndex="0"
              onClick={() => {
                resetActiveTabs();
                setLeaseTabActive(true);
              }}
              onKeyPress={() => {
                resetActiveTabs();
                setLeaseTabActive(true);
              }}
            >
              Dzierżawa
              {' '}
              <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
            </div>
          </li>
          <li className={`${photocopiersTabActive && styles.tabActive}`}>
            <div
              role="button"
              tabIndex="0"
              onClick={() => {
                resetActiveTabs();
                setPhotocopiersTabActive(true);
              }}
              onKeyPress={() => {
                resetActiveTabs();
                setPhotocopiersTabActive(true);
              }}
            >
              Kserokopiarki
              {' '}
              <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
            </div>
          </li>
          <li className={`${serviceTabActive && styles.tabActive}`}>
            <div
              role="button"
              tabIndex="0"
              onClick={() => {
                resetActiveTabs();
                setServiceTabActive(true);
              }}
              onKeyPress={() => {
                resetActiveTabs();
                setServiceTabActive(true);
              }}
            >
              Serwis urządzeń
              {' '}
              <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
            </div>
          </li>
        </ul>
      </div>
      <div className="w-full px-8">
        {offerTabActive
          && (
          <div>
            <h2 className="text-4xl mb-8 font-bold">Oferta</h2>
            <p className="text-dks-font text-sm leading-relaxed">{department.offerTab}</p>
          </div>
          )}
        {leaseTabActive
          && (
          <div>
            <h2 className="text-4xl mb-8 font-bold">Dzierżawa</h2>
            <p className="text-dks-font text-sm leading-relaxed">{department.leaseTab}</p>
          </div>
          )}
        {photocopiersTabActive
          && (
          <div>
            <h2 className="text-4xl mb-8 font-bold">Kserokopiarki</h2>
            <p className="text-dks-font text-sm leading-relaxed">{department.photocopiersTab}</p>
          </div>
          )}
        {serviceTabActive
          && (
          <div>
            <h2 className="text-4xl mb-8 font-bold">Serwis urządzeń</h2>
            <p className="text-dks-font text-sm leading-relaxed">{department.serviceTab}</p>
          </div>
          )}
      </div>
    </div>
  );
}

Tabs.propTypes = {
  department: PropTypes.shape({
    offerTab: PropTypes.string.isRequired,
    leaseTab: PropTypes.string.isRequired,
    photocopiersTab: PropTypes.string.isRequired,
    serviceTab: PropTypes.string.isRequired,
  }).isRequired,
};

export default function Department({ department, news, generalSettings }) {
  const { promos_widget } = generalSettings;
  return (
    <Layout title={department.metaTitle} description={department.metaDescription} useRecaptcha>
      <HeaderTop title={department.title} imgSrc="/static/header_oddzialy.webp" />
      <div className="w-full md:max-w-screen-xl">
        <Breadcrumb />
        <div className="flex sm:flex-col py-8">
          <div className="md:w-1/2 md:px-4">
            <div className={`relative ${styles.locationImage}`}>
              <Image src={department.img} layout="fill" objectFit="cover" alt={department.name} priority />
            </div>
            <div className="w-full bg-dks-medium-gray py-8">
              <Link href="#contact">
                <a href="#contact" className="rounded bg-dks-red text-white font-bold text-sm p-4 mx-auto text-center block w-2/4" type="button">
                  SKONTAKTUJ SIĘ Z NAMI
                </a>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 sm:px-4">
            {/* <h1 className="mb-10 sm:mt-10 text-5xl font-bold">{department.title}</h1> */}
            {/*
              text fields example:

              <p className="text-sm text-dks-font-gray leading-loose"
              dangerouslySetInnerHTML={{__html: getTextField('left_column', pageData.text_fields)}}
              ></p>
             */}
            <div 
              className={ `overflow-y-scroll h-96 ${styles.htmlContent}`}
              dangerouslySetInnerHTML={{ __html: department.description }}
            />
          </div>
        </div>
        <Tabs department={department} />
      </div>
      <PromoSection items={promos_widget} />

      <div className="w-full md:max-w-screen-xl">
        <NewsSection news={news} />
      </div>
      <div className="w-full my-6">
        <iframe
          title="Mapa z lokalizacją firmy"
          loading="lazy"
          style={{ border: 0, maxHeight: '312px', maxWidth: '100%' }}
          src={department.srcMap}
          width="100%"
          height="450"
        />
      </div>
      <div className="w-full md:max-w-screen-xl" id="contact">
        <div className="flex sm:flex-col sm:px-4 py-8">
          <div className="md:w-1/2 text-sm sm:mb-6">
            <h5 className="font-bold text-lg mb-4">{department.fullName}</h5>

            {department.address2
              ? (
                <>
                  <p>{department.address}</p>
                  <p>{department.address2}</p>
                </>
              )
              : <p>{department.address}</p>}

            <p className="mt-2">
              <span className="font-bold mt-3">Telefon: </span>
              <Link href={`tel:${department.phone.replace(/ /g, '')}`}>
                <a className="text-dks-sea-blue hover:text-dks-red" href={`tel:${department.phone.replace(/ /g, '')}`}>{department.phone}</a>
              </Link>
            </p>
            <p className="mt-2">
              <span className="font-bold mt-3">E-mail: </span>
              <Link href={`mailto:${department.email}`}>
                <a href={`mailto:${department.email}`} className="text-dks-red hover:text-dks-sea-blue">{department.email}</a>
              </Link>
            </p>

            <h5 className="font-bold text-lg mt-6 mb-2">Kontakt z działem handlowym:</h5>
            <p className="mt-2">
              {department.salesContact.phones.map((phone) => (
                <span key={phone}>
                  <span className="font-bold mt-3">Telefon: </span>
                  <Link href={`tel:${phone.replace(/ /g, '')}`}>
                    <a className="text-dks-sea-blue hover:text-dks-red" href={`tel:${phone.replace(/ /g, '')}`}>{phone}</a>
                  </Link>
                </span>
              ))}
            </p>
            <p className="mt-2">
              {department.salesContact.emails.map((email) => (
                <span key={email}>
                  <span className="font-bold mt-3">E-mail: </span>
                  <Link href={`mailto:${email}`}>
                    <a href={`mailto:${email}`} className="text-dks-red hover:text-dks-sea-blue">{email}</a>
                  </Link>
                </span>
              ))}
            </p>

            <h5 className="font-bold text-lg mt-6 mb-2">Kontakt z działem serwisu:</h5>
            <p className="mt-2">
              {department.serviceContact.phones.map((phone) => (
                <span key={phone}>
                  <span className="font-bold mt-3">Telefon: </span>
                  <Link href={`tel:${phone.replace(/ /g, '')}`}>
                    <a className="text-dks-sea-blue hover:text-dks-red" href={`tel:${phone.replace(/ /g, '')}`}>{phone}</a>
                  </Link>
                  <br />
                </span>
              ))}
            </p>
            <p className="mt-2">
              {department.serviceContact.emails.map((email) => (
                <span key={email}>
                  <span className="font-bold mt-3">E-mail: </span>
                  <Link href={`mailto:${email}`}>
                    <a href={`mailto:${email}`} className="text-dks-red hover:text-dks-sea-blue">{email}</a>
                  </Link>
                </span>
              ))}
            </p>
          </div>
          <div className="md:w-1/2">
            <h3 className="font-bold text-5xl mb-10">Skontaktuj się z nami</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = departments.map((department) => ({
    params: {
      location: department.name.toString(),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { location } }) {
  const requestedDepartment = departments.find((department) => department.name === location);

  if (!requestedDepartment) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      department: requestedDepartment,
      news: await getNews({ limit: 4 }) || [],
      generalSettings: await getSettings(),
      pageData: await getPageData(`/oddzialy/${location}`),
    },
    revalidate: 60,
  };
}

Department.propTypes = {
  department: PropTypes.shape({
    name: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    metaTitle: PropTypes.string.isRequired,
    metaDescription: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    offerTab: PropTypes.string.isRequired,
    leaseTab: PropTypes.string.isRequired,
    photocopiersTab: PropTypes.string.isRequired,
    serviceTab: PropTypes.string.isRequired,
    srcMap: PropTypes.string.isRequired,
    salesContact: PropTypes.shape({
      phones: PropTypes.arrayOf(PropTypes.string).isRequired,
      emails: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    serviceContact: PropTypes.shape({
      phones: PropTypes.arrayOf(PropTypes.string).isRequired,
      emails: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
  }).isRequired,
  news: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    user_created: PropTypes.string,
    date_created: PropTypes.string,
    user_updated: PropTypes.string,
    date_updated: PropTypes.string,
    title: PropTypes.string,
    seo_title: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.string,
    image: PropTypes.string,
    slug: PropTypes.string,
    lead: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
  })),
  pageData: PropTypes.shape({
    url: PropTypes.string.isRequired,
    text_fields: PropTypes.arrayOf(PropTypes.shape({
      identifier: PropTypes.string.isRequired,
      content: PropTypes.string,
    })),
  }),
  generalSettings: PropTypes.shape({
    products_slider: PropTypes.arrayOf(PropTypes.shape({
      heading: PropTypes.string,
      caption: PropTypes.string,
      button: PropTypes.string,
      link: PropTypes.string,
      headingColor: PropTypes.string,
      image: PropTypes.string,
    })),
    promos_widget: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      active: PropTypes.bool,
      model: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.string,
      description: PropTypes.string,
      link: PropTypes.string,
      highlighted: PropTypes.bool,
    })),
  }),
};

Department.defaultProps = {
  news: [],
  pageData: {},
};

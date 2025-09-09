import Image from 'next/image';
import styles from './styles/opinionsSlider.module.scss';
import Slider from '../elements/slider';

export default function OpinionsSlider() {
  const elementsForSlider = [
    {
      text: '"Współpracę z DKS rozpoczęliśmy w zeszłym roku. Dotychczas mieliśmy doświadczenia z różnymi firmami. Korzystanie z usług jednego usługodawcy, począwszy od wyboru urządzeń, przez instalacje, po dostarczanie materiałów eksploatacyjnych takich jak tonery ułatwia nam funkcjonowanie i jest po prostu wygodne. To samo dotyczy serwisu i rozliczania usługi. W przypadku awarii urządzenia wystarczy zadzwonić na infolinię i czekać na szybki przyjazd fachowca. Jesteśmy bardzo zadowoleni, profesjonalne podejście - zawsze jest tak jak należy, bez żadnych zastrzeżeń."',
      author: 'Dyrektor IT',
      company: 'Firma z branży FMCG',
    },
    {
      text: '"Prowadząc biznes, skupiałem się dotąd na innych rzeczach, nie zdając sobie sprawy, jak wiele można zaoszczędzić w kwestiach związanych z wydrukami w firmie. Profesjonalnie przeprowadzony audyt oraz rozwiązania wskazane nam przez fachowca z firmy DKS, pokazały mi, że to kolejny obszar, gdzie warto szukać optymalizacji kosztów. Zdecydowanie polecam!"',
      author: 'Dyrektor Zarządzający',
      company: 'Firma z branży e-commerce',
    },
    {
      text: '"Nasza firma od dłuższego czasu borykała się z nie do końca ekonomicznym podejściem do wydruków. Długo szukaliśmy firmy, która pomogłaby nam rozwiązać ten problem, a przy tym podpowiedziałaby jakie technologie używa się obecnie w biurach. Dzięki nawiązaniu współpracy z DKS, wiemy już, jakie rozwiązania opłacają się najbardziej. Część maszyn kupiliśmy na własność, część dzierżawimy. Co ciekawe korzystamy z urządzeń różnych marek, taką możliwość daje oferta DKS. Znacząco obniżyliśmy koszty związane drukowaniem, a drukujemy nie mało. Doradca dodatkowo zaproponował nam oprogramowanie do zarządzania wydrukiem - patrząc na efekty w postaci sprawniejszego obiegu dokumentów i zwiększenia bezpieczeństwa danych - w dzisiejszych organizacjach to powinien być standard."',
      author: 'Kierownik Sekcji',
      company: 'Firma z branży nieruchomości',
    },
    {
      text: '"Dotychczas sami kupowaliśmy urządzenia i wedle potrzeby doraźnie korzystaliśmy z usług różnych lokalnych firm do ich naprawy, co nie zawsze jak się dziś okazuje, było dobrym wyborem. Jeden z naszych klientów polecił nam DKS, jako firmę, która zajmie się wszystkim kompleksowo. Dużą zaletą było to, że tak jak nasza firma, DKS ma oddziały w kilkunastu największych miastach w Polsce. Jak dotąd jesteśmy bardzo zadowoleni. Usługi wykonywane są terminowo, a nasi pracownicy chwalą sobie podejście i profesjonalizm serwisu. Oby tak dalej!"',
      author: 'Właściciel',
      company: 'Firma szkoleniowa',
    },
  ].map((opinion) => (
    <div className="h-full relative flex flex-col">
      <div className="absolute w-10 h-12 -top-5 left-8 z-10">
        <Image src="/static/homepage/quotes.svg" alt="cytaty" layout="fill" objectFit="contain" />
      </div>
      <div className={styles.text}>{opinion.text}</div>
      <div className={styles.author}>{opinion.author}</div>
      <div className={styles.company}>{opinion.company}</div>
    </div>
  ));

  return (
    <section className={styles.section}>
      <div className={styles.bgWrapper}>
        <Image
          alt="bg image"
          src="/static/homepage/opinions-slider.webp"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="-z-1"
        />
      </div>
      <h3 className="text-center text-white text-4xl md:text-6xl font-bold py-8 md:py-16">Co o nas mówią</h3>
      <div className="sm:hidden flex md:max-w-screen-xl mx-auto relative">
        <Slider elements={elementsForSlider} styles={styles} visibleSlides={2} infinite />
      </div>
      <div className="md:hidden relative">
        <Slider elements={elementsForSlider} styles={styles} visibleSlides={1} infinite />
      </div>
    </section>
  );
}

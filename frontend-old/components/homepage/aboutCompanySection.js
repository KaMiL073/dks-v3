import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import styles from './styles/aboutCompanySection.module.scss';

export default function aboutCompanySection() {
  return (
    <section className={styles.section}>
      <Image
        alt="bg image"
        src="/static/homepage/o-firmie.webp"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-n1"
      />
      <div className="flex sm:flex-col sm:space-y-4 sm:my-10 sm:mx-4 items-center justify-end md:h-screen max-w-screen-xl mx-auto relative">
        <div className={styles.mainBox}>
          <h3 className="text-5xl font-bold mb-10">O firmie</h3>
          <p className="text-sm leading-relaxed">
            Jesteśmy firmą z obszaru nowoczesnych technologii dedykowanych dla biznesu.
            Od 32 lat realizujemy nasze cele: stały rozwój w dziedzinie wdrażania nowych technologii
            urządzeń biurowych i poligraficznych, projektowanie rozwiązań dopasowanych
            do indywidualnych klientów, kreowanie trendów w kierunkach ekonomiki funkcjonowania biur
            i bezpieczeństwa obiegu dokumentów. Osiągnęliśmy pozycję lidera w obszarze dzierżawy
            i sprzedaży biurowych urządzeń wielofunkcyjnych i drukarek.
            Dzięki konsekwentnie rozwijanej sieci oddziałów staliśmy się firmą ogólnopolską,
            docierającą ze swoją ofertą do każdego miejsca w kraju.
            Naszymi partnerami biznesowymi są globalne marki:
            Konica Minolta, Canon, HP, Sharp, Lexmark, Oce, KIP, Contex, OKI, es-te.
          </p>
          <br />
          <p className="text-sm">Nasze atuty</p>
          <ul className="text-xs leading-loose">
            <li>kompleksowa oferta;</li>
            <li>profesjonalny zespół pracowników;</li>
            <li>wieloletnie doświadczenie.</li>
          </ul>
          <br />
          <Link href="/o-firmie">
            <button type="button" className={styles.button}>
              więcej
              {' '}
              <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
            </button>
          </Link>
        </div>
        <div className={styles.counters}>
          <div className="py-6 px-3">
            <div className="text-5xl font-black mb-1">5450</div>
            <div className="font-semibold">obsługiwanych firm i instytucji</div>
          </div>
          <div className={`py-6 px-3 ${styles.bordered}`}>
            <div className="text-5xl font-black mb-1">21500</div>
            <div className="font-semibold">podpisanych umów</div>
          </div>
          <div className="py-6 px-3">
            <div className="text-5xl font-black mb-1">190</div>
            <div className="font-semibold">pracowników</div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Layout from '../components/layouts/layout';
import YouTubeEmbed from '../components/elements/youtubeEmbed';
import HeaderTop from '../components/elements/headerTop';
import styles from '../styles/About.module.scss';

const TITLE = 'O firmie - DKS';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function OFirmie() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="O firmie" />
      <div className="flex">
        <div className="flex-col w-1/3 sm:w-full md:max-w-screen-xl md:ml-24 mb-3 sm:mx-2">
          <YouTubeEmbed url="https://www.youtube.com/embed/ivyumY8hDwM?autoplay=1" title="dks" id="ivyumY8hDwM" />
          <div className={styles.aboutInfo}>
            <p>
              <strong> DKS Sp. z o.o.</strong>
              {' '}
              istnieje na rynku od 1993 roku. Posiadamy doświadczenie w zakresie dostarczania
              produktów i usług związanych z drukowaniem, kopiowaniem i skanowaniem.
              Naszym Klientom oferujemy kompleksowe rozwiązania dla biura - sprzedaż urządzeń
              wielofunkcyjnych, materiałów eksploatacyjnych, oprogramowania do kontroli wydruków
              i obiegu dokumentów.
            </p>
            <p>
              Prowadzimy również&nbsp;
              <strong>Dział Graphic Arts i CAD&amp;GIS</strong>
              , obsługujący Klientów poligraficznych - drukarnie, wydawnictwa, agencje reklamowe,
              punkty kserograficzne i fotograficzne, a także biura projektowe i architektoniczne.
              W tym kanale sprzedaży oferujemy kompleksowe rozwiązania dla produkcyjnego druku
              cyfrowego.
            </p>
            <p>
              Jesteśmy
              <strong> Autoryzowanym Dystrybutorem</strong>
              {' '}
              m. in. urządzeń KONICA MINOLTA, LEXMARK, CANON, HP, KIP i CONTEX.
            </p>
            <p>
              Posiadamy 12 oddziałów zlokalizowanych w największych miastach w Polsce, zapewniając
              płynną i fachową obsługę Klientów w całym kraju oraz gwarantując szybki czas reakcji
              <strong> Autoryzowanego Serwisu.</strong>
            </p>
          </div>
        </div>
        <div className="w-2/3 sm:w-0 sm:mr-2 bg-cover bg-top" style={{ backgroundImage: "url('/static/about-1.webp')" }} />
      </div>
    </Layout>
  );
}

import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';

const TITLE = 'Baza wiedzy - DKS';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function BazaWiedzy() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title={TITLE} />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <h2 className="text-3xl font-bold py-10">Słowniczek</h2>
        <div className="text-dks-dark-gray leading-loose pb-10">
          <p>
            <span className="font-bold">Urządzenie MFP (Multi-Function Printer)</span>
            <br />
            <br />
            Jest to wielofunkcyjne urządzenie drukujące, które oferuje funkcje drukarki,
            kopiarki, skanera i / lub faksu w jednym urządzeniu.
          </p>
          <br />
          <br />
          <p>
            <span className="font-bold">
              Podwójny automatyczny podajnik dokumentów - DADF
              (Dual Automatic Document Feeder)
            </span>
            <br />
            <br />
            Występuje najczęściej w wielofunkcyjnych  kopiarkach i skanerach,  umożliwia
            ułożenie kilkudziesięciu arkuszy jednocześnie i podawanie papieru do podwójnego
            skanera który sczytuje jednocześnie obraz z obu stron arkusza. Pozwala to w łatwy
            sposób na skanowanie, kopiowanie, wielostronicowych dokumentów bez konieczności
            ręcznego podawania każdej ze stron. Pozwala oszczędzić czas - działa z prędkością
            nawet do 300 obrazów na minutę, unikamy zacięć i uszkodzeń oryginalnego dokumentu.
          </p>
          <br />
          <br />
          <p>
            <span className="font-bold">
              OCR (Optical Character Recognition)
            </span>
            <br />
            <br />
            Optyczne rozpoznawanie znaków – zestaw technik lub oprogramowanie służące do
            rozpoznawania znaków i całych tekstów w pliku graficznym lub innym i
            przekształcanie na wersje edytowalne np. w postaci plików MS Office lub
            pokrewnych lub/i przeszukiwalnych plików PDF.
          </p>
        </div>
      </div>
    </Layout>
  );
}

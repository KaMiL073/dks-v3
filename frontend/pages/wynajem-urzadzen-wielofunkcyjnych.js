import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import styles from '../styles/pages.module.scss';

const TITLE = 'Wynajem urządzeń wielofunkcyjnych: najem drukarek i kserokopiarek';
const DESCRIPTION = 'Prowadzimy wynajem urządzeń wielofunkcyjnych: dzierżawę drukarek i kserokopiarek biurowych klasy premium. Sprawdź ofertę naszej wypożyczalni sprzętu biurowego.';

export default function rentalOfMultifunctionalDevices() {
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Wynajem urządzeń wielofunkcyjnych" />
      <div className="w-full md:max-w-screen-xl">
        <section className={styles.htmlContent}>
          <p>
            Zakup nie jest jedynym sposobem, aby móc użytkować nowoczesny sprzęt biurowy.
            <strong>Dzierżawa urządzeń biurowych</strong>
            {' '}
            to wygodna alternatywa dla firm,
            które nie mają odpowiedniego kapitału lub nie chcą go zamrażać w środkach trwałych.
            W zamian za niski miesięczny czynsz możesz korzystać
            z dowolnie wybranych kserokopiarek wielofunkcyjnych,
            drukarek i innych urządzeń biurowych.
          </p>
          <p>
            <strong>Najem drukarek i kserokopiarek</strong>
            jest doskonałą alternatywą dla zakupu wysokiej klasy urządzeń biurowych.
            Korzystają z niej małe firmy rodzinne i duże korporacje.
            To najłatwiejszy sposób, aby uzyskać dostęp do nowoczesnego sprzętu
            i z jego pomocą usprawnić obsługę dokumentów
            i przyspieszyć załatwianie spraw.
            {' '}
            <strong>Wynajem kserokopiarek i urządzeń wielofunkcyjnych</strong>
            {' '}
            jest dla wielu młodych firm jedyną możliwością wejścia
            w posiadanie niezbędnego sprzętu do przetwarzania dokumentów.
          </p>
          <h2>Wypożyczalnia biurowego sprzętu drukującego</h2>
          <p>
            Nasza
            <strong>wypożyczalnia drukarek i sprzętu biurowego</strong>
            {' '}
            jest w stanie zaspokoić nawet nietypowe zapotrzebowanie związane z drukiem
            i obsługą dokumentów firmowych. Służymy fachowym doradztwem,
            dzięki któremu unikniesz nietrafionych inwestycji
            i dopasujesz idealnie sprzęt do swoich potrzeb.
            Warunki dzierżawy dopasowujemy elastycznie do oczekiwań Klientów.
          </p>
          <p>
            Oferowana przez nas
            <strong>dzierżawa kserokopiarek</strong>
            {' '}
            dotyczy maszyn nowych i poleasingowych klasy biznesowej.
            Wszystkie urządzenia są starannie sprawdzone i przygotowane do intensywnej
            i niezawodnej pracy. Jeżeli zainteresowała
            Cię nasza oferta, zapraszamy do kontaktu
            z jednym z oddziałów regionalnych DKS.
          </p>
        </section>
      </div>
    </Layout>
  );
}

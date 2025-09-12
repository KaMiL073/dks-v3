import PropTypes from 'prop-types';
import styles from './styles/heroSection.module.scss';

export default function heroSection({ bgImg }) {
  return (
    <section className={styles.hero} style={{ backgroundImage: `url(${bgImg})` }}>
      <div className={styles.box}>
        <div className={styles.content}>
          <h3>Działamy z pasją</h3>
          <p>
            Kiedy w 1993r. przewoziliśmy pierwszą używaną drukarkę z Niemiec,
            urządzenia wielofunkcyjne były w Polsce jeszcze nowością.
            Idea była prosta: chcieliśmy dostarczać klientom rozwiązania,
            które będą usprawniać ich pracę, a przy tym będą dostosowane
            do ich potrzeb i możliwości. Dziś, po ponad 32 latach,
            współpracując z najlepszymi producentami na rynku,
            zmieniając standardowe podejście do sprzedaży na rzecz bycia profesjonalnym
            doradcą, na którym można polegać,
            a także sięgając po najnowsze technologie związane z drukiem cyfrowym,
            wielkoformatowym i software- możemy śmiało powiedzieć,
            że jesteśmy jednym z największych dystrybutorów
            i serwisów urządzeń wielofunkcyjnych w kraju,
            zapewniając płynną i profesjonalą obsługę w zakresie doradztwa
            i serwisu w 12 największych polskich miastach.
          </p>
          <p>
            Nasz sukces zawdzięczamy ludziom,
            którzy na co dzień tworzą nasz Zespół - ponad 180 pracowników,
            którzy tak jak my, podchodzą do klientów kompleksowo i profesjonalnie,
            a przy tym wciąż chcą się rozwijać w kierunku nowoczesnych technologii.
            Dołącz do naszego Zespołu i przekonaj się,
            że DKS to świetne wyzwanie i wyjątkowe miejsce pracy.
          </p>
        </div>
      </div>
    </section>
  );
}

heroSection.propTypes = {
  bgImg: PropTypes.string.isRequired,
};

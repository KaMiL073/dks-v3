import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../components/layouts/layout';

import styles from '../styles/events.module.scss';

export default function questionnaire() {
  return (
    <Layout>
      <div className={`bg-white w-full ${styles.eventBgColorLDN}`}>
        <div className="relative">
          <div className={styles.eventContentLDN}>
            <div className="xl:w-3/5 sm:text-center md:text-left pl-4">
              <h1 className="font-black text-5xl sm:text-3xl leading-tight uppercase" style={{ color: '#5A6AFF' }}>
                Laptop Dla
                <br /> Nauczyciela
              </h1>
              <p className="text-black pt-5">
                Łączymy Wiedzę z Technologią, Razem dla Lepszej Edukacji!
              </p>
             <Link href="https://dks.pl/strefa-klienta" type="button">
                <a
                  className="bg-dks-footer w-36 sm:mx-auto mt-10 uppercase text-white text-center text-tiny font-bold rounded p-3 transition-all duration-300 block"
                  href="https://dks.pl/strefa-klienta"
                >
                  skontaktuj się z nami
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.eventbgLDN} style={{ backgroundImage: 'url(/static/events/laptop-dla-nauczyciela/laptop-dla-nauczyciela.webp)' }} />
        </div>
      </div>

      <div className={`md:max-w-screen-xl px-4 xl:px-0 ${styles.contentLDN}`}>
        <div className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
            <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase text-indigo-500">Jak To Działa</h2>
            <div className="flex flex-wrap sm:flex-col md:flex-row sm:flex-col md:flex-row py-12">
              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">

                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#9635B6' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/laptop_chromebook.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Wybierz Laptop</strong></p>
                  <p>Zdecyduj, który laptop chcesz kupić z naszej oferty.</p>
                </div>
              </div>
              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#9635B6' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/connect_without_contact.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Skontaktuj się z nami</strong></p>
                  <p>pomożemy w realizacji bonu!</p>
                </div>
              </div>
              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#9635B6' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Ellipse-8.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Ciesz się wymarzonym sprzętem</strong></p>
                  <p>nawet za 0 zł!</p>
                </div>
              </div>
            </div>
        </div>
        <div className="my-16">
          <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase" style={{ color: '#5A6AFF;' }}>
            Wybierz swój sprzęt!
          </h2>
          <div className="flex flex-col md:flex-row order-4 mt-5 py-12">
            <div className="md:w-1/3 py-2">
              <div className="flex flex-col md:flex-row">
                <div className={`flex relative ${styles.eventProductImgLDN}`}>
                  <Image
                    src="//static/events/laptop-dla-nauczyciela/v14.webp"
                    alt="Lenovo V14 G4 IRU"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <p><strong>Lenovo V14 G4 IRU</strong></p>
                  <div className="mt-3">
                    <p>Dla nauczyciela, który ceni niezawodność w codziennej pracy.</p>
                    <Link href="/zamow-laptop-dla-nauczyciela?previous=lenovo-v14-g4-iru" type="button">
                      <a
                        className="bg-dks-footer mx-auto w-36 mt-4 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block"
                        href="/zamow-laptop-dla-nauczyciela?previous=lenovo-v14-g4-iru"
                      >
                        ZAMÓW TERAZ
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-2 mt-2">
                <div>
                  <p><strong>Ekran: 14” FHD</strong> – wyraźny obraz, idealny do prezentacji</p>
                  <p><strong>Procesor: Intel® Core™ i5-13420H</strong> – niezawodność w codziennej pracy</p>
                  <p><strong>RAM: 16 GB DDR4</strong> – płynne działanie programów biurowych i edukacyjnych</p>
                  <p><strong>Dysk: 512GB SSD</strong> – wystarczająco miejsca na dokumenty i materiały</p>
                  <p><strong>Bateria: Solidna</strong> – wystarczy na cały dzień pracy</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 py-2">
              <div className="flex flex-col md:flex-row">
                <div className={`flex relative ${styles.eventProductImgLDN}`}>
                  <Image
                    src="//static/events/laptop-dla-nauczyciela/LP-lenovo-v15-1.webp"
                    alt="Lenovo V14 G4 IRU"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <p><strong>Lenovo V15 G4 IRU</strong></p>
                  <div className="mt-3">
                    <p>Dla nauczyciela, który uczy wszędzie – mobilność i wydajność w jednym.</p>
                    <Link href="/zamow-laptop-dla-nauczyciela?previous=lenovo-v15-g4-iru" type="button">
                      <a
                        className="bg-dks-footer mx-auto w-36 mt-4 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block"
                        href="/zamow-laptop-dla-nauczyciela?previous=lenovo-v15-g4-iru"
                      >
                        ZAMÓW TERAZ
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-2 mt-2">
                <div>
                  <p><strong>Ekran: 15,6” FHD</strong> – wygodna praca w każdych warunkach</p>
                  <p><strong>Procesor: Intel® Core™ i5-13420H</strong> – szybkie działanie i płynna obsługa aplikacji</p>
                  <p><strong>RAM: 16 GB DDR4</strong> – komfortowa praca z wieloma programami jednocześnie</p>
                  <p><strong>Dysk: 512 GB SSD</strong> – szybkie uruchamianie i dużo miejsca na materiały dydaktyczne</p>
                  <p><strong>Bateria: Wydajna</strong> – długi czas pracy bez ładowania</p>
                </div>
              </div>
            </div>
            <div className="md:w-1/3 py-2">
              <div className="flex flex-col md:flex-row">
                <div className={`flex relative ${styles.eventProductImgLDN}`}>
                  <Image
                    src="//static/events/laptop-dla-nauczyciela/LP-lenovo-v15-1-_1.webp"
                    alt="Lenovo V14 G4 IRU"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div>
                  <p><strong>Lenovo ThinkBook 16 G6 IRL</strong></p>
                  <div className="mt-3">
                    <p>Dla nauczyciela, który potrzebuje mocy do zaawansowanych zadań.</p>
                    <Link href="/zamow-laptop-dla-nauczyciela?previous=lenovo-v16-g4-irl" type="button">
                      <a
                        className="bg-dks-footer mx-auto w-36 mt-4 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block"
                        href="/zamow-laptop-dla-nauczyciela?previous=lenovo-v16-g4-irl"
                      >
                        ZAMÓW TERAZ
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-2 mt-2">
                <div>
                  <p><strong>Ekran: 16” FHD</strong> – precyzyjna jakość obrazu do pracy z grafiką i multimediami</p>
                  <p><strong>Procesor: Intel® Core™ i5-13420H</strong> – wysoka moc obliczeniowa do zaawansowanych zadań</p>
                  <p><strong>RAM: 16 GB DDR4</strong> – bezproblemowa praca nawet przy wielu otwartych aplikacjach</p>
                  <p><strong>Dysk: 512 GB SSD</strong> – szybki dostęp do dużej ilości danych</p>
                  <p><strong>Bateria: Energooszczędna </strong> – długi czas działania na jednym ładowaniu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-white w-full ${styles.eventBgColorLDN}`}>
        <div className="relative">
          <div className={styles.eventbgLDNH} style={{ backgroundImage: 'url(/static/events/laptop-dla-nauczyciela/LP-dla-nauczycieli-grafiki-01-1.webp)' }} />
          <div className={styles.eventContentLDNH}>
            <div className="text-cente w-full md:w-1/2">
              <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase" style={{ color: '#5A6AFF;' }}>Nowy Sprzęt, Nowe Możliwości</h2>
              <p className="text-black pt-5 text-center">
                Laptop umożliwi Ci skuteczne korzystanie <br /> z narzędzi cyfrowych w nauczaniu.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`bg-white w-full ${styles.eventBgColorLDN}`}>
        <div className="relative">
          <div className={styles.eventContentLDN}>
            <div className="text-cente w-full md:w-1/2">
              <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase" style={{ color: '#5A6AFF;' }}>Wsparcie Finansowe</h2>
              <p className="text-black pt-5 text-center">
                Bon o wartości 2500 zł ułatwi zakup <br /> nowoczesnego sprzętu.
              </p>
            </div>
          </div>
          <div className={styles.eventbgLDN} style={{ backgroundImage: 'url(/static/events/laptop-dla-nauczyciela/LP-dla-nauczycieli-grafiki-01-1-_1.webp)' }} />
        </div>
      </div>

      <div className={`bg-white w-full ${styles.eventBgColorLDN}`}>
        <div className="relative">
          <div className={styles.eventbgLDNH} style={{ backgroundImage: 'url(/static/events/laptop-dla-nauczyciela/LP-dla-nauczycieli-grafiki-01-1-_2.webp)' }} />
          <div className={styles.eventContentLDNH}>
            <div className="text-cente w-full md:w-1/2">
              <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase text-indigo-500" style={{ color: '#5A6AFF;' }}>
                Elastyczny Termin  
              </h2>
              <p className="text-black pt-5 text-center">
              Bon ważny do końca 2025 roku. <br /> Skontaktuj się z nami, by dowiedzieć się więcej.              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center mt-16">

        <div className="w-full md:w-1/2">
          <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase px-8" style={{ color: '#5A6AFF;' }}>Nowy Sprzęt, Nowe Możliwości
            Jeśli masz pytania lub potrzebujesz dodatkowych informacji, skontaktuj się z nami
          </h2>

          <Link href="/strefa-klienta" type="button">
            <a className="bg-dks-footer mx-auto w-36 mt-16 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" 
                href="/strefa-klienta">
                skontaktuj się z nami
            </a>
          </Link>
        </div>

        <div className="w-full md:w-1/2">
          <div className={`flex relative ${styles.eventProductImgctaLDN}`}>
            <Image
              src="/static/events/laptop-dla-nauczyciela/portrait-beautiful-young-woman-standing-grey-wallphotoAid-removed-background-1-_2.webp"
              alt="FUJIFILM REVORIA PRESS PC1120"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>

    </Layout>
  );
}

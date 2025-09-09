import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layouts/layout';

import styles from '../../../styles/events.module.scss';

export default function questionnaire() {
  return (
    <Layout>
      <div className={`bg-white w-full ${styles.eventBgColorLDN}`}>
        <div className="relative">
          <div className={styles.eventContentLDN}>
            <div className="xl:w-3/5 sm:text-center md:text-left pl-4">
              <h1 className="font-black text-5xl sm:text-3xl leading-tight uppercase" style={{ color: '#FF0000' }}>
                Skanuj mądrzej z DKS
              </h1>
              <p className="text-black pt-5">
                Topowe skanery Canon w super cenie!
              </p>
             <Link href="https://dks.pl/strefa-klienta" type="button">
                <a
                  className="bg-dks-footer w-36 sm:mx-auto mt-10 uppercase text-white text-center text-tiny font-bold rounded p-3 transition-all duration-300 block"
                  href="https://dks.pl/strefa-klienta"
                >
                  Zamów teraz
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.eventbgLDN} style={{ backgroundImage: 'url(/static/events/skanery-canon/skanery-canon.webp)' }} />
        </div>
      </div>

      <div className={`md:max-w-screen-xl px-4 xl:px-0 ${styles.contentLDN}`}>
        <div className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
            <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase text-black">dlaczego warto</h2>
            <div className="flex flex-wrap sm:flex-col md:flex-row sm:flex-col md:flex-row py-12">
              
              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">

                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Close-Fullscreen.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Precyzyjne skanowanie</strong></p>
                  <p>Wyraźne i dokładne kopie każdego dokumentu.</p>
                </div>
              </div>

               <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Touch-Double.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Wygodny dostęp</strong></p>
                  <p>Skanowanie blisko miejsca gdzie pracujemy z dokumentami.</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Task.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Jedno ustawienie skanowania </strong></p>
                  <p>obsługuje cienkie papiery, grube koperty oraz jedno- i dwustronne dokumenty różnych formatów</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Apartment.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Dla każdej firmy</strong></p>
                  <p>Idealne do biur każdej wielkości.</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Speed.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Szybka praca</strong></p>
                  <p>Skanuj więcej w krótszym czasie.</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-full md:w-1/3 text-center p-4">
                <div className="flex justify-center w-20 h-20 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
                  <div className="relative w-16 h-16">
                    <Image
                      src="//static/events/icon/Encrypted.svg"
                      alt="icone"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base mt-4">
                  <p><strong>Bezpieczeństwo danych </strong></p>
                  <p>Ochrona Twoich dokumentów na najwyższym poziomie</p>
                </div>
              </div>

            </div>
        </div>
        <div className="my-16">
          <h2 className="font-normal font-black text-4xl leading-tight text-center uppercase" style={{ color: '#000000' }}>
            Skorzystaj z wyjątkowych cen na dwa topowe modele skanerów:
          </h2>
          <div className="flex flex-col md:flex-row order-4 mt-5 py-12">
            <div className="md:w-1/2 py-2">
              <div className="flex flex-col md:flex-row">
                <div className={`flex relative ${styles.eventProductImgLDN}`}>
                  <Image
                    src="//static/events/skanery-canon/Canon-imageFORMULA-DR-S350NW.webp"
                    alt="Canon imageFORMULA DR-S350NW"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="pl-8">
                  <p style={{color: "#FF0000"}}><strong>Canon imageFORMULA DR-S350NW</strong></p>
                  <div className="mt-3">
                    <p>
                      Zaawansowany skaner A4 dla małych grup roboczych, 
                      który zaprojektowano z myślą o pracy hybrydowej. 
                      Skanowanie sieciowe bez użycia sterowników 
                      i bezpośredni dostęp do zadań skanowania ułatwiają 
                      i upraszczają pracę.
                    </p>
                    <Link href="/kontakt" type="button">
                      <a
                        className="bg-dks-footer w-36 mt-4 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block"
                        href="/kontakt"
                      >
                        ZAMÓW TERAZ
                      </a>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
            <div className="md:w-1/2 py-2">
              <div className="flex flex-col md:flex-row">
                <div className={`flex relative ${styles.eventProductImgLDN}`}>
                  <Image
                    src="//static/events/skanery-canon/Canon-imageFORMULA-DR-S250N.webp"
                    alt="Canon imageFORMULA DR S250N"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <div className="pl-8">
                  <p style={{color: "#FF0000"}}><strong>Canon imageFORMULA DR S250N</strong></p>
                  <div className="mt-3">
                    <p>
                      Idealne urządzenie do wspólnego użytku w małych biurach,
                       działach korporacyjnych i w przestrzeniach współdzielonych.
                       Maksymalizacja wydajności i poprawa efektywności. 
                       Użytkownicy muszą skanować z różnych miejsc pracy.
                    </p>
                    <Link href="/kontakt" type="button">
                      <a
                        className="bg-dks-footer w-36 mt-4 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block"
                        href="/kontakt"
                      >
                        ZAMÓW TERAZ
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center md:max-w-screen-xl p-4">
        <div className="flex justify-center  mx-auto w-24 h-24 md:w-40 md:h-40 p-2 rounded-full" style={{ backgroundColor: '#FF0000' }}>
          <div className="relative w-20 h-20 md:w-36 md:h-36">
            <Image
              src="//static/events/icon/Timer.svg"
              alt="icone"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <div className="text-5xl uppercase mt-4 md:mt-0 md:ml-24 text-center md:text-left">
          <p><strong>promocja trwa <br /> do końca marca</strong></p>
        </div>
      </div>
      
      <div className="flex flex-col md:max-w-screen-xl md:flex-row items-center mt-16">
        <div className="w-full md:w-1/2">
          <h2 className="font-normal font-black text-4xl leading-tight text-center uppercas e px-8" style={{ color: '#000000;' }}>Nowy Sprzęt, Nowe Możliwości
            Jeśli masz pytania lub potrzebujesz dodatkowych informacji, skontaktuj się z nami
          </h2>

          <Link href="/strefa-klienta" type="button">
            <a className="bg-dks-footer mx-auto w-36 mt-8 md:mt-16 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" 
                href="/strefa-klienta">
                skontaktuj się z nami
            </a>
          </Link>
        </div>

        <div className="w-full mt-4 md:mt-0 md:w-1/2">
          <div className={`flex relative ${styles.eventProductImgctaLDN}`}>
            <Image
              src="//static/events/skanery-canon/skanery-canon-2.webp"
              alt="skanery-canon"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>

    </Layout>
  );
}

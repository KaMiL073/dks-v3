import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layouts/layout';

import styles from '../../../styles/events.module.scss';
import prom from '../../../components/homepage/styles/promoSection.module.scss';

export default function questionnaire() {
  return (
    <Layout>
      <div className={`bg-white md:w-full md:max-w-screen-xl`}>
        <div className="relative flex flex-col md:flex-row">
          <div className={`w-full md:w-1/2 p-4 flex items-center`}>
            <div className="xl:w-3/5 sm:text-center md:text-left">
              <h1 className="font-black text-4xl sm:text-3xl leading-tight uppercase text-black">
                Zmieniamy zwykłe <br />
                pomieszczenia <br />
                w inteligentne przestrzenie
              </h1>
              <p className="text-black pt-5">
                Sprawdzone technologie. Profesjonalne wsparcie. Atrakcyjne ceny.
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-1/2 h-96">
            <Image
              src="//static/promotions/tablice-interaktywne-dla-szkol-i-biznesu/tablice-interaktywne-dla-szkol-i-biznesu.webp"
              alt="Tablice interaktywne"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className={`md:max-w-screen-xl px-4 xl:px-0 ${styles.contentLDN}`}>
        <div className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <div className="flex sm:flex-col sm:space-y-4 mx-auto md:items-end justify-between max-w-screen-xl">
              <div className={prom.item}>
                  <div className={prom.body} style={{ minHeight: '37rem' }}>
                      <h5 className={prom.label}>Multiboard Light Gen 5</h5>
                      <div className="m-6">
                          <Image
                              width="100"
                              height="100"
                              layout="responsive"
                              objectFit="cover"
                              src="https://dks.pl/backend/assets/7cbfdf95-abda-4965-a141-41f79d31bd75?imwidth=1920"
                          />
                      </div>
                      <h5 className="font-normal text-xl text-left">Szybkość. Intuicja. Maksimum możliwości.</h5>
                      <div>
                          <div className="text-base text-left pt-2">
                              <p>Nowoczesna tablica z Android 13, która dotrzymuje Ci kroku. W każdej lekcji, prezentacji czy burzy mózgów.</p>
                          </div>
                      </div>
                      
                  </div>
                  <Link href="https://dks.pl/oferta/tablice-interaktywne">
                      <a className={prom.link} href="https://dks.pl/oferta/tablice-interaktywne">
                      więcej
                      {' >>'}
                      </a>
                  </Link>
              </div>
              <div className={prom.item}>
                  <div className={prom.body} style={{ minHeight: '37rem' }}>
                      <h5 className={prom.label}>Multiboard Light+ Series</h5>
                      <div className="m-6">
                          <Image
                              width="100"
                              height="100"
                              layout="responsive"
                              objectFit="cover"
                              src="https://dks.pl/backend/assets/408dcacc-1ef4-44fe-8e07-18afde6fba8d?imwidth=1920"
                          />
                      </div>
                      <h5 className="font-normal text-xl text-left">Twój cyfrowy kombajn do edukacji i biznesu</h5>
                      <div>
                          <div className="text-base text-left pt-2">
                              <p>Jeszcze więcej mocy. Jeszcze większa elastyczność. Seria Light+ to tablica, która zastępuje komputer – i robi to lepiej.</p>
                          </div>
                      </div>
                      
                  </div>
                  <Link href="https://dks.pl/oferta/tablice-interaktywne">
                      <a className={prom.link} href="https://dks.pl/oferta/tablice-interaktywne">
                      więcej
                      {' >>'}
                      </a>
                  </Link>
              </div>
              <div className={prom.item}>
                  <div className={prom.body} style={{ minHeight: '37rem' }}>
                      <h5 className={prom.label}>Mini PC PSMB528K002</h5>
                      <div className="m-6">
                          <Image
                              width="100"
                              height="100"
                              layout="responsive"
                              objectFit="cover"
                              src="https://dks.pl/backend/assets/d0f9cfb4-bf23-45e6-ad3a-2bbebac1efe4?imwidth=3840"
                          />
                      </div>
                      <h5 className="font-normal text-xl text-left">Kompaktowy gigant do tablic i prezentacji</h5>
                      <div>
                          <div className="text-base text-left pt-2">
                              <p>Niepozorny z wyglądu – niesamowity w środku. Ten Mini PC to cichy bohater każdej interaktywnej przestrzeni.</p>
                          </div>
                      </div>
                      
                  </div>
                  <Link href="https://dks.pl/oferta/komputery/mini-pc">
                      <a className={prom.link} href="https://dks.pl/oferta/komputery/mini-pc">
                      więcej
                      {' >>'}
                      </a>
                  </Link>
              </div>
          </div>          
        </div>
        <div className="relative w-full h-96">
          <Image
            layout="fill"
            objectFit="contain"
            src="//static/promotions/tablice-interaktywne-dla-szkol-i-biznesu/baner_kategoria-1.webp"
          />
        </div>
      </div>
      <div className={`bg-white w-full md:max-w-screen-xl py-4 ${styles.eventBgColorTIDSIB}`}>
        <div className="relative flex flex-row flex-wrap md:flex-nowrap items-center">
          <div className={`w-full md:w-1/2 p-4`}>
            <div className="text-left">
              <h2 className="font-normal font-black text-4xl leading-tight uppercase text-black">
                Multiboard Light Gen 5
              </h2>
              <ul className="list-disc pt-2 ml-5 text-black">
                <li>Superszybkie działanie – 8 GB RAM, 64 GB pamięci, Android 13</li>
                <li>Dźwięk premium: 2 głośniki + subwoofer</li>
                <li>Najnowsze technologie łączności – Wi-Fi 6, Bluetooth 5.1, USB-C</li>
                <li>Łatwa praca z plikami dzięki integracji z OneCloud i Google Drive</li>
                <li>W zestawie: roczna licencja edukacyjna mozaBook</li>
              </ul>
              <p className="text-black pt-5">
                <strong>
                  Dla nauczycieli, trenerów i zespołów, które chcą więcej.
                </strong>
              </p>

              <Link href="#rejestracja" type="button">
                <a className="bg-dks-footer md:w-52 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                  dowiedz się więcej
                </a>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 h-96 relative">
            <Image
              src="https://dks.pl/backend/assets/7cbfdf95-abda-4965-a141-41f79d31bd75?imwidth=1920"
              alt="Multiboard Light Gen 5"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>

      <div className={`bg-white w-full md:max-w-screen-xl py-4 ${styles.eventBgColorTIDSIB}`}>
        <div className="relative flex flex-col-reverse md:flex-row flex-wrap md:flex-nowrap items-center">
        <div className="w-full md:w-1/2 h-96 relative">
          <Image
            src="https://dks.pl/backend/assets/408dcacc-1ef4-44fe-8e07-18afde6fba8d?imwidth=1920"
            alt="Multiboard Light+ Series"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
          <div className={`w-full md:w-1/2 p-4`}>
            <div className="text-left">
              <h2 className="font-normal font-black text-4xl leading-tight uppercase text-black">
                Multiboard Light+ Series
              </h2>
              <ul className="list-disc pt-2 ml-5 text-black">
                <li>OPS z procesorem Intel i Windows 11 Pro</li>
                <li>Logowanie NFC – tylko dla uprawnionych użytkowników</li>
                <li>Pracuj bez Wi-Fi dzięki wbudowanemu modułowi LTE</li>
                <li>Kompletny pakiet aplikacji + mozaBook Classroom</li>
              </ul>
              <p className="text-black pt-5">
                <strong>
                  Zaprojektowane do dynamicznej pracy zespołowej i interaktywnych zajęć.
                </strong>
              </p>
              <Link href="https://dks.pl/oferta/tablice-interaktywne" type="button">
                <a className="bg-dks-footer md:w-52 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="https://dks.pl/oferta/tablice-interaktywne">
                  dowiedz się więcej
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-white w-full md:max-w-screen-xl py-4 ${styles.eventBgColorTIDSIB}`}>
        <div className="relative flex flex-row flex-wrap md:flex-nowrap items-center">
          <div className={`w-full md:w-1/2 p-4`}>
      <div className="text-left">
        <h2 className="font-normal font-black text-4xl leading-tight uppercase text-black">
          Mini PC PSMB528K002
        </h2>
        <ul className="list-disc pt-2 ml-5 text-black">
          <li>Intel Core i5 12. generacji – 10 rdzeni mocy</li>
          <li>Pamięć DDR5 i dysk NVMe – szybkość, która robi wrażenie</li>
          <li>Wi-Fi 6 + Bluetooth 5.2 – bez kabli, bez stresu</li>
          <li>Idealny do wideokonferencji i zdalnej pracy</li>
        </ul>
        <p className="text-black pt-5">
          <strong>
            Dla tych, którzy chcą niezawodności bez kompromisów.
          </strong>
        </p>
        <Link href="https://dks.pl/oferta/komputery/mini-pc" type="button">
          <a className="bg-dks-footer md:w-52 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="https://dks.pl/oferta/komputery/mini-pc">
            dowiedz się więcej
          </a>
        </Link>
      </div>
          </div>
          <div className="w-full md:w-1/2 h-96 relative">
            <Image
              src="https://dks.pl/backend/assets/d0f9cfb4-bf23-45e6-ad3a-2bbebac1efe4?  imwidth=3840"
              alt="Mini PC PSMB528K002"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center md:max-w-screen-xl my-16">
        <div className="w-full md:w-1/2 px-8">
            <h2 className="font-normal font-black text-4xl leading-tight text-left uppercase" style={{ color: '#000000;' }}>
                Interaktywne tablice i komputery stworzone z myślą o współpracy, wygodzie i efektywności.
            </h2>
            <p>
                Dla szkół, firm, instytucji – dla wszystkich, którzy chcą działać lepiej.
            </p>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <div className={`flex relative ${styles.eventProductImgctaLDN}`}>
            <Image
              src="//static/promotions/tablice-interaktywne-dla-szkol-i-biznesu/foto3-1.webp"
              alt="Interaktywne tablice i komputery stworzone z myślą o współpracy, wygodzie i efektywności."
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      </div>

    </Layout>
  );
}

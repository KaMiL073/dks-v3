import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { submitFormGeneration } from '../../../lib/api/frontApi';
import Layout from '../../../components/layouts/layout';
import getFields from '../../../lib/models/fields';
import FieldElement from '../../../components/elements/input';
import getEventsItem from '../../../lib/models/eventsItem';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import addZero from '../../../lib/helpers/addZero';

import styles from '../../../styles/events.module.scss';

const collectionName = 'remadays';

function QuestionnaireForm({ fields }) {
  const router = useRouter();
  const linkPath = router.asPath.split()[0].split('/');
  linkPath.shift();
  const formName = 'event';
  const nameEvent = linkPath[1];

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const onSubmit = async (data) => {
    const dataExtended = data;
    if (!executeRecaptcha) {
      /* eslint-disable no-console */
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha(formName);
    dataExtended.recaptchaResponse = token;

    dataExtended.formName = formName;

    try {
      await submitFormGeneration(collectionName, dataExtended);
      setFormSubmitted(true);
    } catch (error) {
      /* eslint-disable no-console */
      console.error('form: ', error);
    }
  };
  const fieldElement = fields.map((field) => (
    <div key={field.name}>
      <FieldElement dataField={field} event={nameEvent} register={register} />
    </div>
  ));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="md:max-w-screen-xl mx-auto">
        {fieldElement}
      </div>
      <div className="w-49">
        <small className="text-tiny">
          korzysta z zabezpieczenia reCAPTCHA
          <br />
          <a href="https://www.google.com/intl/pl/policies/privacy/" target="_blank" rel="noreferrer">
            Prywatność
          </a>
          <span aria-hidden="true" role="presentation"> - </span>
          <a href="https://www.google.com/intl/pl/policies/terms/" target="_blank" rel="noreferrer">
            Warunki
          </a>
        </small>
      </div>
      <div className="py-4">
        {
          formSubmitted
            ? (<button className="bg-dks-footer h-12 rounded w-3/4 uppercase text-white font-bold mx-auto block" type="button" disabled>Dziękujemy za zgłoszenie!</button>)
            : (<button className="bg-dks-footer h-12 rounded w-3/4 uppercase text-white font-bold mx-auto block" type="submit">Wyślij</button>)
        }
      </div>
    </form>
  );
}

const speakerItems = [
  {
    speaker: 'Katarzyna Kołodziejczyk',
    image: '//static/events/people/Katarzyna-Kołodziejczyk.webp',
    position: 'Graphic Arts Key Account Manager',
    phone: '539-735-216',
    email: 'k.kolodziejczyk@dks.pl',
    description: 'Odpowiedzialna za wdrożenia rozwiązań dla poligrafii ma terenie województw: pomorskie, warmińsko-mazurskie, kujawsko-pomorskie',
  },
  {
    speaker: 'Monika Kruszyńska',
    image: '//static/events/people/Monika-Kruszynska.webp',
    position: 'Graphic Arts Key Account Manager',
    phone: '795-522-422',
    email: 'm.kruszynska@dks.pl',
    description: 'Odpowiedzialna za wdrożenia rozwiązań dla poligrafii ma terenie województw: mazowieckie, podlaskie, łódzkie, lubelskie',
  },
  {
    speaker: 'Adam Wójcik',
    image: '//static/events/people/Adam-Wojcik.webp',
    position: 'Specjalista ds rozwiązań dla poligrafii',
    phone: '600-338-781',
    email: 'a.wojcik@dks.pl',
    description: 'Odpowiedzialny za wdrożenia rozwiązań dla poligrafii ma terenie województw: śląskie, małopolskie, świętokrzyskie, opolskie',
  },
  {
    speaker: 'Maciej Ofierzyński',
    image: '//static/events/people/Maciej-Ofierzynski.webp',
    position: 'Graphic Arts Key Account Manager',
    phone: '666-335-661',
    email: 'm.ofierzynski@dks.pl',
    description: 'Odpowiedzialny za wdrożenia rozwiązań dla poligrafii ma terenie województw: wielkopolskie, dolnośląskie, lubuskie, zachodnio-pomorskie',
  },
  {
    speaker: 'Andrzej Ćwikliński',
    image: '//static/events/people/Andrzej-Cwiklinski.webp',
    position: 'Dyrektor Sprzedaży Systemy Produkcyjne',
    phone: '664-042-295',
    email: 'a.cwiklinski@dks.pl',
    description: 'koordynacja sprzedaży rozwiązań dla poligrafii na terenie całego kraju.',
  },
];
const speakers = speakerItems.map(({
  speaker, image, position, phone, email, description,
}) => (
  <div className="w-full p-4 my-6">
    <div className="flex sm:flex-col md:flex-row">
      <div className="lg:w-1/4">
        <div className={`flex relative ${styles.speakerItems}`}>
          <Image
            src={image}
            alt={speaker}
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <div className="lg:w-3/4 md:pl-2 lg:pl-4">
        <p className="block font-bold text-base">
          {speaker}
        </p>
        <p className="block text-base" style={{ color: '#EA580C' }}>
          {position}
        </p>
        <p className="block text-base">
          Tel:
          {' '}
          {phone}
        </p>
        <p className="block text-base">
          Email:
          {' '}
          {email}
        </p>
        <br />
        <p className="block text-base">
          {description}
        </p>
      </div>
    </div>
  </div>
));



export default function questionnaire({ fields, eventsItem }) {
  const event = eventsItem;
  let date;
  
  const dayMonthHourFormat = Intl.DateTimeFormat('pl', {
    year: 'numeric', day: 'numeric', month: 'numeric',
  });
  
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  if (event.end_date === null) {
    date = dayMonthHourFormat.format(startDate);
  } else {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = endDate.getMonth() + 1;
    const year = endDate.getFullYear();
    date = `${`${addZero(startDay)}/${addZero(endDay).padStart(2, 0)}.${addZero(month)}.${addZero(year)}`}`;
  }

  const url = process.env.NEXT_NODE_ENV == "development" ? "http://localhost" : "https://www.dks.pl";

return (
    <Layout title={event.name} description={event.lead} ogImage={`${url}/backend/assets/${event.ogimage}`} useRecaptcha>
      <div className="w-full bg-black py-2 text-white sticky top-20 z-40">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto grow snap-mandatory overflow-x-auto text-xs">
          <div className="snap-start p-2">
            <Link href="#INFORMACJE-OGoLNE">
              <a className="relative inline-flex justify-center items-center" href="#INFORMACJE-OGoLNE">
                <span style={{ whiteSpace: 'nowrap' }}>
                  INFORMACJE OGÓLNE
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#NA-TARGACH">
              <a className="relative inline-flex justify-center items-center" href="#NA-TARGACH">
                <span style={{ whiteSpace: 'nowrap' }}>
                  NA TARGACH REMADAYS 2024
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#NA-STOISKU">
              <a className="relative inline-flex justify-center items-center" href="#NA-STOISKU">
                <span style={{ whiteSpace: 'nowrap' }}>
                  NA STOISKU F2.44
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#PREZENTOWANE-ROZWIAZANIA">
              <a className="relative inline-flex justify-center items-center" href="#PREZENTOWANE-ROZWIAZANIA">
                <span style={{ whiteSpace: 'nowrap' }}>
                  PREZENTOWANE ROZWIĄZANIA
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#TAKZE-W-OFERCIE-DKS">
              <a className="relative inline-flex justify-center items-center" href="#TAKZE-W-OFERCIE-DKS">
                <span style={{ whiteSpace: 'nowrap' }}>
                  TAKŻE W OFERCIE DKS
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#PRELEGENCI">
              <a className="relative inline-flex justify-center items-center" href="#PRELEGENCI">
                <span style={{ whiteSpace: 'nowrap' }}>
                  ZESPÓŁ
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#rejestracja">
              <a
                style={{ backgroundColor: '#52AE32' }}
                className="relative p-4 inline-flex justify-center items-center uppercase text-white text-tiny text-center font-bold rounded transition-all duration-300
                  "
                href="#rejestracja"
              >
                <span style={{ whiteSpace: 'nowrap' }}>
                  REJESTRACJA
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <section className="flex flex-col md:flex-row w-full h-auto lg:h-screen">
      {/* Lewa kolumna - tekst */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-start py-16 sm:py-8 lg:py-0 px-6 md:px-12 lg:px-16">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 mt-4">
          {event.name}
        </h2>
        <div className={styles.eventDetails}>
          <div className="text-balck text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
            <SchoolIcon className="text-balck w-6 h-6 mr-2" />
            {event.type}
          </div>
          <div className="text-balck text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
            <EventIcon className="text-balck w-6 h-6 mr-2" />
            {date}
          </div>
          <div className="text-balck text-base inline-block align-baseline">
            <PlaceIcon className="text-balck w-6 h-6 mr-2" />
            {event.location}
          </div>
        </div>
        <p className="text-lg md:text-xl text-gray-700 mt-4">
          {event.lead}
        </p>
        <Link href="#rejestracja" type="button">
          <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
            Zarejestruj się
          </a>
        </Link>
      </div>
      <div className="md:w-1/2 w-full h-full relative pt-0 pb-16 lg:pb-0">
        {/* Obraz dla urządzeń mobilnych */}
        <div className="relative w-full h-36 md:hidden">
          <Image
            src={`${url}/backend/assets/${event.image_mobile}`} 
            alt={event.name}
            layout="fill"
            objectFit="none"
            width="1238"
            height="423"
            className="rounded-l-lg"
          />
        </div>

        {/* Obraz dla komputerów */}
         <div className="relative w-full h-full hidden md:block">
          <Image
            src={`${url}/backend/assets/${event.image}`} 
            alt={event.name}            
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg"
          />
        </div>
      </div>
    </section>

    <section id="ORGANIZATORZY" className="flex flex-col items-center pt-6 pb-12 md:pt-0 md:pb-0">
      <div className="flex flex-col md:flex-row justify-center lg:gap-8 items-center space-y-6 md:space-y-0 md:space-x-8 w-full max-w-4xl">
        {/* Logo 1 */}
        <div className="relative w-52 h-52 lg:w-72 lg:h-72 flex justify-center items-center">
          <Image
            src="//static/events/dks.svg" // Zmień na odpowiednią ścieżkę do loga
            alt="Logo 1"
            // width={135}
            // height={135}
            className="object-contain"
            layout='fill'
          />
        </div>

        {/* Logo 2 */}
        <div className="relative w-52 h-52 lg:w-72 lg:h-72 flex justify-center items-center">
          <Image
            src="//static/events/loga/konica.svg" // Zmień na odpowiednią ścieżkę do loga
            alt="Logo 2"
            // width={135}
            // height={135}
            className="object-contain"
            layout="fill"
          />
        </div>

        {/* Logo 3 */}
        <div className="relative w-52 h-52 lg:w-72 lg:h-72 flex justify-center items-center">
          <Image
            src="//static/events/loga/remadays.svg" // Zmień na odpowiednią ścieżkę do loga
            alt="Logo 3"
            // width={135}
            // height={135}
            className="object-contain"
            layout="fill"
          />
        </div>
      </div>
    </section>

    {/* <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="ORGANIZATORZY" className="py-16">
          <div className="flex sm:flex-col md:flex-row items-center justify-center pb-8">

            <div className="px-4 mx-8 sm:pb-6">
              <Image src="//static/events/dks.svg" width="215px" height="60px" />
            </div>
            <div className="px-4 mx-8 sm:pb-6">
              <Image src="//static/events/loga/konica-logo.svg" width="215px" height="60px"             layout="fill" />
            </div>
            <div className="px-4 mx-8 sm:pb-6">
              <Image src="//static/events/loga/logo-color.webp" width="215px" height="60px" />
            </div>
          </div>
        </div>
      </div> */}

      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="NA-TARGACH" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">NA TARGACH RemaDays 2025</h2>
          <div className="flex sm:flex-col md:flex-row items-center py-8">
            <div className="sm:w-full md:w-1/2">
              <div className={styles.eventInfoRemaDeys2025}>
                <Image
                  src="//static/events/remadays2025/rema2025-grafiki-strona-com2-02.webp"
                  alt=""
                  width={1298}
                  height={1487}
                  className="object-cover md:object-contain object-top"

                />
              </div>
            </div>
            <div className="sm:w-full md:w-1/2 text-base pt-8 lg:pt-0">
              <p>Zapraszamy serdecznie na stoisko F3.05. 
                Podczas targów zaprezentujemy nowe podejście 
                do tematu ekologii w produkcji poligraficznej. 
                Bądźcie z nami od 28 do 31 stycznia w Nadarzynie 
                pod Warszawą. 
              </p>
              <ul className="list-disc pl-9 my-6">
                <li className="pb-4">NOWE PODEJŚCIE DO EKOLOGII, TO ROZWIĄZANIA OPARTE NA AUTOMATYZACJI I INNOWACJACH!</li>
                <li className="pb-4">EKOLOGIA W PRODUKCJI TO NIE TYLKO CERTYFIKATY NA TONERY, ATRAMENTY, FARBY, PAPIERY!</li>
              </ul>
              <p>
                Zaawansowany finiszing inline, 
                automatyczna kontrola procesów 
                i właściwie dobrane oprogramowanie to:
              </p>
              <ul className="list-disc pl-9 my-6">
                <li className="pb-4">oszczędność materiałów (papieru, tonerów)</li>
                <li className="pb-4">minimalizacja ryzyka reklamacji</li>
                <li className="pb-4">ograniczenie kosztownych stoków magazynowych</li>
                <li className="pb-4">skrócenie czasu realizacji zleceń</li>
                <li className="pb-4">znacząca redukcja koszów obsługi</li>
                <li className="pb-4">łatwe planowanie produkcji i pełna jej kontrola</li>
              </ul>
              <p>
                Zespół handlowy DKS wsparty przez ekspertów technicznych 
                i marketingowych z Konica Minolta zaprezentuje dwie kompletne 
                linie produkcyjne oparte na innowacyjnych 
                i zautomatyzowanych rozwiązaniach drukująco-introligatorskich. 
                Całość produkcji będzie wspierana przez oprogramowania dedykowane 
                dla obsługi urządzeń i dla kadry zarządzającej wymagającej 
                głębszych analiz produkcji. 
              </p>
            </div>
          </div>
        </div>

        <div id="NA-STOISKU" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">NA STOISKU F3.05</h2>
          <div className="flex flex-wrap sm:flex-col md:flex-row sm:flex-col md:flex-row py-12">
            <div className="flex flex-row items-center w-full md:w-1/4 p-4">

              <div className="flex justify-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#52AE32' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/print_connect.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Zarządzanie drukiem</p>
              </div>
            </div>
            <div className="flex flex-row items-center w-full md:w-1/4 p-4">
              <div className="flex justify-center  w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#52AE32' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/photo_prints.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Drukowanie</p>
              </div>
            </div>
            <div className="flex flex-row items-center w-full md:w-1/4 p-4">
              <div className="flex justify-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#52AE32' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/auto_stories.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Wykończenie introligatorskie</p>
              </div>
            </div>
            <div className="flex flex-row items-center w-full md:w-1/4 p-4">
              <div className="flex justify-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#52AE32' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/analytics.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Narzędzia analityczne</p>
              </div>
            </div>
          </div>
        </div>

        <div id="PREZENTOWANE-ROZWIAZANIA" className="lg:my-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PREZENTOWANE ROZWIĄZANIA</h2>
          <div className="flex sm:flex-col md:flex-wrap lg:flex-wrap">
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/remadays2025/KONICA-MINOLTA-AccurioPress-C12000.webp"
                    alt="KONICA MINOLTA AccurioPress C12000"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">KONICA MINOLTA AccurioPress C12000e</h3>
                <p>
                  Zaawansowany system produkcyjny 
                  dla drukarń obsługujących duże wolumeny 
                  druku cyfrowego. Dedykowany do regularnych 
                  comiesięcznych wolumenów powyżej 50000 przelotów. 
                  Wysoka szybkość druku, niższy koszt eksploatacji 
                  oraz wysoki poziom automatyzacji 
                  to główne zalety tego systemu. Zalecana konfiguracja 
                  z modułami Intelligent Quality Care Unit, 
                  Inspection Unit oraz kasetami umożliwiającymi podciśnieniowe 
                  podawanie papierów o długości do 900 mm jest 
                  odpowiedzią na potrzeby rynku związane z automatyzacją, 
                  niwelowaniem strat w produkcji i podciśnieniowym podawaniem 
                  dłuższych papierów z zakresu niskich i wysokich gramatur. 
                  Dopełnieniem konfiguracji może być na przykład wydajny finiszer 
                  do oprawy zeszytowej z cięciem z trzech stron i szyciem 
                  za pomocą zszywek lub drutu. 
                  Elastyczne w pełni definiowalne formaty rozliczeń kontraktów 
                  są dostępne tylko w urządzeniach Konica Minolta. 
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/remadays2024/KONICA-MINOLTA-C4080.webp"
                    alt="KONICA MINOLTA AccurioPress C7100"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">KONICA MINOLTA AccurioPress C7100</h3>
                <p>
                  Seria urządzeń C7100 z segmentu Medium Production 
                  to elastyczne systemy dedykowane dla firm 
                  pracujących na comiesięcznych wolumenach 
                  powyżej 20000 przelotów. 
                  Silne strony tych urządzeń to kompaktowa budowa 
                  w przypadku konfiguracji podstawowej, 
                  oraz możliwość rozbudowy o zaawansowane moduły 
                  do kontroli jakości i finiszingu inline. 
                  Konfiguracja z kasetami podciśnieniowymi 
                  obsługującymi podłoża do długości 900mm czyni 
                  ten model wyjątkowym dla segmentu drukarek 
                  Medium Production. Finiszing inline pozwalający 
                  na drukowanie m.in z automatycznym bigowaniem, 
                  perforowaniem i wycinaniem w jednym przebiegu. 
                  Takie rozwiązanie to absolutny hit na rynku urządzeń 
                  drukujących. W połączeniu z dedykowanym 
                  oprogramowaniem do impozycji daje automatyzację 
                  na najwyższym poziomie. 
                  Automatyczne rozliczanie kontraktów zależnie 
                  od pokrycia tonerem wydłuża listę korzyści. 
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/remadays2025/IQ.webp"
                    alt="IQ-501 zaawansowany moduł automatyzacji"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">IQ-501 zaawansowany moduł automatyzacji</h3>
                <p>
                  Ten wielozadaniowy moduł już w konfiguracji
                  podstawowej zapewnia najszybsze na rynku 
                  przygotowanie do produkcji w zakresie 
                  automatycznego ustawienia pasowania 
                  druku dwustronnego i stworzenia 
                  w ekspresowym tempie profili ICC. 
                  Dodatkowo w czasie rzeczywistym 
                  druku kontroluje ewentualne odchylenia 
                  registracji i je koryguje. 
                  Ale to nie wszystko, bo moduł ten w czasie 
                  rzeczywistym druku także kontroluje stabilność 
                  kolorystyczną i ją koryguje. 
                  Istnieje także możliwość rozbudowy modułu o 
                  opcję automatycznego wykrywania błędów druku 
                  takich jak zabrudzenia, brakujące elementy 
                  obrazu oraz uszkodzenia podłoża typu zagięcia, 
                  czy paragrafowanie. Na tym nie koniec, 
                  bo dla firm zajmujących się personalizacją druku 
                  w postaci kodów, zmiennych tekstów, 
                  czy zmiennych obrazów moduł może być gwarancją 
                  bezbłędnej produkcji. 
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/remadays2025/TU.webp"
                    alt="TU-510 zaawansowany finiszing inline"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">TU-510 zaawansowany finiszing inline</h3>
                <p>
                  Trzy wybrane procesy introligatorskie dostępne 
                  w jednym przebiegu razem z drukiem 
                  to najwyższy poziom automatyzacji. 
                  Zależnie od konfiguracji TU-510 może wykonywać 
                  m.in rozcinanie wzdłużne, 
                  wycinanie poprzeczne, 
                  perforowanie wzdłużne, 
                  perforowanie poprzeczne, 
                  wielokrotne bigowanie od góry oraz wielokrotne 
                  bigowanie od dołu arkusza. 
                  Idealne do szybkiego druku i wycinania wizytówek, 
                  które po wycięciu są gotowe do odbioru w specjalnie 
                  zaprojektowanej kasecie - wystarczy zapakować 
                  i wysłać do zamawiającego. Bilety do muzeum, 
                  na koncert, do siłowni? Dostępne na gotowo, 
                  wycięte z dodatkową perforacją! 
                  Okładki książek, 
                  zaproszenia lub foldery drukowane na podłożach 
                  o wyższej gramaturze? Wycięte na wymagany wymiar 
                  z gotowymi bigami! 
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/remadays2025/AccurioProFlux.webp"
                    alt="TU-510 zaawansowany finiszing inline"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">AccurioProFlux oprogramowanie dla operatora</h3>
                <p>
                  Skalowalne oprogramowanie dla operatora druku 
                  i finiszingu z możliwością rozbudowy do zaawansowanych 
                  możliwości, także w zakresie automatyzacji 
                  i zarządzania produkcją na każdym jej etapie 
                  od przyjęcia zlecenia po wystawienie faktury 
                  i listu przewozowego. Pozwala na sprawne zarządzanie 
                  drukiem z wykończeniem introligatorskim 
                  na wielu urządzeniach zarówno kolorowych jak 
                  i czarno-białych. 
                  Sprawne i przejrzyste kolejkowanie prac. 
                  Impozycja z możliwością ustawienia spadów 
                  i wielkości wycinki na arkuszu. 
                  Ustawienia dla pełnego zarządzania kolorem. 
                  Hot foldery dla powtarzających się 
                  lub podobnych zleceń. 
                  Raportowanie i tworzenia kart produkcyjnych. 
                  Na najwyższym poziomie rozbudowy także 
                  z pre-flightem oraz bezpieczną płatnością online.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/remadays2025/AccurioProDashboard.webp"
                    alt="TU-510 zaawansowany finiszing inline"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">AccurioProDashboard analityczne oprogramowanie dla zarządu</h3>
                <p>
                  Oprogramowanie to jest ważnym źródłem różnych 
                  danych analitycznych generowanych dla różnych osób, 
                  zależnie od ich roli i poziomu zarządzania. 
                  W pewnych obszarach mogą to być identyczne dane 
                  co ułatwi rejestracje, unifikację 
                  i raportowanie procesów. 
                  Jednak mogą to być inne dane dla liderów stanowisk, 
                  inne dla kierowników produkcji 
                  i jeszcze inne dla managerów wyższego szczebla. 
                  Oprogramowanie jest dedykowane dla drukarń 
                  realizujących wiele różnorodnych zleceń w krótkim 
                  czasie. Dzięki AccurioProDashboard analizy będą 
                  głębsze, dokładniejsze, bardziej przewidywalne 
                  i skuteczniejsze.
                </p>
              </div>
            </div>
          </div>
          <div id="TAKZE-W-OFERCIE-DKS" className="lg:my-16 py-4" style={{ scrollMarginTop: '200px' }}>
            <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">Także w ofercie DKS</h2>
            <div className="py-12">
              {/* <p className="text-left">Na targach Remadays na stoiskach innych naszych dostawców możemy zaprezentować także rozwiązania takie jak:</p> */}
              <ul className="list-disc pl-9">
                <li>
                  Wydajne urządzenia produkcyjne do druku czarno-białego
                </li>
                <li>
                  Urządzenia rolowe do druku etykiet
                </li>
                <li>
                  Rozwiązania do uszlachetniania wydruków 
                </li>
                <li>
                  Inne zaawansowane finiszery inline dla maszyn kolorowych i BW
                </li>
                <li>
                  Urządzenia introligatorskie offline takie gilotyny, foliarki, falcerki etc
                </li>
                <li>
                  Urządzenia do druku kolorowego i czarno białego mniej wydajne dla agencji reklamowych,, mniejszych drukarń lub ich biur
                </li>
                <li>
                  Urządzenia wielkoformatowe: drukarki, kopiarki, skanery, składarki
                </li>
                <li>
                  Analiza środowisk druku biurowego i jego optymalizacja
                </li>
                <li>
                  Sprzedaż materiałów, kontrakty serwisowe, serwis gwarancyjny i pogwarancyjny. 
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="PRELEGENCI" className="lg:my-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">ZESPÓŁ</h2>
          <div className="py-12">
            {speakers}
          </div>
        </div>

        <div id="rejestracja" className="py-4" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">REJESTRACJA</h2>
          <div className="py-12">
            <p className="text-center">Zachęcamy do rejestracji na targi przez nasz formularz a my zarezerwujemy dla Państwa zasoby do prezentacji, opiekunów handlowych oraz wygenerujemy identyfikator uprawniający do wejścia na halę. W przypadku zgłoszenia większej liczby osób wymagana jest rejestracja dla każdej osoby.</p>
            <QuestionnaireForm fields={fields} />
          </div>
        </div>
      </div>

    </Layout>
  );
}

export async function getStaticProps() {
  const eventsItem = await getEventsItem('remadays');

  return {
    props: {
      fields: await getFields(collectionName),
      eventsItem,
    },
    revalidate: 60, // 60,
  };
}

QuestionnaireForm.propTypes = {
  fields: PropTypes.string.isRequired,
};

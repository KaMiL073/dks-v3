import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import { submitFormGeneration } from '../../../lib/api/frontApi';
import Layout from '../../../components/layouts/layout';
import getFields from '../../../lib/models/fields';
import FieldElement from '../../../components/elements/input';
import addZero from '../../../lib/helpers/addZero';

import getEventsItem from '../../../lib/models/eventsItem';

import styles from '../../../styles/events.module.scss';

const collectionName = 'events';

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
      console.error('form: ', error);
    }
  };
  const fieldElement = fields.map((field) => (
    <div key={field.name}>
      <FieldElement
        dataField={field}
        event={nameEvent}
        register={register}
      />
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
          <a href="https://www.google.com/intl/pl/policies/privacy/" target="_blank" rel="noreferrer">Prywatność</a>
          <span aria-hidden="true" role="presentation"> - </span>
          <a href="https://www.google.com/intl/pl/policies/terms/" target="_blank" rel="noreferrer">Warunki</a>
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

const agendaItems = [
  {
    bloc: '09:00 Rejestracja uczestników  ',
    details: [
      {
        icon: '//static/events/icon/workshops.svg',
        hour: '09:00 do 10:00',
        time: '',
        title: 'Rejestracja uczestników ',
        speaker: '',
      },
    ],
  },
  {
    bloc: '10.00 wykłady blok 1',
    details: [
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '10:00 do 10:10',
        time: '(10 minut)',
        title: 'Powitanie uczestników i wprowadzenie do konferencji',
        speaker: 'Andrzej Ćwikliński - DKS',
      },
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '10:10 do 10:25',
        time: '(15 minut)',
        title: 'Druk na własne potrzeby - trendy rynkowe ',
        speaker: 'Tomasz Lipiec - Canon Polska',
      },
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '10:25 do 10:55',
        time: '(30 minut)',
        title: 'Integracja plików firmowych ze środowiskiem druku',
        speaker: 'Maciej Ofierzyński - DKS ',
      },
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '10:55 do 12:00',
        time: '(65 minut)',
        title: 'Urządzenia drukujące - dobór właściwych rozwiązań i konfiguracji',
        speaker: 'Monika Kruszyńska - DKS, Krzysztof Kuligowski - Canon Polska,',
      },
    ],
  },
  {
    bloc: '12:00 Przerwa',
    details: [
      {
        icon: '//static/events/icon/coffee.svg',
        hour: '12:00 do 12:30',
        time: '30 minut',
        title: 'Przerwa kawowa',
        speaker: '',
      },

    ],
  },
  {
    bloc: '12:30 Wykłady blok 2',
    details: [
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '12:30 do 12:50',
        time: '20 minut',
        title: 'Wyższy poziom procesu finiszingu inline ',
        speaker: 'Andrzej Ćwikliński - DKS',
      },
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '12:50 do 13:20 ',
        time: '30 minut',
        title: 'Proces finiszingu offline od prostych do zaawnsowanych rozwiązań ',
        speaker: 'Dominik Szulim - Akonda',
      },
      {
        icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
        hour: '13:20 do 13:35',
        time: '15 minut',
        title: 'Gdy formaty A4 i A3 to za mało - rozwiązania wielkoformatowe',
        speaker: 'Marek Mudent - DKS',
      },
      {
        icon: '//static/events/icon/Point-Scan.svg',
        hour: '13:35 do 13:50 ',
        time: '15 minut',
        title: 'Konkurs dla uczestników konferencji z atrakcyjnymi nagrodami',
        speaker: '',
      },

    ],
  },
  {
    bloc: '13:50 Część praktyczna. Lunch',
    details: [
      {
        icon: '//static/events/icon/workshops.svg',
        hour: '13:50 do 14:30 ',
        time: '(40 minut)',
        title: 'Część warsztatowa. Drukowanie z finiszingiem inline i pokazy finiszingu offline',
        speaker: 'Zespół: DKS, Canon Polska, Akonda',
      },
      {
        icon: '//static/events/icon/restaurant.svg',
        hour: '14:30 do 15:15',
        time: '(45 minut)',
        title: 'LUNCH',
        speaker: '',
      },
      {
        icon: '//static/events/icon/workshops.svg',
        hour: '15:15 do 16:30',
        time: '(75 minut)',
        title: 'Część warsztatowa. Drukowanie z finiszingiem online i pokazy finiszingu offline',
        speaker: 'Zespół: DKS, Canon Polska, Akonda',
      },
    ],
  },
];

const agenda = agendaItems.map(({
  bloc, details,
}) => (
  <div className="flex sm:flex-col md:flex-row w-full border-b-2 border-gray-400 pt-4">
    <div className="sm:w-full md:w-3/12">
      <p className="sm:text-lg md:text-3xl font-bold  text-gray-400">{bloc}</p>
    </div>
    <div className="flex flex-col">
      {details.map(({
        icon, hour, time, title, speaker,
      }) => (
        <div className="flex flex w-full p-4 my-6 ">
          <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{ backgroundColor: '#EA580C' }}>
            <div className="relative w-12 h-12">
              <Image
                src={icon}
                alt="icone"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-base font-bold">
              {hour}
              <span className="text-base font-normal">
                {' '}
                {time}
              </span>
            </div>
            <div>
              <p className="text-base font-normal">{title}</p>
              <p className="text-sm italic">{speaker}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
));

export default function questionnaire({ fields, eventsItem }) {
  const event = eventsItem;

  const speakers = event.speakers.map(({
    name, lastname, position, company, image, bio,
  }) => (
    <div className="w-full p-4 my-6">
      <div className="flex sm:flex-col md:flex-row">
        <div className="lg:w-1/4">
          <div className={`flex relative ${styles.speakerItems}`}>
            <Image
              src={process.env.assetsPath + image}
              alt={`${name} ${lastname}`}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <div className="lg:w-3/4 md:pl-2 lg:pl-4">
          <p className="block font-bold text-base">
            {name}
            {' '}
            {lastname}
          </p>
          <p className="block text-base" style={{ color: '#16A34A' }}>
            {position}
          </p>
          <p className="block text-base">
            {company}
          </p>
          <br />
          <p className="block text-base">
            {bio}
          </p>
        </div>
      </div>
    </div>
  ));

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

  return (

    <Layout useRecaptcha>
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
            <Link href="#O-KONFERENCJI">
              <a className="relative inline-flex justify-center items-center" href="#O-KONFERENCJI">
                <span style={{ whiteSpace: 'nowrap' }}>
                    O KONFERENCJI
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#DO-KOGO-ADRESUJEMY-KONFERENCJE">
              <a className="relative inline-flex justify-center items-center" href="#DO-KOGO-ADRESUJEMY-KONFERENCJE">
                <span style={{ whiteSpace: 'nowrap' }}>
                    DO KOGO ADRESUJEMY KONFERENCJĘ?
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#KORZYSCI">
              <a className="relative inline-flex justify-center items-center" href="#KORZYSCI">
                <span style={{ whiteSpace: 'nowrap' }}>
                    KORZYśCI
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#AGENDA">
              <a className="relative inline-flex justify-center items-center" href="#AGENDA">
                <span style={{ whiteSpace: 'nowrap' }}>
                    AGENDA
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#PRELEGENCI">
              <a className="relative inline-flex justify-center items-center" href="#PRELEGENCI">
                <span style={{ whiteSpace: 'nowrap' }}>
                PRELEGENCI
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#O-PREZENTOWANYCH-ROZWIAZANIACH">
              <a className="relative inline-flex justify-center items-center" href="#O-PREZENTOWANYCH-ROZWIAZANIACH">
                <span style={{ whiteSpace: 'nowrap' }}>
                    O PREZENTOWANYCH URZĄDZENIACH / ROZWIĄZANIACH
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#rejestracja">
              <a
                style={{ backgroundColor: '#EA580C' }}
                className="relative p-4 inline-flex justify-center items-center uppercase text-white text-tiny text-center font-bold rounded transition-all duration-300"
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

      <div id="INFORMACJE-OGoLNE" className={`w-full ${styles.eventBgColorDNWPJL}`} style={{ scrollMarginTop: '200px' }}>
        <div className="relative">
          <div className={styles.eventContentJDWM}>
            <div className="md:w-6/12 lg:w-2/5 xl:w-6/12">
              <h2 className="sm:text-3xl md:text-4xl font-black" style={{ color: '#ffffff' }}>
                {event.name}
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-white text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-white w-6 h-6 mr-2" />
                  {event.type}

                </div>
                <div className="text-white text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-white w-6 h-6 mr-2" />

                  {date}

                </div>
                <div className="text-white text-base inline-block align-baseline">
                  <PlaceIcon className="text-white w-6 h-6 mr-2" />
                  {event.location}
                </div>
              </div>
              <p className="text-white">
                {event.lead}
              </p>
              <br />

              <Link href="#rejestracja" type="button">
                <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                  Zarejestruj się
                </a>
              </Link>
            </div>
          </div>
          <div
            className={styles.eventbgAD}
            style={{
              backgroundImage: `url(https://dks.pl/backend/assets/${event.image})`,
            }}
          />
        </div>
      </div>

      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="ORGANIZATORZY" className="py-16">
          <div className="flex sm:flex-col md:flex-row items-center justify-center pb-8">
            <div className="px-4 mx-8 uppercase">
              <h2 className="text-2xl  sm:text-center sm:pb-6">Organizator konferencji</h2>
            </div>
            <div className="px-4 mx-8 sm:pb-6">
              <Image src="//static/events/dks.svg" width="215px" height="60px" />
            </div>

          </div>
          <div className="flex sm:flex-col md:flex-row items-center">
            <div className="px-4 mx-8 uppercase">
              <h2 className="text-2xl sm:text-center sm:pb-6">PARTNER TECHNOLOGICZNY:</h2>
            </div>
            <div className="px-4 mx-8 sm:pb-6">
              <Image src="https://dks.pl/backend/assets/d5465654-023a-4ea0-89a3-02747ba8c647?imwidth=1920" width="215px" height="60px" />
            </div>
            <div className="px-4 mx-8 uppercase">
              <h2 className="text-2xl sm:text-center sm:pb-6">WSPÓŁPRACA</h2>
            </div>
            <div className="px-4 mx-8">
              <Image src="https://dks.pl/static/events/akonda.svg?imwidth=384" width="262px" height="66px" />
            </div>
          </div>

          <div className="flex flex-col w-11/12 mx-auto pt-8">
            <p>Kontakt do wybranych konsultantów:</p>
            <div className="flex  items-center justify-between pt-4">
                <div className="text-center"><p>Katarzyna <br />539 735 216</p></div>
                <div className="text-center"><p>Monika <br />795 522 422</p></div>
                <div className="text-center"><p>Andrzej <br />664 042 295</p></div>
                <div className="text-center"><p>Marek <br />602 578 325</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:max-w-screen-xl px-4 xl:px-0">

        <div id="O-KONFERENCJI" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ backgroundColor: '#F7F7F7'}}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">O KONFERENCJI</h2>
          <div className="flex sm:flex-col md:flex-row items-center py-8 gap-4">
            <div className="sm:w-full md:w-1/2">
              <div className={styles.eventInfo}>
                <Image
                  src="//static/events/drukowanie-na-wlasne-potrzeby/image-3_5.webp"
                  alt=""
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="sm:w-full md:w-1/2 text-base">
              <p>Zakres tematyczny obejmuje między innymi drukowanie materiałów takich jak:</p>
              <ul className="list-disc pl-9 my-6">
                <li>instrukcje obsługi,</li>
                <li>materiały szkoleniowe,</li>
                <li>dokumenty logistyczne,</li>
                <li>dokumenty techniczne,</li>
                <li>materiały marketingowe,</li>
                <li>faktury, rachunki i inne dokumenty.</li>
              </ul>
              <br />
              <p>Pokażemy cały proces produkcji drukowanych materiałów obejmujący:</p>
              <ul className="list-disc pl-9 my-6">
                <li>integrację plików firmowych ze środowiskiem wydajnego druku,</li>
                <li>właściwy dobór urządzeń do druku nisko, średnio i wysoko wydajnego,</li>
                <li>wykończenie introligatorskie.</li>
              </ul>
            </div>
          </div>
        </div>

        <div id="DO-KOGO-ADRESUJEMY-KONFERENCJE" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">Do kogo adresujemy konferencję?</h2>
          <div className="flex flex-wrap sm:flex-col md:flex-row sm:flex-col md:flex-row py-12">
            <div className="flex flex-row items-center w-full md:w-1/3 p-4">

              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/local_library.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Firm szkoleniowych</p>
              </div>
            </div>
            <div className="flex flex-row items-center w-full md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/view_in_ar.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Firm projektowych, konstrukcyjnych i inżynieryjnych</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/home.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Sieci handlowych, restauracyjnych, hotelowych</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/deployed_code_history.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Zakładów produkcyjnych</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/school.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Placówek edukacyjnych</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/foundation.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Fundacji</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/local_shipping.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Firm logistycznych i transportowych</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/apartment.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Urzędów</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/e-shop.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Sklepów internetowych</p>
              </div>
            </div>
          </div>
          <p className="text-base text-center">I innych firm lub instytucji, którym do bieżącej działalności są potrzebne drukowane dokumenty.</p>
        </div>

        <div id="KORZYSCI" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ backgroundColor: '#F7F7F7', scrollMarginTop: '200px'}}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">KORZYŚCI</h2>
          <p className="text-base text-center">Posiadanie wewnętrznego działu druku - (print room) przynosi firmom konkretne korzyści:</p>
          <div className="flex flex-wrap sm:flex-col md:flex-row sm:flex-col md:flex-row py-12">
            <div className="flex flex-row items-center w-full md:w-1/3 p-4">

              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/attach_money.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Wymierne korzyści finansowe</p>
              </div>
            </div>
            <div className="flex flex-row items-center w-full md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/history.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Krótszy czas realizacji projektów</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/description.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Łatwa zmiana treści drukowanych dokumentów</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-16 h-16">
                  <Image
                    src="//static/events/icon/monitoring.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Wyższa wydajność i sprawne działanie firmy</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/security.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Ochrona wrażliwych danych i treści</p>
              </div>
            </div>
            <div className="flex flex-row w-full items-center md:w-1/3 p-4">
              <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{ backgroundColor: '#EA580C' }}>
                <div className="relative w-12 h-12">
                  <Image
                    src="//static/events/icon/recycling.svg"
                    alt="icone"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="text-base ml-4">
                <p>Ochrona środowiska dzięki redukcji wytwarzanej makulatury</p>
              </div>
            </div>
          </div>
        </div>

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px'}}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#EA580C' }}>
              18-06-2024
              {' '}
              <br />
              <span className="text-black text-lg">Wtorek</span>
            </h3>
          </div>

          {agenda}

        </div>

        <div id="PRELEGENCI" className="pt-8" style={{ scrollMarginTop: '200px', backgroundColor: '#F7F7F7', scrollMarginTop: '200px'}}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PRELEGENCI</h2>
          {speakers}
        </div>

        <div id="O-PREZENTOWANYCH-ROZWIAZANIACH" className="lg:my-16" style={{ scrollMarginTop: '200px'}}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">
            O PREZENTOWANYCH URZĄDZENIACH / ROZWIĄZANIACH
          </h2>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-_7.webp"
                    alt="Prisma Workflow"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">Prisma Workflow</h3>
                <p>
                    Oparte na chmurze narzędzia do zarządzania informacjami zapewniają dokładne, 
                    kompleksowe dane umożliwiające efektywne
                    zarządzanie kosztami i maksymalizację wydajności drukowania. 
                    Wielofunkcyjne rozwiązanie do przygotowywania zadań 
                    do druku pomaga przyspieszyć przygotowanie dokumentów – od 
                    ich złożenia do produkcji. 
                    Rodzina produktów Prisma między innymi usprawnia cały cykl przygotowania 
                    do druku.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-_8.webp"
                    alt="Canon imageRUNNER ADVANCE DX 8995"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">Canon imageRUNNER ADVANCE DX 8995</h3>
                <p>
                    Wydajne urządzenie wielofunkcyjne do drukowania 
                    i kopiowania czarno-białego dostępne 
                    w trzech opcjach szybkości druku (86 A4/min, 95 A4/min, 105 A4/min). 
                    Dedykowane do regularnych miesięcznych wolumenów 80-120 tysięcy wydruków A4. 
                    Do urządzenia dostępna jest szeroka gama opcjonalnych 
                    finiszerów umożliwiających proste i jak 
                    i zaawansowane wykończenie typu: dziurkowanie, zszywanie w trybie Eco, 
                    pięć różnych opcji składania arkuszy, 
                    wstawianie wcześniej zadrukowanych stron, grupowanie stron i oprawa zeszytowa.
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5.webp"
                    alt="Canon varioPRINT 140"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">Canon varioPRINT 140</h3>
                <p>Wysoka szybkość druku czarno-białego w rewolucyjnej technologii DirectPress.
                    Urządzenia produkcyjne z tej serii są dostępne 
                    w trzech szybkościach (115 ark/min, 130 ark/min, 140 ark/min). 
                    Dedykowane do regularnych miesięcznych wolumenów 100-300 tysięcy stron A4. 
                    W peakach możliwe jest obciążenie miesięczne powyżej 500 tysięcy stron A4. 
                    Dostępny bogaty finiszing online. Urządzenie przyjazne dla środowiska, 
                    między innymi dzięki zerowej emisji ozonu oraz mniejszemu zużyciu energii.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-10.webp"
                    alt="iEcho z serii PK"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">Canon imagePRESS C270</h3>
                <p>Wielofunkcyjne urządzenie do druku i kopiowania w kolorze. 
                    Rozwiązanie jest dostępne w dwóch wersjach szybkości 
                    dla druku kolorowego (65  ark/min oraz 70 ark/min). 
                    Sugerowany miesięczny wolumen dla tych  urządzeń to 10-50 tyś stron A4. 
                    Opcjonalnie dostępne z kompaktowymi finiszerami umożliwiającymi 
                    między innymi: zszywanie narożne, oprawę zeszytową, 
                    przycinanie broszur, dziurkowanie, 
                    pięć rodzajów składania oraz insertowanie wcześniej 
                    zadrukowanych arkuszy.
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-11.webp"
                    alt="Canon varioPRINT 140"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">Canon imagePROGRAF TM-255</h3>
                <p>
                    24 calowa wielkoformatowa drukarka wielofunkcyjna z wbudowanym dyskiem twardym. 
                    Dedykowana dla firm, które dla własnych potrzeb realizują drukowanie 
                    i kopiowanie niewielkich wolumenów prac w       formatach A2 i A1. 
                    Idealne rozwiązanie do drukowania, 
                    kopiowania i skanowania rysunków CAD, 
                    plakatów i materiałów edukacyjnych.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-12.webp"
                    alt="Canon imagePROGRAF TZ-30000 MFP Z36"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">Canon imagePROGRAF TZ-30000 MFP Z36</h3>
                <p>Zintegrowana wielkoformatowa, atrametowa, 36 calowa drukarka 
                    wielofunkcyjna dedykowana dla firm, które mają potrzebę szybkiego 
                    i wydajnego drukowania oraz skanowania prac w formatach A2, A1 do A0. 
                    Drukuje z szybkością do 4 stron A1 na minutę. Idealne rozwiązanie 
                    do druku rysunków CAD, map, projektów, plataktów i materiałów edukacyjnych. 
                    o wydruków wykorzystuje pięć kolorów atrametów. Urządzenie dwurolkowe.
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-13.webp"
                    alt="krajarka Digicut 49"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">krajarka Digicut 49</h3>
                <p>
                    DigiCut 49 to gilotyna do cięcia stosu papieru o szerokości do 490 mm. 
                    Urządzenie jest dostępne z programatorem. 
                    To kompaktowy produkt z kurtynami fotokomórki zapewniającymi bezpieczną pracę. 
                    Możliwe cięcie papieru w stosie do 80 mm. 
                    Zachowuje dużą dokładność cięcia dzięki zastosowaniu elektrycznego, 
                    regulowanego docisku.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-14.webp"
                    alt="ploter do etykiet Saga SG-SC 30 II"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">ploter do etykiet Saga SG-SC 30 II</h3>
                <p>
                    Nabiurkowy ploter do cięcia etykiet. Saga SG-SC 30 II, to ekonomiczne, 
                    małe, kompaktowej konstrukcji urządzenie tnące oferujące możliwość 
                    pracy na różnych materiałach typu PVC, PET, papiery powlekane czy kraftowe. 
                    Obsługuje podłoża o formacie do 330x483mm. Automatyczne ropoznawanie marek, 
                    czytnik kodów QR 
                    oraz kamera CCD zapewniają produktywność oraz dokładność skanowania i cięcia.
                </p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-15.webp"
                    alt="bigówka Ausjetech Swift 335"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">bigówka Ausjetech Swift 335</h3>
                <p>
                    Narzędzie do bigowania grubszych podłoży z których łamaniem nie radzą
                    sobie finiszery inline urządzeń drukujących. Sprawdzi się przy bigowaniu okładek, 
                    zaproszeń i innych prac drukowanych na wysokich gramaturach. 
                    Bigówka półautomatyczna Swift 335 z ręcznym podawaniem arkuszy sprowadza 
                    pracę operatora tylko do wsunięcia arkusza między wałki wprowadzające. 
                    Bigówka posiada bardzo wygodną klawiaturę i programator a także 
                    automatyczną kalibrację. 
                    Dostępna funkcja bigowania progresywnego i opcja perforacji częściowej z listwy.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/drukowanie-na-wlasne-potrzeby/Rectangle-5-17.webp"
                    alt="bigówka Ausjetech Swift 335"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">falcerko-zszywarka Oursun M6+</h3>
                <p>
                    Zewnętrzne urządzenie do oprawy zeszytowej. 
                    Półautomatyczne rozwiązanie falcujące i zszywające broszury drutem. 
                    Polecane wszędzie tam, 
                    gdzie zszywki finiszerów inline są barierą kosztową dla instrukcji obsługi.  
                </p>
              </div>
            </div>
          </div>
        </div>

        <div id="rejestracja" style={{ scrollMarginTop: '200px' }}>
          <QuestionnaireForm fields={fields} />
        </div>
      </div>

    </Layout>
  );
}

export async function getStaticProps() {
  const eventsItem = await getEventsItem('drukowanie-na-wlasne-potrzeby');

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

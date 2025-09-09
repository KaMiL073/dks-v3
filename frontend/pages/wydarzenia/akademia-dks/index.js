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
    <div key={field.name}><FieldElement dataField={field} event={nameEvent} register={register} /></div>
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
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '08:30 do 09:00',
    time: '(30 minut)',
    title: 'Rejestracja uczestników ',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '09.00 do 09:30',
    time: '(30 minut)',
    title: 'CDR – Druk wysoko wolumenowy na żądanie',
    speaker: 'Tomasz Lipiec - Canon, Maciej Ofierzyński - DKS Sp. z o.o.',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '09:40 do 10:10',
    time: '(30 minut)',
    title: 'AI for all – rozwiązania Lenovo wspierająca sztuczną inteligencję ',
    speaker: 'Maciej Spodek - Lenovo',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '10:20 do 10.50',
    time: '(30 minut)',
    title: 'AutoID – rozwiązania identyfikacyjne Zebra, Sato, GoDex  ',
    speaker: 'Krzysztof Domański, Karol Łużyński- Koncept-L ',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11:00 do 11:30',
    time: '(30 minut)',
    title: 'Green IT dzięki systemom do zarządzania drukiem',
    speaker: 'Adam Ziółkowski - DKS Sp. z o.o.',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11:45 do 13:00',
    time: '(75 minut)',
    title: 'Szkolenie strzeleckie ',
    speaker: '',
  },
  {
    icon: '//static/events/icon/restaurant.svg',
    hour: '13:00 do 13:30',
    time: '(30 minut)',
    title: 'Lunch',
    speaker: '',
  },
  {
    icon: '//static/events/icon/cel.svg',
    hour: '13:30 do 14:30',
    time: '(60 minut)',
    title: 'Konkurs strzelecki',
    speaker: '',
  },
  {
    icon: '//static/events/icon/Point-Scan.svg',
    hour: '14:30 do 15:00',
    time: '(30 minut)',
    title: 'Wręczenie nagród',
    speaker: '',
  },
  {
    icon: '//static/events/icon/Point-Scan.svg',
    hour: '15:00',
    time: '',
    title: '15:00 Zakończenie',
    speaker: '',
  },
];
const agenda = agendaItems.map(({
  icon, hour, time, title, speaker,
}) => (
  <div className="flex flex-row w-full p-4 my-6">
    <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{ backgroundColor: '#3C7C7C' }}>
      {/* <SchoolIcon className="text-white w-12 h-12" /> */}
      {/* <Image src={icon} alt="icone" width="64px" height="64px" /> */}
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
              {name} {lastname}
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

    if ( event.end_date === null) {
       date = dayMonthHourFormat.format(startDate);
    } else {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();   
        const month = endDate.getMonth() + 1; 
        const year = endDate.getFullYear()
        date = `${addZero(startDay) + "/" + addZero(endDay).padStart(2, 0) + "." + addZero(month) + "." + addZero(year)}`
      }

    return (
    <Layout useRecaptcha>
      <div className="w-full bg-black py-2 text-white sticky top-20 z-40">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto grow snap-mandatory overflow-x-auto text-xs">
          <div className="snap-start p-2">
            <Link href="#INFORMACJE-OGoLNE">
              <a className="relative inline-flex justify-center items-center" href="#rejestracja">
                <span style={{ whiteSpace: 'nowrap' }}>
                  INFORMACJE OGÓLNE
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
            <Link href="#rejestracja">
              <a
                style={{ backgroundColor: '#16A34A' }}
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

      <div id="INFORMACJE-OGoLNE" className={`w-full ${styles.eventBgColorAD}`} style={{ scrollMarginTop: '200px' }}>
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
          {/* <div className={styles.eventbgJDWM} style={{ backgroundImage: `url(${process.env.assetsPath + event.image})` }} /> */}
          <div className={styles.eventbgAD} style={{ backgroundImage: `url(https://dks.pl/backend/assets/${event.image})` }} />
   
        </div>
      </div>

      <div className="md:max-w-screen-xl px-4 xl:px-0">

      <div id="O-KONFERENCJI-OGOLNE" className="sm:text-2xl text-5xl sm:py-4 md:py-16">
            <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">O KONFERENCJI</h2>
            <div className="flex sm:flex-col md:flex-row items-center py-8">
              <div className="sm:w-full md:w-1/2">
                <div className={styles.eventInfo}>
                  <Image
                    src="//static/events/akademia-dks/image-3-_4_.webp"
                    alt=""
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="sm:w-full md:w-1/2 text-base">
                <p>Poznaj technologię CDR umożliwiającą druk wysoko wolumenowy na żądanie, co przyczynia się do efektywności i redukcji kosztów. Lenovo przedstawi rozwiązania oparte na sztucznej inteligencji (AI for all), które wspierają firmy poprzez zastosowanie inteligentnych narzędzi w codziennych operacjach.</p>
                <br/>  <p>Nie zabraknie także prezentacji wiodących rozwiązań AutoID od Zebra, Sato i GoDex, które usprawniają procesy identyfikacyjne w firmach.
Dodatkowo, zgłębimy tematykę Green IT i systemów do zarządzania drukiem, które pozwalają na osiągnięcie zrównoważonego rozwoju poprzez redukcję zużycia papieru.
Na konferencji czekają również atrakcje! Skorzystamy z możliwości strzelania na strzelnicy, która oferuje trzy osie strzeleckie:</p>
                <br/><p>Oś 25 m: 5 stanowisk dla pistoletu, zadaszona i zlokalizowana na świeżym powietrzu. <br />
Oś 50 m: 6 stanowisk, zadaszona, umożliwiająca strzelanie z postaw stojącej i leżącej, wyposażona w tarczo-ciągi, co eliminuje konieczność chodzenia do tarcz na zewnątrz.
<br />Oś 100 m: 1 stanowisko, zadaszona, z ekranem do podglądu, umożliwiająca strzelanie z postawy siedzącej za stołem.
              </p>
              </div>
            </div>
        </div>

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#3C7C7C' }}>
              14.05.2024
            </h3>
          </div>
          <div className="flex sm:flex-col md:flex-row border-t-2 border-gray-400">
            <div className="sm:w-full md:w-full">
              {agenda}
            </div>
          </div>
          <div className="flex justify-center w-full">
            <Link href="#rejestracja" type="button">
              <a className="bg-dks-footer md:w-48 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                Zarejestruj się
              </a>
            </Link>
          </div>
        </div>

        <div id="PRELEGENCI" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PRELEGENCI</h2>
          {speakers}
        </div>

        <div id="rejestracja" style={{ scrollMarginTop: '200px' }}>
          <QuestionnaireForm fields={fields} />
        </div>
      </div>

    </Layout>
  );
}

export async function getStaticProps() {
    const eventsItem = await getEventsItem('akademia-dks');

    return {
      props: {
        fields: await getFields(collectionName),
        eventsItem: eventsItem,
      },
      revalidate: 60, // 60,
  };
}

QuestionnaireForm.propTypes = {
  fields: PropTypes.string.isRequired,
};

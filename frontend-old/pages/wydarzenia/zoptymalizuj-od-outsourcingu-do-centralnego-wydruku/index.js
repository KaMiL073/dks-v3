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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
    icon: '//static/events/icon/Point-Scan.svg',
    hour: '09:30 do 10:00',
    time: '',
    title: 'Rejestracja użytkowników',
    speaker: '',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '10:00 do 10:15',
    time: '',
    title: 'Przywitanie',
    speaker: '',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '10:15 do 11:15',
    time: '',
    title: 'Od outsourcingu do wydruku centralnego',
    speaker: 'Marcin Kaczmarczyk, Adam Ziółkowski, DKS',
  },
  {
    icon: '//static/events/icon/coffee.svg',
    hour: '11.15 do 11.30',
    time: '',
    title: 'Przerwa',
    speaker: '',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '11:30 do 12:00 ',
    time: '',
    title: 'Audyt środowiska druku - klucz do optymalizacji',
    speaker: 'Marcin Kaczmarczyk, Marek Mudent - DKS ',
  },
  {
    icon: '//static/events/icon/restaurant.svg',
    hour: '12:00 do 13:00',
    time: '',
    title: 'lunch, rozmowy indywidualne ',
    speaker: '',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '13:00 do 14:30',
    time: '',
    title: 'Laptopy, stacje robocze, telefony',
    speaker: 'Rafał Danis, Damian Bugalski, Maciej Misiewicz - Lenovo',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '14:30 do 15:00',
    time: '',
    title: 'Drukarki etykiet, skanery',
    speaker: 'Krzysztof Domański - Koncept L',
  },
  {
    icon: '//static/events/icon/Point-Scan.svg',
    hour: '15:00 – 15:30',
    time: '',
    title: 'Konkurs i Pożegnanie',
    speaker: '',
  },
];
const agenda = agendaItems.map(({
  icon, hour, time, title, speaker,
}) => (
  <div className="flex flex-row w-full p-4 my-6">
    <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{ backgroundColor: '#3E75BB' }}>
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
            {name}
            {' '}
            {lastname}
          </p>
          <p className="block text-base" style={{ color: '#3E75BB' }}>
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
  const aboutTheConference = [
    {
      image: '//static/events/zoptymalizuj-od-outsourcingu-do-centralnego-wydruku/Rectangle-4-24.webp',
      title: 'Uzyskaj raport z audytu środowiska druku ',
      test: `Uczestnicy będą mogli zobaczyć i uzyskać cenny 
                    raport zawierający analizę dotyczącą efektywności 
                    ich procesów drukowania. Raport ten pomoże 
                    zidentyfikować obszary optymalizacji 
                    oraz potencjalne oszczędności związane 
                    z zużyciem materiałów.`,
    },
    {
      image: '//static/events/zoptymalizuj-od-outsourcingu-do-centralnego-wydruku/Rectangle-4-25.webp',
      title: 'Najnowsza wiedza z zakresu rozwiązań drukowania, laptopów oraz drukarek etykiet',
      test: ` Prezentacje ekspertów z branży druku oraz 
                    producentów sprzętu IT dostarczą uczestnikom najświeższej 
                    wiedzy dotyczącej innowacyjnych rozwiązań w dziedzinie 
                    technologii druku, laptopów i drukarek etykiet. Uczestnicy 
                    będą mogli poznać najnowsze trendy i technologie, 
                    które mogą zastosować w swoich firmach.`,
    },
    {
      image: '//static/events/zoptymalizuj-od-outsourcingu-do-centralnego-wydruku/Rectangle-4-26.webp',
      title: 'Systemy Zarządzania Wydrukiem',
      test: `System Zarządzania wydrukiem to potężne narzędzie służące do m.in. śledzenia 
                    i zabezpieczenia druku, kontroli kosztów jak i definiowania reguł. 
                    Pozwala doskonale zredukować koszty i stanowi ważną opcję w procesie 
                    optymalizacji środowiska druku. Na konferencji uzyskacie Państwo wiedze 
                    z zakresu możliwości systemu, ale również będziecie mieli okazje przetestowania 
                    ich w praktyce.`,
    },
    {
      image: '//static/events/zoptymalizuj-od-outsourcingu-do-centralnego-wydruku/Rectangle-4-27.webp',
      title: 'Konkursy',
      test: `Konferencja oferuje nie tylko wiedzę, 
                    ale także interaktywne elementy rozrywki i nauki. 
                    Uczestnicy będą mieli okazję wziąć udział w konkursach, 
                    które pozwolą im sprawdzić swoją wiedzę 
                    i zdobyć atrakcyjne nagrody.`,
    },
  ];
  const about = aboutTheConference.map(({
    test, image, title,
  }) => (
    <div className="lg:w-1/4 py-2">
      <div className={`flex relative ${styles.speakerItems}`}>
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="contain"
        />
      </div>
      <div className="md:pl-2 lg:pl-4 text-lg">
        <p className="block font-bold ">
          {title}
        </p>
        <p className="block text-base pt-4">
          {test}
        </p>
      </div>
    </div>
  ));

  return (

    <Layout useRecaptcha>
      <div className="w-full bg-black py-2 text-white sticky top-20 z-30 ">
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

      <div id="INFORMACJE-OGoLNE" className={`w-full ${styles.eventBgColorZOODCw}`} style={{ scrollMarginTop: '200px' }}>
        <div className="relative">
          <div className={styles.eventContentJDWM}>
            <div className="md:w-6/12 lg:w-2/5 xl:w-6/12">
              <h2 className="sm:text-3xl md:text-4xl font-black" style={{ color: '#000000' }}>
                {event.name}
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-black w-6 h-6 mr-2" />
                  {event.type}

                </div>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-black w-6 h-6 mr-2" />

                  {date}

                </div>
                <div className="text-black text-base inline-block align-baseline">
                  <PlaceIcon className="text-black w-6 h-6 mr-2" />
                  {event.location}
                </div>
              </div>
              <p className="text-black">
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
              <Image src="https://dks.pl/static/events/partners/lenovo.svg?imwidth=256" width="215px" height="60px" />
              <Image src="https://dks.pl/static/events/koncplt-l.svg?imwidth=256" width="215px" height="60px" />
            </div>

          </div>
        </div>
      </div>
      <div className="md:max-w-screen-xl px-4 xl:px-0">

        <div id="O-KONFERENCJI" className="sm:text-2xl text-5xl sm:py-4 md:py-16">
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">O KONFERENCJI</h2>
          <div className="w-full p-4 my-6">
            <div className="flex sm:flex-col md:flex-row">
              {about}
            </div>
          </div>
        </div>

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#3E75BB' }}>
              19-06-2024
              {' '}
              <br />
              <span className="text-black text-lg">Wtorek</span>
            </h3>
          </div>

          {agenda}

        </div>

        <div id="PRELEGENCI" className="pt-8" style={{ scrollMarginTop: '200px', backgroundColor: '#F7F7F7' }}>
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
  const eventsItem = await getEventsItem('zoptymalizuj-od-outsourcingu-do-centralnego-wydruku');

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

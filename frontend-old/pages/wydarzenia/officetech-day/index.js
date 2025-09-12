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



const agenda = event.agenda.map(({
  name, start_date, end_date, speakers, icon,
}) => (
  // <div className="flex sm:flex-col md:flex-row w-full border-b-2 border-gray-400 pt-4">
  //   <div className="sm:w-full md:w-3/12">
  //     <p className="sm:text-lg md:text-3xl font-bold  text-gray-400">{bloc}</p>
  //   </div>
    <div className="flex flex-col">
        <div className="flex flex w-full p-4 my-6 ">
          <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{ backgroundColor: '#63C043' }}>
            <div className="relative w-12 h-12">
              <Image
                src={`//static/events/icon/${icon}.svg`}
                alt="icone"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <div className="ml-4">
            <div className="text-base font-bold">
              {start_date ? ` - ${start_date.slice(0, 5)}` : ""}
              <span className="text-base font-normal">
                {end_date ? ` - ${end_date.slice(0, 5)}` : ""}
              </span>
            </div>
            <div>
              <p className="text-base font-normal">{name}</p>
              <p className="text-sm italic">
                {speakers
                  .map(({ name, lastname }) => `${name} ${lastname}`)
                  .join(', ')}
              </p>
            </div>
          </div>
        </div>
    </div>
  // </div>
));

const consultantsItems = [
  {
    consultant: 'Bernadeta Woźniak',
    image: '//static/events/people/Bernadeta-Wozniak.webp',
    company: 'DKS Sp. z o.o.',
  },
  {
    consultant: 'Mateusz Frącz',
    image: '//static/events/people/Mateusz-Fracz.webp',
    company: 'DKS Sp. z o.o.',
  },
  {
    consultant: 'Paweł Marcinowski',
    image: '//static/events/people/Pawel-Marcinowski.webp',
    company: 'DKS Sp. z o.o.',
  },
  {
    consultant: 'Dominik Spodek',
    image: '//static/events/people/Dominik-Spodek.webp',
    company: 'JARLTECH Europe GmbH/Zebra',
  },
];
const consultants = consultantsItems.map(({
  consultant, image, company,
}) => (
  <div className="lg:w-1/4 py-2">
    <div className={`flex relative ${styles.speakerItems}`}>
      <Image
        src={image}
        alt={consultant}
        layout="fill"
        objectFit="contain"
      />
    </div>
    <div className="md:pl-2 lg:pl-4 text-center">
      <p className="block font-bold text-base">
        {consultant}
      </p>
      <p className="block text-base">
        {company}
      </p>
    </div>
  </div>
));

const speakers = event.speakers.sort((a, b) => a.sort - b.sort).map(({
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
        <p className="block text-base" style={{ color: '#1C7300' }}>
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
            <Link href="#CO-CIE-CZEKA">
              <a className="relative inline-flex justify-center items-center" href="#CO-CIE-CZEKA">
                <span style={{ whiteSpace: 'nowrap' }}>
                  CO CIĘ CZEKA?
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#AGENDA">
              <a className="relative inline-flex justify-center items-center" href="#">
                <span style={{ whiteSpace: 'nowrap' }}>
                  AGENDA
                </span>
              </a>
            </Link>
          </div>

          <div className="snap-start p-2">
            <Link href="#PARTNERZY">
              <a className="relative inline-flex justify-center items-center" href="#PARTNERZY">
                <span style={{ whiteSpace: 'nowrap' }}>
                  PARTNERZY
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
            <Link href="#KONSULTANCI">
              <a className="relative inline-flex justify-center items-center" href="#KONSULTANCI">
                <span style={{ whiteSpace: 'nowrap' }}>
                KONSULTANCI
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

      <section id="INFORMACJE-OGoLNE" className="flex flex-col md:flex-row w-full h-auto lg:h-screen">
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
        <div className="relative w-full h-96 md:hidden">
          <Image
            src={`${url}/backend/assets/${event.image_mobile}`} 
            alt={event.name}
            layout="fill"
            objectFit="contain"
            width="634"
            height="562"
            className="rounded-l-lg"
          />
        </div>

        {/* Obraz dla komputerów */}
         <div className="relative w-full h-full hidden md:block">
          <Image
            src={`${url}/backend/assets/${event.image}`} 
            alt={event.name}            
            layout="fill"
            objectFit="contain"
            className="rounded-l-lg"
          />
        </div>
      </div>
    </section>
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="CO-CIE-CZEKA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <div className="flex sm:flex-col md:flex-row md:flex-row-reverse items-center py-8">
          <div className="sm:w-full md:w-1/2 text-base pt-8 lg:pt-0">
              <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6"> 
                Co Cię czeka?
              </h2>
              <ul className="list-disc pl-9 my-6">
                <li className="pb-4">Prelekcje ekspertów z zakresu bezpieczeństwa danych, IT i rozwiązań edukacyjnych</li>
                <li className="pb-4">Najnowsze technologie wspierające pracę w biurze i w szkole</li>
                <li className="pb-4">Networking z przedstawicielami sektora publicznego i biznesu</li>
                <li className="pb-4">Wieczorna strefa relaksu i rozrywki w wyjątkowej atmosferze</li>
                <li className="pb-4">Kolacja i zabawa w klubie Blue Sky, Beach Party lub Wieczór Kasynowy</li>
                <li className="pb-4">Konkurs z atrakcyjnymi nagrodami</li>
              </ul>
            </div>
            <div className="sm:w-full md:w-1/2">
              <div className={styles.eventInfoAkademiav3}>
                <Image
                  src="//static/events/officetech-day/image-5.webp"
                  alt=""
                  width={1298}
                  height={1487}
                  className="object-cover md:object-contain object-top"
                />
              </div>
            </div>

          </div>
        </div>

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px'}}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#63C043' }}>
              22-05-2025
              {' '}
              <br />
              <span className="text-black text-lg">Czwartek</span>
            </h3>
          </div>

          {agenda}

        </div>

        <section id="PARTNERZY" className="flex flex-col items-center pt-6 pb-12 md:pt-0" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">
          <span style={{color: '#000000'}}>Partnerzy</span></h2>
          <div className="flex flex-wrap justify-center lg:gap-8 items-center space-y-6 md:space-y-0 md:space-x-8 w-full max-w-5xl">
            {/* Logo 1 */}
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/lenovo.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/AB.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/HSM.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/ASBIS.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center lg:gap-8 items-center space-y-6 md:space-y-0 md:space-x-8 w-full max-w-4xl">
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/Prestigio-Solutions.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>

            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/JARLTECH-ZEBRA.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/Canon.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center lg:gap-8 items-center space-y-6 md:space-y-0 md:space-x-8 w-full max-w-4xl">

            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/ALSO.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
            
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/Microsoft.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
            <div className="relative w-52 h-44 flex justify-center items-center">
              <Image
                src="//static/events/partners/AMD.svg" // Zmień na odpowiednią ścieżkę do loga
                alt="Logo 1"
                // width={135}
                // height={135}
                className="object-contain"
                layout='fill'
              />
            </div>
          </div>
        </section>

        <div id="PRELEGENCI" className="pt-8" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PRELEGENCI</h2>
          {speakers}
        </div>

        <div id="KONSULTANCI" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pt-5 md:pb-6">KONSULTANCI WYDARZENIA:</h2>
          <div className="w-full p-4 my-6">
            <div className="flex sm:flex-col md:flex-row">
              {consultants}
            </div>
          </div>
        </div>

        <div id="rejestracja" className="py-4" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:py-6 ">
            <span style={{color: '#000000'}}>Zarejestruj się</span> na wydarzenie</h2>
          <div className="py-12">
            <p className="text-center">
            Zarezerwuj miejsce już dziś i bądź częścią wydarzenia, które łączy świat technologii <br /> z nutką sportowej rywalizacji!
            </p>
            <QuestionnaireForm fields={fields} />
          </div>
        </div>
      </div>

    </Layout>
  );
}

export async function getStaticProps() {
  const eventsItem = await getEventsItem('officetech-day');

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

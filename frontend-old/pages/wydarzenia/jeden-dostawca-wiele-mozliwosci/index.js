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
    hour: '10:30 - 10:45',
    time: '(15 minut)',
    title: 'Wstęp do konferencji przedstawienie firmy. Jeden dostawca, wiele możliwości',
    speaker: 'Krzysztof Olczak, DKS Sp. z o.o.  ',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '10.45 - 11:45',
    time: '(60 minut)',
    title: 'Systemy Zarządzania Drukiem – Bezpieczeństwo, Wygoda, Ekologia.',
    speaker: 'Adam Ziółkowski, DKS Sp. z o.o.',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11:45 - 12.45',
    time: '(60 minut)',
    title: 'Brother dla biznesu',
    speaker: 'Dominik Spodek, Łukasz Kurbiel, Brother Central and Eastern Europe GmbH',
  },
  {
    icon: '//static/events/Vector-7.svg',
    hour: '12:45 - 13:45',
    time: '(60 minut)',
    title: 'Lunch',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '13:45 - 14:30',
    time: '(45 minut)',
    title: 'Motorola dla biznesu',
    speaker: 'Damian Bugalski, Motorola Mobility, A Lenovo Company  ',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '14:30 - 15:30',
    time: '(60 minut)',
    title: 'Lenovo dostawca kompleksowej infrastruktury informatycznej',
    speaker: 'Paweł Chłud, Lenovo',
  },
  {
    icon: '//static/events/icon/spa_FILL0_wght400_GRAD0_opsz24.svg',
    hour: '16:00',
    time: '(60 minut)',
    title: 'Strefa relaksu',
    speaker: '',
  },
  {
    icon: '//static/events/icon/spa_FILL0_wght400_GRAD0_opsz24.svg',
    hour: '16:30',
    time: '',
    title: 'I seans saunowy',
    speaker: '',
  },
  {
    icon: '//static/events/icon/spa_FILL0_wght400_GRAD0_opsz24.svg',
    hour: '17:30',
    time: '(60 minut)',
    title: 'II seans saunowy',
    speaker: '',
  },
  {
    icon: '//static/events/icon/spa_FILL0_wght400_GRAD0_opsz24.svg',
    hour: '18:30',
    time: '(60 minut)',
    title: 'III seans saunowy',
    speaker: '',
  },
  {
    icon: '//static/events/icon/spa_FILL0_wght400_GRAD0_opsz24.svg',
    hour: '19:30',
    time: '',
    title: 'Zakończenie w strefie relaksu',
    speaker: '',
  },
  {
    icon: '//static/events/Vector-8.svg',
    hour: '20:00',
    time: '',
    title: 'Kolacja/losowanie nagród zabawa w klubie Blue Sky (casino whisky)',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '02:00',
    time: '',
    title: 'Zakończenie',
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

const speakerItems = [
  {
    speaker: 'Krzysztof Olczak',
    image: '//static/events/people/Krzysztof-Olczak.webp',
    position: 'Product Manager',
    company: 'DKS Sp. z o.o.',
    description: `W DKS Sp. z o.o. odpowiedzialny za wsparcie produktowe szeregu artykułów 
    oferowanych przez producentów, z którymi DKS Sp. z o.o. 
    współpracuje, w tym między innymi: 
    Brother, HP Inc., Canon, Lexmark, Konica Minolta, Ricoh, Epson, Lenovo, Dell, Asus, Zebra, 
    Godex. Z branżą urządzeń i rozwiązań do drukowania oraz PC związany od blisko 25 lat.`,
  },
  {
    speaker: 'Dominik Spodek',
    image: '//static/events/people/Dominik-Spodek.webp',
    position: 'Product ManagerKey Account Manager Business Channel Sales & Marketing Department',
    company: 'Brother Central and Eastern Europe GmbH',
    description: `Absolwent Wyższej Szkoły Promocji w Warszawie kierunek Zarządzanie. 
    Od ponad 12 lat związany z branżą IT, z czego od 2017 roku zatrudniony w firmie Brother. 
    Obecnie zajmowane stanowisko to Key Account Manager - Business Channel. 
    W Brother odpowiedzialny za rozwój kanału partnerskiego oraz kategorię produktów skanery. 
    Specjalista w zakresie sprzedaży biznesowych urządzeń drukujących 
    oraz usług zarządzania drukiem (MPS).`,
  },
  {
    speaker: 'Łukasz Kurbiel',
    image: '//static/events/people/Lukasz-Kurbiel.webp',
    position: 'Key Account Manager',
    company: 'Brother Central and Eastern Europe GmbH',
    description: `Absolwent Akademii Górniczo Hutniczej w Krakowie, 
    od 16 lat związany z branżą IT w dziedzinie druku.
    Od 2016 roku pracuje w firmie Brother na stanowisku 
    Key Account Manager zajmując się głównie szeroko rozumianym outsourcingiem druku.`,
  },
  {
    speaker: 'Paweł Chłud',
    image: '//static/events/people/Pawel-Chlud.webp',
    position: 'Presales',
    company: 'Lenovo',
    description: `Ponad 5 letnie doświadczenie zdobyte u integratora przy wdrażaniu 
    oraz sprzedaży sprzętu i usług największych producentów w branży IT sprawiło, 
    że Paweł posiada szerokie spektrum wiedzy na temat rynku. Dodatkowo poparte 
    rozwijaniem kanału Partnerskiego u jednego z dystrybutorów Lenovo. 
    Ten bagaż doświadczeń sprawił , że Paweł jako Presales jest osobą, 
    która rozwiązuję wszystkie problemy przedsprzedażowe 
    i doradza przy wyborze odpowiednich rozwiązań Lenovo , 
    które ma opanowane do perfekcji.`,
  },
  {
    speaker: 'Damian Bugalski',
    image: '//static/events/people/Damian-Bugalski.webp',
    position: 'Software Implementation Manager',
    company: 'Motorola Mobility, A Lenovo Company ',
    description: `Entuzjasta technologii z ponad 10 letnim stażem. Ekspert ds. produktów 
    i rozwiązań biznesowych Motoroli, w której rozpoczął swoją karierę zawodową. 
    Ponadto zdobywał swoje doświadczenie pracując dla producentów i operatorów.
    Prowadził liczne szkolenia i prezentacje produktowe oraz sprzedażowe 
    dla partnerów z kanału retail, telco oraz B2B.`,
  },
  {
    speaker: 'Adam Ziółkowski6',
    image: '//static/events/people/Adam-Ziolkowski.webp',
    position: 'B2B Sales Representative',
    company: 'DKS Sp. z o.o.',
    description: `W branży związanej z drukiem pracuje ponad 25 lat. 
    Uczestnik projektów opartych na urządzeniach wielofunkcyjnych 
    oraz oprogramowaniu zarządzającym środowiskiem druku 
    w największych instytucjach administracji państwowej jak 
    i samorządowej oraz sektora prywatnego. 
    W DKS od 6 lat odpowiada za rozwój sprzedaży oraz wdrożenie 
    i utrzymanie produktów software-owych.`,
  },
];
const speakers = speakerItems.map(({
  speaker, image, position, company, description,
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
        <p className="block text-base" style={{ color: '#3E75BB' }}>
          {position}
        </p>
        <p className="block text-base">
          {company}
        </p>
        <br />
        <p className="block text-base">
          {description}
        </p>
      </div>
    </div>
  </div>
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
    consultant: 'Maciej Spodek ',
    image: '//static/events/people/Maciej-Spodek.webp',
    company: 'Lenovo',
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

const partnersItems = [
  {
    src: '//static/events/partners/lenovo.svg',
    alt: 'Lenovo',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/partners/brother.svg',
    alt: 'DKS',
    width: '215px',
    height: '60px',
  },
];

const partners = partnersItems.map(({
  src, alt, width, height,
}) => (
  <div className="px-4 mx-8 sm:pb-6">
    <Image src={src} alt={alt} width={width} height={height} />
  </div>
));

export default function questionnaire({ fields }) {
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
            <Link href="#O-KONFERENCJI-OGOLNE">
              <a className="relative inline-flex justify-center items-center" href="#O-KONFERENCJI-OGOLNE">
                <span style={{ whiteSpace: 'nowrap' }}>
                  O KONFERENCJI OGÓLNE
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
            <Link href="#KONSULTANCI">
              <a className="relative inline-flex justify-center items-center" href="#KONSULTANCI">
                <span style={{ whiteSpace: 'nowrap' }}>
                  KONSULTANCI
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
            <Link href="#rejestracja">
              <a
                style={{ backgroundColor: '#EA580C' }}
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

      <div id="INFORMACJE-OGoLNE" className={`bg-white w-full ${styles.eventBgColor}`} style={{ scrollMarginTop: '200px' }}>
        <div className="relative">
          <div className={styles.eventContentJDWM}>
            <div className="md:w-6/12 lg:w-2/5 xl:w-6/12">
              <h2 className="sm:text-3xl md:text-4xl font-black" style={{ color: '#3E75BB' }}>
                JEDEN DOSTAWCA,
                {' '}
                <br />
                {' '}
                WIELE MOŻLIWOŚCI - DKS
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-black w-6 h-6 mr-2" />
                  Konferencja
                </div>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-black w-6 h-6 mr-2" />
                  21.03.2024
                </div>
                <div className="text-black text-base inline-block align-baseline">
                  <PlaceIcon className="text-black w-6 h-6 mr-2" />
                  Hotel Blue Diamond Active SPA
                  <br />
                  (Nowa Wieś 414, 36-001 Trzebownisko)
                </div>
              </div>
              <p className="text-black">
                W trakcie konferencji wysłuchasz wystąpień prelegentów na tematy związane
                z urządzeniami wielofunkcyjnymi i drukarkami, optymalizacją
                oraz zarządzeniem środowiskiem druku. Dowiesz się o nowościach
                i trendach w portfolio komputerów oraz smartfonów jednego
                z czołowych producentów.
              </p>
              <br />
              <p className="text-black">
                Zapraszamy w 21 dniu marca 2024r.
              </p>
              <br />
              <p className="text-black">
                Konieczna rejestracja – liczba miejsc ograniczona – decyduje kolejność zgłoszeń.
              </p>

              <Link href="#rejestracja" type="button">
                <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                  Zarejestruj się
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.eventbgJDWM} style={{ backgroundImage: 'url(/static/events/jeden-dostawca-wiele-mozliwosci/bgHero.webp)' }} />
        </div>
      </div>

      <div className="md:max-w-screen-xl px-4 xl:px-0">

        <div id="O-KONFERENCJI-OGOLNE" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">O KONFERENCJI</h2>
          <div className="flex sm:flex-col md:flex-row items-center py-8">
            <div className="sm:w-full md:w-1/2">
              <div className={styles.eventInfo}>
                <Image
                  src="//static/events/jeden-dostawca-wiele-mozliwosci/image-3.webp"
                  alt=""
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
            <div className="sm:w-full md:w-1/2 text-base">
              <p>
                Zarządzanie środowiskiem druku,
                dobór odpowiedniego sprzętu i rozwiązań jest koniecznością zarówno
                w sektorze publicznym i biznesowym.
              </p>
              <br />
              <p>
                Podczas konferencji doradzimy czym kierować się wybierając
                urządzenia oraz najlepsze, sprawdzone rozwiązania.
              </p>
              <br />
              <p>
                Do Państwa dyspozycji przez cały czas trwania konferencji dostępni
                będą konsultanci wydarzenia, z którymi można będzie przeprowadzić bardziej
                szczegółowe analizy w kontekście funkcjonowania biznesów,
                za które Państwo odpowiadają.
              </p>
            </div>
          </div>
        </div>

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#3E75BB' }}>
              21.03.2024
              <br />
              <span className="text-black text-lg">Czwartek</span>
            </h3>
          </div>
          <div className="flex sm:flex-col md:flex-row border-t-2 border-gray-400">
            <div className="sm:w-full md:w-full">
              {agenda}
            </div>
          </div>
        </div>

        <div id="PRELEGENCI" style={{ scrollMarginTop: '200px' }}>
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

        <div id="PARTNERZY" className="my-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PARTNERZY</h2>
          <h3 className="text-base text-center lg:text-left">PARTNERZY TECHNOLOGICZNI</h3>
          <div className="flex sm:flex-col md:flex-row items-center justify-start py-6">
            {partners}
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
  return {
    props: {
      fields: await getFields(collectionName),
    },
    revalidate: 60, // 60,
  };
}

QuestionnaireForm.propTypes = {
  fields: PropTypes.string.isRequired,
};

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

import Organizers from '../../../components/event/organizers';
import PresentedSolutions from '../../../components/event/presentedSolutions';

import styles from '../../../styles/events.module.scss';

const collectionName = 'events';

function QuestionnaireForm({ fields }) {
  const router = useRouter();
  const linkPath = router.asPath.split()[0].split('/');
  linkPath.shift();
  const formName = 'events';
  const nameEvent = linkPath[1];

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const onSubmit = async (data) => {
    console.log(data);
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
    hour: '10:00 do 10:10',
    time: '(10 minut)',
    title: 'Przywitanie',
    speaker: 'Jakub Czarnecki, DKS',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '10:10 do 11:40',
    time: '(80 minut)',
    title: 'Ekoptymalizacja środowiska druku by Epson',
    speaker: 'Krzysztof Janiec, Epson',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11:40 – 12:00',
    time: '(20 minut)',
    title: 'Przerwa',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12:00 do 13:00',
    time: '(60 minut)',
    title: 'System wydruku - szybciej, taniej, przyjaźniej dla środowiska',
    speaker: 'Adam Ziółkowski, DKS',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '13:00 do 13:30',
    time: '(30 minut)',
    title: 'Kompleksowy system EKO optymalizacji',
    speaker: 'Marcin Kaczmarczyk, DKS',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '13:30 – 13:45',
    time: '(15 minut)',
    title: 'Przerwa',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '13:45 do 15:00',
    time: '(75 minut)',
    title: 'Lenovo i zrównoważony rozwój za pan brat!',
    speaker: 'Maciej Misiewicz, Lenovo Michał Stochmal, AMD',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '15:00 do 15:30',
    time: '(30 minut)',
    title: 'Pytania, Konkurs',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '15:30',
    time: '(15 minut)',
    title: 'Pożegnanie gości',
    speaker: '',
  },
];
const agenda = agendaItems.map(({
  icon, hour, time, title, speaker,
}) => (
  <div className="flex flex-row w-full p-4 my-6">
    <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{ backgroundColor: '#16A34A' }}>
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
    speaker: 'Krzysztof Janiec',
    image: '//static/events/eko-optymalizacja-w-praktyce/Krzysztof-Janiec.webp',
    position: 'MPS Sales Specialist',
    company: 'EPSON EUROPE B.V. Sp. z o.o.',
    description: `W branży szeroko pojętego druku prawie 20 lat.
    W Epson odpowiedzialny za rozwój modelu usługowego (MPS) w Polsce.
    Wspiera dział handlowy, resellerów oraz klientów końcowych w całym procesie sprzedaży rozwiązań Epson.”`,
  },
  {
    speaker: 'Paweł Chłud',
    image: '//static/events/eko-optymalizacja-w-praktyce/Paweł-Chłud.webp',
    position: 'Presales',
    company: 'Presales Lenovo Polska',
    description: 'Ponad 5 letnie doświadczenie zdobyte u integratora przy wdrażaniu i sprzedaży sprzętu i usług największych producentów w branży IT sprawiło, że Paweł posiada szerokie spektrum wiedzy na temat rynku. Dodatkowo poparte rozwijaniem kanału Partnerskiego u jednego z dystrybutorów Lenovo. Ten bagaż doświadczeń sprawił , że Paweł jako Presales jest osobą, która rozwiązuję wszystkie problemy przedsprzedażowe i doradza przy wyborze odpowiednich rozwiązań Lenovo , które ma opanowane do perfekcji.',
  },
  {
    speaker: 'Michał Stochmal',
    image: '//static/events/eko-optymalizacja-w-praktyce/Michał-Stochmal.webp',
    position: 'Commercial Business Development Executive ',
    company: 'AMD',
    description: 'Absolwent UW oraz SGH, z branżą IT związany od ponad 7 lat. W AMD odpowiada za rozwój kanału sprzedaży urządzeń biznesowych w Polsce, w Czechach oraz na Słowacji. W swojej roli skupia się na współpracy z producentami komputerów biznesowych oraz topowymi dystrybutorami i reselerami IT w regionie. ',
  },
  {
    speaker: 'Adam Ziółkowski',
    image: '//static/events/eko-optymalizacja-w-praktyce/Adam-Ziółkowski.webp',
    position: 'Software Implementation Manager',
    company: 'DKS Sp. z o.o.',
    description: `15 lat w branży rozwiązań IT z zakresu Systemów-Zarządzania wydrukiem. 
    W DKS od 4 lat na stanowisku Software Implementation Manager
    Odpowiedzialny za nadzór nad wdrożeniem projektów SZW oraz przeprowadzanie prezentacji produktowych`,
  },
  {
    speaker: 'Marcin Kaczmarczyk',
    image: '//static/events/eko-optymalizacja-w-praktyce/Marcin-Kaczmarczyk.webp',
    position: 'Key Account Manager',
    company: 'DKS Sp. z o.o.',
    description: 'Od 12 lat zajmuje się rozwiązywaniem problemów dotyczących środowiska druku u klientów biznesowych i instytucjonalnych. Odpowiedzialny za przeprowadzanie audytów środowisk druku, analizę i optymalizację kosztów produkcji dokumentów, dobór optymalnych urządzeń oraz oprogramowania umożliwiającego zarządzanie sprzętem drukującym.',
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
        <p className="block text-base" style={{ color: '#16A34A' }}>
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
const organizers = [
  {
    src: '//static/events/eko-optymalizacja-w-praktyce/Logo-DKS.svg',
    alt: 'DKS',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/eko-optymalizacja-w-praktyce/epson.svg',
    alt: 'Epson',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/eko-optymalizacja-w-praktyce/lenovo.svg',
    alt: 'Lenovo',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/eko-optymalizacja-w-praktyce/amd.svg',
    alt: 'AMD',
    width: '215px',
    height: '60px',
  },
];

const PresentedSolutionItems = [
  {
    img: '//static/events/eko-optymalizacja-w-praktyce/eposn.webp',
    imgAlt: 'Ekooptymalizacja środowiska druku by Epson',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'Ekooptymalizacja środowiska druku by Epson',
    textItem: `Wizją firmy Epson jest osiągnięcie statusu niezastąpionego przedsiębiorstwa, które przy użyciu swoich wydajnych, kompaktowych i precyzyjnych technologii osiąga zrównoważony rozwój w gospodarce o obiegu zamkniętym.
    Do 2050 r. firma Epson osiągnie ujemny poziom emisji dwutlenku węgla w celu osiągnięcia zrównoważonego rozwoju i wzbogacenia społeczności. Zapraszamy Państwa do uczestniczenia z nami w tym procesie.`,
  },
  {
    img: '//static/events/eko-optymalizacja-w-praktyce/lenovo.webp',
    imgAlt: 'Lenovo i zrównoważony rozwój za pan brat!',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'Lenovo i zrównoważony rozwój za pan brat!',
    textItem: `Pozycji lidera w dziedzinie ochrony środowiska staramy się dowodzić w każdym aspekcie: od codziennej działalności operacyjnej po projektowanie produktów i rozwiązania recyklingowe.
    Podczas prezentacji przestawimy Państwu nasze rozwiązania oraz aktywności w zakresie zrównoważonego rozwoju.`,
  },
  {
    img: '//static/events/eko-optymalizacja-w-praktyce/PaperCut.webp',
    imgAlt: 'System wydruku - szybciej, taniej, przyjaźniej dla środowiska',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'System wydruku - szybciej, taniej, przyjaźniej dla środowiska',
    textItem: 'PaperCut MF to potężne narzędzie do zarządzania drukiem, używane do umożliwiania, śledzenia i zabezpieczenia druku, kopiowania i skanowania oraz do zarządzania nimi. Pozwala zoptymalizować koszty oraz zredukwać ilośc generowanych odpadów. Pokażemy Pańswu w jaki sposób znakomiecie uzupełnia on funkjconowanie kompleksowego systemu ekooptymalizacji',
  },
  {
     
    img: '//static/events/eko-optymalizacja-w-praktyce/KONKURS-v2.webp',
    imgAlt: 'KONKURS z nagrodami',
    imgHeight: '346px',
    imgWidth: '100%',
    titleItem: 'KONKURS',
    textItem: 'Do wygrania atrakcyjne nagrody!',
    styleItem: styles.PresentedSolutionClass,
  },
];
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
            <Link href="#ORGANIZATORZY">
              <a className="relative inline-flex justify-center items-center" href="#rejestracja">
                <span style={{ whiteSpace: 'nowrap' }}>
                  ORGANIZATORZY
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#O-PREZENTOWANYCH-ROZWIAZANIACH">
              <a className="relative inline-flex justify-center items-center" href="#O-PREZENTOWANYCH-ROZWIAZANIACH">
                <span style={{ whiteSpace: 'nowrap' }}>
                  O PREZENTOWANYCH ROZWIĄZANIACH
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

      <div id="INFORMACJE-OGoLNE" className={`bg-white w-full ${styles.eventBgColor}`} style={{ scrollMarginTop: '200px' }}>
        <div className="relative">
          <div className={styles.eventContent}>
            <div className="md:w-3/5">
              <h2 className="sm:text-3xl md:text-4xl font-black text-black uppercase">
                Eko optymalizacja w praktyce!
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-black w-6 h-6 mr-2" />
                  Konferencja
                </div>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-black w-6 h-6 mr-2" />
                  21.09.2023
                </div>
                <div className="text-black text-base inline-block align-baseline">
                  <PlaceIcon className="text-black w-6 h-6 mr-2" />
                  Kowale (koło Gdańska) ul. Energetyczna 15
                </div>
              </div>
              <p className="text-black">
                Na spotkaniu zaprezentujemy Państwu kompleksowy system eko optymalizacji w zakresie wydruku jak i sprzętu komputerowego. Odpowiemy na pytanie jak sprawić, aby Państwa rozwiązania były przyjazne dla środowiska oraz optymalne kosztowo.
              </p>
              <Link href="#rejestracja" type="button">
                <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                  Zarejestruj się
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.eowpEventbg} style={{ backgroundImage: 'url(/static/events/eko-optymalizacja-w-praktyce/eko-optymalizacja-w-praktyce.webp)' }} />
        </div>
      </div>

      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Organizers
          title=""
          id="ORGANIZATORZY"
          organizers={organizers}
        />

        <PresentedSolutions
          id="O-PREZENTOWANYCH-ROZWIAZANIACH"
          title="O PREZENTOWANYCH ROZWIĄZANIACH"
          presentedSolutionItems={PresentedSolutionItems}
        />

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#16A34A' }}>
              21.09.2023
              {' '}
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

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

const organizers = [
  {
    src: '//static/events/eko-optymalizacja-w-praktyce/Logo-DKS.svg',
    alt: 'DKS',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/partners/epson.svg',
    alt: 'Epson',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/partners/lenovo.svg',
    alt: 'Lenovo',
    width: '215px',
    height: '60px',
  },
  {
    src: '//static/events/partners/hsm.svg',
    alt: 'HSM',
    width: '215px',
    height: '60px',
  },
];

const PresentedSolutionItems = [
  {
    img: '//static/events/ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu/epson.webp',
    imgAlt: 'Epson',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'EPSON',
    textItem: `Uznany producent urządzeń drukujących zyskujący coraz większą popularność 
        w śród naszych klientów. Idealnie wpisuje się w konieczność właściwego podejścia 
        do biznesu w kontekście środowiska naturalnego. Urządzenia Epson zaprojektowane 
        są z myślą o zrównoważonym rozwoju, charakteryzują się przede wszystkim 
        najniższym na rynku zużyciem energii elektrycznej oraz najniższą ilością odpadów 
        wynikającą z eksploatacji.`,
  },
  {
    img: '//static/events/ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu/lenovo.webp',
    imgAlt: 'lenovo',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'LENOVO',
    textItem: `Lenovo to nie tylko wyróżniający się na tle konkurencji wygląd, ale także 
    zrównoważony rozwój. Recykling, energooszczędność z zastosowaniem procesorów 
    AMD Ryzen Mobile przy zachowaniu wysokiej wydajności.`,
  },
  {
    img: '//static/events/ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu/hsm.webp',
    imgAlt: 'hsm',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'HSM',
    textItem: `Prasy belujące redukują ilość odpadów o 95%, a urządzenia ProfiPack 
  wytwarzają wypełniacze z zużytego kartonu. Niszczarki dokumentów SECURIO 
  są energooszczędne, a rozwiązania recyklingu przekształcają PET w nowe surowce. `,
  },
  {
    img: '//static/events/ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu/dks.webp',
    imgAlt: 'Rozwiązania zarządzania drukiem i obiegiem dokumentów',
    imgWidth: '100%',
    imgHeight: '346px',
    titleItem: 'Rozwiązania zarządzania drukiem i obiegiem dokumentów',
    textItem: `DKS Sp. z o.o. oferuje między innymi bezpieczne i sprawdzone systemy 
  zarządzania środowiskiem wydruku biurowego.Polityka druku, którą dzięki nim 
  możemy wdrożyć, oszczędzająca papier oraz materiały eksploatacyjne pozwala 
  nam stanąć w szeregu firm oferujących  zrównoważone podejście do biznesu.`,
  },
];

const agendaItems = [
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '10:00 - 10:10',
    time: '',
    title: 'Przywitanie gości',
    speaker: 'Krzysztof Olczak, DKS Sp. z o.o.',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '10:10 - 11:00',
    time: '',
    title: 'Ekooptymalizacja środowiska druku by Epson (urządzenia  wielofunkcyjne, projektory, skanery)',
    speaker: 'Krzysztof Janiec - EPSON, Tomasz Lis – EPSON)',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11:00 - 11:50',
    time: '',
    title: 'Lenovo i zrównoważony rozwój za pan brat! Laptopy biznesowe Lenovo z procesorami AMD Ryzen™ - innowacyjne  technologie do pracy hybrydowej',
    speaker: 'Rafał Danis, Maciej Misiewicz - Lenovo',
  },
  {
    icon: '//static/events/icon/Local-Cafe.svg',
    hour: '11:50 - 12:10',
    time: '',
    title: 'Przerwa kawowa',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12:10 - 12:40',
    time: '',
    title: 'Produkty zgodne z zielona erą. ( urządzenia dniszczenia  dokumentów))',
    speaker: 'Piotr Kowalski -  HSM',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12:40 - 13:30',
    time: '',
    title: 'Systemy wydruku - szybciej, taniej, przyjaźniej dla środowiska (rozwiązania z zakresu szeroko pojętego zarządzania drukiem)',
    speaker: 'Adam Ziółkowski - DKS Sp.z o.o',
  },
  {
    icon: '//static/events/icon/Point-Scan.svg',
    hour: '13:30 - 15:00',
    time: '',
    title: 'Pytania , indywidualne rozmowy, losowanie nagrody niespodzianki',
    speaker: '',
  },
  {
    icon: '//static/events/icon/Point-Scan.svg',
    hour: '15:00',
    time: '',
    title: 'Zakończenie i pożegnanie gości',
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
    speaker: 'Krzysztof Janiec',
    image: '//static/events/people/Krzysztof-Janiec.webp',
    position: 'MPS Sales Specialist',
    company: 'EPSON EUROPE B.V. Sp. z o.o.',
    description: `W branży szeroko pojętego druku prawie 20 lat.
    W Epson odpowiedzialny za rozwój modelu usługowego (MPS) w Polsce.
    Wspiera dział handlowy, resellerów oraz klientów końcowych w całym procesie sprzedaży rozwiązań Epson.”`,
  },
  {
    speaker: 'Tomasz Lis',
    image: '//static/events/people/Tomasz-Lis.webp',
    position: 'Business Account Manager Reseller',
    company: 'EPSON EUROPE B.V. Sp. z o.o.',
    description: `Manager z 15 letnim doświadczeniem w zakresie rozwiązań zarządzania drukiem 
    oraz integracji ich ze zrównoważonymi systemami wspierającymi pracę „zielonych” biur. 
    Od ponad 3 lat w zespole Epson Polska, gdzie zajmuje się wsparciem i współpracą 
    z partnerami. Absolwent UMCS w Lublinie oraz Bradford Collage. Poprzednio związany 
    z firmą Canon Polska. Uważa, że dzisiejszy rynek profesjonalnych urządzeń 
    i systemów druku posiada ogromny potencjał wzrostu, ale jest również bardzo 
    wymagający – także w kontekście wyzwań, jakie stawia kryzys klimatyczny 
    i związane z nimi potrzeby zmniejszania emisji CO2 oraz po prostu oszczędności 
    finansowych.`,
  },
  {
    speaker: 'Rafał Danis',
    image: '//static/events/people/Rafał-Danis.webp',
    position: 'AMD Commercial Trainer',
    company: 'Lenovo',
    description: `Trener AMD Commercial, wspierający kanał partnerski w zakresie szkoleń 
    i materiałów produktowych z kategorii procesorów mobilnych do laptopów biznesowych 
    i stacji roboczych wiodących producentów.
    Wcześniejsze doświadczenie zawodowe zdobywał pracując w Microsoft, 
    gdzie jako Product Marketing Manager m.in. odpowiadał za aktywności marketingowe 
    i szkolenia z linii biznesowych urządzeń Microsoft Surface dla firm.`,
  },
  {
    speaker: 'd.bryszkowski@dks.pl',
    image: '//static/events/people/Maciej-Misiewicz.webp',
    position: 'Business Development Manager',
    company: 'Lenovo Commercial AB ',
    description: `Ponad  15 letnie doświadczenie w sprzedaży do sektorów Mid-market 
      i Enterprise  rozwiązań profesjonalnych oraz rozwijaniu struktury opartej na aktualnych trendach
      rynkowych. Jego wysoka wiedza techniczna o  rozwiązaniach do projektowania, architektury, 
      mechaniki oraz grafiki  pozwala mu na świetne rozumienie rynku i obecnych trendów oraz strategii
      biznesowej, połączone z entuzjazmem nauki i testowania nowych technologii. 
      Dzięki możliwości pracy na różnych stanowiskach zna  spectrum kanału dystrybucji, 
      partnerskiego, ale również perspektywy  klienta końcowego. 
      Swoje doświadczenie zawodowe zdobywał u największych światowych liderów rynku IT Lenovo oraz HP Inc.”.`,
  },
  {
    speaker: 'Piotr Kowalski',
    image: '//static/events/people/Piotr-Kowalski.webp',
    position: 'Regionalny Kierownik Sprzedaży',
    company: 'HSM',
    description: `Regionalny kierownik sprzedaży odpowiedzialnym za sieć dystrybucji na południu 
    Polski. W HSM na tym stanowisku od 2009 roku. Prywatnie muzyk i podróżnik cyklista.`,
  },
  {
    speaker: 'Adam Ziółkowski',
    image: '//static/events/people/Adam-Ziolkowski.webp',
    position: 'Software Implementation Manager',
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
          <div className={styles.eventContentJDWM}>
            <div className="md:w-6/12 lg:w-2/5 xl:w-6/12">
              <h2 className="sm:text-3xl md:text-4xl font-black" style={{ color: '#000000' }}>
                EKOLOGIA PRZYSZŁOŚCI -
                <br />
                EKOINWESTYCJE DROGĄ
                <br />
                DO SUKCESU
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-black w-6 h-6 mr-2" />
                  Konferencja
                </div>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-black w-6 h-6 mr-2" />
                  22-05-2024
                </div>
                <div className="text-black text-base inline-block align-baseline">
                  <PlaceIcon className="text-black w-6 h-6 mr-2" />
                  Hotel Szafran, Będzińska 82, 41-250 Czeladź
                </div>
              </div>
              <p className="text-black">
                Przedstawiciele firm Epson, Lenovo i HSM zaprezentują innowacyjne rozwiązania wspierające ochronę środowiska i efektywność biznesową. Poznaj najlepsze praktyki i technologie na rzecz zrównoważonego rozwoju.
              </p>
              <br />

              <Link href="#rejestracja" type="button">
                <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                  Zarejestruj się
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.eventbgJDWM} style={{ backgroundImage: 'url(/static/events/ekologia-przyszlosci-ekoinwestycje-droga-do-sukcesu/bgHero.webp)' }} />
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
              22.05.2024
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

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

import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';

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
    hour: '11.00 do 11.10',
    time: '(10 minut)',
    title: 'DKS „Przywitanie gości"',
    speaker: 'Andrzej Ćwikliński - DKS',
    },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11.10 do 11.25',
    time: '(15 minut)',
    title: 'Digital Box Factory - wycięte pudełko już od 1 sztuki',
    speaker: 'Dominik Szulim - Akonda',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11.25 do 11.55',
    time: '(30 minut)',
    title: 'Projektowanie dla druku cyfrowego',
    speaker: 'Maja Aleksandra - Pelc, Studio Projektowe Pelc&Partners ',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '11.55 do 12.10',
    time: '(15 minut)',
    title: 'Nieważne co wymyślisz – mamy na to papiery',
    speaker: 'Ewelina Tobiasz - ZING ',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12.10 do 12.25',
    time: '(15 minut)',
    title: 'Fujifilm Revoria Press PC1120 – aplikacje dotychczas niedostępne dla druku cyfrowego',
    speaker: 'Agnieszka Głowacka - Fujifilm Polska',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12.25 do 12.40',
    time: '(15 minut)',
    title: 'Przygotowanie plików graficznych do druku w sześciu kolorach-kluczowe aspekty',
    speaker: 'Marek Czarnocki - Fujifilm Polska',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12.40 do 12.55',
    time: '(15 minut)',
    title: 'Mocne strony urządzeń Canon w obszarze kolorowego druku produkcyjnego',
    speaker: 'Michał Młynarczyk - Canon Polska',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '12.55 do 13.10',
    time: '(15 minut)',
    title: 'Część trzecia i najważniejsza - uszlachetnianie',
    speaker: 'Mateusz Wożniak - Konica Minolta Business Solutions Polska',
  },
  {
    icon: '//static/events/Vector-7.svg',
    hour: '13.10 – 14.10',
    time: '(60 minut)',
    title: 'Lunch i czas na rozmowy indywidualne',
    speaker: '',
  },
];
const agenda = agendaItems.map(({
  icon, hour, time, title, speaker,
}) => (
  <div className="flex flex-row w-full p-4 my-6">
    <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{backgroundColor: "#EA580C"}}>
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
        <span className="text-base font-normal"> {time}</span>
      </div>
      <div >
        <p className="text-base font-normal">{title}</p>
        <p className="text-sm italic">{speaker}</p> 
      </div> 
    </div>
  </div>
));

const speakerItems = [
  {
    speaker: 'Maja Aleksandra Pelc',
    image: '//static/events/Maja-Aleksandra-Pelc.webp',
    position: 'Właściciel Studia Projektowe Pelc&Partners',
    company: 'Studio Projektowe Pelc&Partners',
    description: 'Właścicielka studia projektowego Pelc & Partners specjalizującego się w projektach opakowań dla branży FMCG."',
  },
  {
    speaker: 'Ewelina Tobiasz',
    image: '//static/events/Ewelina-Tobiasz.webp',
    position: 'Backseller / Junior Product Manager',
    company: 'Zing',
    description: `Nazywam się Ewelina Tobiasz i jestem Backsellerką / Junior Product Managerem ds. papierów ozdobnych w firmie Zing S.A., jednym z największych polskich dystrybutorów podłoży do druku.
    Zajmuję się prezentacją, promowaniem oraz przekazywaniem swojej wiedzy na temat papierów ozdobnych, metod ich zadruku i uszlachetniania, jak również ich właściwego doboru do planowanych realizacji. Współpracuję z grafikami, agencjami, drukarniami, klientami końcowymi i szkołami artystycznymi (ASP).
    Organizuję szkolenia/warsztaty dla klientów/studentów, gdzie z przyjemnością dzielę się moją wiedzą i doświadczeniami, zwiększając świadomość odbiorców na temat papierów ozdobnych i dążąc do ich pełnej satysfakcji z produktu.`  
  },
  {
    speaker: 'Agnieszka Głowacka',
    image: '//static/events/Agnieszka-Glowacka.webp',
    position: 'Business Development Manager POD',
    company: 'Fujifilm Polska ',
    description: `Obecnie zajmuje się wdrażaniem rozwiązań do druku na żądanie firmy Fujifilm na rynku polskim. Absolwentka wydziału papiernictwa i poligrafii PŁ. Całe życie zawodowe związana z branżą poligraficzną. Współpracowała z wiodącymi markami krajowymi i światowymi z obszaru druku offsetowego i rozwiązań software’owych. Zafascynowana możliwościami, jakie obecnie oferuje technologia druku cyfrowego.`,
  },
  {
    speaker: 'Michał Młynarczyk',
    image: '//static/events/Michal-Mlynarczyk.webp',
    position: 'Professional Print Product Manager',
    company: 'Canon Polska',
    description: `W Canon pracuję już 14 lat I zajmuje się od strony marketingowej urządzeniami ProPrint do druku na papierze ciętym na potrzeby własne firm jak i dla firm zajmujące się sprzedażą wydruków.`,
  },
  {
    speaker: 'Mateusz Wożniak',
    image: '//static/events/Mateusz-Wozniak.webp',
    position: 'Production Printing Sales Director w Konica Minolta.',
    company: 'Konica Minolta Business Solutions Polska',
    description: `Kontynuuje tradycje rodzinne od wielu lat zajmując się poligrafią. Odpowiedzialny za kanał sprzedaży w Polsce urządzeń produkcyjnych, maszyn z segmentu Industrial oraz urządzeń do uszlachetniania.`,
  },
  {
    speaker: 'Marek Czarnocki',
    image: '//static/events/Marek-Czarnocki.webp',
    position: 'Deputy Service Manager Graphic Communication Division',
    company: 'Fujifilm Polska,',
    description: `W FUJIFILM od 10 lat. Odpowiadam za wdrożenia oprogramowania w druku offsetowym i cyfrowym, prowadzę szkolenia z obsługi maszyn cyfrowych. Posiadam certyfikat FOGRA z zakresu zarządzania kolorem i certyfikacji druku.`,
  },
  {
    speaker: 'Dominik Szulim',
    image: '//static/events/Dominik-Szulim.webp',
    position: 'Właściciel FIRMY Akonda',
    company: 'Akonda',
    description: `Właściciel firmy Akonda specjalizującej się we wdrożeniach systemów introligatorskich`,
  },
  {
    speaker: 'Andrzej Ćwikliński',
    image: '//static/events/Andrzej-Cwiklinski.webp',
    position: 'Dyrektor Sprzedaży Systemów Produkcyjnych',
    company: 'DKS',
    description: `Dyrektor Sprzedaży Systemów Produkcyjnych. Od 13 lat w DKS. 26 lat doświadczenia w poligrafii z czego 16 lat w druku cyfrowym oraz 10 lat w druku offsetowym.`,
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
        <p className="block text-base" style={{color: "#EA580C"}}>
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
            <Link href="#O-KONFERENCJI-OGOLNE">
              <a className="relative inline-flex justify-center items-center" href="#O-KONFERENCJI-OGOLNE">
                <span style={{ whiteSpace: 'nowrap' }}>
                  O KONFERENCJI OGÓLNE
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#DO-KOGO-ADRESUJEMY-KONFERENCJE">
              <a className="relative inline-flex justify-center items-center" href="#DO-KOGO-ADRESUJEMY-KONFERENCJE">
                <span style={{ whiteSpace: 'nowrap' }}>
                  DO KOGO ADRESUJEMY KONFERENCJĘ
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
                  O PREZENTOWANYCH ROZWIĄZANIACH
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

      <div id="INFORMACJE-OGoLNE" className={`bg-black w-full ${styles.eventBgColor}`}>
        <div className="relative">
          <div className={styles.eventContent}>
            <div className="md:w-3/5">
              <h2 className="sm:text-3xl md:text-4xl font-black text-white">
                CYFROWA REWOLUCJA - ODKRYJ NOWE HORYZONTY W ŚWIECIE OPAKOWAŃ.
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-white text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-white w-6 h-6 mr-2" />
                  Konferencja
                </div>
                <div className="text-white text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-white w-6 h-6 mr-2" />
                  21-06-2023 oraz 22-06-2023
                </div>
                <div className="text-white text-base inline-block align-baseline">
                 <PlaceIcon className="text-white w-6 h-6 mr-2" />
                  Kowale (koło Gdańska) ul. Energetyczna 15
                </div>
              </div>
              <p className="text-white">
                Projektowanie, druk, uszlachetnianie i procesy wykończeniowe w produkcji opakowań nisko i średnionakładowych to wiodące tematy naszej konferencji.
                Niemniej prezentowane  rozwiązania drukujące, uszlachetniające  i introligatorskie są odpowiednie także do druku materiałów reklamowych, książek, katalogów, zaproszeń oraz wizytówek
              </p>
              <br />
              <p className="text-white">
                Zapraszamy w środę 21 czerwca lub czwartek 22 czerwca 2023. Wybierz jeden z dwóch terminów jakie proponujemy. Agenda będzie ta sama 21 i 22 czerwca. Koniecznie zarejestruj się liczba miejsc jest ograniczona. Decyduje kolejność zgłoszeń.
              </p>
              <Link href="#rejestracja" type="button">
                <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                  Zarejestruj się
                </a>
              </Link>
            </div>
          </div>  
          <div className={styles.eventbg} style={{backgroundImage: `url(/static/events/Asset-4-8-1.webp)`}}></div>
        </div>
      </div>
      
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="ORGANIZATORZY" className="flex sm:flex-col md:flex-row items-center py-16">
          <div className="px-4 mx-8 font-bold uppercase">
            <h2 className="sm:text-2xl text-5xl sm:text-center sm:pb-6">Organizatorzy:</h2>
          </div>
          <div className="px-4 mx-8 sm:pb-6">
            <Image src="//static/events/dks.svg" width="215px" height="60px" />
          </div>
          <div className="px-4 mx-8">
            <Image src="//static/events/akonda.svg" width="262px" height="66px" />
          </div>
        </div>
        
        <div id="O-KONFERENCJI-OGOLNE" className="sm:text-2xl text-5xl sm:py-4 md:py-16">
            <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">O KONFERENCJI</h2>
            <div className="flex sm:flex-col md:flex-row items-center py-8">
              <div className="sm:w-full md:w-1/2">
                <div className={styles.eventInfo}>
                  <Image
                    src="//static/events/image-3.webp"
                    alt=""
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="sm:w-full md:w-1/2 text-base">
                <p>Produkcja opakowań nisko i średnionakładowych stała się wymogiem rynku. Wiemy, że jest ona nie lada wyzwaniem dla części z tradycyjnych drukarń. Podczas naszej konferencji doradzimy czym kierować przy wyborze linii do cyfrowej produkcji opakowań i odpowiemy na niektóre z nurtujących pytań.</p> 
                <ul className="list-disc pl-9 my-6">
                  <li className="pb-4">Jak zaprojektować i wyprodukować opakowania, by klient po nie jak najczęściej sięgał i czym się przy takim projektowaniu kierować?</li>
                  <li className="pb-4">Opakowanie eko a może opakowanie z kolorami specjalnymi i atrakcyjnym uszlachetnieniem?</li>
                  <li className="pb-4">Marketing sensoryczny jest obecnie wymogiem na rynku opakowań. Czy sensorycznie oddziaływać na odbiorce poprzez ciekawą fakturę papieru, czy może uszlachetniać lakierem 3D i/lub folią?</li>
                  <li className="pb-4">Jak efektywnie wycinać i bigować opakowania niskonakładowe?</li>
                  <li className="pb-4">Na jakie innowacje cyfrowych urządzeń drukujących, uszlachtniających i wycinających zwracać uwagę, by stać się ważnym graczem wśród drukarń zajmujących się produkcją niskonakładowych opakowań i etykiet?</li>
                </ul>
              </div>
            </div>
            <p className="text-base">Podczas naszej konferencji wysłuchasz ciekawych wystąpień na tematy związane z produkcją opakowań. Przejdziemy przez procesy projektowania, drukowania, uszlachetniania oraz finiszingu. A w części warsztatowej będzie okazja by zobaczyć jak pracuje i z jakich rozwiązań korzysta współczesna drukarnia nastawiona na produkcję opakowań. Konferencja jest multibrandowa, dlatego każdy może znaleźć tutaj odpowiednie dla siebie rozwiązanie. Będzie to okazja, aby zobaczyć podczas pracy dwie różne linie produkcyjne. Pierwsza linia będzie kładła nacisk na ciekawe i bogate uszlachetnienie. Wykorzystamy dodatkowe kolory specjalne, sleeking, lakier 3D a wszystko po to, aby uzyskać produkt atrakcyjny dla klienta końcowego. Druga linia będzie zgodna z modnym w niektórych obszarach kierunkiem eko. Będzie to druk w CMYK-u na atrakcyjnych ozdobnych podłożach. W obu liniach postawimy na marketing sensoryczny. W pierwszej linii będzie on oparty na lakierze 3D. W drugiej linii na wrażeniach dotykowych związanych z papierem ozdobnym.</p>
        </div>
        
        <div id="DO-KOGO-ADRESUJEMY-KONFERENCJE" className="sm:text-2xl text-5xl sm:py-4 md:py-16">
            <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">Do kogo adresujemy konferencję?</h2>
            <div className="flex flex-wrap sm:flex-col md:flex-row sm:flex-col md:flex-row py-12">
              <div className="flex flex-row w-full md:w-1/3 p-4">

                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-16 h-16">
                    <Image 
                      src={'//static/events/deployed_code_history_FILL0_wght400_GRAD0_opsz48.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base ml-4">
                  <p>Do producentów wysokonakładowych wolumenów opakowań, borykających się z trudnymi pytaniami o realizacje krótkich serii.</p>
                </div>
              </div>
              <div className="flex flex-row w-full md:w-1/3 p-4">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-16 h-16">
                    <Image 
                      src={'//static/events/Vector.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>                  
                </div>
                <div className="text-base ml-4">
                  <p>Do tych którzy obecnie drukują dla rynków reklamowych, wydawniczych, akcydensowych a chcieliby wejść na rynki związane z drukiem opakowań, metek, etykiet.</p>
                </div>
              </div>
              <div className="flex flex-row w-full md:w-1/3 p-4">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-12 h-12">
                    <Image 
                      src={'//static/events/Vector-1.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base ml-4">
                  <p>Do tych, którzy są zainteresowani niskonakładową produkcją pudełek, metek lub etykiet. Prezentowane multibrandowe rozwiązania są dedykowane do druku zarówno na kartonach, papierach ozdobnych jak i na papierach samoprzylepnych</p>
                </div>
              </div>
              <div className="flex flex-row w-full md:w-1/3 p-4">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-16 h-16">
                    <Image 
                      src={'//static/events/Vector-3.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base ml-4">
                  <p>Do producentów opakowań personalizowanych</p>
                </div>
              </div>
              <div className="flex flex-row w-full md:w-1/3 p-4">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-12 h-12">
                    <Image 
                      src={'//static/events/Vector-4.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base ml-4">
                  <p>Do grafików i agencji projektowych związanych z rynkiem opakowań, etykiet samoprzylepnych oraz metek</p>
                </div>
              </div>
              <div className="flex flex-row w-full md:w-1/3 p-4">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-md" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-12 h-12">
                    <Image 
                      src={'//static/events/Vector-5.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="text-base ml-4">
                  <p>Także do tych którzy zamierzają pozostać przy produkcji materiałów reklamowych, wydawniczych, czy akcydensowych a są ciekawi co w trawie piszczy jeśli chodzi o współczesne rozwiązania związane z drukiem cyfrowym, zaawansowanym uszlachetnianiem oraz finiszingiem.</p>
                </div>
              </div>
            </div>
        </div>

        <div id="AGENDA" className="sm:text-2xl text-5xl sm:py-4 md:py-16">
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">AGENDA</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{color: "#EA580C"}}>
              21/22-06-2023 <br/>
              <span className="text-black text-lg">Środa - Czwartek</span>
            </h3>
          </div>
          <div className="flex sm:flex-col md:flex-row">
            <div className="sm:w-full md:w-3/12">
              <p className="sm:text-lg md:text-3xl font-bold  text-gray-400">Część warsztatowa poranna</p>
            </div>
            <div className="sm:w-full md:w-9/12">
              <div className="flex flex-row w-full p-4 my-6">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-16 h-16">
                    <Image 
                      src={'//static/events/Vector-6.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
                <div className="ml-4">
                    <div className="text-base font-bold">
                      9.00 do 11.00 <br />
                    </div>
                    <div className="text-base">
                      część warsztatowa poranna. Na parterze budynku. Prezentowana będzie symulacja dwóch modeli drukarń cyfrowych do produkcji nisko i średnionakładowych opakowań. Pierwszy model drukarni to linia technologiczna nastawiona na użycie kolorów dodatkowych i zaawansowanego uszlachetnienia. Drugi model drukarni to linia technologiczna do druku w CMYK na papierach ozdobnych bez uszlachetniania.
                    </div> 
                  
                </div>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-row border-t-2 border-gray-400">
            <div className="sm:w-full md:w-3/12">
              <p className="sm:text-lg md:text-3xl font-bold  text-gray-400">Część wykładowa 11.00 - 13.10 (130 minut) Sala wykładowa na pierwszym pietrze.</p>
            </div>

            <div className="sm:w-full md:w-9/12">
              {agenda}
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-row border-t-2 border-gray-400">
            <div className="sm:w-full md:w-3/12">
              <p className="sm:text-lg md:text-3xl font-bold  text-gray-400">
                Część warsztatowa popołudniowa
                14.10 - 16.30 (140 minut) Na parterze budynku
              </p>
            </div>
            <div className="sm:w-full md:w-9/12">
              <div className="flex flex-row w-full p-4 my-6">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-16 h-16">
                    <Image 
                      src={'//static/events/Vector-6.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />                
                  </div>
                </div>
                <div className="ml-4">
                    <div className="text-base font-bold">
                      14.10 do 16.30  <br />
                    </div>
                    <div className="text-base">
                      <p className="text-base font-normal">część warsztatowa popołudniowa. Na parterze budynku. Ciag dalszy pokazów indywidualnych i testów rozpoczętych podczas części warsztatowej porannej.</p>
                    </div>
                </div>
              </div>
              <div className="flex flex-row w-full p-4 my-6">
                <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{backgroundColor: "#EA580C"}}>
                  <div className="relative w-16 h-16">
                    <Image 
                      src={'//static/events/Vector-8.svg'} 
                      alt="icone" 
                      layout="fill"
                      objectFit="contain"
                    />                
                  </div>
                </div>
                <div className="ml-4">
                    <div className="text-base font-bold">
                      14.30 <br />
                    </div>
                    <div className="text-base">
                      <p className="text-base font-normal">Losowanie nagród dla uczestników.</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="PRELEGENCI">
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PRELEGENCI</h2>
          {speakers}
        </div>

        <div id="O-PREZENTOWANYCH-ROZWIAZANIACH" className="lg:my-16">
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">O PREZENTOWANYCH ROZWIĄZANIACH</h2>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
              <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/FUJIFILM-REVORIA-PRESS-PC1120.webp"
                    alt="FUJIFILM REVORIA PRESS PC1120"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">FUJIFILM REVORIA PRESS PC1120</h3>
                <p>Przemysłowe urządzenie do druku w sześciu kolorach w jednym przelocie. Dostępne kolory specjalne to: złoty, srebrny, biały, różowy, przezroczysty punktowy oraz przezroczysty texture do papierów fakturowanych. Kolory specjalne możemy umieszczać jako spodnie (poza clear) oraz jako wierzchnie. Taka konfiguracja w połączeniu z modułem do zdejmowania ładunków elektrostatycznych daje świetne rezeultaty nie tylko w przypadku druku na papierze, ale także w przypadku druku na foliach przezroczystych oraz podłoży metalizowanych. Dodanie jako koloru specjalnego różowego poza drukiem typu spot on, daje ogromne możliwości w uzyskiwaniu szerszego gamutu kolorystycznego. To wszystko powoduje, że Revoria jest produktem do szerokiego zastosowania od opakowań po fotoalbumy.</p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
                <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/CANON-imagePREES-V1000.webp"
                    alt="CANON imagePREES V1000"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">CANON imagePREES V1000</h3>
                <p>Urządzenie dla drukarń wymagających wysokiej jakości przy zachowaniu średniego miesięcznego wolumenu na poziomie powyżej 50 tysięcy przelotów. W stosunku do poprzednich modeli Canon wyróżniają ją: automatyczne chłodzenie arkuszy po wyjściu z utrwalania oraz automatyczna kalibracja za pomocą wbudowanych spektrofotometrów. Innowacje w nowym modelu idą w parze z zachowaniem świetnych rezultatów w druku na papierach fakturowanych - co było cechą charakterystyczną poprzednich modeli. Urządzenie wyposażone w opcję dodatkową Multi-drawer Paper Deck-E1 jest bardzo skuteczne w podaniu zarówno niskogramaturowych jak i wysokogramaturowych podłoży.</p>
              </div>
            </div>
          </div>
          <div className="flex sm:flex-col md:flex-col lg:flex-row">
            <div className="lg:w-1/2 p-4">
              <div>
              <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/KONICA-MINOLTA-AccurioShine-3600.webp"
                    alt="KONICA MINOLTA AccurioShine 3600."
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">KONICA MINOLTA AccurioShine 3600</h3>
                <p>Urządzenie do punktowego uszlachetniania lakierem z efektami 2D oraz 3D o grubości od 21 do 116 mkm. Doskonałe narzędzie do nadania efektów marketingu sensoryczneego dla opakowań premium, etykiet, katalogów produktów, wizytówek, kart menu, okładek książek i wielu innych produktów projektowanych kreatywnie z efektami wow.</p>
              </div>
            </div>
            <div className="lg:w-1/2 p-4">
              <div>
              <div className={`flex relative ${styles.eventProductImg}`}>
                  <Image
                    src="//static/events/iEcho-z-serii-PK.webp"
                    alt="iEcho z serii PK"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold pb-2">iEcho z serii PK.</h3>
                <p>Ploter tnący z funkcją bigowania to narzędzie do produkcji niskonakładowych opakowań, naklejek, teczek i wielu innych produktów poligraficznych. Tnie, nacina, biguje i perforuje już od jednej sztuki produktu docelowego bez konieczności wykonywania kosztownych wykrojników. Ploter standardowo jest wyposażony w dwa noże wleczone, kółko bigujące oraz opcjonalnie w nóż oscylacyjny, nóż aktywny, kamerkę CCD czytającą znaczniki.</p>
              </div>
            </div>
          </div> 
          <div className="text-center lg:my-16">
            <h3 className="font-bold pb-2">
              Canon imagePREES V700 <br />
              Fujifilm Apeos PRO C850 <br />
              Konica Minolta AccurioPrint C4065 <br />
            </h3>
            <p>Dodatkowo dostępne będą urządzenia z segmentu Light Prodction od Canon, Fuji i Konica Minolta.</p>
            <br />
            <p>Urządzenia są dedykowane dla użytkowników wymagających elastyczności, wysokiej jakości, odpowiedniego pasowania w druku dwustronnym, stabilności kolorystycznej oraz kontroli nad color managmentem. To rozwiązania dla drukujących miesięczne wolumeny na poziomie 10.000 do 50.000 przelotów miesiecznie.</p>
          </div>
        </div>
        
        <div id="PARTNERZY" className="my-16">
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">PARTNERZY</h2>
          <h3 className="text-base">PARTNERZY TECHNOLOGICZNI</h3>
          <div className="flex sm:flex-col md:flex-row items-center justify-between py-6">
            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="https://dks.pl/backend/assets/d5465654-023a-4ea0-89a3-02747ba8c647?imwidth=1920"
                alt="Canon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            
            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="https://dks.pl/backend/assets/eedaf523-bd9b-4feb-b824-eb85e8ea325c?imwidth=1920"
                alt="fujifilm"
                layout="fill"
                objectFit="contain"
              />
            </div>

            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="https://dks.pl/backend/assets/2de5e8bf-7ae0-4877-969b-f0f8b0d6af79?imwidth=1920"
                alt="Konica Minolta"
                layout="fill"
                objectFit="contain"
              />
            </div>

            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="//static/events/zing.svg"
                alt="Zing"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>

          <h3 className="text-base">PATRONAT MEDIALNY</h3>
          <div className="flex sm:flex-col md:flex-row items-center justify-between py-6">
            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="//static/events/opakowanie.svg"
                alt="Canon"
                layout="fill"
                objectFit="Opakowanie"
              />
            </div>
            
            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="//static/events/poligrafika.svg"
                alt="Poligrafika"
                layout="fill"
                objectFit="contain"
              />
            </div>

            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="//static/events/swiat-druku.svg"
                alt="Świat Druku.svg"
                layout="fill"
                objectFit="contain"
              />
            </div>

            <div className={`flex relative w-56 h-12 sm:mb-8`}>
              <Image
                src="//static/events/swiat-poligafii.svg"
                alt="Świat Poligafii"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        <div id="rejestracja">
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

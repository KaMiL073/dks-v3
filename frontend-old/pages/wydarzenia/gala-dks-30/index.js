import Link from 'next/link';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import Image from 'next/image';
import Layout from '../../../components/layouts/layout';
import styles from '../../../styles/events.module.scss';
import PresentedSolutions from '../../../components/event/presentedSolutions';

const PresentedSolutionItems = [
  {
    img: '//static/events/gala-dks-30/Zespół-Latino-Show-Band.webp',
    imgAlt: 'Zespół Latino Show Band',
    imgWidth: '100%',
    // imgHeight: '625px',
    imgHeight: '256px',
    titleItem: 'Zespół Latino Show Band',
    textItem: 'Latino Show Band to zespół, który przenosi w klimat Meksyku, Kuby, Peru i Hiszpanii. Ich muzyka to rytmiczna mieszanka rumby, cha-cha, salsy, merengue i bachata, wtapiająca się doskonale w atmosferę Ameryki Południowej. Profesjonalni artyści potrafiący zafascynować różnorodnością latynoamerykańskich i polskich rytmów.',
  },
  {
    img: '//static/events/gala-dks-30/tomasz-galinski.webp',
    imgAlt: 'Tomasz Galiński',
    // imgHeight: '625px',
    imgHeight: '256px',
    imgWidth: '100%',
    titleItem: 'Tomasz Galiński',
    textItem: 'Całe wydarzenie poprowadzi Tomasz Galiński - charyzmatyczny dziennikarz, konferansjer oraz spiker sportowy z Radia Gdańsk. Jego profesjonalizm i energia wnoszą wyjątkowy wymiar do każdego prowadzonego przez niego wydarzenia.',
  },
  {
    img: '//static/events/gala-dks-30/cezary-pazura.webp',
    imgAlt: 'Cezary Pazura',
    imgWidth: '100%',
    // imgHeight: '625px',
    imgHeight: '256px',
    titleItem: 'Cezary Pazura',
    textItem: 'Występ jednego z najpopularniejszych i najbardziej lubianych aktorów. Zagrał niezapomniane role, zachwycając zarówno starsze, jak i młodsze pokolenia. Dodatkowo warto wspomnieć, że jest również cenionym komikiem, którego dowcipem rozbawił nie jedną publikę.',
  },
  {
    img: '//static/events/gala-dks-30/zespół-cocktail.webp',
    imgAlt: 'Zespół Cocktail',
    imgWidth: '100%',
    // imgHeight: '625px',
    imgHeight: '256px',
    titleItem: 'Zespół Cocktail',
    textItem: 'Zespół Cocktail to energia na scenie - perkusja, gitary, klawisze i charyzmatyczny wokalista. Muzyka na żywo, bez playbacków. Grają przeboje w ich oryginalnych aranżacjach, bez udziwnień. Doskonałe brzmienie i kontakt z publicznością. Cocktail - gwarancja niezapomnianych wrażeń muzycznych!',
  },
  {
    img: '//static/events/gala-dks-30/fotolustro.webp',
    imgAlt: 'Fotolustro',
    // imgHeight: '625px',
    imgHeight: '256px',
    imgWidth: '100%',
    titleItem: 'Fotolustro',
    textItem: 'Nowoczesny automat do robienia zdjęć umożliwiający natychmiastowy wydruk odbitek niczym stary Polaroid. Śmieszne rekwizyty, brak fotografa, którego obecność często krępuje gości oraz przyjazna obsługa to elementy, które gwarantują świetną zabawę. Dostepny od ',
  },
];
const agendaItems = [
  {
    icon: '//static/events/icon/groups.svg',
    hour: '18:30',
    title: 'Pojawienie się Gości',
    speaker: `
      • Od początku dostępne w bufetach przekąski
      <br /> • Bar (zamykamy na czas występu Cezarego Pazury)
      <br /> • Wino na stołach od początku oraz drinki
    `,
  },
  {
    icon: '//static/events/icon/music-note.svg',
    hour: '18:30',
    title: 'Występ zespołu Latino Show Band',
    speaker: '',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '19:20',
    title: 'Tomasz Galiński Prezenter',
    speaker: '',
  },
  {
    icon: '//static/events/icon/co-present.svg',
    hour: '19:30',
    title: 'Przemówienie Prezesa',
    speaker: '',
  },
  {
    icon: '//static/events/icon/photo-library.svg',
    hour: '20:15',
    title: 'Sesja zdjęciowa z Cezarym Pazurą',
    speaker: '',
  },
  {
    icon: '//static/events/co_present_FILL0_wght400_GRAD0_opsz48.svg',
    hour: '20:30 do 21:30',
    title: 'Występ Cezarego Pazury',
    speaker: `
      • Zamknięcie bufetu na czas występu
    `,
  },
  {
    icon: '//static/events/icon/music-note.svg',
    hour: '21:45',
    title: 'Występ zespołu Cocktail',
    speaker: `
          • Otwarcie bufetu`,
  },
  {
    icon: '//static/events/icon/restaurant.svg',
    hour: '23:00',
    title: 'Stek Wellington',
    speaker: '',
  },
  {
    icon: '//static/events/icon/cake.svg',
    hour: '24:00',
    title: 'Tort i szampan',
    speaker: '',
  },
  {
    icon: '//static/events/icon/celebration.svg',
    hour: '03:00',
    title: 'Koniec',
    speaker: '',
  },
];

const agenda = agendaItems.map(({
  icon, hour, time, title, speaker,
}) => (
  <div className="flex flex-row w-full p-4 my-6">
    <div className="flex justify-center items-center w-16 h-16 p-2 rounded-full" style={{ backgroundColor: '#F4BE57' }}>
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
        {/* eslint-disable react/no-danger */}
        <div
          className="text-sm italic"
          dangerouslySetInnerHTML={{ __html: speaker }}
        />
      </div>
    </div>
  </div>
));

export default function questionnaire() {
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
            <Link href="#PRZEWIDZIANE-ATRAKCJE">
              <a className="relative inline-flex justify-center items-center" href="#rejestracja">
                <span style={{ whiteSpace: 'nowrap' }}>
                  PRZEWIDZIANE ATRAKCJE
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#HARMONOGRAM">
              <a className="relative inline-flex justify-center items-center" href="#O-PREZENTOWANYCH-ROZWIAZANIACH">
                <span style={{ whiteSpace: 'nowrap' }}>
                  HARMONOGRAM
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#KOLACJA-OPEN-BAR">
              <a className="relative inline-flex justify-center items-center" href="#AGENDA">
                <span style={{ whiteSpace: 'nowrap' }}>
                  KOLACJA / OPEN BAR
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#SCHEMAT">
              <a className="relative inline-flex justify-center items-center" href="#AGENDA">
                <span style={{ whiteSpace: 'nowrap' }}>
                  SCHEMAT
                </span>
              </a>
            </Link>
          </div>
          <div className="snap-start p-2">
            <Link href="#DOJAZD">
              <a className="relative inline-flex justify-center items-center" href="#AGENDA">
                <span style={{ whiteSpace: 'nowrap' }}>
                  DOJAZD
                </span>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <div id="INFORMACJE-OGoLNE" className={`bg-white w-full ${styles.eventBgColor}`} style={{ scrollMarginTop: '200px' }}>
        <div className="relative">
          <div className={`sm:h-64 ${styles.eventContent}`}>
            <div className="md:w-3/5 sm:pt-5 mb-5 md:pt-0">
              <h2 className="sm:text-3xl md:text-4xl font-black text-black uppercase">
                30 lat dks
              </h2>
              <div className={styles.eventDetails}>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <SchoolIcon className="text-black w-6 h-6 mr-2" />
                  Gala
                </div>
                <div className="text-black text-base sm:pr-4 lg:pr-8 inline-block align-baseline">
                  <EventIcon className="text-black w-6 h-6 mr-2" />
                  07.10.2023
                </div>
                <div className="text-black text-base inline-block align-baseline">
                  <PlaceIcon className="text-black w-6 h-6 mr-2" />
                  Zbrojownia Sztuki ul. Targ Węglowy 6, Gdańska
                </div>
              </div>
              <p className="text-black md:w-3/4">
                Mamy zaszczyt zaprosić na uroczystą celebrację 30-lecia naszej firmy.
                To wyjątkowy moment, który chcemy uczcić razem z Wami,
                jako naszymi niezastąpionymi pracownikami oraz gośćmi.
              </p>
            </div>
          </div>
          <div className={styles.g30LatEventbg} style={{ backgroundImage: 'url(/static/events/gala-dks-30/30-lat-dks.webp)' }} />
        </div>
      </div>

      <div className="m-auto md:max-w-screen-xl px-4 xl:px-0">
        <PresentedSolutions
          id="PRZEWIDZIANE-ATRAKCJE"
          title="Przewidziane atrakcje"
          presentedSolutionItems={PresentedSolutionItems}
        />
        <div id="HARMONOGRAM" className="sm:text-2xl text-5xl sm:py-4 md:py-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center pb-6">HARMONOGRAM</h2>
          <div className="w-full border-b-2 border-gray-400">
            <h3 className="sm:text-3xl md:text-4xl font-bold sm:leading-5 md:leading-5 xl:leading-5 mb-8" style={{ color: '#F4BE57' }}>
              07.10.2023
              {' '}
              <br />
              <span className="text-black text-lg">Sobota</span>
            </h3>
          </div>
          <div className="flex sm:flex-col md:flex-row border-t-2 border-gray-400">
            <div className="sm:w-full md:w-full">
              {agenda}
            </div>
          </div>
        </div>

        <div id="KOLACJA-OPEN-BAR" className="lg:my-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">Kolacja / open Bar</h2>
          <div className="text-center">
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Zimne finger foods</h3>
            <div>
              - Klasyczny humus ze świeżą kolendrą na grzance
              <br />
              {' '}
              - Involtini z grillowanej cukinii, rukoli i szynki dojrzewającej
              <br />
              {' '}
              - Tapenada na grzance z oliwką kalamate
              <br />
              {' '}
              - Pieczarka faszerowana z sosem blue cheese
              <br />
              {' '}
              - Empanadas z wołowiną
              <br />
              {' '}
              - Śledź z ogórkiem i papryką na grzance
              <br />
              {' '}
              - Łosoś/ sos teriyaki/ salsa mango, ogórek, chilli
              <br />
              {' '}
              - Krewetka argentyńska/ dip ziołowy
              <br />
              {' '}
              - Mini carpaccio wołowe/ rukola/parmezan
              <br />
              {' '}
              - Tatar wołowy na pumperniklu
              <br />
              {' '}
              - Kuleczki z chorizo/ salsa meksykańska
              <br />
              {' '}
              - Tatar z pomidorów z kawiorem z bazylii, kolendrą i orzechami włoskimi
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Sałatki</h3>
            <div>
              - Sałata z pastrami i fasolą
              <br />
              {' '}
              - Sałata cesar VEGE
              <br />
              {' '}
              - Sałatka a la Waldorf VEGE
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Zupy</h3>
            <div>
              - Chowder z homara z owocami morza
              <br />
              {' '}
              - Zupa krem z zielonych warzyw z prażoną grzanką
              <br />
              {' '}
              - Rosół
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Dania główne</h3>
            <div>
              - Morszczuk kapski z sosem paprykowym
              <br />
              {' '}
              - Udko z kaczki confit z powidłami śliwkowymi,
              <br />
              {' '}
              - Domowe kopytka
              <br />
              {' '}
              - Modra kapusta
              <br />
              {' '}
              - Steki z karkówki marynowane w chimichurri
              <br />
              {' '}
              - Mostek wołowy w miodzie
              <br />
              {' '}
              - Ziemniaki gratine
              <br />
              {' '}
              - Makaroni&cheese
              <br />
              {' '}
              - Złociste cząstki ziemniaczane
              <br />
              {' '}
              - Faszerowane bataty z masłem orzechowym i chrupiącym tofu
              <br />
              {' '}
              - Warzywa blanszowane
              <br />
              {' '}
              - Czerwona kapusta zasmażana z oliwą truflową
              <br />
              {' '}
              - Schabowy
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Danie późnowieczorne - krojone przez kucharzy</h3>
            <div>
              - Stek wellington z puree ziemniaczanym i konfiturowaną marchewką
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Desery</h3>
            <div>
              - Sernik nowojorski
              <br />
              {' '}
              - Brownie
              <br />
              {' '}
              - Ciasto bostońskie - mus z białej polanej czekolady - Owoce
              <br />
              {' '}
              - Kawa z ekspresu ciśnieniowego Nespresso
              <br />
              {' '}
              - Herbaty smakowe
              <br />
              {' '}
              - Woda niegazowana / gazowana (podane w karafkach)
              <br />
              {' '}
              - Soki owocowe (podane w karafkach)
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Prosecco</h3>
            <div>
              <br />
              {' '}
              - Montelvini Extra Dry (D.O.C Italy), Glera, Chrardonnay
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Wina białe</h3>
            <div>
              <br />
              {' '}
              - Casa Maria Tinto (D.O. Rueda, Hiszpania), Verdejo
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Wina Czerwone</h3>
            <div>
              <br />
              {' '}
              - Casa Maria Tinto (D.O. Rueda, Hiszpania), Tempranillo
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Inne alkohole</h3>
            <div>
              <br />
              {' '}
              - Wódka Ostaja, Absolut
              <br />
              {' '}
              - Whiskey Ballantines, Jameson
              <br />
              {' '}
              - Gin Seagrams
              <br />
              {' '}
              - Rum Havannah (3yo, 7yo)
              <br />
              {' '}
              - Tequila Olmeca (gold / silver)
              <br />
              {' '}
              - Piwo
              <br />
              {' '}
              - Campari, Aperol, Martini
            </div>
            <br />
            <hr />

            <br />
            <h3 className="sm:text-2xl text-3xl font-bold uppercase text-center md:pb-6">Barman poleca koktajle</h3>
            <div>
              <br />
              {' '}
              - Clover Club
              <br />
              {' '}
              - New York Sour
              <br />
              {' '}
              - Manhattan
              <br />
              {' '}
              - Old Cuban
              <br />
              {' '}
              - Cosmopolitan
              <br />
              {' '}
              - Kir Royal
              <br />
              {' '}
              - Mojito
            </div>
            <br />
            <hr />
          </div>
        </div>

        <div id="SCHEMAT" className="lg:my-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">Schemat</h2>
          <div className="flex relative" style={{ height: '100vh', width: '70vw' }}>
            <Image
              src="//static/events/gala-dks-30/schemat.webp"
              alt="schemat"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>

        <div id="DOJAZD" className="lg:my-16" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">Dojazd</h2>
          <div className="flex relative" style={{ height: '50vh', width: '100%' }}>
            <Image
              src="//static/events/gala-dks-30/zbrojownia.webp"
              alt="schemat"
              layout="fill"
              objectFit="contain"
            />
          </div>
          <iframe
            title="Zbrojownia Sztuki"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d977.6885453286051!2d18.647365107224214!3d54.350825124252886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd739e607ad40d%3A0xd6142591ae241db!2sTarg%20W%C4%99glowy%206%2C%2080-836%20Gda%C5%84sk!5e0!3m2!1spl!2spl!4v1696533497644!5m2!1spl!2spl"
            width="100%"
            height="450"
            style={{ border: '0' }}
            allowFullScreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </Layout>
  );
}

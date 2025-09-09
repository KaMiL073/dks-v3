import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import ContactForm from '../components/elements/contactForm';
import ServiceCallForm from '../components/elements/serviceCallFormClientZone';
import ConsumablesOrderForm from '../components/elements/consumablesOrderFormClientZone';
import CountersForm from '../components/elements/countersFormClientZone';
import DebtCollectionForm from '../components/elements/debtCollectionForm';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Accordion from '../components/elements/accordion';
import React from 'react';

import styles from '../styles/ClientZone.module.scss';
import {
  Maths26, Telesales, Geography6, Money163,
} from '../components/icons/puppets';

const TITLE = 'Strefa klienta';
const METAROBOTS = 'noindex';

function ContactSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [false, false, false];
  tabs[activeTab] = true;
  

  return (
        <div className="mx-2 md:mr-4 sm:mt-10">
          <div className="w-full border-b-2 pb-4 border-solid mb-6 flex">
            <span
              onClick={() => { setActiveTab(0); }}
              onKeyPress={() => { setActiveTab(0); }}
              role="button"
              tabIndex={0}
              className={`w-full md:w-15 ${styles.tab} ${tabs[0] ? styles.active : ''}`}
            >
              Kontakt
            </span>
            <span
              onClick={() => { setActiveTab(1); }}
              onKeyPress={() => { setActiveTab(1); }}
              role="button"
              tabIndex={0}
              className={`w-full md:w-1/4 ${styles.tab} ${tabs[1] ? styles.active : ''}`}
            >
              zgłoszenie serwisowe
            </span>
            <span
              onClick={() => { setActiveTab(2); }}
              onKeyPress={() => { setActiveTab(2); }}
              role="button"
              tabIndex={0}
              className={`w-full md:w-3/12 ${styles.tab} ${tabs[2] ? styles.active : ''}`}
            >
              zamawianie materiałów eksploatacyjnych
            </span>
            <span
              onClick={() => { setActiveTab(3); }}
              onKeyPress={() => { setActiveTab(3); }}
              role="button"
              tabIndex={0}
              className={`w-full md:w-1/6 ${styles.tab} ${tabs[3] ? styles.active : ''}`}
            >
              liczniki
            </span>
            <span
              onClick={() => { setActiveTab(4); }}
              onKeyPress={() => { setActiveTab(4); }}
              role="button"
              tabIndex={0}
              className={`w-full md:w-1/6 ${styles.tab} ${tabs[4] ? styles.active : ''}`}
            >
              dział Windykacji
            </span>
            
          </div>
          <div className="relative">
            <div className={`${styles.contentTab} ${tabs[0] ? styles.active : ''}`}>
              <ContactForm />
            </div>
            <div className={`${styles.contentTab} ${tabs[1] ? styles.active : ''}`}>
              <ServiceCallForm />
            </div>
            <div className={`${styles.contentTab} ${tabs[2] ? styles.active : ''}`}>
              <ConsumablesOrderForm />
            </div>
            <div className={`${styles.contentTab} ${tabs[3] ? styles.active : ''}`}>
              <CountersForm />
            </div>
            <div className={`${styles.contentTab} ${tabs[4] ? styles.active : ''}`}>
              <DebtCollectionForm />
            </div>
          </div>
        </div>
  );
}

export default function ClientSection() {
  const faqData = [
    { 
      question: 'Minął termin płatności za fakturę', 
      answer: `Prosimy w takiej sytuacji o kontakt z Działem Windykacji 
      pod adresem windykacja@dks.pl w celu ustalenia dalszych kroków oraz 
      zachowania ciągłości świadczenia usług.` },
    {
      question: 'Dostałem Wezwanie do Zapłaty', 
      answer: `Oznacza to, że Państwa zobowiązanie przekroczyło 30 dni zwłoki, 
      co spowodowało wygenerowanie dokumentu informującego o dalszych krokach 
      windykacyjnych przy utrzymującym się stanie zaległości. 
      Zachęcamy do skontaktowania się z Działem Windykacji pod adresem windykacja@dks.pl`},
    { 
      question: 'Dostałem MONIT', 
      answer: `Jest to automatyczna wiadomość mailowa wysyłana przez system w sytuacji 
      zarejestrowania przeterminowanego zobowiązania. Zachęcamy do przesłania w odpowiedzi 
      potwierdzenia wpłaty lub informacji co jest przyczyną zwłoki w płatności, 
      co wpłynie na ciągłość świadczenia usług.`
    },
    { 
      question: 'Nie dostałem faktury', 
      answer: `Jeżeli rozliczenia odbywają się na podstawie podpisanej umowy o świadczenie 
      usług, bardzo proszę o kontakt z Działem Rozliczeń pod adresem  serwis.rozliczenia@dks.pl, 
      który wystawia oraz dostarcza faktury. 
      <br /><br /> W sytuacji rozliczenia bez umowy bardzo proszę 
      o wiadomość na adres windykacja@dks.pl` 
    },
    { 
      question: 'Limit Kupiecki', 
      answer: `Jest to ubezpieczenie należności nadawane przez naszego ubezpieczyciela 
      dla działalności gospodarczych działających na rynku więcej niż 12 miesięcy. 
      Przyznanie limitu pozwala na prowadzenie transakcji w formie przelewu 
      z określonym terminem płatności. Każda firma jest indywidualnie weryfikowana.`},
    { 
      question: 'Numer NIP uległ zmianie', 
      answer: `Bardzo proszę o wiadomość na adres: windykacja@dks.pl z aktualnym numerem NIP. 
      Przekażemy dalsze kroki aktualizacji danych w systemie.`
    },
    { 
      question: 'Aktualizacja danych adresowych', 
      answer: `Bardzo proszę o nowe dane na 
      adres: windykacja@dks.pl. Zwrotnie przekażemy informację o zmianie w systemie. 
      <br /><br /> Bardzo ważne, aby zmiana danych była wprowadzona w dokumentach rejestrowych: KRS lub CEiDG. 
      Tylko wtedy będziemy mogli wprowadzić aktualizację po naszej stronie.`
    },
  ];

  return (
    <Layout title={TITLE} metaRobots={METAROBOTS} useRecaptcha>
      <HeaderTop title={TITLE} imgSrc="/static/header_kontakt.webp" />
      <div className="w-full md:max-w-screen-xl">
        <div className="flex sm:flex-col md:mb-10">
          <div className="md:w-1/3">
            <div className="h-64 md:h-80 relative"><Image src="//static/pages/strefa-klienta.webp" alt="Strefa klienta" layout="fill" objectFit="contain" /></div>
            <div className="flex-col sm:px-4">

              <div className="text-xs flex sm:justify-between">
                <div className="w-1/6 text-5xl my-auto text-dks-red"><Telesales /></div>
                <div className="sm:w-2/3  pl-3">
                  <h5 className="text-xl font-bold my-5">Dział Obsługi Klienta</h5>
                  <p>
                    <span className="font-bold">Telefon: </span>
                    <Link href="tel:583506605">
                      <a className="text-dks-sea-blue hover:text-dks-red" href="tel:583506605">58 350 66 05</a>
                    </Link>
                  </p>
                  <p>
                    <span className="font-bold">Telefon: </span>
                    <Link href="tel:801004104">
                      <a className="text-dks-sea-blue hover:text-dks-red" href="tel:801004104">801 004 104</a>
                    </Link>
                  </p>
                  <p className="mt-2">wew. 1 - zgłoszenia serwisowe</p>
                  <p>wew. 2 - zamówienia materiałów eksploatacyjnych</p>
                  <p>wew. 3 - rozliczenia dotyczące umów i faktur</p>
                  <p className="mt-2">
                    <span className="font-bold">E-mail: </span>
                    <Link href="mailto:serwis@dks.pl">
                      <a className="text-dks-red hover:text-dks-sea-blue" href="mailto:serwis@dks.pl">serwis@dks.pl</a>
                    </Link>
                  </p>
                </div>
              </div>

              <div className="text-xs flex sm:justify-between">
                <div className="w-1/6 text-5xl my-auto text-dks-red"><Maths26 /></div>
                <div className="sm:w-2/3  pl-3">
                  <h5 className="text-xl font-bold my-5">Dział Księgowości</h5>
                  <p>
                    <span className="font-bold">Telefon: </span>
                    <Link href="tel:662997644">
                      <a className="text-dks-sea-blue hover:text-dks-red" href="tel:532362392">532 362 392</a>
                    </Link>
                  </p>
                  <p className="mt-3">
                    <span className="font-bold">E-mail: </span>
                    <Link href="mailto:ksiegowosc@dks.pl">
                      <a className="text-dks-red hover:text-dks-sea-blue" href="mailto:ksiegowosc@dks.pl">ksiegowosc@dks.pl</a>
                    </Link>
                  </p>
                </div>
              </div>

              <div className="text-xs flex sm:justify-between">
                <div className="w-1/6 text-3xl my-auto text-dks-red"><Money163 /></div>
                <div className="w-2/3 md:w-3/4 pl-3">
                  <h5 className="text-xl font-bold my-5">Dział Windykacji</h5>
                  <p>
                    <span className="font-bold">Telefon: </span>
                    <Link href="tel:587630610">
                      <a className="text-dks-sea-blue hover:text-dks-red" href="tel:587630610">58 763 06 10</a>
                    </Link>
                  </p>
                  <p className="mt-3">
                    <span className="font-bold">E-mail: </span>
                    <Link href="mailto:windykacja@dks.pl">
                      <a className="text-dks-red hover:text-dks-sea-blue" href="mailto:windykacja@dks.pl">windykacja@dks.pl</a>
                    </Link>
                  </p>
                </div>
              </div>

              <div className="text-xs flex sm:justify-between">
                <div className="w-1/6 text-6xl my-auto text-dks-red"><Geography6 /></div>
                <div className="sm:w-2/3 pl-3">
                  <h5 className="text-xl font-bold my-5">Dział Eksportu</h5>
                  <p>
                    <span className="font-bold">Telefon: </span>
                    <Link href="tel:+48664941146">
                      <a className="text-dks-sea-blue hover:text-dks-red" href="tel:+48664941146">+48 664 941 146</a>
                    </Link>
                  </p>
                  <p>
                    <span className="font-bold">Telefon: </span>
                    <Link href="tel:+48600338951">
                      <a className="text-dks-sea-blue hover:text-dks-red" href="tel:+48600338951">+48 600 338 951</a>
                    </Link>
                  </p>
                  <p className="mt-3">
                    <span className="font-bold">E-mail: </span>
                    <Link href="mailto:export.copiers@dks.pl">
                      <a className="text-dks-red hover:text-dks-sea-blue" href="mailto:export.copiers@dks.pl">export.copiers@dks.pl</a>
                    </Link>
                  </p>
                </div>
              </div>

            </div>
          </div>

          <section className="w-full px-2">
            <div className="md:mx-auto md:max-w-screen-xl py-12">
              <h3 className="text-5xl font-bold sm:px-4 pb-10">Kontakt</h3>
              <ContactSection />
              <div className="mt-5">
                <div>
                  <h3 className="text-5xl font-bold sm:px-4 pb-10">FAQ</h3>
                  <Accordion faqData={faqData} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

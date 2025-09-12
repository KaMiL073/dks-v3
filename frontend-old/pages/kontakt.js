import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import ContactForm from '../components/elements/contactForm';
import ServiceCallForm from '../components/elements/serviceCallForm';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import DepartmentsList from '../components/elements/departmentsList';
import styles from '../components/homepage/styles/contactSection.module.scss';
import {
  Maths26, Telesales, Geography6, Money163,
} from '../components/icons/puppets';

const TITLE = 'Kontakt do DKS: dane teleadresowe 12 oddziałów na terenie Polski';
const DESCRIPTION = 'Dane kontaktowe firmy DKS w Gdańsku, Warszawie, Katowicach, Poznaniu, Łodzi, Krakowie, Szczecinie, Bydgoszczy, Olsztynie, Rzeszowie, Białymstoku i Wrocławiu.';
function ContactSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [false, false];
  tabs[activeTab] = true;

  return (
    <section className="w-full">
      <div className="md:mx-auto md:max-w-screen-xl py-12">
        <h3 className="text-5xl font-bold sm:px-4 pb-10">Kontakt</h3>
        <div className="flex sm:flex-col">
          <div className="md:w-1/2 mx-2 px-1">
            <div className={styles.contactImagePrimary}><Image src="//static/pages/contact_1.webp" alt="Kontakt 1" layout="fill" objectFit="contain" /></div>
            <div className="flex mt-4">
              <div className="w-1/2 h-28 md:h-56 relative"><Image src="//static/pages/contact_2.webp" alt="Kontakt 2" layout="fill" objectFit="contain" /></div>
              <div className="w-1/2 h-28 md:h-56 relative"><Image src="//static/pages/contact_3.webp" alt="Kontakt 3" layout="fill" objectFit="contain" /></div>
            </div>
          </div>
          <div className="md:w-1/2 mx-2 md:mr-4 sm:mt-10">
            <div className="w-full border-b-2 pb-3 border-solid">
              <span
                onClick={() => { setActiveTab(0); }}
                onKeyPress={() => { setActiveTab(0); }}
                role="button"
                tabIndex={0}
                className={`${styles.tab} ${tabs[0] ? styles.active : ''}`}
              >
                formularz kontaktowy
              </span>
              <span
                onClick={() => { setActiveTab(1); }}
                onKeyPress={() => { setActiveTab(1); }}
                role="button"
                tabIndex={0}
                className={`float-right ${styles.tab} ${tabs[1] ? styles.active : ''}`}
              >
                zgłoszenie serwisowe
              </span>
            </div>
            <div className="relative">
              <div className={`${styles.contentTab} ${tabs[0] ? styles.active : ''}`}>
                <ContactForm />
              </div>
              <div className={`${styles.contentTab} ${tabs[1] ? styles.active : ''}`}>
                <ServiceCallForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Contact() {
  return (
    <Layout title={TITLE} description={DESCRIPTION} useRecaptcha>
      <HeaderTop title="Kontakt do firmy DKS" imgSrc="/static/header_kontakt.webp" />
      <div className="w-full md:max-w-screen-xl px-8 md:px-0">
        <p>
          Zapraszamy do kontaktu z naszymi oddziałami w 12 największych miastach wojewódzkich
          w Polsce.
          Podajemy
          {' '}
          <strong>
            dane teleadresowe siedziby głównej
            DKS w Gdańsku oraz 11 oddziałów
          </strong>
          {' '}
          w Warszawie, Katowicach,
          Poznaniu, Łodzi, Krakowie, Szczecinie, Bydgoszczy,
          Olsztynie, Rzeszowie, Białymstoku i Wrocławiu.
          Polecamy korzystanie z formularza kontaktowego:
          umożliwia on szybkie i wygodne przesyłanie wiadomości
          lub dokonanie zgłoszenia serwisowego.
          Niezależnie od tego, jaką masz maszynę drukującą,
          możesz liczyć na fachową poradę i wsparcie serwisowe.
          Zapraszamy do kontaktu!
        </p>
        <div className="flex sm:flex-col py-12">
          <div className="md:w-1/3">
            <iframe title="Dks mapa" loading="lazy" src="/static/map/index.html" width="100%" height="330px" />
          </div>
          <div className="md:w-1/3 text-sm p-6">
            <h5 className="text-xl font-bold">DKS Sp. z o.o.</h5>
            <p className="mt-4">
              UL. ENERGETYCZNA 15,
              <br />
              80-180 KOWALE
            </p>
            <p className="mt-8">
              <span className="font-bold mt-3">Telefon: </span>
              <Link href="tel:583090307">
                <a className="text-dks-sea-blue hover:text-dks-red" href="tel:583090307">58 309 03 07</a>
              </Link>
              <br />
              <span className="font-bold mt-3">E-mail: </span>
              <Link href="mailto:kontakt@dks.pl">
                <a className="text-dks-sea-blue hover:text-dks-red" href="mailto:kontakt@dks.pl">kontakt@dks.pl</a>
              </Link>
            </p>
            <p className="mt-8 text-dks-font">
              NIP: 583-27-90-417
              <br />
              KRS: 0000099557
              <br />
              REGON: 190917946
            </p>
            <p>
              <br />
              Wysokość kapitału zakładowego 1.025.000 zł.
            </p>
          </div>
          <div>
            <iframe
              title="Mapa z lokalizacją firmy"
              loading="lazy"
              style={{ border: 0, maxHeight: '312px', maxWidth: '100%' }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2327.275768615877!2d18.549036715875324!3d54.31675598019384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fd7698e9e3af7f%3A0xfc429fd54aa89ec3!2sEnergetyczna%2015%2C%2080-180%20Kowale!5e0!3m2!1spl!2spl!4v1625664627445!5m2!1spl!2spl"
              width="600"
              height="450"
            />
          </div>
        </div>
      </div>
      <div className="w-full bg-dks-medium-gray py-10 md:py-20 px-4 xl:px-0">
        <div className="w-full md:max-w-screen-xl mx-auto sm:px-4">
          <h3 className="text-5xl font-bold">Kontakt</h3>
          <div className="flex sm:flex-col">
            <div className="md:w-1/4 text-xs flex sm:justify-between">
              <div className="text-6xl my-auto text-dks-red"><Maths26 /></div>
              <div className="sm:w-2/3">
                <h5 className="text-lg font-bold my-5">Dział Księgowości</h5>
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
            <div className="md:w-1/4 text-xs flex sm:justify-between">
              <div className="text-6xl my-auto text-dks-red"><Telesales /></div>
              <div className="sm:w-2/3">
                <h5 className="text-lg font-bold my-5">Dział Obsługi Klienta</h5>
                <p>
                  <span className="font-bold">Telefon: </span>
                  <Link href="tel:583506605">
                    <a className="text-dks-sea-blue hover:text-dks-red" href="tel:583506605">58 350 66 05</a>
                  </Link>
                </p>
                <p className="mt-3">
                  <span className="font-bold">E-mail: </span>
                  <Link href="mailto:serwis@dks.pl">
                    <a className="text-dks-red hover:text-dks-sea-blue" href="mailto:serwis@dks.pl">serwis@dks.pl</a>
                  </Link>
                </p>
              </div>
            </div>
            <div className="md:w-1/4 text-xs flex sm:justify-between">
              <div className="text-6xl my-auto text-dks-red"><Geography6 /></div>
              <div className="sm:w-2/3">
                <h5 className="text-lg font-bold my-5">Dział Eksportu</h5>
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
            <div className="md:w-1/4 text-xs flex sm:justify-between">
              <div className="text-6xl my-auto text-dks-red"><Money163 /></div>
              <div className="sm:w-2/3">
                <h5 className="text-lg font-bold my-5">Dział Windykacji</h5>
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
          </div>
        </div>
      </div>
      <div className="w-full md:max-w-screen-xl px-4 xl:px-0">
        <ContactSection />
      </div>
      <div className="w-full bg-dks-medium-gray">
        <div className="w-full md:max-w-screen-xl mx-auto pb-16">
          <h3 className="text-5xl font-bold py-16 px-4 xl:px-0">Oddziały</h3>
          <DepartmentsList />
        </div>
      </div>
    </Layout>
  );
}

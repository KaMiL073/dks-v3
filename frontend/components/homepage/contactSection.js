import { useState } from 'react';
import ContactForm from '../elements/contactForm';
import ServiceCallForm from '../elements/serviceCallForm';
import styles from './styles/contactSection.module.scss';

export default function ContactSection() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [false, false];
  tabs[activeTab] = true;

  return (
    <section className="w-full px-4 xl:px-0">
      <div className="md:mx-auto md:max-w-screen-xl py-12">
        <h3 className="text-5xl font-bold pb-10">Kontakt</h3>
        <div className="flex sm:flex-col">
          <div className="md:w-1/2 mx-2 md:mr-4">
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
          <div className="md:w-1/2 mx-2">
            <h5 className="font-bold text-lg mb-6">DKS Sp. z o.o.</h5>
            <div className="flex text-sm">
              <div className="w-1/2">
                ul. Energetyczna 15,
                <br />
                80-180 Kowale
              </div>
              <div className="w-1/2">
                Telefon:    58 309 03 07
                <br />
                E-mail:    kontakt@dks.pl
              </div>
            </div>
            <div className="w-full mt-4">
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
      </div>
    </section>
  );
}

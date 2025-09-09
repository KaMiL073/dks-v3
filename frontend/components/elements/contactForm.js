import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Link from 'next/link';
import { submitForm } from '../../lib/api/frontApi';

import styles from '../../styles/Forms.module.scss';

export default function ContactForm() {
  const formName = 'ContactForm';

  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (data) => {
    const dataExtended = { ...data };

    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha(formName);
    dataExtended.recaptchaResponse = token;

    dataExtended.formName = formName;

    try {
      await submitForm(dataExtended);
      setFormSubmitted(true);

      // Wysłanie zdarzenia do DataLayer
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'form_submit', // Nazwa zdarzenia
        form_id: formName, // ID formularza
        form_name: 'Contact Form', // Opis formularza
        // form_fields: {
          // name: dataExtended.name,
          // email: dataExtended.email,
          // phone: dataExtended.phone,
          // province: dataExtended.province,
          // message: dataExtended.message,
          // clause_for_answers: dataExtended.clause_for_answers,
          // clause: dataExtended.clause,
        // },
      });
    } catch (error) {
      console.error('form: ', error);
    }
  };

  return (
    <form id="contactForm" className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label htmlFor="name">Imię i nazwisko / Nazwa firmy:</label>
        <input
          {...register('name')}
          id={`${formName}_name`}
          name="name"
          type="text"
          autoComplete="name"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">E-mail:</label>
        <input
          {...register('email')}
          id={`${formName}_email`}
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Telefon:</label>
        <input
          {...register('phone')}
          id={`${formName}_phone`}
          name="phone"
          type="tel"
          pattern="[0-9\+]{8,13}"
          autoComplete="phone"
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="province">Województwo:</label>
        <select {...register('province')} name="province" id={`${formName}_province`} required>
          <option value="pomorskie">Pomorskie</option>
          <option value="mazowieckie">Mazowieckie</option>
          <option value="slaskie">Śląskie</option>
          <option value="wielkopolskie">Wielkopolskie</option>
          <option value="lodzkie">Łódzkie</option>
          <option value="malopolskie">Małopolskie</option>
          <option value="zachodniopomorskie">Zachodniopomorskie</option>
          <option value="kujawsko-pomorskie">Kujawsko-pomorskie</option>
          <option value="warminsko-mazurskie">Warmińsko-mazurskie</option>
          <option value="podkarpackie">Podkarpackie</option>
          <option value="podlaskie">Podlaskie</option>
          <option value="dolnoslaskie">Dolnośląskie</option>
        </select>
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label htmlFor="message">Treść wiadomości:</label>
        <textarea
          {...register('message')}
          className="h-40"
          id={`${formName}_message`}
          name="message"
          type="text"
          autoComplete="message"
          required
        />
      </div>

      <div className={`${styles.field} ${styles.full} ${styles.checkbox}`}>
        <input
          {...register('clause_for_answers')}
          id={`${formName}_clause_for_answers`}
          name="clause_for_answers"
          type="checkbox"
          autoComplete="clause_for_answers"
        />
        <label htmlFor="clause_for_answers">
          Wyrażam zgodę na przetwarzanie moich danych osobowych podanych
          w powyższym formularzu przez DKS Sp. z o.o.,
          zgodnie z przepisami rozporządzenia Parlamentu Europejskiego
          i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.
          w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych
          i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE
          (ogólne rozporządzenie o ochronie danych),
          Dz. Urz. UE z 4.5.2016 r. L 119, str. 1,
          w celu udzielenia odpowiedzi na złożone zapytanie.
          Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej zrezygnować.
          Żądanie usunięcia danych proszę kierować na adres rodo@dks.pl.
          Cofnięcie zgody na przetwarzanie danych nie ma wpływu
          na przetwarzanie danych dokonane przed jego zgłoszeniem.
        </label>
      </div>
      <div className={`${styles.field} ${styles.full} ${styles.checkbox}`}>
        <input
          {...register('clause')}
          id={`${formName}_clause`}
          name="clause"
          type="checkbox"
          autoComplete="clause"
        />
        <label htmlFor="clause">
          Wyrażam zgodę na przetwarzanie moich danych osobowych podanych
          w powyższym formularzu przez DKS Sp. z o.o.,
          zgodnie z przepisami rozporządzenia Parlamentu Europejskiego
          i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r.
          w sprawie ochrony osób fizycznych w związku
          z przetwarzaniem danych osobowych
          i w sprawie swobodnego przepływu takich danych
          oraz uchylenia dyrektywy 95/46/WE
          (ogólne rozporządzenie o ochronie danych),
          Dz. Urz. UE z 4.5.2016 r. L 119, str. 1,
          w celu otrzymywania od DKS Sp. z o.o.
          treści marketingowych oraz informacji handlowych,
          w tym informacji o promocjach i ofertach,
          za pośrednictwem podanego adresu e-mail oraz numeru telefonu.
          Zgoda jest dobrowolna i w każdym dowolnym momencie można z niej zrezygnować.
          Żądanie usunięcia danych proszę kierować na adres rodo@dks.pl.
          Cofnięcie zgody na przetwarzanie danych nie ma wpływu na przetwarzanie danych dokonane przed jego zgłoszeniem.
        </label>
      </div>
      <div className="text-tiny leading-3 mb-6">
        <p>
          Informujemy, że: Administratorem Pani/Pana danych osobowych jest DKS Sp. z o.o.,
          z siedzibą przy ul. Energetycznej 15, 80-180 Kowale, e-mail: rodo@dks.pl.
        </p>
        <p>
          Więcej informacji o tym, jak przetwarzamy Twoje dane znajdziesz w
          {' '}
          <Link href="/klauzula-ochrony-danych-data-protection">
            <a className="text-dks-red" href="klauzula-ochrony-danych-data-protection">
              Klauzuli Ochrony Danych.
            </a>
          </Link>
        </p>
      </div>

      <div className={styles.captcha}>
        <small className="text-tiny">
          korzysta z zabezpieczenia reCAPTCHA
          <br />
          <a href="https://www.google.com/intl/pl/policies/privacy/" target="_blank" rel="noreferrer">Prywatność</a>
          <span aria-hidden="true" role="presentation"> - </span>
          <a href="https://www.google.com/intl/pl/policies/terms/" target="_blank" rel="noreferrer">Warunki</a>
        </small>
      </div>

      <div className={`${styles.field}`}>
        {
          formSubmitted
            ? (<button type="button" disabled>Dziękujemy za zgłoszenie!</button>)
            : (<button type="submit">Wyślij</button>)
        }
      </div>
    </form>
  );
}

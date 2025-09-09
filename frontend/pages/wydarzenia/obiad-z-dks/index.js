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

const collectionName = 'events';

function QuestionnaireForm({ fields }) {
  const formName = 'event';

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
    <div key={field.name}><FieldElement dataField={field} register={register} /></div>
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

export default function questionnaire({ fields }) {
  return (
    <Layout useRecaptcha>
      <div className="md:max-w-screen-xl px-4 xl:px-0 ">
        <div className="md:flex py-5 items-center">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-black">
              <span style={{ color: '#16A34A' }}>
                Zapraszamy
                <br />
                {' '}
                na
              </span>
              {' '}
              Obiad z DKS
            </h2>
            <br />
            <p>
              Data: 17.05.2023r | Godz.: 11:00
              {' '}
              <br />
              Miejsce: Pole Golfowe Black Water Links Szkolna, 62-080 Rumianek
              {' '}
              <br />
              W trakcie wydarzenia skupimy się na prezentacjach rozwiązań
              i produktów: Lenovo, Lexmark, ITS, Koncept-L S.A.
            </p>
            <Link href="#rejestracja" type="button">
              <a className="bg-dks-footer md:w-3/4 mt-8 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block" href="#rejestracja">
                Zarejestruj się
              </a>
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="flex relative w-full" style={{ height: '600px' }}>
              <Image
                src="//static/events/obiad-z-dks-1.webp"
                alt="wydarzenie: Obiad-z DKS"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>

        <div className="md:flex pb-20">
          <div className="md:w-1/2">
            <div className="flex relative w-full h-96">
              <Image
                src="//static/events/obiad-z-dks-2.png"
                alt="wydarzenie: Obiad-z DKS"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <p>
              Wydarzenie rozpoczynamy o godzinie 11:00.
              <br />
              Szczegółową agendę spotkania dostaną Państwo oddzielną wiadomością
              po rejestracji na stronie wydarzenia.
            </p>
            <br />
            <p>Agenda:</p>
            <ol className="list-decimal pl-9">
              <li>Rejestracja</li>
              <li>
                Prezentacje producentów na przykładach praktycznych zastosowań
                wśród naszych klientów
              </li>
              <li>Obiad</li>
              <li>Szkolenie z podstaw golfa</li>
              <li>Mistrzostwa Driving Range/Wycieczka melexami po polu golfowym</li>
              <li>Wręczenie nagród i zakończenie</li>
            </ol>
            <p>
              <br />
              Nie zabraknie wspaniałej rozrywki, którą po przerwie kawowej zagwarantuje szkolenie
              z podstaw golfa, które poprowadzi doświadczony instruktor.
              Zaproszeni goście wezmą udział w mistrzostwach driving range oraz „wycieczce”
              melexami po polu golfowym.
              Dla najlepszych graczy na koniec zabawy wręczymy atrakcyjne nagrody.
              To będzie doskonała okazja, aby w miłej atmosferze poznać produkty
              i rozwiązania, które oferujemy naszym klientom oraz nawiązać
              wartościowe kontakty biznesowe.
              Prosimy o potwierdzenie udziału w wydarzeniu klikając w formularz na stronie.
              Liczymy, że zobaczymy się z Państwem w 17 dniu maja 2023r.
            </p>

          </div>
        </div>

        <div className="text-center py-20">
          <h3 className="text-4xl pb-16">
            <strong>
              <span style={{ color: '#16A34A' }}>Dlaczego</span>
              {' '}
              warto?
            </strong>
          </h3>

          <div className="flex sm:flex-col md:flex-row">
            <div className="p-2">
              <h4>
                <strong>
                  1. Poznanie najnowszych
                  <br />
                  {' '}
                  rozwiązań i technologii
                  {' '}
                </strong>
              </h4>
              <br />
              <p>
                Spotkanie stanowi doskonałą okazję do
                <br />
                {' '}
                zapoznania się z najnowszymi
                <br />
                {' '}
                rozwiązaniami i technologiami, które mogą
                <br />
                {' '}
                przynieść korzyści Państwa firmie.
              </p>
            </div>
            <div className="p-2">
              <h4>
                <strong>
                  2. Praktyczna wiedza i inspiracja
                  <br />
                  {' '}
                  dzięki case study
                </strong>
              </h4>
              <br />
              <p>
                Prezentacje case study umożliwiają
                <br />
                {' '}
                poznanie praktycznych zastosowań,
                <br />
                {' '}
                innowacyjnych rozwiązań w biznesie oraz
                <br />
                {' '}
                inspirują do własnych działań i projektów.
              </p>
            </div>
            <div className="p-2">
              <h4>
                <strong>
                  3. Eksperci
                  <br />
                  <br />
                </strong>
              </h4>
              <br />
              <p>
                Na spotkaniu wystąpią eksperci, którzy po
                <br />
                {' '}
                prezentacjach odpowiedzą na Państwa
                <br />
                {' '}
                pytania
              </p>
            </div>
            <div className="p-2">
              <h4>
                <strong>
                  4. Świetna atmosfera i dobra
                  <br />
                  {' '}
                  zabawa
                  {' '}
                </strong>
              </h4>
              <br />
              <p>
                Oprócz wiedzy o najnowszych
                <br />
                {' '}
                rozwiązaniach i produktach biznesowych
                <br />
                {' '}
                zawodowi instruktorzy z Black Water Links
                <br />
                {' '}
                spróbują zaszczepić Państwu golfowego
                <br />
                {' '}
                bakcyla
              </p>
            </div>
          </div>
        </div>

        <div className="text-center py-20">
          <h3 className="text-4xl pb-16"><strong><span style={{ color: '#16A34A' }}>Partnerzy</span></strong></h3>

          <div className="flex justify-between">
            <div className="p-2">
              <Image src="//static/events/lenovo.svg" width="206px" height="60px" />

            </div>

            <div className="p-2">
              <Image src="//static/events/lexmark.svg" width="291px" height="60px" />
            </div>
            <div className="p-2">
              <Image src="//static/events/koncplt-l.svg" width="197px" height="60px" />

            </div>
            <div className="p-2">
              <Image src="//static/events/its.svg" width="197px" height="60px" />
            </div>
          </div>
        </div>
        <div className="text-center py-20">
          <h3 className="text-4xl pb-16">
            <strong>
              <span style={{ color: '#16A34A' }}>Zarejestruj się</span>
              {' '}
              na wydarzenie
            </strong>
          </h3>
          <p>
            To będzie doskonała okazja, aby spędzić czas w miłej atmosferze
            i nawiązać wartościowe kontakty biznesowe.
            <br />
            {' '}
            Liczymy na wspaniałą zabawę i ciekawe dyskusje na temat branży.
          </p>
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

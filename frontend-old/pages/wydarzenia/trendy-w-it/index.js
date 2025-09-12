import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { submitFormGeneration } from '../../../lib/api/frontApi';
import Layout from '../../../components/layouts/layout';
import getFields from '../../../lib/models/fields';
import FieldElement from '../../../components/elements/input';
import getEventsItem from '../../../lib/models/eventsItem';
import addZero from '../../../lib/helpers/addZero';

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
          <a href="https://www.google.com/intl/pl/policies/privacy/" target="_blank" rel="noreferrer">
            Prywatność
          </a>
          <span aria-hidden="true" role="presentation"> - </span>
          <a href="https://www.google.com/intl/pl/policies/terms/" target="_blank" rel="noreferrer">
            Warunki
          </a>
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


export default function questionnaire({ fields, eventsItem }) {
  const event = eventsItem;
  let date;
  
  const dayMonthHourFormat = Intl.DateTimeFormat('pl', {
    year: 'numeric', day: 'numeric', month: 'numeric',
  });
  
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  if (event.end_date === null) {
    date = dayMonthHourFormat.format(startDate);
  } else {
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = endDate.getMonth() + 1;
    const year = endDate.getFullYear();
    date = `${`${addZero(startDay)}/${addZero(endDay).padStart(2, 0)}.${addZero(month)}.${addZero(year)}`}`;
  }

  const url = process.env.NEXT_NODE_ENV == "development" ? "http://localhost" : "https://www.dks.pl";

return (
    <Layout title={event.name} description={event.lead} ogImage={`${url}/backend/assets/${event.ogimage}`} useRecaptcha>
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="rejestracja" className="py-4" style={{ scrollMarginTop: '200px' }}>
          <h2 className="sm:text-2xl text-5xl font-bold uppercase text-center md:pb-6">
            <span style={{color: '#D29D4A'}}>Zarejestruj się</span> na wydarzenie</h2>
          <div className="py-12">
            <p className="text-center">
            Zarezerwuj miejsce już dziś</p>
            <QuestionnaireForm fields={fields} />
          </div>
        </div>
      </div>

    </Layout>
  );
}

export async function getStaticProps() {
  const eventsItem = await getEventsItem('trendy-w-it');

  return {
    props: {
      fields: await getFields(collectionName),
      eventsItem,
    },
    revalidate: 60, // 60,
  };
}

QuestionnaireForm.propTypes = {
  fields: PropTypes.string.isRequired,
};

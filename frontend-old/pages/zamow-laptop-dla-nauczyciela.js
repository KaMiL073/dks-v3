import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import Link from 'next/link';
import { submitFormGeneration } from '../lib/api/frontApi';
import Layout from '../components/layouts/layout';
import getFields from '../lib/models/fields';
import FieldElement from '../components/elements/input';

const collectionName = 'order';

function QuestionnaireForm({ fields, model }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { register, handleSubmit } = useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = async (data) => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    const token = await executeRecaptcha('order');
    const dataExtended = { ...data, recaptchaResponse: token, formName: 'order' };

    try {
      await submitFormGeneration(collectionName, dataExtended);
      setFormSubmitted(true);
    } catch (error) {
      console.error('form: ', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="md:max-w-screen-xl mx-auto">
        {fields.map((field) => (
          <div key={field.name}>
            <FieldElement dataField={field} event={model} register={register} />
          </div>
        ))}
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
        {formSubmitted ? (
          <button className="bg-dks-footer h-12 rounded w-3/4 uppercase text-white font-bold mx-auto block" type="button" disabled>
            Dziękujemy za zgłoszenie!
          </button>
        ) : (
          <button className="bg-dks-footer h-12 rounded w-3/4 uppercase text-white font-bold mx-auto block" type="submit">
            Wyślij
          </button>
        )}
      </div>
    </form>
  );
}

export default function Questionnaire({ fields }) {
  const router = useRouter();
  const [model, setModel] = useState('');

  useEffect(() => {
    if (router.isReady && router.query.previous) {
      setModel(router.query.previous.replace(/-/g, ' ').toUpperCase());
    }
  }, [router.isReady, router.query.previous]);

  return (
    <Layout useRecaptcha>
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <div id="rejestracja">
          {!model ? (
            <div className="p-5">
              <p className="text-xl">Wybierz produkty</p>
              <Link href="/oferta/laptopy">
                <a className="bg-dks-footer mx-auto w-36 mt-16 uppercase text-white text-tiny text-center font-bold rounded p-3 transition-all duration-300 block">
                  PRZEJDŹ DO KATALOGU.
                </a>
              </Link>
            </div>
          ) : (
            <QuestionnaireForm fields={fields} model={model} />
          )}
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
    revalidate: 60,
  };
}

QuestionnaireForm.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
  model: PropTypes.string.isRequired,
};

Questionnaire.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
    })
  ).isRequired,
};

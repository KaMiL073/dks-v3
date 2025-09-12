import PropTypes from 'prop-types';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { useRouter } from 'next/router';

import Head from 'next/head';
import Header from '../navigation/header';
import Footer from '../navigation/footer';
import ContactWidget from '../elements/contactWidget';


export default function Layout({
  children, title, description, keywords, useRecaptcha, ogImage, ogType, metaRobots,
}) {
  const { asPath } = useRouter();
  const ogImgGlobal = `${process.env.basePath}static/social-media/img-global-social-media-DKS.jpg`;
  const layout = (
    <>
      <Head>
        <title>
          {title}
        </title>
        <meta
          name="description"
          content={description}
        />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content={ogType == null ? 'website' : ogType} />
        <meta key="robots" name="robots" content={metaRobots == null ? 'all' : metaRobots} />
        <meta property="og:url" content={`https://dks.pl${asPath.split('?')[0]}`} />
        <meta property="og:image" content={ogImage == null ? ogImgGlobal : ogImage} />
        <meta property="og:description" content={description} />
      </Head>
      <Header />
      <div className="h-36 md:h-20 bg-blue-500">
        <div className="text-white max-w-screen-xl px-4 md:py-2 mx-auto">
          <p>
            Szanowni Klienci,
            informujemy, że w dniu 24 grudnia nasza firma będzie nieczynna.
            Serdecznie zachęcamy do składania zamówień z wyprzedzeniem.
            Wszystkie zamówienia nadesłane do nas w czasie przerwy świątecznej będą obsługiwane sukcesywnie począwszy od 27 grudnia.
          </p>
        </div>
      </div>
      <div className="container mx-auto">
        <div className="flex items-center flex-col">
          {children}
        </div>
      </div>
      <Footer />
      <ContactWidget
        modalContent={
          <div>
            <h3 className="font-bold text-2xl">as</h3>
            <p className="mt-4">sss</p>
          </div>
        }
      />
    </>
  );

  if (useRecaptcha) {
    return (
      <GoogleReCaptchaProvider
        reCaptchaKey={process.env.RECAPTCHA_SITE}
        language="pl"
        scriptProps={{
          // async: false, // optional, default to false,
          defer: false, // optional, default to false
          // appendTo: 'head', // optional, default to "head", can be "head" or "body",
          // nonce: undefined // optional, default undefined
        }}
      >
        {layout}
      </GoogleReCaptchaProvider>
    );
  }
  return layout;
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.arrayOf(PropTypes.string),
  ogImage: PropTypes.string,
  useRecaptcha: PropTypes.bool,
  ogType: PropTypes.string,
  metaRobots: PropTypes.string,
};

Layout.defaultProps = {
  title: 'DKS - drukarki, skanery, kserokopiarki - serwis i dzierżawa',
  description: `Nowoczesne urządzenia drukujące i materiały eksploatacyjne,
  a także oprogramowanie dla biur i firm poligraficznych
  są specjalnością naszej firmy.`,
  keywords: [],
  ogImage: false,
  useRecaptcha: false,
  ogType: null,
};

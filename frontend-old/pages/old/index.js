import PropTypes from 'prop-types';

import Layout from '../../components/layouts/layout';
import OfferSection from '../../components/homepage/offerSection';
import AboutCompanySection from '../../components/homepage/aboutCompanySection';
import PromoSection from '../../components/homepage/promoSection';
import NewsSection from '../../components/homepage/newsSection';
import PartnersSection from '../../components/homepage/partnersSection';
import ContactSection from '../../components/homepage/contactSection';
import DepartmentsSection from '../../components/homepage/departmentsSection';
import ProductsSlider from '../../components/homepage/productsSlider';
import OpinionsSlider from '../../components/homepage/opinionsSlider';

import getNews from '../../lib/models/news';
import getSettings from '../../lib/models/generalSettings';

const TITLE = 'Dostawca sprzętu drukującego dla biur, reklamy i poligrafii – DKS';
const DESCRIPTION = 'Jesteśmy wiodącym dostawcą kserokopiarek i drukarek biurowych, maszyn poligraficznych i wielkoformatowych. Mamy oddziały w 12 największych miastach w Polsce.';

export default function Home({ news, generalSettings }) {
  const { products_slider, promos_widget } = generalSettings;
  return (
    <Layout title={TITLE} description={DESCRIPTION} useRecaptcha>
      <ProductsSlider slides={products_slider} />
      <OfferSection />
      <AboutCompanySection />
      <PromoSection items={promos_widget} />
      <OpinionsSlider />
      <NewsSection news={news} />
      <PartnersSection />
      <ContactSection />
      <DepartmentsSection />
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      news: await getNews({ limit: 4 }) || [],
      generalSettings: await getSettings(),
    },
    revalidate: 60,
  };
}

Home.propTypes = {
  news: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    user_created: PropTypes.string,
    date_created: PropTypes.string,
    user_updated: PropTypes.string,
    date_updated: PropTypes.string,
    title: PropTypes.string,
    seo_title: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.string,
    image: PropTypes.string,
    slug: PropTypes.string,
    lead: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
  })),
  generalSettings: PropTypes.shape({
    products_slider: PropTypes.arrayOf(PropTypes.shape({
      heading: PropTypes.string,
      caption: PropTypes.string,
      button: PropTypes.string,
      link: PropTypes.string,
      headingColor: PropTypes.string,
      image: PropTypes.string,
    })),
    promos_widget: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      active: PropTypes.bool,
      model: PropTypes.string,
      image: PropTypes.string,
      price: PropTypes.string,
      description: PropTypes.string,
      link: PropTypes.string,
      highlighted: PropTypes.bool,
    })),
  }),
};

Home.defaultProps = {
  news: [],
  generalSettings: {},
};

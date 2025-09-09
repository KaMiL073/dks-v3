import PropTypes from 'prop-types';
import pageDataProps from '../../../lib/propTypes/pageData';
import getPageData from '../../../lib/models/pages';
import { getProductsWithMainImage, getFiltersOfProductsType } from '../../../lib/models/products';
import getBrandInfo from '../../../lib/models/brand';
import getCategories, { categorySlugToCollection } from '../../../lib/models/categories';
import slug from '../../../lib/helpers/slugHelper';

import ProducerPage from '../../../components/offer/producerPage';

const BRAND = 'Konica Minolta';
const categories = getCategories();

export default function KonicaMinolta({
  category, products, brand, filters, pageData,
}) {
  return (
    <ProducerPage
      category={category}
      products={products}
      brand={brand}
      filters={filters}
      pageData={pageData}
    />
  );
}

export async function getStaticPaths() {
  const paths = categories.map((category) => ({
    params: {
      category,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { category } }) {
  const products = await getProductsWithMainImage({
    brand: BRAND,
    collectionName: categorySlugToCollection(category),
  });
  const brand = await getBrandInfo(BRAND);
  const filters = await getFiltersOfProductsType(categorySlugToCollection(category));
  const pageData = await getPageData(`/oferta/${category}/${slug(BRAND)}`);

  const requestedCategory = categories.find(
    (cat) => (cat === category),
  );

  if (!requestedCategory || !brand) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      products,
      brand,
      filters,
      pageData,
    },
    revalidate: 1, // 60,
  };
}

KonicaMinolta.propTypes = {
  category: PropTypes.string.isRequired,
  // eslint-disable-next-line react/require-default-props
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    date_created: PropTypes.string,
    date_updated: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.number),
    model: PropTypes.string,
    seo_description: PropTypes.string,
    seo_title: PropTypes.string,
    short_description: PropTypes.string,
    slug: PropTypes.string,
    specifications: PropTypes.arrayOf(PropTypes.number),
    status: PropTypes.string,
    weight: PropTypes.number,
  })).isRequired,
  brand: PropTypes.shape({
    description: PropTypes.string,
    short_description: PropTypes.string,
  }),
  filters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    interface: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  })).isRequired,
  pageData: pageDataProps(),
};

KonicaMinolta.defaultProps = {
  brand: {
    description: '',
    short_description: '',
  },
  pageData: {},
};

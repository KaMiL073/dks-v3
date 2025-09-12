/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import Layout from '../../../components/layouts/layout';
import HeaderTop from '../../../components/elements/headerTop';
import Breadcrumb from '../../../components/elements/breadcrumb';
import SideNavigation from '../../../components/offer/sideNavigation';
import ProductsList from '../../../components/offer/productsList';
import FiltersMenu from '../../../components/offer/filtersMenu';
import { getProductsWithMainImage, getFiltersOfProductsType } from '../../../lib/models/products';
import getDescription from '../../../lib/staticContent/oferta';
import getCategories, { categorySlugToCollection } from '../../../lib/models/categories';
import { getBrandsAsFilter } from '../../../lib/models/brand';
import getProductsFiltered from '../../../lib/api/frontApi';

import styles from '../../../styles/Product.module.scss';

// const TITLE = 'Oferta';

const categories = getCategories();

export default function OfferCategory({ category, products, filters }) {
  console.log(category);
  const content = getDescription(category);

  const [filtersSet, setFiltersSet] = useState(false);
  const [productsItems, setProductsItems] = useState(products);

  const handleFiltersSet = (data) => setFiltersSet(data);

  useEffect(() => {
    const queryFilters = [];
    let productsToFilter = false;
    let brand = false;

    Object.keys(filtersSet).forEach((key) => {
      if (key === 'brand') {
        productsToFilter = true;
        brand = filtersSet[key];
      } else if (filtersSet[key]) {
        productsToFilter = true;
        queryFilters.push({
          [key]: {
            _eq: filtersSet[key],
          },
        });
      }
    });

    if (productsToFilter) {
      const filterProducts = async () => {
        setProductsItems(await getProductsFiltered({
          brand,
          filters: queryFilters,
          collectionName: categorySlugToCollection(category),
        }));
      };
      filterProducts();
    } else {
      setProductsItems(products);
    }
  }, [filtersSet, category, products]);

  return (
    <Layout title={content.seoTitle} description={content.seoDescription}>
      <HeaderTop title={content.title} />
      <div className="w-full md:max-w-screen-xl">
        <Breadcrumb />
        <div className="flex sm:flex-col my-4 px-4 xl:px-0">
          <div className="md:w-1/4 sm:m-4 mr-4"><FiltersMenu filters={filters} handleFiltersSet={handleFiltersSet} /></div>
          <ProductsList products={productsItems} category={category} />
        </div>
        <div className="flex sm:flex-col pt-6 px-4 xl:px-0">
          <div className="md:w-1/5"><SideNavigation /></div>
          <div className="md:w-4/5 flex sm:flex-col">
            <div className="md:w-1/2">
              <div
                className={styles.htmlContent}
                dangerouslySetInnerHTML={{ __html: content.leftColumn }}
              />
            </div>
            <div className="md:w-1/2 pl-4 pb-4">
              <div
                className={styles.htmlContent}
                dangerouslySetInnerHTML={{ __html: content.rightColumn }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
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
    collectionName: categorySlugToCollection(category),
  });
  const producsBrands = products.map((product) => product.brand.id)
    .filter((value, index, self) => self.indexOf(value) === index);

  const filters = await getFiltersOfProductsType(
    categorySlugToCollection(category),
  );
  const brandsFilter = await getBrandsAsFilter(producsBrands);
  filters.unshift(brandsFilter);

  const requestedCategory = categories.find(
    (cat) => (cat === category),
  );

  if (!requestedCategory) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      products,
      filters,
    },
    revalidate: 60,
  };
}

OfferCategory.propTypes = {
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
  filters: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    interface: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })),
  })).isRequired,
};

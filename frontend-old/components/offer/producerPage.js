/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import pageDataProps from '../../lib/propTypes/pageData';
import Layout from '../layouts/layout';
import HeaderTop from '../elements/headerTop';
import Breadcrumb from '../elements/breadcrumb';
import SideNavigation from './sideNavigation';
import ProductsList from './productsList';
import FiltersMenu from './filtersMenu';
import { categorySlugToCollection } from '../../lib/models/categories';
import getProductsFiltered from '../../lib/api/frontApi';
import getTextField from '../../lib/helpers/textFieldsHelper';

import styles from '../../styles/Product.module.scss';

const TITLE = 'Oferta';

export default function ProducerPage({
  category, products, brand, filters, pageData,
}) {
  const layoutAttributes = {};
  layoutAttributes.title = pageData.title || TITLE;
  if (pageData.description) {
    layoutAttributes.description = pageData.description;
  }
  if (pageData.tags) {
    layoutAttributes.keywords = pageData.tags;
  }

  const leftColumnContent = getTextField('lewa_kolumna', pageData.text_fields) || brand.description;
  const rightColumnContent = getTextField('prawa_kolumna', pageData.text_fields) || brand.short_description;

  const [filtersSet, setFiltersSet] = useState(false);
  const [productsItems, setProductsItems] = useState(products);

  const handleFiltersSet = (data) => setFiltersSet(data);

  useEffect(() => {
    const queryFilters = [];
    let productsToFilter = false;

    Object.keys(filtersSet).forEach((key) => {
      if (filtersSet[key]) {
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
          brand: brand.name,
          filters: queryFilters,
          collectionName: categorySlugToCollection(category),
        }));
      };
      filterProducts();
    } else {
      setProductsItems(products);
    }
  }, [filtersSet, brand.name, category, products]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Layout {...layoutAttributes}>
      <HeaderTop title={TITLE} headingType="h2" />
      <div className="w-full md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col my-4">
          <div className="md:w-1/4 sm:m-4 mr-4"><FiltersMenu filters={filters} handleFiltersSet={handleFiltersSet} /></div>
          <ProductsList products={productsItems} category={category} />
        </div>
        <div className="flex sm:flex-col pt-6 sm:px-4">
          <div className="md:w-1/5"><SideNavigation /></div>
          <div className="md:w-4/5 flex sm:flex-col">
            <div className="md:w-1/2">
              <div
                className={styles.htmlContent}
                dangerouslySetInnerHTML={{ __html: leftColumnContent }}
              />
            </div>
            <div className="md:w-1/2 pl-4">
              <div
                className={styles.htmlContent}
                dangerouslySetInnerHTML={{ __html: rightColumnContent }}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

ProducerPage.propTypes = {
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
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    short_description: PropTypes.string,
  }).isRequired,
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

ProducerPage.defaultProps = {
  pageData: {},
};

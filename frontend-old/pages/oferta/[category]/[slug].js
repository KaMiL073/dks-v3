/* eslint-disable react/no-danger, no-console */
import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../../components/layouts/layout';
import HeaderTop from '../../../components/elements/headerTop';
import Breadcrumb from '../../../components/elements/breadcrumb';
import getProducts, { getProduct } from '../../../lib/models/products';
import styles from '../../../styles/Product.module.scss';
import getCategories, { categorySlugToCollection } from '../../../lib/models/categories';
import { useRouter } from 'next/router';

const categories = getCategories();

function Specifications({ specs }) {
  // eslint-disable-next-line camelcase
  return specs.map(({ specifications_id }) => (
    <div key={specifications_id.id} className="mb-4">
      <div className="font-bold bg-dks-medium-gray p-6 w-full rounded">{specifications_id.title}</div>
      <div
        className={`text-sm px-12 py-4 ${styles.htmlContent}`}
        dangerouslySetInnerHTML={{ __html: specifications_id.content }}
      />
    </div>
  ));
}



export default function Product({ product }) {
  const siteTitle = product.seo_title || `${product.brand.name} ${product.model}`;
  const headerTitle = product.model;

  const router = useRouter();
  const linkPath = router.asPath.split('?')[0].split('/');
  linkPath.shift();

  const [activeTab, setActiveTab] = useState(0);
  const tabs = [false, false, false];
  tabs[activeTab] = true;

  const images = product.images || [];
  const [activeImageId, setActiveImageId] = useState(0);
  const [activeImage] = images.filter((image, i) => i === activeImageId);

  const thumbnails = images.map((image, i) => (
    <div
      className="h-full w-16 relative"
      key={image.id}
      onClick={() => { setActiveImageId(i); }}
      onKeyPress={() => { setActiveImageId(i); }}
      role="button"
      tabIndex={0}
    >
      <Image
        alt={`${product.model} ${image.id}`}
        src={`${process.env.assetsPath + image.directus_files_id}`}
        layout="fill"
        objectFit="scale-down"
        quality={100}
      />
    </div>
  ));

  return (
    <Layout title={siteTitle}>
      <HeaderTop title={headerTitle} imgSrc="/static/header_oferta.webp" />
      <div className="w-full md:max-w-screen-xl">
        <Breadcrumb />
        <div className="sm:px-4 my-4 md:my-8" dangerouslySetInnerHTML={{ __html: product.promo_description }} />
        <div className="flex sm:flex-col pt-6 sm:px-4">
          <div className="md:w-1/2">
            <div className="relative h-96">
              <Image
                alt={`zdjecie ${product.model}`}
                src={`${process.env.assetsPath + activeImage?.directus_files_id}`}
                layout="fill"
                objectFit="scale-down"
                quality={100}
              />
            </div>
            <div className="h-32 flex gap-4 justify-center">
              {thumbnails}
            </div>
          </div>
          <div className="md:w-1/2">
            <h6 className="font-bold uppercase mb-6">Informacje</h6>
            <div className="text-sm text-dks-font leading-relaxed">
              <div
                className={styles.htmlContent}
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />

              <div className="text-lg pt-4">
                {product.price && (
                  <span className="text-2xl font-bold">
                    {new Intl.NumberFormat('pl-PL', {
                      style: 'decimal',
                      useGrouping: true,
                    })
                      .format(product.price)
                      .replace(/\u00A0/g, ' ')} zł
                  </span>
                )}
              </div>

              {linkPath[1] === "laptopy"
                ? <Link href={'/zamow-laptop-dla-nauczyciela?previous='+ router.asPath}>
                    <a href="/zamow-laptop-dla-nauczyciela">
                      <button
                        type="button"
                        className="rounded bg-dks-red text-white p-4 mt-4 text-sm font-bold"
                      >
                        ZAMÓW JUŻ DZIŚ
                      </button>
                    </a>
                  </Link>
                : <Link href="/strefa-klienta">
                    <a href="/strefa-klienta">
                      <button
                        type="button"
                        className="rounded bg-dks-red text-white p-4 mt-4 text-sm font-bold"
                      >
                        SKONTAKTUJ SIĘ Z NAMI
                      </button>
                    </a>
                  </Link>
              }
            </div>
          </div>
        </div>
        <div className="mx-2 md:mr-4 sm:mt-10">
          <div className="w-full mx-auto mb-6 flex">
            <span
              onClick={() => { setActiveTab(0); }}
              onKeyPress={() => { setActiveTab(0); }}
              role="button"
              tabIndex={0}
              className={`w-1/3 ${styles.tab} ${tabs[0] ? styles.active : ''}`}
            >
              Opis
            </span>
            <span
              onClick={() => { setActiveTab(1); }}
              onKeyPress={() => { setActiveTab(1); }}
              role="button"
              tabIndex={0}
              className={`w-1/3 ${styles.tab} ${tabs[1] ? styles.active : ''}`}
            >
              Specyfikacja
            </span>
            <span
              onClick={() => { setActiveTab(2); }}
              onKeyPress={() => { setActiveTab(2); }}
              role="button"
              tabIndex={0}
              className={`w-1/3 ${styles.tab} ${tabs[2] ? styles.active : ''}`}
            >
              Pliki do pobrania
            </span>
          </div>
          <div className="relative">
            <div className={`${styles.contentTab} ${tabs[0] ? styles.active : ''}`}>
              <div
                className={styles.htmlContent}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
            <div className={`${styles.contentTab} ${tabs[1] ? styles.active : ''}`}>
              <Specifications specs={product.specifications} />
            </div>
            <div className={`${styles.contentTab} ${tabs[2] ? styles.active : ''}`}>
              pliki do pobrania
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = [];

  categories.forEach(async (cat) => {
    const products = await getProducts(categorySlugToCollection(cat));
    products.forEach((product) => {
      paths.push({
        params: {
          category: cat,
          slug: product.slug,
        },
      });
    });
  });

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { category, slug } }) {
  const product = await getProduct(slug);
  const requestedCategory = categories.find(
    (cat) => (cat === category),
  );

  if (!requestedCategory || !product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category: requestedCategory,
      product,
    },
    revalidate: 60,
  };
}

Product.propTypes = {
  // eslint-disable-next-line react/require-default-props
  product: PropTypes.shape({
    id: PropTypes.string,
    date_created: PropTypes.string,
    date_updated: PropTypes.string,
    description: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      products_id: PropTypes.string,
      directus_files_id: PropTypes.string,
    })),
    model: PropTypes.string,
    seo_description: PropTypes.string,
    seo_title: PropTypes.string,
    short_description: PropTypes.string,
    slug: PropTypes.string,
    specifications: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      content: PropTypes.string,
    })),
    status: PropTypes.string,
    weight: PropTypes.number,
    brand: PropTypes.shape({
      name: PropTypes.string,
    }),
    promo_description: PropTypes.string,
  }).isRequired,
};

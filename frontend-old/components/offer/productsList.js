import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/ProductsList.module.scss';

export default function ProductsList({ products, category }) {
  const productsList = products.map((product) => (
    <Link href={`/oferta/${category}/${product.slug}`} key={product.id}>
      <a href={`/oferta/${category}/${product.slug}`}>
        <div className="h-64 border-b-2 hover:border-dks-red cursor-pointer" key={product.model}>
          <div className={styles.title}>{product.model}</div>
          <div className="relative h-4/6">
            <Image
              alt={process.model}
              src={`${process.env.assetsPath + product.main_image?.id}`}
              layout="fill"
              objectFit="scale-down"
              quality={100}
            />
          </div>
          
          <div className="flex flex-row justify-between items-center p-2">
            <div className="text-lg">
              {product.price && (
                <span className="text-lg">
                  {new Intl.NumberFormat('pl-PL', {
                    style: 'decimal',
                    useGrouping: true,
                  })
                    .format(product.price)
                    .replace(/\u00A0/g, ' ')} zł
                </span>
              )}
            </div>
            <div className="relative h-8 w-1/3">
              <Image
                alt={product.model}
                src={`${process.env.assetsPath + product.brand.logo}`}
                layout="fill"
                objectFit="scale-down"
                quality={100}
              />
            </div>
          </div>


        </div>
      </a>
    </Link>
  ));

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 sm:px-4 gap-x-4 gap-y-8">
        {productsList}
      </div>
    </div>
  );
}

ProductsList.propTypes = {
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
};

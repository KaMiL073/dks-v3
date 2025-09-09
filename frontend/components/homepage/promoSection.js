/* eslint-disable react/no-danger */
import PropTypes from 'prop-types';

import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/promoSection.module.scss';

export default function PromoSection({ items }) {
  const elements = items || [];
  const promoItems = elements.filter((item) => item.active).map((item) => (
    <div className={styles.item} key={item.model}>
      { item.highlighted && (
        <div className={styles.highlighted}>najczęściej wybierany</div>
      )}
      <div className={styles.body}>
        <h5 className={styles.label}>{item.label}</h5>
        <h5 className={styles.model}>{item.model}</h5>
        <div className="m-6">
          <Image
            width="100"
            height="100"
            layout="responsive"
            objectFit="cover"
            src={`${process.env.assetsPath + item.image}`}
          />
        </div>
        <div className={styles.price}>
          <span className="uppercase text-tiny italic">od</span>
          <span className="text-7xl">{item.price}</span>
          <span className="uppercase text-tiny italic">zł netto m/c</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: item.description }} />
        <br />
      </div>
      <Link href={item.link}>
        <a className={styles.link} href={item.link}>
          więcej
          {' >>'}
        </a>
      </Link>
    </div>
  ));

  return (
    <section className={styles.section}>
      <h2 className="text-center text-4xl md:text-5xl font-bold pb-16">Promocyjne plany dzierżawy urządzeń wielofunkcyjnych</h2>
      <div className="flex sm:flex-col sm:space-y-4 mx-auto md:items-end justify-between max-w-screen-xl">
        {promoItems}
      </div>
    </section>
  );
}

PromoSection.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    active: PropTypes.bool,
    model: PropTypes.string,
    image: PropTypes.string,
    price: PropTypes.string,
    description: PropTypes.string,
    link: PropTypes.string,
    highlighted: PropTypes.bool,
  })),
};

PromoSection.defaultProps = {
  items: [],
};

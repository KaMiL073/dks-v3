import PropTypes from 'prop-types';

import Image from 'next/image';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/productsSlider.module.scss';
import Slider from '../elements/slider';

export default function ProductsSlider({ slides }) {
  const items = slides || [];
  const elementsForSlider = slides.filter(slide => slide.active).map((slide) => (
    <div className="w-screen h-75-screen relative">
      <Image
        src={`${process.env.assetsPath + slide.image}`}
        layout="fill"
        objectFit="cover"
        alt="alt txt"
        priority
      />
      <div className={styles.captionContainer}>
        <div className={styles.caption}>
          <h2 className={`text-3xl ${slide.headingSize ? slide.headingSize : "text-6xl"}`} style={{ color: slide.headingColor }}>{slide.heading}</h2>
          <span style={{ color: slide.captionColor }}>{slide.caption}</span>
          <Link href={slide.link} type="button">
            <a className={styles.btn} href={slide.link}>
              {slide.button}
              {' '}
              <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
            </a>
          </Link>
        </div>
      </div>
    </div>
  ));

  return (
    <section className="w-full -mt-4 relative">
      <Slider elements={elementsForSlider} styles={styles} autoplaySpeed={4000} />
    </section>
  );
}

ProductsSlider.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape({
    heading: PropTypes.string,
    caption: PropTypes.string,
    button: PropTypes.string,
    link: PropTypes.string,
    headingColor: PropTypes.string,
    image: PropTypes.string,
  })),
};

ProductsSlider.defaultProps = {
  slides: [],
};

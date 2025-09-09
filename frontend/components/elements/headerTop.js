import PropTypes from 'prop-types';
import styles from './styles/HeaderTop.module.scss';

export default function HeaderTop({ title, imgSrc, headingType}) {
 console.log(headingType);
  const heading = (headingType === "h2") 
    ? `<h2 class="text-white text-4xl font-semibold md:text-4xl">${title}</h2>`
    : `<h1 class="text-white text-4xl font-semibold md:text-4xl">${title}</h1>`; 
  return (
    <section className={styles.header} style={{ backgroundImage: `url(${imgSrc})`}}>
      <div className="flex items-center justify-left h-full md:max-w-screen-xl mx-auto">
        <div dangerouslySetInnerHTML={{ __html: heading }} />
      </div>
    </section>
  );
}

HeaderTop.propTypes = {
  title: PropTypes.string.isRequired,
  imgSrc: PropTypes.string,
};

HeaderTop.defaultProps = {
  imgSrc: '/static/naglowek_top.webp',
};

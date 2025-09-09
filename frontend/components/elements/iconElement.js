import PropTypes from 'prop-types';
import Image from 'next/image';
import styles from './styles/IconElement.module.scss';

export default function IconElement({ icon, name, subtitle }) {
  return (
    <div className={styles.item}>
      <Image src={icon} alt={name} width="45px" height="45px" />
      <h6 className={styles.title}>{name}</h6>
      <div className={styles.decoration} />
      <div className={styles.subtitle}>
        {subtitle}
      </div>
    </div>
  );
}

IconElement.propTypes = {
  icon: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

import PropTypes from 'prop-types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import styles from './styles/Modal.module.scss';

export default function PhotoModal({ imgSrc, onClose }) {
  const [closeModal, setCloseModal] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (closeModal) {
      onClose();
    }

    return () => {
      setCloseModal(false);
      document.body.style.overflow = 'unset';
    };
  });

  return (
    <div className={styles.overlay}>
      <div className={styles.photo}>
        <Image src={imgSrc} layout="fill" objectFit="contain" alt="Modal photo" />
      </div>
      <div
        className="text-white text-tiny mt-10 pr-4 cursor-pointer"
        onClick={() => setCloseModal(true)}
        onKeyPress={() => setCloseModal(true)}
        role="button"
        tabIndex={0}
      >
        <HighlightOffIcon />
      </div>
    </div>
  );
}

PhotoModal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

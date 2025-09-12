import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import styles from './styles/Modal.module.scss';

export default function Modal({ imgSrc, onClose }) {
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
      <div className="w-1/2 m-auto bg-white rounded-xl relative overflow-x-hidden overflow-y-auto">
        <div className="flex items-start justify-between p-3.5 border-b">
          <h5 className="text-lg font-bold">{imgSrc.position}</h5>
          <div
            className="text-lg font-bold cursor-pointer"
            onClick={() => setCloseModal(true)}
            onKeyPress={() => setCloseModal(true)}
            role="button"
            tabIndex={0}
          >
            <HighlightOffIcon />
          </div>
        </div>
        <div className="p-3.5 ">
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: imgSrc.description }} />
        </div>
        <div className="flex justify-end p-3.5 border-t">
          <div
            className="text-white font-bold cursor-pointer py-3.5 px-8 bg-dks-link-hover rounded-xl hover:bg-bg-dks-red"
            onClick={() => setCloseModal(true)}
            onKeyPress={() => setCloseModal(true)}
            role="button"
            tabIndex={0}
          >
            Zamknij
          </div>
        </div>
      </div>

    </div>
  );
}

Modal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

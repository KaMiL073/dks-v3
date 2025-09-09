import { useState } from 'react';
import Modal from './contactModal'; // Zakładam, że modal już istnieje
import styles from './styles/ContactWidget.module.scss'
export default function ButtonWithModal({ buttonText, modalContent }) {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      {/* <button
        className="bg-dks-red text-white px-4 py-2 rounded hover:bg-dks-dark-red"
        onClick={handleOpenModal}
      >
        {buttonText}
      </button> */}
      <div className={styles.contactWidget}>
            <button
                onClick={handleOpenModal}
            >
                <svg 
                    width="24" 
                    height="24" 
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                    fill="#e8eaed">
                        <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
            </button>
        </div>
      
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
}

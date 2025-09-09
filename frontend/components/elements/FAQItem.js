import React from 'react';
import styles from './styles/faq.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

const FAQItem = ({ index, isOpen, onToggle, question, answer }) => {
  return (
    <div className={styles.FAQItem}>
      <div onClick={() => onToggle(index)} className={styles.heading}>
        <div className={styles.question}>
            <h3>
                {question}
                <span >
                    <FontAwesomeIcon icon={faAngleDown} className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
                </span>
            </h3>
        </div>
      </div>
      {isOpen && <div className={styles.answer} dangerouslySetInnerHTML={{ __html: answer }}></div>}
    </div>
  );
};

export default FAQItem;
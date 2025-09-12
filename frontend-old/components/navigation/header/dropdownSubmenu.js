import PropTypes from 'prop-types';
import Link from 'next/link';
import { useState, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../styles/Header.module.scss';

export default function DropdownSubmenu({ elements, label, link }) {
  const dropdownRef = useRef(null);
  const [isOpened, setIsOpened] = useState(false);

  const onClick = () => setIsOpened(!isOpened);
  const onMouseEnter = () => setIsOpened(true);
  const onMouseLeave = () => setIsOpened(false);

  const cssClasses = {
    mobile: {
      general: '',
      opened: 'block',
      closed: 'hidden lg:block',
    },
    desktop: {
      general: 'lg:p-2 lg:absolute lg:font-normal lg:normal-case',
      opened: 'lg:opacity-100 lg:top-12 lg:visible',
      closed: 'lg:opacity-0 lg:top-16 lg:invisible',
    },
  };

  const stateClasses = !isOpened
    ? `${cssClasses.mobile.closed} ${cssClasses.desktop.closed}` : `${cssClasses.mobile.opened} ${cssClasses.desktop.opened}`;

  const dropdownItems = elements.map(({ href, title }) => (
    <li key={title}>
      <Link href={href}>
        <a href={href} className={styles.navLink}>
          <FontAwesomeIcon icon={faAngleRight} className={styles.AngleRight} />
          {title}
        </a>
      </Link>
    </li>
  ));

  return (
    <li className={`${isOpened ? 'bg-dks-red text-white lg:bg-white lg:text-black' : ''}`}>
      <div
        className={`${styles.dropdown} ${isOpened ? styles.opened : ''}`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyPress={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {label}
        <ul
          ref={dropdownRef}
          className={`text-dks-gray ${cssClasses.mobile.general} ${cssClasses.desktop.general} ${stateClasses}`}
        >
          {dropdownItems}
        </ul>
        <FontAwesomeIcon icon={faAngleDown} className={styles.arrow} />
      </div>
    </li>
  );
}

DropdownSubmenu.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string,
    title: PropTypes.string,
  })).isRequired,
  label: PropTypes.string.isRequired,
};

export function DropdownSubmenuWide({ elements, label, link }) {
  const dropdownRef = useRef(null);
  const [isOpened, setIsOpened] = useState(false);

  const onClick = () => setIsOpened(!isOpened);
  const onMouseEnter = () => setIsOpened(true);
  const onMouseLeave = () => setIsOpened(false);

  const cssClasses = {
    mobile: {
      general: '',
      opened: 'block',
      closed: 'hidden',
    },
    desktop: {
      general: 'lg:absolute lg:font-normal lg:normal-case lg:flex',
      opened: 'lg:opacity-100 lg:top-12 lg:visible',
      closed: 'lg:opacity-0 lg:top-16 lg:invisible',
    },
  };

  const stateClasses = !isOpened
    ? `${cssClasses.mobile.closed} ${cssClasses.desktop.closed}` : `${cssClasses.mobile.opened} ${cssClasses.desktop.opened}`;

  const lists = elements.map((element) => {
    const dropdownItems = element.items.map(({ href, title, bolded }) => (
      <li key={title}>
        <Link href={href}>
          <a href={href} className={bolded ? 'font-bold text-black block mt-4' : `${styles.navLink} ml-4`}>
            <FontAwesomeIcon icon={faAngleRight} className={styles.AngleRight} />
            {title}
          </a>
        </Link>
      </li>
    ));

    return (
      <ul key={element.label}>
        {dropdownItems}
      </ul>
    );
  });

  return (
    <li className={`${isOpened ? 'bg-dks-red text-white lg:bg-white lg:text-black' : ''}`}>
      <div
        className={`${styles.dropdown} ${styles.wide} ${isOpened ? styles.opened : ''}`}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyPress={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Link href={link}>
          <a href={link}>
            {label}
          </a>
        </Link>
        <div
          ref={dropdownRef}
          className={`text-dks-gray ${styles.container} ${cssClasses.mobile.general} ${cssClasses.desktop.general} ${stateClasses}`}
        >
          {lists}
        </div>
        <FontAwesomeIcon icon={faAngleDown} className={styles.arrow} />
      </div>
    </li>
  );
}

DropdownSubmenuWide.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      href: PropTypes.string,
      title: PropTypes.string,
      bolded: PropTypes.bool,
    })).isRequired,
  })).isRequired,
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

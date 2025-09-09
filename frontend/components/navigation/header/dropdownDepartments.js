import Link from 'next/link';
import { useState, useRef } from 'react';

import RoomIcon from '@mui/icons-material/Room';
import styles from '../../../styles/Header.module.scss';

export default function DropdownDepartments() {
  const dropdownRef = useRef(null);
  const [isOpened, setIsOpened] = useState(false);
  const onClick = () => setIsOpened(!isOpened);

  const departmentsLinks = [
    { href: '/oddzialy/gdansk', title: 'Gdańsk' },
    { href: '/oddzialy/warszawa', title: 'Warszawa' },
    { href: '/oddzialy/katowice', title: 'Katowice' },
    { href: '/oddzialy/poznan', title: 'Poznań' },
    { href: '/oddzialy/lodz', title: 'Łódź' },
    { href: '/oddzialy/krakow', title: 'Kraków' },
    { href: '/oddzialy/szczecin', title: 'Szczecin' },
    { href: '/oddzialy/bydgoszcz', title: 'Bydgoszcz' },
    { href: '/oddzialy/olsztyn', title: 'Olsztyn' },
    { href: '/oddzialy/rzeszow', title: 'Rzeszów' },
    { href: '/oddzialy/bialystok', title: 'Białystok' },
    { href: '/oddzialy/wroclaw', title: 'Wrocław' },
  ].map(({ href, title }) => (
    <li key={title}>
      <Link href={href}>
        <span className="block px-5 py-3">
          {title}
        </span>
      </Link>
    </li>
  ));

  return (
    <span
      className="flex-auto"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
    >
      <RoomIcon />
      <span className={styles.bordered}>Oddziały: &#x25BC;</span>
      <ul ref={dropdownRef} className={!isOpened ? 'p-2 hidden' : 'p-2 absolute z-50'}>
        {departmentsLinks}
      </ul>
    </span>
  );
}

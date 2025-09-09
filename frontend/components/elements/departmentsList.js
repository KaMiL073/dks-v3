import Link from 'next/link';
import styles from '../../styles/Oddzialy.module.scss';

export default function DepartmentsList() {
  const departments = [
    {
      href: '/oddzialy/gdansk', title: 'ODDZIAŁ GDAŃSK', address: 'ul. Energetyczna 15, 80-180 Kowale', phone: '58 309 03 07', email: 'info.gdansk@dks.pl',
    },
    {
      href: '/oddzialy/warszawa', title: 'ODDZIAŁ WARSZAWA', address: 'Oddział w Warszawie: Muszkieterów 15, 02-273 Warszawa', address2: 'Magazyn: ul. Żwirowa 68, 05-090 Puchały', phone: '22 632 12 09', email: 'info.warszawa@dks.pl',
    },
    {
      href: '/oddzialy/katowice', title: 'ODDZIAŁ KATOWICE', address: 'ul. Ks. Bp. Bednorza 2a-6, 40-384 Katowice', phone: '32 730 01 11', email: 'info.katowce@dks.pl',
    },
    {
      href: '/oddzialy/poznan', title: 'ODDZIAŁ POZNAŃ', address: 'ul. Chlebowa 4/8, 61-003 Poznań', phone: '61 842 58 84', email: 'info.poznan@dks.pl',
    },
    {
      href: '/oddzialy/lodz', title: 'ODDZIAŁ ŁÓDŹ', address: 'ul. Ogrodowa 76, 91-071 Łódź', phone: '42 637 04 71', email: 'info.lodz@dks.pl',
    },
    {
      href: '/oddzialy/krakow', title: 'ODDZIAŁ KRAKÓW', address: 'ul. Bursztynowa 2, 31-213 Kraków', phone: '12 357 25 25', email: 'info.krakow@dks.pl',
    },
    {
      href: '/oddzialy/szczecin', title: 'ODDZIAŁ SZCZECIN', address: 'ul. Lelewela 8a, 71-154 Szczecin', phone: '91 887 60 33', email: 'info.szczecin@dks.pl',
    },
    {
      href: '/oddzialy/bydgoszcz', title: 'ODDZIAŁ BYDGOSZCZ', address: 'ul. Jagiellońska 94 c, 85-027 Bydgoszcz', phone: '52 515 41 00', email: 'info.bydgoszcz@dks.pl',
    },
    {
      href: '/oddzialy/olsztyn', title: 'ODDZIAŁ OLSZTYN', address: 'ul. Herberta 18/16	10-686 Olsztyn', phone: '89 652 16 00', email: 'info.olsztyn@dks.pl',
    },
    {
      href: '/oddzialy/rzeszow', title: 'ODDZIAŁ RZESZÓW', address: 'ul. Staromiejska 69, 35-231 Rzeszów', phone: '17 741 24 00', email: 'info.rzeszow@dks.pl',
    },
    {
      href: '/oddzialy/bialystok', title: 'ODDZIAŁ BIAŁYSTOK', address: ' ul. Wysockiego 68a, 15-167 Białystok', phone: '85 671 20 28', email: 'info.bialystok@dks.pl',
    },
    {
      href: '/oddzialy/wroclaw', title: 'ODDZIAŁ WROCŁAW', address: 'ul. Północna 15-19, 54-105 Wrocław budynek 2.2, wejście B, piętro 2, pok. nr 213-214', phone: '71 725 42 54', email: 'info.wroclaw@dks.pl',
    },
  ].map((department) => (
    <div className={styles.postBox} key={department.phone}>
      <div className={styles.postContent}>
        <Link href={department.href}>
          <a href={department.href}>
            <h2 className={styles.postTitle}>{department.title}</h2>
          </a>
        </Link>
        <p>
          <strong>Adres:</strong>
          {' '}

          {department.address2
            ? (
              <>
                <p>{department.address}</p>
                <p>{department.address2}</p>
              </>
            )
            : <p>{department.address}</p>}
          {/* {department.address} */}
        </p>
        <p>
          <strong>Tel:</strong>
          <a href={`tel:${department.phone}`} className={styles.phone}>
            {' '}
            {department.phone}
          </a>
        </p>
        <p>
          <strong>E-mail:</strong>
          <a href={`mailto:${department.email}`} className={styles.email}>
            {' '}
            {department.email}
          </a>
        </p>
      </div>
    </div>
  ));

  return (
    <div className="grid grid-cols-3 gap-4 pt-9 sm:grid-cols-1 sm:mx-4 px-4 xl:px-0">
      {departments}
    </div>
  );
}

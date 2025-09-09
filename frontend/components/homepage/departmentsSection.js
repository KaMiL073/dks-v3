import styles from './styles/departmentsSection.module.scss';

export default function departmentsSection() {
  const departments = [
    {
      city: 'Gdańsk',
      address: '( 80-180 ) Kowale, ul. Energetyczna 15',
      phone: 'tel. 58 309 03 07',
    },
    {
      city: 'Warszawa',
      address: '( 02-273 ) Oddział w Warszawie: ul. Muszkieterów 15',
      phone: 'tel. 22 632 12 09',
    },
    {
      city: 'Katowice',
      address: '( 40-384 ) ul. Ks. Bp. Bednorza 2a-6',
      phone: 'tel. 32 730 01 11',
    },
    { city: 'Poznań', address: '( 61-003 ) ul. Chlebowa 4/8', phone: 'tel. 61 842 58 84' },
    { city: 'Łódź', address: '( 91-071 ) ul. Ogrodowa 76', phone: 'tel. 42 637 04 71' },
    { city: 'Kraków', address: '( 31-213 ) ul. Bursztynowa 2', phone: 'tel. 12 357 25 25' },
    {
      city: 'Szczecin',
      address: '( 70-030 ) ul. Lelewela 8a',
      phone: 'tel. 91 887 60 33',
    },
    {
      city: 'Wrocław',
      address: '( 54-105 ) ul. Północna 15-19, budynek 2.2, pok. nr 213-214',
      phone: 'tel. 71 725 42 54',
    },
    { city: 'Bydgoszcz', address: '( 85-027 ) ul. Jagiellońska 94C', phone: 'tel. 52 515 41 00' },
    { city: 'Olsztyn', address: '( 10-686 ) ul. Herberta 18/16', phone: 'tel. 89 652 16 00' },
    { city: 'Rzeszów', address: '( 35-231 ) ul. Staromiejska 69', phone: 'tel. 17 741 24 00' },
    { city: 'Białystok', address: '( 15-167 ) ul. Wysockiego 68A', phone: 'tel. 85 671 20 28' },
  ];

  return (
    <section className={styles.section}>
      <h3 className="text-center text-5xl font-bold sm:pt-10 pb-10">Oddziały DKS</h3>
      <div className="flex sm:flex-col max-w-screen-xl sm:space-y-4 sm:px-8 mx-auto text-left text-tiny font-bold">
        <div className={styles.column}>
          <table className="w-full">
            <tbody>
              {departments.slice(0, 6).map((department) => (
                <tr key={department.city}>
                  <td>
                    <span className={styles.dot}> </span>
                    {department.city}
                  </td>
                  <td>{department.address}</td>
                  <td>{department.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.column}>
          <table className="w-full">
            <tbody>
              {departments.slice(6, 12).map((department) => (
                <tr key={department.city}>
                  <td>
                    <span className={styles.dot}> </span>
                    {department.city}
                  </td>
                  <td>{department.address}</td>
                  <td>{department.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

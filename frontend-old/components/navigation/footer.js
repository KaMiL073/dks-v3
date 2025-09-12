import Link from 'next/link';
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import PhoneIcon from '@mui/icons-material/Phone';
import styles from '../../styles/Footer.module.scss';
import SocialButtons from './common/socialButtons';

export default function Footer() {
  return (
    <>
      <section className="flex h-24 px-4 w-full relative bg-dks-medium-gray justify-center">
        <Link href="/">
          <a href="/" className={`w-full md:w-1/3 ${styles.banner}`}>
            <Image src="//static/homepage/Inteligentny-Rozwoj.webp" alt="Inteligentny Rozwój" layout="fill" objectFit="contain" />
          </a>
        </Link>
      </section>
      <section className="w-full bg-dks-dark-gray">
        <div className="flex sm:flex-col sm:space-y-6 max-w-screen-xl md:mx-auto py-16 text-white">
          <div className="w-full md:w-1/3 px-4">
            <span className="uppercase font-bold text-xl block pb-6">kontakt</span>
            <div className="flex sm:flex-col sm:space-y-4">
              <div className="text-sm w-full md:w-1/2">
                <PhoneIcon className={styles.icon} />
                <span>Centrala: 58 309 03 07</span>
                <br />
                <span className="md:pl-8">E-mail: kontakt@dks.pl</span>
              </div>
              <div className="flex space-x-2 w-1/2">
                <SocialButtons />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <span className="uppercase font-bold text-xl block pb-6">szybkie menu</span>
            <div className="flex text-sm ">
              <div className="w-1/2">
                <Link href="/">
                  <a href="/" className={styles.link}>
                    <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
                    Home
                  </a>
                </Link>
                <Link href="/">
                  <a href="/" className={styles.link}>
                    <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
                    Serwis
                  </a>
                </Link>
                <Link href="/">
                  <a href="/" className={styles.link}>
                    <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
                    Kariera
                  </a>
                </Link>
              </div>
              <div className="w-1/2">
                <Link href="/">
                  <a href="/" className={styles.link}>
                    <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
                    O firmie
                  </a>
                </Link>
                <Link href="/">
                  <a href="/" className={styles.link}>
                    <FontAwesomeIcon icon={faAngleRight} className={styles.arrow} />
                    Kontakt
                  </a>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <span className="uppercase font-bold text-xl block pb-6">działy</span>
            <div className="flex text-sm">
              <div className="w-1/2">
                <span className="font-bold">Księgowości</span>
                <br />
                <span>tel. 532 362 392</span>
                <br />
                <br />
                <span className="font-bold">Obsługi Klienta</span>
                <br />
                <span>tel. 58 350 66 05</span>
                <br />
              </div>
              <div className="w-1/2">
                <span className="font-bold">Windykacji</span>
                <br />
                <span>tel. 58 763 06 10</span>
                <br />
                <br />
                <span className="font-bold">Eksportu</span>
                <br />
                <span>tel. +48 664 941 146</span>
                <br />
                <span>tel. +48 600 338 951</span>
                <br />
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="py-4 w-full text-center text-dks-footer bg-dks-darker-gray text-sm">
        © DKS Sp. z o.o. Klauzula Ochrony Danych
      </footer>
    </>
  );
}

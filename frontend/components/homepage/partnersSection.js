import { useState } from 'react';
import Image from 'next/image';
import styles from './styles/partnersSection.module.scss';

export default function PartnersSection() {
  const logos = [
    { src: '/static/homepage/logos/konica-minolta.svg', alt: 'Konica Minolta' },
    { src: '/static/homepage/logos/lexmark.svg', alt: 'Lexmark' },
    { src: '/static/homepage/logos/canon.svg', alt: 'Canon' },
    { src: '/static/homepage/logos/hp.svg', alt: 'HP' },
    { src: '/static/homepage/logos/contex.svg', alt: 'Contex' },
    { src: '/static/homepage/logos/kip.svg', alt: 'KIP' },
    { src: '/static/homepage/logos/fujifilm.svg', alt: 'Fujifilm' },
    { src: '/static/homepage/logos/lenovo.svg', alt: 'Lenovo' },
    { src: '/static/homepage/logos/dell.svg', alt: 'Dell' },
    { src: '/static/homepage/logos/brother.svg', alt: 'Brother' },
    { src: '/static/homepage/logos/epson.svg', alt: 'Epson' },
    { src: '/static/homepage/logos/y-soft.svg', alt: 'Y Soft' },
    { src: '/static/homepage/logos/ricoh.svg', alt: 'Ricoh' },
  ];

  const logosPerSlide = 5;  // Liczba logotypów na slajd
  const totalSlides = Math.ceil(logos.length / logosPerSlide);  // Liczba slajdów
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentSlide(index);
    }
  };

  const getLogosForSlide = (slideIndex) => {
    const startIndex = slideIndex * logosPerSlide;
    return logos.slice(startIndex, startIndex + logosPerSlide);
  };

  return (
    <section className={styles.section}>
      <h3 className="text-center text-5xl font-bold pb-10">Partnerzy</h3>
      <p className="max-w-screen-xl mx-auto text-sm text-center text-dks-dark-gray pb-8">
        Naszą silną i stabilną pozycję na rynku urządzeń biurowych i poligraficznych budujemy w
        oparciu o bliską współpracę z czołowymi światowymi producentami i markami. Dzięki temu
        możemy naszym klientom zawsze przedstawić szeroką ofertę zawierającą najnowocześniejsze
        rozwiązania.
      </p>
      <div className={styles.container}>
        {getLogosForSlide(currentSlide).map((logo) => (
          <div className={styles.item} key={logo.alt}>
            <Image src={logo.src} layout="fill" objectFit="contain" alt={logo.alt} />
          </div>
        ))}
      </div>
      <ul className={styles.dots}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <li
            key={`dot-${index}`}
            className={index === currentSlide ? styles.active : ''}
            onClick={() => goToSlide(index)}
          >
            <button type="button" aria-label={`Przejdź do slajdu ${index + 1}`}> </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

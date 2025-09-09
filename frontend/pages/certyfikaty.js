import PropTypes from 'prop-types';
import Image from 'next/image';

import { useState } from 'react';
import Layout from '../components/layouts/layout';
import HeaderTop from '../components/elements/headerTop';
import Breadcrumb from '../components/elements/breadcrumb';
import PhotoModal from '../components/elements/photoModal';
import getCertifications from '../lib/models/certifications';

import styles from '../styles/certificates.module.scss';

const TITLE = 'Certyfikaty - DKS';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function Certyfikaty({ certification }) {
  const [modalImage, setModalImage] = useState(null);
  const assetsPath = `${process.env.assetsPath}`;

  const certifications = certification.map(({ name, image, id }) => (
    <div
      className={`${styles.certificate}`}
    // eslint-disable-next-line react/no-array-index-key
      key={`cert_${id}`}
      onClick={() => { setModalImage(assetsPath + image); }}
      onKeyPress={() => { setModalImage(assetsPath + image); }}
      role="button"
      tabIndex={0}
    >
      <div className={`${styles.photo}`}>
        <Image src={assetsPath + image} layout="fill" objectFit="scale-down" alt={name} />
      </div>

      <h6 className="text-tiny w-full text-center pt-2">{name}</h6>
    </div>
  ));

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title="Certyfikaty" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex flex-wrap justify-between gap-6 my-16">
          {certifications}
        </div>
        {modalImage && <PhotoModal imgSrc={modalImage} onClose={() => setModalImage(null)} />}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      certification: await getCertifications() || [],
    },
    revalidate: 1, // 60,
  };
}

Certyfikaty.propTypes = {
  // eslint-disable-next-line react/require-default-props
  certification: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired),
};

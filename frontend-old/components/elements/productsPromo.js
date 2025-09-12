import Image from 'next/image';
import styles from './styles/ProductsPromo.module.scss';

const products = [
  {
    model: 'CANON IR ADV DX C257',
    price: '80',
    img: 'https://www.dks.pl/storage/zdjecia/zdjecie_ir-adv-dx-c257_1.jpg',
  },
  {
    model: 'CANON IRA DX C3725',
    price: '169',
    img: 'https://www.dks.pl/storage/zdjecia/zdjecie_ira-dx-c3725_0.jpg',
  },
  {
    model: 'KONICA MINOLTA BIZHUB C250I',
    price: '199',
    img: 'https://www.dks.pl/storage/zdjecia/zdjecie_bizhub-c250i_0.jpg',
  },
].map((product) => (
  <div className={styles.item} key={product.model}>
    <div className={styles.body}>
      <h5 className={styles.label}>{product.model}</h5>
      <div className="my-6">
        <Image width="300" height="300" layout="responsive" objectFit="cover" src={product.img} />
      </div>
      <div className={styles.price}>
        <span className="text-7xl">{product.price}</span>
        <span className="uppercase text-tiny italic">zł netto za 60 m/c</span>
      </div>
    </div>
    <div className={styles.link}>
      więcej
      {'>>'}
    </div>
  </div>
));

export default function ProductsPromo() {
  return (
    <section className={styles.section}>
      <h1 className="text-center text-4xl md:text-5xl font-bold pb-16">Produkty w promocji</h1>
      <div className="flex sm:flex-col sm:space-y-4 mx-auto md:items-end justify-between max-w-screen-xl">
        {products}
      </div>
    </section>
  );
}

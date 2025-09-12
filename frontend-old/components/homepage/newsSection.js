import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/newsSection.module.scss';

export default function NewsSection({ news }) {
  const dayMonthHourFormat = Intl.DateTimeFormat('pl', {
    year: 'numeric', day: 'numeric', month: 'numeric',
  });

  const items = news.map((article) => (
    <div className={styles.item} key={article.id}>
      <Link href={`/blog/${article.category.slug}/${article.slug}`}>
        <a href={`/blog/${article.category.slug}/${article.slug}`}>
          <div className={styles.image}>
            <Image
              src={`${process.env.assetsPath + article.image}`}
              alt={article.title}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className={styles.body}>
            <span className="font-bold">{article.title}</span>
            <div className="mt-2 text-xs text-dks-gray">{dayMonthHourFormat.format(new Date(article.date_created))}</div>
          </div>
        </a>
      </Link>
    </div>
  ));

  return (
    <section className={styles.section}>
      <h2 className="text-center text-5xl font-bold pb-16">Aktualności</h2>
      <div className="w-full flex sm:flex-wrap sm:justify-center md:space-x-4">
        {items}
      </div>
    </section>
  );
}

NewsSection.propTypes = {
  news: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    user_created: PropTypes.string,
    date_created: PropTypes.string,
    user_updated: PropTypes.string,
    date_updated: PropTypes.string,
    title: PropTypes.string,
    seo_title: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    content: PropTypes.string,
    image: PropTypes.string,
    slug: PropTypes.string,
    lead: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
  })),
};

NewsSection.defaultProps = {
  news: [],
};

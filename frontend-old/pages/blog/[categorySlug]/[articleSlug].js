import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import Layout from '../../../components/layouts/layout';
import HeaderTop from '../../../components/elements/headerTop';
import Breadcrumb from '../../../components/elements/breadcrumb';
import styles from '../../../styles/Article.module.scss';

import getNews, { getNewsBySlugs } from '../../../lib/models/news';

const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function Article({ article }) {
  const articleUrl = `${article.category.slug}/${article.slug}`;
  const dayMonthHourFormat = Intl.DateTimeFormat('pl', {
    year: 'numeric', day: 'numeric', month: 'numeric',
  });

  const metaDescription = (article.seo_description == null) ? DESCRIPTION : article.seo_description;
  const imageSocialMedia = (article.image_social_media == null)
    ? null : process.env.assetsPath + article.image_social_media;

  return (
    <Layout title={article.title} description={metaDescription} ogImage={imageSocialMedia} ogType="article">
      <HeaderTop title={article.title} headingType="h2" />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <article className={styles.articleContainer}>
          <div className="w-full flex sm:flex-col">
            <div className={styles.mainImage}>
              <Image
                src={`${process.env.assetsPath + article.image}`}
                layout="fill"
                objectFit="contain"
                alt={article.title}
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-2xl font-bold text-black">{article.title}</h1>
              <div className="py-2">
                <span className="font-bold text-black">Data:</span>
                {' '}
                {dayMonthHourFormat.format(new Date(article.date_created))}
              </div>
              <div className="pb-2">
                <span className="font-bold text-black">Tagi:</span>
                <p className="pb-2">
                  {article.tags.join(', ')}
                </p>
                <hr />
                {/* eslint-disable-next-line react/no-danger */}
                <div className="font-bold mt-6 text-black" dangerouslySetInnerHTML={{ __html: article.lead }} />
              </div>
            </div>
          </div>
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
        <div className="mb-10 text-center">
          <h5 className="text-2xl font-bold mb-4">Podziel się tym postem:</h5>
          <Link href={`https://www.facebook.com/sharer/sharer.php?u=https://www.dks.pl/blog/${articleUrl}`}>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.dks.pl/blog/${articleUrl}`}>
              <FontAwesomeIcon icon={faFacebookF} className="text-dks-red" />
            </a>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const articles = await getNews();
  const paths = articles.map((article) => ({
    params: {
      categorySlug: article.category.slug,
      articleSlug: article.slug,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { articleSlug, categorySlug } }) {
  const requestedArticle = await getNewsBySlugs({ newsSlug: articleSlug, categorySlug });

  if (!requestedArticle) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article: requestedArticle,
    },
    revalidate: 1, // 60,
  };
}

Article.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string,
    category: PropTypes.shape({
      name: PropTypes.string,
      slug: PropTypes.string,
    }).isRequired,
    image: PropTypes.string,
    image_social_media: PropTypes.string,
    title: PropTypes.string,
    seo_description: PropTypes.string,
    slug: PropTypes.string,
    lead: PropTypes.string,
    content: PropTypes.string,
    date_created: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

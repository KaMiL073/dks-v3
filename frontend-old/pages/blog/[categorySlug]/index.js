import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Layout from '../../../components/layouts/layout';
import HeaderTop from '../../../components/elements/headerTop';
import Breadcrumb from '../../../components/elements/breadcrumb';
import SideMenu from '../../../components/navigation/common/sideMenu';

import getCategories from '../../../lib/models/blogCategories';
import getNews from '../../../lib/models/news';

export default function Category({ category, articles }) {
  const TITLE = `Blog - kategoria ${category.slug}`;
  const dayMonthHourFormat = Intl.DateTimeFormat('pl', {
    year: 'numeric', day: 'numeric', month: 'numeric',
  });

  const items = articles.map((article) => (
    <Link href={`/blog/${article.category.slug}/${article.slug}`} key={article.id}>
      <a href={`/blog/${article.category.slug}/${article.slug}`}>
        <div className="flex-col text-sm text-dks-font-gray sm:px-2 hover:cursor-pointer">
          <div className="w-full h-64 md:h-56 relative">
            <Image
              src={`${process.env.assetsPath + article.image}`}
              layout="fill"
              objectFit="contain"
              alt={article.title}
            />
          </div>
          <h6 className="font-bold text-lg py-4 text-black">{article.title}</h6>
          <p className="my-2">
            {article.lead?.slice(0, 150)}
            ...
          </p>
          <p className="py-1">
            <EventIcon />
            {dayMonthHourFormat.format(new Date(article.date_created))}
          </p>
          <p>
            <LocalOfferIcon />
            {article.tags.join(', ')}
          </p>
        </div>
      </a>
    </Link>
  ));

  return (
    <Layout title={TITLE}>
      <HeaderTop title={TITLE} />
      <div className="md:max-w-screen-xl px-4 xl:px-0">
        <Breadcrumb />
        <div className="flex sm:flex-col py-8">
          <div className="md:w-3/4 grid md:grid-cols-3 gap-4">
            {items}
          </div>
          <div className="sm:mt-10 md:w-1/3 px-2">
            <SideMenu
              elements={[
                { href: '/blog/aktualnosci', text: 'Aktualności' },
                { href: '/blog/rozwiazania-dla-poligrafii', text: 'Rozwiązania dla poligrafii' },
              ]}
              title="KATEGORIE"
              template="bright"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const categories = await getCategories();

  const paths = categories.map((category) => ({
    params: {
      categorySlug: category.slug.toString(),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { categorySlug } }) {
  const categories = await getCategories();
  const requestedCategory = categories.find(
    (category) => category.slug === categorySlug,
  );

  if (!requestedCategory) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category: requestedCategory,
      articles: await getNews({ categorySlug: requestedCategory.slug }) || [],
    },
    revalidate: 1, // 60,
  };
}

Category.propTypes = {
  category: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape({
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

Category.defaultProps = {
  articles: [],
};

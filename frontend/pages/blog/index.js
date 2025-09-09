/* eslint-disable camelcase, no-plusplus, no-await-in-loop */
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { SWRConfig, unstable_serialize } from 'swr';

import Layout from '../../components/layouts/layout';
import HeaderTop from '../../components/elements/headerTop';
import Breadcrumb from '../../components/elements/breadcrumb';
import SideMenu from '../../components/navigation/common/sideMenu';
import getQueryParams from '../../lib/helpers/queryStringHelper';
import Articles from '../../components/blog/articles';
import Pagination from '../../components/blog/pagination';

import getNews, { getNewsCount } from '../../lib/models/news';

const TITLE = 'Blog';
const DESCRIPTION = 'Nowoczesne urządzenia drukujące i materiały eksploatacyjne, a także oprogramowanie dla biur i firm poligraficznych są specjalnością naszej firmy.';

export default function Blog({ fallback, pagesNumber }) {
  const { asPath, pathname } = useRouter();
  const { strona } = getQueryParams(asPath);
  const page = strona;

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <HeaderTop title={TITLE} />
      <div className="md:max-w-screen-xl">
        <Breadcrumb />
        <div className="flex sm:flex-col py-8">
          <div className="md:w-3/4 grid md:grid-cols-3 gap-4 px-4 xl:px-0">
            <SWRConfig value={{ fallback }}>
              <Articles page={page} />
            </SWRConfig>
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
        <div className="my-3">
          <Pagination
            pagesNumber={pagesNumber}
            urlBase={pathname}
            activePage={page || 1}
          />
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const LIMIT = 9;
  const newsCount = await getNewsCount();
  const pagesNumber = Math.ceil(newsCount / 9);

  const propsObject = {
    props: {
      pagesNumber,
      fallback: {},
    },
    revalidate: 1, // 60,
  };

  const arrayOfPagesNumber = Array.from(Array(pagesNumber));
  for (let p = 0; p < arrayOfPagesNumber.length; p++) {
    const articles = await getNews({ limit: LIMIT, offset: p * LIMIT });
    propsObject.props.fallback[unstable_serialize(['/api/news', p])] = articles;
  }

  return propsObject;
}

Blog.propTypes = {
  pagesNumber: PropTypes.number.isRequired,
  fallback: PropTypes.shape({}).isRequired,
};

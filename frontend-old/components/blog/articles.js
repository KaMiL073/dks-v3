import PropTypes from 'prop-types';
import Image from 'next/image';
import Link from 'next/link';
import EventIcon from '@mui/icons-material/Event';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import useSWR from 'swr';

import { getBlogArticles } from '../../lib/api/frontApi';

export default function Articles({ page = 0 }) {
  const dayMonthHourFormat = Intl.DateTimeFormat('pl', {
    year: 'numeric', day: 'numeric', month: 'numeric',
  });

  const { data } = useSWR(['/api/news', page], getBlogArticles);

  const items = data?.map((article) => (
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
            {article.lead?.replace(/<[^>]*>?/gm, '').replace("&oacute;", 'ó').slice(0, 150)}
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

  return (<>{items}</>);
}

Articles.propTypes = {
  page: PropTypes.number.isRequired,
};

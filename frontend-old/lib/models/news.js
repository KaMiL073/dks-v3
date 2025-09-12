import backend from '../api/directus';

export default async function getNews(attributes = {}) {
  const { limit, offset, categorySlug } = attributes;
  const params = {
    fields: [
      '*',
      'category.name',
      'category.slug',
    ],
    filter: {
      status: {
        _in: ['published'],
      },
    },
    sort: '-date_created',
  };

  if (categorySlug) {
    params.filter.category = {
      slug: {
        _eq: categorySlug,
      },
    };
  }

  if (limit) {
    params.limit = limit;
  }

  if (offset) {
    params.offset = offset;
  }

  return backend.get('/items/news', { params }).then((resp) => resp.data.data);
}

export async function getNewsBySlugs({ newsSlug, categorySlug }) {
  return backend.get('/items/news', {
    params: {
      fields: [
        '*',
        'category.name',
        'category.slug',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
        _and: [
          {
            slug: {
              _eq: newsSlug,
            },
          },
          {
            category: {
              slug: {
                _eq: categorySlug,
              },
            },
          },
        ],
      },
    },
  }).then((resp) => resp.data.data[0] || null);
}

export async function getNewsCount() {
  return backend.get('/items/news', {
    params: {
      filter: {
        status: {
          _in: ['published'],
        },
      },
      meta: ['filter_count'],
    },
  }).then((resp) => {
    const {
      data: {
        meta: {
          filter_count: count,
        },
      },
    } = resp;

    return count;
  });
}

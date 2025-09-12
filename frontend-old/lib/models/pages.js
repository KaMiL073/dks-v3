import backend from '../api/directus';

export default async function getPageData(url) {
  return backend.get('/items/pages', {
    params: {
      fields: [
        '*',
        'text_fields.*',
      ],
      filter: {
        url: {
          _eq: url,
        },
      },
    },
  }).then((resp) => resp.data.data[0] || {});
}

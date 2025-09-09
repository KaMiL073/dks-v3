import backend from '../api/directus';

export default async function getCategories() {
  return backend.get('/items/categories', {
    params: {
      fields: [
        'name',
        'slug',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
      },
    },
  }).then((resp) => resp.data.data);
}

import backend from '../api/directus';

export default async function getCertifications() {
  return backend.get('/items/certifications', {
    params: {
      fields: [
        '*',
      ],
      filter: {
        status: {
          _in: ['published'],
        },
      },
      sort: 'order',
    },
  }).then((resp) => resp.data.data);
}

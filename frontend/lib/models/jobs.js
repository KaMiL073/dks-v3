import backend from '../api/directus';

export default async function getRecruitments() {
  return backend.get('/items/Recruitments', {
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

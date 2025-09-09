import backend from '../api/directus';

export default async function getEventsItem(slug) {
  return backend.get('/items/events_create', {
    params: {
      fields: [
        '*',
        'speakers.*',
        'agenda.*',
        'agenda.speakers.*',
      ],
      filter: {
        slug: {
          _eq: slug,
        },
      },
    },
  }).then((resp) => resp.data.data[0] || {});
}

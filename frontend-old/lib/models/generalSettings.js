import backend from '../api/directus';

export default async function getSettings() {
  return backend.get('/items/general_settings', {
    params: {
      fields: [
        'promos_widget',
        'products_slider',
      ],
    },
  }).then((resp) => resp.data.data);
}

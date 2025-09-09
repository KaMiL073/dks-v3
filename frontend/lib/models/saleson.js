import backend from '../api/directus';

export default async function saveFormData(formData) {
  return backend.post(`/items/saleson`, formData).then(() => true);
}

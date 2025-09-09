import backend from '../api/directus';

export default async function saveFormData(formData) {
  return backend.post(`/items/gala30`, formData).then(() => true);
}

import backend from '../api/directus';

export default async function saveFormData(formData) {
  return backend.post(`/items/form_fair`, formData).then(() => true);
}
export async function saveFormDataEvents(formData) {
  return backend.post(`/items/events`, formData).then(() => true);
}
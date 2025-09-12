import backend from '../api/directus';

export default async function saveFormData(formData) {
  formData.date_updated = null;
  formData.date_created = null;
  
  return backend.post(`/items/remadays`, formData).then(() => true);
}

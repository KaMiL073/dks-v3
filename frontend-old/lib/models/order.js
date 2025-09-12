import backend from '../api/directus';

export default async function saveFormData(formData) {
  formData.date_updated = null;
  formData.date_created = null;
  formData.user_created = null; 
  return backend.post(`/items/order`, formData).then(() => true);
}

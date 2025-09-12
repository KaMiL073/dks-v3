import backend from '../api/directus';

export default async function saveFormData(formData) {
  const params = {
    form_name: formData?.formName,
    name: formData?.name,
    email: formData?.email,
    phone: formData?.phone,
    message: formData?.message,
    province: formData?.province,
    clause: formData?.clause,
    clause_for_answers: formData?.clause_for_answers,
    form_data: formData,
    nip: formData?.nip,
  };

  return backend.post('/items/contact_forms', params).then(() => true);
}

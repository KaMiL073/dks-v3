import backend from '../api/directus';

export default async function getFields(collectionName) {
  return backend.get(`/fields/${collectionName}`)
    .then((resp) => resp.data.data.filter((item) => item.field !== 'id' && item.field !== 'date_created' && item.field !== 'status').map((field) => ({
      name: field.field,
      displayName: field.meta.translations?.[0].translation || null,
      interface: field.meta.interface,
      options: field.meta?.options?.choices || [],
      required: field.meta.required,
      type: field.type,
      hidden: field.meta.hidden,
      sort: field.meta.sort || 0,
    })).sort((a, b) => a.sort - b.sort))
    .catch(() => []);
}

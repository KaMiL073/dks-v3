import axios from 'axios';

export default async function getProductsFiltered(params) {
  return axios.post('/api/products', params).then((resp) => resp.data);
}

export async function submitForm(params) {
  return axios.post('/api/forms', params).then((resp) => resp.data);
}

export async function submitFormGeneration(collectionName, params) {
  return axios.post(`/api/${collectionName}`, params).then((resp) => resp.data);
}

export async function getBlogArticles(url, page) {
  return axios.post('/api/news', { page }).then((resp) => resp.data);
}

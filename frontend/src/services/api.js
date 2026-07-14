import axios from 'axios';

const getAPI = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: '/api/v1',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
};

export const productService = {
  getAll: (params) => getAPI().get('/products', { params }).then((r) => r.data),
  getById: (id) => getAPI().get(`/products/${id}`).then((r) => r.data),
  getCategories: () => getAPI().get('/products/categories').then((r) => r.data),
};

export const translationService = {
  translate: (text, sourceLang = 'en', targetLang = 'rw', context) =>
    getAPI().post('/translations/translate', { text, sourceLang, targetLang, context }).then((r) => r.data),
};

export const adaptationService = {
  getCurrent: () => getAPI().get('/adaptation').then((r) => r.data),
  analyze: () => getAPI().post('/adaptation/analyze').then((r) => r.data),
  override: (data) => getAPI().put('/adaptation/override', data).then((r) => r.data),
};

export const chatbotService = {
  sendMessage: (message) => getAPI().post('/chatbot/send', { message }).then((r) => r.data),
};

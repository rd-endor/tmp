import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('endor_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  signup: async (username, email, password) => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
  },
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Signatures API
export const signaturesApi = {
  list: async () => {
    const response = await api.get('/signatures');
    return response.data;
  },
  create: async (signatureData) => {
    const response = await api.post('/signatures', signatureData);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/signatures/${id}`);
    return response.data;
  },
  update: async (id, signatureData) => {
    const response = await api.put(`/signatures/${id}`, signatureData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/signatures/${id}`);
    return response.data;
  },
};

// Payments & Card Tokenization API
export const paymentsApi = {
  listMethods: async () => {
    const response = await api.get('/payments/methods');
    return response.data;
  },
  tokenizeAndSave: async (cardData) => {
    const response = await api.post('/payments/tokenize-and-save', cardData);
    return response.data;
  },
  setDefaultMethod: async (cardId) => {
    const response = await api.put(`/payments/methods/${cardId}/default`);
    return response.data;
  },
  deleteMethod: async (cardId) => {
    const response = await api.delete(`/payments/methods/${cardId}`);
    return response.data;
  },
};

// Assets / Logos API
export const assetsApi = {
  getLogos: async () => {
    const response = await api.get('/logos');
    return response.data;
  },
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;

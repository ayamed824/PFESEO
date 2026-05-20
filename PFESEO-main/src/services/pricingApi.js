import axios from 'axios';

const API_URL = 'http://localhost:8000/api/pricing';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Plans
export const getPlans = () => api.get('/plans').then(r => r.data);
export const getPublicPlans = () => api.get('/plans/public').then(r => r.data);
export const createPlan = (data) => api.post('/plans', data).then(r => r.data);
export const updatePlan = (id, data) => api.put(`/plans/${id}`, data).then(r => r.data);
export const deletePlan = (id) => api.delete(`/plans/${id}`);

// Offers
export const getOffers = () => api.get('/offers').then(r => r.data);
export const createOffer = (data) => api.post('/offers', data).then(r => r.data);
export const updateOffer = (id, data) => api.put(`/offers/${id}`, data).then(r => r.data);
export const deleteOffer = (id) => api.delete(`/offers/${id}`);

export default api;
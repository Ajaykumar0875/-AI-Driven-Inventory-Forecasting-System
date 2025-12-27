import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Call Failed:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export const uploadCSV = (formData) => api.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const generateForecast = () => api.post('/forecast/generate');

export const getForecasts = () => api.get('/forecast');

export const getSalesHistory = (productId = '') => api.get(`/sales${productId ? `?productId=${productId}` : ''}`);

export const getProductAlerts = () => api.get('/products/alerts');

export const sendChatMessage = (message) => api.post('/chat', { message });

export default api;

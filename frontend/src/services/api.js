import axios from 'axios';

const API_BASE_URL = '/api';

// Create Session ID stored in localStorage for guest tracking
export const getSessionId = () => {
  let sessionId = localStorage.getItem('findora_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('findora_session_id', sessionId);
  }
  return sessionId;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findora_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getCategories: () => api.get('/products/categories'),
  getProductDetails: (id) => api.get(`/products/${id}`, { params: { session_id: getSessionId() } }),
};

export const recommendationsAPI = {
  getTwoTower: (limit = 8) => api.get('/recommendations/two-tower', { params: { session_id: getSessionId(), limit } }),
  getContentBased: (id, limit = 6) => api.get(`/recommendations/content-based/${id}`, { params: { limit } }),
  getFBT: (id, limit = 3) => api.get(`/recommendations/frequently-bought-together/${id}`, { params: { limit } }),
  getCompleteLook: (id, limit = 3) => api.get(`/recommendations/complete-the-look/${id}`, { params: { limit } }),
  getColdStart: (limit = 8) => api.get('/recommendations/cold-start', { params: { limit } }),
  getTrending: (limit = 8) => api.get('/recommendations/trending', { params: { limit } }),
};

export const searchAPI = {
  semanticSearch: (query) => api.post('/search/semantic', { query, session_id: getSessionId() }),
  assistantChat: (message, currentProductId = null) =>
    api.post('/search/assistant', { message, session_id: getSessionId(), current_product_id: currentProductId }),
  getSuggestions: (q) => api.get('/search/suggestions', { params: { q } }),
};

export const usersAPI = {
  trackBehavior: (productId, action, durationSeconds = 5) =>
    api.post('/users/track', { product_id: productId, action, session_id: getSessionId(), duration_seconds: durationSeconds }),
  getBrowsingHistory: () => api.get('/users/browsing-history', { params: { session_id: getSessionId() } }),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

export const ordersAPI = {
  createOrder: (items, shippingAddress) => api.post('/orders', { items, shipping_address: shippingAddress }),
  getOrders: () => api.get('/orders'),
};

export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/stats'),
};

export default api;

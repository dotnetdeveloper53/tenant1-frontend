import axios from 'axios';

// Use environment variable or fallback to development server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9001';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'crm_access_token';
const REFRESH_TOKEN_KEY = 'crm_refresh_token';

export const tokenManager = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clearTokens: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY)
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refresh_token: refreshToken
          });

          const { access_token } = response.data;
          tokenManager.setToken(access_token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { access_token, refresh_token } = response.data;

    tokenManager.setToken(access_token);
    tokenManager.setRefreshToken(refresh_token);

    return response.data;
  },
  logout: () => {
    tokenManager.clearTokens();
  },
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => {
    const refreshToken = tokenManager.getRefreshToken();
    return api.post('/auth/refresh', { refresh_token: refreshToken });
  }
};

// Contacts API (unchanged)
export const contactsApi = {
  getAll: (params = {}) => {
    // Build query string from parameters
    const queryString = new URLSearchParams();

    if (params.page) queryString.append('page', params.page);
    if (params.limit) queryString.append('limit', params.limit);
    if (params.sort) queryString.append('sort', params.sort);
    if (params.order) queryString.append('order', params.order);

    const url = queryString.toString() ? `/contacts?${queryString}` : '/contacts';
    return api.get(url);
  },
  getById: (id) => api.get(`/contacts/${id}`),
  create: (contact) => api.post('/contacts', contact),
  update: (id, contact) => api.put(`/contacts/${id}`, contact),
  delete: (id) => api.delete(`/contacts/${id}`),
};

export default api;
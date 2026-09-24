import axios from 'axios';
import { getToken, clearAuth } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 20000, // Render's free tier can be slow to wake up
});

// attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // no response at all: server down, no internet, or timeout
      error.friendlyMessage =
        error.code === 'ECONNABORTED'
          ? 'The server took too long to respond. Please try again.'
          : 'Network error. Check your internet connection and try again.';
    } else {
      const { status, data } = error.response;
      error.friendlyMessage = data?.message || `Request failed with status ${status}`;

      // expired / invalid token on a protected call -> log the user out
      const isAuthCall = /\/(login|register)$/.test(error.config?.url || '');
      if (status === 401 && !isAuthCall) {
        clearAuth();
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error) =>
  error?.friendlyMessage || error?.message || 'Something went wrong';

export default api;

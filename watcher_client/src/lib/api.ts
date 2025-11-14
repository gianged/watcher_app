import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/watcher/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data.data;
          useAuthStore.getState().setAuth(
            useAuthStore.getState().user!,
            token,
            refreshToken
          );

          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/';
        toast.error('Session expired. Please login again.');
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Don't show toast for certain endpoints
    if (!originalRequest.url?.includes('/check-username')) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

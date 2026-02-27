import axios from 'axios';
import Constants from 'expo-constants';

const BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request Interceptor ── */

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response Interceptor: Handle Errors ── */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
    }
    return Promise.reject(error);
  },
);

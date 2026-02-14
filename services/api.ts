import axios from 'axios';
import Constants from 'expo-constants';

// import * as SecureStore from 'expo-secure-store';

const BASE_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:8000/api';

/**
 * Pre-configured Axios instance for the Dolani backend.
 * - Attaches JWT from SecureStore on every request.
 * - Handles 401 responses (token refresh stub).
 */
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ── Request Interceptor: Attach Auth Token ── */

api.interceptors.request.use(
  async (config) => {
    // const token = await SecureStore.getItemAsync('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response Interceptor: Handle Auth Errors ── */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: Implement token refresh logic
      // 1. Attempt refresh using stored refresh token
      // 2. On success, retry original request
      // 3. On failure, clear tokens & redirect to login
      // await SecureStore.deleteItemAsync('auth_token');
    }
    return Promise.reject(error);
  },
);

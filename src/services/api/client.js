import axios from 'axios';
import { toApiError } from './errors';

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error('VITE_API_BASE_URL is not set. Copy .env.example to .env.');
}

// Backend sessions are httpOnly cookies, so every request is credentialed.
export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error))
);

// All success responses are { success, message, data }.
export const unwrap = (response) => response.data?.data;

export const api = {
  get: (url, config) => apiClient.get(url, config).then(unwrap),
  post: (url, body, config) => apiClient.post(url, body, config).then(unwrap),
  patch: (url, body, config) => apiClient.patch(url, body, config).then(unwrap),
  delete: (url, config) => apiClient.delete(url, config).then(unwrap),
};

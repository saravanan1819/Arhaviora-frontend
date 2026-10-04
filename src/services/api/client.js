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

// Access tokens are short-lived httpOnly cookies. On a 401 from a data request,
// ask the existing /auth/refresh endpoint for a new cookie once (shared across
// concurrent requests) and replay the request. Auth endpoints are never retried.
let refreshing = null;
const refreshSession = () => {
  if (!refreshing) {
    refreshing = apiClient
      .post('/auth/refresh', null, { _skipRefresh: true })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;
    const isAuthUrl = typeof config?.url === 'string' && config.url.startsWith('/auth/');
    if (error?.response?.status === 401 && config && !config._retried && !config._skipRefresh && !isAuthUrl) {
      config._retried = true;
      try {
        await refreshSession();
        return apiClient(config);
      } catch {
        /* fall through to the original 401 */
      }
    }
    return Promise.reject(toApiError(error));
  }
);

// All success responses are { success, message, data }.
export const unwrap = (response) => response.data?.data;

export const api = {
  get: (url, config) => apiClient.get(url, config).then(unwrap),
  post: (url, body, config) => apiClient.post(url, body, config).then(unwrap),
  patch: (url, body, config) => apiClient.patch(url, body, config).then(unwrap),
  delete: (url, config) => apiClient.delete(url, config).then(unwrap),
};

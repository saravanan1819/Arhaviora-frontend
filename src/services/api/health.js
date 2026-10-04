import axios from 'axios';
import { toApiError } from './errors';

// /health is mounted at the backend root, outside the /api/v1 base.
const healthUrl = () => new URL('/health', import.meta.env.VITE_API_BASE_URL).toString();

export const checkHealth = () =>
  axios
    .get(healthUrl(), { withCredentials: true })
    .then((res) => res.data)
    .catch((error) => {
      throw toApiError(error);
    });

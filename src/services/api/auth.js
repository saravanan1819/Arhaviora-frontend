import { api } from './client';

export const register = ({ email, password, firstName, lastName, phone }) =>
  api.post('/auth/register', {
    email,
    password,
    firstName,
    lastName,
    ...(phone ? { phone } : {}),
  });

// Resolves { user }; the backend sets httpOnly access/refresh cookies.
export const login = ({ email, password }) => api.post('/auth/login', { email, password });

// Resolves { user }.
export const getCurrentUser = () => api.get('/auth/me');

export const logout = () => api.post('/auth/logout');

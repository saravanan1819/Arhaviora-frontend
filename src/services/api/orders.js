import { api } from './client';

// -> { orders, pagination }
export const listOrders = (params) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);

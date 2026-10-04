import { api } from './client';

// Prepared only. No backend endpoint creates an Order, so initiatePayment has
// no valid orderId to be called with yet.
export const initiatePayment = (orderId) => api.post('/payments/initiate', { orderId });
export const getPaymentHistory = (orderId) => api.get(`/payments/${orderId}`);

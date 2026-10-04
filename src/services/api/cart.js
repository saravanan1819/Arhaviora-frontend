import { api } from './client';

// Backend cart contract (authenticated). Every response is { cart }.
export const getCart = () => api.get('/cart');

export const addCartItem = ({ productVariantId, quantity, personalizationText }) =>
  api.post('/cart/items', {
    productVariantId,
    quantity,
    ...(personalizationText ? { personalizationText } : {}),
  });

export const updateCartItem = (cartItemId, quantity) =>
  api.patch(`/cart/items/${cartItemId}`, { quantity });

export const removeCartItem = (cartItemId) => api.delete(`/cart/items/${cartItemId}`);

export const clearCart = () => api.delete('/cart/items');

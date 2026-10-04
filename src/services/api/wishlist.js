import { api } from './client';

// Customer role only. List -> { wishlistItems }.
export const listWishlist = () => api.get('/wishlist');
export const addWishlistItem = (productId) => api.post('/wishlist/items', { productId });
export const removeWishlistItem = (productId) => api.delete(`/wishlist/items/${productId}`);
export const moveWishlistItemToCart = (
  productId,
  { productVariantId, quantity, personalizationText } = {}
) =>
  api.post(`/wishlist/items/${productId}/move-to-cart`, {
    ...(productVariantId ? { productVariantId } : {}),
    ...(quantity ? { quantity } : {}),
    ...(personalizationText ? { personalizationText } : {}),
  });

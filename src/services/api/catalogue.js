import { api } from './client';

const clean = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
  );

// -> { categories, pagination }
export const listCategories = (params) => api.get('/categories', { params: clean(params) });

// -> { products, pagination }
export const listProducts = (params) => api.get('/products', { params: clean(params) });

// -> { product }
export const getProductBySlug = (slug, variantId) =>
  api.get(`/products/${encodeURIComponent(slug)}`, { params: clean({ variantId }) });

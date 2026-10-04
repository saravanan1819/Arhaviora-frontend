import { api } from './client';

// Backend totals are authoritative; the client never computes them.
export const getCheckoutSummary = ({ cartId, shippingAddressId }) =>
  api.get('/checkout/summary', { params: { cartId, shippingAddressId } });

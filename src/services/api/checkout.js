import { api } from './client';

// Backend totals are authoritative; the client never computes them.
export const getCheckoutSummary = ({ cartId, shippingAddressId }) =>
  api.get('/checkout/summary', { params: { cartId, shippingAddressId } });

// PREPARED, NOT WIRED: POST /checkout (backend PR #388) is not released, and
// CHK-007 / CHK-008 are pending. Nothing in the UI calls this yet. Resolves
// { order } on 201; use toPlacedOrder() on the result.
export const createOrder = ({ cartId, shippingAddressId, billingAddressId, notes }) =>
  api.post('/checkout', {
    cartId,
    shippingAddressId,
    billingAddressId,
    ...(notes ? { notes } : {}),
  });

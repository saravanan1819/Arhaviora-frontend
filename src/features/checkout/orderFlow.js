// Prepared state transition from POST /checkout to payment initiation.
// Not used by the UI until backend PR #388 (+ CHK-007 / CHK-008) is released.

// Only a real backend order id may move on to payment. Throws otherwise, so a
// missing id can never be papered over with a generated one.
export const toPlacedOrder = (checkoutResponse) => {
  const order = checkoutResponse?.order;
  if (!order || typeof order.id !== 'string' || !order.id) {
    throw new Error('Checkout response did not include an order id');
  }
  return order;
};

// Billing falls back to the shipping address when no default billing address exists.
export const resolveBillingAddressId = (addresses = [], shippingAddressId) =>
  addresses.find((a) => a.isDefaultBilling)?.id ?? shippingAddressId;

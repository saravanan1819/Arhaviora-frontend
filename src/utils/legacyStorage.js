// Keys written by earlier builds that persisted fake commerce state (local
// addresses, orders, payment/step selections, promo pricing). Purged on load.
const LEGACY_KEYS = [
  'arhaviora_addresses_v5',
  'arhaviora_selected_address_v5',
  'arhaviora_checkout_step_v1',
  'arhaviora_payment_method_v1',
  'arhaviora_last_order_v1',
  'arhaviora_cart_pricing_v3',
];

export const purgeLegacyStorage = () => {
  try {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    /* storage unavailable */
  }
};

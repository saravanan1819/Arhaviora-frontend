export const CHECKOUT_STEP = {
  ADDRESS: 1,
  ORDER_SUMMARY: 2,
  PAYMENT: 3,
  CONFIRMATION: 4,
};

export const CHECKOUT_STEPS = [
  { id: CHECKOUT_STEP.ADDRESS, key: 'address', label: 'Address' },
  { id: CHECKOUT_STEP.ORDER_SUMMARY, key: 'order-summary', label: 'Order Summary' },
  { id: CHECKOUT_STEP.PAYMENT, key: 'payment', label: 'Payment' },
  { id: CHECKOUT_STEP.CONFIRMATION, key: 'confirmation', label: 'Confirmation' },
];

export const CHECKOUT_STORAGE_KEY = 'arhaviora_checkout_step_v1';
export const PAYMENT_METHOD_STORAGE_KEY = 'arhaviora_payment_method_v1';

export const PAYMENT_METHOD = {
  ONLINE: 'online',
  COD: 'cod',
};

export const PAYMENT_OPTIONS = [
  {
    id: PAYMENT_METHOD.ONLINE,
    label: 'Online Payment',
    icon: '/assets/icons/safe-paymet.svg',
    iconSelected: '/assets/icons/payment-02.svg',
  },
  {
    id: PAYMENT_METHOD.COD,
    label: 'Cash on Delivery',
    icon: '/assets/icons/cash-on-delivery.svg',
    iconSelected: '/assets/icons/cash-on-delivery.svg',
  },
];

export const canProceedFromAddress = (selectedAddressId, addresses = []) =>
  Boolean(selectedAddressId) &&
  addresses.some((item) => item.id === String(selectedAddressId));

export const canProceedFromOrderSummary = (
  cartItems = [],
  selectedAddressId,
  addresses = [],
  paymentMethod
) =>
  canProceedFromAddress(selectedAddressId, addresses) &&
  cartItems.length > 0 &&
  PAYMENT_OPTIONS.some((option) => option.id === paymentMethod);

export const loadPaymentMethod = () => {
  try {
    const raw = localStorage.getItem(PAYMENT_METHOD_STORAGE_KEY);
    return PAYMENT_OPTIONS.some((option) => option.id === raw)
      ? raw
      : PAYMENT_METHOD.ONLINE;
  } catch {
    return PAYMENT_METHOD.ONLINE;
  }
};

export const savePaymentMethod = (method) => {
  try {
    localStorage.setItem(PAYMENT_METHOD_STORAGE_KEY, String(method));
  } catch {
    // ignore
  }
};

export const loadCheckoutStep = () => {
  try {
    const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
    const step = Number(raw);
    return CHECKOUT_STEPS.some((item) => item.id === step) ? step : CHECKOUT_STEP.ADDRESS;
  } catch {
    return CHECKOUT_STEP.ADDRESS;
  }
};

export const saveCheckoutStep = (step) => {
  try {
    localStorage.setItem(CHECKOUT_STORAGE_KEY, String(step));
  } catch {
    // ignore
  }
};

export const getStepById = (stepId) =>
  CHECKOUT_STEPS.find((item) => item.id === stepId) || CHECKOUT_STEPS[0];

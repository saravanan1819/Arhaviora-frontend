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

export const canProceedFromAddress = (selectedAddressId, addresses = []) =>
  Boolean(selectedAddressId) &&
  addresses.some((item) => item.id === String(selectedAddressId));

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

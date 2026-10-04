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

export const getStepById = (stepId) =>
  CHECKOUT_STEPS.find((item) => item.id === stepId) || CHECKOUT_STEPS[0];

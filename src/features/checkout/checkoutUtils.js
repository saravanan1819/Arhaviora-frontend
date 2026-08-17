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
export const LAST_ORDER_STORAGE_KEY = 'arhaviora_last_order_v1';

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

export const getPaymentMethodLabel = (paymentMethod) =>
  PAYMENT_OPTIONS.find((option) => option.id === paymentMethod)?.label || 'Online Payment';

export const getPaymentMethodOption = (paymentMethod) =>
  PAYMENT_OPTIONS.find((option) => option.id === paymentMethod) || PAYMENT_OPTIONS[0];

export const formatOrderDate = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const createOrderId = () => {
  const suffix = String(Math.floor(10000 + Math.random() * 90000));
  return `ST-ORD-${suffix}`;
};

export const createOrderConfirmation = ({
  address = null,
  cartItems = [],
  totals = {},
  paymentMethod = PAYMENT_METHOD.ONLINE,
  orderId = createOrderId(),
  orderDate = new Date(),
} = {}) => ({
  orderId: String(orderId),
  orderDate: formatOrderDate(orderDate),
  customerName: address?.fullName || '',
  phone: address?.phone || '',
  addressLabel: address?.label || 'HOME',
  addressLine: [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postalCode,
  ]
    .filter(Boolean)
    .join(', '),
  items: cartItems.map((item) => ({ ...item })),
  totals: {
    subtotal: Number(totals.subtotal) || 0,
    discount: Number(totals.discount) || 0,
    shippingFee: Number(totals.shippingFee) || 0,
    shippingLabel: totals.shippingLabel || 'Free',
    total: Number(totals.total) || 0,
  },
  paymentMethod,
  paymentLabel: getPaymentMethodLabel(paymentMethod),
});

export const loadLastOrder = () => {
  try {
    const raw = localStorage.getItem(LAST_ORDER_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const saveLastOrder = (order) => {
  try {
    if (order) {
      localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
    } else {
      localStorage.removeItem(LAST_ORDER_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
};

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

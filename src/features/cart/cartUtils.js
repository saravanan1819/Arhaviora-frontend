export const CART_STORAGE_KEY = 'arhaviora_cart_v2';
export const CART_PRICING_STORAGE_KEY = 'arhaviora_cart_pricing_v2';
export const DEFAULT_CART_THUMB = '/assets/images/products/bestseller_1.png';

export const normalizeCartItem = (product = {}) => ({
  id: String(product.id),
  productId: product.productId != null ? String(product.productId) : String(product.id),
  title: product.title || '',
  price: Number(product.price) || 0,
  quantity: Math.max(1, Number(product.quantity) || 1),
  color: product.color || product.threadColor || '',
  name: product.name || product.personalization || '',
  category: product.category || '',
  imageUrl: product.imageUrl || DEFAULT_CART_THUMB,
});

export const getCartCount = (items = []) =>
  items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

export const getCartSubtotal = (items = []) =>
  items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

export const getCartTotals = (items = [], pricing = {}) => {
  const subtotal = getCartSubtotal(items);
  const discount = items.length > 0 ? Number(pricing.discount) || 0 : 0;
  const shippingFee = Number(pricing.shippingFee) || 0;
  const shippingLabel =
    pricing.shippingLabel != null && pricing.shippingLabel !== ''
      ? pricing.shippingLabel
      : shippingFee > 0
        ? shippingFee
        : 'Free';
  const total = Math.max(0, subtotal - discount + shippingFee);

  return {
    subtotal,
    discount,
    shippingFee,
    shippingLabel,
    total,
    promoCode: pricing.promoCode || '',
  };
};

export const addItemToCart = (items, product) => {
  const incoming = normalizeCartItem(product);
  const existing = items.find((item) => item.id === incoming.id);

  if (existing) {
    return items.map((item) =>
      item.id === incoming.id
        ? { ...item, quantity: item.quantity + incoming.quantity }
        : item
    );
  }

  return [...items, incoming];
};

export const updateCartItemQuantity = (items, productId, quantity) =>
  items.map((item) =>
    item.id === productId
      ? { ...item, quantity: Math.max(1, Number(quantity) || 1) }
      : item
  );

export const removeCartItem = (items, productId) =>
  items.filter((item) => item.id !== productId);

export const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.map(normalizeCartItem);
  } catch {
    return null;
  }
};

export const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage unavailable */
  }
};

export const loadPricingFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_PRICING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      discount: Number(parsed.discount) || 0,
      shippingFee: Number(parsed.shippingFee) || 0,
      shippingLabel: parsed.shippingLabel ?? '',
      promoCode: parsed.promoCode || '',
    };
  } catch {
    return null;
  }
};

export const savePricingToStorage = (pricing) => {
  try {
    localStorage.setItem(CART_PRICING_STORAGE_KEY, JSON.stringify(pricing));
  } catch {
    /* storage unavailable */
  }
};

/** Seed data only — replace with API cart + pricing responses. */
export const createSeedCartItems = () => {
  const base = {
    title: 'Personalized Muslin Baby\nBlanket',
    price: 1499,
    quantity: 1,
    color: 'Blue',
    name: 'Sophia',
    category: 'Baby Essentials',
    imageUrl: DEFAULT_CART_THUMB,
  };

  return ['cart-1', 'cart-2'].map((id) =>
    normalizeCartItem({ ...base, id, productId: '1' })
  );
};

export const createSeedCartPricing = () => ({
  discount: 598,
  shippingFee: 0,
  shippingLabel: 'Free',
  promoCode: '',
});

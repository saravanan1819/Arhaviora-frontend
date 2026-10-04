export const CART_STORAGE_KEY = 'arhaviora_cart_v3';
export const DEFAULT_CART_THUMB = '/assets/images/products/bestseller_1.png';

const personalizationOf = (product) =>
  String(product.personalizationText ?? product.name ?? '').trim();

const cartLineId = (product) =>
  product.productVariantId
    ? `${product.productVariantId}|${personalizationOf(product)}`
    : String(product.id);

export const normalizeCartItem = (product = {}) => ({
  id: cartLineId(product),
  productId: product.productId != null ? String(product.productId) : String(product.id),
  productSlug: product.productSlug || null,
  productVariantId: product.productVariantId || null,
  title: product.title || '',
  price: Number(product.price) || 0,
  quantity: Math.max(1, Number(product.quantity) || 1),
  color: product.variantLabel || product.color || '',
  name: personalizationOf(product),
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

// Display estimate only; the backend checkout summary is authoritative.
export const getCartTotals = (items = []) => {
  const subtotal = getCartSubtotal(items);
  return { subtotal, total: subtotal };
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

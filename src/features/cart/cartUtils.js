export const DEFAULT_CART_THUMB = '/assets/images/products/bestseller_1.png';

// The backend cart returns variant ids, quantities and prices but no product
// name or image. Presentation-only details (never prices or quantities) are
// remembered per variant when an item is added, so the cart can show them.
export const DISPLAY_STORAGE_KEY = 'arhaviora_cart_display_v1';

const loadDisplay = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(DISPLAY_STORAGE_KEY) || '{}');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const rememberDisplay = (productVariantId, details) => {
  try {
    const all = loadDisplay();
    all[productVariantId] = {
      title: details.title || '',
      imageUrl: details.imageUrl || '',
      productSlug: details.productSlug || '',
      option: details.variantLabel || '',
      category: details.category || '',
    };
    localStorage.setItem(DISPLAY_STORAGE_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable */
  }
};

export const clearDisplay = () => {
  try {
    localStorage.removeItem(DISPLAY_STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
};

// Backend cart -> view model. Prices stay as the backend's decimal strings.
export const toCartView = (cart) => {
  const display = loadDisplay();
  const items = (cart?.items || []).map((item) => {
    const d = display[item.productVariantId] || {};
    return {
      id: item.id,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      title: d.title || 'Product',
      imageUrl: d.imageUrl || DEFAULT_CART_THUMB,
      productSlug: d.productSlug || null,
      option: d.option || '',
      category: d.category || '',
      personalization: item.personalizationText || '',
    };
  });
  return {
    id: cart?.id ?? null,
    items,
    giftBoxCount: (cart?.giftBoxes || []).length,
    itemsSubtotal: cart?.itemsSubtotal ?? '0.00',
    giftBoxesSubtotal: cart?.giftBoxesSubtotal ?? '0.00',
    total: cart?.total ?? '0.00',
  };
};

export const getCartCount = (items = []) =>
  items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

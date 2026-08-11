import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addItemToCart,
  createSeedCartItems,
  createSeedCartPricing,
  getCartCount,
  getCartTotals,
  loadCartFromStorage,
  loadPricingFromStorage,
  removeCartItem,
  saveCartToStorage,
  savePricingToStorage,
  updateCartItemQuantity,
} from '../features/cart/cartUtils';

export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = loadCartFromStorage();
    return stored && stored.length > 0 ? stored : createSeedCartItems();
  });

  const [pricing, setPricing] = useState(() => {
    const stored = loadPricingFromStorage();
    return stored || createSeedCartPricing();
  });

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  useEffect(() => {
    savePricingToStorage(pricing);
  }, [pricing]);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => addItemToCart(prev, product));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((prev) => updateCartItemQuantity(prev, productId, quantity));
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems((prev) => removeCartItem(prev, productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setPricing({
      discount: 0,
      shippingFee: 0,
      shippingLabel: 'Free',
      promoCode: '',
    });
  }, []);

  const setCartPricing = useCallback((next) => {
    setPricing((prev) => ({ ...prev, ...next }));
  }, []);

  const applyPromo = useCallback((code) => {
    const promoCode = String(code || '').trim();
    setPricing((prev) => ({ ...prev, promoCode }));
    // Backend: validate promo and set discount / shipping via setCartPricing
  }, []);

  const cartCount = useMemo(() => getCartCount(cartItems), [cartItems]);
  const totals = useMemo(
    () => getCartTotals(cartItems, pricing),
    [cartItems, pricing]
  );

  return {
    cartItems,
    cartCount,
    pricing,
    totals,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setCartPricing,
    applyPromo,
  };
};

export default useCart;

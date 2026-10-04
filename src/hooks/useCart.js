import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  addItemToCart,
  getCartCount,
  getCartTotals,
  loadCartFromStorage,
  removeCartItem,
  saveCartToStorage,
  updateCartItemQuantity,
} from '../features/cart/cartUtils';

// Browser-local cart (display estimate only). The backend cart requires an
// authenticated session, so nothing here is ever treated as an order.
export const useCart = () => {
  const [cartItems, setCartItems] = useState(() => loadCartFromStorage() ?? []);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => addItemToCart(prev, product));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setCartItems((prev) => updateCartItemQuantity(prev, productId, quantity));
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems((prev) => removeCartItem(prev, productId));
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = useMemo(() => getCartCount(cartItems), [cartItems]);
  const totals = useMemo(() => getCartTotals(cartItems), [cartItems]);

  return { cartItems, cartCount, totals, addToCart, updateQuantity, removeItem, clearCart };
};

export default useCart;

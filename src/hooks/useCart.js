import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import * as cartApi from '../services/api/cart';
import { toApiError } from '../services/api/errors';
import { clearDisplay, getCartCount, rememberDisplay, toCartView } from '../features/cart/cartUtils';

// Backend cart (authenticated). Every mutation resolves to the full backend cart,
// which is the single source of truth for items, prices and totals.
export const useCart = () => {
  const { status, isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return cartApi
      .getCart()
      .then((data) => setCart(toCartView(data.cart)))
      .catch((e) => setError(toApiError(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!isAuthenticated) {
      setCart(null);
      setError(null);
      setLoading(false);
      clearDisplay();
      return;
    }
    load();
  }, [status, isAuthenticated, load]);

  // Runs a mutation; returns { ok, error }.
  const mutate = useCallback(async (request, onDone) => {
    setBusy(true);
    try {
      const data = await request();
      setCart(toCartView(data.cart));
      onDone?.();
      return { ok: true };
    } catch (e) {
      return { ok: false, error: toApiError(e) };
    } finally {
      setBusy(false);
    }
  }, []);

  const addToCart = useCallback(
    (product) =>
      mutate(
        () =>
          cartApi.addCartItem({
            productVariantId: product.productVariantId,
            quantity: product.quantity,
            personalizationText: product.personalizationText,
          }),
        () => rememberDisplay(product.productVariantId, product)
      ),
    [mutate]
  );

  const updateQuantity = useCallback(
    (cartItemId, quantity) => mutate(() => cartApi.updateCartItem(cartItemId, quantity)),
    [mutate]
  );
  const removeItem = useCallback((cartItemId) => mutate(() => cartApi.removeCartItem(cartItemId)), [mutate]);
  const clearCart = useCallback(() => mutate(() => cartApi.clearCart()), [mutate]);

  const cartCount = useMemo(() => getCartCount(cart?.items), [cart]);

  return { cart, loading, error, busy, cartCount, reload: load, addToCart, updateQuantity, removeItem, clearCart };
};

export default useCart;

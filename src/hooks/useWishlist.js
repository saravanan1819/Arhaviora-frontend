import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import {
  addWishlistItem,
  listWishlist,
  removeWishlistItem,
} from '../services/api/wishlist';
import { getErrorMessage } from '../services/api/errors';

// Backend-backed wishlist (customer accounts only). Holds backend product UUIDs.
export const useWishlist = ({ onMessage } = {}) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [productIds, setProductIds] = useState([]);

  const canUse = isAuthenticated && isCustomer;

  useEffect(() => {
    if (!canUse) {
      setProductIds([]);
      return undefined;
    }
    let cancelled = false;
    listWishlist()
      .then((data) => {
        if (!cancelled) setProductIds((data.wishlistItems || []).map((item) => item.productId));
      })
      .catch((error) => {
        if (!cancelled) onMessage?.(getErrorMessage(error));
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUse]);

  // Returns false when the action could not be performed (e.g. signed out).
  const toggle = useCallback(
    async (productId, shouldAdd) => {
      if (!canUse) {
        onMessage?.(
          isAuthenticated
            ? 'Wishlists are available for customer accounts only.'
            : 'Please sign in to use your wishlist.'
        );
        return false;
      }
      try {
        if (shouldAdd) {
          await addWishlistItem(productId);
          setProductIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
          onMessage?.('Added item to your wishlist!');
        } else {
          await removeWishlistItem(productId);
          setProductIds((prev) => prev.filter((id) => id !== productId));
          onMessage?.('Removed item from your wishlist');
        }
        return true;
      } catch (error) {
        onMessage?.(getErrorMessage(error));
        return false;
      }
    },
    [canUse, isAuthenticated, onMessage]
  );

  return { productIds, toggle };
};

export default useWishlist;

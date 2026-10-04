import React from 'react';
import { Link } from 'react-router-dom';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';
import { useAuth } from '../../features/auth/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { listWishlist } from '../../services/api/wishlist';
import { formatPrice } from '../../features/catalogue/adapters';

// Backend list item: { id, productId, isAvailable, product: { name, slug, price } | null }
const WishlistList = () => {
  const state = useAsync(listWishlist, []);

  if (state.loading) return <StatusPanel>Loading your wishlist…</StatusPanel>;
  if (state.error) {
    return (
      <StatusPanel
        role="alert"
        title="We couldn't load your wishlist"
        actions={[{ label: 'Try again', onClick: state.reload }]}
      >
        {state.error.message}
      </StatusPanel>
    );
  }

  const items = state.data?.wishlistItems || [];
  if (items.length === 0) {
    return (
      <StatusPanel
        title="Your wishlist is empty"
        actions={[{ label: 'Continue Shopping', to: '/shop' }]}
      >
        Save products you love and they will appear here.
      </StatusPanel>
    );
  }

  return (
    <div className="status-panel">
      <h1 className="status-panel-title">Your wishlist</h1>
      <ul className="status-list">
        {items.map((item) => (
          <li key={item.id} className="status-list-item">
            {item.isAvailable && item.product ? (
              <>
                <Link to={`/product/${item.product.slug}`}>{item.product.name}</Link>
                <span className="status-list-meta">{formatPrice(item.product.price)}</span>
              </>
            ) : (
              <span className="status-list-meta">This product is no longer available</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const Wishlist = () => {
  const { status, isCustomer } = useAuth();

  let body;
  if (status === 'loading') {
    body = <StatusPanel>Loading…</StatusPanel>;
  } else if (status !== 'authenticated') {
    body = (
      <StatusPanel
        title="Sign in to see your wishlist"
        actions={[
          { label: 'Sign in', to: '/login', state: { from: '/wishlist' } },
          { label: 'Create an account', to: '/register', outline: true },
        ]}
      >
        Your wishlist is saved to your account.
      </StatusPanel>
    );
  } else if (!isCustomer) {
    body = (
      <StatusPanel title="Wishlists are for customer accounts">
        Please sign in with a customer account to use a wishlist.
      </StatusPanel>
    );
  } else {
    body = <WishlistList />;
  }

  return <div className="status-page">{body}</div>;
};

export default Wishlist;

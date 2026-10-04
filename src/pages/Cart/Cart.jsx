import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '../../components/Icons/Icons';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';
import { formatMoney, formatCartTitle, flatTitle } from '../../utils/currency';
import './Cart.css';

export const Cart = ({
  authStatus,
  cart,
  loading = false,
  error = null,
  busy = false,
  onReload,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const navigate = useNavigate();
  const handleProceedToCheckout = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
      return;
    }
    navigate('/checkout');
  };

  const cartItems = cart?.items || [];

  const breadcrumb = (
    <nav className="cart-breadcrumb" aria-label="breadcrumb">
      <Link to="/" className="cart-bc-link">Home</Link>
      <ChevronRightIcon size={14} className="cart-bc-chevron" />
      <Link to="/shop" className="cart-bc-link">Shop</Link>
      <ChevronRightIcon size={14} className="cart-bc-chevron" />
      <span className="cart-bc-active">Cart</span>
    </nav>
  );

  const stateView = (node) => (
    <div className="cart-page">
      {breadcrumb}
      <div className="status-page">{node}</div>
      <div className="cart-footer-separator" />
    </div>
  );

  if (authStatus === 'loading') return stateView(<StatusPanel>Loading…</StatusPanel>);
  if (authStatus !== 'authenticated') {
    return stateView(
      <StatusPanel
        title="Sign in to view your cart"
        actions={[
          { label: 'Sign in', to: '/login', state: { from: '/cart' } },
          { label: 'Continue Shopping', to: '/shop', outline: true },
        ]}
      >
        Your cart is saved to your account.
      </StatusPanel>
    );
  }
  if (loading && !cart) return stateView(<StatusPanel>Loading your cart…</StatusPanel>);
  if (error && !cart) {
    return stateView(
      <StatusPanel role="alert" title="We couldn't load your cart" actions={[{ label: 'Try again', onClick: onReload }]}>
        {error.message}
      </StatusPanel>
    );
  }
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        {breadcrumb}
        <div className="cart-empty">
          <p className="cart-empty-text">Your cart is empty.</p>
          <Link to="/shop" className="cart-empty-cta">Continue Shopping</Link>
        </div>
        <div className="cart-footer-separator" />
      </div>
    );
  }

  const firstItem = cartItems[0];
  const categoryLabel = firstItem?.category;
  const productHref = firstItem?.productSlug ? `/product/${firstItem.productSlug}` : '/shop';

  return (
    <div className="cart-page">
      <nav className="cart-breadcrumb" aria-label="breadcrumb">
        <Link to="/" className="cart-bc-link">Home</Link>
        <ChevronRightIcon size={14} className="cart-bc-chevron" />
        <Link to="/shop" className="cart-bc-link">Shop</Link>
        {categoryLabel ? (
          <>
            <ChevronRightIcon size={14} className="cart-bc-chevron" />
            <Link
              to={`/shop?category=${encodeURIComponent(categoryLabel)}`}
              className="cart-bc-link"
            >
              {categoryLabel}
            </Link>
          </>
        ) : null}
        {firstItem?.title ? (
          <>
            <ChevronRightIcon size={14} className="cart-bc-chevron" />
            <Link to={productHref} className="cart-bc-link">
              {flatTitle(firstItem.title)}
            </Link>
          </>
        ) : null}
        <ChevronRightIcon size={14} className="cart-bc-chevron" />
        <span className="cart-bc-active">Cart</span>
      </nav>

      <div className="cart-body">
        <section className="cart-table-card" aria-label="Cart items">
          <div className="cart-table-header">
            <span className="cart-col-product">PRODUCT</span>
            <span className="cart-col-qty">QUANTITY</span>
            <span className="cart-col-price">PRICE</span>
          </div>

          <ul className="cart-item-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item-row">
                <div className="cart-col-product cart-item-product">
                  <div className="cart-item-media">
                    <img
                      src={item.imageUrl}
                      alt={flatTitle(item.title)}
                      className="cart-item-thumb"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      className="cart-item-remove"
                      disabled={busy}
                      onClick={() => onRemoveItem?.(item.id)}
                    >
                      <img src="/assets/icons/trash.svg" alt="" width={12} height={12} />
                      <span className="cart-item-remove-text">Remove</span>
                    </button>
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-title">{formatCartTitle(item.title)}</p>
                    {item.option ? (
                      <p className="cart-item-meta cart-item-meta-color">
                        Option : <span>{item.option}</span>
                      </p>
                    ) : null}
                    {item.personalization ? (
                      <p className="cart-item-meta cart-item-meta-personalization">
                        Personalization : <span>{item.personalization}</span>
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="cart-col-qty">
                  <div
                    className="cart-qty-stepper"
                    role="group"
                    aria-label={`Quantity for ${item.title}`}
                  >
                    <button
                      type="button"
                      className="cart-qty-btn"
                      aria-label="Decrease quantity"
                      disabled={busy || item.quantity <= 1}
                      onClick={() =>
                        onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))
                      }
                    >
                      −
                    </button>
                    <span className="cart-qty-value" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      className="cart-qty-btn"
                      aria-label="Increase quantity"
                      disabled={busy}
                      onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-col-price">
                  <span className="cart-item-price">{formatMoney(item.unitPrice)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="cart-sidebar">
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">Order Summary</h2>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{formatMoney(cart.itemsSubtotal)}</span>
              </div>
              {cart.giftBoxCount > 0 && (
                <div className="cart-summary-row">
                  <span>Gift boxes</span>
                  <span>{formatMoney(cart.giftBoxesSubtotal)}</span>
                </div>
              )}
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span className="cart-total-value">{formatMoney(cart.total)}</span>
              </div>
            </div>

            <p role="note" style={{ fontSize: 13, color: '#7A7770', margin: '0 0 12px' }}>
              Shipping and the final total are confirmed at checkout.
            </p>

            <button
              type="button"
              className="cart-checkout-btn"
              disabled={busy}
              onClick={handleProceedToCheckout}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

        </aside>
      </div>

      <div className="cart-footer-separator" />
    </div>
  );
};

export default Cart;

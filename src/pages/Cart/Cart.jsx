import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '../../components/Icons/Icons';
import { formatINR, formatItemPrice, formatCartTitle, flatTitle } from '../../utils/currency';
import './Cart.css';

export const Cart = ({
  cartItems = [],
  totals = {},
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
}) => {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState(totals.promoCode || '');

  useEffect(() => {
    setPromoCode(totals.promoCode || '');
  }, [totals.promoCode]);

  const {
    subtotal = 0,
    discount = 0,
    shippingLabel = 'Free',
    total = 0,
  } = totals;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    onApplyPromo?.(promoCode.trim());
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <nav className="cart-breadcrumb" aria-label="breadcrumb">
          <Link to="/" className="cart-bc-link">Home</Link>
          <ChevronRightIcon size={14} className="cart-bc-chevron" />
          <Link to="/shop" className="cart-bc-link">Shop</Link>
          <ChevronRightIcon size={14} className="cart-bc-chevron" />
          <span className="cart-bc-active">Cart</span>
        </nav>
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
  const productHref = `/product/${firstItem?.productId || firstItem?.id}`;

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
                      onClick={() => onRemoveItem?.(item.id)}
                    >
                      <img src="/assets/icons/trash.svg" alt="" width={12} height={12} />
                      <span className="cart-item-remove-text">Remove</span>
                    </button>
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-title">{formatCartTitle(item.title)}</p>
                    {item.color ? (
                      <p className="cart-item-meta cart-item-meta-color">
                        Color : <span>{item.color}</span>
                      </p>
                    ) : null}
                    {item.name ? (
                      <p className="cart-item-meta cart-item-meta-personalization">
                        Personalization : <span>{item.name}</span>
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
                      disabled={item.quantity <= 1}
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
                      onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-col-price">
                  <span className="cart-item-price">{formatItemPrice(item.price)}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <aside className="cart-sidebar">
          <div className="cart-summary-card">
            <h2 className="cart-summary-title">Order Summary</h2>

            <form className="cart-promo-form" onSubmit={handleApplyPromo}>
              <label className="cart-promo-label" htmlFor="cart-promo">
                Discount code / Promo code
              </label>
              <input
                id="cart-promo"
                className="cart-promo-input"
                type="text"
                name="promoCode"
                placeholder="Code"
                autoComplete="off"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
            </form>

            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{formatINR(subtotal)}</span>
              </div>
              <div className="cart-summary-row cart-summary-row-muted">
                <span>Shipping</span>
                <span className="cart-shipping-free">
                  {typeof shippingLabel === 'number'
                    ? formatINR(shippingLabel)
                    : shippingLabel}
                </span>
              </div>
              {discount > 0 ? (
                <div className="cart-summary-row cart-summary-row-muted">
                  <span>Discount</span>
                  <span className="cart-discount">-{formatINR(discount)}</span>
                </div>
              ) : null}
              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span className="cart-total-value">{formatINR(total)}</span>
              </div>
            </div>

            <button
              type="button"
              className="cart-checkout-btn"
              onClick={() =>
                navigate('/checkout', {
                  state: { cartItems, promoCode, totals },
                })
              }
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

          <div className="cart-secure-card">
            <h3 className="cart-secure-title">100% Secure Checkout</h3>
            <p className="cart-secure-text">
              Your payment information is safe with us. We use industry-standard encryption.
            </p>
            <div className="cart-secure-badges">
              <span className="cart-secure-badge">
                <img src="/assets/icons/SSL_lock.svg" alt="" width={14} height={14} />
                SSL SECURIED
              </span>
              <span className="cart-secure-badge">
                <img src="/assets/icons/safe-paymet.svg" alt="" width={14} height={14} />
                SAFE PAYMENTS
              </span>
            </div>
          </div>
        </aside>
      </div>

      <div className="cart-footer-separator" />
    </div>
  );
};

export default Cart;

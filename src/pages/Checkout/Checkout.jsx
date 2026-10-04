import React from 'react';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';
import { AddressManager } from '../../components/AddressManager/AddressManager';
import { useAsync } from '../../hooks/useAsync';
import { getCheckoutSummary } from '../../services/api/checkout';
import { formatMoney } from '../../utils/currency';
import { CHECKOUT_STEP } from '../../features/checkout/checkoutUtils';
import './Checkout.css';

const CheckoutStepper = ({ steps, activeStep = 1 }) => (
  <nav className="checkout-stepper" aria-label="Checkout progress">
    <div className="checkout-stepper-inner">
      <ol className="checkout-stepper-track">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep;
          const isComplete = step.id < activeStep;

          return (
            <React.Fragment key={step.id}>
              <li
                className={`checkout-step ${isActive ? 'is-active' : ''} ${isComplete ? 'is-complete' : ''}`}
              >
                <span className="checkout-step-marker" aria-hidden="true">
                  <span className="checkout-step-number">{step.id}</span>
                </span>
                <span className="checkout-step-label">{step.label}</span>
              </li>
              {index < steps.length - 1 ? (
                <li
                  className={`checkout-step-connector ${index < activeStep - 1 ? 'is-after-active' : ''}`}
                  aria-hidden="true"
                >
                  <span className="checkout-step-line" />
                  <span className="checkout-step-dot" />
                </li>
              ) : null}
            </React.Fragment>
          );
        })}
      </ol>
    </div>
    <div className="checkout-stepper-rule" aria-hidden="true" />
  </nav>
);

const UNAVAILABLE_TEXT = {
  inactive_product: 'No longer available',
  inactive_variant: 'No longer available',
  variant_unavailable: 'No longer available',
  inventory_unavailable: 'Out of stock',
  insufficient_stock: 'Not enough stock',
};

const hasAmount = (value) => Number(value) > 0;

// Backend-authoritative summary for the real cart and the chosen shipping address.
const SummaryStep = ({ cartId, address, onChangeAddress }) => {
  const state = useAsync(
    () => getCheckoutSummary({ cartId, shippingAddressId: address.id }),
    [cartId, address.id]
  );

  if (state.loading) return <StatusPanel>Loading your order summary…</StatusPanel>;
  if (state.error) {
    return (
      <StatusPanel
        role="alert"
        title="We couldn't load your order summary"
        actions={[
          { label: 'Try again', onClick: state.reload },
          { label: 'Change address', onClick: onChangeAddress, outline: true },
        ]}
      >
        {state.error.message}
      </StatusPanel>
    );
  }

  const summary = state.data;
  const addressLine = [address.line1, address.line2, address.city, address.state, address.postalCode]
    .filter(Boolean)
    .join(', ');

  return (
    <section className="checkout-summary-panel" aria-labelledby="checkout-summary-heading">
      <h1 id="checkout-summary-heading" className="checkout-summary-heading">Order Summary</h1>

      <div className="checkout-summary-card checkout-delivery-card">
        <div className="checkout-delivery-header">
          <span className="checkout-card-label">Delivery Address</span>
          <button type="button" className="checkout-delivery-edit-btn" onClick={onChangeAddress} aria-label="Change delivery address">
            <img src="/assets/icons/address-edit.svg" alt="" width={18} height={18} />
          </button>
        </div>
        <div className="checkout-delivery-body">
          <p className="checkout-delivery-name">{address.fullName}</p>
          {address.phone && <p className="checkout-delivery-line">{address.phone}</p>}
          <p className="checkout-delivery-line">{addressLine}</p>
        </div>
      </div>

      <div className="checkout-summary-card checkout-items-card">
        <ul className="checkout-item-list">
          {summary.items.map((item, index) => (
            <li key={item.id} className={`checkout-item-row ${index < summary.items.length - 1 ? 'has-divider' : ''}`}>
              <div className="checkout-item-content">
                <p className="checkout-item-title">{item.productNameSnapshot}</p>
                {!item.available && (
                  <p className="checkout-item-meta" role="alert">
                    {UNAVAILABLE_TEXT[item.reason] || 'Unavailable'}
                  </p>
                )}
              </div>
              <div className="checkout-item-qty-price">
                <span className="checkout-item-qty">Qty : {item.quantity}</span>
                <span className="checkout-item-price">{formatMoney(item.lineTotal)}</span>
              </div>
            </li>
          ))}
        </ul>
        {summary.giftBoxes?.length > 0 && (
          <p className="checkout-item-meta">Includes {summary.giftBoxes.length} gift box{summary.giftBoxes.length > 1 ? 'es' : ''}.</p>
        )}
      </div>

      <div className="checkout-summary-card checkout-totals-card">
        <div className="checkout-totals-rows">
          <div className="checkout-totals-row checkout-totals-subtotal">
            <span>Subtotal</span>
            <span>{formatMoney(summary.subtotal)}</span>
          </div>
          <div className="checkout-totals-row">
            <span>Shipping</span>
            <span>{hasAmount(summary.shippingFee) ? formatMoney(summary.shippingFee) : 'Free'}</span>
          </div>
          {hasAmount(summary.taxAmount) && (
            <div className="checkout-totals-row">
              <span>Tax</span>
              <span>{formatMoney(summary.taxAmount)}</span>
            </div>
          )}
          {hasAmount(summary.discountAmount) && (
            <div className="checkout-totals-row">
              <span>Discount</span>
              <span className="checkout-discount-value">-{formatMoney(summary.discountAmount)}</span>
            </div>
          )}
        </div>
        <div className="checkout-totals-row checkout-totals-final">
          <span>Total</span>
          <span className="checkout-total-value">{formatMoney(summary.totalAmount)}</span>
        </div>
        <button type="button" className="checkout-continue-btn" disabled>
          PLACE ORDER
        </button>
        <p className="checkout-payment-unavailable" role="status" style={{ marginTop: 12, fontSize: 13, color: '#7A7770' }}>
          Order placement isn&apos;t available yet. Nothing has been ordered or charged.
        </p>
      </div>
    </section>
  );
};

export const Checkout = ({
  steps = [],
  activeStep = CHECKOUT_STEP.ADDRESS,
  authStatus,
  cart,
  cartLoading,
  cartError,
  onReloadCart,
  selectedAddressId,
  selectedAddress,
  onSelectAddress,
  onAddressesLoaded,
  onContinue,
  onChangeAddress,
}) => {
  let body;
  if (authStatus === 'loading') {
    body = <StatusPanel>Loading…</StatusPanel>;
  } else if (authStatus !== 'authenticated') {
    body = (
      <StatusPanel
        title="Sign in to continue"
        actions={[
          { label: 'Sign in', to: '/login', state: { from: '/checkout' } },
          { label: 'Back to Cart', to: '/cart', outline: true },
        ]}
      >
        Checkout needs an account.
      </StatusPanel>
    );
  } else if (cartLoading && !cart) {
    body = <StatusPanel>Loading your cart…</StatusPanel>;
  } else if (cartError && !cart) {
    body = (
      <StatusPanel role="alert" title="We couldn't load your cart" actions={[{ label: 'Try again', onClick: onReloadCart }]}>
        {cartError.message}
      </StatusPanel>
    );
  } else if (!cart || cart.items.length === 0) {
    body = (
      <StatusPanel title="Your cart is empty" actions={[{ label: 'Continue Shopping', to: '/shop' }]}>
        Add something to your cart to begin checkout.
      </StatusPanel>
    );
  } else if (activeStep === CHECKOUT_STEP.ORDER_SUMMARY && selectedAddress) {
    body = <SummaryStep cartId={cart.id} address={selectedAddress} onChangeAddress={onChangeAddress} />;
  } else {
    body = (
      <section className="checkout-address-panel" aria-labelledby="checkout-address-heading">
        <h1 id="checkout-address-heading" className="checkout-address-heading">Select Address</h1>
        <AddressManager
          selectable
          selectedId={selectedAddressId}
          onSelect={onSelectAddress}
          onLoaded={onAddressesLoaded}
        />
        <div className="status-panel-actions" style={{ marginTop: 24 }}>
          <button type="button" className="status-panel-cta" disabled={!selectedAddress} onClick={onContinue}>
            Continue to Order Summary
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="checkout-page">
      <CheckoutStepper steps={steps} activeStep={activeStep} />
      <div className="checkout-body">{body}</div>
      <div className="checkout-footer-separator" />
    </div>
  );
};

export default Checkout;

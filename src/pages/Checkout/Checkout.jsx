import React from 'react';
import {
  CHECKOUT_STEP,
  PAYMENT_OPTIONS,
  getPaymentMethodOption,
} from '../../features/checkout/checkoutUtils';
import { getAddressCardDisplay, formatDeliveryAddressSummary } from '../../features/checkout/addressUtils';
import { formatINR, formatItemPrice, formatCartTitle, flatTitle } from '../../utils/currency';
import './Checkout.css';

const AddressCard = ({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const display = getAddressCardDisplay(address);

  return (
    <article
      className={`checkout-address-card ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect(address.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(address.id);
        }
      }}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
    >
      <div className="checkout-address-card-row">
        <div className="checkout-address-radio-wrap">
          {isSelected ? (
            <img
              src="/assets/icons/radio.svg"
              alt=""
              className="checkout-address-radio"
              width={24}
              height={24}
            />
          ) : (
            <span className="checkout-address-radio checkout-address-radio-empty" aria-hidden="true" />
          )}
        </div>

        <div className="checkout-address-content">
          <div className="checkout-address-card-top">
            <div className="checkout-address-name-row">
              <span className="checkout-address-name">{display.fullName}</span>
              <span className="checkout-address-badge">{display.label}</span>
            </div>
          </div>

          {display.streetLine ? (
            <p className="checkout-address-line">{display.streetLine}</p>
          ) : null}
          {display.phone ? (
            <p className="checkout-address-phone">{display.phone}</p>
          ) : null}
        </div>

        <div className="checkout-address-actions">
          <button
            type="button"
            className="checkout-address-action-btn"
            aria-label={`Edit ${display.label} address`}
            onClick={(event) => {
              event.stopPropagation();
              onEdit(address.id);
            }}
          >
            <img src="/assets/icons/address-edit.svg" alt="" width={18} height={18} />
          </button>
          <button
            type="button"
            className="checkout-address-action-btn"
            aria-label={`Delete ${display.label} address`}
            onClick={(event) => {
              event.stopPropagation();
              onDelete(address.id);
            }}
          >
            <img src="/assets/icons/close.svg" alt="" width={18} height={18} />
          </button>
        </div>
      </div>
    </article>
  );
};

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

const AddressStep = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onDeleteAddress,
  onRequestAddAddress,
  onRequestEditAddress,
}) => (
  <section className="checkout-address-panel" aria-labelledby="checkout-address-heading">
    <h1 id="checkout-address-heading" className="checkout-address-heading">
      Select Address
    </h1>

    <div className="checkout-address-list" role="radiogroup" aria-label="Saved addresses">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={selectedAddressId === address.id}
          onSelect={onSelectAddress}
          onEdit={onRequestEditAddress}
          onDelete={onDeleteAddress}
        />
      ))}
    </div>

    <div className="checkout-add-address-wrap">
      <div className="checkout-add-address-line">
        <button
          type="button"
          className="checkout-add-address-btn"
          onClick={onRequestAddAddress}
          aria-label="Add New Address"
        >
          <img
            src="/assets/icons/add-address-plus-circle.svg"
            alt=""
            width={22}
            height={22}
          />
        </button>
      </div>
      <span className="checkout-add-address-label">Add New Address</span>
    </div>
  </section>
);

const OrderItemsList = ({ items = [] }) => (
  <ul className="checkout-item-list">
    {items.map((item, index) => (
      <li
        key={item.id}
        className={`checkout-item-row ${index < items.length - 1 ? 'has-divider' : ''}`}
      >
        <div className="checkout-item-media">
          <img
            src={item.imageUrl}
            alt={flatTitle(item.title)}
            className="checkout-item-thumb"
            loading="lazy"
          />
        </div>
        <div className="checkout-item-content">
          <p className="checkout-item-title">{formatCartTitle(item.title)}</p>
          {item.color ? (
            <p className="checkout-item-meta checkout-item-meta-color">
              Color : <span>{item.color}</span>
            </p>
          ) : null}
          {item.name ? (
            <p className="checkout-item-meta checkout-item-meta-personalization">
              Personalization : <span>{item.name}</span>
            </p>
          ) : null}
        </div>
        <div className="checkout-item-qty-price">
          <span className="checkout-item-qty">Qty : {item.quantity}</span>
          <span className="checkout-item-price">{formatItemPrice(item.price)}</span>
        </div>
      </li>
    ))}
  </ul>
);

const OrderSummaryStep = ({
  selectedAddress,
  paymentMethod,
  cartItems = [],
  totals = {},
  onSelectPaymentMethod,
  onGoToAddressStep,
  onConfirmOrderSummary,
  canProceedToPayment,
}) => {
  const {
    subtotal = 0,
    discount = 0,
    shippingLabel = 'Free',
    total = 0,
  } = totals;

  const display = selectedAddress ? getAddressCardDisplay(selectedAddress) : null;
  const addressSummary = selectedAddress
    ? formatDeliveryAddressSummary(selectedAddress)
    : '';

  return (
    <section className="checkout-summary-panel" aria-labelledby="checkout-summary-heading">
      <h1 id="checkout-summary-heading" className="checkout-summary-heading">
        Order Summary
      </h1>

      <div className="checkout-summary-card checkout-delivery-card">
        <div className="checkout-delivery-header">
          <span className="checkout-card-label">Delivery Address</span>
          <button
            type="button"
            className="checkout-delivery-edit-btn"
            onClick={onGoToAddressStep}
            aria-label="Edit delivery address"
          >
            <img src="/assets/icons/address-edit.svg" alt="" width={18} height={18} />
          </button>
        </div>
        {display ? (
          <div className="checkout-delivery-body">
            <p className="checkout-delivery-name">{display.fullName}</p>
            {display.phone ? (
              <p className="checkout-delivery-line">{display.phone}</p>
            ) : null}
            {addressSummary ? (
              <p className="checkout-delivery-line">{addressSummary}</p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="checkout-summary-card checkout-payment-card">
        <span className="checkout-card-label">Select Payment Method</span>
        <div className="checkout-payment-options" role="radiogroup" aria-label="Payment method">
          {PAYMENT_OPTIONS.map((option) => {
            const isSelected = paymentMethod === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`checkout-payment-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectPaymentMethod(option.id)}
              >
                {isSelected ? (
                  <span className="checkout-payment-radio" aria-hidden="true" />
                ) : null}
                <img
                  src={isSelected ? option.iconSelected : option.icon}
                  alt=""
                  className={`checkout-payment-icon checkout-payment-icon--${option.id}`}
                  width={14}
                  height={14}
                />
                <span className="checkout-payment-label">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="checkout-summary-card checkout-items-card">
        <OrderItemsList items={cartItems} />
      </div>

      <div className="checkout-summary-card checkout-totals-card">
        <div className="checkout-totals-rows">
          <div className="checkout-totals-row checkout-totals-subtotal">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="checkout-totals-row">
            <span>Shipping</span>
            <span className="checkout-shipping-free">{shippingLabel}</span>
          </div>
          {discount > 0 ? (
            <div className="checkout-totals-row">
              <span>Discount</span>
              <span className="checkout-discount-value">-{formatINR(discount)}</span>
            </div>
          ) : null}
        </div>
        <div className="checkout-totals-row checkout-totals-final">
          <span>Total</span>
          <span className="checkout-total-value">{formatINR(total)}</span>
        </div>
        <button
          type="button"
          className="checkout-continue-btn"
          disabled={!canProceedToPayment}
          onClick={onConfirmOrderSummary}
        >
          CONTINUE TO PAYMENT
        </button>
      </div>
    </section>
  );
};

const ConfirmationStep = ({
  placedOrder,
  onCopyOrderId,
  onDownloadInvoice,
  onContinueShopping,
  onTrackOrder,
  onBeginNewCheckout,
}) => {
  if (!placedOrder) {
    return (
      <section className="checkout-confirm-panel">
        <p className="checkout-confirm-empty">No order found. Please complete checkout again.</p>
        {onBeginNewCheckout ? (
          <div className="checkout-confirm-actions">
            <button
              type="button"
              className="checkout-confirm-btn checkout-confirm-btn-primary"
              onClick={onBeginNewCheckout}
            >
              Back to Address
            </button>
          </div>
        ) : null}
      </section>
    );
  }

  const {
    orderId,
    orderDate,
    customerName,
    phone,
    addressLabel,
    addressLine,
    items = [],
    totals = {},
    paymentMethod,
    paymentLabel,
  } = placedOrder;

  const {
    subtotal = 0,
    discount = 0,
    shippingLabel = 'Free',
    total = 0,
  } = totals;

  const paymentOption = getPaymentMethodOption(paymentMethod);
  const labelDisplay = addressLabel
    ? addressLabel.charAt(0) + addressLabel.slice(1).toLowerCase()
    : 'Home';

  return (
    <section className="checkout-confirm-panel" aria-labelledby="checkout-confirm-heading">
      <div className="checkout-confirm-success">
        <img
          src="/assets/icons/verified_icon.svg"
          alt=""
          className="checkout-confirm-success-icon"
          width={72}
          height={72}
        />
        <h1 id="checkout-confirm-heading" className="checkout-confirm-heading">
          Thank you, {customerName || 'there'} !
        </h1>
        <p className="checkout-confirm-subtext">Your order has been placed successfully.</p>
      </div>

      <div className="checkout-confirm-meta">
        <div className="checkout-confirm-meta-item">
          <span>Order ID : {orderId?.replace(/^ST-ORD-/, 'ST-ORD- ')}</span>
          <button
            type="button"
            className="checkout-confirm-copy-btn"
            onClick={onCopyOrderId}
            aria-label="Copy order ID"
          >
            <img src="/assets/icons/copy.svg" alt="" width={20} height={20} />
          </button>
        </div>
        <div className="checkout-confirm-meta-item">
          <span>Order Date : {orderDate}</span>
        </div>
      </div>

      <div className="checkout-summary-card checkout-confirm-items-card">
        <OrderItemsList items={items} />
      </div>

      <div className="checkout-summary-card checkout-confirm-delivery-card">
        <span className="checkout-card-label">Delivery Details</span>
        <div className="checkout-confirm-delivery-rows">
          <div className="checkout-confirm-delivery-row">
            <img
              src="/assets/icons/address-truck.svg"
              alt=""
              className="checkout-confirm-delivery-icon"
              width={40}
              height={40}
            />
            <p className="checkout-confirm-delivery-text">
              <span className="checkout-confirm-delivery-label">{labelDisplay} -</span>{' '}
              <span className="checkout-confirm-delivery-value">{addressLine}</span>
            </p>
          </div>
          <div className="checkout-confirm-delivery-row">
            <img
              src="/assets/icons/avatar.svg"
              alt=""
              className="checkout-confirm-delivery-icon"
              width={40}
              height={40}
            />
            <p className="checkout-confirm-delivery-text">
              <span className="checkout-confirm-delivery-label">{customerName}{phone ? ' -' : ''}</span>
              {phone ? (
                <>
                  {' '}
                  <span className="checkout-confirm-delivery-value">{phone}</span>
                </>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <div className="checkout-summary-card checkout-confirm-price-card">
        <span className="checkout-card-label">Price Details</span>
        <div className="checkout-totals-rows">
          <div className="checkout-totals-row checkout-totals-subtotal">
            <span>Subtotal</span>
            <span>{formatINR(subtotal)}</span>
          </div>
          <div className="checkout-totals-row">
            <span>Shipping</span>
            <span className="checkout-shipping-free">{shippingLabel}</span>
          </div>
          {discount > 0 ? (
            <div className="checkout-totals-row">
              <span>Discount</span>
              <span className="checkout-discount-value">-{formatINR(discount)}</span>
            </div>
          ) : null}
        </div>
        <div className="checkout-totals-row checkout-totals-final">
          <span>Total</span>
          <span className="checkout-total-value">{formatINR(total)}</span>
        </div>

        <div className="checkout-confirm-payment-box">
          <span className="checkout-confirm-payment-label">Payment Method</span>
          <span className="checkout-confirm-payment-value">
            <img
              src={paymentOption.icon}
              alt=""
              width={18}
              height={18}
            />
            {paymentLabel}
          </span>
        </div>

        <button
          type="button"
          className="checkout-continue-btn checkout-confirm-download-btn"
          onClick={onDownloadInvoice}
        >
          <img src="/assets/icons/download.svg" alt="" width={18} height={18} />
          Download Invoice
        </button>
      </div>

      <div className="checkout-confirm-actions">
        <button
          type="button"
          className="checkout-confirm-btn checkout-confirm-btn-primary"
          onClick={onContinueShopping}
        >
          Continue Shopping
          <span className="checkout-confirm-btn-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2.5 7H11.5M11.5 7L7.5 3M11.5 7L7.5 11"
                stroke="#D44D60"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="checkout-confirm-btn checkout-confirm-btn-outline"
          onClick={onTrackOrder}
        >
          Track Your Order
        </button>
      </div>
    </section>
  );
};

export const Checkout = ({
  steps = [],
  activeStep = CHECKOUT_STEP.ADDRESS,
  addresses = [],
  selectedAddressId,
  selectedAddress,
  paymentMethod,
  cartItems = [],
  totals = {},
  placedOrder,
  onSelectAddress,
  onDeleteAddress,
  onRequestAddAddress,
  onRequestEditAddress,
  onSelectPaymentMethod,
  onGoToAddressStep,
  onConfirmOrderSummary,
  canProceedToPayment = false,
  onCopyOrderId,
  onDownloadInvoice,
  onContinueShopping,
  onTrackOrder,
  onBeginNewCheckout,
}) => (
  <div className="checkout-page">
    <CheckoutStepper steps={steps} activeStep={activeStep} />

    <div className="checkout-body">
      {activeStep === CHECKOUT_STEP.ADDRESS ? (
        <AddressStep
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={onSelectAddress}
          onDeleteAddress={onDeleteAddress}
          onRequestAddAddress={onRequestAddAddress}
          onRequestEditAddress={onRequestEditAddress}
        />
      ) : null}

      {activeStep === CHECKOUT_STEP.ORDER_SUMMARY ? (
        <OrderSummaryStep
          selectedAddress={selectedAddress}
          paymentMethod={paymentMethod}
          cartItems={cartItems}
          totals={totals}
          onSelectPaymentMethod={onSelectPaymentMethod}
          onGoToAddressStep={onGoToAddressStep}
          onConfirmOrderSummary={onConfirmOrderSummary}
          canProceedToPayment={canProceedToPayment}
        />
      ) : null}

      {activeStep === CHECKOUT_STEP.CONFIRMATION ? (
        <ConfirmationStep
          placedOrder={placedOrder}
          onCopyOrderId={onCopyOrderId}
          onDownloadInvoice={onDownloadInvoice}
          onContinueShopping={onContinueShopping}
          onTrackOrder={onTrackOrder}
          onBeginNewCheckout={onBeginNewCheckout}
        />
      ) : null}
    </div>

    {activeStep === CHECKOUT_STEP.ADDRESS ? (
      <div className="checkout-footer-separator" />
    ) : null}
  </div>
);

export default Checkout;

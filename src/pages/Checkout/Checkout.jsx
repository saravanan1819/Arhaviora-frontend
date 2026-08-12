import React from 'react';
import { CHECKOUT_STEP, PAYMENT_OPTIONS } from '../../features/checkout/checkoutUtils';
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
        <ul className="checkout-item-list">
          {cartItems.map((item, index) => (
            <li
              key={item.id}
              className={`checkout-item-row ${index < cartItems.length - 1 ? 'has-divider' : ''}`}
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

export const Checkout = ({
  steps = [],
  activeStep = CHECKOUT_STEP.ADDRESS,
  addresses = [],
  selectedAddressId,
  selectedAddress,
  paymentMethod,
  cartItems = [],
  totals = {},
  onSelectAddress,
  onDeleteAddress,
  onRequestAddAddress,
  onRequestEditAddress,
  onSelectPaymentMethod,
  onGoToAddressStep,
  onConfirmOrderSummary,
  canProceedToPayment = false,
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
    </div>

    {activeStep === CHECKOUT_STEP.ADDRESS ? (
      <div className="checkout-footer-separator" />
    ) : null}
  </div>
);

export default Checkout;

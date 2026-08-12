import React from 'react';
import { getAddressCardDisplay } from '../../features/checkout/addressUtils';
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

          return (
            <React.Fragment key={step.id}>
              <li className={`checkout-step ${isActive ? 'is-active' : ''}`}>
                <span className="checkout-step-marker" aria-hidden="true">
                  <span className="checkout-step-number">{step.id}</span>
                </span>
                <span className="checkout-step-label">{step.label}</span>
              </li>
              {index < steps.length - 1 ? (
                <li
                  className={`checkout-step-connector ${index === 0 ? 'is-after-active' : ''}`}
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

export const Checkout = ({
  steps = [],
  activeStep = 1,
  addresses = [],
  selectedAddressId,
  onSelectAddress,
  onDeleteAddress,
  onRequestAddAddress,
  onRequestEditAddress,
}) => (
  <div className="checkout-page">
    <CheckoutStepper steps={steps} activeStep={activeStep} />

    <div className="checkout-body">
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
    </div>

    <div className="checkout-footer-separator" />
  </div>
);

export default Checkout;

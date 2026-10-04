import React from 'react';
import { StatusPanel } from '../../components/StatusPanel/StatusPanel';
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

// Saved addresses and order placement need an authenticated backend session and
// an order API that are not available yet, so this step only reports state.
const AddressStep = ({ authStatus }) => {
  if (authStatus === 'loading') {
    return <StatusPanel>Loading…</StatusPanel>;
  }
  if (authStatus !== 'authenticated') {
    return (
      <StatusPanel
        title="Sign in to continue"
        actions={[
          { label: 'Sign in', to: '/login', state: { from: '/checkout' } },
          { label: 'Back to Cart', to: '/cart', outline: true },
        ]}
      >
        Delivery addresses and order placement need an account.
      </StatusPanel>
    );
  }
  return (
    <StatusPanel
      title="Online ordering isn't available yet"
      actions={[{ label: 'Back to Cart', to: '/cart', outline: true }]}
    >
      Saved addresses and order placement are not available yet. Your cart is kept, and nothing has been ordered or charged.
    </StatusPanel>
  );
};

export const Checkout = ({ steps = [], activeStep = CHECKOUT_STEP.ADDRESS, authStatus, cartItems = [] }) => (
  <div className="checkout-page">
    <CheckoutStepper steps={steps} activeStep={activeStep} />

    <div className="checkout-body">
      {cartItems.length === 0 ? (
        <StatusPanel
          title="Your cart is empty"
          actions={[{ label: 'Continue Shopping', to: '/shop' }]}
        >
          Add something to your cart to begin checkout.
        </StatusPanel>
      ) : (
        <AddressStep authStatus={authStatus} />
      )}
    </div>

    <div className="checkout-footer-separator" />
  </div>
);

export default Checkout;

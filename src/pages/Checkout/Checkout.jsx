import React from 'react';
import './Checkout.css';

export const Checkout = () => {
  return (
    <div className="checkout-page container-1440" style={{ padding: '60px 80px', minHeight: '60vh' }}>
      <h1 className="heading-h2">Multi-Step Checkout</h1>
      <p className="body-lead" style={{ marginTop: '12px' }}>Address, Order Summary & Payment.</p>
    </div>
  );
};

export default Checkout;

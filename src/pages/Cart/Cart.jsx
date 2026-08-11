import React from 'react';
import './Cart.css';

export const Cart = () => {
  return (
    <div className="cart-page container-1440" style={{ padding: '60px 80px', minHeight: '60vh' }}>
      <h1 className="heading-h2">Shopping Cart</h1>
      <p className="body-lead" style={{ marginTop: '12px' }}>Review your personalized items and proceed to checkout.</p>
    </div>
  );
};

export default Cart;

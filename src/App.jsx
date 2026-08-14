import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Shop } from './pages/Shop/Shop';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import { Cart } from './pages/Cart/Cart';
import { Checkout } from './pages/Checkout/Checkout';
import { useCart } from './hooks/useCart';
import { useCheckout } from './hooks/useCheckout';
import { CHECKOUT_STEPS, CHECKOUT_STEP } from './features/checkout/checkoutUtils';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    totals,
    addToCart,
    updateQuantity,
    removeItem,
    applyPromo,
    clearCart,
  } = useCart();

  const {
    addresses,
    selectedAddressId,
    selectedAddress,
    currentStep,
    paymentMethod,
    placedOrder,
    selectAddress,
    deleteAddress,
    requestAddAddress,
    requestEditAddress,
    goToAddressStep,
    beginNewCheckout,
    selectPaymentMethod,
    confirmOrderSummaryStep,
    canProceedToPayment,
    copyOrderId,
  } = useCheckout();

  const [wishlist, setWishlist] = useState(['1', '3']);
  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast(`"${product.title}" added to your cart!`);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    showToast('Item removed from cart');
  };

  const handleToggleWishlist = (productId, isAdded) => {
    setWishlist((prev) =>
      isAdded ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
    showToast(isAdded ? 'Added item to your wishlist!' : 'Removed item from your wishlist');
  };

  const handleConfirmOrderSummary = () => {
    const placed = confirmOrderSummaryStep(cartItems, totals);
    if (placed) {
      clearCart();
    }
  };

  const handleCopyOrderId = async () => {
    const ok = await copyOrderId();
    showToast(ok ? 'Order ID copied' : 'Could not copy Order ID');
  };

  const handleDownloadInvoice = () => {
    showToast('Invoice download coming soon');
  };

  const handleContinueShopping = () => {
    beginNewCheckout();
    navigate('/shop');
  };

  const handleTrackOrder = () => {
    showToast('Order tracking coming soon');
  };

  const handleProceedToCheckout = () => {
    goToAddressStep();
    navigate('/checkout');
  };

  const hideFooter =
    location.pathname === '/checkout' &&
    (currentStep === CHECKOUT_STEP.ORDER_SUMMARY ||
      currentStep === CHECKOUT_STEP.CONFIRMATION);

  return (
    <div className="app-container">
      {notification && (
        <div
          className="app-toast"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#2E2B28',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            zIndex: 9999,
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <span>{notification}</span>
        </div>
      )}

      <Navbar cartCount={cartCount} wishlistCount={wishlist.length} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={<Home onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />}
          />
          <Route
            path="/shop"
            element={
              <Shop
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            }
          />
          <Route 
            path="/product/:id" 
            element={<ProductDetails onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />} 
          />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                totals={totals}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={handleRemoveItem}
                onApplyPromo={applyPromo}
                onProceedToCheckout={handleProceedToCheckout}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                steps={CHECKOUT_STEPS}
                activeStep={currentStep || CHECKOUT_STEP.ADDRESS}
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                selectedAddress={selectedAddress}
                paymentMethod={paymentMethod}
                cartItems={cartItems}
                totals={totals}
                placedOrder={placedOrder}
                onSelectAddress={selectAddress}
                onDeleteAddress={deleteAddress}
                onRequestAddAddress={requestAddAddress}
                onRequestEditAddress={requestEditAddress}
                onSelectPaymentMethod={selectPaymentMethod}
                onGoToAddressStep={goToAddressStep}
                onConfirmOrderSummary={handleConfirmOrderSummary}
                canProceedToPayment={canProceedToPayment(cartItems)}
                onCopyOrderId={handleCopyOrderId}
                onDownloadInvoice={handleDownloadInvoice}
                onContinueShopping={handleContinueShopping}
                onTrackOrder={handleTrackOrder}
                onBeginNewCheckout={beginNewCheckout}
              />
            }
          />
        </Routes>
      </main>

      {hideFooter ? null : <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

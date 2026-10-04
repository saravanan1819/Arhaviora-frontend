import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Shop } from './pages/Shop/Shop';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import { Cart } from './pages/Cart/Cart';
import { Checkout } from './pages/Checkout/Checkout';
import { useCart } from './hooks/useCart';
import { useCheckout } from './hooks/useCheckout';
import { CHECKOUT_STEPS } from './features/checkout/checkoutUtils';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { NotFound } from './pages/NotFound/NotFound';
import { Wishlist } from './pages/Wishlist/Wishlist';
import { Account } from './pages/Account/Account';
import { useWishlist } from './hooks/useWishlist';

function AppLayout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    totals,
    addToCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const { currentStep, goToAddressStep } = useCheckout();
  const { status: authStatus, isAuthenticated } = useAuth();

  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const { productIds: wishlist, toggle: toggleWishlist } = useWishlist({ onMessage: showToast });

  // Only variant-backed lines (from the product page) can be added.
  const handleAddToCart = (product) => {
    if (!product?.productVariantId) return;
    addToCart(product);
    showToast(`"${product.title}" added to your cart!`);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
    showToast('Item removed from cart');
  };

  const handleToggleWishlist = (productId, isAdded) => toggleWishlist(productId, isAdded);

  const handleProceedToCheckout = () => {
    goToAddressStep();
    navigate('/checkout');
  };

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
            element={<Home onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />}
          />
          <Route
            path="/shop"
            element={
              <Shop
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            }
          />
          <Route 
            path="/product/:slug" 
            element={<ProductDetails onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />} 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={
              <Cart
                cartItems={cartItems}
                totals={totals}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={handleRemoveItem}
                isAuthenticated={isAuthenticated}
                onProceedToCheckout={handleProceedToCheckout}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                steps={CHECKOUT_STEPS}
                activeStep={currentStep}
                authStatus={authStatus}
                cartItems={cartItems}
              />
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

export default App;

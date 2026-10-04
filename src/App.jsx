import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { status: authStatus, isAuthenticated } = useAuth();

  const {
    cart,
    loading: cartLoading,
    error: cartError,
    busy: cartBusy,
    cartCount,
    reload: reloadCart,
    addToCart,
    updateQuantity,
    removeItem,
  } = useCart();

  const checkout = useCheckout();

  const [notification, setNotification] = useState(null);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const { productIds: wishlist, toggle: toggleWishlist } = useWishlist({ onMessage: showToast });

  // Resolves true when the backend accepted the item. Only variant-backed lines
  // (from the product page) can be added, and only by a signed-in user.
  const handleAddToCart = async (product) => {
    if (!product?.productVariantId) return false;
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart.');
      navigate('/login', { state: { from: location.pathname } });
      return false;
    }
    const result = await addToCart(product);
    showToast(result.ok ? `"${product.title}" added to your cart!` : result.error.message);
    return result.ok;
  };

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    const result = await updateQuantity(cartItemId, quantity);
    if (!result.ok) showToast(result.error.message);
  };

  const handleRemoveItem = async (cartItemId) => {
    const result = await removeItem(cartItemId);
    showToast(result.ok ? 'Item removed from cart' : result.error.message);
  };

  const handleToggleWishlist = (productId, isAdded) => toggleWishlist(productId, isAdded);

  const handleProceedToCheckout = () => {
    checkout.goToAddressStep();
    navigate('/checkout');
  };

  return (
    <div className="app-container">
      {notification && (
        <div
          className="app-toast"
          role="status"
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
            element={<Shop onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />}
          />
          <Route
            path="/product/:slug"
            element={
              <ProductDetails
                onAddToCart={handleAddToCart}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/cart"
            element={
              <Cart
                authStatus={authStatus}
                cart={cart}
                loading={cartLoading}
                error={cartError}
                busy={cartBusy}
                onReload={reloadCart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onProceedToCheckout={handleProceedToCheckout}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <Checkout
                steps={CHECKOUT_STEPS}
                activeStep={checkout.currentStep}
                authStatus={authStatus}
                cart={cart}
                cartLoading={cartLoading}
                cartError={cartError}
                onReloadCart={reloadCart}
                selectedAddressId={checkout.selectedAddressId}
                selectedAddress={checkout.selectedAddress}
                onSelectAddress={checkout.selectAddress}
                onAddressesLoaded={checkout.handleAddressesLoaded}
                onContinue={checkout.goToSummaryStep}
                onChangeAddress={checkout.goToAddressStep}
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

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Shop } from './pages/Shop/Shop';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import { Cart } from './pages/Cart/Cart';
import { Checkout } from './pages/Checkout/Checkout';
import { useCart } from './hooks/useCart';

function App() {
  const {
    cartItems,
    cartCount,
    totals,
    addToCart,
    updateQuantity,
    removeItem,
    applyPromo,
  } = useCart();

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

  return (
    <Router>
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
              element={<Home onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />}
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
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  totals={totals}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onApplyPromo={applyPromo}
                />
              }
            />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

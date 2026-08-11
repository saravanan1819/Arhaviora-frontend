import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { Home } from './pages/Home/Home';
import { Shop } from './pages/Shop/Shop';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import { Cart } from './pages/Cart/Cart';
import { Checkout } from './pages/Checkout/Checkout';

function App() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Personalized Muslin Baby Blanket',
      price: 1400,
      quantity: 1,
      name: 'Aria',
      font: 'Cursive',
      threadColor: 'Rose Pink',
      imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop'
    }
  ]);
  const [wishlist, setWishlist] = useState(['1', '3']);
  const [notification, setNotification] = useState(null);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setNotification(`✨ "${product.title}" added to your cart!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleToggleWishlist = (productId, isAdded) => {
    setWishlist((prev) =>
      isAdded ? [...prev, productId] : prev.filter((id) => id !== productId)
    );
    setNotification(isAdded ? '💖 Added item to your wishlist!' : '🤍 Removed item from your wishlist');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <Router>
      <div className="app-container">
        {/* Global Toast Notification */}
        {notification && (
          <div style={{
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
            animation: 'fadeIn 0.3s ease'
          }}>
            <span>{notification}</span>
          </div>
        )}

        {/* Global Navigation Header */}
        <Navbar cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} wishlistCount={wishlist.length} />

        {/* Dynamic Route Pages */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} />} />
            <Route path="/shop" element={<Shop onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} wishlist={wishlist} />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;

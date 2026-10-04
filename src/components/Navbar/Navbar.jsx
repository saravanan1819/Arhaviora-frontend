import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDownIcon } from '../Icons/Icons';
import { useAuth } from '../../features/auth/AuthContext';
import { useAsync } from '../../hooks/useAsync';
import { listCategories } from '../../services/api/catalogue';
import { adaptCategory } from '../../features/catalogue/adapters';
import './Navbar.css';

export const Navbar = ({ cartCount = 0, wishlistCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const categoriesState = useAsync(() => listCategories({ limit: 100 }), []);
  const categories = (categoriesState.data?.categories || []).map(adaptCategory);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="arhaviora-header-wrapper">
      {/* 1. Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="announcement-inner">
          <div className="anno-pill">
            <img src="/assets/icons/package.svg" alt="" width={16} height={16} />
            <span>Personalized with love</span>
          </div>
          <div className="anno-pill anno-mobile-hide">
            <img src="/assets/icons/package.svg" alt="" width={16} height={16} />
            <span>Crafted for little one</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="primary-navbar">
        <div className="nav-inner-container">
          {/* Hamburger Menu Toggle for Mobile */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
            <div className={`hamburger-bar ${mobileMenuOpen ? 'open' : ''}`}></div>
          </button>

          {/* Left Navigation Links */}
          <div className="nav-left-menu">
            <div
              className="nav-dropdown-holder"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link to="/shop" className="nav-item-link">
                <span>Shop</span>
                <ChevronDownIcon size={12} color="#6E6862" />
              </Link>
              {dropdownOpen && (
                <div className="nav-dropdown-flyout">
                  {categories.map((c) => (
                    <Link key={c.id} to={`/shop?category=${c.slug}`} className="flyout-item">{c.name}</Link>
                  ))}
                  <Link to="/shop" className="flyout-item">All Products</Link>
                </div>
              )}
            </div>

            <Link to="/shop?category=collections" className="nav-item-link">
              <span>Collections</span>
              <ChevronDownIcon size={12} color="#6E6862" />
            </Link>

            <Link to="/#personalizer-section" className="nav-item-link">
              <span>Personalize</span>
              <ChevronDownIcon size={12} color="#6E6862" />
            </Link>

            <Link to="/shop?category=gifts" className="nav-item-link">
              <span>Gift Guide</span>
            </Link>
          </div>

          {/* Center Brand Logo */}
          <div className="nav-center-brand">
            <Link to="/" className="brand-link" aria-label="Arhaviora Home">
              <img
                src="/assets/images/logo.png"
                alt="Arhaviora"
                className="brand-logo-img"
              />
            </Link>
          </div>

          {/* Right Search & Action Icons */}
          <div className="nav-right-actions">
            <form className="nav-search-box" onSubmit={handleSearchSubmit}>
              <img src="/assets/icons/search.svg" alt="" width="16" height="16" />
              <input
                type="text"
                placeholder="Search"
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </form>

            <div className="actions-icons-row">
              {/* Mobile search icon — only visible on mobile */}
              <Link to="/shop" className="action-icon-link nav-mobile-search" aria-label="Search" onClick={() => setMobileMenuOpen(false)}>
                <img src="/assets/icons/search.svg" alt="" width="20" height="20" />
              </Link>

              <div className="nav-divider"></div>

              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="action-icon-link nav-account-link"
                aria-label={isAuthenticated ? 'Account' : 'Sign in'}
              >
                <img src="/assets/icons/account.svg" alt="" width="20" height="20" />
              </Link>

              <Link to="/wishlist" className="action-icon-link" aria-label="Wishlist">
                <img src="/assets/icons/wishlist_heart.svg" alt="" width="20" height="20" />
                <span className="count-dot" aria-hidden="true">{wishlistCount}</span>
              </Link>

              <Link to="/cart" className="action-icon-link" aria-label="Shopping Bag">
                <img src="/assets/icons/cart_bag.svg" alt="" width="20" height="20" />
                <span className="count-dot" aria-hidden="true">{cartCount}</span>
              </Link>

              {isAuthenticated ? (
                <button type="button" className="action-login-text" onClick={handleLogout} title={user?.email}>
                  Logout
                </button>
              ) : (
                <Link to="/login" className="action-login-text">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="mobile-nav-menu">
          <div className="mobile-nav-links">
            <Link to="/shop" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <div className="mobile-sub-links">
              {categories.map((c) => (
                <Link key={c.id} to={`/shop?category=${c.slug}`} className="mobile-sub-link" onClick={() => setMobileMenuOpen(false)}>{c.name}</Link>
              ))}
            </div>
            <Link to="/shop?category=collections" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
            <Link to="/#personalizer-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Personalize</Link>
            <Link to="/shop?category=gifts" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Gift Guide</Link>
            {isAuthenticated ? (
              <button type="button" className="mobile-nav-link" onClick={handleLogout}>Logout</button>
            ) : (
              <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

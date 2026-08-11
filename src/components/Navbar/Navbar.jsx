import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  ShoppingBagIcon,
  GiftIcon,
  TruckIcon,
  ChevronDownIcon
} from '../Icons/Icons';
import './Navbar.css';

export const Navbar = ({ cartCount = 0, wishlistCount = 0 }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <GiftIcon size={16} color="#D44D60" />
            <span>Personalized with love</span>
          </div>
          <div className="anno-pill">
            <TruckIcon size={16} color="#D44D60" />
            <span>Free Shipping on order above ₹999</span>
          </div>
          <div className="anno-pill">
            <GiftIcon size={16} color="#D44D60" />
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
            aria-label="Toggle Navigation Menu"
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
                  <Link to="/shop?category=blankets" className="flyout-item">Baby Blankets</Link>
                  <Link to="/shop?category=clothing" className="flyout-item">Baby Clothing</Link>
                  <Link to="/shop?category=maternity" className="flyout-item">Maternity Dresses</Link>
                  <Link to="/shop?category=nursery" className="flyout-item">Nursery Essentials</Link>
                  <Link to="/shop?category=boxes" className="flyout-item">Gift Boxes</Link>
                </div>
              )}
            </div>

            <Link to="/shop?category=collections" className="nav-item-link">
              <span>Collections</span>
              <ChevronDownIcon size={12} color="#6E6862" />
            </Link>

            <a href="#personalizer-section" className="nav-item-link">
              <span>Personalize</span>
              <ChevronDownIcon size={12} color="#6E6862" />
            </a>

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
              <img src="/assets/icons/search.svg" alt="Search" width="16" height="16" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-field"
              />
            </form>

            <div className="actions-icons-row">
              <div className="nav-divider"></div>

              <Link to="/account" className="action-icon-link" aria-label="Account">
                <img src="/assets/icons/account.svg" alt="Account" width="20" height="20" />
              </Link>

              <Link to="/wishlist" className="action-icon-link" aria-label="Wishlist">
                <img src="/assets/icons/wishlist_heart.svg" alt="Wishlist" width="20" height="20" />
                <span className="count-dot">{wishlistCount}</span>
              </Link>

              <Link to="/cart" className="action-icon-link" aria-label="Shopping Bag">
                <img src="/assets/icons/cart_bag.svg" alt="Cart" width="20" height="20" />
                <span className="count-dot">{cartCount}</span>
              </Link>

              <Link to="/login" className="action-login-text">
                Login
              </Link>
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
              <Link to="/shop?category=blankets" className="mobile-sub-link" onClick={() => setMobileMenuOpen(false)}>Baby Blankets</Link>
              <Link to="/shop?category=clothing" className="mobile-sub-link" onClick={() => setMobileMenuOpen(false)}>Baby Clothing</Link>
              <Link to="/shop?category=maternity" className="mobile-sub-link" onClick={() => setMobileMenuOpen(false)}>Maternity Dresses</Link>
              <Link to="/shop?category=nursery" className="mobile-sub-link" onClick={() => setMobileMenuOpen(false)}>Nursery Essentials</Link>
              <Link to="/shop?category=boxes" className="mobile-sub-link" onClick={() => setMobileMenuOpen(false)}>Gift Boxes</Link>
            </div>
            <Link to="/shop?category=collections" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Collections</Link>
            <a href="#personalizer-section" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Personalize</a>
            <Link to="/shop?category=gifts" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Gift Guide</Link>
            <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

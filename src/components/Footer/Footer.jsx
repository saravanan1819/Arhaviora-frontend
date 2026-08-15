import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3500);
      setEmailInput('');
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* Left Panel */}
        <div className="footer-left-panel">
          {/* Available On Block */}
          <div className="available-on-block">
            <span className="available-title">Available On</span>
            <div className="market-badges-row">
              <a
                href="https://amazon.in"
                target="_blank"
                rel="noopener noreferrer"
                className="marketplace-badge-link"
                title="Shop Arhaviora on Amazon"
                aria-label="Amazon"
              >
                <img src="/assets/icons/amazon.svg" alt="Amazon" className="marketplace-logo-amazon" />
              </a>

              <a
                href="https://flipkart.com"
                target="_blank"
                rel="noopener noreferrer"
                className="marketplace-badge-link"
                title="Shop Arhaviora on Flipkart"
                aria-label="Flipkart"
              >
                <img src="/assets/icons/flipkart.svg" alt="Flipkart" className="marketplace-logo-flipkart" />
              </a>
            </div>
          </div>

          {/* Brand Desc */}
          <p className="footer-brand-desc">
            Premium personalized baby essentials crafted with love for every precious milestone.
          </p>

          {/* Social Icons Row */}
          <div className="footer-social-row">
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <img src="/assets/icons/whatsapp.svg" alt="WhatsApp" className="footer-social-icon" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/assets/icons/indeed.svg" alt="LinkedIn" className="footer-social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src="/assets/icons/twiter.svg" alt="Twitter" className="footer-social-icon" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/assets/icons/facebook.svg" alt="Facebook" className="footer-social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/assets/icons/instagram.svg" alt="Instagram" className="footer-social-icon" />
            </a>
          </div>

          {/* Divider line */}
          <hr className="footer-left-divider" />

          {/* Copyright text */}
          <p className="footer-copyright-text">
            © 2026 Arhaviora. All rights reserved.
          </p>
        </div>

        {/* Right Panel */}
        <div className="footer-right-panel">
          {/* Newsletter Subscription */}
          <div className="newsletter-block">
            <h4 className="newsletter-heading">Join the Arhaviora Family</h4>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe to newsletter">
                ➔
              </button>
            </form>
            {subscribed && (
              <div className="newsletter-toast-msg">
                ✓ Thank you for subscribing to Arhaviora!
              </div>
            )}
          </div>

          {/* 3-Column Navigation Grid */}
          <div className="footer-nav-columns">
            {/* Col 1: Shop */}
            <div className="footer-links-col">
              <h5 className="footer-col-title">Shop</h5>
              <ul className="footer-links-list">
                <li><Link to="/shop?category=personalized">Personalized Gifts</Link></li>
                <li><Link to="/shop?category=clothing">Baby Clothing</Link></li>
                <li><Link to="/shop?category=maternity">Maternity Dresses</Link></li>
                <li><Link to="/shop?category=nursery">Nursery Essentials</Link></li>
                <li><Link to="/shop?category=hampers">Gift Boxes</Link></li>
                <li><Link to="/shop?category=bestsellers">Best Sellers</Link></li>
              </ul>
            </div>

            {/* Col 2: Company */}
            <div className="footer-links-col">
              <h5 className="footer-col-title">Company</h5>
              <ul className="footer-links-list">
                <li><Link to="/about">About Arhaviora</Link></li>
                <li><Link to="/story">Our Story</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><Link to="/shipping">Shipping & Returns</Link></li>
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Col 3: Customer Care */}
            <div className="footer-links-col">
              <h5 className="footer-col-title">Customer Care</h5>
              <ul className="footer-links-list">
                <li><Link to="/faqs">FAQs</Link></li>
                <li><Link to="/shipping">Shipping & Returns</Link></li>
                <li><Link to="/track">Track Your Order</Link></li>
                <li><Link to="/returns">Return Policy</Link></li>
                <li><Link to="/gift-cards">Gift Cards</Link></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

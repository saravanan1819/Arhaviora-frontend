import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, HeartIcon, GiftIcon, TruckIcon, ShieldCheckIcon } from '../Icons/Icons';
import './Personalizer.css';

const colorSwatches = [
  { name: 'Light Blue', hex: '#BCD8EC' },
  { name: 'Rose Coral', hex: '#E28891' },
  { name: 'Sage Green', hex: '#C3C09B' },
  { name: 'Ocean Blue', hex: '#7DB4D4' },
  { name: 'Blush Pink', hex: '#ECBCC0' }
];

const fonts = [
  { name: 'Playfair', family: "'Playfair Display', serif" },
  { name: 'Cursive', family: "'Great Vibes', cursive" },
  { name: 'Outfit', family: "'Outfit', sans-serif" }
];

export const Personalizer = ({
  showGiftMessage = false,
  showSectionHeading = true,
  onAddToCart,
  className = ''
}) => {
  const [customName, setCustomName] = useState('Vivaan');
  const [selectedColor, setSelectedColor] = useState(colorSwatches[1].hex);
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const [giftMessage, setGiftMessage] = useState('');

  const handleAction = () => {
    if (onAddToCart) {
      onAddToCart({
        customName,
        selectedColor,
        selectedFont: selectedFont.name,
        giftMessage
      });
    }
  };

  return (
    <section className={`personalizer-section ${showGiftMessage ? 'has-gift-msg' : ''} ${className}`} id="personalizer-section">
      {showSectionHeading && (
        <div className="pers-heading-group">
          <div className="pers-section-pre">Personalized With Love</div>
          <h2 className="pers-section-h2">Create something Truly Yours</h2>
        </div>
      )}

      <div className="pers-layout">
        <div className="pers-form-card">
          <div className="pers-form-head">
            <div className="pers-head-icon">
              <GiftIcon size={20} color="#D44D60" />
            </div>
            <div className="pers-head-text-group">
              <span className="pers-form-title">Personalized Your Product</span>
              <p className="pers-form-sub">Fill in the details and see the magic in real time</p>
            </div>
          </div>

          <div className="pers-form-group">
            <label className="pers-label">Baby's Name</label>
            <div className="pers-input-wrap">
              <StarIcon size={18} color="#8E8E93" fill="none" />
              <input
                className="pers-input"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Vivaan"
                maxLength={14}
              />
            </div>
          </div>

          <div className="pers-form-group">
            <label className="pers-label">Choose Font</label>
            <div className="pers-fonts">
              {fonts.map((f, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pers-font-btn ${selectedFont.name === f.name ? 'active' : ''}`}
                  onClick={() => setSelectedFont(f)}
                >
                  <span className="pers-font-aa" style={{ fontFamily: f.family }}>Aa</span>
                  <span className="pers-font-name">{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pers-form-group">
            <label className="pers-label">Thread Color</label>
            <div className="pers-colors">
              {colorSwatches.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  className={`pers-color-dot ${selectedColor === c.hex ? 'active' : ''}`}
                  style={{ backgroundColor: c.hex }}
                  onClick={() => setSelectedColor(c.hex)}
                  aria-label={c.name}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {showGiftMessage && (
            <div className="pers-form-group">
              <label className="pers-label">Gift Message ( Optional )</label>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder="Happy birthday Sophia"
                className="pers-textarea-input"
                rows="3"
              />
            </div>
          )}

          <button type="button" className="pers-preview-hint-btn" onClick={handleAction}>
            <span className="pers-hint-icon-circle">
              <HeartIcon size={14} color="#2D2A26" />
            </span>
            <span>Fill in the details and see the magic in real time</span>
          </button>
        </div>

        <div className="pers-preview-card">
          <div className="pers-live-badge">
            <span className="pers-live-icon-circle">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D44D60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span className="pers-live-text">Live Preview</span>
          </div>

          <div className="pers-canvas-wrap">
            <img
              src="/assets/images/personalizer/blanket_canvas.png"
              alt="Personalized Blanket Preview"
              className="pers-canvas-img"
            />
            <div
              className="pers-text-overlay"
              style={{
                fontFamily: selectedFont.family,
                color: selectedColor
              }}
            >
              {customName || 'Vivaan'}
            </div>
          </div>

          <div className="pers-quality-bar">
            <span>Premium Quality</span>
            <span className="pers-dot-gold">•</span>
            <span>Handmade</span>
            <span className="pers-dot-gold">•</span>
            <span>Made with Love</span>
          </div>
        </div>
      </div>

      {showSectionHeading && (
        <>
          <div className="pers-benefits">
            <div className="pers-benefit">
              <div className="pers-ben-icon"><GiftIcon size={20} color="#D44D60" /></div>
              <div><div className="pers-ben-title">Gift Ready</div><div className="pers-ben-sub">Beautifully Packed,</div></div>
            </div>
            <div className="pers-benefit-divider"></div>
            <div className="pers-benefit">
              <div className="pers-ben-icon"><TruckIcon size={20} color="#D44D60" /></div>
              <div><div className="pers-ben-title">Ship in 3–5 days</div><div className="pers-ben-sub">Delivered with Care</div></div>
            </div>
            <div className="pers-benefit-divider"></div>
            <div className="pers-benefit">
              <div className="pers-ben-icon"><HeartIcon size={20} color="#D44D60" /></div>
              <div><div className="pers-ben-title">Made with love</div><div className="pers-ben-sub">Happy Parents</div></div>
            </div>
            <div className="pers-benefit-divider"></div>
            <div className="pers-benefit">
              <div className="pers-ben-icon"><ShieldCheckIcon size={20} color="#D44D60" /></div>
              <div><div className="pers-ben-title">Baby Safe</div><div className="pers-ben-sub">Non Toxic & Babysafe</div></div>
            </div>
          </div>

          <div className="pers-cta">
            <Link to="/shop?category=personalized" className="pers-btn-rose">
              All Personalized Products <span className="pers-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="16" height="16" style={{ display: 'block' }} /></span>
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

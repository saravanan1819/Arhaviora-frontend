import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_PRODUCTS } from '../../data/products';
import { HeartIcon, StarIcon, ChevronRightIcon } from '../../components/Icons/Icons';
import { Personalizer } from '../../components/Personalizer/Personalizer';
import './ProductDetails.css';
import '../Shop/Shop.css';

const GiftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1"/>
    <path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 8a4.5 4.5 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5Z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const SWATCHES = [
  { name: 'Sky Blue', hex: '#A5D9FF', value: '#A5D9FF' },
  { name: 'Rose Pink', hex: '#E26D7C', value: '#E26D7C' },
  { name: 'Sage Green', hex: '#B0BE98', value: '#B0BE98' },
  { name: 'Ocean Blue', hex: '#5C9DC9', value: '#5C9DC9' },
  { name: 'Soft Pink', hex: '#F8D8DC', value: '#F8D8DC' }
];

const FONTS = [
  { name: 'Playfair', family: "'Playfair Display', serif" },
  { name: 'Cursive', family: "'Great Vibes', cursive" },
  { name: 'Outfit', family: "'Outfit', sans-serif" }
];

const INFO_GRID = [
  { icon: <img src="/assets/icons/shipping_truck.svg" alt="Shipping" width="24" height="24" />, label: 'Ships in 3–5 days' },
  { icon: <img src="/assets/icons/package.svg" alt="Premium Packaging" width="24" height="24" />, label: 'Premium Packaging' },
  { icon: <img src="/assets/icons/package.svg" alt="Easy Returns" width="24" height="24" />, label: 'Easy Returns' },
  { icon: <img src="/assets/icons/package.svg" alt="Secure Payment" width="24" height="24" />, label: 'Secure Payment' }
];

export const ProductDetails = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  const { id } = useParams();

  const product = useMemo(() => {
    const found = ALL_PRODUCTS.find(p => p.id === id);
    if (found) {
      if (found.id === '1') {
        return {
          ...found,
          title: 'Personalized Muslin Baby Blanket',
          discount: '63% Off',
          originalPrice: 1800
        };
      }
      return found;
    }
    return ALL_PRODUCTS[0];
  }, [id]);

  const galleryImages = useMemo(() => {
    if (product.id === '1') {
      return [
        '/assets/images/products/bestseller_1.png',
        '/assets/images/collections/baby_clothing.png',
        '/assets/images/keepsakes/keepsake_1.png',
        '/assets/images/gifting/newborn_gift_box.png',
        '/assets/images/keepsakes/keepsake_3.png'
      ];
    }
    return [
      product.imageUrl,
      '/assets/images/products/bestseller_2.png',
      '/assets/images/products/bestseller_3.png',
      '/assets/images/products/bestseller_4.png',
      '/assets/images/products/bestseller_5.png'
    ];
  }, [product]);

  const [selectedImg, setSelectedImg] = useState(galleryImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  useEffect(() => {
    setSelectedImg(galleryImages[0]);
  }, [galleryImages]);

  const [babyName, setBabyName] = useState('Vivaan');
  const [selectedFont, setSelectedFont] = useState(FONTS[1]);
  const [selectedColor, setSelectedColor] = useState(SWATCHES[1]);
  const [giftMessage, setGiftMessage] = useState('');

  const [reviews, setReviews] = useState(product.reviews || []);

  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCartClick = () => {
    const customizedProduct = {
      ...product,
      id: `${product.id}-custom-${Date.now()}`,
      title: `${product.title} (${babyName})`,
      price: product.price,
      quantity,
      customName: babyName,
      customFont: selectedFont.name,
      customColor: selectedColor.name,
      customGiftMessage: giftMessage
    };
    onAddToCart(customizedProduct);
  };

  return (
    <div className="pd-page">
      <nav className="pd-breadcrumb" aria-label="breadcrumb">
        <Link to="/" className="pd-bc-link">Home</Link>
        <ChevronRightIcon size={14} color="#8E8E93" />
        <Link to="/shop" className="pd-bc-link">Shop</Link>
        <ChevronRightIcon size={14} color="#8E8E93" />
        <Link to="/shop" className="pd-bc-link">Baby Essentials</Link>
        <ChevronRightIcon size={14} color="#8E8E93" />
        <span className="pd-bc-active">{product.title}</span>
      </nav>

      {/* ── TOP DETAIL SECTION ── */}
      <div className="pd-top-fold">
        <div className="pd-gallery-section">
          <div className="pd-thumbnails-col">
            {galleryImages.map((imgUrl, index) => (
              <button
                key={index}
                className={`pd-thumb-btn ${selectedImg === imgUrl ? 'active' : ''}`}
                onClick={() => setSelectedImg(imgUrl)}
              >
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
          <div className="pd-main-img-wrap">
            <img src={selectedImg} alt={product.title} className="pd-main-img" />
          </div>
        </div>

        <div className="pd-details-col">
          <h1 className="pd-product-title">
            {product.id === '1' ? (
              <>Personalized Muslin<br />Baby Blanket</>
            ) : (
              product.title
            )}
          </h1>

          <div className="pd-rating-row">
            <div className="pd-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={20} color="#BCD8EC" fill={i < Math.floor(product.rating) ? '#BCD8EC' : 'none'} />
              ))}
            </div>
            <span className="pd-rating-text">{product.rating} ( {product.reviewsCount || 298} Reviews )</span>
          </div>

          <p className="pd-description">
            {product.description}
          </p>

          <div className="pd-badges-row">
            <span className="pd-badge-pill">
              <img src="/assets/icons/pencil.svg" alt="Personalized" width="14" height="14" />
              Personalized
            </span>
            <span className="pd-badge-pill">
              <GiftIcon />
              Gift Ready
            </span>
          </div>

          <div className="pd-price-row">
            <span className="pd-price">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="pd-orig-price">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            <span className="pd-discount-pct">({product.discount})</span>
          </div>

          <div className="pd-action-controls">
            <div className="pd-qty-selector">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="pd-qty-btn">−</button>
              <span className="pd-qty-value">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="pd-qty-btn">+</button>
            </div>

            <button
              onClick={() => onToggleWishlist(product.id, !isWishlisted)}
              className={`pd-wishlist-btn ${isWishlisted ? 'active' : ''}`}
            >
              <HeartIcon size={18} color="#D44D60" fill={isWishlisted ? '#D44D60' : 'none'} />
              <span>Add to Wishlist</span>
            </button>
          </div>

          <div className="pd-purchase-buttons">
            <button className="pd-btn-atc" onClick={handleAddToCartClick}>
              <img src="/assets/icons/cart_outline.svg" alt="Cart" width="18" height="18" style={{ marginRight: '8px' }} />
              Add to Cart
            </button>
            <button className="pd-btn-buy" onClick={handleAddToCartClick}>
              Buy Now
            </button>
          </div>

          <div className="pd-info-banner">
            {INFO_GRID.map((item, idx) => (
              <React.Fragment key={idx}>
                <div className="pd-info-banner-item">
                  <div className="pd-info-banner-icon">{item.icon}</div>
                  <span className="pd-info-banner-label">{item.label}</span>
                </div>
                {idx < INFO_GRID.length - 1 && <div className="pd-info-banner-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── PERSONALIZATION SECTION (LIVE PREVIEW CONFIGURATOR) ── */}
      <div className="pd-customizer-wrapper">
        <Personalizer showGiftMessage={true} showSectionHeading={false} onAddToCart={handleAddToCartClick} />
      </div>

      {/* ── ABOUT THIS PRODUCT SECTION ── */}
      <div className="pd-about-section">
        <div className="pd-about-card">
          <h2 className="pd-about-title">About this product</h2>
          <p className="pd-about-desc">
            {product.description}
          </p>

          <div className={`pd-about-table ${aboutExpanded ? 'expanded' : ''}`}>
            {product.details?.map((detail, idx) => (
              <div className="pd-table-row" key={idx}>
                <span className="pd-table-label">{detail.label}</span>
                <span className="pd-table-value">{detail.value}</span>
              </div>
            ))}
          </div>

          <button className="pd-table-expand-btn" onClick={() => setAboutExpanded(e => !e)}>
            <span>{aboutExpanded ? 'View Less' : 'View More'}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: aboutExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M1 1L6 6L11 1" stroke="#545454" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── REVIEWS SECTION ── */}
      <div className="pd-reviews-section">
        <h2 className="pd-section-heading">Reviews</h2>

        <div className="pd-reviews-summary-row">
          <div className="pd-rev-score-card">
            <span className="pd-rev-score">4.8</span>
            <span className="pd-rev-score-sub">of 125 reviews</span>
            <div className="pd-rev-score-stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} size={24} color="#FFB547" fill="#FFB547" />
              ))}
            </div>
          </div>

          <div className="pd-rev-progress-col">
            {product.reviewStats?.map(r => (
              <div key={r.label} className="pd-rev-bar-row">
                <span className="pd-rev-bar-label">{r.label}</span>
                <div className="pd-rev-bar-bg">
                  <div className="pd-rev-bar-fill" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="pd-rev-bar-count">{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pd-comment-form">
          <input
            type="text"
            placeholder="Leave Comment"
            className="pd-comment-input-solo"
          />
        </div>

        <div className={`pd-reviews-list-container ${reviewsExpanded ? 'expanded' : 'collapsed'}`}>
          <div className="pd-reviews-list">
            {reviews.map(rev => (
              <div key={rev.id} className="pd-rev-card">
                <div className="pd-rev-card-header">
                  <div className="pd-rev-avatar">
                    {rev.avatar ? (
                      <img src={rev.avatar} alt={rev.name} className="pd-rev-avatar-img" />
                    ) : (
                      rev.name.charAt(0)
                    )}
                  </div>
                  <div className="pd-rev-meta">
                    <h4 className="pd-rev-username">{rev.name}</h4>
                    <div className="pd-rev-stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon key={i} size={20} color="#FFB547" fill={i < rev.rating ? '#FFB547' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <span className="pd-rev-date">{rev.date}</span>
                </div>
                <p className="pd-rev-content">{rev.content}</p>
                {rev.images && rev.images.length > 0 && (
                  <div className="pd-rev-images">
                    {rev.images.map((img, idx) => (
                      <img key={idx} src={img} alt="User Attachment" className="pd-rev-img-attachment" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!reviewsExpanded && <div className="pd-reviews-overlay" />}
        </div>

        <div className={`pd-reviews-expand-wrapper ${reviewsExpanded ? 'expanded' : ''}`}>
          <button className="pd-reviews-more-btn" onClick={() => setReviewsExpanded(e => !e)}>
            <span>{reviewsExpanded ? 'View Less' : 'View More'}</span>
            <div className="pd-reviews-more-btn-circle">
              {reviewsExpanded ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D44D60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D44D60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ── YOU MAY ALSO LOVE (RELATED PRODUCTS) ── */}
      <div className="pd-related-section">
        <h2 className="pd-section-heading">You may also love</h2>
        <div className="pd-related-grid">
          {ALL_PRODUCTS.slice(3, 6).map(p => {
            const isRelatedWishlisted = wishlist.includes(p.id);
            return (
              <div key={p.id} className="sp-card">
                <div className="sp-card-img-wrap">
                  <Link to={`/product/${p.id}`}>
                    <img src={p.imageUrl} alt={p.title} className="sp-card-img" />
                  </Link>
                  <button
                    className={`sp-card-heart ${isRelatedWishlisted ? 'active' : ''}`}
                    onClick={() => onToggleWishlist(p.id, !isRelatedWishlisted)}
                    aria-label="Add to wishlist"
                  >
                    <HeartIcon size={16} color="#D44D60" fill={isRelatedWishlisted ? '#D44D60' : 'none'} />
                  </button>
                </div>
                <div className="sp-card-info">
                  <div className="sp-card-meta-row">
                    <div className="sp-card-swatches">
                      <span className="sp-card-swatch" style={{ background: '#A4C8E1' }} />
                      <span className="sp-card-swatch" style={{ background: '#EDAABB' }} />
                      <span className="sp-card-swatch" style={{ background: '#A8AA6A' }} />
                      <span className="sp-card-options">+9 Options</span>
                    </div>
                    <div className="sp-card-rating">
                      {p.rating} <StarIcon size={13} color="#F5A623" fill="#F5A623" />
                    </div>
                  </div>
                  <Link to={`/product/${p.id}`} className="sp-card-title-link">
                    <p className="sp-card-title">{p.title}</p>
                  </Link>
                  <div className="sp-card-price-row">
                    <span className="sp-card-price">₹{p.price.toLocaleString('en-IN')}</span>
                    <span className="sp-card-orig">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="sp-card-off">({p.discount})</span>
                  </div>
                  <button className="sp-card-atc" onClick={() => onAddToCart(p)}>ADD TO CART</button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <Link to="/shop" className="pd-reviews-more-btn pd-view-all-btn">
            <span>View All Products</span>
            <div className="pd-reviews-more-btn-circle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D44D60" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HeartIcon, ChevronRightIcon } from '../../components/Icons/Icons';
import { useAsync } from '../../hooks/useAsync';
import { getProductBySlug, listProducts } from '../../services/api/catalogue';
import {
  PLACEHOLDER_IMAGE,
  adaptProductDetail,
  adaptProductList,
  discountPercent,
  formatPrice,
  variantLabel,
} from '../../features/catalogue/adapters';
import './ProductDetails.css';
import '../Shop/Shop.css';

const StatusBlock = ({ role, children }) => (
  <div className="pd-page">
    <div className="sp-empty-state" role={role}>{children}</div>
  </div>
);

export const ProductDetails = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const productState = useAsync(() => getProductBySlug(slug), [slug]);
  const product = useMemo(
    () => (productState.data?.product ? adaptProductDetail(productState.data.product) : null),
    [productState.data]
  );

  const [variantId, setVariantId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [personalizationText, setPersonalizationText] = useState('');
  const [selectedImg, setSelectedImg] = useState(null);
  const [aboutExpanded, setAboutExpanded] = useState(false);

  // Default to the backend-flagged default variant, else the first one.
  useEffect(() => {
    if (!product) return;
    const initial = product.variants.find((v) => v.isDefault) || product.variants[0];
    setVariantId(initial ? initial.id : null);
    setQuantity(1);
    setPersonalizationText('');
  }, [product]);

  const variant = product?.variants.find((v) => v.id === variantId) || null;

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const shown = product.images.filter((img) => !img.variantId || img.variantId === variantId);
    return shown.length ? shown : [{ id: 'placeholder', url: PLACEHOLDER_IMAGE, alt: product.title }];
  }, [product, variantId]);

  useEffect(() => {
    setSelectedImg(galleryImages[0]?.url || null);
  }, [galleryImages]);

  const relatedState = useAsync(
    () => (product?.category ? listProducts({ categoryId: product.category.id, limit: 4 }) : Promise.resolve(null)),
    [product?.category?.id]
  );
  const related = useMemo(
    () => adaptProductList(relatedState.data || {}).products.filter((p) => p.id !== product?.id).slice(0, 3),
    [relatedState.data, product]
  );

  if (productState.loading) {
    return <StatusBlock role="status"><p>Loading product…</p></StatusBlock>;
  }
  if (productState.error) {
    const notFound = productState.error.status === 404;
    return (
      <StatusBlock role="alert">
        <p>
          {notFound ? 'We could not find that product.' : productState.error.message}{' '}
          {notFound ? <Link to="/shop" className="sp-empty-clear">Back to shop</Link>
            : <button onClick={productState.reload} className="sp-empty-clear">Try again</button>}
        </p>
      </StatusBlock>
    );
  }
  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const { maxCharacters, baseCharge, perCharacter } = product.personalization;
  const discount = variant ? discountPercent(variant.price, variant.compareAtPrice) : 0;
  const canAdd = Boolean(variant);

  const addCurrentSelection = () => {
    if (!variant) return false;
    onAddToCart({
      productId: product.id,
      productSlug: product.slug,
      productVariantId: variant.id,
      title: product.title,
      imageUrl: galleryImages[0]?.url || PLACEHOLDER_IMAGE,
      price: variant.price,
      quantity,
      personalizationText: product.isPersonalizable ? personalizationText.trim() : '',
      category: product.category?.name || '',
      variantLabel: product.variants.length > 1 ? variantLabel(variant) : '',
    });
    return true;
  };

  const handleBuyNow = () => {
    if (addCurrentSelection()) navigate('/cart');
  };

  return (
    <div className="pd-page">
      <nav className="pd-breadcrumb" aria-label="breadcrumb">
        <Link to="/" className="pd-bc-link">Home</Link>
        <ChevronRightIcon size={14} color="#8E8E93" />
        <Link to="/shop" className="pd-bc-link">Shop</Link>
        {product.category && (
          <>
            <ChevronRightIcon size={14} color="#8E8E93" />
            <Link to={`/shop?category=${product.category.slug}`} className="pd-bc-link">{product.category.name}</Link>
          </>
        )}
        <ChevronRightIcon size={14} color="#8E8E93" />
        <span className="pd-bc-active">{product.title}</span>
      </nav>

      {/* ── TOP DETAIL SECTION ── */}
      <div className="pd-top-fold">
        <div className="pd-gallery-section">
          <div className="pd-thumbnails-col">
            {galleryImages.map((img, index) => (
              <button
                key={img.id}
                type="button"
                aria-label={`View image ${index + 1}`}
                className={`pd-thumb-btn ${selectedImg === img.url ? 'active' : ''}`}
                onClick={() => setSelectedImg(img.url)}
              >
                <img src={img.url} alt={`${img.alt} ${index + 1}`} />
              </button>
            ))}
          </div>
          <div className="pd-main-img-wrap">
            <img src={selectedImg || PLACEHOLDER_IMAGE} alt={product.title} className="pd-main-img" />
          </div>
        </div>

        <div className="pd-details-col">
          <h1 className="pd-product-title">{product.title}</h1>

          <p className="pd-description">{product.description}</p>

          <div className="pd-badges-row">
            {product.isPersonalizable && (
              <span className="pd-badge-pill">
                <img src="/assets/icons/pencil.svg" alt="" width="14" height="14" />
                Personalized
              </span>
            )}
          </div>

          {product.variants.length > 1 && (
            <div className="pd-variant-group" role="radiogroup" aria-label="Variant" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '12px 0' }}>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={v.id === variantId}
                  className={`pd-badge-pill ${v.id === variantId ? 'active' : ''}`}
                  style={{
                    cursor: 'pointer',
                    borderColor: v.id === variantId ? '#D44D60' : undefined,
                    fontWeight: v.id === variantId ? 700 : 500,
                  }}
                  onClick={() => setVariantId(v.id)}
                >
                  {variantLabel(v)}
                </button>
              ))}
            </div>
          )}

          {variant ? (
            <div className="pd-price-row">
              <span className="pd-price">{formatPrice(variant.price)}</span>
              {variant.compareAtPrice && variant.compareAtPrice > variant.price && (
                <span className="pd-orig-price">{formatPrice(variant.compareAtPrice)}</span>
              )}
              {discount > 0 && <span className="pd-discount-pct">({discount}% Off)</span>}
            </div>
          ) : (
            <p className="pd-description" role="status">This product is currently unavailable.</p>
          )}

          {product.isPersonalizable && (
            <div className="pd-personalization" style={{ margin: '12px 0' }}>
              <label htmlFor="pd-personalization-text" style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
                Personalization text (optional)
              </label>
              <input
                id="pd-personalization-text"
                type="text"
                value={personalizationText}
                onChange={(e) => setPersonalizationText(e.target.value)}
                maxLength={maxCharacters || undefined}
                placeholder="e.g. Baby's name"
                style={{ width: '100%', height: 44, padding: '0 12px', borderRadius: 8, border: '1px solid #ddd' }}
              />
              <small style={{ color: '#7A7770' }}>
                {maxCharacters ? `Up to ${maxCharacters} characters. ` : ''}
                {baseCharge > 0 || perCharacter > 0
                  ? `Personalization charge: ${formatPrice(baseCharge)} + ${formatPrice(perCharacter)} per character. `
                  : ''}
                The final price is confirmed in your cart.
              </small>
            </div>
          )}

          <div className="pd-action-controls">
            <div className="pd-qty-selector">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="pd-qty-btn">−</button>
              <span className="pd-qty-value" aria-live="polite">{quantity}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(q => q + 1)} className="pd-qty-btn">+</button>
            </div>

            <button
              type="button"
              aria-pressed={isWishlisted}
              onClick={() => onToggleWishlist(product.id, !isWishlisted)}
              className={`pd-wishlist-btn ${isWishlisted ? 'active' : ''}`}
            >
              <HeartIcon size={18} color="#D44D60" fill={isWishlisted ? '#D44D60' : 'none'} />
              <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          <div className="pd-purchase-buttons">
            <button className="pd-btn-atc" onClick={addCurrentSelection} disabled={!canAdd}>
              <img src="/assets/icons/cart_outline.svg" alt="" width="18" height="18" style={{ marginRight: '8px' }} />
              Add to Cart
            </button>
            <button className="pd-btn-buy" onClick={handleBuyNow} disabled={!canAdd}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ── ABOUT THIS PRODUCT SECTION ── */}
      <div className="pd-about-section">
        <div className="pd-about-card">
          <h2 className="pd-about-title">About this product</h2>
          <p className="pd-about-desc">{product.description}</p>

          {variant && Object.keys(variant.attributes).length > 0 && (
            <>
              <div className={`pd-about-table ${aboutExpanded ? 'expanded' : ''}`}>
                {Object.entries(variant.attributes).map(([label, value]) => (
                  <div className="pd-table-row" key={label}>
                    <span className="pd-table-label">{label}</span>
                    <span className="pd-table-value">{value}</span>
                  </div>
                ))}
                <div className="pd-table-row">
                  <span className="pd-table-label">SKU</span>
                  <span className="pd-table-value">{variant.sku}</span>
                </div>
              </div>
              <button className="pd-table-expand-btn" onClick={() => setAboutExpanded(e => !e)}>
                <span>{aboutExpanded ? 'View Less' : 'View More'}</span>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" style={{ transform: aboutExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M1 1L6 6L11 1" stroke="#545454" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── YOU MAY ALSO LOVE (RELATED PRODUCTS) ── */}
      {related.length > 0 && (
        <div className="pd-related-section">
          <h2 className="pd-section-heading">You may also love</h2>
          <div className="pd-related-grid">
            {related.map(p => {
              const isRelatedWishlisted = wishlist.includes(p.id);
              return (
                <div key={p.id} className="sp-card">
                  <div className="sp-card-img-wrap">
                    <Link to={`/product/${p.slug}`}>
                      <img src={p.imageUrl} alt={p.title} className="sp-card-img" />
                    </Link>
                    <button
                      className={`sp-card-heart ${isRelatedWishlisted ? 'active' : ''}`}
                      onClick={() => onToggleWishlist(p.id, !isRelatedWishlisted)}
                      aria-label={isRelatedWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <HeartIcon size={16} color="#D44D60" fill={isRelatedWishlisted ? '#D44D60' : 'none'} />
                    </button>
                  </div>
                  <div className="sp-card-info">
                    <Link to={`/product/${p.slug}`} className="sp-card-title-link">
                      <p className="sp-card-title">{p.title}</p>
                    </Link>
                    <div className="sp-card-price-row">
                      <span className="sp-card-price">{formatPrice(p.price)}</span>
                    </div>
                    <Link to={`/product/${p.slug}`} className="sp-card-atc" style={{ textAlign: 'center' }}>VIEW OPTIONS</Link>
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
      )}
    </div>
  );
};

export default ProductDetails;

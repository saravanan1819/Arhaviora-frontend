import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, StarIcon, ShoppingBagIcon } from '../Icons/Icons';
import './ProductCard.css';

export const ProductCard = ({
  id = '1',
  title = 'Personalized Muslin Baby Blanket',
  category = 'Personalized',
  price = 1400,
  originalPrice = 1800,
  discount = '63% off',
  rating = 4.8,
  reviewCount = 298,
  imageUrl = 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=600&auto=format&fit=crop',
  initialWishlisted = false,
  onAddToCart,
  onToggleWishlist
}) => {
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextState = !isWishlisted;
    setIsWishlisted(nextState);
    if (onToggleWishlist) {
      onToggleWishlist(id, nextState);
    }
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
    if (onAddToCart) {
      onAddToCart({ id, title, price, imageUrl });
    }
  };

  return (
    <div className="product-card-container">
      {/* Top Image Container with Wishlist */}
      <div className="product-card-media">
        <Link to={`/product/${id}`} className="media-link">
          <img src={imageUrl} alt={title} className="product-image" loading="lazy" />
        </Link>
        
        {/* Wishlist Button */}
        <button 
          className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon 
            size={20} 
            color={isWishlisted ? '#D44D60' : '#2E2B28'} 
            fill={isWishlisted ? '#D44D60' : 'none'} 
          />
        </button>

        {/* Badge Tag */}
        {category && (
          <span className="product-category-tag">{category}</span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="product-card-body">
        {/* Star Rating Score */}
        <div className="product-rating-row">
          <div className="stars-cluster">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} size={14} color="#FFB547" fill="#FFB547" />
            ))}
          </div>
          <span className="rating-score-text">{rating}</span>
          <span className="review-count-text">({reviewCount})</span>
        </div>

        {/* Product Title */}
        <Link to={`/product/${id}`} className="product-title-link">
          <h3 className="product-title">{title}</h3>
        </Link>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="price-current">₹{price.toLocaleString('en-IN')}</span>
          {originalPrice && (
            <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
          {discount && (
            <span className="price-discount-pill">{discount}</span>
          )}
        </div>

        {/* Action Button */}
        <div className="product-card-action">
          <button 
            className={`quick-add-btn ${addedAnimation ? 'is-added' : ''}`}
            onClick={handleQuickAdd}
          >
            <ShoppingBagIcon size={16} color="#FFFFFF" />
            <span>{addedAnimation ? 'Added to Cart!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

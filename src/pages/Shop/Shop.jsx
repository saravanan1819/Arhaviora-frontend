import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HeartIcon, StarIcon, ChevronRightIcon } from '../../components/Icons/Icons';
import './Shop.css';

const BASE_PRODUCTS = [
  { id: '1',  title: 'Personalized Wildflower Baby Blanket',     category: 'Swaddles & Blankets', age: '0-3', price: 1400, originalPrice: 1800, discount: '22% Off', rating: 4.8, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_1.png' },
  { id: '2',  title: 'Organic Muslin Swaddle & Wrap Set',        category: 'Swaddles & Blankets', age: '0-3', price: 999,  originalPrice: 1500, discount: '33% Off', rating: 4.7, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_2.png' },
  { id: '3',  title: 'Embroidered Name Baby Onesie',             category: 'Onesies & Rompers',   age: '3-6', price: 650,  originalPrice: 900,  discount: '28% Off', rating: 4.9, gender: 'girl',    availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_3.png' },
  { id: '4',  title: 'Bamboo Cotton Romper with Name',           category: 'Onesies & Rompers',   age: '3-6', price: 749,  originalPrice: 1100, discount: '32% Off', rating: 4.6, gender: 'boy',     availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_4.png' },
  { id: '5',  title: 'Baby Beanie & Mittens Set',                category: 'Accessories & Caps',  age: '0-3', price: 450,  originalPrice: 699,  discount: '36% Off', rating: 4.8, gender: 'unisex',  availability: 'ready-ship', imageUrl: '/assets/images/products/bestseller_5.png' },
  { id: '6',  title: 'Newborn Essentials Gift Hamper',           category: 'Gift Sets',           age: '0-3', price: 2499, originalPrice: 3500, discount: '29% Off', rating: 4.9, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_6.png' },
  { id: '7',  title: 'Personalised Star Print Blanket',          category: 'Swaddles & Blankets', age: '6-9', price: 1299, originalPrice: 1800, discount: '28% Off', rating: 4.7, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_1.png' },
  { id: '8',  title: 'Floral Cotton Baby Romper',                category: 'Onesies & Rompers',   age: '6-9', price: 799,  originalPrice: 1200, discount: '33% Off', rating: 4.5, gender: 'girl',    availability: 'pre-order',  imageUrl: '/assets/images/products/bestseller_2.png' },
  { id: '9',  title: 'Baby Name Cap & Booties Gift Set',         category: 'Gift Sets',           age: '9-12',price: 1850, originalPrice: 2500, discount: '26% Off', rating: 4.8, gender: 'unisex',  availability: 'ready-ship', imageUrl: '/assets/images/products/bestseller_3.png' },
];

const ALL_PRODUCTS = Array.from({ length: 85 }, (_, i) => {
  const base = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
  return { ...base, id: String(i + 1) };
});

const AGE_OPTIONS  = ['Newborn (0–3 Months)', '3–6 Months', '6–9 Months', '9–12 Months', '1–2 Years'];
const CATEGORIES   = ['Baby Essentials', 'Baby Clothing', 'New Born Essentials', 'Baby Shower Gifts', 'Nursery Essentials', 'Maternity Clothing', 'Diaper Caddy Organizer'];
const GENDERS      = ['Girl', 'Boy', 'Unisex'];
const AVAILABILITY = ['In Stock', 'Ready to Ship', 'Pre Order'];
const SORT_OPTIONS = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Customer Rating', 'Newest'];
const PAGE_SIZE    = 9;
const SWATCHES     = ['#A4C8E1', '#EDAABB', '#A8AA6A', '#FCE1B6'];

/* ── Collapsible Filter Section ── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="sp-filter-section">
      <button className="sp-filter-section-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="sp-filter-section-title">{title}</span>
        <span className="sp-filter-chevron">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="sp-filter-section-body">{children}</div>}
    </div>
  );
};

/* ── Shop Product Card ── */
const ShopCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted }) => {
  return (
    <div className="sp-card">
      <div className="sp-card-img-wrap">
        <Link to={`/product/${product.id}`}>
          <img src={product.imageUrl} alt={product.title} className="sp-card-img" loading="lazy" />
        </Link>
        <button
          className={`sp-card-heart ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product.id, !isWishlisted);
          }}
          aria-label="Add to wishlist"
        >
          <HeartIcon size={16} color="#D44D60" fill={isWishlisted ? '#D44D60' : 'none'} />
        </button>
      </div>

      <div className="sp-card-info">
        <div className="sp-card-meta-row">
          <div className="sp-card-swatches">
            {SWATCHES.map(c => (
              <span key={c} className="sp-card-swatch" style={{ background: c }} />
            ))}
            <span className="sp-card-options">+9 Options</span>
          </div>
          <div className="sp-card-rating">
            {product.rating} <StarIcon size={13} color="#F5A623" fill="#F5A623" />
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="sp-card-title-link">
          <p className="sp-card-title">{product.title}</p>
        </Link>

        <div className="sp-card-price-row">
          <span className="sp-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="sp-card-orig">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          <span className="sp-card-off">({product.discount})</span>
        </div>

        <button className="sp-card-atc" onClick={() => onAddToCart(product)}>ADD TO CART</button>
      </div>
    </div>
  );
};

/* ── Main Shop Page ── */
export const Shop = ({ onAddToCart, onToggleWishlist, wishlist = [] }) => {
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  const [sortBy, setSortBy]               = useState('Featured');
  const [sortOpen, setSortOpen]           = useState(false);
  const [currentPage, setCurrentPage]     = useState(1);
  const [priceMin, setPriceMin]           = useState(10);
  const [priceMax, setPriceMax]           = useState(3500);
  const [checkedAges, setCheckedAges]     = useState([]);
  const [checkedCats, setCheckedCats]     = useState([]);
  const [checkedGenders, setCheckedGenders] = useState([]);
  const [checkedAvail, setCheckedAvail]   = useState([]);

  const toggle = (setter, val) =>
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);

  const clearFilters = () => {
    setCheckedAges([]); setCheckedCats([]); setCheckedGenders([]); setCheckedAvail([]);
    setPriceMin(10); setPriceMax(3500); setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS].filter(p => p.price >= priceMin && p.price <= priceMax);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (categoryQuery) {
      const catLower = categoryQuery.toLowerCase();
      list = list.filter(p => {
        const pCat = p.category.toLowerCase();
        if (catLower === 'blankets' && pCat.includes('blanket')) return true;
        if (catLower === 'clothing' && (pCat.includes('clothing') || pCat.includes('onesie') || pCat.includes('romper'))) return true;
        if (catLower === 'maternity' && pCat.includes('maternity')) return true;
        if (catLower === 'nursery' && pCat.includes('nursery')) return true;
        if (catLower === 'boxes' && pCat.includes('gift')) return true;
        if (catLower === 'gifts' && pCat.includes('gift')) return true;
        return pCat.includes(catLower);
      });
    }

    if (checkedAges.length)    list = list.filter(p => checkedAges.some(a => a.toLowerCase().includes(p.age)));
    if (checkedCats.length)    list = list.filter(p => checkedCats.includes(p.category));
    if (checkedGenders.length) list = list.filter(p => checkedGenders.map(g => g.toLowerCase()).includes(p.gender));
    if (sortBy === 'Price: Low to High')  list.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low')  list.sort((a, b) => b.price - a.price);
    if (sortBy === 'Customer Rating')     list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [checkedAges, checkedCats, checkedGenders, checkedAvail, priceMin, priceMax, sortBy, searchQuery, categoryQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const goToPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handlePriceMin = (e) => { const v = Number(e.target.value); if (v < priceMax) { setPriceMin(v); setCurrentPage(1); } };
  const handlePriceMax = (e) => { const v = Number(e.target.value); if (v > priceMin) { setPriceMax(v); setCurrentPage(1); } };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, '…', totalPages];
  }, [totalPages]);

  const minPercent = ((priceMin - 10) / (3500 - 10)) * 100;
  const maxPercent = ((priceMax - 10) / (3500 - 10)) * 100;

  return (
    <div className="sp-page">

      {/* Breadcrumb */}
      <nav className="sp-breadcrumb" aria-label="breadcrumb">
        <Link to="/" className="sp-bc-link">Home</Link>
        <ChevronRightIcon size={14} color="#8E8E93" />
        <span className="sp-bc-active">Shop</span>
      </nav>

      <div className="sp-body">

        {/* ── LEFT FILTER SIDEBAR ── */}
        <aside className="sp-sidebar">
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-header">
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0" y1="2" x2="20" y2="2" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="6" cy="2" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4"/>
                <line x1="0" y1="8" x2="20" y2="8" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="14" cy="8" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4"/>
                <line x1="0" y1="14" x2="20" y2="14" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round"/>
                <circle cx="8" cy="14" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4"/>
              </svg>
              <span className="sp-sidebar-title">Filter</span>
            </div>

            <FilterSection title="Age">
              {AGE_OPTIONS.map(a => (
                <label key={a} className="sp-filter-checkbox-row">
                  <input type="checkbox" checked={checkedAges.includes(a)} onChange={() => { toggle(setCheckedAges, a); setCurrentPage(1); }} />
                  <span className="sp-filter-label">{a}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Price">
              <label className="sp-filter-checkbox-row">
                <input type="checkbox" onChange={() => { setPriceMin(10); setPriceMax(500); setCurrentPage(1); }} />
                <span className="sp-filter-label">Under 500</span>
              </label>
              <label className="sp-filter-checkbox-row">
                <input type="checkbox" onChange={() => { setPriceMin(500); setPriceMax(3500); setCurrentPage(1); }} />
                <span className="sp-filter-label">Over 500</span>
              </label>
              <div className="sp-price-slider-wrap">
                <div className="sp-price-label-row">
                  <span className="sp-price-label">₹ {priceMin}</span>
                  <span className="sp-price-sep">–</span>
                  <span className="sp-price-label">₹ {priceMax}</span>
                </div>
                <div className="sp-dual-range">
                  <div 
                    className="sp-range-track" 
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '4px',
                      transform: 'translateY(-50%)',
                      borderRadius: '2px',
                      background: `linear-gradient(to right, #E5E5EA ${minPercent}%, #E87722 ${minPercent}%, #E87722 ${maxPercent}%, #E5E5EA ${maxPercent}%)`
                    }}
                  />
                  <input 
                    type="range" 
                    min="10" 
                    max="3500" 
                    value={priceMin} 
                    onChange={handlePriceMin} 
                    className="sp-range sp-range-min"
                    style={{ zIndex: priceMin > 1750 ? 5 : 4 }}
                  />
                  <input 
                    type="range" 
                    min="10" 
                    max="3500" 
                    value={priceMax} 
                    onChange={handlePriceMax} 
                    className="sp-range sp-range-max"
                    style={{ zIndex: priceMin > 1750 ? 4 : 5 }}
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Category">
              {CATEGORIES.map(c => (
                <label key={c} className="sp-filter-checkbox-row">
                  <input type="checkbox" checked={checkedCats.includes(c)} onChange={() => { toggle(setCheckedCats, c); setCurrentPage(1); }} />
                  <span className="sp-filter-label">{c}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Gender">
              {GENDERS.map(g => (
                <label key={g} className="sp-filter-checkbox-row">
                  <input type="checkbox" checked={checkedGenders.includes(g)} onChange={() => { toggle(setCheckedGenders, g); setCurrentPage(1); }} />
                  <span className="sp-filter-label">{g}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Availability">
              {AVAILABILITY.map(av => (
                <label key={av} className="sp-filter-checkbox-row">
                  <input type="checkbox" checked={checkedAvail.includes(av)} onChange={() => { toggle(setCheckedAvail, av); setCurrentPage(1); }} />
                  <span className="sp-filter-label">{av}</span>
                </label>
              ))}
            </FilterSection>
          </div>
        </aside>

        {/* ── RIGHT GRID AREA ── */}
        <main className="sp-main">

          {/* Sort Bar */}
          <div className="sp-sort-bar">
            <p className="sp-count">Selected Products: <strong>{filtered.length}</strong></p>
            <div className="sp-sort-wrap">
              <button className="sp-sort-btn" onClick={() => setSortOpen(o => !o)} aria-haspopup="listbox" aria-expanded={sortOpen}>
                Sort by
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`sp-sort-chevron ${sortOpen ? 'open' : ''}`}><path d="M1 1L6 6L11 1" stroke="#2E2B28" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
              {sortOpen && (
                <ul className="sp-sort-dropdown" role="listbox">
                  {SORT_OPTIONS.map(opt => (
                    <li key={opt} role="option" aria-selected={sortBy === opt} className={sortBy === opt ? 'active' : ''} onClick={() => { setSortBy(opt); setSortOpen(false); setCurrentPage(1); }}>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {paginated.length > 0 ? (
            <div className="sp-product-grid">
              {paginated.map(p => (
                <ShopCard 
                  key={p.id} 
                  product={p} 
                  onAddToCart={onAddToCart} 
                  onToggleWishlist={onToggleWishlist} 
                  isWishlisted={wishlist.includes(p.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="sp-empty-state">
              <p>No products match your filters. <button onClick={clearFilters} className="sp-empty-clear">Clear filters</button></p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="sp-pagination" aria-label="Product page navigation">
              <button className="sp-pg-arrow" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>‹</button>
              {pageNumbers.map((n, i) =>
                n === '…'
                  ? <span key={`el-${i}`} className="sp-pg-ellipsis">....</span>
                  : <button key={n} className={`sp-pg-btn ${currentPage === n ? 'active' : ''}`} onClick={() => goToPage(n)}>{n}</button>
              )}
              <button className="sp-pg-arrow" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>›</button>
            </nav>
          )}
        </main>
      </div>
      <div className="sp-footer-separator" />
    </div>
  );
};

export default Shop;

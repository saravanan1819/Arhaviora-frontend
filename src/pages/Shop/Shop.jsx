import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HeartIcon, ChevronRightIcon } from '../../components/Icons/Icons';
import { useAsync } from '../../hooks/useAsync';
import { listCategories, listProducts } from '../../services/api/catalogue';
import { adaptCategory, adaptProductList, formatPrice } from '../../features/catalogue/adapters';
import './Shop.css';

// Sort options map onto the backend's supported sortBy / sortOrder values.
const SORT_OPTIONS = [
  { label: 'Default', sortBy: undefined, sortOrder: undefined },
  { label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' },
  { label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' },
  { label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' },
  { label: 'Name: A to Z', sortBy: 'name', sortOrder: 'asc' },
];
const PRICE_MIN = 10;
const PRICE_MAX = 3500;

/* ── Collapsible Filter Section ── */
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`sp-filter-section ${open ? 'open' : 'closed'}`}>
      <button className="sp-filter-section-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className="sp-filter-section-title">{title}</span>
        <span className="sp-filter-chevron sp-mobile-only">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }}>
            <path d="M1 6.5L6 1.5L11 6.5" stroke="#4D4E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div className="sp-filter-section-body">{children}</div>
    </div>
  );
};

/* ── Shop Product Card ── */
const ShopCard = ({ product, onToggleWishlist, isWishlisted }) => {
  const detailPath = `/product/${product.slug}`;
  return (
    <div className="sp-card">
      <div className="sp-card-img-wrap">
        <Link to={detailPath}>
          <img src={product.imageUrl} alt={product.title} className="sp-card-img" loading="lazy" />
        </Link>
        <button
          className={`sp-card-heart ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleWishlist(product.id, !isWishlisted);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon size={16} color="#D44D60" fill={isWishlisted ? '#D44D60' : 'none'} />
        </button>
      </div>

      <div className="sp-card-info">
        <Link to={detailPath} className="sp-card-title-link">
          <p className="sp-card-title">{product.title}</p>
        </Link>

        <div className="sp-card-price-row">
          <span className="sp-card-price">{formatPrice(product.price)}</span>
        </div>

        {/* A cart line needs a concrete variant, which the list does not carry. */}
        <Link to={detailPath} className="sp-card-atc" style={{ textAlign: 'center' }}>
          {product.isPersonalizable ? 'PERSONALIZE & ADD' : 'VIEW OPTIONS'}
        </Link>
      </div>
    </div>
  );
};

/* ── Main Shop Page ── */
export const Shop = ({ onToggleWishlist, wishlist = [] }) => {
  const [searchParams] = useSearchParams();
  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';

  const [sortIndex, setSortIndex] = useState(0);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceMin, setPriceMin] = useState(PRICE_MIN);
  const [priceMax, setPriceMax] = useState(PRICE_MAX);
  const [debouncedPrice, setDebouncedPrice] = useState({ min: PRICE_MIN, max: PRICE_MAX });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 6 : 9);

  const sort = SORT_OPTIONS[sortIndex];

  const categoriesState = useAsync(() => listCategories({ limit: 100 }), []);
  const categories = useMemo(
    () => (categoriesState.data?.categories || []).map(adaptCategory),
    [categoriesState.data]
  );

  // ?category=<slug> preselects the matching backend category.
  useEffect(() => {
    if (!categoryQuery || !categories.length) return;
    const match = categories.find((c) => c.slug === categoryQuery);
    setSelectedCategoryId(match ? match.id : null);
    setCurrentPage(1);
  }, [categoryQuery, categories]);

  useEffect(() => {
    const handleResize = () => setPageSize(window.innerWidth <= 768 ? 6 : 9);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPrice({ min: priceMin, max: priceMax }), 350);
    return () => clearTimeout(t);
  }, [priceMin, priceMax]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (filterOpen) {
      document.body.classList.add('sp-filter-active');
    } else {
      document.body.classList.remove('sp-filter-active');
    }
    return () => document.body.classList.remove('sp-filter-active');
  }, [filterOpen]);

  const toggleAccordion = (section) => {
    setActiveAccordion(prev => prev === section ? null : section);
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setPriceMin(PRICE_MIN); setPriceMax(PRICE_MAX); setCurrentPage(1);
  };

  const priceActive = debouncedPrice.min !== PRICE_MIN || debouncedPrice.max !== PRICE_MAX;
  const filtersActive = priceActive || Boolean(selectedCategoryId) || Boolean(searchQuery);

  const productsState = useAsync(
    () =>
      listProducts({
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        categoryId: selectedCategoryId || undefined,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
        minPrice: priceActive ? String(debouncedPrice.min) : undefined,
        maxPrice: priceActive ? String(debouncedPrice.max) : undefined,
      }),
    [currentPage, pageSize, searchQuery, selectedCategoryId, sortIndex, debouncedPrice.min, debouncedPrice.max]
  );

  const { products: paginated, pagination } = useMemo(
    () => adaptProductList(productsState.data || {}),
    [productsState.data]
  );
  const total = pagination.total;
  const totalPages = pagination.totalPages;

  const goToPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handlePriceMin = (e) => { const v = Number(e.target.value); if (v < priceMax) { setPriceMin(v); setCurrentPage(1); } };
  const handlePriceMax = (e) => { const v = Number(e.target.value); if (v > priceMin) { setPriceMax(v); setCurrentPage(1); } };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    return [1, 2, 3, '…', totalPages];
  }, [totalPages]);

  const minPercent = ((priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const sortList = (
    <ul className="sp-sort-dropdown" role="listbox">
      {SORT_OPTIONS.map((opt, i) => (
        <li
          key={opt.label}
          role="option"
          aria-selected={sortIndex === i}
          className={sortIndex === i ? 'active' : ''}
          onClick={() => { setSortIndex(i); setSortOpen(false); setCurrentPage(1); }}
        >
          {opt.label}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="sp-page">

      {/* Breadcrumb */}
      <nav className="sp-breadcrumb" aria-label="breadcrumb">
        <Link to="/" className="sp-bc-link">Home</Link>
        <ChevronRightIcon size={14} color="#8E8E93" />
        <span className="sp-bcw-active">Shop</span>
      </nav>

      <div className="sp-page-header sp-mobile-only">
        <h1 className="sp-page-title">Shop</h1>
        <p className="sp-page-count">{total} Products</p>
      </div>

      <div className="sp-sort-bar sp-mobile-sort-bar sp-mobile-only">
        <div className="sp-sort-wrap">
          <button
            className="sp-mobile-filter-toggle"
            onClick={() => setFilterOpen(o => !o)}
            aria-label="Toggle filters"
            aria-expanded={filterOpen}
          >
            <svg width="16" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="0" y1="2" x2="20" y2="2" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="6" cy="2" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4" />
              <line x1="0" y1="8" x2="20" y2="8" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="14" cy="8" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4" />
              <line x1="0" y1="14" x2="20" y2="14" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="8" cy="14" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4" />
            </svg>
            <span>Filter</span>
            {filtersActive && <span className="sp-filter-dot" aria-hidden="true"></span>}
          </button>
          <button
            className="sp-sort-btn"
            onClick={() => setSortOpen(o => !o)}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
          >
            Sort by
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`sp-sort-chevron ${sortOpen ? 'open' : ''}`}><path d="M1 1L6 6L11 1" stroke="#2E2B28" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          {sortOpen && sortList}
        </div>
      </div>

      <div className="sp-body">

        {/* ── MOBILE FILTER BACKDROP ── */}
        {filterOpen && <div className="sp-sidebar-backdrop" onClick={() => setFilterOpen(false)} aria-hidden="true" />}

        {/* ── LEFT FILTER SIDEBAR ── */}
        <aside className={`sp-sidebar ${filterOpen ? 'sp-sidebar-open' : ''}`}>
          <div className="sp-sidebar-card">
            <div className="sp-sidebar-drag-handle" aria-hidden="true" onClick={() => setFilterOpen(false)}></div>
            <div className="sp-sidebar-header">
              <div className="sp-sidebar-header-left">
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-sidebar-icon">
                  <line x1="0" y1="2" x2="20" y2="2" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="6" cy="2" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4" />
                  <line x1="0" y1="8" x2="20" y2="8" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="14" cy="8" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4" />
                  <line x1="0" y1="14" x2="20" y2="14" stroke="#2E2B28" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="8" cy="14" r="2.5" fill="#F9F9F9" stroke="#2E2B28" strokeWidth="1.4" />
                </svg>
                <span className="sp-sidebar-title">Filter</span>
              </div>
              <button className="sp-sidebar-clear-btn" onClick={clearFilters}>Clear All</button>
            </div>

            <FilterSection title="Price">
              <div className="sp-desktop-only">
                <div className="sp-price-label-row" style={{ marginTop: '12px' }}>
                  <span className="sp-price-label">₹ {priceMin}</span>
                  <span className="sp-price-sep">–</span>
                  <span className="sp-price-label">₹ {priceMax}</span>
                </div>
              </div>

              <div className="sp-price-inputs sp-mobile-only">
                <div className="sp-price-input-box">₹ {priceMin}</div>
                <div className="sp-price-input-box">₹ {priceMax}</div>
              </div>

              <div className="sp-price-slider-wrap">
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
                      background: `linear-gradient(to right, #E5E5EA ${minPercent}%, #D44D60 ${minPercent}%, #D44D60 ${maxPercent}%, #E5E5EA ${maxPercent}%)`
                    }}
                  />
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    value={priceMin}
                    onChange={handlePriceMin}
                    className="sp-range sp-range-min"
                    style={{ zIndex: priceMin > 1750 ? 5 : 4 }}
                  />
                  <input
                    type="range"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    value={priceMax}
                    onChange={handlePriceMax}
                    className="sp-range sp-range-max"
                    style={{ zIndex: priceMin > 1750 ? 4 : 5 }}
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Category">
              {categoriesState.loading && <p className="sp-filter-label" role="status">Loading categories…</p>}
              {categoriesState.error && (
                <p className="sp-filter-label" role="alert">{categoriesState.error.message}</p>
              )}
              {!categoriesState.loading && !categoriesState.error && categories.length === 0 && (
                <p className="sp-filter-label">No categories available.</p>
              )}
              {categories.map(c => (
                <label key={c.id} className="sp-filter-checkbox-row">
                  <input
                    type="checkbox"
                    checked={selectedCategoryId === c.id}
                    onChange={() => { setSelectedCategoryId(prev => (prev === c.id ? null : c.id)); setCurrentPage(1); }}
                  />
                  <span className="sp-filter-label">{c.name}</span>
                </label>
              ))}
            </FilterSection>

            {/* Mobile Footer (Reset & Apply) */}
            <div className="sp-sidebar-footer">
              <button className="sp-sidebar-footer-btn sp-sidebar-reset" onClick={clearFilters}>RESET</button>
              <button className="sp-sidebar-footer-btn sp-sidebar-apply" onClick={() => setFilterOpen(false)}>APPLY FILTERS</button>
            </div>

            {/* Custom Mobile Filter Footer */}
            <div className="sp-filter-mobile-footer sp-mobile-only">
              <div className="sp-fmf-accordion">
                <div className={`sp-fmf-section ${activeAccordion === 'shop' ? 'active' : ''}`}>
                  <h5 onClick={() => toggleAccordion('shop')}>
                    Shop
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="sp-fmf-chevron">
                      <path d="M1 1.5L6 6.5L11 1.5" stroke="#4D4E5E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </h5>
                  <ul className="sp-fmf-links">
                    {categories.map(c => (
                      <li key={c.id}><Link to={`/shop?category=${c.slug}`}>{c.name}</Link></li>
                    ))}
                    <li><Link to="/shop">All Products</Link></li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </aside>

        {/* ── RIGHT GRID AREA ── */}
        <main className={`sp-main ${filterOpen ? 'sp-hidden-mobile' : ''}`}>

          <div className="sp-sort-bar">
            <p className="sp-count sp-desktop-only">Selected Products: <strong>{total}</strong></p>
            <div className="sp-sort-wrap">
              <button className="sp-sort-btn sp-desktop-only" onClick={() => setSortOpen(o => !o)} aria-haspopup="listbox" aria-expanded={sortOpen}>
                Sort by
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className={`sp-sort-chevron ${sortOpen ? 'open' : ''}`}><path d="M1 1L6 6L11 1" stroke="#2E2B28" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
              {sortOpen && sortList}
            </div>
          </div>

          {/* Product Grid */}
          {productsState.loading && paginated.length === 0 ? (
            <div className="sp-empty-state" role="status"><p>Loading products…</p></div>
          ) : productsState.error ? (
            <div className="sp-empty-state" role="alert">
              <p>{productsState.error.message} <button onClick={productsState.reload} className="sp-empty-clear">Try again</button></p>
            </div>
          ) : paginated.length > 0 ? (
            <div className="sp-product-grid" style={{ opacity: productsState.loading ? 0.6 : 1 }}>
              {paginated.map(p => (
                <ShopCard
                  key={p.id}
                  product={p}
                  onToggleWishlist={onToggleWishlist}
                  isWishlisted={wishlist.includes(p.id)}
                />
              ))}
            </div>
          ) : (
            filtersActive ? (
              <div className="sp-empty-state">
                <p>No products match your filters. <button onClick={clearFilters} className="sp-empty-clear">Clear filters</button></p>
              </div>
            ) : (
              <div className="sp-empty-state" role="status">
                <p>Our collection is being prepared. Please check back soon.</p>
              </div>
            )
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

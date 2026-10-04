import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { StarIcon, HeartIcon, ShieldCheckIcon, TruckIcon, GiftIcon, PlusIcon, MinusIcon, PlayIcon, CheckCircleIcon, ShoppingBagIcon, UserIcon, SparkleIcon, ArrowRightIcon } from '../../components/Icons/Icons';
import { Personalizer } from '../../components/Personalizer/Personalizer';
import { useAsync } from '../../hooks/useAsync';
import { listProducts } from '../../services/api/catalogue';
import { adaptProductList, formatPrice } from '../../features/catalogue/adapters';
import { heroSlides, collections, promiseItems, faqItems } from '../../data/homeData';
import './Home.css';

export const Home = ({ onToggleWishlist = () => { }, wishlist = [] }) => {
  const [activeFaq, setActiveFaq] = useState(-1);
  const { hash } = useLocation();

  // Router links do not scroll to #anchors on navigation, so do it here.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  }, [hash]);

  const collTrackRef = useRef(null);
  const [collScrollProgress, setCollScrollProgress] = useState(0);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleCollScroll = () => {
    if (collTrackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = collTrackRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setCollScrollProgress(scrollLeft / maxScroll);
      }
    }
  };

  const featuredState = useAsync(() => listProducts({ isFeatured: 'true', limit: 6 }), []);
  const bestSellers = adaptProductList(featuredState.data || {}).products;

  return (
    <main className="hp-root">

      {/* 1. HERO SECTION */}
      <section className="hp-hero">
        <div className="hp-hero-slider-wrapper">
          <div
            className="hp-hero-track"
            style={{
              transform: `translateX(-${currentSlide * (100 / heroSlides.length)}%)`,
              width: `${heroSlides.length * 100}%`
            }}
          >
            {heroSlides.map((slide, idx) => (
              <div
                key={idx}
                className="hp-hero-card"
                style={{
                  width: `${100 / heroSlides.length}%`,
                  minWidth: `${100 / heroSlides.length}%`
                }}
              >
                <img src={slide.image} alt={slide.title} className="hp-hero-img" />
                <div className="hp-hero-overlay">
                  <div className="hp-hero-content">
                    <h1 className="hp-hero-h1">{slide.title}</h1>
                    <p className="hp-hero-p">{slide.subtitle}</p>
                    <div className="hp-hero-btns">
                      <Link to={slide.ctaLink} className="hp-btn-rose">
                        {slide.ctaText}
                        <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span>
                      </Link>
                      <Link to="/shop" className="hp-btn-outline-white">Explore Collection</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hp-hero-dots">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`hp-dot ${currentSlide === idx ? 'hp-dot-rose' : 'hp-dot-sm'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="hp-cat-pills">
          <Link to="/shop?category=newborn" className="hp-cat-pill"><span className="hp-cat-icon"><ShoppingBagIcon size={18} color="#D44D60" /></span> Newborn Essentials</Link>
          <Link to="/shop?category=babyshower" className="hp-cat-pill"><span className="hp-cat-icon"><UserIcon size={18} color="#D44D60" /></span> Baby shower Gifts</Link>
          <Link to="/shop?category=blankets" className="hp-cat-pill"><span className="hp-cat-icon"><SparkleIcon size={18} color="#D44D60" /></span> Personalized Blanket</Link>
          <Link to="/shop?category=diaperbags" className="hp-cat-pill"><span className="hp-cat-icon"><GiftIcon size={18} color="#D44D60" /></span> Diaper bags</Link>
          <Link to="/shop?category=nursery" className="hp-cat-pill"><span className="hp-cat-icon"><ShoppingBagIcon size={18} color="#D44D60" /></span> Nursery Decor</Link>
        </div>
      </section>

      {/* 2. OUR COLLECTIONS */}
      <section className="hp-collections">
        <div className="hp-coll-container">
          <div className="hp-section-pre">Shop By Collection</div>
          <h2 className="hp-section-h2">Explore Our Most Loved Collection</h2>
          <div className="hp-coll-track" ref={collTrackRef} onScroll={handleCollScroll}>
            {collections.map((col) => (
              <Link key={col.id} to={col.link} className="hp-coll-card">
                <img src={col.image} alt={col.title} className="hp-coll-img" />
                <div className="hp-coll-overlay">
                  <span className="hp-coll-label">{col.title}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="hp-coll-scroll-track">
            <div className="hp-coll-scroll-thumb" style={{ left: `${collScrollProgress * (100 - (4 / collections.length) * 100)}%` }}></div>
          </div>
        </div>
      </section>

      {/* 3. BESTSELLERS */}
      <section className="hp-bestsellers">
        <div className="hp-section-pre hp-pre-rose">Best Seller</div>
        <h2 className="hp-section-h2">Discover what parents love most</h2>
        {featuredState.loading ? (
          <p className="hp-section-sub" role="status">Loading best sellers…</p>
        ) : featuredState.error ? (
          <p className="hp-section-sub" role="alert">
            {featuredState.error.message}{' '}
            <button type="button" onClick={featuredState.reload}>Try again</button>
          </p>
        ) : bestSellers.length === 0 ? (
          <p className="hp-section-sub">No featured products yet. Check back soon.</p>
        ) : (
        <div className="hp-bs-grid">
          {bestSellers.map((p) => {
            const isWishlisted = wishlist.includes(p.id);
            const detailPath = `/product/${p.slug}`;
            return (
              <div key={p.id} className="hp-bs-card">
                <div className="hp-bs-img-wrap">
                  <Link to={detailPath}><img src={p.imageUrl} alt={p.title} className="hp-bs-img" /></Link>
                  <span className="hp-bs-badge">Best Seller</span>
                  <button className={`hp-bs-heart ${isWishlisted ? 'active' : ''}`} onClick={() => onToggleWishlist(p.id, !isWishlisted)} aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                    <HeartIcon size={16} color="#D44D60" fill={isWishlisted ? '#D44D60' : 'none'} />
                  </button>
                </div>
                <div className="hp-bs-info">
                  <Link to={detailPath} className="hp-bs-title">{p.title}</Link>
                  <div className="hp-bs-price-row">
                    <span className="hp-bs-price">{formatPrice(p.price)}</span>
                  </div>
                  <Link to={detailPath} className="hp-bs-atc" style={{ textAlign: 'center' }}>
                    {p.isPersonalizable ? 'PERSONALIZE & ADD' : 'VIEW OPTIONS'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}
        <div className="hp-bs-view-all">
          <Link to="/shop" className="hp-btn-rose">View All Products <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span></Link>
        </div>
      </section>

      {/* 4. OUR RANGE */}
      <section className="hp-range">
        <div className="hp-section-pre hp-pre-rose">OUR NEW RANGE</div>
        <h2 className="hp-section-h2">For Every Beautiful Journey</h2>
        <p className="hp-section-sub">From your baby's first outfit to your<br />motherhood moments.</p>
        <div className="hp-range-grid">
          <div className="hp-range-card">
            <img src="/assets/images/range/baby_clothing.png" alt="Baby Clothing" className="hp-range-img" />
            <div className="hp-range-overlay">
              <h3 className="hp-range-title">Baby Clothing</h3>
              <p className="hp-range-desc">Soft, comfortable outfits thoughtfully designed for<br />your little one's everyday moments.</p>
              <Link to="/shop?category=clothing" className="hp-btn-rose">
                Explore Collection <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span>
              </Link>
            </div>
          </div>
          <div className="hp-range-card">
            <img src="/assets/images/range/maternity_clothing.png" alt="Maternity Clothing" className="hp-range-img" />
            <div className="hp-range-overlay">
              <h3 className="hp-range-title">Maternity Clothing</h3>
              <p className="hp-range-desc">Elegant maternity styles designed for comfort through<br />every stage of motherhood.</p>
              <Link to="/shop?category=maternity" className="hp-btn-rose">
                Explore Collection <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PERSONALIZER */}
      <section className="hp-personalizer" id="personalizer-section">
        <Personalizer showSectionHeading={true} showGiftMessage={false} />
      </section>

      {/* 6. OUR PROMISE */}
      <section className="hp-promise">
        <h2 className="hp-section-h2">The Arhaviora Promise</h2>
        <p className="hp-section-sub">Every baby deserves something special. Arhaviora creates premium, personalized products that<br />become treasured keepsakes for families.</p>
        <div className="hp-promise-layout">
          <div className="hp-promise-img-col">
            <img src="/assets/images/promise/artisan_craftsmanship.png" alt="Artisan craftsmanship" className="hp-promise-img" />
          </div>
          <div className="hp-promise-list">
            {promiseItems.map((item, i) => (
              <div key={i} className="hp-promise-item">
                <div className="hp-promise-accent"></div>
                <div>
                  <div className="hp-promise-title">{item.title}</div>
                  <div className="hp-promise-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. GIFTING */}
      <section className="hp-gifting">
        <div className="hp-section-pre hp-pre-rose">Personalized Gifting</div>
        <h2 className="hp-section-h2">Create The Perfect Gift For Every<br />Little Moments</h2>
        <p className="hp-section-sub">Find meaningful gifts for every precious beginning and celebration.</p>
        <div className="hp-gift-grid">
          <div className="hp-gift-card">
            <img src="/assets/images/gifting/newborn_gift_box.png" alt="Newborn Gift Box" className="hp-gift-img" />
            <div className="hp-gift-overlay">
              <h3 className="hp-gift-title">Newborn Gift Box</h3>
              <p className="hp-gift-desc">Browse newborn essentials that make thoughtful gifts.</p>
              <Link to="/shop?category=newborn" className="hp-btn-rose hp-btn-sm">Shop Newborn Essentials <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span></Link>
            </div>
          </div>
          <div className="hp-gift-card">
            <img src="/assets/images/gifting/baby_shower_gifts.png" alt="Baby Shower Gifts" className="hp-gift-img" />
            <div className="hp-gift-overlay">
              <h3 className="hp-gift-title">Baby Shower Gifts</h3>
              <p className="hp-gift-desc">Explore beautifully curated gifts for baby showers and celebrations.</p>
              <Link to="/shop?category=babyshower" className="hp-btn-rose hp-btn-sm">Explore Baby Shower Gifts <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span></Link>
            </div>
          </div>
        </div>
        <div className="hp-pers-benefits">
          <div className="hp-benefit"><div className="hp-ben-icon"><GiftIcon size={20} color="#D44D60" /></div><div><div className="hp-ben-title">Thoughtfully Curated</div><div className="hp-ben-sub">Handpicked with love</div></div></div>
          <div className="hp-benefit-divider"></div>
          <div className="hp-benefit"><div className="hp-ben-icon"><TruckIcon size={20} color="#D44D60" /></div><div><div className="hp-ben-title">Beautifully Delivered</div><div className="hp-ben-sub">Perfectly packed, on time</div></div></div>
          <div className="hp-benefit-divider"></div>
          <div className="hp-benefit"><div className="hp-ben-icon"><HeartIcon size={20} color="#D44D60" /></div><div><div className="hp-ben-title">Personalized for You</div><div className="hp-ben-sub">Add names, initials &amp; more</div></div></div>
          <div className="hp-benefit-divider"></div>
          <div className="hp-benefit"><div className="hp-ben-icon"><ShieldCheckIcon size={20} color="#D44D60" /></div><div><div className="hp-ben-title">Premium Quality</div><div className="hp-ben-sub">Safe, soft &amp; baby-friendly</div></div></div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section className="hp-faq">
        <div className="hp-faq-layout">
          <div className="hp-faq-left">
            <h2 className="hp-faq-h2">Frequently<br />Asked<br />Questions</h2>
          </div>
          <div className="hp-faq-right">
            {faqItems.map((item, idx) => (
              <div key={idx} className={`hp-faq-item${activeFaq === idx ? ' hp-faq-open' : ''}`}>
                <button className="hp-faq-btn" onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}>
                  <span className="hp-faq-icon">{activeFaq === idx ? <MinusIcon size={16} /> : <PlusIcon size={16} />}</span>
                  <span className="hp-faq-q">{item.q}</span>
                </button>
                {activeFaq === idx && <div className="hp-faq-ans"><p>{item.a}</p></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CTA */}
      <section className="hp-final-cta">
        <div className="hp-cta-inner">
          <div className="hp-cta-img-left">
            <img src="/assets/images/keepsakes/keepsake_1.png" alt="Keepsake" className="hp-cta-img hp-cta-img-tilt-l" />
          </div>
          <div className="hp-cta-center">
            <h2 className="hp-cta-h2">Create Something<br />Truly Yours</h2>
            <p className="hp-cta-p">Personalize A Gift That's Made With Love, Designed To Celebrate Every Little Moment.</p>
            <div className="hp-cta-btns">
              <Link to="/shop?category=personalized" className="hp-btn-rose">Start Personalizing <span className="hp-btn-icon-circle"><img src="/assets/icons/right_arrow.png" alt="Arrow" width="28" height="28" style={{ display: 'block' }} /></span></Link>
              <Link to="/shop" className="hp-btn-outline-rose">Explore Collection</Link>
            </div>
          </div>
          <div className="hp-cta-img-right">
            <img src="/assets/images/keepsakes/keepsake_2.png" alt="Keepsake" className="hp-cta-img hp-cta-img-tilt-rt" />
            <img src="/assets/images/keepsakes/keepsake_3.png" alt="Keepsake" className="hp-cta-img hp-cta-img-tilt-rb" />
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;

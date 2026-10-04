// Maps backend catalogue payloads onto the shapes the UI components use, so
// backend field names stay out of the components. Prices are display values
// only: the backend (cart / checkout summary) is authoritative for charging.

export const PLACEHOLDER_IMAGE = '/assets/images/products/bestseller_1.png';

const toNumber = (value) => (value == null || value === '' ? null : Number(value));

export const adaptCategory = (c) => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  parentId: c.parentId ?? null,
});

// GET /products list item
export const adaptProductListItem = (p) => ({
  id: p.id,
  slug: p.slug,
  title: p.name,
  price: toNumber(p.price),
  imageUrl: p.primaryImageUrl || PLACEHOLDER_IMAGE,
  isFeatured: Boolean(p.isFeatured),
  isPersonalizable: Boolean(p.isPersonalizable),
  categoryId: p.categoryId,
});

export const adaptProductList = ({ products = [], pagination = {} } = {}) => ({
  products: products.map(adaptProductListItem),
  pagination: {
    page: pagination.page ?? 1,
    totalPages: pagination.totalPages ?? 1,
    total: pagination.total ?? products.length,
  },
});

// GET /products/:slug
export const adaptProductDetail = (p) => ({
  id: p.id,
  slug: p.slug,
  title: p.name,
  description: p.description || '',
  category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : null,
  isPersonalizable: Boolean(p.isPersonalizable),
  personalization: {
    maxCharacters: p.personalizationMaxCharacters ?? null,
    baseCharge: toNumber(p.personalizationBaseCharge) || 0,
    perCharacter: toNumber(p.personalizationPricePerCharacter) || 0,
  },
  variants: (p.variants || [])
    .filter((v) => v.isActive)
    .map((v) => ({
      id: v.id,
      sku: v.sku,
      attributes: v.attributes || {},
      isDefault: Boolean(v.isDefault),
      price: toNumber(v.effectiveSellingPrice),
      compareAtPrice: toNumber(v.effectiveCompareAtPrice),
    })),
  images: (p.images || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.altText || p.name,
      isPrimary: Boolean(img.isPrimary),
      variantId: img.productVariantId ?? null,
    })),
});

export const variantLabel = (variant) => {
  const parts = Object.values(variant?.attributes || {});
  return parts.length ? parts.join(' / ') : variant?.sku || 'Default';
};

export const discountPercent = (price, compareAtPrice) =>
  compareAtPrice && price != null && compareAtPrice > price
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

export const formatPrice = (value) =>
  value == null ? '' : `₹${Number(value).toLocaleString('en-IN')}`;

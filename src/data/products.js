export const BASE_PRODUCTS = [
  { id: '1',  title: 'Personalized Muslin Baby Blanket',         category: 'Swaddles & Blankets', age: '0-3', price: 1400, originalPrice: 1800, discount: '22% Off', rating: 4.8, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_1.png' },
  { id: '2',  title: 'Organic Muslin Swaddle & Wrap Set',        category: 'Swaddles & Blankets', age: '0-3', price: 999,  originalPrice: 1500, discount: '33% Off', rating: 4.7, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_2.png' },
  { id: '3',  title: 'Embroidered Name Baby Onesie',             category: 'Onesies & Rompers',   age: '3-6', price: 650,  originalPrice: 900,  discount: '28% Off', rating: 4.9, gender: 'girl',    availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_3.png' },
  { id: '4',  title: 'Bamboo Cotton Romper with Name',           category: 'Onesies & Rompers',   age: '3-6', price: 749,  originalPrice: 1100, discount: '32% Off', rating: 4.6, gender: 'boy',     availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_4.png' },
  { id: '5',  title: 'Baby Beanie & Mittens Set',                category: 'Accessories & Caps',  age: '0-3', price: 450,  originalPrice: 699,  discount: '36% Off', rating: 4.8, gender: 'unisex',  availability: 'ready-ship', imageUrl: '/assets/images/products/bestseller_5.png' },
  { id: '6',  title: 'Newborn Essentials Gift Hamper',           category: 'Gift Sets',           age: '0-3', price: 2499, originalPrice: 3500, discount: '29% Off', rating: 4.9, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_6.png' },
  { id: '7',  title: 'Personalised Star Print Blanket',          category: 'Swaddles & Blankets', age: '6-9', price: 1299, originalPrice: 1800, discount: '28% Off', rating: 4.7, gender: 'unisex',  availability: 'in-stock',   imageUrl: '/assets/images/products/bestseller_1.png' },
  { id: '8',  title: 'Floral Cotton Baby Romper',                category: 'Onesies & Rompers',   age: '6-9', price: 799,  originalPrice: 1200, discount: '33% Off', rating: 4.5, gender: 'girl',    availability: 'pre-order',  imageUrl: '/assets/images/products/bestseller_2.png' },
  { id: '9',  title: 'Baby Name Cap & Booties Gift Set',         category: 'Gift Sets',           age: '9-12',price: 1850, originalPrice: 2500, discount: '26% Off', rating: 4.8, gender: 'unisex',  availability: 'ready-ship', imageUrl: '/assets/images/products/bestseller_3.png' },
];

const DEFAULT_DESC = "Ultra- soft organic muslin blanket, specially crafted for your little one. Personalize with your baby's name and create a beautiful keepsake.";

const DEFAULT_DETAILS = [
  { label: "Material", value: "Premium organic Muslin" },
  { label: "Size", value: "100 cm x 100 cm" },
  { label: "Fabric", value: "4 Layer Muslin" },
  { label: "Age", value: "Newborn" },
  { label: "Washing", value: "Machine Wash (Gentle Cycle)" },
  { label: "Personalization", value: "Name Embroidery (Hand-finished)" },
  { label: "Thread Type", value: "Organic Cotton Thread" },
  { label: "Safety Standards", value: "Non-toxic, AZO-free dyes" },
  { label: "Certifications", value: "OEKO-TEX® Standard 100" },
  { label: "Gifting Package", value: "Includes premium signature gift box" },
  { label: "Origin", value: "Proudly handcrafted in India" }
];

const DEFAULT_REVIEW_STATS = [
  { label: 'Excellent', count: 100, pct: 80 },
  { label: 'Good', count: 11, pct: 15 },
  { label: 'Average', count: 3, pct: 5 },
  { label: 'Below Average', count: 8, pct: 8 },
  { label: 'Poor', count: 1, pct: 2 }
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Priya R',
    avatar: '/assets/images/avatars/user_1.png',
    rating: 5,
    date: '24 January 2026',
    content: 'I absolutely loved the quality of the blanket. The embroidery was beautifully done, and the fabric is incredibly soft for my newborn. It arrived in premium gift packaging, making it perfect for our baby\'s naming ceremony. Highly recommended!'
  },
  {
    id: 2,
    name: 'Meera S',
    avatar: '/assets/images/avatars/user_2.png',
    rating: 5,
    date: '21 May 2026',
    content: 'The personalization exceeded my expectations. The stitching is neat, the material feels luxurious, and my baby sleeps comfortably wrapped in it. It\'s one of the best baby purchases I\'ve made.'
  },
  {
    id: 3,
    name: 'Darcy King',
    avatar: '/assets/images/avatars/user_3.png',
    rating: 4,
    date: '2 July 2026',
    content: 'I ordered this as a baby shower gift for my sister, and everyone loved it. The custom name embroidery made it feel so special, and the packaging looked elegant. I\'ll definitely order again.',
    images: [
      '/assets/images/keepsakes/keepsake_1.png',
      '/assets/images/keepsakes/keepsake_2.png'
    ]
  },
  {
    id: 4,
    name: 'John Malcolm',
    avatar: '/assets/images/avatars/user_4.png',
    rating: 4,
    date: '24 January 2023',
    content: 'In Washington, it is already difficult to surprise with the opening of a new institution, but it is still possible. Especially if it is a True Cost project. Here you pay'
  },
  {
    id: 5,
    name: 'Sarah L',
    avatar: '/assets/images/avatars/user_1.png',
    rating: 5,
    date: '15 August 2026',
    content: 'Absolutely stunning! The attention to detail is remarkable, and the customer service was fantastic.'
  }
];

export const ALL_PRODUCTS = Array.from({ length: 85 }, (_, i) => {
  const base = BASE_PRODUCTS[i % BASE_PRODUCTS.length];
  return { 
    ...base, 
    id: String(i + 1),
    description: DEFAULT_DESC,
    details: DEFAULT_DETAILS,
    reviewsCount: 298,
    reviewStats: DEFAULT_REVIEW_STATS,
    reviews: DEFAULT_REVIEWS
  };
});

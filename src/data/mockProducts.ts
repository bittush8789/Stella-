import { Product } from '../types/microservices';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. T-Shirts (5)
  {
    id: 'prod-tsh-001',
    name: 'Shirt Soft Cotton',
    category: 'T-Shirts',
    brand: 'Uniqlo',
    price: 1299,
    discountPrice: 799,
    description: 'Ultra-soft Supima cotton t-shirt with tailored crew neckline and breathable knit structure. Pre-shrunk for an enduring fit.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Chalk White', hex: '#F8FAFC' },
      { name: 'Heather Gray', hex: '#94A3B8' },
      { name: 'Onyx Black', hex: '#0F172A' },
      { name: 'Sage Green', hex: '#4ade80' }
    ],
    stock: 12,
    rating: 4.8,
    reviewsCount: 142,
    status: 'new_arrival',
    material: '100% Supima Cotton',
    fit: 'Regular Fit',
    featured: true
  },
  {
    id: 'prod-tsh-002',
    name: 'Dri-FIT Breathe Performance Tee',
    category: 'T-Shirts',
    brand: 'Nike',
    price: 1899,
    discountPrice: 1299,
    description: 'Engineered sweat-wicking knit crafted for high movement and everyday urban commuting.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Obsidian Navy', hex: '#1E293B' },
      { name: 'Pure White', hex: '#FFFFFF' },
      { name: 'Crimson Red', hex: '#EF4444' }
    ],
    stock: 28,
    rating: 4.7,
    reviewsCount: 89,
    status: 'in_stock',
    material: '92% Recycled Polyester, 8% Elastane',
    fit: 'Athletic Slim'
  },
  {
    id: 'prod-tsh-003',
    name: 'Oversized Heavyweight Pocket Tee',
    category: 'T-Shirts',
    brand: 'Zara',
    price: 1699,
    discountPrice: 1099,
    description: '280 GSM heavy jersey tee with dropped shoulders, boxy drape, and reinforced single chest patch pocket.',
    availableSizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Washed Charcoal', hex: '#334155' },
      { name: 'Desert Sand', hex: '#D7C4A5' },
      { name: 'Dusty Teal', hex: '#0D9488' }
    ],
    stock: 7,
    rating: 4.5,
    reviewsCount: 64,
    status: 'low_stock',
    material: '100% Organic Heavy Cotton',
    fit: 'Relaxed Boxy'
  },
  {
    id: 'prod-tsh-004',
    name: 'Trefoil Heritage Graphic T-Shirt',
    category: 'T-Shirts',
    brand: 'Adidas',
    price: 1599,
    discountPrice: 999,
    description: 'Classic streetwear graphic silhouette featuring iconic archived athletic heritage print.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Core Black', hex: '#111827' },
      { name: 'Cloud White', hex: '#F9FAFB' }
    ],
    stock: 35,
    rating: 4.6,
    reviewsCount: 110,
    status: 'in_stock',
    material: '100% Single Jersey Cotton',
    fit: 'Standard Fit'
  },
  {
    id: 'prod-tsh-005',
    name: 'Raw Hem Essential V-Neck Tee',
    category: 'T-Shirts',
    brand: 'H&M',
    price: 999,
    discountPrice: 699,
    description: 'Minimalist lightweight summer v-neck with subtle raw edge stitch detailing.',
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'Olive Green', hex: '#4B5563' },
      { name: 'Muted Sky', hex: '#38BDF8' }
    ],
    stock: 19,
    rating: 4.3,
    reviewsCount: 45,
    status: 'in_stock',
    material: '100% Combed Cotton',
    fit: 'Regular Fit'
  },

  // 2. Shirts (5)
  {
    id: 'prod-shr-006',
    name: 'Zip Up Neck Shirt',
    category: 'Shirts',
    brand: 'Uniqlo',
    price: 2499,
    discountPrice: 1499,
    description: 'Contemporary quarter-zip knit polo shirt woven from fine-gauge mercerized yarn with ribbed collar and cuffs.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Heather Gray', hex: '#94A3B8' },
      { name: 'Midnight Navy', hex: '#0F172A' },
      { name: 'Cream Ivory', hex: '#F8FAFC' }
    ],
    stock: 12,
    rating: 4.9,
    reviewsCount: 204,
    status: 'new_arrival',
    material: '85% Cotton, 15% Mulberry Silk',
    fit: 'Tailored Fit',
    featured: true
  },
  {
    id: 'prod-shr-007',
    name: 'Classic Long Sleeve Linen Shirt',
    category: 'Shirts',
    brand: 'Uniqlo',
    price: 2199,
    discountPrice: 1299,
    description: 'Breezy French linen button-down designed for crisp Mediterranean style and all-day thermal comfort.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Cool Slate', hex: '#64748B' },
      { name: 'Sky Cyan', hex: '#06B6D4' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    stock: 12,
    rating: 4.7,
    reviewsCount: 178,
    status: 'new_arrival',
    material: '100% Premium French Linen',
    fit: 'Regular Casual'
  },
  {
    id: 'prod-shr-008',
    name: 'Oxford Cotton Button-Down Shirt',
    category: 'Shirts',
    brand: 'Ralph Lauren',
    price: 5999,
    discountPrice: 4299,
    description: 'Signature tailored Oxford garment woven with textured basketweave weave and embroidered iconic crest.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Light Blue', hex: '#93C5FD' },
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Soft Pink', hex: '#F472B6' }
    ],
    stock: 16,
    rating: 4.9,
    reviewsCount: 312,
    status: 'in_stock',
    material: '100% Pima Cotton',
    fit: 'Custom Slim Fit'
  },
  {
    id: 'prod-shr-009',
    name: 'Textured Cuban Collar Camp Shirt',
    category: 'Shirts',
    brand: 'Zara',
    price: 2699,
    discountPrice: 1799,
    description: 'Retro resort silhouette with open notch lapel and subtle geometric jacquard open-knit texture.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Earthy Clay', hex: '#CA8A04' },
      { name: 'Off White', hex: '#F1F5F9' }
    ],
    stock: 8,
    rating: 4.6,
    reviewsCount: 77,
    status: 'low_stock',
    material: '60% Tencel, 40% Cotton',
    fit: 'Relaxed Fit'
  },
  {
    id: 'prod-shr-010',
    name: 'Utility Workwear Overshirt',
    category: 'Shirts',
    brand: 'Levi\'s',
    price: 3499,
    discountPrice: 2499,
    description: 'Rugged heavy cotton twill overshirt with dual front flap bellows pockets and matte horn buttons.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Military Khaki', hex: '#78716C' },
      { name: 'Deep Indigo', hex: '#1E3A8A' }
    ],
    stock: 22,
    rating: 4.8,
    reviewsCount: 95,
    status: 'in_stock',
    material: '100% Cotton Twill',
    fit: 'Overshirt / Layering'
  },

  // 3. Jeans (5)
  {
    id: 'prod-jea-011',
    name: '501 Original Fit Selvedge Denim',
    category: 'Jeans',
    brand: 'Levi\'s',
    price: 4999,
    discountPrice: 3499,
    description: 'The archetype of all denim: straight leg, iconic button fly, and 14oz redline shuttle-loom selvedge.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Raw Indigo', hex: '#1E293B' },
      { name: 'Medium Stonewash', hex: '#3B82F6' },
      { name: 'Black Rigid', hex: '#020617' }
    ],
    stock: 18,
    rating: 4.9,
    reviewsCount: 520,
    status: 'in_stock',
    material: '100% Raw Selvedge Cotton',
    fit: 'Classic Straight'
  },
  {
    id: 'prod-jea-012',
    name: 'Slim Fit Stretch Denim Jeans',
    category: 'Jeans',
    brand: 'Uniqlo',
    price: 2999,
    discountPrice: 1999,
    description: 'Engineered with Kaihara denim and 2-way stretch technology for unrestricted mobility without bagging.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Dark Indigo', hex: '#172554' },
      { name: 'Faded Blue', hex: '#60A5FA' },
      { name: 'Solid Black', hex: '#0F172A' }
    ],
    stock: 24,
    rating: 4.7,
    reviewsCount: 230,
    status: 'in_stock',
    material: '98% Cotton, 2% Polyurethane',
    fit: 'Slim Tapered'
  },
  {
    id: 'prod-jea-013',
    name: 'Loose Wide-Leg Skater Jeans',
    category: 'Jeans',
    brand: 'Zara',
    price: 3299,
    discountPrice: 2299,
    description: 'Y2K inspired wide-leg silhouette cut from washed mid-weight non-stretch cotton denim.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Vintage Acid Wash', hex: '#93C5FD' },
      { name: 'Charcoal Wash', hex: '#475569' }
    ],
    stock: 9,
    rating: 4.4,
    reviewsCount: 68,
    status: 'low_stock',
    material: '100% BCI Cotton',
    fit: 'Loose Wide'
  },
  {
    id: 'prod-jea-014',
    name: 'Skinny Clean Stretch Jeans',
    category: 'Jeans',
    brand: 'H&M',
    price: 1999,
    discountPrice: 1399,
    description: 'Streamlined skinny cut with stay-black dye technology and contoured waistband.',
    availableSizes: ['XXS', 'XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'Stay Black', hex: '#020617' },
      { name: 'Deep Blue', hex: '#1E3A8A' }
    ],
    stock: 31,
    rating: 4.3,
    reviewsCount: 88,
    status: 'in_stock',
    material: '97% Cotton, 3% Elastane',
    fit: 'Skinny Fit'
  },
  {
    id: 'prod-jea-015',
    name: 'Relaxed Carpenter Utility Jeans',
    category: 'Jeans',
    brand: 'New Balance',
    price: 3699,
    discountPrice: 2699,
    description: 'Durable skate-inspired utility denim featuring hammer loop, reinforced tool pockets, and triple-needle stitching.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Washed Stone', hex: '#64748B' },
      { name: 'Raw Denim', hex: '#1E293B' }
    ],
    stock: 14,
    rating: 4.6,
    reviewsCount: 91,
    status: 'in_stock',
    material: '100% Heavy Twill Cotton',
    fit: 'Relaxed Carpenter'
  },

  // 4. Trousers (5)
  {
    id: 'prod-tro-016',
    name: 'Smart Ankle Pleated Trousers',
    category: 'Trousers',
    brand: 'Uniqlo',
    price: 2499,
    discountPrice: 1699,
    description: 'Clean tapered silhouette with discreet elasticated waistband and single front pleat. Machine washable.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Charcoal Gray', hex: '#334155' },
      { name: 'Dark Navy', hex: '#0F172A' },
      { name: 'Warm Khaki', hex: '#A8A29E' }
    ],
    stock: 15,
    rating: 4.8,
    reviewsCount: 260,
    status: 'new_arrival',
    material: '64% Polyester, 34% Rayon, 2% Spandex',
    fit: 'Tapered Ankle'
  },
  {
    id: 'prod-tro-017',
    name: 'Structured Wide Leg Chino Trousers',
    category: 'Trousers',
    brand: 'Zara',
    price: 3199,
    discountPrice: 2199,
    description: 'Tailored high-rise trousers with sharp pressed creases, side slip pockets, and fluid drape.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Sand Beige', hex: '#D6D3D1' },
      { name: 'Forest Green', hex: '#166534' }
    ],
    stock: 11,
    rating: 4.6,
    reviewsCount: 112,
    status: 'in_stock',
    material: '100% Structured Cotton Gabardine',
    fit: 'Wide Leg'
  },
  {
    id: 'prod-tro-018',
    name: 'Club Woven Cargo Trousers',
    category: 'Trousers',
    brand: 'Nike',
    price: 3799,
    discountPrice: 2699,
    description: 'Technical street cargos built with articulated knee darts, magnetic closure utility pockets, and adjustable ankle cinch.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Matte Black', hex: '#0F172A' },
      { name: 'Light Bone', hex: '#E2E8F0' }
    ],
    stock: 20,
    rating: 4.7,
    reviewsCount: 145,
    status: 'in_stock',
    material: '100% Ripstop Nylon',
    fit: 'Articulated Cargo'
  },
  {
    id: 'prod-tro-019',
    name: 'Slim Stretch Cotton Chinos',
    category: 'Trousers',
    brand: 'Ralph Lauren',
    price: 4299,
    discountPrice: 2999,
    description: 'Pre-washed combed cotton twill chinos with clean silhouette and welt rear button pockets.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Classic Tan', hex: '#CA8A04' },
      { name: 'French Navy', hex: '#1E3A8A' }
    ],
    stock: 17,
    rating: 4.8,
    reviewsCount: 180,
    status: 'in_stock',
    material: '98% Cotton, 2% Elastane',
    fit: 'Slim Straight'
  },
  {
    id: 'prod-tro-020',
    name: 'Linen Blend Drawstring Trousers',
    category: 'Trousers',
    brand: 'Mango',
    price: 2299,
    discountPrice: 1499,
    description: 'Relaxed coastal trousers featuring an internal cotton drawstring and breathable linen weave.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Natural Ecru', hex: '#F5F5F4' },
      { name: 'Olive Gray', hex: '#64748B' }
    ],
    stock: 5,
    rating: 4.5,
    reviewsCount: 52,
    status: 'low_stock',
    material: '55% Linen, 45% Cotton',
    fit: 'Relaxed Drawstring'
  },

  // 5. Jackets (5)
  {
    id: 'prod-jac-021',
    name: 'Hybrid Windproof Down Parka',
    category: 'Jackets',
    brand: 'Uniqlo',
    price: 7999,
    discountPrice: 5499,
    description: 'Premium water-repellent shell with bio-warming padding and 750+ fill power down insulation in body.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Matte Black', hex: '#020617' },
      { name: 'Dark Olive', hex: '#365314' },
      { name: 'Graphite Navy', hex: '#1E293B' }
    ],
    stock: 14,
    rating: 4.9,
    reviewsCount: 380,
    status: 'new_arrival',
    material: 'Shell: 100% Water-Resistant Poly, Fill: 90% Down',
    fit: 'Regular Insulated'
  },
  {
    id: 'prod-jac-022',
    name: 'Sportswear Windrunner Storm Jacket',
    category: 'Jackets',
    brand: 'Nike',
    price: 5499,
    discountPrice: 3899,
    description: 'Iconic 26-degree chevron design lines with water-resistant crinkled woven taffeta and mesh vent lining.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Cyber Teal & Black', hex: '#0D9488' },
      { name: 'Monochrome White/Black', hex: '#E2E8F0' }
    ],
    stock: 22,
    rating: 4.8,
    reviewsCount: 195,
    status: 'in_stock',
    material: '100% Recycled Nylon',
    fit: 'Standard Windrunner'
  },
  {
    id: 'prod-jac-023',
    name: 'Tiro Winterized Track Bomber Jacket',
    category: 'Jackets',
    brand: 'Adidas',
    price: 4299,
    discountPrice: 2999,
    description: 'Fleece-lined athletic bomber jacket with 3-stripe sleeve contrast and storm-seal dual zips.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Black Gloss', hex: '#0F172A' },
      { name: 'Signal Orange Accent', hex: '#F97316' }
    ],
    stock: 16,
    rating: 4.6,
    reviewsCount: 140,
    status: 'in_stock',
    material: '100% Recycled Poly Tricot',
    fit: 'Regular Bomber'
  },
  {
    id: 'prod-jac-024',
    name: 'Trucker Denim Sherpa Jacket',
    category: 'Jackets',
    brand: 'Levi\'s',
    price: 6999,
    discountPrice: 4999,
    description: 'Vintage cold-weather icon featuring heavy genuine denim lined with ultra-plush warm sherpa fleece.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Washed Indigo Sherpa', hex: '#2563EB' },
      { name: 'Faded Black Sherpa', hex: '#1E293B' }
    ],
    stock: 8,
    rating: 4.9,
    reviewsCount: 420,
    status: 'low_stock',
    material: '100% Cotton Denim, Polyester Sherpa Lining',
    fit: 'Standard Trucker'
  },
  {
    id: 'prod-jac-025',
    name: 'Faux Leather Minimalist Biker Jacket',
    category: 'Jackets',
    brand: 'Zara',
    price: 5999,
    discountPrice: 3999,
    description: 'Clean café racer collar with silver hardware, zippered gussets, and butter-soft vegan leather finish.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Midnight Black', hex: '#0A0A0A' },
      { name: 'Cognac Brown', hex: '#78350F' }
    ],
    stock: 10,
    rating: 4.5,
    reviewsCount: 98,
    status: 'in_stock',
    material: '100% Polyurethane Vegan Leather',
    fit: 'Slim Moto'
  },

  // 6. Hoodies (5)
  {
    id: 'prod-hoo-026',
    name: 'Club Fleece Overhead Pullover Hoodie',
    category: 'Hoodies',
    brand: 'Nike',
    price: 3499,
    discountPrice: 2499,
    description: 'Brushed-back fleece pullover featuring double-layered hood with braided drawcords and front kangaroo pouch.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Carbon Heather', hex: '#64748B' },
      { name: 'Teal Frost', hex: '#14B8A6' },
      { name: 'Black', hex: '#0F172A' }
    ],
    stock: 32,
    rating: 4.8,
    reviewsCount: 310,
    status: 'in_stock',
    material: '80% Cotton, 20% Polyester',
    fit: 'Relaxed Fleece'
  },
  {
    id: 'prod-hoo-027',
    name: 'Heavyweight Boxy Loopback Hoodie',
    category: 'Hoodies',
    brand: 'Zara',
    price: 2999,
    discountPrice: 1999,
    description: '450 GSM French loopback terry cloth hoodie with seamless side pockets and heavy ribbed trims.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Cement Grey', hex: '#CBD5E1' },
      { name: 'Dark Moss', hex: '#14532D' }
    ],
    stock: 6,
    rating: 4.6,
    reviewsCount: 84,
    status: 'low_stock',
    material: '100% Heavy French Terry',
    fit: 'Boxy Oversized'
  },
  {
    id: 'prod-hoo-028',
    name: 'Adicolor Essentials Trefoil Hoodie',
    category: 'Hoodies',
    brand: 'Adidas',
    price: 3299,
    discountPrice: 2299,
    description: 'Everyday lifestyle staple crafted in heavyweight cotton with tonal mini embroidered chest motif.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Wonder White', hex: '#F8FAFC' },
      { name: 'Night Indigo', hex: '#1E1B4B' }
    ],
    stock: 25,
    rating: 4.7,
    reviewsCount: 165,
    status: 'in_stock',
    material: '70% Cotton, 30% Recycled Polyester',
    fit: 'Regular Fit'
  },
  {
    id: 'prod-hoo-029',
    name: 'Full-Zip Heavy Terry Fleece Hoodie',
    category: 'Hoodies',
    brand: 'Uniqlo',
    price: 2699,
    discountPrice: 1799,
    description: 'Clean zipper silhouette constructed with smooth fine-thread outer surface and cozy brushed interior.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Light Gray', hex: '#E2E8F0' },
      { name: 'Dark Navy', hex: '#0F172A' }
    ],
    stock: 19,
    rating: 4.7,
    reviewsCount: 220,
    status: 'in_stock',
    material: '100% Combed Cotton',
    fit: 'Standard Fit'
  },
  {
    id: 'prod-hoo-030',
    name: 'Athletics French Terry Graphic Hoodie',
    category: 'Hoodies',
    brand: 'New Balance',
    price: 3799,
    discountPrice: 2599,
    description: 'Varsity-inspired athletic hoodie with stacked chest lettering and heritage relaxed raglan sleeves.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Heather Oatmeal', hex: '#E7E5E4' },
      { name: 'Deep Crimson', hex: '#991B1B' }
    ],
    stock: 15,
    rating: 4.5,
    reviewsCount: 79,
    status: 'in_stock',
    material: '100% Cotton French Terry',
    fit: 'Athletic Relaxed'
  },

  // 7. Sweatshirts (5)
  {
    id: 'prod-swe-031',
    name: 'Classic Long Sleeve Sweatshirt',
    category: 'Sweatshirts',
    brand: 'Uniqlo',
    price: 2199,
    discountPrice: 1399,
    description: 'Clean ribbed crewneck sweatshirt made of combed loopback jersey. Designed for effortless all-season layering.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Cool Grey', hex: '#94A3B8' },
      { name: 'Chalk White', hex: '#FFFFFF' },
      { name: 'Sage Green', hex: '#84CC16' }
    ],
    stock: 12,
    rating: 4.8,
    reviewsCount: 280,
    status: 'new_arrival',
    material: '100% Compact Spun Cotton',
    fit: 'Classic Regular',
    featured: true
  },
  {
    id: 'prod-swe-032',
    name: 'Puma Clean Crewneck Sweatshirt',
    category: 'Sweatshirts',
    brand: 'Puma',
    price: 2499,
    discountPrice: 1699,
    description: 'Essential sportswear pullover with subtle chest cat badge and double-stitched reinforced seam construction.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Puma Black', hex: '#0A0A0A' },
      { name: 'Peacoat Navy', hex: '#1E293B' }
    ],
    stock: 28,
    rating: 4.6,
    reviewsCount: 135,
    status: 'in_stock',
    material: '66% Cotton, 34% Recycled Polyester',
    fit: 'Regular Fit'
  },
  {
    id: 'prod-swe-033',
    name: 'Embroidered Logo Knit Sweatshirt',
    category: 'Sweatshirts',
    brand: 'Ralph Lauren',
    price: 4999,
    discountPrice: 3499,
    description: 'Fine fleece sweatshirt featuring signature multi-colored pony embroidery and classic triangular collar insert.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Heather Gray', hex: '#CBD5E1' },
      { name: 'Hunter Green', hex: '#14532D' }
    ],
    stock: 14,
    rating: 4.9,
    reviewsCount: 210,
    status: 'in_stock',
    material: '84% Cotton, 16% Polyester',
    fit: 'Custom Regular'
  },
  {
    id: 'prod-swe-034',
    name: 'Apple Park Infinite Loop Merch Crew',
    category: 'Sweatshirts',
    brand: 'Apple',
    price: 4299,
    discountPrice: 2999,
    description: 'Collector edition minimal monochrome sweatshirt with understated rainbow prism silicone chest badge.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Space Gray', hex: '#334155' },
      { name: 'Silver Mist', hex: '#F1F5F9' }
    ],
    stock: 7,
    rating: 4.9,
    reviewsCount: 390,
    status: 'low_stock',
    material: '100% Organic Pima Cotton',
    fit: 'Tailored Minimalist'
  },
  {
    id: 'prod-swe-035',
    name: 'Garment Dyed Vintage Crew',
    category: 'Sweatshirts',
    brand: 'Zara',
    price: 2599,
    discountPrice: 1799,
    description: 'Individual garment pigment dyed for an authentic lived-in color variation with brushed peach surface.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Faded Mustard', hex: '#EAB308' },
      { name: 'Washed Slate', hex: '#64748B' }
    ],
    stock: 18,
    rating: 4.4,
    reviewsCount: 62,
    status: 'in_stock',
    material: '100% Cotton',
    fit: 'Relaxed Vintage'
  },

  // 8. Dresses (5)
  {
    id: 'prod-dre-036',
    name: 'Tiered Linen Midi Shirt Dress',
    category: 'Dresses',
    brand: 'Mango',
    price: 4499,
    discountPrice: 2999,
    description: 'Effortless warm-weather midi silhouette with collared button placket, detachable sash belt, and tiered hem.',
    availableSizes: ['XXS', 'XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'Terracotta Coral', hex: '#EA580C' },
      { name: 'Olive Green', hex: '#65A30D' },
      { name: 'Natural Sand', hex: '#F5F5F4' }
    ],
    stock: 11,
    rating: 4.8,
    reviewsCount: 154,
    status: 'new_arrival',
    material: '100% European Linen',
    fit: 'Flowy Midi'
  },
  {
    id: 'prod-dre-037',
    name: 'Ribbed Knit Bodycon Midi Dress',
    category: 'Dresses',
    brand: 'Zara',
    price: 3299,
    discountPrice: 2199,
    description: 'Sculptural rib-knit midi dress with square neckline and side slit for effortless movement.',
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'Jet Black', hex: '#09090B' },
      { name: 'Espresso Brown', hex: '#451A03' }
    ],
    stock: 9,
    rating: 4.6,
    reviewsCount: 118,
    status: 'low_stock',
    material: '70% Viscose, 30% Polyamide',
    fit: 'Fitted Bodycon'
  },
  {
    id: 'prod-dre-038',
    name: 'Floral Print Georgette Maxi Dress',
    category: 'Dresses',
    brand: 'H&M',
    price: 2899,
    discountPrice: 1899,
    description: 'Airy georgette gown featuring subtle botanical print, flutter sleeves, and cinched smocked bodice.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Blush Floral', hex: '#F472B6' },
      { name: 'Midnight Botanical', hex: '#1E293B' }
    ],
    stock: 21,
    rating: 4.5,
    reviewsCount: 88,
    status: 'in_stock',
    material: '100% Recycled Polyester Georgette',
    fit: 'A-Line Maxi'
  },
  {
    id: 'prod-dre-039',
    name: '3D Knit Seamless Cotton Cocoon Dress',
    category: 'Dresses',
    brand: 'Uniqlo',
    price: 3999,
    discountPrice: 2699,
    description: 'Engineered using whole-garment 3D knit technology with zero seams for absolute contouring drape.',
    availableSizes: ['S', 'M', 'L'],
    availableColors: [
      { name: 'Cyan Aqua', hex: '#06B6D4' },
      { name: 'Onyx Black', hex: '#0F172A' }
    ],
    stock: 13,
    rating: 4.9,
    reviewsCount: 195,
    status: 'in_stock',
    material: '100% Extra Fine Cotton',
    fit: 'Seamless Cocoon'
  },
  {
    id: 'prod-dre-040',
    name: 'Sportswear Athletic Tank Dress',
    category: 'Dresses',
    brand: 'Nike',
    price: 3499,
    discountPrice: 2299,
    description: 'Performance stretch jersey tennis dress with built-in undershorts and moisture-wicking technology.',
    availableSizes: ['XS', 'S', 'M', 'L'],
    availableColors: [
      { name: 'White & Black Trim', hex: '#FFFFFF' },
      { name: 'Vibrant Teal', hex: '#0D9488' }
    ],
    stock: 17,
    rating: 4.7,
    reviewsCount: 76,
    status: 'in_stock',
    material: '88% Polyester, 12% Spandex',
    fit: 'Athletic Slim'
  },

  // 9. Kurtas (5)
  {
    id: 'prod-kur-041',
    name: 'Pure Chanderi Silk Embroidered Kurta',
    category: 'Kurtas',
    brand: 'Fabindia',
    price: 4999,
    discountPrice: 3499,
    description: 'Handcrafted Chanderi festive kurta adorned with intricate zari threadwork on mandarin collar and placket.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Royal Ivory', hex: '#FEF08A' },
      { name: 'Midnight Navy', hex: '#1E293B' },
      { name: 'Ruby Wine', hex: '#991B1B' }
    ],
    stock: 14,
    rating: 4.9,
    reviewsCount: 240,
    status: 'new_arrival',
    material: '70% Chanderi Silk, 30% Cotton',
    fit: 'Straight Comfort Fit'
  },
  {
    id: 'prod-kur-042',
    name: 'Handloom Khadi Cotton Short Kurta',
    category: 'Kurtas',
    brand: 'Fabindia',
    price: 2499,
    discountPrice: 1699,
    description: 'Breathable hand-spun khadi short tunic designed with curved hem, roll-up sleeve tabs, and wood buttons.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Sky Cyan Blue', hex: '#38BDF8' },
      { name: 'Natural Sand', hex: '#E7E5E4' }
    ],
    stock: 22,
    rating: 4.7,
    reviewsCount: 160,
    status: 'in_stock',
    material: '100% Handspun Khadi Cotton',
    fit: 'Regular Short Kurta'
  },
  {
    id: 'prod-kur-043',
    name: 'Modern Bandhgala Tunic Kurta',
    category: 'Kurtas',
    brand: 'Zara',
    price: 3299,
    discountPrice: 2299,
    description: 'Contemporary East-meets-West minimalist tunic with standing collar and hidden button fly front.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Charcoal Black', hex: '#18181B' },
      { name: 'Muted Olive', hex: '#4B5563' }
    ],
    stock: 8,
    rating: 4.5,
    reviewsCount: 82,
    status: 'low_stock',
    material: '55% Linen, 45% Cotton',
    fit: 'Modern Slim Tunic'
  },
  {
    id: 'prod-kur-044',
    name: 'Indigo Block-Printed Cotton Kurta',
    category: 'Kurtas',
    brand: 'Fabindia',
    price: 2899,
    discountPrice: 1999,
    description: 'Traditional Dabu mud-resist block print kurta dipped in organic vegetable indigo vats.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Dabu Indigo Blue', hex: '#1E3A8A' }
    ],
    stock: 19,
    rating: 4.8,
    reviewsCount: 175,
    status: 'in_stock',
    material: '100% Artisan Block Print Cotton',
    fit: 'Straight Fit'
  },
  {
    id: 'prod-kur-045',
    name: 'Pathani Linen Blend Festive Kurta',
    category: 'Kurtas',
    brand: 'Mango',
    price: 3799,
    discountPrice: 2599,
    description: 'Classic Pathani styling with shoulder epaulets, double chest flap pockets, and pleated back yoke.',
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Pearl Cream', hex: '#FFFBEB' },
      { name: 'Slate Grey', hex: '#475569' }
    ],
    stock: 16,
    rating: 4.6,
    reviewsCount: 94,
    status: 'in_stock',
    material: '60% Linen, 40% Cotton',
    fit: 'Relaxed Pathani'
  },

  // 10. Shorts (5)
  {
    id: 'prod-sho-046',
    name: 'Flex Stride 7-Inch Running Shorts',
    category: 'Shorts',
    brand: 'Nike',
    price: 2499,
    discountPrice: 1699,
    description: 'Lightweight stretch woven running shorts with breathable perforated back panel and zippered center pocket.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Black Reflective', hex: '#0F172A' },
      { name: 'Teal Lagoon', hex: '#0D9488' }
    ],
    stock: 27,
    rating: 4.8,
    reviewsCount: 215,
    status: 'in_stock',
    material: '100% Recycled Polyester',
    fit: 'Athletic 7"'
  },
  {
    id: 'prod-sho-047',
    name: 'Stretch Easy Chino Shorts',
    category: 'Shorts',
    brand: 'Uniqlo',
    price: 1899,
    discountPrice: 1199,
    description: 'Casual chino shorts with elasticized internal waist cord and washed twill softness.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Beige Khaki', hex: '#D6D3D1' },
      { name: 'Navy Blue', hex: '#1E3A8A' },
      { name: 'Olive Green', hex: '#3F6212' }
    ],
    stock: 33,
    rating: 4.7,
    reviewsCount: 340,
    status: 'in_stock',
    material: '98% Cotton, 2% Polyurethane',
    fit: 'Standard 8"'
  },
  {
    id: 'prod-sho-048',
    name: 'Mesh Basketball Shorts',
    category: 'Shorts',
    brand: 'Puma',
    price: 1999,
    discountPrice: 1299,
    description: 'Breathable dual-layer mesh court shorts featuring vintage stripe rib waistband and deep pockets.',
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: [
      { name: 'Classic Black', hex: '#18181B' },
      { name: 'White & Crimson', hex: '#DC2626' }
    ],
    stock: 21,
    rating: 4.5,
    reviewsCount: 110,
    status: 'in_stock',
    material: '100% Closed Hole Mesh Poly',
    fit: 'Relaxed Knee Length'
  },
  {
    id: 'prod-sho-049',
    name: '501 Hemmed Denim Shorts',
    category: 'Shorts',
    brand: 'Levi\'s',
    price: 2999,
    discountPrice: 1999,
    description: 'The definitive cutoff denim shorts cut above the knee with classic 5-pocket styling and copper rivets.',
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Light Stonewash', hex: '#93C5FD' },
      { name: 'Medium Indigo', hex: '#2563EB' }
    ],
    stock: 12,
    rating: 4.7,
    reviewsCount: 185,
    status: 'in_stock',
    material: '100% Cotton Denim',
    fit: 'Regular Cutoff'
  },
  {
    id: 'prod-sho-050',
    name: 'Linen Drawstring Resort Shorts',
    category: 'Shorts',
    brand: 'Zara',
    price: 2299,
    discountPrice: 1499,
    description: 'Lightweight linen blend lounge shorts with back patch pocket, front slash pockets, and elastic waist.',
    availableSizes: ['S', 'M', 'L', 'XL'],
    availableColors: [
      { name: 'Natural Sand', hex: '#E7E5E4' },
      { name: 'Sky Cyan', hex: '#06B6D4' }
    ],
    stock: 8,
    rating: 4.6,
    reviewsCount: 92,
    status: 'low_stock',
    material: '55% Linen, 45% Cotton',
    fit: 'Resort Comfort'
  }
];

export const CATEGORIES: { name: string; count: number }[] = [
  { name: 'T-Shirts', count: 5 },
  { name: 'Shirts', count: 5 },
  { name: 'Jeans', count: 5 },
  { name: 'Trousers', count: 5 },
  { name: 'Jackets', count: 5 },
  { name: 'Hoodies', count: 5 },
  { name: 'Sweatshirts', count: 5 },
  { name: 'Dresses', count: 5 },
  { name: 'Kurtas', count: 5 },
  { name: 'Shorts', count: 5 }
];

export const BRANDS = [
  { name: 'Uniqlo', count: 61 },
  { name: 'Nike', count: 123 },
  { name: 'Adidas', count: 55 },
  { name: 'Puma', count: 325 },
  { name: 'New Balance', count: 99 },
  { name: 'Zara', count: 84 },
  { name: 'Levi\'s', count: 72 },
  { name: 'H&M', count: 46 },
  { name: 'Ralph Lauren', count: 38 },
  { name: 'Fabindia', count: 29 },
  { name: 'Mango', count: 34 },
  { name: 'Apple', count: 65 }
];

export type ClothingCategory =
  | 'T-Shirts'
  | 'Shirts'
  | 'Jeans'
  | 'Trousers'
  | 'Jackets'
  | 'Hoodies'
  | 'Sweatshirts'
  | 'Dresses'
  | 'Kurtas'
  | 'Shorts';

export type ClothingSize = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ColorOption {
  name: string;
  hex: string;
}

export type ProductStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'new_arrival';

export interface Product {
  id: string;
  name: string;
  category: ClothingCategory;
  description: string;
  price: number;
  discountPrice?: number;
  availableSizes: ClothingSize[];
  availableColors: ColorOption[];
  stock: number;
  rating: number;
  reviewsCount: number;
  brand: string;
  status: ProductStatus;
  fit?: string;
  material?: string;
  featured?: boolean;
}

export interface Address {
  id: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  size: ClothingSize;
  color: ColorOption;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  addedAt: string;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: Product;
  addedAt: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'UPI' | 'Cash on Delivery';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  category: ClothingCategory;
  size: ClothingSize;
  color: ColorOption;
  quantity: number;
  price: number;
  discountPrice?: number;
}

export interface OrderPricing {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  pricing: OrderPricing;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  orderStatus: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp: string;
  service: string;
  statusCode: number;
}

export interface ApiLogEntry {
  id: string;
  timestamp: string;
  service: 'Product' | 'User' | 'Cart' | 'Wishlist' | 'Order' | 'Checkout' | 'Admin' | 'Storage';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  status: number;
  durationMs: number;
  requestPayload?: any;
  responsePayload?: any;
}

export interface FilterState {
  categories: ClothingCategory[];
  brands: string[];
  sizes: ClothingSize[];
  colors: string[];
  priceRange: [number, number];
  minRating: number;
  searchQuery: string;
  sortBy: 'popular' | 'price_low' | 'price_high' | 'newest' | 'rating' | 'discount';
}

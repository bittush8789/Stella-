import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  Filter as FilterIcon,
  SlidersHorizontal,
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  Cart,
  ClothingCategory,
  ClothingSize,
  ColorOption,
  FilterState,
  Order,
  Product,
  User,
  WishlistItem
} from './types/microservices';
import { productService } from './services/productService';
import { userService } from './services/userService';
import { cartService } from './services/cartService';
import { wishlistService } from './services/wishlistService';
import { orderService } from './services/orderService';
import { adminService, AdminMetrics } from './services/adminService';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawerOrPage } from './components/CartDrawerOrPage';
import { WishlistPage } from './components/WishlistPage';
import { CheckoutFlow } from './components/CheckoutFlow';
import { UserAccount } from './components/UserAccount';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';

export default function App() {
  // Navigation & Page State
  const [currentView, setCurrentView] = useState<
    'storefront' | 'wishlist' | 'checkout' | 'account'
  >('storefront');

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Microservices Entities
  const [user, setUser] = useState<User>(userService.getCurrentUser());
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({
    userId: user.id,
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  });
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalProducts: 50,
    totalUsers: 2,
    totalOrders: 2,
    totalSales: 6087,
    pendingOrdersCount: 1,
    lowStockCount: 5
  });

  // Loading & Toast Feedback
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Grid column mode (2, 3, or 4 columns) matching reference image
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

  // Filter State for Indian Rupees (₹)
  const initialFilterState: FilterState = {
    categories: [],
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [0, 8000],
    minRating: 0,
    searchQuery: '',
    sortBy: 'popular'
  };
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  // Ref for smooth scroll to collection
  const collectionRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial Load from microservices
  useEffect(() => {
    loadAllServicesData();
  }, []);

  const loadAllServicesData = async () => {
    setIsLoadingProducts(true);
    try {
      const [prodRes, cartRes, wishRes, orderRes, allOrdersRes, allUsersRes, metricsRes] =
        await Promise.all([
          productService.getProducts(),
          cartService.getCart(user.id),
          wishlistService.getWishlist(user.id),
          orderService.getOrdersByUser(user.id),
          orderService.getAllOrders(),
          userService.getAllUsers(),
          adminService.getDashboardMetrics()
        ]);

      if (prodRes.success && prodRes.data) {
        setAllProducts(prodRes.data);
      }
      if (cartRes.success && cartRes.data) {
        setCart(cartRes.data);
      }
      if (wishRes.success && wishRes.data) {
        setWishlist(wishRes.data);
      }
      if (orderRes.success && orderRes.data) {
        setUserOrders(orderRes.data);
      }
      if (allOrdersRes.success && allOrdersRes.data) {
        setAllOrders(allOrdersRes.data);
      }
      if (allUsersRes.success && allUsersRes.data) {
        setAllUsers(allUsersRes.data);
      }
      if (metricsRes.success && metricsRes.data) {
        setAdminMetrics(metricsRes.data);
      }
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Real-time Supabase Orders Subscription
  useEffect(() => {
    if (!user.id) return;
    const unsubscribe = orderService.subscribeToUserOrders(user.id, (realtimeOrders) => {
      setUserOrders(realtimeOrders);
    });
    return () => {
      unsubscribe();
    };
  }, [user.id]);

  // Execute Search & Filter whenever filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoadingProducts(true);
      const res = await productService.searchProducts({
        query: filters.searchQuery,
        categories: filters.categories,
        brands: filters.brands,
        sizes: filters.sizes,
        colors: filters.colors,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        minRating: filters.minRating,
        sortBy: filters.sortBy
      });

      if (res.success && res.data) {
        setProducts(res.data);
      }
      setIsLoadingProducts(false);
    };

    fetchFilteredProducts();
  }, [filters]);

  // Wishlist Actions
  const handleToggleWishlist = async (product: Product) => {
    const isSaved = wishlist.some((item) => item.productId === product.id);
    if (isSaved) {
      const res = await wishlistService.removeFromWishlist(user.id, product.id);
      if (res.success) {
        setWishlist((prev) => prev.filter((i) => i.productId !== product.id));
        showToast(`Removed "${product.name}" from your wishlist`);
      }
    } else {
      const res = await wishlistService.addToWishlist(user.id, product);
      if (res.success && res.data) {
        setWishlist((prev) => [...prev, res.data!]);
        showToast(`Saved "${product.name}" to your wishlist`);
      }
    }
  };

  // Cart Actions
  const handleAddToCart = async (
    product: Product,
    size: ClothingSize = 'M',
    color: ColorOption = product.availableColors[0] || { name: 'Standard', hex: '#94A3B8' },
    quantity = 1
  ) => {
    const res = await cartService.addToCart({
      userId: user.id,
      product,
      size,
      color,
      quantity
    });

    if (res.success && res.data) {
      setCart(res.data);
      showToast(`Added ${quantity}x "${product.name}" to bag`);
    } else {
      showToast(res.message || 'Could not add to cart');
    }
  };

  const handleQuickAddToCart = (product: Product) => {
    handleAddToCart(product, product.availableSizes[0] || 'M', product.availableColors[0], 1);
  };

  const handleBuyNow = async (
    product: Product,
    size: ClothingSize,
    color: ColorOption,
    quantity: number
  ) => {
    await handleAddToCart(product, size, color, quantity);
    setSelectedProduct(null);
    setCurrentView('checkout');
  };

  const handleUpdateCartQuantity = async (itemId: string, newQty: number) => {
    const res = await cartService.updateItemQuantity(user.id, itemId, newQty);
    if (res.success && res.data) {
      setCart(res.data);
    }
  };

  const handleRemoveCartItem = async (itemId: string) => {
    const res = await cartService.removeItem(user.id, itemId);
    if (res.success && res.data) {
      setCart(res.data);
      showToast('Item removed from cart');
    }
  };

  const handleClearCart = async () => {
    const res = await cartService.clearCart(user.id);
    if (res.success && res.data) {
      setCart(res.data);
      showToast('Shopping cart cleared');
    }
  };

  // Checkout order completion
  const handleOrderComplete = async (newOrder: Order) => {
    setUserOrders((prev) => [newOrder, ...prev]);
    setAllOrders((prev) => [newOrder, ...prev]);
    const cartRes = await cartService.getCart(user.id);
    if (cartRes.success && cartRes.data) {
      setCart(cartRes.data);
    }
    const metricsRes = await adminService.getDashboardMetrics();
    if (metricsRes.success && metricsRes.data) {
      setAdminMetrics(metricsRes.data);
    }
    showToast(`Order ${newOrder.id} placed successfully!`);
  };

  const handleAuthSuccess = async (authUser: User) => {
    setUser(authUser);
    userService.setCurrentUserId(authUser.id);
    const [cartRes, wishRes, orderRes] = await Promise.all([
      cartService.getCart(authUser.id),
      wishlistService.getWishlist(authUser.id),
      orderService.getOrdersByUser(authUser.id)
    ]);
    if (cartRes.success && cartRes.data) setCart(cartRes.data);
    if (wishRes.success && wishRes.data) setWishlist(wishRes.data);
    if (orderRes.success && orderRes.data) setUserOrders(orderRes.data);
    showToast(`Welcome back, ${authUser.name}! Profile synced.`);
  };

  const scrollToCollection = () => {
    if (collectionRef.current) {
      collectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectCategoryFromAnywhere = (cat: ClothingCategory) => {
    setFilters({ ...filters, categories: [cat] });
    setCurrentView('storefront');
    scrollToCollection();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#1E293B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Navbar matching image */}
      <Navbar
        user={user}
        cartCount={cart.itemCount}
        wishlistCount={wishlist.length}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setCurrentView('wishlist')}
        onOpenAccount={() => setCurrentView('account')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigateHome={() => setCurrentView('storefront')}
      />

      {/* Main Body Switcher */}
      <main className="flex-1">
        {currentView === 'storefront' && (
          <div className="space-y-6">
            {/* 1. Hero Banner ("Simple is More") matching reference image */}
            <HeroBanner
              onExploreClick={scrollToCollection}
              onSelectCategory={selectCategoryFromAnywhere}
            />

            {/* 2. Storefront Catalog Container */}
            <div
              ref={collectionRef}
              className="max-w-7xl mx-auto px-4 sm:px-8 py-6"
            >
              {/* Breadcrumb & Results Header matching image.png */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
                <div>
                  <nav className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                    <button
                      onClick={() => setFilters(initialFilterState)}
                      className="hover:text-slate-800 transition-colors"
                    >
                      Home
                    </button>
                    <span>&gt;</span>
                    <span className="text-slate-700 font-semibold">Clothes</span>
                    {filters.categories.length > 0 && (
                      <>
                        <span>&gt;</span>
                        <span className="text-teal-600 font-semibold">
                          {filters.categories.join(', ')}
                        </span>
                      </>
                    )}
                  </nav>

                  {/* Matching: "64 result for clothes" from reference image */}
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {products.length} {products.length === 1 ? 'result' : 'results'} for clothes
                  </h2>
                </div>

                {/* View Controls matching reference image: Grid mode icons + Sort Dropdown */}
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Mobile Filter Trigger Button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    <FilterIcon className="w-3.5 h-3.5 text-teal-600" />
                    <span>Filter</span>
                  </button>

                  {/* Grid View Toggles (2 or 3 or 4 cols) */}
                  <div className="hidden sm:flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
                    <button
                      onClick={() => setGridCols(2)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        gridCols === 2 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="2 Columns Grid"
                    >
                      <Grid2X2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(3)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        gridCols === 3 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="3 Columns Grid"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(4)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        gridCols === 4 ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="4 Columns Grid"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort Dropdown matching "Sort by: Popular" */}
                  <div className="relative inline-flex items-center">
                    <label className="text-xs text-slate-500 mr-2 hidden md:inline">Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          sortBy: e.target.value as FilterState['sortBy']
                        })
                      }
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs font-semibold text-slate-800 rounded-xl shadow-2xs focus:outline-none focus:border-teal-500 cursor-pointer"
                    >
                      <option value="popular">Popular</option>
                      <option value="newest">Newest</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="discount">Biggest Discount</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Catalog Layout: Left Filter Sidebar + Right Products Grid */}
              <div className="flex flex-col lg:flex-row gap-8 pt-6">
                {/* Desktop Left Sidebar & Mobile Drawer */}
                <div className="hidden lg:block">
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onResetFilters={() => setFilters(initialFilterState)}
                  />
                </div>

                {/* Mobile Drawer Filter */}
                {isMobileFilterOpen && (
                  <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex">
                    <FilterSidebar
                      filters={filters}
                      onFilterChange={setFilters}
                      onResetFilters={() => setFilters(initialFilterState)}
                      isOpenOnMobile={true}
                      onCloseMobile={() => setIsMobileFilterOpen(false)}
                    />
                    <div
                      className="flex-1"
                      onClick={() => setIsMobileFilterOpen(false)}
                    />
                  </div>
                )}

                {/* Right Product Grid */}
                <div className="flex-1">
                  {isLoadingProducts ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200/80 p-4 space-y-3"
                        >
                          <div className="bg-slate-200 rounded-xl h-48 w-full" />
                          <div className="h-4 bg-slate-200 rounded w-1/3" />
                          <div className="h-4 bg-slate-200 rounded w-2/3" />
                          <div className="h-4 bg-slate-200 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl border border-slate-200/80 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-800">
                          No matching clothing items found
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mt-1">
                          Try relaxing your brand, price, or size filters to discover more items in the 50-piece collection.
                        </p>
                      </div>
                      <button
                        onClick={() => setFilters(initialFilterState)}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`grid gap-5 ${
                        gridCols === 2
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : gridCols === 3
                          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      }`}
                    >
                      {products.map((product) => {
                        const isInWishlist = wishlist.some(
                          (item) => item.productId === product.id
                        );
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isInWishlist={isInWishlist}
                            onToggleWishlist={handleToggleWishlist}
                            onQuickAddToCart={handleQuickAddToCart}
                            onSelectProduct={setSelectedProduct}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View: Wishlist Page */}
        {currentView === 'wishlist' && (
          <WishlistPage
            items={wishlist}
            onRemoveFromWishlist={(id) => {
              const p = allProducts.find((item) => item.id === id);
              if (p) handleToggleWishlist(p);
            }}
            onAddToCart={(p) => handleQuickAddToCart(p)}
            onSelectProduct={setSelectedProduct}
            onBackToShopping={() => setCurrentView('storefront')}
          />
        )}

        {/* View: Multi-step Checkout Flow */}
        {currentView === 'checkout' && (
          <CheckoutFlow
            cart={cart}
            user={user}
            onOrderComplete={handleOrderComplete}
            onCancelCheckout={() => setCurrentView('storefront')}
            onViewOrders={() => setCurrentView('account')}
          />
        )}

        {/* View: User Account Dashboard */}
        {currentView === 'account' && (
          <UserAccount
            user={user}
            orders={userOrders}
            wishlist={wishlist}
            onBackToShopping={() => setCurrentView('storefront')}
            onRefreshOrders={async () => {
              const res = await orderService.getOrdersByUser(user.id);
              if (res.success && res.data) setUserOrders(res.data);
            }}
            onUserUpdated={(updated) => setUser(updated)}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
      </main>

      {/* Auth Modal for Login / Sign Up */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Product Details Modal (PDP) */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isInWishlist={
          selectedProduct
            ? wishlist.some((item) => item.productId === selectedProduct.id)
            : false
        }
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawerOrPage
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
        }}
        onContinueShopping={() => setIsCartOpen(false)}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={selectCategoryFromAnywhere}
      />
    </div>
  );
}

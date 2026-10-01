import { INITIAL_PRODUCTS, CATEGORIES } from '../data/mockProducts';
import { ApiResponse, ClothingCategory, Product, ProductStatus } from '../types/microservices';
import { apiBus, createErrorResponse, createSuccessResponse, simulateLatency } from './apiBus';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

class ProductService {
  private products: Product[] = [...INITIAL_PRODUCTS];
  private isSeededInSupabase = false;

  constructor() {
    this.checkAndSeedSupabase();
  }

  // Auto-seed Supabase database table if empty and credentials provided
  private async checkAndSeedSupabase() {
    if (!isSupabaseConfigured() || !supabase) return;
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      if (!error && (!data || data.length === 0) && !this.isSeededInSupabase) {
        this.isSeededInSupabase = true;
        const rows = this.products.map((p) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          brand: p.brand,
          description: p.description,
          price: p.price,
          discount_price: p.discountPrice,
          available_sizes: p.availableSizes,
          available_colors: p.availableColors,
          stock: p.stock,
          rating: p.rating,
          reviews_count: p.reviewsCount,
          status: p.status,
          material: p.material,
          fit: p.fit,
          featured: p.featured ?? false
        }));
        await supabase.from('products').upsert(rows);
      }
    } catch {
      // Graceful fallback to memory
    }
  }

  // GET /products
  public async getProducts(): Promise<ApiResponse<Product[]>> {
    const start = performance.now();
    let source = 'In-Memory Store';

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (!error && data && data.length > 0) {
          source = 'Supabase PostgreSQL';
          this.products = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            category: d.category,
            brand: d.brand,
            description: d.description,
            price: Number(d.price),
            discountPrice: d.discount_price ? Number(d.discount_price) : undefined,
            availableSizes: d.available_sizes || [],
            availableColors: d.available_colors || [],
            stock: Number(d.stock),
            rating: Number(d.rating),
            reviewsCount: Number(d.reviews_count),
            status: d.status as ProductStatus,
            material: d.material,
            fit: d.fit,
            featured: d.featured
          }));
        }
      } catch {
        // Fallback to in-memory
      }
    } else {
      await simulateLatency(30, 80);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Product', [...this.products], 200);
    apiBus.logCall('Product', 'GET', `/products [${source}]`, 200, duration, null, { count: this.products.length });
    return res;
  }

  // GET /products/:id
  public async getProductById(id: string): Promise<ApiResponse<Product>> {
    const start = performance.now();
    let product = this.products.find((p) => p.id === id);

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
        if (!error && data) {
          product = {
            id: data.id,
            name: data.name,
            category: data.category,
            brand: data.brand,
            description: data.description,
            price: Number(data.price),
            discountPrice: data.discount_price ? Number(data.discount_price) : undefined,
            availableSizes: data.available_sizes || [],
            availableColors: data.available_colors || [],
            stock: Number(data.stock),
            rating: Number(data.rating),
            reviewsCount: Number(data.reviews_count),
            status: data.status as ProductStatus,
            material: data.material,
            fit: data.fit
          };
        }
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(20, 60);
    }

    const duration = Math.round(performance.now() - start);

    if (!product) {
      const errRes = createErrorResponse<Product>('Product', `Product with ID '${id}' not found`, 404);
      apiBus.logCall('Product', 'GET', `/products/${id}`, 404, duration, null, errRes);
      return errRes;
    }

    const res = createSuccessResponse('Product', { ...product }, 200);
    apiBus.logCall('Product', 'GET', `/products/${id}`, 200, duration, null, { id: product.id, name: product.name });
    return res;
  }

  // GET /categories
  public async getCategories(): Promise<ApiResponse<{ name: string; count: number }[]>> {
    const start = performance.now();
    await simulateLatency(20, 50);
    const duration = Math.round(performance.now() - start);

    const categoryCounts = CATEGORIES.map((cat) => ({
      name: cat.name,
      count: this.products.filter((p) => p.category === cat.name).length
    }));

    const res = createSuccessResponse('Product', categoryCounts, 200);
    apiBus.logCall('Product', 'GET', '/categories', 200, duration, null, categoryCounts);
    return res;
  }

  // GET /products/category/:category
  public async getProductsByCategory(category: ClothingCategory): Promise<ApiResponse<Product[]>> {
    const start = performance.now();
    await simulateLatency(30, 70);
    const duration = Math.round(performance.now() - start);

    const filtered = this.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    const res = createSuccessResponse('Product', filtered, 200);
    apiBus.logCall('Product', 'GET', `/products/category/${category}`, 200, duration, null, { count: filtered.length });
    return res;
  }

  // GET /products/search
  public async searchProducts(params: {
    query?: string;
    categories?: ClothingCategory[];
    brands?: string[];
    sizes?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'popular' | 'price_low' | 'price_high' | 'newest' | 'rating' | 'discount';
  }): Promise<ApiResponse<Product[]>> {
    const start = performance.now();
    await simulateLatency(40, 90);
    const duration = Math.round(performance.now() - start);

    let result = [...this.products];

    // Query search
    if (params.query && params.query.trim()) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params.categories && params.categories.length > 0) {
      result = result.filter((p) => params.categories!.includes(p.category));
    }

    // Brand filter
    if (params.brands && params.brands.length > 0) {
      result = result.filter((p) =>
        params.brands!.some((b) => b.toLowerCase() === p.brand.toLowerCase())
      );
    }

    // Size filter
    if (params.sizes && params.sizes.length > 0) {
      result = result.filter((p) =>
        p.availableSizes.some((s) => params.sizes!.includes(s))
      );
    }

    // Color filter
    if (params.colors && params.colors.length > 0) {
      result = result.filter((p) =>
        p.availableColors.some((c) =>
          params.colors!.some(
            (selectedColor) =>
              c.name.toLowerCase().includes(selectedColor.toLowerCase()) ||
              c.hex.toLowerCase() === selectedColor.toLowerCase()
          )
        )
      );
    }

    // Price range
    if (params.minPrice !== undefined) {
      result = result.filter((p) => (p.discountPrice ?? p.price) >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      result = result.filter((p) => (p.discountPrice ?? p.price) <= params.maxPrice!);
    }

    // Min rating
    if (params.minRating !== undefined && params.minRating > 0) {
      result = result.filter((p) => p.rating >= params.minRating!);
    }

    // Sorting
    switch (params.sortBy) {
      case 'price_low':
        result.sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
        break;
      case 'price_high':
        result.sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
        break;
      case 'newest':
        result.sort((a, b) => (a.status === 'new_arrival' ? -1 : 1));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case 'discount':
        result.sort((a, b) => {
          const discountA = a.discountPrice ? (a.price - a.discountPrice) / a.price : 0;
          const discountB = b.discountPrice ? (b.price - b.discountPrice) / b.price : 0;
          return discountB - discountA;
        });
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    const res = createSuccessResponse('Product', result, 200);
    apiBus.logCall('Product', 'GET', `/products/search`, 200, duration, params, { count: result.length });
    return res;
  }

  // POST /products (Admin create)
  public async createProduct(productData: Omit<Product, 'id'>): Promise<ApiResponse<Product>> {
    const start = performance.now();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
      status: productData.stock <= 0 ? 'out_of_stock' : productData.stock <= 5 ? 'low_stock' : 'in_stock'
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').insert([
          {
            id: newProduct.id,
            name: newProduct.name,
            category: newProduct.category,
            brand: newProduct.brand,
            description: newProduct.description,
            price: newProduct.price,
            discount_price: newProduct.discountPrice,
            available_sizes: newProduct.availableSizes,
            available_colors: newProduct.availableColors,
            stock: newProduct.stock,
            rating: newProduct.rating,
            reviews_count: newProduct.reviewsCount,
            status: newProduct.status,
            material: newProduct.material,
            fit: newProduct.fit
          }
        ]);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(50, 100);
    }

    this.products.unshift(newProduct);
    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Product', newProduct, 201, 'Product created successfully');
    apiBus.logCall('Product', 'POST', '/products', 201, duration, productData, newProduct);
    return res;
  }

  // PUT /products/:id (Admin update)
  public async updateProduct(id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> {
    const start = performance.now();
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      const errRes = createErrorResponse<Product>('Product', `Product '${id}' not found`, 404);
      apiBus.logCall('Product', 'PUT', `/products/${id}`, 404, 20, updates, errRes);
      return errRes;
    }

    const updated = { ...this.products[index], ...updates };
    if (updates.stock !== undefined) {
      if (updated.stock <= 0) updated.status = 'out_of_stock';
      else if (updated.stock <= 5) updated.status = 'low_stock';
      else if (updated.status === 'out_of_stock') updated.status = 'in_stock';
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('products')
          .update({
            name: updated.name,
            category: updated.category,
            brand: updated.brand,
            description: updated.description,
            price: updated.price,
            discount_price: updated.discountPrice,
            stock: updated.stock,
            status: updated.status
          })
          .eq('id', id);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(40, 80);
    }

    this.products[index] = updated;
    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Product', updated, 200, 'Product updated successfully');
    apiBus.logCall('Product', 'PUT', `/products/${id}`, 200, duration, updates, updated);
    return res;
  }

  // PUT /products/:id/stock
  public async updateStock(id: string, newStock: number): Promise<ApiResponse<Product>> {
    return this.updateProduct(id, { stock: Math.max(0, newStock) });
  }

  // DELETE /products/:id (Admin delete)
  public async deleteProduct(id: string): Promise<ApiResponse<{ id: string }>> {
    const start = performance.now();
    const index = this.products.findIndex((p) => p.id === id);

    if (index === -1) {
      const errRes = createErrorResponse<{ id: string }>('Product', `Product '${id}' not found`, 404);
      apiBus.logCall('Product', 'DELETE', `/products/${id}`, 404, 20, null, errRes);
      return errRes;
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(40, 80);
    }

    this.products.splice(index, 1);
    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Product', { id }, 200, 'Product deleted successfully');
    apiBus.logCall('Product', 'DELETE', `/products/${id}`, 200, duration, null, { id });
    return res;
  }
}

export const productService = new ProductService();

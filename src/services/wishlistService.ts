import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { ApiResponse, Product, WishlistItem } from '../types/microservices';
import { apiBus, createErrorResponse, createSuccessResponse, simulateLatency } from './apiBus';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

class WishlistService {
  private userWishlists: Map<string, WishlistItem[]> = new Map();

  constructor() {
    // Seed initial wishlist with 3 items
    const defaultUserId = 'usr-customer-001';
    const seeded = [INITIAL_PRODUCTS[0], INITIAL_PRODUCTS[5], INITIAL_PRODUCTS[10]];
    this.userWishlists.set(
      defaultUserId,
      seeded.map((product, i) => ({
        id: `wish-${i + 1}`,
        productId: product.id,
        product,
        addedAt: new Date(Date.now() - (i + 1) * 3600000).toISOString()
      }))
    );
  }

  // GET /wishlist/:userId
  public async getWishlist(userId: string): Promise<ApiResponse<WishlistItem[]>> {
    const start = performance.now();
    let items = this.userWishlists.get(userId) || [];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*, products(*)')
          .eq('user_id', userId);

        if (!error && data && data.length > 0) {
          items = data.map((d: any) => ({
            id: d.id,
            productId: d.product_id,
            product: d.products
              ? {
                  id: d.products.id,
                  name: d.products.name,
                  category: d.products.category,
                  brand: d.products.brand,
                  description: d.products.description,
                  price: Number(d.products.price),
                  discountPrice: d.products.discount_price ? Number(d.products.discount_price) : undefined,
                  availableSizes: d.products.available_sizes || [],
                  availableColors: d.products.available_colors || [],
                  stock: Number(d.products.stock),
                  rating: Number(d.products.rating),
                  reviewsCount: Number(d.products.reviews_count),
                  status: d.products.status
                }
              : INITIAL_PRODUCTS.find((p) => p.id === d.product_id) || INITIAL_PRODUCTS[0],
            addedAt: d.added_at
          }));
        }
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(20, 50);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Wishlist', [...items], 200);
    apiBus.logCall('Wishlist', 'GET', `/wishlist/${userId}`, 200, duration, null, { count: items.length });
    return res;
  }

  // POST /wishlist/items
  public async addToWishlist(userId: string, product: Product): Promise<ApiResponse<WishlistItem>> {
    const start = performance.now();
    const items = this.userWishlists.get(userId) || [];
    const existing = items.find((i) => i.productId === product.id);

    if (existing) {
      const res = createSuccessResponse('Wishlist', existing, 200, 'Product is already in wishlist');
      apiBus.logCall('Wishlist', 'POST', '/wishlist/items', 200, 20, { productId: product.id }, { exists: true });
      return res;
    }

    const newItem: WishlistItem = {
      id: `wish-${Date.now().toString(36)}`,
      productId: product.id,
      product,
      addedAt: new Date().toISOString()
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('wishlist_items').upsert([
          {
            id: newItem.id,
            user_id: userId,
            product_id: product.id,
            added_at: newItem.addedAt
          }
        ]);
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(30, 60);
    }

    items.push(newItem);
    this.userWishlists.set(userId, items);

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Wishlist', newItem, 201, 'Added to wishlist');
    apiBus.logCall('Wishlist', 'POST', '/wishlist/items', 201, duration, { productId: product.id }, newItem);
    return res;
  }

  // DELETE /wishlist/items/:productId
  public async removeFromWishlist(userId: string, productId: string): Promise<ApiResponse<{ productId: string }>> {
    const start = performance.now();

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('wishlist_items')
          .delete()
          .match({ user_id: userId, product_id: productId });
      } catch {
        // Fallback
      }
    } else {
      await simulateLatency(20, 50);
    }

    let items = this.userWishlists.get(userId) || [];
    items = items.filter((i) => i.productId !== productId);
    this.userWishlists.set(userId, items);

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Wishlist', { productId }, 200, 'Removed from wishlist');
    apiBus.logCall('Wishlist', 'DELETE', `/wishlist/items/${productId}`, 200, duration, null, { productId });
    return res;
  }
}

export const wishlistService = new WishlistService();

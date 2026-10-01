import { ApiResponse, Cart, CartItem, ClothingSize, ColorOption, Product } from '../types/microservices';
import { apiBus, createErrorResponse, createSuccessResponse, simulateLatency } from './apiBus';

class CartService {
  private userCarts: Map<string, CartItem[]> = new Map();

  constructor() {
    // Seed initial cart for customer user with INR prices
    const defaultUserId = 'usr-customer-001';
    this.userCarts.set(defaultUserId, [
      {
        id: 'cart-item-1',
        productId: 'prod-tsh-001',
        product: {
          id: 'prod-tsh-001',
          name: 'Shirt Soft Cotton',
          category: 'T-Shirts',
          brand: 'Uniqlo',
          price: 1299,
          discountPrice: 799,
          description: 'Ultra-soft Supima cotton t-shirt with tailored crew neckline.',
          availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
          availableColors: [{ name: 'Heather Gray', hex: '#94A3B8' }],
          stock: 12,
          rating: 4.8,
          reviewsCount: 142,
          status: 'new_arrival'
        },
        size: 'M',
        color: { name: 'Heather Gray', hex: '#94A3B8' },
        quantity: 2,
        unitPrice: 1299,
        discountPrice: 799,
        addedAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'cart-item-2',
        productId: 'prod-shr-006',
        product: {
          id: 'prod-shr-006',
          name: 'Zip Up Neck Shirt',
          category: 'Shirts',
          brand: 'Uniqlo',
          price: 2499,
          discountPrice: 1499,
          description: 'Contemporary quarter-zip knit polo shirt woven from fine-gauge mercerized yarn.',
          availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
          availableColors: [{ name: 'Cool Slate', hex: '#64748B' }],
          stock: 12,
          rating: 4.9,
          reviewsCount: 204,
          status: 'new_arrival'
        },
        size: 'L',
        color: { name: 'Cool Slate', hex: '#64748B' },
        quantity: 1,
        unitPrice: 2499,
        discountPrice: 1499,
        addedAt: new Date().toISOString()
      }
    ]);
  }

  private calculateCartSummary(userId: string, items: CartItem[]): Cart {
    let subtotal = 0;
    let originalTotal = 0;
    let itemCount = 0;

    items.forEach((item) => {
      const activePrice = item.discountPrice ?? item.unitPrice;
      subtotal += activePrice * item.quantity;
      originalTotal += item.unitPrice * item.quantity;
      itemCount += item.quantity;
    });

    const discount = Math.max(0, originalTotal - subtotal);
    // Free shipping in India for orders over ₹999, else ₹99 delivery fee
    const shipping = items.length === 0 ? 0 : subtotal >= 999 ? 0 : 99;
    // Standard 5% GST
    const tax = Math.round(subtotal * 0.05);
    const total = Math.round(subtotal + shipping + tax);

    return {
      userId,
      items: [...items],
      subtotal,
      discount,
      shipping,
      tax,
      total,
      itemCount
    };
  }

  // GET /cart/:userId
  public async getCart(userId: string): Promise<ApiResponse<Cart>> {
    const start = performance.now();
    await simulateLatency(20, 60);
    const duration = Math.round(performance.now() - start);

    const items = this.userCarts.get(userId) || [];
    const cart = this.calculateCartSummary(userId, items);

    const res = createSuccessResponse('Cart', cart, 200);
    apiBus.logCall('Cart', 'GET', `/cart/${userId}`, 200, duration, null, {
      itemCount: cart.itemCount,
      total: cart.total
    });
    return res;
  }

  // POST /cart/items
  public async addToCart(params: {
    userId: string;
    product: Product;
    size: ClothingSize;
    color: ColorOption;
    quantity: number;
  }): Promise<ApiResponse<Cart>> {
    const start = performance.now();
    await simulateLatency(40, 80);
    const duration = Math.round(performance.now() - start);

    const { userId, product, size, color, quantity } = params;

    if (quantity <= 0) {
      const errRes = createErrorResponse<Cart>('Cart', 'Quantity must be at least 1', 400);
      apiBus.logCall('Cart', 'POST', '/cart/items', 400, duration, params, errRes);
      return errRes;
    }

    if (product.stock <= 0) {
      const errRes = createErrorResponse<Cart>('Cart', 'Product is currently out of stock', 400);
      apiBus.logCall('Cart', 'POST', '/cart/items', 400, duration, params, errRes);
      return errRes;
    }

    const currentItems = this.userCarts.get(userId) || [];

    const existingIndex = currentItems.findIndex(
      (item) =>
        item.productId === product.id &&
        item.size === size &&
        item.color.name === color.name
    );

    if (existingIndex > -1) {
      const existing = currentItems[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        const errRes = createErrorResponse<Cart>(
          'Cart',
          `Cannot add more than available stock (${product.stock})`,
          400
        );
        apiBus.logCall('Cart', 'POST', '/cart/items', 400, duration, params, errRes);
        return errRes;
      }
      currentItems[existingIndex].quantity = newQty;
    } else {
      currentItems.push({
        id: `cart-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        size,
        color,
        quantity: Math.min(quantity, product.stock),
        unitPrice: product.price,
        discountPrice: product.discountPrice,
        addedAt: new Date().toISOString()
      });
    }

    this.userCarts.set(userId, currentItems);
    const cart = this.calculateCartSummary(userId, currentItems);

    const res = createSuccessResponse('Cart', cart, 201, 'Item added to cart');
    apiBus.logCall('Cart', 'POST', '/cart/items', 201, duration, params, {
      itemCount: cart.itemCount,
      total: cart.total
    });
    return res;
  }

  // PUT /cart/items/:itemId
  public async updateItemQuantity(
    userId: string,
    itemId: string,
    quantity: number
  ): Promise<ApiResponse<Cart>> {
    const start = performance.now();
    await simulateLatency(30, 60);
    const duration = Math.round(performance.now() - start);

    const currentItems = this.userCarts.get(userId) || [];
    const itemIndex = currentItems.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
      const errRes = createErrorResponse<Cart>('Cart', 'Cart item not found', 404);
      apiBus.logCall('Cart', 'PUT', `/cart/items/${itemId}`, 404, duration, { quantity }, errRes);
      return errRes;
    }

    if (quantity <= 0) {
      currentItems.splice(itemIndex, 1);
    } else {
      const item = currentItems[itemIndex];
      if (quantity > item.product.stock) {
        const errRes = createErrorResponse<Cart>(
          'Cart',
          `Requested quantity exceeds stock (${item.product.stock})`,
          400
        );
        apiBus.logCall('Cart', 'PUT', `/cart/items/${itemId}`, 400, duration, { quantity }, errRes);
        return errRes;
      }
      currentItems[itemIndex].quantity = quantity;
    }

    this.userCarts.set(userId, currentItems);
    const cart = this.calculateCartSummary(userId, currentItems);

    const res = createSuccessResponse('Cart', cart, 200, 'Cart updated');
    apiBus.logCall('Cart', 'PUT', `/cart/items/${itemId}`, 200, duration, { quantity }, {
      itemCount: cart.itemCount,
      total: cart.total
    });
    return res;
  }

  // DELETE /cart/items/:itemId
  public async removeItem(userId: string, itemId: string): Promise<ApiResponse<Cart>> {
    const start = performance.now();
    await simulateLatency(20, 50);
    const duration = Math.round(performance.now() - start);

    let currentItems = this.userCarts.get(userId) || [];
    currentItems = currentItems.filter((i) => i.id !== itemId);
    this.userCarts.set(userId, currentItems);

    const cart = this.calculateCartSummary(userId, currentItems);
    const res = createSuccessResponse('Cart', cart, 200, 'Item removed from cart');
    apiBus.logCall('Cart', 'DELETE', `/cart/items/${itemId}`, 200, duration, null, {
      itemCount: cart.itemCount
    });
    return res;
  }

  // DELETE /cart/:userId (Clear cart)
  public async clearCart(userId: string): Promise<ApiResponse<Cart>> {
    const start = performance.now();
    await simulateLatency(20, 50);
    const duration = Math.round(performance.now() - start);

    this.userCarts.set(userId, []);
    const cart = this.calculateCartSummary(userId, []);

    const res = createSuccessResponse('Cart', cart, 200, 'Cart cleared');
    apiBus.logCall('Cart', 'DELETE', `/cart/${userId}`, 200, duration, null, { itemCount: 0 });
    return res;
  }
}

export const cartService = new CartService();

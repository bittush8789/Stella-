import { INITIAL_USERS } from '../data/mockUsers';
import { Address, ApiResponse, Order, OrderItem, OrderPricing, OrderStatus, PaymentMethod } from '../types/microservices';
import { apiBus, createErrorResponse, createSuccessResponse, simulateLatency } from './apiBus';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

class OrderService {
  private orders: Order[] = [];
  private activeSubscriptions: Map<string, any> = new Map();

  constructor() {
    // Seed initial orders in local cache as instant fallback
    const customer = INITIAL_USERS[0];
    const defaultAddress = customer.addresses[0];

    this.orders.push(
      {
        id: 'ORD-89241',
        userId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: [
          {
            productId: 'prod-tsh-001',
            productName: 'Shirt Soft Cotton',
            brand: 'Uniqlo',
            category: 'T-Shirts',
            size: 'M',
            color: { name: 'Heather Gray', hex: '#94A3B8' },
            quantity: 1,
            price: 1299,
            discountPrice: 799
          },
          {
            productId: 'prod-jea-011',
            productName: "501 Original Fit Selvedge Denim",
            brand: "Levi's",
            category: 'Jeans',
            size: 'L',
            color: { name: 'Raw Indigo', hex: '#1E293B' },
            quantity: 1,
            price: 4999,
            discountPrice: 3499
          }
        ],
        shippingAddress: defaultAddress,
        pricing: {
          subtotal: 4298,
          discount: 2000,
          shipping: 0,
          tax: 215,
          total: 4513
        },
        paymentMethod: 'UPI',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        estimatedDelivery: 'Oct 04, 2026'
      },
      {
        id: 'ORD-76412',
        userId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: [
          {
            productId: 'prod-shr-006',
            productName: 'Zip Up Neck Shirt',
            brand: 'Uniqlo',
            category: 'Shirts',
            size: 'L',
            color: { name: 'Midnight Navy', hex: '#0F172A' },
            quantity: 1,
            price: 2499,
            discountPrice: 1499
          }
        ],
        shippingAddress: defaultAddress,
        pricing: {
          subtotal: 1499,
          discount: 1000,
          shipping: 0,
          tax: 75,
          total: 1574
        },
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        estimatedDelivery: 'Sep 27, 2026'
      }
    );
  }

  // =========================================================================
  // 1. CREATE ORDER (Persists to 'orders' & 'order_items' in real-time)
  // =========================================================================
  public async createOrder(params: {
    userId: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    shippingAddress: Address;
    pricing: OrderPricing;
    paymentMethod: PaymentMethod;
  }): Promise<ApiResponse<Order>> {
    const start = performance.now();

    if (!params.items || params.items.length === 0) {
      const errRes = createErrorResponse<Order>('Order', 'Cannot place order with empty items', 400);
      apiBus.logCall('Order', 'POST', '/orders', 400, 20, params, errRes);
      return errRes;
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);

    const newOrder: Order = {
      id: orderId,
      userId: params.userId,
      customerName: params.customerName,
      customerEmail: params.customerEmail,
      items: params.items,
      shippingAddress: params.shippingAddress,
      pricing: params.pricing,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
      orderStatus: 'Confirmed',
      createdAt: new Date().toISOString(),
      estimatedDelivery: estDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    let targetBackend = 'In-Memory Store';

    if (isSupabaseConfigured() && supabase) {
      try {
        // Step A: Insert master order record into 'orders' table
        const { error: orderError } = await supabase.from('orders').insert([
          {
            id: newOrder.id,
            user_id: newOrder.userId,
            customer_name: newOrder.customerName,
            customer_email: newOrder.customerEmail,
            items: newOrder.items,
            shipping_address: newOrder.shippingAddress,
            subtotal: newOrder.pricing.subtotal,
            discount: newOrder.pricing.discount,
            shipping: newOrder.pricing.shipping,
            tax: newOrder.pricing.tax,
            total: newOrder.pricing.total,
            payment_method: newOrder.paymentMethod,
            payment_status: newOrder.paymentStatus,
            order_status: newOrder.orderStatus,
            estimated_delivery: newOrder.estimatedDelivery,
            created_at: newOrder.createdAt
          }
        ]);

        if (orderError) {
          console.warn('[OrderService] Warning inserting into orders table:', orderError.message);
        }

        // Step B: Insert individual items into 'order_items' table
        const orderItemRows = newOrder.items.map((item, index) => ({
          id: `${newOrder.id}-item-${index + 1}-${Date.now()}`,
          order_id: newOrder.id,
          product_id: item.productId,
          product_name: item.productName,
          brand: item.brand,
          category: item.category,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
          discount_price: item.discountPrice ?? null,
          created_at: newOrder.createdAt
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItemRows);

        if (itemsError) {
          console.warn('[OrderService] Warning inserting into order_items table:', itemsError.message);
        }

        targetBackend = 'Supabase PostgreSQL';
      } catch (err) {
        console.warn('[OrderService] Real-time Supabase persistence fallback:', err);
      }
    } else {
      await simulateLatency(50, 100);
    }

    // Prepend to local memory cache for immediate UI responsiveness
    this.orders.unshift(newOrder);

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Order', newOrder, 201, `Order created successfully [${targetBackend}]`);
    apiBus.logCall('Order', 'POST', `/orders [${targetBackend}]`, 201, duration, { orderId, total: newOrder.pricing.total }, newOrder);
    return res;
  }

  // =========================================================================
  // 2. GET USER ORDERS (Queries 'orders' and 'order_items' tables)
  // =========================================================================
  public async getOrdersByUser(userId: string): Promise<ApiResponse<Order[]>> {
    const start = performance.now();
    let userOrders = this.orders.filter((o) => o.userId === userId);
    let targetBackend = 'In-Memory Store';

    if (isSupabaseConfigured() && supabase) {
      try {
        // Step A: Fetch orders for user
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!ordersError && ordersData && ordersData.length > 0) {
          const orderIds = ordersData.map((d: any) => d.id);

          // Step B: Fetch order items from 'order_items' table for these orders
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);

          // Group items by order_id
          const itemsByOrderId: Record<string, OrderItem[]> = {};
          if (!itemsError && itemsData && itemsData.length > 0) {
            itemsData.forEach((it: any) => {
              if (!itemsByOrderId[it.order_id]) {
                itemsByOrderId[it.order_id] = [];
              }
              itemsByOrderId[it.order_id].push({
                productId: it.product_id,
                productName: it.product_name,
                brand: it.brand,
                category: it.category,
                size: it.size,
                color: it.color,
                quantity: it.quantity,
                price: Number(it.price),
                discountPrice: it.discount_price ? Number(it.discount_price) : undefined
              });
            });
          }

          targetBackend = 'Supabase PostgreSQL';
          userOrders = ordersData.map((d: any) => {
            // Use items from order_items table if available, otherwise fallback to embedded JSON snapshot
            const items = (itemsByOrderId[d.id] && itemsByOrderId[d.id].length > 0)
              ? itemsByOrderId[d.id]
              : (d.items || []);

            return {
              id: d.id,
              userId: d.user_id,
              customerName: d.customer_name,
              customerEmail: d.customer_email,
              items,
              shippingAddress: d.shipping_address,
              pricing: {
                subtotal: Number(d.subtotal),
                discount: Number(d.discount || 0),
                shipping: Number(d.shipping || 0),
                tax: Number(d.tax || 0),
                total: Number(d.total)
              },
              paymentMethod: d.payment_method,
              paymentStatus: d.payment_status,
              orderStatus: d.order_status,
              createdAt: d.created_at,
              estimatedDelivery: d.estimated_delivery
            };
          });

          // Update local cache
          userOrders.forEach((order) => {
            const idx = this.orders.findIndex((o) => o.id === order.id);
            if (idx >= 0) {
              this.orders[idx] = order;
            } else {
              this.orders.push(order);
            }
          });
        }
      } catch (err) {
        console.warn('[OrderService] getOrdersByUser Supabase query fallback:', err);
      }
    } else {
      await simulateLatency(30, 60);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Order', userOrders, 200);
    apiBus.logCall('Order', 'GET', `/orders/${userId} [${targetBackend}]`, 200, duration, null, { count: userOrders.length });
    return res;
  }

  // =========================================================================
  // 3. GET ORDER BY ID
  // =========================================================================
  public async getOrderById(orderId: string): Promise<ApiResponse<Order>> {
    const start = performance.now();

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (!orderErr && orderData) {
          // Fetch order items
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

          const items: OrderItem[] = itemsData && itemsData.length > 0
            ? itemsData.map((it: any) => ({
                productId: it.product_id,
                productName: it.product_name,
                brand: it.brand,
                category: it.category,
                size: it.size,
                color: it.color,
                quantity: it.quantity,
                price: Number(it.price),
                discountPrice: it.discount_price ? Number(it.discount_price) : undefined
              }))
            : (orderData.items || []);

          const order: Order = {
            id: orderData.id,
            userId: orderData.user_id,
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            items,
            shippingAddress: orderData.shipping_address,
            pricing: {
              subtotal: Number(orderData.subtotal),
              discount: Number(orderData.discount || 0),
              shipping: Number(orderData.shipping || 0),
              tax: Number(orderData.tax || 0),
              total: Number(orderData.total)
            },
            paymentMethod: orderData.payment_method,
            paymentStatus: orderData.payment_status,
            orderStatus: orderData.order_status,
            createdAt: orderData.created_at,
            estimatedDelivery: orderData.estimated_delivery
          };

          const duration = Math.round(performance.now() - start);
          return createSuccessResponse('Order', order, 200);
        }
      } catch (err) {
        console.warn('[OrderService] getOrderById Supabase fallback:', err);
      }
    }

    await simulateLatency(20, 50);
    const duration = Math.round(performance.now() - start);

    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      const errRes = createErrorResponse<Order>('Order', `Order '${orderId}' not found`, 404);
      apiBus.logCall('Order', 'GET', `/orders/order/${orderId}`, 404, duration, null, errRes);
      return errRes;
    }

    const res = createSuccessResponse('Order', { ...order }, 200);
    apiBus.logCall('Order', 'GET', `/orders/order/${orderId}`, 200, duration, null, { id: order.id, status: order.orderStatus });
    return res;
  }

  // =========================================================================
  // 4. CANCEL ORDER (Updates Supabase 'orders' in real-time)
  // =========================================================================
  public async cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
    const start = performance.now();

    let order = this.orders.find((o) => o.id === orderId);

    if (order && order.orderStatus === 'Delivered') {
      const errRes = createErrorResponse<Order>('Order', 'Delivered orders cannot be cancelled', 400);
      apiBus.logCall('Order', 'PUT', `/orders/${orderId}/cancel`, 400, 20, null, errRes);
      return errRes;
    }

    const updatedPaymentStatus = (order?.paymentStatus === 'Paid') ? 'Refunded' : 'Pending';

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({
            order_status: 'Cancelled',
            payment_status: updatedPaymentStatus
          })
          .eq('id', orderId)
          .select()
          .single();

        if (!error && data) {
          if (order) {
            order.orderStatus = 'Cancelled';
            order.paymentStatus = updatedPaymentStatus as any;
          }
        }
      } catch (err) {
        console.warn('[OrderService] cancelOrder Supabase error:', err);
      }
    } else {
      await simulateLatency(40, 80);
      if (order) {
        order.orderStatus = 'Cancelled';
        order.paymentStatus = updatedPaymentStatus as any;
      }
    }

    if (!order) {
      const orderFetch = await this.getOrderById(orderId);
      if (orderFetch.success && orderFetch.data) {
        order = orderFetch.data;
        order.orderStatus = 'Cancelled';
      } else {
        const errRes = createErrorResponse<Order>('Order', `Order '${orderId}' not found`, 404);
        return errRes;
      }
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Order', { ...order }, 200, 'Order successfully cancelled');
    apiBus.logCall('Order', 'PUT', `/orders/${orderId}/cancel`, 200, duration, null, { id: order.id, status: 'Cancelled' });
    return res;
  }

  // =========================================================================
  // 5. UPDATE ORDER STATUS (For customer tracking / delivery updates)
  // =========================================================================
  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<ApiResponse<Order>> {
    const start = performance.now();

    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.orderStatus = status;
    }

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('orders')
          .update({ order_status: status })
          .eq('id', orderId);
      } catch (err) {
        console.warn('[OrderService] updateOrderStatus Supabase fallback:', err);
      }
    } else {
      await simulateLatency(30, 60);
    }

    const duration = Math.round(performance.now() - start);
    const updated = order || ({ id: orderId, orderStatus: status } as any);
    const res = createSuccessResponse('Order', updated, 200, `Order status updated to ${status}`);
    apiBus.logCall('Order', 'PUT', `/orders/${orderId}/status`, 200, duration, { status }, { id: orderId, status });
    return res;
  }

  // =========================================================================
  // 6. REAL-TIME SUBSCRIPTION (Listens for order changes in PostgreSQL)
  // =========================================================================
  public subscribeToUserOrders(userId: string, onUpdate: (orders: Order[]) => void): () => void {
    if (!isSupabaseConfigured() || !supabase) {
      return () => {};
    }

    // Clean up existing channel for this user if active
    const existingChannel = this.activeSubscriptions.get(userId);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channelName = `realtime:orders:${userId}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userId}`
        },
        async (payload) => {
          console.log('[OrderService] Real-time orders change detected:', payload.eventType);
          const refreshed = await this.getOrdersByUser(userId);
          if (refreshed.success && refreshed.data) {
            onUpdate(refreshed.data);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items'
        },
        async () => {
          const refreshed = await this.getOrdersByUser(userId);
          if (refreshed.success && refreshed.data) {
            onUpdate(refreshed.data);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`[OrderService] Real-time subscription connected for user: ${userId}`);
        }
      });

    this.activeSubscriptions.set(userId, channel);

    // Return unsubscribe callback
    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
      this.activeSubscriptions.delete(userId);
    };
  }

  // =========================================================================
  // 7. GET ALL ORDERS (Full listing)
  // =========================================================================
  public async getAllOrders(): Promise<ApiResponse<Order[]>> {
    const start = performance.now();
    let ordersList = [...this.orders];

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data: ordersData, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && ordersData && ordersData.length > 0) {
          const orderIds = ordersData.map((d: any) => d.id);
          const { data: itemsData } = await supabase
            .from('order_items')
            .select('*')
            .in('order_id', orderIds);

          const itemsByOrderId: Record<string, OrderItem[]> = {};
          if (itemsData) {
            itemsData.forEach((it: any) => {
              if (!itemsByOrderId[it.order_id]) itemsByOrderId[it.order_id] = [];
              itemsByOrderId[it.order_id].push({
                productId: it.product_id,
                productName: it.product_name,
                brand: it.brand,
                category: it.category,
                size: it.size,
                color: it.color,
                quantity: it.quantity,
                price: Number(it.price),
                discountPrice: it.discount_price ? Number(it.discount_price) : undefined
              });
            });
          }

          ordersList = ordersData.map((d: any) => ({
            id: d.id,
            userId: d.user_id,
            customerName: d.customer_name,
            customerEmail: d.customer_email,
            items: itemsByOrderId[d.id] || d.items || [],
            shippingAddress: d.shipping_address,
            pricing: {
              subtotal: Number(d.subtotal),
              discount: Number(d.discount || 0),
              shipping: Number(d.shipping || 0),
              tax: Number(d.tax || 0),
              total: Number(d.total)
            },
            paymentMethod: d.payment_method,
            paymentStatus: d.payment_status,
            orderStatus: d.order_status,
            createdAt: d.created_at,
            estimatedDelivery: d.estimated_delivery
          }));
        }
      } catch (err) {
        console.warn('[OrderService] getAllOrders Supabase fallback:', err);
      }
    } else {
      await simulateLatency(30, 70);
    }

    const duration = Math.round(performance.now() - start);
    const res = createSuccessResponse('Order', ordersList, 200);
    apiBus.logCall('Order', 'GET', '/orders', 200, duration, null, { count: ordersList.length });
    return res;
  }
}

export const orderService = new OrderService();

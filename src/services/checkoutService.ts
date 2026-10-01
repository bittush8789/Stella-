import { Address, ApiResponse, Order, OrderItem, OrderPricing, PaymentMethod } from '../types/microservices';
import { apiBus, createErrorResponse, createSuccessResponse, simulateLatency } from './apiBus';
import { cartService } from './cartService';
import { orderService } from './orderService';
import { productService } from './productService';

interface CheckoutCalculationRequest {
  items: OrderItem[];
  shippingAddress?: Address;
}

interface ProcessCheckoutRequest {
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  shippingAddress: Address;
  pricing: OrderPricing;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    upiId?: string;
  };
}

class CheckoutService {
  // POST /checkout/calculate
  public async calculateCheckoutPricing(
    request: CheckoutCalculationRequest
  ): Promise<ApiResponse<OrderPricing>> {
    const start = performance.now();
    await simulateLatency(20, 50);
    const duration = Math.round(performance.now() - start);

    let subtotal = 0;
    let originalTotal = 0;

    request.items.forEach((item) => {
      const activePrice = item.discountPrice ?? item.price;
      subtotal += activePrice * item.quantity;
      originalTotal += item.price * item.quantity;
    });

    const discount = Math.max(0, originalTotal - subtotal);
    // Free delivery in India over ₹999, else ₹99
    const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const total = Math.round(subtotal + shipping + tax);

    const pricing: OrderPricing = {
      subtotal,
      discount,
      shipping,
      tax,
      total
    };

    const res = createSuccessResponse('Checkout', pricing, 200);
    apiBus.logCall('Checkout', 'POST', '/checkout/calculate', 200, duration, { itemCount: request.items.length }, pricing);
    return res;
  }

  // POST /checkout/process
  public async processOrder(
    request: ProcessCheckoutRequest
  ): Promise<ApiResponse<{ order: Order; transactionId: string }>> {
    const start = performance.now();
    await simulateLatency(80, 160); // Mock payment gateway processing delay
    const duration = Math.round(performance.now() - start);

    // Validate items
    if (!request.items || request.items.length === 0) {
      const errRes = createErrorResponse<{ order: Order; transactionId: string }>(
        'Checkout',
        'Cannot checkout with an empty basket',
        400
      );
      apiBus.logCall('Checkout', 'POST', '/checkout/process', 400, duration, null, errRes);
      return errRes;
    }

    // Validate shipping address
    if (
      !request.shippingAddress.fullName ||
      !request.shippingAddress.street ||
      !request.shippingAddress.city ||
      !request.shippingAddress.postalCode
    ) {
      const errRes = createErrorResponse<{ order: Order; transactionId: string }>(
        'Checkout',
        'Please provide a complete shipping address',
        400
      );
      apiBus.logCall('Checkout', 'POST', '/checkout/process', 400, duration, request.shippingAddress, errRes);
      return errRes;
    }

    // Mock payment validation
    if (request.paymentMethod === 'Credit Card' || request.paymentMethod === 'Debit Card') {
      const cardNum = request.paymentDetails?.cardNumber?.replace(/\s+/g, '') || '';
      if (cardNum.length < 12) {
        const errRes = createErrorResponse<{ order: Order; transactionId: string }>(
          'Checkout',
          'Invalid card number provided',
          400
        );
        apiBus.logCall('Checkout', 'POST', '/checkout/process', 400, duration, null, errRes);
        return errRes;
      }
    } else if (request.paymentMethod === 'UPI') {
      const upi = request.paymentDetails?.upiId?.trim() || '';
      if (!upi.includes('@')) {
        const errRes = createErrorResponse<{ order: Order; transactionId: string }>(
          'Checkout',
          'Invalid UPI ID format (e.g. yourname@okaxis, user@upi)',
          400
        );
        apiBus.logCall('Checkout', 'POST', '/checkout/process', 400, duration, null, errRes);
        return errRes;
      }
    }

    // Microservices orchestration:
    // 1. Create order in OrderService
    const orderRes = await orderService.createOrder({
      userId: request.userId,
      customerName: request.customerName,
      customerEmail: request.customerEmail,
      items: request.items,
      shippingAddress: request.shippingAddress,
      pricing: request.pricing,
      paymentMethod: request.paymentMethod
    });

    if (!orderRes.success || !orderRes.data) {
      const errRes = createErrorResponse<{ order: Order; transactionId: string }>(
        'Checkout',
        orderRes.message || 'Order creation failed',
        500
      );
      apiBus.logCall('Checkout', 'POST', '/checkout/process', 500, duration, null, errRes);
      return errRes;
    }

    const order = orderRes.data;

    // 2. Decrement stock in ProductService for each item
    for (const item of request.items) {
      const prodRes = await productService.getProductById(item.productId);
      if (prodRes.success && prodRes.data) {
        const newStock = Math.max(0, prodRes.data.stock - item.quantity);
        await productService.updateStock(item.productId, newStock);
      }
    }

    // 3. Clear shopping cart in CartService
    await cartService.clearCart(request.userId);

    const transactionId = `TXN-IN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const res = createSuccessResponse(
      'Checkout',
      { order, transactionId },
      200,
      'Payment verified and order placed successfully!'
    );

    apiBus.logCall('Checkout', 'POST', '/checkout/process', 200, duration, {
      userId: request.userId,
      method: request.paymentMethod,
      total: request.pricing.total
    }, { orderId: order.id, transactionId });

    return res;
  }
}

export const checkoutService = new CheckoutService();

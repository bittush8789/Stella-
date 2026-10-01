import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  ClipboardList,
  CreditCard,
  Truck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Package,
  Layers,
  Sparkles,
  ShoppingBag,
  Smartphone
} from 'lucide-react';
import { Address, Cart, Order, PaymentMethod, User } from '../types/microservices';
import { checkoutService } from '../services/checkoutService';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatINR } from '../utils/currency';
import { OrderTrackingStepper } from './OrderTrackingStepper';

interface Props {
  cart: Cart;
  user: User;
  onOrderComplete: (order: Order) => void;
  onCancelCheckout: () => void;
  onViewOrders: () => void;
}

export const CheckoutFlow: React.FC<Props> = ({
  cart,
  user,
  onOrderComplete,
  onCancelCheckout,
  onViewOrders
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Step 1: Address Form State with Indian default
  const initialAddress = user.addresses[0] || {
    id: 'addr-default',
    fullName: user.name,
    phoneNumber: user.phone || '+91 98201 54321',
    street: 'Linking Road, Bandra West, Apt 402',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
    isDefault: true
  };

  const [shippingAddress, setShippingAddress] = useState<Address>(initialAddress);

  // Step 3: Payment State with UPI as favorite in India
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [upiId, setUpiId] = useState('abdel@okaxis');

  const steps = [
    { number: 1, title: 'Address', icon: MapPin },
    { number: 2, title: 'Order Review', icon: ClipboardList },
    { number: 3, title: 'Payment', icon: CreditCard },
    { number: 4, title: 'Confirmation', icon: CheckCircle2 }
  ];

  // Address validation
  const validateAddress = () => {
    if (!shippingAddress.fullName.trim()) return 'Please enter your full name';
    if (!shippingAddress.phoneNumber.trim()) return 'Please enter your contact phone number';
    if (!shippingAddress.street.trim()) return 'Please enter your street address';
    if (!shippingAddress.city.trim()) return 'Please enter your city';
    if (!shippingAddress.postalCode.trim()) return 'Please enter your 6-digit PIN code';
    return '';
  };

  const handleNextFromAddress = () => {
    const error = validateAddress();
    if (error) {
      setErrorMessage(error);
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  // Submit Order via Checkout Microservice
  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const orderItems = cart.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        brand: item.product.brand,
        category: item.product.category,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.unitPrice,
        discountPrice: item.discountPrice
      }));

      const res = await checkoutService.processOrder({
        userId: user.id,
        customerName: shippingAddress.fullName,
        customerEmail: user.email,
        items: orderItems,
        shippingAddress,
        pricing: {
          subtotal: cart.subtotal,
          discount: cart.discount,
          shipping: cart.shipping,
          tax: cart.tax,
          total: cart.total
        },
        paymentMethod,
        paymentDetails: {
          cardNumber,
          cardExpiry,
          cardCvv,
          upiId
        }
      });

      if (res.success && res.data) {
        setCompletedOrder(res.data.order);
        setCurrentStep(4);
        onOrderComplete(res.data.order);
      } else {
        setErrorMessage(res.message || 'Payment simulation failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during checkout processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Progress Stepper */}
      <div className="mb-8">
        <button
          onClick={onCancelCheckout}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Bag
        </button>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Checkout</h1>

        {/* Step Indicator */}
        <div className="mt-6 flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = currentStep > st.number;
            const isCurrent = currentStep === st.number;

            return (
              <div key={st.number} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                    isCompleted
                      ? 'bg-teal-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-slate-900 text-white ring-4 ring-teal-100 shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'
                  }`}
                >
                  {st.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage('')} className="font-bold ml-2 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Main Flow Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        {/* ================= STEP 1: ADDRESS ================= */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1 — Delivery Address</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Where in India should we deliver your luxury apparel items?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Abdel Rahman / Rahul Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  10-Digit Mobile Number *
                </label>
                <input
                  type="text"
                  value={shippingAddress.phoneNumber}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, phoneNumber: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. +91 98201 54321"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Flat, House no., Building, Street Address *
                </label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Linking Road, Bandra West, Apt 402"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / District *
                </label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Mumbai"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, state: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. Maharashtra"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  placeholder="e.g. 400050"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={shippingAddress.country}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNextFromAddress}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                Continue to Order Review
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ORDER REVIEW ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Step 2 — Order Review</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verify your selected garments, Indian delivery address, and pricing in Indian Rupees.
                </p>
              </div>
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs text-teal-600 hover:underline font-semibold cursor-pointer"
              >
                Edit Address
              </button>
            </div>

            {/* Address Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-start gap-3 text-xs text-slate-700">
              <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">{shippingAddress.fullName}</span>
                <span>{shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postalCode}, {shippingAddress.country}</span>
                <span className="text-slate-500 block mt-0.5">Phone: {shippingAddress.phoneNumber}</span>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-3 divide-y divide-slate-100">
              {cart.items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <ProductPlaceholderImage
                        category={item.product.category}
                        name={item.product.name}
                        brand={item.product.brand}
                        colorHex={item.color.hex}
                        className="w-full h-full scale-90"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">{item.product.brand}</span>
                      <h4 className="text-xs font-bold text-slate-800">{item.product.name}</h4>
                      <span className="text-[11px] text-slate-500">
                        Size: {item.size} · Color: {item.color.name} · Qty: {item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatINR((item.discountPrice ?? item.unitPrice) * item.quantity)}
                    </span>
                    {item.discountPrice && (
                      <span className="text-[10px] text-slate-400 line-through block tabular-nums">
                        {formatINR(item.unitPrice * item.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span className="font-semibold tabular-nums">{formatINR(cart.subtotal)}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-rose-500 font-semibold">
                  <span>Savings / Discount</span>
                  <span className="tabular-nums">- {formatINR(cart.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span>{cart.shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(cart.shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="tabular-nums">{formatINR(cart.tax)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Final Payable Amount</span>
                <span className="text-teal-600 text-base tabular-nums">{formatINR(cart.total)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Back to Address
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                Proceed to Payment ({formatINR(cart.total)})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: MOCK PAYMENT (INDIAN RUPEES & UPI) ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3 — Payment (Indian Rupees)</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instant UPI, Credit/Debit cards & Cash on Delivery simulation.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['UPI', 'Credit Card', 'Debit Card', 'Cash on Delivery'] as PaymentMethod[]).map(
                (method) => {
                  const isSelected = paymentMethod === method;
                  return (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        {method === 'UPI' ? (
                          <Smartphone className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        ) : (
                          <CreditCard className={`w-4 h-4 ${isSelected ? 'text-teal-600' : 'text-slate-400'}`} />
                        )}
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-teal-500" />
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">
                        {method}
                      </span>
                      {method === 'UPI' && (
                        <span className="text-[10px] text-teal-600 font-medium block">
                          Instant · 0% Fee
                        </span>
                      )}
                    </button>
                  );
                }
              )}
            </div>

            {/* Form for UPI */}
            {paymentMethod === 'UPI' && (
              <div className="p-5 bg-teal-50/40 rounded-2xl border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                    Instant UPI Payment (GPay, PhonePe, Paytm, BHIM)
                  </span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded">
                    Popular in India
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Enter Virtual Payment Address (UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-teal-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200"
                    placeholder="yourname@okhdfcbank"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Supported: @okaxis, @okhdfcbank, @ybl, @paytm, @sbi
                  </span>
                </div>
              </div>
            )}

            {/* Form for Credit / Debit Card */}
            {(paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card') && (
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Card Information (RuPay / Visa / Mastercard)
                </span>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500"
                    placeholder="4242 •••• •••• 4242"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-teal-500"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form for Cash on Delivery */}
            {paymentMethod === 'Cash on Delivery' && (
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <span className="font-bold block">Cash on Delivery (COD) Selected</span>
                <p>
                  You will pay <strong>{formatINR(cart.total)}</strong> in cash or UPI QR scan directly to the courier executive upon delivery.
                </p>
              </div>
            )}

            {/* Security notice */}
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-bit Bank-grade SSL Encrypted Payment</span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={isProcessing}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Back to Review
              </button>

              <button
                onClick={handleProcessPayment}
                disabled={isProcessing}
                className="px-8 py-3.5 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                {isProcessing ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    Pay {formatINR(cart.total)}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: ORDER CONFIRMATION ================= */}
        {currentStep === 4 && completedOrder && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Thank you, {completedOrder.customerName}!
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Your order has been confirmed and is being prepared for fulfillment across India. A confirmation receipt has been sent to your email.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="max-w-md mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {completedOrder.id}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold text-emerald-600">{completedOrder.orderStatus}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-medium text-slate-800">{completedOrder.paymentMethod} ({completedOrder.paymentStatus})</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Estimated Delivery:</span>
                <span className="font-semibold text-slate-900">{completedOrder.estimatedDelivery}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">
                  {completedOrder.shippingAddress.street}, {completedOrder.shippingAddress.city}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Total Amount Paid:</span>
                <span className="text-teal-600 text-base tabular-nums">
                  {formatINR(completedOrder.pricing.total)}
                </span>
              </div>
            </div>

            {/* Live Progress Stepper */}
            <div className="max-w-md mx-auto text-left">
              <OrderTrackingStepper
                status={completedOrder.orderStatus}
                orderId={completedOrder.id}
                createdAt={completedOrder.createdAt}
                estimatedDelivery={completedOrder.estimatedDelivery}
                destinationCity={completedOrder.shippingAddress?.city}
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onViewOrders}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Package className="w-4 h-4" />
                Track in Order History
              </button>

              <button
                onClick={onCancelCheckout}
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

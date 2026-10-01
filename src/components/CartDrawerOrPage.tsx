import React from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Cart } from '../types/microservices';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatINR } from '../utils/currency';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: Cart;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawerOrPage: React.FC<Props> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onContinueShopping
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cart Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Shopping Bag</h2>
              <span className="text-xs text-slate-400">
                {cart.itemCount} {cart.itemCount === 1 ? 'garment' : 'garments'} in your bag
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.items.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded transition-colors cursor-pointer"
                title="Empty shopping cart"
              >
                Clear Bag
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Your bag is empty</h3>
                <p className="text-xs text-slate-500 max-w-xs mt-1">
                  Looks like you haven't added any clothing items to your shopping cart yet.
                </p>
              </div>
              <button
                onClick={onContinueShopping}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Explore 50 Curated Pieces
              </button>
            </div>
          ) : (
            cart.items.map((item) => {
              const activePrice = item.discountPrice ?? item.unitPrice;
              const itemTotal = activePrice * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  {/* Thumbnail Placeholder */}
                  <div className="w-20 h-24 shrink-0 rounded-xl overflow-hidden bg-white shadow-2xs border border-slate-200/50">
                    <ProductPlaceholderImage
                      category={item.product.category}
                      name={item.product.name}
                      brand={item.product.brand}
                      colorHex={item.color.hex}
                      className="w-full h-full scale-90"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase">
                            {item.product.brand}
                          </span>
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                            {item.product.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                          Size: {item.size}
                        </span>
                        <span className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          <span
                            className="w-2 h-2 rounded-full border border-slate-300"
                            style={{ backgroundColor: item.color.hex }}
                          />
                          {item.color.name}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price in INR */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden shadow-2xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-teal-600 tabular-nums">
                          {formatINR(itemTotal)}
                        </span>
                        {item.discountPrice && (
                          <span className="text-[10px] text-slate-400 line-through block tabular-nums">
                            {formatINR(item.unitPrice * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order Summary & Actions */}
        {cart.items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  {formatINR(cart.subtotal)}
                </span>
              </div>

              {cart.discount > 0 && (
                <div className="flex justify-between text-rose-500 font-medium">
                  <span>Savings / Discount</span>
                  <span className="tabular-nums">- {formatINR(cart.discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery (India)</span>
                <span>
                  {cart.shipping === 0 ? (
                    <strong className="text-emerald-600 font-semibold">FREE</strong>
                  ) : (
                    formatINR(cart.shipping)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="tabular-nums">{formatINR(cart.tax)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-teal-600 text-base tabular-nums">
                  {formatINR(cart.total)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onProceedToCheckout}
                className="w-full py-3 px-4 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onContinueShopping}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

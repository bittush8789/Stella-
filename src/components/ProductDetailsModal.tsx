import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ArrowRight,
  Layers
} from 'lucide-react';
import { ClothingSize, ColorOption, Product } from '../types/microservices';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatINR } from '../utils/currency';

interface Props {
  product: Product | null;
  onClose: () => void;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, size: ClothingSize, color: ColorOption, quantity: number) => void;
  onBuyNow: (product: Product, size: ClothingSize, color: ColorOption, quantity: number) => void;
}

export const ProductDetailsModal: React.FC<Props> = ({
  product,
  onClose,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onBuyNow
}) => {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<ClothingSize>(product.availableSizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<ColorOption>(
    product.availableColors[0] || { name: 'Standard', hex: '#94A3B8' }
  );
  const [quantity, setQuantity] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const savingsAmount = product.discountPrice
    ? product.price - product.discountPrice
    : 0;

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Preview Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-slate-50 flex flex-col justify-between">
          <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden shadow-inner bg-slate-100">
            <ProductPlaceholderImage
              category={product.category}
              name={product.name}
              brand={product.brand}
              colorHex={selectedColor.hex}
              className="w-full h-full"
            />
            {product.status === 'new_arrival' && (
              <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-semibold bg-teal-500 text-white rounded-md shadow-xs">
                New Arrival
              </span>
            )}
          </div>

          {/* Microservices Spec Note */}
          <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-500 shrink-0" />
            <span>
              Served via <strong>Product Service</strong> (<code>GET /products/{product.id}</code>)
            </span>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-4">
            {/* Brand & Title */}
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                {product.brand} · {product.category}
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} verified customer reviews)</span>
              </div>
            </div>

            {/* Price Box in Indian Rupees */}
            <div className="p-3.5 bg-slate-50 rounded-2xl flex items-baseline gap-3">
              <span className="text-2xl font-black text-teal-600 tabular-nums">
                {formatINR(product.discountPrice ?? product.price)}
              </span>
              {product.discountPrice && (
                <>
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formatINR(product.price)}
                  </span>
                  <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    Save {discountPercent}% ({formatINR(savingsAmount)} OFF)
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">{product.description}</p>

            {/* Material & Fit */}
            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px]">Material</span>
                <span className="font-medium text-slate-700">{product.material || '100% Combed Cotton'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Fit</span>
                <span className="font-medium text-slate-700">{product.fit || 'Regular Comfort'}</span>
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">
                Color: <strong className="text-slate-900">{selectedColor.name}</strong>
              </span>
              <div className="flex items-center gap-2">
                {product.availableColors.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className="w-7 h-7 rounded-full relative cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isSelected && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-teal-500 ring-offset-2 flex items-center justify-center">
                          <Check
                            className={`w-3.5 h-3.5 ${
                              color.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'
                            }`}
                          />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Select Size</span>
                <span className="text-[11px] text-teal-600 underline cursor-pointer">Size Guide</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {product.availableSizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-500 text-white shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Stock Availability */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-800 tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 disabled:opacity-40 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock status indicator */}
              <div className="text-right">
                {product.stock <= 5 ? (
                  <span className="text-xs font-semibold text-rose-500">
                    Hurry! Only {product.stock} items left
                  </span>
                ) : (
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units available)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-2.5 mt-4">
            <div className="flex gap-2.5">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                {isAddedFeedback ? 'Added to Bag ✓' : 'Add to Bag'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Buy Now
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isInWishlist
                    ? 'border-rose-200 bg-rose-50 text-rose-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Delivery & Assurance markers in India */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-teal-500" />
                <span>Free Shipping &gt; ₹999</span>
              </div>
              <div className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-teal-500" />
                <span>15-Day Easy Returns</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                <span>100% Genuine Apparel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

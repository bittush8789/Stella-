import React from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types/microservices';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatINR } from '../utils/currency';

interface Props {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  isInWishlist,
  onToggleWishlist,
  onQuickAddToCart,
  onSelectProduct
}) => {
  const activeColor = product.availableColors[0]?.hex || '#94A3B8';
  const discountPercent = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all duration-300">
      {/* 1. Image Area with Badges & Wishlist Trigger */}
      <div
        onClick={() => onSelectProduct(product)}
        className="relative cursor-pointer aspect-4/5 overflow-hidden bg-slate-100"
      >
        <ProductPlaceholderImage
          category={product.category}
          name={product.name}
          brand={product.brand}
          colorHex={activeColor}
          className="w-full h-full"
        />

        {/* Top-left: "New Arrival" badge matching reference image */}
        {product.status === 'new_arrival' ? (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold bg-teal-500 text-white rounded shadow-2xs flex items-center gap-1 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            New Arrival
          </span>
        ) : discountPercent > 0 ? (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold bg-rose-500 text-white rounded shadow-2xs tracking-wide">
            {discountPercent}% OFF
          </span>
        ) : null}

        {/* Top-right: Wishlist Heart button matching reference image */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 shadow-xs cursor-pointer ${
            isInWishlist
              ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white backdrop-blur-xs'
          }`}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isInWishlist ? 'fill-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className="flex-1 py-2 bg-slate-900/90 hover:bg-slate-950 backdrop-blur-md text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* 2. Content Info (matching reference card typography) */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand */}
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {product.brand}
          </span>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-sm font-semibold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700">{product.rating}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* 3. Price in Indian Rupees (₹) & Stock */}
        <div className="pt-3 mt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-teal-600 tabular-nums">
              {formatINR(product.discountPrice ?? product.price)}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-slate-400 line-through tabular-nums">
                {formatINR(product.price)}
              </span>
            )}
          </div>

          {/* Urgency Stock indicator */}
          {product.stock <= 5 ? (
            <span className="text-[11px] font-medium text-rose-500 tabular-nums">
              Only {product.stock} left!
            </span>
          ) : product.stock <= 15 ? (
            <span className="text-[11px] font-medium text-amber-600 tabular-nums">
              {product.stock} items left!
            </span>
          ) : (
            <span className="text-[11px] font-medium text-slate-400">
              In Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

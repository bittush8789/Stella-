import React from 'react';
import { Heart, Trash2, ShoppingBag, Star, ArrowLeft } from 'lucide-react';
import { Product, WishlistItem } from '../types/microservices';
import { ProductPlaceholderImage } from './ProductPlaceholderImage';
import { formatINR } from '../utils/currency';

interface Props {
  items: WishlistItem[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  onBackToShopping: () => void;
}

export const WishlistPage: React.FC<Props> = ({
  items,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
  onBackToShopping
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Wishlist Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <button
            onClick={onBackToShopping}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-2 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </button>
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Wishlist</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Saved garments and favorite styles ({items.length} saved)
          </p>
        </div>

        <button
          onClick={onBackToShopping}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>

      {/* Wishlist Grid */}
      {items.length === 0 ? (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center">
            <Heart className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Explore our 50 curated clothing pieces and tap the heart icon on any product to save it here for later.
            </p>
          </div>
          <button
            onClick={onBackToShopping}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            Browse Clothing Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-6">
          {items.map((item) => {
            const product = item.product;
            const discountPercent = product.discountPrice
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Image Placeholder */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-4/5 overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <ProductPlaceholderImage
                    category={product.category}
                    name={product.name}
                    brand={product.brand}
                    colorHex={product.availableColors[0]?.hex}
                    className="w-full h-full"
                  />

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-rose-50 hover:text-rose-500 text-slate-400 rounded-full shadow-xs transition-colors cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {discountPercent > 0 && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-semibold bg-rose-500 text-white rounded">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      {product.brand} · {product.category}
                    </span>
                    <h4
                      onClick={() => onSelectProduct(product)}
                      className="text-xs font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 cursor-pointer mt-0.5"
                    >
                      {product.name}
                    </h4>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-700">{product.rating}</span>
                      <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
                    </div>

                    {/* Price in Indian Rupees */}
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-bold text-teal-600 tabular-nums">
                        {formatINR(product.discountPrice ?? product.price)}
                      </span>
                      {product.discountPrice && (
                        <span className="text-xs text-slate-400 line-through tabular-nums">
                          {formatINR(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Availability */}
                    <div className="mt-1">
                      {product.stock <= 5 ? (
                        <span className="text-[11px] font-medium text-rose-500">
                          Low Stock: only {product.stock} left
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-emerald-600">
                          In Stock ({product.stock} available)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      Add to Bag
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product.id)}
                      className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ShieldCheck,
  RotateCcw,
  Truck,
  MapPin,
  ChevronDown,
  Sparkles,
  X,
  LogIn,
  Package
} from 'lucide-react';
import { User } from '../types/microservices';

interface Props {
  user: User;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenAuth: () => void;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<Props> = ({
  user,
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenAuth,
  onNavigateHome
}) => {
  const [selectedCountry, setSelectedCountry] = useState('IND');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = [
    { code: 'IND', name: 'India', flag: '🇮🇳', currency: 'INR (₹)' },
    { code: 'USA', name: 'United States', flag: '🇺🇸', currency: 'USD ($)' },
    { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', currency: 'AED' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP (£)' }
  ];

  const currentCountryObj = countries.find((c) => c.code === selectedCountry) || countries[0];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* 1. Top Utility Header Bar */}
      <div className="bg-[#0F172A] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Location indicator */}
          <div className="relative">
            <button
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-300"
            >
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>Ship to: <strong className="text-white font-medium">{currentCountryObj.name}</strong> {currentCountryObj.flag}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
                {countries.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setSelectedCountry(c.code);
                      setIsCountryDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-800 flex items-center justify-between text-xs text-slate-200 cursor-pointer"
                  >
                    <span>{c.flag} {c.name}</span>
                    <span className="text-[10px] text-teal-400 font-mono">{c.currency}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Middle: Customer Announcement */}
          <div className="hidden md:flex items-center gap-2 text-teal-300 text-[11px] font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Complimentary Express Shipping on all prepaid orders across India</span>
          </div>

          {/* Right: Trust badges */}
          <div className="flex items-center gap-4 text-slate-300 text-[11px]">
            <div className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-teal-400" />
              <span>Free Delivery ₹999+</span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span>Easy <strong className="font-semibold text-slate-200">RETURNS</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>100% Genuine</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo - Stylized 'stella' */}
        <div className="flex items-center gap-6">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white shadow-sm group-hover:bg-teal-600 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M16 6a3 3 0 0 0-3-3H9a4 4 0 0 0-4 4 4 4 0 0 0 4 4h4a2 2 0 0 1 2 2 2 2 0 0 1-2 2H8a3 3 0 0 1-3-3H3a5 5 0 0 0 5 5h4a4 4 0 0 0 4-4 4 4 0 0 0-4-4H8a2 2 0 0 1-2-2 2 2 0 0 1 2-2h4a3 3 0 0 1 3 3z" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-600 transition-colors">
              stella
            </span>
          </button>
        </div>

        {/* Search Bar - Center Pill */}
        <div className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search shirts, dresses, jeans, jackets..."
              className="w-full pl-10 pr-9 py-2 bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-sm text-slate-800 rounded-full border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Icons & User Info */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Shopping Cart Icon with Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-2 text-slate-700 hover:text-teal-600 transition-colors cursor-pointer"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Wishlist Heart Icon with Badge */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 text-slate-700 hover:text-rose-500 transition-colors cursor-pointer"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-0.5 min-w-4 h-4 px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {wishlistCount}
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* Currency indicator */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-slate-700 font-semibold px-2 py-0.5 bg-slate-100 rounded-md">
            <span>🇮🇳</span>
            <span>INR (₹)</span>
          </div>

          {/* User Account / Avatar with image or initials */}
          <button
            onClick={onOpenAccount}
            className="flex items-center gap-2 pl-1 py-1 pr-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
            title="View My Account"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center text-xs ring-2 ring-teal-500/20">
                {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
            )}
            <div className="hidden md:block">
              <span className="block text-[10px] text-slate-400 leading-tight">Hello,</span>
              <span className="block text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                {user.name}
              </span>
            </div>
          </button>

          {/* Orders Quick Link */}
          <button
            onClick={onOpenAccount}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="View Orders"
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>Orders</span>
          </button>

          {/* Sign In / Sign Up Trigger */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-teal-500 hover:bg-teal-600 text-white transition-colors cursor-pointer shadow-xs"
            title="Sign In or Register"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};

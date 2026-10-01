import React from 'react';
import { ShieldCheck, RotateCcw, Truck, CreditCard, HeartHandshake, PhoneCall } from 'lucide-react';
import { CATEGORIES } from '../data/mockProducts';
import { ClothingCategory } from '../types/microservices';

interface Props {
  onSelectCategory: (cat: ClothingCategory) => void;
}

export const Footer: React.FC<Props> = ({ onSelectCategory }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-12 pb-8 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Free Delivery across India</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Complimentary shipping across India on all orders over ₹999</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">15-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Hassle-free return policy with prepaid courier pick-up</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">100% Genuine Apparel</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Authentic garments crafted from premium natural fibers</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs">Safe & Secure Payments</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">UPI, RuPay, Visa, Mastercard, NetBanking & Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-10">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-white font-bold">
                s
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">stella</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Stella is a modern apparel brand committed to architectural minimalism, refined silhouettes, and enduring textile craftsmanship across 50 signature clothing pieces.
            </p>
            <div className="pt-2 text-[11px] text-slate-500 space-y-1">
              <p>📍 Design Studio: Bandra West, Mumbai, India</p>
              <p>📞 Customer Support: +91 98201 54321 (9 AM - 8 PM IST)</p>
            </div>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs mb-3">Shop Collections</h5>
            <ul className="space-y-2 text-[11px] text-slate-500">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => onSelectCategory(cat.name as ClothingCategory)}
                    className="hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs mb-3">More Categories</h5>
            <ul className="space-y-2 text-[11px] text-slate-500">
              {CATEGORIES.slice(5).map((cat) => (
                <li key={cat.name}>
                  <button
                    onClick={() => onSelectCategory(cat.name as ClothingCategory)}
                    className="hover:text-teal-600 transition-colors cursor-pointer"
                  >
                    {cat.name} ({cat.count})
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 text-xs mb-3">Customer Care</h5>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li>
                <span className="hover:text-teal-600 transition-colors cursor-pointer">
                  Track Your Order
                </span>
              </li>
              <li>
                <span className="hover:text-teal-600 transition-colors cursor-pointer">
                  Shipping & Delivery Info
                </span>
              </li>
              <li>
                <span className="hover:text-teal-600 transition-colors cursor-pointer">
                  Returns & Exchange Policy
                </span>
              </li>
              <li>
                <span className="hover:text-teal-600 transition-colors cursor-pointer">
                  Size Guide & Fit Assistance
                </span>
              </li>
              <li>
                <span className="hover:text-teal-600 transition-colors cursor-pointer">
                  Frequently Asked Questions (FAQ)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} Stella Apparel Pvt Ltd. All rights reserved. Handcrafted in India.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Shipping & COD Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

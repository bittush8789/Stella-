import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { ClothingCategory } from '../types/microservices';

interface Props {
  onExploreClick: () => void;
  onSelectCategory?: (category: ClothingCategory) => void;
}

export const HeroBanner: React.FC<Props> = ({ onExploreClick, onSelectCategory }) => {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#94A3B8] via-[#8B9AA8] to-[#788896] text-white">
      {/* Background Subtle Graphic Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center justify-between min-h-[300px] md:min-h-[360px] relative z-10">
        {/* Left Headline */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-2 text-left">
          <span className="text-teal-200 text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-300" />
            Autumn / Winter '26 Collection
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-none">
            Simple <br />
            <span className="text-slate-100 font-light">is More</span>
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-md pt-2 font-normal leading-relaxed">
            Thoughtfully engineered apparel crafted from Japanese cotton, French linen, and sustainably sourced wool. Designed for effortless everyday living.
          </p>

          <div className="pt-4 flex items-center gap-3">
            <button
              onClick={onExploreClick}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
            >
              Shop Collection
              <ArrowDown className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-300 font-medium">
              50 Curated Pieces
            </span>
          </div>
        </div>

        {/* Right Fashion Model & Artwork (mirroring the reference image composition) */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end mt-8 md:mt-0 relative">
          <div className="relative w-72 h-80 sm:w-80 sm:h-88 flex items-center justify-center">
            {/* Visual Frame */}
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 rounded-2xl overflow-hidden bg-gradient-to-t from-slate-900/40 via-slate-800/10 to-transparent backdrop-blur-xs border border-white/20 shadow-2xl flex flex-col items-center justify-end p-6 text-center">
              
              {/* Silhouette model aesthetic vector */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                <svg viewBox="0 0 200 240" className="w-48 h-56 text-slate-100/90 fill-current drop-shadow-md">
                  {/* Stylized high-fashion model torso & portrait */}
                  <ellipse cx="100" cy="50" rx="22" ry="26" fill="#F1F5F9" />
                  <path d="M78 40 C78 20 122 20 122 40 C130 50 126 68 116 68 C116 54 84 54 84 68 C74 68 70 50 78 40 Z" fill="#334155" />
                  {/* Shoulders & Jacket */}
                  <path d="M60 88 C70 76 90 76 100 82 C110 76 130 76 140 88 L155 160 L140 230 L60 230 L45 160 Z" fill="#1E293B" />
                  <path d="M85 84 L100 130 L115 84" fill="#E2E8F0" />
                  <path d="M100 130 L100 230" stroke="#0F172A" strokeWidth="2" />
                </svg>
              </div>

              {/* Text Callout matching image.png */}
              <div className="relative z-10 space-y-1">
                <p className="text-[11px] uppercase tracking-widest text-teal-300 font-bold">
                  Designed to stand out
                </p>
                <p className="text-xs text-slate-100 font-medium tracking-wider uppercase">
                  Limited-Editions Styles
                </p>
              </div>
            </div>

            {/* Circular Down-Arrow Button matching image.png */}
            <button
              onClick={onExploreClick}
              className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md border border-white/40 shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer"
              title="Scroll to Clothes"
            >
              <ArrowDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

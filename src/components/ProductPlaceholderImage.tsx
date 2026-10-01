import React from 'react';
import { ClothingCategory } from '../types/microservices';

interface Props {
  category: ClothingCategory;
  name: string;
  brand: string;
  colorHex?: string;
  className?: string;
}

export const ProductPlaceholderImage: React.FC<Props> = ({
  category,
  name,
  brand,
  colorHex = '#94A3B8',
  className = 'w-full h-full'
}) => {
  // Category-specific SVG silhouettes
  const renderSilhouette = () => {
    switch (category) {
      case 'T-Shirts':
        return (
          <path
            d="M50 22 C62 30 78 30 90 22 L116 38 L104 62 L92 56 L92 120 L48 120 L48 56 L36 62 L24 38 Z"
            fill="currentColor"
            fillOpacity="0.85"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        );
      case 'Shirts':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M50 20 C60 26 80 26 90 20 L118 36 L108 58 L96 52 L96 122 L44 122 L44 52 L32 58 L22 36 Z" />
            <path d="M70 24 L70 122" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            <path d="M60 21 L70 32 L80 21" fill="none" stroke="white" strokeWidth="1.5" />
          </g>
        );
      case 'Jeans':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M40 25 L100 25 L104 125 L75 125 L71 65 L69 65 L65 125 L36 125 Z" />
            <path d="M40 38 L100 38" stroke="white" strokeWidth="1.5" opacity="0.4" />
            <path d="M50 48 C60 55 60 55 60 48" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
            <path d="M90 48 C80 55 80 55 80 48" stroke="white" strokeWidth="1" fill="none" opacity="0.5" />
          </g>
        );
      case 'Trousers':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M42 24 L98 24 L102 124 L76 124 L71 60 L69 60 L64 124 L38 124 Z" />
            <path d="M56 36 L56 120" stroke="white" strokeWidth="1" opacity="0.3" />
            <path d="M84 36 L84 120" stroke="white" strokeWidth="1" opacity="0.3" />
          </g>
        );
      case 'Jackets':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M46 22 L70 26 L94 22 L120 40 L108 72 L96 66 L96 124 L44 124 L44 66 L32 72 L20 40 Z" />
            <path d="M70 26 L70 124" stroke="white" strokeWidth="2" opacity="0.7" />
            <circle cx="70" cy="50" r="2.5" fill="white" />
            <circle cx="70" cy="70" r="2.5" fill="white" />
            <circle cx="70" cy="90" r="2.5" fill="white" />
          </g>
        );
      case 'Hoodies':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M54 30 C54 16 86 16 86 30 L116 46 L104 76 L94 68 L94 122 L46 122 L46 68 L36 76 L24 46 Z" />
            <path d="M55 82 L85 82 L88 106 L52 106 Z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5" />
            <path d="M64 36 L64 54" stroke="white" strokeWidth="1.5" opacity="0.7" />
            <path d="M76 36 L76 54" stroke="white" strokeWidth="1.5" opacity="0.7" />
          </g>
        );
      case 'Sweatshirts':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M52 24 C62 30 78 30 88 24 L118 42 L106 72 L94 64 L94 122 L46 122 L46 64 L34 72 L22 42 Z" />
            <path d="M64 27 L70 34 L76 27" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          </g>
        );
      case 'Dresses':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M56 22 L84 22 L82 52 L112 124 L28 124 L58 52 Z" />
            <path d="M56 50 L84 50" stroke="white" strokeWidth="1.5" opacity="0.6" />
          </g>
        );
      case 'Kurtas':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M52 20 L88 20 L110 38 L98 58 L90 52 L92 126 L48 126 L50 52 L42 58 L30 38 Z" />
            <path d="M70 20 L70 60" stroke="white" strokeWidth="1.5" opacity="0.8" />
            <circle cx="70" cy="30" r="1.5" fill="white" />
            <circle cx="70" cy="40" r="1.5" fill="white" />
            <circle cx="70" cy="50" r="1.5" fill="white" />
          </g>
        );
      case 'Shorts':
        return (
          <g fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
            <path d="M42 35 L98 35 L104 88 L76 88 L70 60 L64 88 L36 88 Z" />
            <path d="M42 45 L98 45" stroke="white" strokeWidth="1.5" opacity="0.5" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#ECEFF1] via-[#E2E8F0] to-[#CBD5E1] transition-transform duration-300 ${className}`}
      style={{ minHeight: '220px' }}
      title={`${name} - ${brand} (${category})`}
    >
      {/* Studio Lighting Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.7),transparent_70%)] pointer-events-none" />

      {/* Stylized Silhouette Vector */}
      <div
        className="relative z-10 w-28 h-32 flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
        style={{ color: colorHex }}
      >
        <svg
          viewBox="0 0 140 145"
          className="w-full h-full drop-shadow-md transition-all duration-300"
        >
          {renderSilhouette()}
        </svg>
      </div>

      {/* Subtle bottom ground shadow */}
      <div className="absolute bottom-5 w-24 h-2 bg-slate-400/25 rounded-full blur-[2px] pointer-events-none" />

      {/* Micro Placeholder Tag */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-slate-500 font-medium tracking-wide">
        <span className="truncate max-w-[120px]">{brand}</span>
        <span className="uppercase text-[9px] text-slate-400 bg-white/60 px-1.5 py-0.5 rounded shadow-2xs backdrop-blur-xs">
          {category}
        </span>
      </div>
    </div>
  );
};

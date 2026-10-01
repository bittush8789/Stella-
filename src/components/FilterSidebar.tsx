import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';
import { BRANDS, CATEGORIES } from '../data/mockProducts';
import { ClothingCategory, ClothingSize, FilterState } from '../types/microservices';
import { formatINR } from '../utils/currency';

interface Props {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<Props> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isOpenOnMobile = false,
  onCloseMobile
}) => {
  const [isBrandOpen, setIsBrandOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isSizeOpen, setIsSizeOpen] = useState(true);
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  const sizes: ClothingSize[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const colorPalette = [
    { name: 'Black', hex: '#0F172A' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Yellow', hex: '#EAB308' },
    { name: 'Mint', hex: '#4ADE80' },
    { name: 'Teal', hex: '#0D9488' },
    { name: 'Cyan', hex: '#06B6D4' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Purple', hex: '#A855F7' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Sand', hex: '#D7C4A5' }
  ];

  const filteredBrands = BRANDS.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const toggleCategory = (cat: ClothingCategory) => {
    const exists = filters.categories.includes(cat);
    const updated = exists
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: updated });
  };

  const toggleBrand = (brandName: string) => {
    const exists = filters.brands.includes(brandName);
    const updated = exists
      ? filters.brands.filter((b) => b !== brandName)
      : [...filters.brands, brandName];
    onFilterChange({ ...filters, brands: updated });
  };

  const toggleSize = (size: ClothingSize) => {
    const exists = filters.sizes.includes(size);
    const updated = exists
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: updated });
  };

  const toggleColor = (colorName: string) => {
    const exists = filters.colors.includes(colorName);
    const updated = exists
      ? filters.colors.filter((c) => c !== colorName)
      : [...filters.colors, colorName];
    onFilterChange({ ...filters, colors: updated });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = Number.isNaN(value) ? 0 : value;
    if (index === 0 && newRange[0] > newRange[1]) newRange[0] = newRange[1];
    if (index === 1 && newRange[1] < newRange[0]) newRange[1] = newRange[0];
    onFilterChange({ ...filters, priceRange: newRange });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 8000 ||
    filters.minRating > 0;

  return (
    <aside
      className={`w-full lg:w-64 shrink-0 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs ${
        isOpenOnMobile
          ? 'fixed inset-y-0 left-0 z-50 w-80 overflow-y-auto shadow-2xl rounded-none'
          : 'relative'
      }`}
    >
      {/* Sidebar Header matching image */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full ring-4 ring-teal-100 bg-teal-500" />
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Filter</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdvanced(!isAdvanced)}
            className={`text-xs font-medium px-2 py-0.5 rounded transition-colors cursor-pointer ${
              isAdvanced
                ? 'bg-teal-50 text-teal-600'
                : 'text-teal-600 hover:text-teal-700'
            }`}
          >
            Advanced
          </button>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="text-xs text-slate-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {isOpenOnMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden text-xs text-slate-500 px-2 py-1 bg-slate-100 rounded cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-100 space-y-4 pt-2">
        {/* 1. Brand Section */}
        <div className="pt-2">
          <button
            onClick={() => setIsBrandOpen(!isBrandOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 cursor-pointer"
          >
            <span>Brand</span>
            {isBrandOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isBrandOpen && (
            <div className="space-y-2">
              {/* Brand Search Input */}
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Brand List */}
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredBrands.map((b) => {
                  const isChecked = filters.brands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      onClick={() => toggleBrand(b.name)}
                      className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 py-1 px-1.5 rounded cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                            isChecked
                              ? 'bg-teal-500 border-teal-500 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span className="font-medium text-slate-700">{b.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 tabular-nums">{b.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 2. Price Section for Indian Rupees (₹) with Cyan Histogram Curve */}
        <div className="pt-4">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 cursor-pointer"
          >
            <span>Price (₹ INR)</span>
            {isPriceOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isPriceOpen && (
            <div className="space-y-3">
              {/* Cyan Distribution Curve graphic matching image */}
              <div className="relative pt-2 px-1">
                <svg viewBox="0 0 200 45" className="w-full h-11 text-teal-400 overflow-visible">
                  <defs>
                    <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  {/* Histogram Curve */}
                  <path
                    d="M 5 40 Q 30 38, 55 25 T 105 10 T 155 28 T 195 40 L 195 45 L 5 45 Z"
                    fill="url(#priceGradient)"
                  />
                  <path
                    d="M 5 40 Q 30 38, 55 25 T 105 10 T 155 28 T 195 40"
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {/* Slider points */}
                  <circle cx="25" cy="38" r="4" fill="white" stroke="#06b6d4" strokeWidth="2.5" />
                  <circle cx="175" cy="35" r="4" fill="white" stroke="#06b6d4" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Price Range Dual Inputs with ₹ */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Min Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      min={0}
                      max={filters.priceRange[1]}
                      step={100}
                      value={filters.priceRange[0]}
                      onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Max Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                    <input
                      type="number"
                      min={filters.priceRange[0]}
                      max={10000}
                      step={100}
                      value={filters.priceRange[1]}
                      onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono text-xs focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Size Section */}
        <div className="pt-4">
          <button
            onClick={() => setIsSizeOpen(!isSizeOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 cursor-pointer"
          >
            <span>Size</span>
            {isSizeOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isSizeOpen && (
            <div className="grid grid-cols-4 gap-1.5">
              {sizes.map((sz) => {
                const isSelected = filters.sizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => toggleSize(sz)}
                    className={`py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Color Swatches */}
        <div className="pt-4">
          <button
            onClick={() => setIsColorOpen(!isColorOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 cursor-pointer"
          >
            <span>Color</span>
            {isColorOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isColorOpen && (
            <div className="flex flex-wrap gap-2 pt-1">
              {colorPalette.map((col) => {
                const isSelected = filters.colors.includes(col.name);
                return (
                  <button
                    key={col.name}
                    onClick={() => toggleColor(col.name)}
                    title={col.name}
                    className={`w-6 h-6 rounded-full relative transition-transform hover:scale-110 cursor-pointer ${
                      col.border ? 'border border-slate-300' : ''
                    }`}
                    style={{ backgroundColor: col.hex }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 rounded-full ring-2 ring-teal-500 ring-offset-2 flex items-center justify-center">
                        <Check
                          className={`w-3 h-3 ${
                            col.hex === '#FFFFFF' || col.hex === '#EAB308' || col.hex === '#D7C4A5'
                              ? 'text-slate-900'
                              : 'text-white'
                          }`}
                        />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Categories Accordion */}
        <div className="pt-4">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 cursor-pointer"
          >
            <span>Clothing Category</span>
            {isCategoryOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {isCategoryOpen && (
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {CATEGORIES.map((cat) => {
                const isChecked = filters.categories.includes(cat.name as ClothingCategory);
                return (
                  <label
                    key={cat.name}
                    onClick={() => toggleCategory(cat.name as ClothingCategory)}
                    className="flex items-center justify-between text-xs py-1 px-1.5 rounded cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                          isChecked
                            ? 'bg-teal-500 border-teal-500 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="text-slate-700 font-medium">{cat.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{cat.count}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Advanced Filter (Rating) */}
        {isAdvanced && (
          <div className="pt-4 space-y-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Minimum Rating
            </span>
            <div className="flex items-center gap-1.5">
              {[4, 4.5, 4.8].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    onFilterChange({
                      ...filters,
                      minRating: filters.minRating === rating ? 0 : rating
                    })
                  }
                  className={`px-2.5 py-1 text-xs rounded-lg border font-medium transition-colors cursor-pointer ${
                    filters.minRating === rating
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ★ {rating}+
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

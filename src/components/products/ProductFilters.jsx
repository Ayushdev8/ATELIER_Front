'use client';

import React from 'react';
import { categories } from '@/data/categories';
import { Star, RotateCcw, Check } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProductFilters({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  minRating,
  onRatingChange,
  saleOnly,
  onSaleOnlyToggle,
  inStockOnly,
  onInStockToggle,
  onResetFilters,
}) {
  return (
    <div className="space-y-8 text-stone-800">
      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3.5">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
              !selectedCategory
                ? 'bg-stone-900 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  isSelected
                    ? 'bg-stone-900 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-6 border-t border-stone-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3.5">
          Price Range
        </h4>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1/2">
            <label className="text-[10px] font-semibold text-stone-500 uppercase">Min ($)</label>
            <input
              type="number"
              min="0"
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(e) => onPriceChange([Number(e.target.value) || 0, priceRange[1]])}
              className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>
          <div className="w-1/2">
            <label className="text-[10px] font-semibold text-stone-500 uppercase">Max ($)</label>
            <input
              type="number"
              min={priceRange[0]}
              max="1000"
              value={priceRange[1]}
              onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value) || 500])}
              className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-800 focus:outline-none focus:ring-1 focus:ring-brand-700"
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          step="10"
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-brand-700 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-stone-500 mt-1">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Minimum Rating Filter */}
      <div className="pt-6 border-t border-stone-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3.5">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((ratingVal) => {
            const isSelected = minRating === ratingVal;
            return (
              <button
                key={ratingVal}
                onClick={() => onRatingChange(isSelected ? 0 : ratingVal)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                  isSelected ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{ratingVal} Stars &amp; above</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Toggles */}
      <div className="pt-6 border-t border-stone-200/80 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3.5">
          Preferences
        </h4>
        <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer select-none">
          <span>Promotions &amp; Discounts</span>
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={(e) => onSaleOnlyToggle(e.target.checked)}
            className="w-4 h-4 accent-brand-700 rounded cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between text-xs text-stone-700 cursor-pointer select-none">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockToggle(e.target.checked)}
            className="w-4 h-4 accent-brand-700 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Reset button */}
      <div className="pt-6 border-t border-stone-200/80">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetFilters}
          className="w-full text-xs font-semibold gap-2 border-stone-300 text-stone-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </Button>
      </div>
    </div>
  );
}

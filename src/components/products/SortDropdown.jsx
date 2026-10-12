'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-stone-500">
        Sort By:
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none bg-white border border-stone-200 text-stone-800 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-brand-700 cursor-pointer"
        >
          <option value="featured">Featured Curations</option>
          <option value="newest">Newest Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popularity">Popularity / Best Sellers</option>
          <option value="rating">Highest Rated</option>
        </select>
        <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-2.5 pointer-events-none" />
      </div>
    </div>
  );
}

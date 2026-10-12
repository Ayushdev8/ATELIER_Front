'use client';

import React, { useState } from 'react';
import { dashboardOverview } from '@/data/dashboard';
import { formatCurrency } from '@/utils/formatCurrency';
import { TrendingUp, BarChart3 } from 'lucide-react';

export default function SalesChart() {
  const data = dashboardOverview.monthlySales;
  const maxRevenue = Math.max(...data.map((d) => d.revenue));
  const [activeItem, setActiveItem] = useState(data[data.length - 1]);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-700" />
            <h3 className="font-serif text-lg font-bold text-stone-950">
              Revenue Performance Overview
            </h3>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Historical monthly volume and sales transactions (May – Oct 2026).
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-3 rounded-2xl border border-stone-200/60 text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
            {activeItem.month} Revenue
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold text-stone-950 font-sans">
              {formatCurrency(activeItem.revenue)}
            </span>
            <span className="text-xs text-emerald-700 font-bold">
              {activeItem.orders} orders
            </span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart Visualization */}
      <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 pt-4 border-b border-stone-100 pb-2">
        {data.map((item) => {
          const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
          const isSelected = activeItem.month === item.month;

          return (
            <div
              key={item.month}
              onMouseEnter={() => setActiveItem(item)}
              onClick={() => setActiveItem(item)}
              className="flex-1 flex flex-col items-center cursor-pointer group"
            >
              {/* Tooltip on hover */}
              <div
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-all mb-2 ${
                  isSelected
                    ? 'bg-stone-900 text-white opacity-100 scale-100'
                    : 'opacity-0 group-hover:opacity-100 bg-stone-100 text-stone-700'
                }`}
              >
                ${(item.revenue / 1000).toFixed(1)}k
              </div>

              {/* Bar */}
              <div className="w-full max-w-[48px] h-40 bg-stone-100 rounded-xl relative flex items-end overflow-hidden p-1">
                <div
                  className={`w-full rounded-lg transition-all duration-500 ${
                    isSelected
                      ? 'bg-brand-700 shadow-md'
                      : 'bg-stone-800 group-hover:bg-brand-600'
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isSelected ? 'text-brand-800 font-bold' : 'text-stone-400 group-hover:text-stone-700'
                }`}
              >
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Metrics */}
      <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+14.8% growth trajectory vs prior quarterly cycle</span>
        </div>
        <span>6 Month Total: $225,420</span>
      </div>
    </div>
  );
}

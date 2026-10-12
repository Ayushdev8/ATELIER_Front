import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatCard({ label, value, change, isPositive = true, timeframe = '', icon: Icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-soft-sm hover:shadow-soft transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider uppercase text-stone-500">{label}</span>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {change}
          </span>
        )}
      </div>
      {timeframe && <p className="mt-2 text-xs text-stone-400">{timeframe}</p>}
    </div>
  );
}

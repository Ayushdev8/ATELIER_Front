'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-stone-900 text-stone-200 text-xs tracking-wide py-2.5 px-4 relative z-40 border-b border-stone-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 font-semibold text-brand-300">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            Autumn/Winter 2026 Collection
          </span>
          <span className="hidden sm:inline text-stone-400">•</span>
          <span className="text-stone-300">
            Complimentary express delivery on orders over $150
          </span>
          <span className="hidden md:inline text-stone-400">•</span>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 font-medium text-white hover:text-brand-300 underline underline-offset-4 transition-colors"
          >
            Explore Sale
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-stone-400 hover:text-stone-100 p-1 rounded-md transition-colors shrink-0"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

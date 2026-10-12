import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Compass, ArrowRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mx-auto mb-6">
          <Compass className="w-10 h-10 text-brand-700 animate-spin-slow" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700 bg-brand-50 px-3 py-1 rounded-full">
          Error 404
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-4 mb-2">
          Page Not Found
        </h1>

        <p className="text-stone-500 text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-sm mx-auto">
          The curated page, category, or product you requested may have moved or is no longer part of our active catalog.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/products" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full">
              <span>Explore Catalog</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

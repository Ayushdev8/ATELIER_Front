'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local store state queries with data fetched from your backend catalog API.

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { categories } from '@/data/categories';
import HeroSection from '@/components/home/HeroSection';
import PromoBanner from '@/components/home/PromoBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryCard from '@/components/products/CategoryCard';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';

export default function HomePage() {
  const { products } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Curated Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
              Department Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
              Curated Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>Browse All ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={featuredProducts} />
      </section>

      {/* 4. Promotional Banner */}
      <PromoBanner />

      {/* 5. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Just Landed</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
                New Arrivals
              </h2>
            </div>
          </div>
          <Link
            href="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>Explore All New</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={newArrivals} />
      </section>

      {/* 6. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-700">
              <Flame className="w-3.5 h-3.5" />
              <span>Most Coveted</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
              Client Favorites &amp; Best Sellers
            </h2>
          </div>
          <Link
            href="/products?sort=popularity"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>See Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} />
      </section>

      {/* 7. Testimonials */}
      <TestimonialsSection />
    </div>
  );
}

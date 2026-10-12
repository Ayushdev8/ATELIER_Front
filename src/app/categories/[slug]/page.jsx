'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this local category retrieval with your dynamic category API: GET /api/categories/:slug

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { categories } from '@/data/categories';
import { useStore } from '@/context/StoreContext';
import ProductGrid from '@/components/products/ProductGrid';
import SortDropdown from '@/components/products/SortDropdown';
import SearchInput from '@/components/products/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import { calculateDiscountedPrice } from '@/utils/calculateDiscount';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const { products } = useStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const category = categories.find((c) => c.slug === slug);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    return products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase());
  }, [products, category]);

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((item) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        return item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [categoryProducts, search]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort(
          (a, b) =>
            calculateDiscountedPrice(a.price, a.discountPercentage) -
            calculateDiscountedPrice(b.price, b.discountPercentage)
        );
      case 'price-desc':
        return list.sort(
          (a, b) =>
            calculateDiscountedPrice(b.price, b.discountPercentage) -
            calculateDiscountedPrice(a.price, a.discountPercentage)
        );
      case 'newest':
        return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'popularity':
        return list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'featured':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Category Not Found"
          description="The department you are looking for does not exist or may have been renamed."
          actionText="Return to All Products"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Collections</span>
      </Link>

      {/* Hero Category Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-soft-lg mb-12 h-64 sm:h-80 bg-stone-900">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent" />
        <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-end max-w-2xl text-white">
          <div className="inline-flex items-center gap-1.5 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Department</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            {category.name}
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm mt-3 font-light leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:max-w-xs">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={`Search within ${category.name}...`}
          />
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
          <p className="text-xs text-stone-500 font-medium">
            <span className="font-bold text-stone-900">{sortedProducts.length}</span> pieces found
          </p>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Category Products Grid */}
      <ProductGrid
        products={sortedProducts}
        emptyTitle={`No items found in ${category.name}`}
        emptyDescription="We currently do not have products matching your search query in this department."
      />
    </div>
  );
}

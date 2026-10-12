'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this dummy product filtering and sorting logic with server-side query parameters and your search API.

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductGrid from '@/components/products/ProductGrid';
import ProductFilters from '@/components/products/ProductFilters';
import SortDropdown from '@/components/products/SortDropdown';
import SearchInput from '@/components/products/SearchInput';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { calculateDiscountedPrice } from '@/utils/calculateDiscount';
import { SlidersHorizontal, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const { products } = useStore();

  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialSale = searchParams.get('sale') === 'true';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [saleOnly, setSaleOnly] = useState(initialSale);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialSort);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  // Filter products locally
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory && !matchesDesc) return false;
      }

      // 2. Category
      if (selectedCategory && item.category !== selectedCategory) {
        return false;
      }

      // 3. Price range (calculated based on effective price)
      const effectivePrice = calculateDiscountedPrice(item.price, item.discountPercentage);
      if (effectivePrice < priceRange[0] || effectivePrice > priceRange[1]) {
        return false;
      }

      // 4. Rating
      if (minRating > 0 && (item.rating || 0) < minRating) {
        return false;
      }

      // 5. Sale only
      if (saleOnly && (!item.discountPercentage || item.discountPercentage <= 0)) {
        return false;
      }

      // 6. In stock only
      if (inStockOnly && (!item.stock || item.stock <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, search, selectedCategory, priceRange, minRating, saleOnly, inStockOnly]);

  // Sort filtered products
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

  const displayedProducts = sortedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < sortedProducts.length;

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setPriceRange([0, 500]);
    setMinRating(0);
    setSaleOnly(false);
    setInStockOnly(false);
    setSortBy('featured');
    setVisibleCount(12);
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (saleOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header & Title */}
      <div className="mb-8">
        <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
          Curated Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 mt-1">
          {selectedCategory || 'All Products'}
        </h1>
        <p className="text-stone-500 text-sm mt-2 max-w-xl font-light">
          Explore our complete selection of artisanal apparel, accessories, acoustics, and lifestyle objects.
        </p>
      </div>

      {/* Search and Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-soft-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="w-full md:w-auto flex items-center justify-between md:justify-end gap-3">
          {/* Mobile Filter Drawer Trigger */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-stone-900 text-white text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <SortDropdown value={sortBy} onChange={setSortBy} />
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-soft-sm sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-900">
              Filter By
            </h3>
            {activeFilterCount > 0 && (
              <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                {activeFilterCount} active
              </span>
            )}
          </div>

          <ProductFilters
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            minRating={minRating}
            onRatingChange={setMinRating}
            saleOnly={saleOnly}
            onSaleOnlyToggle={setSaleOnly}
            inStockOnly={inStockOnly}
            onInStockToggle={setInStockOnly}
            onResetFilters={handleResetFilters}
          />
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6 text-xs text-stone-500 font-medium">
            <p>
              Showing <span className="font-bold text-stone-900">{displayedProducts.length}</span> of{' '}
              <span className="font-bold text-stone-900">{sortedProducts.length}</span> products
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-brand-700 hover:underline font-semibold"
              >
                Clear all filters
              </button>
            )}
          </div>

          <ProductGrid
            products={displayedProducts}
            emptyTitle="No matching products"
            emptyDescription="We couldn't find any products matching your active filters. Try broadening your price range or clearing selected categories."
          />

          {/* Load More Pagination */}
          {hasMore && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-8 shadow-soft-sm"
              >
                Load More Pieces ({sortedProducts.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-slide-down">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
                <h3 className="font-serif text-lg font-bold text-stone-900">Catalog Filters</h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onRatingChange={setMinRating}
                saleOnly={saleOnly}
                onSaleOnlyToggle={setSaleOnly}
                inStockOnly={inStockOnly}
                onInStockToggle={setInStockOnly}
                onResetFilters={handleResetFilters}
              />
            </div>

            <div className="pt-6 border-t border-stone-100 mt-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full"
              >
                Apply Filters ({sortedProducts.length} Results)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" message="Loading product catalog..." />}>
      <ProductsContent />
    </Suspense>
  );
}

'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local wishlist state with user wishlist API endpoint: GET /api/wishlist

import React from 'react';
import Link from 'next/link';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatCurrency';
import { calculateDiscountedPrice, hasValidDiscount } from '@/utils/calculateDiscount';
import DiscountBadge from '@/components/ui/DiscountBadge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistPage() {
  const { items, isInitialized, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (!isInitialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <LoadingSpinner size="lg" message="Loading saved pieces..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="You haven't saved any items to your wishlist yet. Tap the heart icon on any product to keep track of items you admire."
          actionText="Explore Collections"
          actionHref="/products"
        />
      </div>
    );
  }

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-stone-200/80 gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
            Personal Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
            Saved Wishlist ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="text-xs font-semibold text-stone-600 hover:text-stone-900"
          >
            Browse More
          </Link>
          <button
            onClick={clearWishlist}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wishlist</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((product) => {
          const isDiscounted = hasValidDiscount(product.price, product.discountPercentage);
          const finalPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
          const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200/80 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                <Link href={`/products/${product.id}`} className="block w-full h-full">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                {isDiscounted && (
                  <div className="absolute top-3 left-3 z-10">
                    <DiscountBadge discountPercentage={product.discountPercentage} size="sm" />
                  </div>
                )}

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 text-stone-400 hover:text-rose-600 shadow-sm transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Meta */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {product.category}
                  </span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-serif text-sm font-bold text-stone-900 hover:text-brand-700 transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-base font-bold text-stone-900 font-sans">
                      {formatCurrency(finalPrice)}
                    </span>
                    {isDiscounted && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart Action */}
                <div className="pt-4 mt-4 border-t border-stone-100">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleMoveToCart(product)}
                    className="w-full text-xs font-semibold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                    <span>Move to Bag</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

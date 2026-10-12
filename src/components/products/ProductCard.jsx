'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { calculateDiscountedPrice, hasValidDiscount } from '@/utils/calculateDiscount';
import { formatCurrency } from '@/utils/formatCurrency';
import DiscountBadge from '@/components/ui/DiscountBadge';
import { Heart, ShoppingBag, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const isDiscounted = hasValidDiscount(product.price, product.discountPercentage);
  const finalPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop';
  const secondaryImage = product.images?.[1] || mainImage;

  return (
    <div className="group relative bg-white rounded-2xl border border-stone-200/70 shadow-soft-sm hover:shadow-soft transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Top-Left: Discount Badge */}
        {isDiscounted && (
          <div className="absolute top-3 left-3 z-10">
            <DiscountBadge discountPercentage={product.discountPercentage} size="sm" />
          </div>
        )}

        {/* Top-Right: Status Tags and Wishlist Toggle */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
          {product.isNew && (
            <span className="bg-stone-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="bg-amber-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Popular
            </span>
          )}
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-all duration-200 ${
              inWishlist
                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                : 'bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-white'
            }`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick Add Overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className="w-full bg-stone-900/95 hover:bg-stone-950 backdrop-blur-sm text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>{product.category}</span>
            {product.rating && (
              <span className="flex items-center gap-1 text-stone-700">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
              </span>
            )}
          </div>

          <Link href={`/products/${product.id}`} className="group-hover:text-brand-700 transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 line-clamp-1 mb-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-stone-900 font-sans">
              {formatCurrency(finalPrice)}
            </span>
            {isDiscounted && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Mobile direct Add button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

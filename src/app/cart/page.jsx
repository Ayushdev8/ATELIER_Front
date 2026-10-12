'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local cart state and operations with your user cart endpoint: GET /api/cart, POST /api/cart/items

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import CartItem from '@/components/cart/CartItem';
import OrderSummary from '@/components/cart/OrderSummary';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, isInitialized, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isInitialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <LoadingSpinner size="lg" message="Loading your shopping bag..." />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Bag is Empty"
          description="You haven't added any pieces to your bag yet. Explore our latest arrivals or seasonal promotions to begin."
          actionText="Discover New Arrivals"
          actionHref="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-stone-200/80 gap-4 mb-8">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
            Review Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
            Shopping Bag ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Bag</span>
          </button>
        </div>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-7 xl:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm">
          <div className="divide-y divide-stone-100">
            {items.map((item) => (
              <CartItem
                key={item.cartItemId}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Prices include applicable local taxes.</span>
            <Link href="/products" className="font-semibold text-brand-700 hover:underline">
              Add more items
            </Link>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}

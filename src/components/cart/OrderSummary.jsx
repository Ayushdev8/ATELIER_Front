'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { formatCurrency } from '@/utils/formatCurrency';
import Button from '@/components/ui/Button';
import { ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export default function OrderSummary({ showCheckoutButton = true }) {
  const {
    totalItems,
    originalSubtotal,
    discountedSubtotal,
    discountSavings,
    shippingFee,
    finalTotal,
    freeShippingThreshold,
  } = useCart();

  const differenceForFreeShipping = Math.max(0, freeShippingThreshold - discountedSubtotal);
  const freeShippingProgress = Math.min(100, Math.round((discountedSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-soft-sm sticky top-28">
      <h3 className="font-serif text-xl font-bold text-stone-950 pb-4 border-b border-stone-100">
        Order Summary
      </h3>

      {/* Free shipping progress notification */}
      <div className="py-4 border-b border-stone-100">
        {differenceForFreeShipping === 0 ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>You've unlocked complimentary express shipping!</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
              <span>Add <strong className="text-stone-900">{formatCurrency(differenceForFreeShipping)}</strong> for free shipping</span>
              <span>{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-700 transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Line item amounts */}
      <div className="py-4 space-y-3 text-xs text-stone-600 border-b border-stone-100">
        <div className="flex justify-between">
          <span>Subtotal ({totalItems} items)</span>
          <span className="font-semibold text-stone-900 font-sans">
            {formatCurrency(originalSubtotal)}
          </span>
        </div>

        {discountSavings > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span>Promotional Discounts</span>
            <span>-{formatCurrency(discountSavings)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Estimated Delivery</span>
          <span>
            {shippingFee === 0 ? (
              <strong className="text-emerald-700 uppercase tracking-wider text-[11px]">Free</strong>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>
      </div>

      {/* Final Total */}
      <div className="py-5 flex items-baseline justify-between">
        <div>
          <span className="text-base font-bold text-stone-950 font-serif">Estimated Total</span>
          <p className="text-[10px] text-stone-400">Includes applicable demo taxes</p>
        </div>
        <span className="text-2xl font-extrabold text-stone-950 font-sans">
          {formatCurrency(finalTotal)}
        </span>
      </div>

      {/* Checkout button */}
      {showCheckoutButton && (
        <div className="mt-2 space-y-3">
          <Link href="/checkout" className="block w-full">
            <Button variant="primary" size="lg" className="w-full shadow-md">
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
            <span>Guaranteed Safe &amp; Encrypted Checkout</span>
          </div>
        </div>
      )}
    </div>
  );
}

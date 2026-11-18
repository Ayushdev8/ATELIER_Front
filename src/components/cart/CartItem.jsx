'use client';

import React from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/utils/formatCurrency';
import { Trash2, AlertCircle } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  if (!item) return null;

  const isDiscounted = (item.baseMrp - item.unitPrice) > 0;
  const isAtMaxStock = item.quantity >= item.stock;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 border-b border-stone-200/80">
      {/* Product Image & Details */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          href={`/products/${item.slug}`}
          className="relative aspect-square w-20 sm:w-24 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0"
        >
          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
        </Link>

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
            {item.category}
          </span>
          <Link href={`/products/${item.slug}`} className="hover:text-brand-700 transition-colors">
            <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900">
              {item.productName}
            </h3>
          </Link>

          {/* Variants */}
          <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
            {item.size && <span>Size: <strong className="text-stone-800">{item.size}</strong></span>}
            {item.color && <span>Color: <strong className="text-stone-800">{item.color}</strong></span>}
          </div>

          {/* Unit price */}
          <div className="flex items-baseline gap-2 mt-1.5">
            <span className="text-sm font-bold text-stone-900 font-sans">
              {formatCurrency(item.unitPrice)}
            </span>
            {isDiscounted && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(item.baseMrp)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quantity & Item Subtotal */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-soft-sm">
            <button
              onClick={() => onUpdateQuantity(item.variantId, item.quantity - 1)}
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold text-stone-900 select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.variantId, item.quantity + 1)}
              disabled={isAtMaxStock}
              className="px-3 py-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {isAtMaxStock && (
            <span className="text-[10px] text-amber-600 mt-1 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Max stock
            </span>
          )}
        </div>

        {/* Total for this line item */}
        <div className="text-right min-w-[80px]">
          <p className="text-sm sm:text-base font-bold text-stone-950 font-sans">
            {formatCurrency(item.subtotal)}
          </p>
          {isDiscounted && (
            <p className="text-[11px] text-emerald-700 font-medium">
              Save {formatCurrency((item.baseMrp - item.unitPrice) * item.quantity)}
            </p>
          )}
        </div>

        {/* Delete item */}
        <button
          onClick={() => onRemove(item.variantId)}
          className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Remove item from bag"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

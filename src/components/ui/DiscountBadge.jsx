import React from 'react';

/**
 * Reusable discount percentage badge.
 * Renders only when a valid discount (> 0 and <= 100) is present.
 */
export default function DiscountBadge({ discountPercentage, size = 'default', className = '' }) {
  const discount = Number(discountPercentage);

  if (!Number.isFinite(discount) || discount <= 0 || discount > 100) {
    return null;
  }

  const rounded = Math.round(discount);

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-bold tracking-wider',
    default: 'text-xs px-2.5 py-1 font-bold tracking-wider',
    lg: 'text-sm px-3.5 py-1.5 font-extrabold tracking-wider',
  };

  return (
    <span
      className={`inline-flex items-center uppercase rounded-full bg-brand-700 text-white shadow-sm ${
        sizeClasses[size] || sizeClasses.default
      } ${className}`}
    >
      {rounded}% OFF
    </span>
  );
}

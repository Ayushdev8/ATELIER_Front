'use client';

import React from 'react';
import ProductCard from './ProductCard';
import EmptyState from '@/components/ui/EmptyState';

export default function ProductGrid({
  products = [],
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your search criteria or removing active filters.',
  className = '',
}) {
  if (!products || products.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText="Explore All Products"
        actionHref="/products"
      />
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 ${className}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

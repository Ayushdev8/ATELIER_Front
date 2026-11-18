'use client';

export default function ProductGridSkeleton({ count = 12 }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
      aria-label="Loading products"
      aria-busy="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-stone-200/70 shadow-sm overflow-hidden animate-pulse"
        >
          {/* Product image placeholder */}
          <div className="aspect-square w-full bg-stone-200" />

          {/* Product details placeholder */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="h-3 w-20 rounded bg-stone-200" />
              <div className="h-3 w-12 rounded bg-stone-200" />
            </div>

            <div className="h-4 w-4/5 rounded bg-stone-200" />

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <div className="h-5 w-24 rounded bg-stone-200" />
              <div className="h-9 w-9 rounded-xl bg-stone-200" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
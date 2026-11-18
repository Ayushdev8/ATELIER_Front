
export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex gap-3 mb-8">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-3 bg-gray-200 rounded" />
        <div className="h-3 w-24 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left: Product Images */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-gray-200"
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 h-[350px] sm:h-[480px] lg:h-[550px] rounded-2xl bg-gray-200" />
        </div>

        {/* Right: Product Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* Brand */}
          <div className="h-4 w-24 bg-gray-200 rounded" />

          {/* Product Title */}
          <div className="space-y-3">
            <div className="h-7 w-full bg-gray-200 rounded" />
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
          </div>

          {/* Rating */}
          <div className="h-4 w-36 bg-gray-200 rounded" />

          {/* Price */}
          <div className="flex items-center gap-4">
            <div className="h-9 w-32 bg-gray-200 rounded" />
            <div className="h-5 w-20 bg-gray-200 rounded" />
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </div>

          <div className="h-px bg-gray-200" />

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-2/3 bg-gray-200 rounded" />
          </div>

          <div className="h-px bg-gray-200" />

          {/* Variant Selection */}
          <div className="space-y-4">
            <div className="h-5 w-28 bg-gray-200 rounded" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-10 w-10 rounded-full bg-gray-200" />
              ))}
            </div>

            <div className="h-5 w-24 bg-gray-200 rounded mt-5" />
            <div className="flex gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-10 w-16 rounded-lg bg-gray-200" />
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          {/* Quantity */}
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-11 w-32 bg-gray-200 rounded-lg" />

          {/* Action Buttons */}
          <div className="flex gap-4">
            <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
            <div className="h-12 flex-1 bg-gray-200 rounded-xl" />
          </div>

          {/* Delivery Information */}
          <div className="space-y-3 pt-4">
            <div className="h-4 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-40 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

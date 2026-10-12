'use client';

// FUTURE BACKEND INTEGRATION:
// Replace this dummy product retrieval with your single product endpoint: GET /api/products/:id

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { calculateDiscountedPrice, calculateSavings, hasValidDiscount } from '@/utils/calculateDiscount';
import { formatCurrency } from '@/utils/formatCurrency';
import DiscountBadge from '@/components/ui/DiscountBadge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ProductCard from '@/components/products/ProductCard';
import { sampleReviews } from '@/data/reviews';
import {
  Heart,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ArrowLeft,
  Check,
  Package,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params?.id);
  const { products } = useStore();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = useMemo(() => {
    return products.find((p) => p.id === productId);
  }, [products, productId]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Product Not Found"
          description="The item you are searching for does not exist in our catalog or may have been retired."
          actionText="Explore Current Catalog"
          actionHref="/products"
        />
      </div>
    );
  }

  const isDiscounted = hasValidDiscount(product.price, product.discountPercentage);
  const finalPrice = calculateDiscountedPrice(product.price, product.discountPercentage);
  const savings = calculateSavings(product.price, product.discountPercentage);
  const inWishlist = isInWishlist(product.id);

  const images = product.images?.length ? product.images : [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop'
  ];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize || product.sizes?.[0], selectedColor || product.colors?.[0]);
  };

  const handleQuantityDec = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleQuantityInc = () => {
    if (quantity < (product.stock || 99)) {
      setQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-stone-900 transition-colors">Catalog</Link>
        <span>/</span>
        <Link
          href={`/categories/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
          className="hover:text-stone-900 transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-20">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-24 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative aspect-square w-16 sm:w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-stone-100 ${
                    activeImageIndex === idx ? 'border-brand-700 ring-2 ring-brand-700/20' : 'border-stone-200 hover:border-stone-400'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Main Display Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-soft-sm">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Top-Left Discount Badge */}
            {isDiscounted && (
              <div className="absolute top-4 left-4 z-10">
                <DiscountBadge discountPercentage={product.discountPercentage} size="default" />
              </div>
            )}

            {/* Wishlist Button floating on main image */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 z-10 p-3 rounded-full backdrop-blur-md shadow-md transition-all ${
                inWishlist
                  ? 'bg-rose-50 text-rose-600'
                  : 'bg-white/90 text-stone-700 hover:text-stone-950 hover:bg-white'
              }`}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Product Meta & Purchase Panel */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="pb-6 border-b border-stone-200/80">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-700">
              {product.category}
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-950 mt-1 mb-3">
              {product.name}
            </h1>

            {/* Rating and SKU */}
            <div className="flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(product.rating || 5)
                          ? 'fill-current'
                          : 'fill-stone-200 text-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-stone-800">{product.rating || 4.8}</span>
                <span className="text-stone-400">({product.reviewCount || 42} client reviews)</span>
              </div>
              {product.sku && <span className="font-mono text-[11px]">SKU: {product.sku}</span>}
            </div>

            {/* Price Display */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-stone-950 font-sans">
                {formatCurrency(finalPrice)}
              </span>
              {isDiscounted && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                    Save {formatCurrency(savings)} ({Math.round(product.discountPercentage)}% Off)
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b border-stone-200/80">
            <p className="text-stone-600 text-sm leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          {/* Variants and Quantity */}
          <div className="py-6 border-b border-stone-200/80 space-y-6">
            {/* Color variants */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800 mb-2.5">
                  Colorway: <span className="text-brand-800 font-semibold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color;
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                    Select Size: <span className="text-brand-800 font-semibold">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-stone-500 hover:text-stone-900 cursor-pointer underline">
                    Size Guide
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Stock Availability */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                  Quantity
                </label>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {product.stock > 5 ? (
                    <span className="text-emerald-700">In Stock ({product.stock} available)</span>
                  ) : product.stock > 0 ? (
                    <span className="text-amber-700 font-bold">Only {product.stock} units remaining!</span>
                  ) : (
                    <span className="text-rose-600">Currently Sold Out</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-soft-sm">
                  <button
                    onClick={handleQuantityDec}
                    disabled={quantity <= 1}
                    className="px-3.5 py-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-stone-900 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={handleQuantityInc}
                    disabled={quantity >= (product.stock || 1)}
                    className="px-3.5 py-2.5 text-stone-600 hover:text-stone-900 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Add to Cart Action */}
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  <span>Add to Bag • {formatCurrency(finalPrice * quantity)}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Value Props & Shipping details */}
          <div className="pt-6 space-y-3.5 text-xs text-stone-600">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-brand-700 shrink-0" />
              <span>Complimentary insured shipping on orders over $150</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-brand-700 shrink-0" />
              <span>30-day effortless returns and exchanges in original packaging</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-brand-700 shrink-0" />
              <span>Two-year warranty &amp; artisanal authenticity certificate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Reviews Accordion / Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-soft-sm mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div>
            <h3 className="font-serif text-2xl font-bold text-stone-950">
              Verified Client Reviews ({product.reviewCount || 42})
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Average {product.rating || 4.8} out of 5 stars based on verified purchases.
            </p>
          </div>
          <Button variant="outline" size="sm">
            Write a Review
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          {sampleReviews.map((rev) => (
            <div key={rev.id} className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-serif italic mb-4">
                  "{rev.comment}"
                </p>
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-3 border-t border-stone-200/60">
                <span className="font-semibold text-stone-900">{rev.author}</span>
                <span className="text-emerald-700 font-medium">Verified Shopper</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-700">
                Coordinated Styling
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-950 mt-1">
                You May Also Admire
              </h2>
            </div>
            <Link
              href={`/categories/${product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className="text-xs font-semibold text-stone-800 hover:text-brand-700"
            >
              More in {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

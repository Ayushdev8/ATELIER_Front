'use client';

// FUTURE BACKEND INTEGRATION:
// Replace local store state queries with data fetched from your backend catalog API.

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { categories } from '@/data/categories';
import HeroSection from '@/components/home/HeroSection';
import PromoBanner from '@/components/home/PromoBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ProductGrid from '@/components/products/ProductGrid';
import CategoryCard from '@/components/products/CategoryCard';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import api from '@/service/api';

export default function HomePage() {
  const { products,loading,setLoading,error,setError,getProduct } = useStore();
  // const[products , setProducts] = useState([]);
  // const[loading , setLoading] = useState(false);
  // const [error, setError] = useState("");

  // const getProduct = async ()=>{
  //   setLoading(true);
  //     try{
  //       const res= await api.get("/public/products");
  //       console.log(res.data);
  //       const data = res.data;
  //       const productList = Array.isArray(data)
  //           ? data
  //           : Array.isArray(data.content)
  //             ? data.content
  //             : Array.isArray(data.data)
  //               ? data.data
  //               : [];
  //       setProducts(productList);
  //     }catch(err){
  //       console.log(err.response?.data?.message ||err.response?.data ||err.messagee);
  //       setError("Unable to load products. Please try again.");
  //     }finally{
  //       setLoading(false);
  //     }
  // }
  // useEffect(()=>{
  //   getProduct();

  // },[])
  

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const newArrivals = products.filter((p) => p.new).slice(0, 6);
  // const bestSellers = products.filter((p) => p.estSeller).slice(0, 6);
 

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Curated Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
              Department Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-brand-700">
              Curated Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
              Featured Creations
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>Browse All ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductLoading />
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-red-600 mb-3">{error}</p>
            <button
              onClick={getProduct}
              className="rounded-lg bg-stone-900 px-5 py-2 text-white hover:bg-stone-700"
            >
              Try Again
            </button>
          </div>
        ) : featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <p className="py-8 text-center text-stone-500">
            No featured products available.
          </p>
        )}
      </section>

      {/* 4. Promotional Banner */}
      <PromoBanner />

      {/* 5. New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Just Landed</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
                New Arrivals
              </h2>
            </div>
          </div>
          <Link
            href="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>Explore All New</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductLoading />
        ) : error ? null : newArrivals.length > 0 ? (
          <ProductGrid products={newArrivals} />
        ) : (
          <p className="py-8 text-center text-stone-500">
            No new arrivals available.
          </p>
        )}
      </section>

      {/* 6. Best Sellers Section */}
      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-700">
              <Flame className="w-3.5 h-3.5" />
              <span>Most Coveted</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-950 mt-1">
              Client Favorites &amp; Best Sellers
            </h2>
          </div>
          <Link
            href="/products?sort=popularity"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-brand-700 transition-colors"
          >
            <span>See Best Sellers</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <ProductLoading />
        ) : error ? null : bestSellers.length > 0 ? (
          <ProductGrid products={bestSellers} />
        ) : (
          <p className="py-8 text-center text-stone-500">
            No best sellers available.
          </p>
        )}
      </section> */}

      {/* 7. Testimonials */}
      <TestimonialsSection />
    </div>
  );
}

// Simple skeleton loading effect
function ProductLoading() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="animate-pulse space-y-3"
        >
          <div className="aspect-[3/4] rounded-xl bg-stone-200" />
          <div className="h-4 w-3/4 rounded bg-stone-200" />
          <div className="h-4 w-1/2 rounded bg-stone-200" />
        </div>
      ))}
    </div>
  );
}

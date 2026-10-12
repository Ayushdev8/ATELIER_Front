'use client';

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#FBF9F5] pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 border border-brand-200/60 text-brand-900 text-xs font-semibold tracking-wide mb-6">
              <Sparkles className="w-3.5 h-3.5 text-brand-700" />
              <span>Autumn/Winter 2026 Ready-to-Wear</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 tracking-tight leading-[1.1] mb-6">
              Tactile Luxury. <br />
              <span className="italic font-normal text-brand-800">Mindful Craft.</span> <br />
              Enduring Form.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed mb-8 font-light">
              Discover honest materials and thoughtful tailoring. From organic French flax linen to handcrafted footwear and acoustic audio essentials.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <Link href="/products">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-md">
                  <span>Shop The Capsule</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/categories/mens-fashion">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <span>Explore Lookbook</span>
                </Button>
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="flex items-center gap-8 pt-6 border-t border-stone-200/80 text-xs text-stone-500">
              <div>
                <p className="font-serif text-xl font-bold text-stone-900">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-stone-500">Traceable Fibers</p>
              </div>
              <div className="w-px h-8 bg-stone-200" />
              <div>
                <p className="font-serif text-xl font-bold text-stone-900">4.9 / 5</p>
                <p className="text-[11px] uppercase tracking-wider text-stone-500">Client Rating</p>
              </div>
              <div className="w-px h-8 bg-stone-200" />
              <div>
                <p className="font-serif text-xl font-bold text-stone-900">30 Days</p>
                <p className="text-[11px] uppercase tracking-wider text-stone-500">Complimentary Return</p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] border border-stone-200/80 bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1000&auto=format&fit=crop"
                  alt="Editorial menswear model"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
              </div>

              {/* Floating promotional badge card */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-soft-lg border border-stone-100 max-w-[240px] animate-slide-down">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">
                    -35%
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Featured Offer</p>
                    <p className="text-xs font-bold text-stone-900 font-serif">Minimal Chronograph</p>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  Sapphire crystal &amp; Italian leather strap.
                </p>
              </div>

              {/* Secondary Floating Accent */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-stone-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400" />
                <span className="text-xs font-semibold">Artisanal Studio Batch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="my-16 sm:my-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-2xl">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop"
            alt="Promotional Fashion Editorial"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/80 border border-brand-700 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Limited Archival Event</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Mid-Season Archives: <br />
            Up to <span className="text-brand-400 italic">50% Off</span> Select Items
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-light">
            Take advantage of exclusive markdowns on timeless outerwear, premium leather accessories, and acoustic electronics. No code required at checkout.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/products?sale=true">
              <Button variant="accent" size="lg">
                <span>Shop The Sale</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/categories/womens-fashion">
              <Button variant="outline" size="lg" className="border-stone-700 text-white hover:bg-stone-800">
                <span>View Women's Edit</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
